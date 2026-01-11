import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { fetchFamilyTreeData } from "@/utils/treeUtils";

export async function POST(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let authId: number | undefined;

    try {
        const decoded = await verifyToken(token);
        authId = decoded.authId;
        const userType = decoded.userType;

        if (userType !== "Moderator") {
            return NextResponse.json({ error: "Access denied: Moderator access required" }, { status: 403 });
        }

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Fetch the Auth record to get the mainMemberId
        const authRecord = await prisma.auth.findUnique({
            where: { id: authId },
            select: {
                mainMemberId: true,
                familyTree: {
                    select: {
                        status: true,
                        lastBuildStartedAt: true
                    }
                }
            }
        });

        if (!authRecord || !authRecord.mainMemberId) {
            return NextResponse.json({ error: "Main member not found for this account" }, { status: 404 });
        }

        // Check for existing building status and timeout
        const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
        if (
            authRecord.familyTree?.status === "building" &&
            authRecord.familyTree.lastBuildStartedAt &&
            Date.now() - authRecord.familyTree.lastBuildStartedAt.getTime() < TIMEOUT_MS
        ) {
            return NextResponse.json({
                error: "A chart update is already in progress. Please wait a few minutes."
            }, { status: 409 });
        }

        // Update status to 'building' before starting
        await prisma.familyTree.upsert({
            where: { authId: authId },
            update: {
                status: "building",
                lastBuildStartedAt: new Date()
            },
            create: {
                authId: authId,
                status: "building",
                lastBuildStartedAt: new Date()
            },
        });

        // Generate the family tree JSON and capture any circular relationship conflicts
        const result = await fetchFamilyTreeData([authRecord.mainMemberId]);

        // Store or update the JSON in the FamilyTree table and set status to 'completed'
        await prisma.familyTree.update({
            where: { authId: authId },
            data: {
                data: result.tree as any,
                status: "completed"
            },
        });

        return NextResponse.json({
            message: "Relations chart updated successfully",
            conflicts: result.conflicts
        });
    } catch (error) {
        console.error("Error updating relations chart:", error);

        // Attempt to set status to 'failed' on error using already available authId
        if (authId) {
            try {
                await prisma.familyTree.update({
                    where: { authId: authId },
                    data: { status: "failed" },
                });
            } catch (updateError) {
                console.error("Failed to update status to 'failed':", updateError);
            }
        }

        return NextResponse.json(
            { error: "Failed to update relations chart" },
            { status: 500 }
        );
    }
}
