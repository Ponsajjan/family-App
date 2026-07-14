/** Filter options for relatives search with cascading location filters */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

const OPTIONS_PAGE_SIZE = 25;
const PAGINATED_FIELDS = ["occupation", "education", "birthPlace", "country"] as const;
type PaginatedField = typeof PAGINATED_FIELDS[number];

function sanitizeOptions(arr: (string | null | undefined)[]) {
  const map = new Map<string, string>();
  arr.forEach(s => {
    if (!s) return;
    const trimmed = s.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    // Keep the first one found, but prefer versions that start with an uppercase letter
    if (!map.has(lower) || (trimmed[0] === trimmed[0].toUpperCase() && map.get(lower)![0] !== map.get(lower)![0].toUpperCase())) {
      map.set(lower, trimmed);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = Number(decoded.authId);
    const userType = decoded.userType;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";
    const { allAuthIds } = await getAllAuthIds(authId, userType, selectedAuthId);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "locations") {
      const country = searchParams.get("country");
      if (!country) return NextResponse.json({ states: [], districts: [], cities: [] });
      const [rawStates, rawDistricts, rawCities] = await Promise.all([
        prisma.member.findMany({
          where: { authId: { in: allAuthIds }, country: { equals: country, mode: "insensitive" } },
          select: { state: true },
        }),
        prisma.member.findMany({
          where: { authId: { in: allAuthIds }, country: { equals: country, mode: "insensitive" } },
          select: { state: true, district: true },
        }),
        prisma.member.findMany({
          where: { authId: { in: allAuthIds }, country: { equals: country, mode: "insensitive" } },
          select: { state: true, district: true, city: true },
        }),
      ]);

      const states = sanitizeOptions(rawStates.map((s) => s.state));

      const districtMap = new Map<string, { name: string; state: string }>();
      rawDistricts.forEach(({ district, state }) => {
        if (!district?.trim() || !state?.trim()) return;
        const key = `${district.trim().toLowerCase()}|${state.trim().toLowerCase()}`;
        if (!districtMap.has(key)) districtMap.set(key, { name: district.trim(), state: state.trim() });
      });
      const districts = Array.from(districtMap.values()).sort((a, b) => a.name.localeCompare(b.name));

      const cityMap = new Map<string, { name: string; state: string; district: string }>();
      rawCities.forEach(({ city, state, district }) => {
        if (!city?.trim() || !state?.trim()) return;
        const key = `${city.trim().toLowerCase()}|${state.trim().toLowerCase()}|${(district ?? '').trim().toLowerCase()}`;
        if (!cityMap.has(key)) cityMap.set(key, { name: city.trim(), state: state.trim(), district: (district ?? '').trim() });
      });
      const cities = Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));

      return NextResponse.json({ states, districts, cities });
    }

    if (type === "fieldOptions") {
      const field = searchParams.get("field") as PaginatedField | null;
      if (!field || !PAGINATED_FIELDS.includes(field)) {
        return NextResponse.json({ error: "Invalid field" }, { status: 400 });
      }
      const search = (searchParams.get("search") || "").trim();
      const skip = Math.max(0, parseInt(searchParams.get("skip") || "0", 10) || 0);
      const take = Math.min(100, Math.max(1, parseInt(searchParams.get("take") || String(OPTIONS_PAGE_SIZE), 10) || OPTIONS_PAGE_SIZE));

      const rows = await prisma.member.findMany({
        where: {
          authId: { in: allAuthIds },
          AND: [
            { [field]: { not: null } },
            { [field]: { not: "" } },
            ...(search ? [{ [field]: { contains: search, mode: "insensitive" as const } }] : []),
          ],
        },
        select: { [field]: true },
        distinct: [field],
        orderBy: { [field]: "asc" },
        skip,
        take: take + 1,
      });

      const values = rows.map((r) => (r as any)[field] as string);
      const hasMore = values.length > take;
      const data = values.slice(0, take);
      return NextResponse.json({ data, hasMore });
    }

    if (type === "states") {
      const country = searchParams.get("country");
      if (!country) return NextResponse.json({ data: [] });
      const states = await prisma.member.findMany({
        where: { authId: { in: allAuthIds }, country: { equals: country, mode: "insensitive" } },
        select: { state: true },
      });
      return NextResponse.json({ data: sanitizeOptions(states.map((s) => s.state)) });
    }

    if (type === "districts") {
      const country = searchParams.get("country");
      const state = searchParams.get("state");
      if (!country) return NextResponse.json({ data: [] });
      const districts = await prisma.member.findMany({
        where: {
          authId: { in: allAuthIds },
          country: { equals: country, mode: "insensitive" },
          ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
        },
        select: { district: true },
      });
      return NextResponse.json({ data: sanitizeOptions(districts.map((d) => d.district)) });
    }

    if (type === "cities") {
      const country = searchParams.get("country");
      const state = searchParams.get("state");
      const district = searchParams.get("district");
      if (!country) return NextResponse.json({ data: [] });
      const cities = await prisma.member.findMany({
        where: {
          authId: { in: allAuthIds },
          country: { equals: country, mode: "insensitive" },
          ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
          ...(district ? { district: { equals: district, mode: "insensitive" } } : {}),
        },
        select: { city: true },
      });
      return NextResponse.json({ data: sanitizeOptions(cities.map((c) => c.city)) });
    }

    const excludeLocations = searchParams.get("excludeLocations") === "true";

    if (excludeLocations) {
      const [occupations, educations, birthPlaces, countries] = await Promise.all([
        prisma.member.findMany({
          where: { authId: { in: allAuthIds } },
          select: { occupation: true },
        }),
        prisma.member.findMany({
          where: { authId: { in: allAuthIds } },
          select: { education: true },
        }),
        prisma.member.findMany({
          where: { authId: { in: allAuthIds } },
          select: { birthPlace: true },
        }),
        prisma.member.findMany({
          where: { authId: { in: allAuthIds } },
          select: { country: true },
        }),
      ]);

      const occupationOptions = sanitizeOptions(occupations.map((o) => o.occupation));
      const educationOptions = sanitizeOptions(educations.map((e) => e.education));
      const birthPlaceOptions = sanitizeOptions(birthPlaces.map((b) => b.birthPlace));
      const countryOptions = sanitizeOptions(countries.map((c) => c.country));

      return NextResponse.json({
        occupations: occupationOptions.slice(0, OPTIONS_PAGE_SIZE),
        occupationsHasMore: occupationOptions.length > OPTIONS_PAGE_SIZE,
        educations: educationOptions.slice(0, OPTIONS_PAGE_SIZE),
        educationsHasMore: educationOptions.length > OPTIONS_PAGE_SIZE,
        birthPlaces: birthPlaceOptions.slice(0, OPTIONS_PAGE_SIZE),
        birthPlacesHasMore: birthPlaceOptions.length > OPTIONS_PAGE_SIZE,
        countries: countryOptions.slice(0, OPTIONS_PAGE_SIZE),
        countriesHasMore: countryOptions.length > OPTIONS_PAGE_SIZE,
        states: [],
        districts: [],
        cities: [],
      });
    }

    const [occupations, educations, birthPlaces, countries, states, districts, cities] = await Promise.all([
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { occupation: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { education: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { birthPlace: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { country: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { state: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { district: true },
      }),
      prisma.member.findMany({
        where: { authId: { in: allAuthIds } },
        select: { city: true },
      }),
    ]);

    return NextResponse.json({
      occupations: sanitizeOptions(occupations.map((o) => o.occupation)),
      educations: sanitizeOptions(educations.map((e) => e.education)),
      birthPlaces: sanitizeOptions(birthPlaces.map((b) => b.birthPlace)),
      countries: sanitizeOptions(countries.map((c) => c.country)),
      states: sanitizeOptions(states.map((s) => s.state)),
      districts: sanitizeOptions(districts.map((d) => d.district)),
      cities: sanitizeOptions(cities.map((c) => c.city)),
    });
  } catch (error: any) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      details: error.code || error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
