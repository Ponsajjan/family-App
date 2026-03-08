import { NextResponse } from "next/server"
import prisma from "@/db/db";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

interface Member {
  id: string | number;
  name: string;
  gender: string;
  phoneNumber: string | null;
  father: { name: string } | null;
  mother: { name: string } | null;
  partner: { name: string } | null;
}

interface LetterHeader {
  id: string;
  name: string;
  gender: "Letter";
  phoneNumber: null;
  father: null;
  mother: null;
  partner: null;
}

export async function GET(request: NextRequest) {
  // Extract and validate parameters
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "40", 10)));
  const searchQuery = searchParams.get("search")?.trim() || "";

  // Authentication
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

    const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";
    const allAuthIds = await getAllAuthIds(authId, selectedAuthId);

    // Calculate skip with one extra item for letter detection
    const baseSkip = (page - 1) * limit;
    const skip = page === 1 ? baseSkip : baseSkip - 1;

    // Fetch data with one extra item when needed
    const take = page === 1 ? limit : limit + 1;

    const members = await prisma.member.findMany({
      where: {
        authId: { in: allAuthIds },
        ...(searchQuery && {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }),
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        father: { select: { name: true } },
        mother: { select: { name: true } },
        partner: { select: { name: true } },
      },
      orderBy: { name: "asc" },
      skip,
      take,
    });

    // Total count for pagination
    const totalCount = await prisma.member.count({
      where: {
        authId: { in: allAuthIds },
        ...(searchQuery && {
          name: {
            contains: searchQuery,
          },
        }),
      },
    });

    // Process the data to add letter headers
    const groupedData: Array<Member | LetterHeader> = [];
    let previousFirstLetter = '';

    // For pages after the first, we need to check against the previous item
    if (page > 1 && members.length > 0) {
      const previousItem = members.shift(); // Remove the extra item
      previousFirstLetter = previousItem!.name.charAt(0).toUpperCase();
    }

    members.forEach((member, index) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      // Add letter header if:
      // - It's the first item on the first page, or
      // - The letter changed from the previous member
      if ((page === 1 && index === 0) || (firstLetter !== previousFirstLetter)) {
        groupedData.push({
          id: firstLetter,
          name: firstLetter,
          gender: "Letter",
          phoneNumber: null,
          father: null,
          mother: null,
          partner: null,
        } as LetterHeader);
        previousFirstLetter = firstLetter;
      }

      groupedData.push(member as any);
    });

    return NextResponse.json({
      data: groupedData,
      totalCount: totalCount + 1,
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
