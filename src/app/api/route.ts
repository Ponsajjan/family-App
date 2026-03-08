import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

interface Member {
  id: number;
  name: string;
  gender: string;
  verified?: boolean | null;
  birthYear?: number | null;
  father?: { name: string } | null;
  mother?: { name: string } | null;
  partner?: { name: string } | null;
}

interface LetterHeader {
  id: string;
  name: string;
  gender: "Letter";
  father: null;
  mother: null;
  partner: null;
}

export async function GET(request: NextRequest) {
  // Extract and validate parameters
  const { searchParams } = new URL(request.url);
  const searchQueryRaw = searchParams.get("search");
  const searchQuery = searchQueryRaw && searchQueryRaw.trim() !== "" ? searchQueryRaw.trim() : undefined;
  const forType = searchParams.get("for");
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

  // Exclude the member and partner for selectChildren
  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    const mainMemberId = decoded.memberId;

    if (!authId || !mainMemberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Calculate skip with one extra item for letter detection
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;
    const take = page === 1 ? limit : limit + 1;

    // Calculate current year minus 18
    // const getCurrentISTYear = () => {
    //   return new Date().toLocaleString("en-US", {
    //     timeZone: "Asia/Kolkata",
    //     year: "numeric",
    //   });
    // };

    // const currentYear = parseInt(getCurrentISTYear(), 10);
    // const yearThreshold = currentYear - 18;

    let memberList: Member[] = [];
    const groupedData: Array<Member | LetterHeader> = [];

    // Common where clause for all queries
    const baseWhere: any = {
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      }),
      authId: authId,
    };

    switch (forType) {
      case "selectMember":
        memberList = await prisma.member.findMany({
          where: {
            ...baseWhere,
            // AND: {
            //   OR: [
            //     { birthYear: { lt: yearThreshold } }, // Birth year less than current year - 18
            //     { birthYear: null },
            //   ],
            // }
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
          take,
        });
        break;

      case "selectPartner":
        memberList = await prisma.member.findMany({
          where: {
            ...baseWhere,
            gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
            partnerId: null,
            id: { notIn: excludeId },
            descendant: descendant === 'true' ? showCousin : true,
            // AND: {
            //   OR: [
            //     { birthYear: { lt: yearThreshold } }, // Birth year less than current year - 18
            //     { birthYear: null },
            //   ],
            // }
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
          take,
        });
        break;

      case "selectChildren":
        memberList = await prisma.member.findMany({
          where: {
            ...baseWhere,
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
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take,
        });
        break;

      case "editRelationship":
        memberList = await prisma.member.findMany({
          where: {
            ...baseWhere,
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
            father: { select: { name: true } },
            mother: { select: { name: true } },
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take,
        });
        break;

      case "editMember":
        memberList = await prisma.member.findMany({
          where: {
            ...baseWhere,
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
          take,
        });
        break;

      default:
        return NextResponse.json(
          { error: `'${forType}' is not a valid 'for' parameter` },
          { status: 400 }
        );
    }

    // Total count with the same filters
    const countWhere = {
      ...baseWhere,
      // ...(forType === "selectMember" && {
      //   AND: {
      //     OR: [
      //       { birthYear: { lt: yearThreshold } }, // Birth year less than current year - 18
      //       { birthYear: null },
      //     ],
      //   }
      // }),
      ...(forType === "selectPartner" && {
        gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
        partnerId: null,
        id: { notIn: excludeId },
        descendant: descendant === 'true' ? showCousin : undefined,
        // AND: {
        //   OR: [
        //     { birthYear: { lt: yearThreshold } },
        //     { birthYear: null },
        //   ],
        // }
      }),
      ...(forType === "selectChildren" && {
        id: { notIn: [...excludeId, mainMemberId] },
        fatherId: null,
        motherId: null,
        descendant: true,
      }),
      ...(forType === "editRelationship" && {
        OR: [
          { fatherOf: { some: {} } },
          { motherOf: { some: {} } },
          { partnerId: { not: null } },
        ],
      }),
    };

    const totalCount = await prisma.member.count({ where: countWhere });

    // Process the data to add letter headers
    let previousFirstLetter = lastLetterId;

    // For pages after the first, we need to check against the previous item
    if (page > 1 && memberList.length > 0) {
      const previousItem = memberList.shift(); // Remove the extra item
      previousFirstLetter = previousItem!.name.charAt(0).toUpperCase();
    }

    memberList.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      // Add letter header if the letter changed
      if (firstLetter !== previousFirstLetter) {
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          father: null,
          mother: null,
          partner: null,
        });
        previousFirstLetter = firstLetter;
      }

      groupedData.push(member);
    });

    return NextResponse.json({
      data: groupedData,
      totalCount: totalCount + 1,
      mainMemberId: mainMemberId
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
