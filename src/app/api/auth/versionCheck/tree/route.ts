import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";

        const { updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);
        
        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const familyTree = await prisma.familyTree.findUnique({
            where: { authId },
            select: { data: true }
        });

        if (!familyTree) {
            return NextResponse.json({ error: "No chart found" }, { status: 404 });
        }

        return NextResponse.json({
            mismatch: true,
            data: {
                treeData: familyTree.data,
                _version: updatedAt
            }
        });
    } catch (error) {
        console.error('Tree Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
