import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestId = parseInt(url.pathname.split('/').pop() || '');
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  try {
    const changeData = await prisma.requestDetails.findUnique({
      where: { id: requestId },
      select: {
        details: true,
        memberId: true,
      },
    });

    const member = await prisma.member.findUnique({
      where: { id: changeData?.memberId },
      select: {
        id: true,
        name: true,
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
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const formData = {
      name: member.name,
      gender: member.gender,
      birthDate: member.birthDate ? String(member.birthDate).padStart(2, '0') : null,
      birthMonth: member.birthMonth ? String(member.birthMonth).padStart(2, '0') : null,
      birthYear: member.birthYear ? String(member.birthYear) : null,
      deceased: member.deceased,
      deathDate: member.deathDate ? String(member.deathDate).padStart(2, '0') : null,
      deathMonth: member.deathMonth ? String(member.deathMonth).padStart(2, '0') : null,
      deathYear: member.deathYear ? String(member.deathYear) : null,
      phoneNumber: member.phoneNumber,
      occupation: member.occupation,
      education: member.education,
      address: member.address,
      descendant: member.descendant ? 'Yes' : 'No',
      father: member.nonDescendantRelation?.[0]?.fatherName,
      mother: member.nonDescendantRelation?.[0]?.motherName,
      siblings: member.nonDescendantRelation?.[0]?.siblingNames,
    };

    let changeDetails: any = {};
    try {
      changeDetails = JSON.parse(changeData?.details || '{}');
    } catch (e) {
      console.error('Error parsing change details:', e);
    }

    // Helper function to normalize values for comparison
    const normalizeValue = (value: any, key: string): string => {
      if (value === null || value === undefined) return 'null';
      
      // Handle special cases
      if (key === 'descendant') {
        return (value === true || value === 'Yes') ? 'true' : 'false';
      }
      if (key === 'deceased') {
        return (value === true || value === 'Yes') ? 'true' : 'false';
      }
      
      // Convert numbers to strings
      if (typeof value === 'number') return String(value);
      
      return String(value).trim();
    };

    // Format field names for display
    const formatFieldName = (key: string): string => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    };

    // Generate the comparison HTML
    const changesJsx = Object.entries(formData).map(([key, value]) => {
      const newValue = changeDetails[key] !== undefined ? changeDetails[key] : value;
      
      // Normalize both values for accurate comparison
      const normOriginal = normalizeValue(value, key);
      const normNew = normalizeValue(newValue, key);
      
      const hasChanged = normOriginal !== normNew;
      
      const displayValue = (val: any) => {
        if (val === null || val === undefined) return '-';
        if (key === 'descendant') return val === true || val === 'Yes' ? 'Yes' : 'No';
        if (key === 'deceased') return val === true || val === 'Yes' ? 'Yes' : 'No';
        return String(val);
      };

      return `
        <div class="flex gap-2 items-baseline" key="${key}">
          <p class="whitespace-nowrap font-semibold min-w-[120px]">${formatFieldName(key)}:</p>
          <div class="flex flex-wrap items-center gap-1">
            ${hasChanged ? `<p class="line-through">${displayValue(value)}</p>` : ''}
            <p class="${hasChanged ? 'text-blue-600 font-medium' : ''}">${displayValue(newValue)}</p>
          </div>
        </div>
      `;
    }).join('');

    const htmlContent = `
      <div class="space-y-2 bg-main_background text-text_color">
        ${changesJsx}
      </div>
    `;

    return NextResponse.json({ 
      data: {
        formData,
        changeData: changeDetails,
        htmlContent
      } 
    });
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