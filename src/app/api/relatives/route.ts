import { NextResponse } from "next/server"
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchRelativesData } from "@/utils/relativesUtils";
import prisma from "@/db/db";

export async function GET(request: NextRequest) {
  // Extract and validate parameters
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "40", 10)));
  const searchQuery = searchParams.get("search")?.trim() || "";

  let filters: any = {};
  try {
    const rawFilters = searchParams.get("filters");
    if (rawFilters) {
      filters = JSON.parse(rawFilters);
    }
  } catch (e) {
    // Ignore invalid JSON in filters param
  }

  const occupation = Array.isArray(filters.occupation) ? filters.occupation : filters.occupation?.trim() || "";
  const education = Array.isArray(filters.education) ? filters.education : filters.education?.trim() || "";
  const birthPlace = Array.isArray(filters.birthPlace) ? filters.birthPlace : filters.birthPlace?.trim() || "";
  const country = filters.country?.trim() || "";
  const state = filters.state?.trim() || "";
  const district = filters.district?.trim() || "";
  const city = filters.city?.trim() || "";
  const birthYearStart = filters.birthYearStart ? parseInt(filters.birthYearStart, 10) : null;
  const birthYearEnd = filters.birthYearEnd ? parseInt(filters.birthYearEnd, 10) : null;
  const family = Array.isArray(filters.family) ? filters.family.map((id: any) => Number(id)).filter((id: number) => !isNaN(id)) : [];

  // Authentication
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    const userType = decoded.userType;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";
    const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);

    // A non-empty `family` filter narrows the aggregated set down to the chosen families.
    const scopedAuthIds = family.length > 0 ? allAuthIds.filter(id => family.includes(id)) : allAuthIds;

    const { data, totalCount } = await fetchRelativesData(scopedAuthIds, page, limit, searchQuery, {
      occupation,
      education,
      birthPlace,
      country,
      state,
      district,
      city,
      birthYearStart,
      birthYearEnd,
    });

    const mainMemberAuths = await prisma.auth.findMany({
      where: { id: { in: scopedAuthIds } },
      select: { mainMemberId: true },
    });
    const mainMemberIds = mainMemberAuths
      .map(a => a.mainMemberId)
      .filter((id): id is number => id !== null);

    return NextResponse.json({
      data,
      totalCount,
      mainMemberIds,
      _version: updatedAt,
    });
  } catch (error) {
    console.error("Error fetching members:", error);

    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
