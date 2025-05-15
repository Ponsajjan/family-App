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
  const showCousin = searchParams.get("showCousin") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skip = (page - 1) * limit;

  if (page === 1) {
    memberListCurrentLetter = "";
  }

  const excludeIdParam = searchParams.get("excludeId");
  const excludeId = excludeIdParam
    ? excludeIdParam.split(",").map(Number).filter(Boolean)
    : [];

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId;
    
    if (!forDescendanceOf || !mainMemberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let memberList: any[] = [];
    const groupedData: any = [];
    const currentYear = new Date().getFullYear();
    const yearThreshold = currentYear - 18;

    switch (forType) {
      case "selectMember":
        groupedData.length = 0;
        memberList = await prisma.member.findMany({
          where: {
            name: { contains: searchQuery },
            descendantOf: forDescendanceOf
          },
          select: {
            id: true,
            name: true,
            gender: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
            partnerships: {
              select: {
                partner: { select: { name: true } }
              }
            },
            nonDescendantRelation: true,
            order: true
          },
          orderBy: { order: "asc" },
          skip,
          take: limit,
        });
        break;

      case "selectPartner":
        groupedData.length = 0;
        memberList = await prisma.member.findMany({
          where: {
            name: { contains: searchQuery },
            descendantOf: forDescendanceOf,
            gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
            id: { notIn: excludeId },
            descendant: descendant == 'true' ? showCousin : true,
            AND: [
              {
                OR: [
                  { birthYear: { lt: yearThreshold } },
                  { birthYear: null },
                ],
              },
              {
                NOT: {
                  OR: [
                    { partnerships: { some: {} } },
                    { partneredWith: { some: {} } }
                  ]
                }
              }
            ]
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
            order: true
          },
          orderBy: { order: "asc" },
          skip,
          take: limit,
        });
        break;

      case "selectChildren":
        groupedData.length = 0;
        memberList = await prisma.member.findMany({
          where: {
            name: {
              contains: searchQuery,
              // mode: "insensitive", // PostgreSQL-specific support in Prisma
            },
            descendantOf: forDescendanceOf,
            id: { notIn: [...excludeId, mainMemberId] },
            fatherId: null,
            motherId: null,
            descendant: true,
          },
          select: {
            id: true,
            name: true,
            gender: true,
            verified: true,
            birthYear: true,
            partnerships: {
              select: {
                partner: { select: { name: true } }
              }
            },
            order: true
          },
          orderBy: { order: "asc" },
          skip,
          take: limit,
        });
        break;

      case "editRelationship":
        groupedData.length = 0;
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
              { partnerships: { some: {} } },
              { partneredWith: { some: {} } }
            ],
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            partnerships: {
              select: {
                partner: { select: { name: true } }
              }
            },
            order: true
          },
          orderBy: { order: "asc" },
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

    // Flatten partnership data to match old structure
    memberList = memberList.map(member => ({
      ...member,
      partners: member.partnerships?.map((p: {partner: {name:string}}) => p.partner.name)
    }));

    const totalCount = await prisma.member.count({
      where: {
        name: { contains: searchQuery },
        descendantOf: forDescendanceOf,
      },
    });

    memberList.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      if (firstLetter !== memberListCurrentLetter) {
        memberListCurrentLetter = firstLetter;
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partners: null,
        });
      }

      groupedData.push(member);
    });

    return NextResponse.json({
      data: groupedData,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching memberList:", error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching memberList" }, { status: 500 });
  }
}