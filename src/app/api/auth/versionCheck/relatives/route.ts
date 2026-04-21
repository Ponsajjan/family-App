import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchRelativesData } from "@/utils/relativesUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "40", 10)));
    const searchQuery = searchParams.get("search")?.trim() || "";
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";

        const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);
        
        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const { data, totalCount } = await fetchRelativesData(allAuthIds, page, limit, searchQuery);

        return NextResponse.json({
            mismatch: true,
            data: {
                data,
                totalCount,
                _version: updatedAt,
            }
        });
    } catch (error) {
        console.error('Relatives Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

