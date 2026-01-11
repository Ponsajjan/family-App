import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

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

        // Fetch the FamilyTree status
        const familyTree = await prisma.familyTree.findUnique({
            where: { authId: authId },
            select: {
                status: true,
                lastBuildStartedAt: true,
                updatedAt: true
            }
        });

        // If no record exists, consider it as "no data yet"
        if (!familyTree) {
            return NextResponse.json({
                status: "not_built",
                message: "No family tree data found"
            });
        }

        // Check for timeout: if status is "building" and more than 5 minutes old
        const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
        if (
            familyTree.status === "building" &&
            familyTree.lastBuildStartedAt &&
            Date.now() - familyTree.lastBuildStartedAt.getTime() > TIMEOUT_MS
        ) {
            return NextResponse.json({
                status: "timeout",
                message: "Previous build timed out"
            });
        }

        return NextResponse.json({
            status: familyTree.status,
            lastBuildStartedAt: familyTree.lastBuildStartedAt,
            updatedAt: familyTree.updatedAt
        });
    } catch (error) {
        console.error("Error fetching chart status:", error);
        return NextResponse.json(
            { error: "Failed to fetch chart status" },
            { status: 500 }
        );
    }
}
