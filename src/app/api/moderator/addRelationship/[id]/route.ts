import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

let memberListCurrentLetter = "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
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

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;
    const mainMemberId = decoded.memberId
    if (!forDescendanceOf || !mainMemberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    let memberList: any[] = [];
    const groupedData:any = [];

    groupedData.length = 0; // Clear the grouped data
    memberList = await prisma.member.findMany({
      where: {
        name: {
          contains: searchQuery,
          // mode: "insensitive", // PostgreSQL-specific support in Prisma
        },
        descendantOf: forDescendanceOf,
        id: { notIn: excludeId },
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

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1]; // Extract the token part after "Bearer"

  // If no token is found, return an unauthorized response
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure valid memberId
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updatedData = await request.json(); // Parse the JSON body

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 });
    }

    // Update the member in the database
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updatedData,
    });

    // Function to update the order of children
    const updateChildrenOrder = async (childrenIds: { id: number }[]) => {
      for (let i = 0; i < childrenIds.length; i++) {
        const childId = childrenIds[i].id;
        await prisma.member.update({
          where: { id: childId },
          data: {
            order: i + 1, // Update the order based on the sequence
          },
        });
      }
    };

    // Handle updating the partner's relationships and children's order
    if (updatedData.partnerId) {
      const partnerUpdateData: any = {};

      partnerUpdateData.partnerId = memberId;
      if (updatedData.fatherOf) {
        partnerUpdateData.motherOf = updatedData.fatherOf;
        await updateChildrenOrder(updatedData.fatherOf.connect);
      }

      if (updatedData.motherOf) {
        partnerUpdateData.fatherOf = updatedData.motherOf;
        await updateChildrenOrder(updatedData.motherOf.connect);
      }

      if (Object.keys(partnerUpdateData).length > 0) {
        await prisma.member.update({
          where: { id: updatedData.partnerId },
          data: partnerUpdateData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    console.error("Error updating member:", error);

    // Handle token verification errors
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error.code === "P2025") {
      // Prisma-specific error for "Record not found"
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}