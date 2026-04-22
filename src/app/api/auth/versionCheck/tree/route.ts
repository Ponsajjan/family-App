import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchPrebuiltTree } from "@/utils/treeUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = "";

        const { updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);

        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const treeData = await fetchPrebuiltTree(authId);

        if (!treeData) {
            return NextResponse.json({ error: "No chart found" }, { status: 404 });
        }

        return NextResponse.json({
            mismatch: true,
            data: {
                treeData: treeData,
                _version: updatedAt
            }
        });
    } catch (error) {
        console.error('Tree Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

