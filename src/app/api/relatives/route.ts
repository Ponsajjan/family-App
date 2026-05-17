import { NextResponse } from "next/server"
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchRelativesData } from "@/utils/relativesUtils";

export async function POST(request: NextRequest) {
  // Extract and validate parameters
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "40", 10)));
  const searchQuery = searchParams.get("search")?.trim() || "";

  let filters: any = {};
  try {
    const body = await request.json();
    if (body.filters) {
      filters = body.filters;
    }
  } catch (e) {
    // Ignore invalid JSON body
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

    const { data, totalCount } = await fetchRelativesData(allAuthIds, page, limit, searchQuery, {
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

    return NextResponse.json({
      data,
      totalCount,
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
