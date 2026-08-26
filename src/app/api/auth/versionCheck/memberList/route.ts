import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { fetchMemberListData, MEMBER_LIST_FOR_TYPES, MemberListForType } from "@/utils/memberListUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const searchQueryRaw = searchParams.get("search");
    const searchQuery = searchQueryRaw && searchQueryRaw.trim() !== "" ? searchQueryRaw.trim() : undefined;
    const forType = searchParams.get("for") as MemberListForType | null;
    const gender = searchParams.get("gender");
    const descendant = searchParams.get("descendant");
    const showCousin = searchParams.get("showCousin") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const clientVersion = searchParams.get("version");

    const excludeIdParam = searchParams.get("excludeId");
    const excludeId = excludeIdParam
        ? excludeIdParam.split(",").map(Number).filter(Boolean)
        : [];

    if (!forType || !MEMBER_LIST_FOR_TYPES.includes(forType)) {
        return NextResponse.json(
            { error: `'${forType}' is not a valid 'for' parameter` },
            { status: 400 }
        );
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const mainMemberId = decoded.memberId;

        if (!authId || !mainMemberId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const authRecord = await prisma.auth.findUnique({
            where: { id: authId },
            select: { updatedAt: true },
        });
        const serverVersion = authRecord?.updatedAt.getTime() ?? 0;

        if (clientVersion === String(serverVersion)) {
            return NextResponse.json({ mismatch: false });
        }

        const { data, totalCount } = await fetchMemberListData(authId, mainMemberId, {
            forType,
            gender,
            descendant,
            showCousin,
            excludeId,
            searchQuery,
            page: 1,
            limit,
        });

        return NextResponse.json({
            mismatch: true,
            data: {
                data,
                totalCount,
                mainMemberId,
                _version: serverVersion,
            },
        });
    } catch (error) {
        console.error('Member List Version Check Error:', error);
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
