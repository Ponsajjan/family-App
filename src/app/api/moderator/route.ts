import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from "@/db/db";
import { verifyToken } from '@/utils/auth';
import eventEmitter from '@/utils/events';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let lastState = "";

        const sendUpdate = async () => {
          try {
            const [unverifiedCount, pendingRequestCount, familyTree] = await Promise.all([
              prisma.member.count({
                where: {
                  authId: authId,
                  verified: false,
                },
              }),
              prisma.requestDetails.count({
                where: {
                  authId: authId,
                },
              }),
              prisma.familyTree.findUnique({
                where: { authId: authId },
                select: {
                  status: true,
                  lastBuildStartedAt: true,
                  updatedAt: true
                }
              })
            ]);

            let chartStatus = "not_built";
            if (familyTree) {
              chartStatus = familyTree.status;

              const TIMEOUT_MS = 5 * 60 * 1000;
              if (
                familyTree.status === "building" &&
                familyTree.lastBuildStartedAt &&
                Date.now() - familyTree.lastBuildStartedAt.getTime() > TIMEOUT_MS
              ) {
                chartStatus = "timeout";
              }
            }

            const currentState = JSON.stringify({
              unverifiedMembers: unverifiedCount,
              pendingRequests: pendingRequestCount,
              chartStatus: chartStatus,
              lastBuildStartedAt: familyTree?.lastBuildStartedAt || null,
              updatedAt: familyTree?.updatedAt || null
            });

            if (currentState !== lastState) {
              controller.enqueue(encoder.encode(`data: ${currentState}\n\n`));
              lastState = currentState;
            }
          } catch (error) {
            console.error("Error in SSE sendUpdate:", error);
          }
        };

        // Listen for internal events to trigger update immediately
        const updateListener = () => {
          sendUpdate();
        };
        eventEmitter.on('moderatorUpdate', updateListener);

        // Send initial update
        await sendUpdate();

        // Polling interval as a fallback (every 60 seconds)
        // const interval = setInterval(sendUpdate, 60000);

        request.signal.addEventListener('abort', () => {
          // clearInterval(interval);
          eventEmitter.off('moderatorUpdate', updateListener);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error fetching moderator dashboard data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
