import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { fetchFamilyTreeData } from "@/utils/treeUtils";

export async function POST(request: NextRequest) {
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

        // Fetch the Auth record to get the mainMemberId
        const authRecord = await prisma.auth.findUnique({
            where: { id: authId },
            select: { mainMemberId: true }
        });

        if (!authRecord || !authRecord.mainMemberId) {
            return NextResponse.json({ error: "Main member not found for this account" }, { status: 404 });
        }

        // Generate the family tree JSON
        const treeData = await fetchFamilyTreeData([authRecord.mainMemberId]);

        // Store or update the JSON in the FamilyTree table
        await prisma.familyTree.upsert({
            where: { authId: authId },
            update: { data: treeData },
            create: { authId: authId, data: treeData },
        });

        return NextResponse.json({ message: "Relations chart updated successfully" });
    } catch (error) {
        console.error("Error updating relations chart:", error);
        return NextResponse.json(
            { error: "Failed to update relations chart" },
            { status: 500 }
        );
    }
}
