import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const memberId = parseInt(url.pathname.split('/').pop() || '');
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  // const editDataId = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        verified: true,
        gender: true,
        phoneNumber: true,
        address: true,
        occupation: true,
        education: true,
        birthDate: true,
        birthMonth: true,
        birthYear: true,
        deceased: true,
        deathDate: true,
        deathMonth: true,
        deathYear: true,
        descendant: true,
        partnerId: true,
        fatherId: true,
        motherId: true,
        fatherOf: true,
        motherOf: true,
        nonDescendantRelation: {
          select: {
            id: true,
            fatherName: true,
            motherName: true,
            siblingNames: true,
          },
        },
        pendingVerification: {
            where: {
              id: 1
            },
            select: {
              details: true
            }
          },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const data = {
      formData: {
        id: member.id,
        name: member.name,
        gender: member.gender,
        verified: member.verified,
        pendingVerification: member.pendingVerification?.length,
        birth_date: member.birthDate ? String(member.birthDate).padStart(2, '0') : null,
        birth_month: member.birthMonth ? String(member.birthMonth).padStart(2, '0') : null,
        birth_year: member.birthYear ? String(member.birthYear) : null,
        deceased: member.deceased,
        death_date: member.deathDate ? String(member.deathDate).padStart(2, '0') : null,
        death_month: member.deathMonth ? String(member.deathMonth).padStart(2, '0') : null,
        death_year: member.deathYear ? String(member.deathYear) : null,
        phone_number: member.phoneNumber,
        occupation: member.occupation,
        education: member.education,
        address: member.address,
        descendant: member.descendant ? 'Yes' : 'No',
        father: member.nonDescendantRelation?.[0]?.fatherName,
        mother: member.nonDescendantRelation?.[0]?.motherName,
        siblings: member.nonDescendantRelation?.[0]?.siblingNames,
      },
      changeData: {
        editData: member.pendingVerification
      },
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const memberId = parseInt(url.pathname.split('/').pop() || '', 10);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    if (isNaN(memberId)) {
      return NextResponse.json(
        { error: "Invalid member ID" },
        { status: 400 }
      );
    }
  
    try {
      const decoded = await verifyToken(token);
      const forDescendanceOf = decoded.forDescendanceOf;
  
      if (!forDescendanceOf) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      const {updatedData, editDataId} = await request.json();
  
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return NextResponse.json(
          { error: "No data provided for update" },
          { status: 400 }
        );
      }
  
      const member = await prisma.member.findUnique({
        where: { 
          id: memberId,
          descendantOf: forDescendanceOf 
        },
        select: {
          verified: true
        },
      });
  
      if (!member) {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 }
        );
      }
  
      // If the member is not verified, proceed with the update logic
      const deceased = updatedData.deceased === true;
  
      const memberUpdateData = {
        name: updatedData.name,
        gender: updatedData.gender,
        birthDate: updatedData.birthDate ? parseInt(updatedData.birthDate, 10) : null,
        birthMonth: updatedData.birthMonth ? parseInt(updatedData.birthMonth, 10) : null,
        birthYear: updatedData.birthYear ? parseInt(updatedData.birthYear, 10) : null,
        deceased: deceased,
        deathDate: deceased && updatedData.deathDate ? parseInt(updatedData.deathDate, 10) : null,
        deathMonth: deceased && updatedData.deathMonth ? parseInt(updatedData.deathMonth, 10) : null,
        deathYear: deceased && updatedData.deathYear ? parseInt(updatedData.deathYear, 10) : null,
        phoneNumber: updatedData.phoneNumber,
        occupation: updatedData.occupation || null,
        education: updatedData.education || null,
        address: updatedData.address || null,
        descendant: updatedData.descendant,
      };
  
      const updatedMember = await prisma.member.update({
        where: { id: memberId },
        data: memberUpdateData,
      });
  
      if (updatedData.descendant === false && (updatedData.father || updatedData.mother || updatedData.siblings)) {
        await prisma.nonDescendantRelation.upsert({
          where: { memberId: memberId },
          update: {
            fatherName: updatedData.father || null,
            motherName: updatedData.mother || null,
            siblingNames: updatedData.siblings || null,
          },
          create: {
            memberId: memberId,
            fatherName: updatedData.father || null,
            motherName: updatedData.mother || null,
            siblingNames: updatedData.siblings || null,
          },
        });
      }

      await prisma.requestDetails.delete({
        where: { id: editDataId },
      });
  
      return NextResponse.json({
        success: true,
        message: "Member updated successfully",
        data: updatedMember,
      });
    } catch (error: any) {
      console.error("Error updating member:", error);
  
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const editDataId = parseInt(url.pathname.split('/').pop() || '', 10);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    if (isNaN(editDataId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }
  
    try {
      const decoded = await verifyToken(token);
      const forDescendanceOf = decoded.forDescendanceOf;
  
      if (!forDescendanceOf) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      // Fetch the member with their relationships
      const requestData = await prisma.requestDetails.findUnique({
        where: { 
          id: editDataId,
          descendantOf: forDescendanceOf
        },
        select: {
          type: true
        },
      });
  
      // If the member doesn't exist, return an error
      if (!requestData) {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 }
        );
      }
  
      // Delete the request details
      await prisma.requestDetails.delete({
        where: { id: editDataId },
      });
  
      return NextResponse.json({
        success: true,
        message: "Rejected Edit changes",
      });
    } catch (error: any) {
      console.error("Error deleting member:", error);
  
      // Handle token verification errors
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      if (error.code === "P2025") {
        // Prisma-specific error for "Record not found"
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}  