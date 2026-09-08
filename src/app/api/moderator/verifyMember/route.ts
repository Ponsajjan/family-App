import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { fetchPrioritizedMembers } from "@/utils/searchUtils";

export async function GET(request: NextRequest) {
  // Extract search parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size
  const searchQuery = searchParams.get("search") || ""; // Search term
  const filterQuery = searchParams.get("filter") || "";
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

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Define the filter condition
    const filterCondition = filterQuery === 'Verified' ? true : filterQuery === 'Unverified' ? false : undefined;

    // `name` is left out here — the prioritized fetch below applies the search
    // filter itself so it can paginate across the "starts with" / "contains" groups.
    const where = {
      authId: authId,
      ...(filterCondition !== undefined && { verified: filterCondition }),
    };

    const select = {
      id: true,
      name: true,
      gender: true,
      verified: true,
      father: { select: { name: true } },
      mother: { select: { name: true } },
      partner: { select: { name: true } },
    };

    // Total count for pagination, using the same filters plus the search term
    const totalCountPromise = prisma.member.count({
      where: {
        ...where,
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    });

    // Prioritize names that start with `searchQuery` ahead of names that merely
    // contain it, paginating at the DB level across that boundary — otherwise a
    // page fetched purely by `createdAt` over all "contains" matches can come
    // back with none of the "starts with" matches at all, burying/dropping them.
    const memberList = await fetchPrioritizedMembers(where, select, { createdAt: 'desc' }, searchQuery, skip, limit);

    const totalCount = await totalCountPromise;

    const auth = await prisma.auth.findUnique({
      where: { id: authId },
      select: { mainMemberId: true },
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: memberList,
      totalCount,
      mainMemberId: auth?.mainMemberId ?? null,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching members" }, { status: 500 });
  }
}