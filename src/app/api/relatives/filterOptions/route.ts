/** Filter options for relatives search with cascading location filters */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

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
      if (!country || !state) return NextResponse.json({ data: [] });
      const districts = await prisma.member.findMany({
        where: {
          authId: { in: allAuthIds },
          country: { equals: country, mode: "insensitive" },
          state: { equals: state, mode: "insensitive" },
        },
        select: { district: true },
      });
      return NextResponse.json({ data: sanitizeOptions(districts.map((d) => d.district)) });
    }

    if (type === "cities") {
      const country = searchParams.get("country");
      const state = searchParams.get("state");
      const district = searchParams.get("district");
      if (!country || !state || !district) return NextResponse.json({ data: [] });
      const cities = await prisma.member.findMany({
        where: {
          authId: { in: allAuthIds },
          country: { equals: country, mode: "insensitive" },
          state: { equals: state, mode: "insensitive" },
          district: { equals: district, mode: "insensitive" },
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

      return NextResponse.json({
        occupations: sanitizeOptions(occupations.map((o) => o.occupation)),
        educations: sanitizeOptions(educations.map((e) => e.education)),
        birthPlaces: sanitizeOptions(birthPlaces.map((b) => b.birthPlace)),
        countries: sanitizeOptions(countries.map((c) => c.country)),
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
