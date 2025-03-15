import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

let memberListCurrentLetter = "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const forType = searchParams.get("for");
  const gender = searchParams.get("gender");
  const descendant = searchParams.get("descendant");
  const showCousin = searchParams.get("showCousin") === "true"; // Parse to boolean
  const page = parseInt(searchParams.get("page") || "1", 10); // Current page
  const limit = parseInt(searchParams.get("limit") || "50", 10); // Page size
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  if (page === 1) {
    memberListCurrentLetter = "";
  }
  // Parse excludeId to a number array
  const excludeIdParam = searchParams.get("excludeId");
  const excludeId = excludeIdParam
    ? excludeIdParam.split(",").map(Number).filter(Boolean)
    : [];
  // Exclude the member for selectPartner
  // Exclude the member and partner for selectChildren
  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    let memberList: any[] = [];
    const groupedData:any = [];

    // Calculate current year minus 18
    const currentYear = new Date().getFullYear();
    const yearThreshold = currentYear - 18;

    switch (forType) {
      case "selectMember":
        groupedData.length = 0; // Clear the grouped data
        memberList = await prisma.member.findMany({
          where: {
            name: {
              contains: searchQuery,
              // mode: "insensitive", // PostgreSQL-specific support in Prisma
            },
            descendantOf: forDescendanceOf
          },
          select: {
            id: true,
            name: true,
            gender: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take: limit,
        });
        break;

      case "selectPartner":
        groupedData.length = 0; // Clear the grouped data
        memberList = await prisma.member.findMany({
          where: {
            name: {
              contains: searchQuery,
              // mode: "insensitive", // PostgreSQL-specific support in Prisma
            },
            descendantOf: forDescendanceOf,
            gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
            partnerId: null,
            id: { notIn: excludeId },
            descendant: descendant ? showCousin : false,
            AND: {
              OR: [
                { birthYear: { lt: yearThreshold } }, // Birth year less than current year - 18
                { birthYear: null },
              ],
            }
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take: limit,
        });
        break;

      case "selectChildren":
        groupedData.length = 0; // Clear the grouped data
        memberList = await prisma.member.findMany({
          where: {
            name: {
              contains: searchQuery,
              // mode: "insensitive", // PostgreSQL-specific support in Prisma
            },
            descendantOf: forDescendanceOf,
            id: { notIn: excludeId },
            fatherId: null,
            motherId: null,
            descendant: true,
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take: limit,
        });
        break;

      case "editRelationship":
        groupedData.length = 0; // Clear the grouped data
        memberList = await prisma.member.findMany({
          where: {
            name: {
              contains: searchQuery,
              // mode: "insensitive", // PostgreSQL-specific support in Prisma
            },
            descendantOf: forDescendanceOf,
            OR: [
              { fatherOf: { some: {} } },
              { motherOf: { some: {} } },
              { partnerId: { not: null } },
            ],
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take: limit,
        });
        break;

      default:
        console.warn("Invalid 'forType' parameter:", forType);
        return NextResponse.json(
          { error: `'${forType}' is not a valid 'for' parameter` },
          { status: 400 }
        );
    }

    // Total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        name: { contains: searchQuery },
      },
    });

    // Add starting letter headers to the paginated data
    memberList.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      // If this is a new starting letter, add a header entry
      if (firstLetter !== memberListCurrentLetter) {
        memberListCurrentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partner: null,
        });
      }

      // Add the current member to the grouped data
      groupedData.push(member);
    });

    // Return paginated data with headers
    return NextResponse.json({
      data: groupedData,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching memberList:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching memberList" }, { status: 500 });
  }
}
