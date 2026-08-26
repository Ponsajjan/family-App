import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { fetchMemberListData, MEMBER_LIST_FOR_TYPES, MemberListForType } from "@/utils/memberListUtils";

export async function GET(request: NextRequest) {
  // Extract and validate parameters
  const { searchParams } = new URL(request.url);
  const searchQueryRaw = searchParams.get("search");
  const searchQuery = searchQueryRaw && searchQueryRaw.trim() !== "" ? searchQueryRaw.trim() : undefined;
  const forType = searchParams.get("for") as MemberListForType | null;
  const gender = searchParams.get("gender");
  const descendant = searchParams.get("descendant");
  const showCousin = searchParams.get("showCousin") === "true"; // Parse to boolean
  const page = parseInt(searchParams.get("page") || "1"); // Current page
  const limit = parseInt(searchParams.get("limit") || "50"); // Page size
  const lastLetterId = searchParams.get("lastLetterId") || "";

  // Authentication
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse excludeId to a number array
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

  // Exclude the member and partner for selectChildren
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
    const version = authRecord?.updatedAt.getTime() ?? 0;

    const { data, totalCount } = await fetchMemberListData(authId, mainMemberId, {
      forType,
      gender,
      descendant,
      showCousin,
      excludeId,
      searchQuery,
      page,
      limit,
      lastLetterId,
    });

    return NextResponse.json({
      data,
      totalCount,
      mainMemberId: mainMemberId,
      _version: version,
    });
  } catch (error) {
    console.error("Error fetching memberList:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
