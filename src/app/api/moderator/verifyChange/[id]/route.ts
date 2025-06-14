import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { handleEditRelationship } from "./applyHandleEditRelationship";
import { handleAddRelationship } from "./applyHandleAddRelationship";
import { handleEditMember } from "./applyHandleEditMember";
import { handleEditRelationshipCase } from "./handleEditRelationship";
import { handleAddRelationshipCase } from "./handleAddRelationship";
import { handleEditMemberCase } from "./handleEditMember";

interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Member" | "Add Relationship" | "Edit Relationship";
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const requestId = parseInt(url.pathname.split('/').pop() || '');
    const token = request.cookies.get("token")?.value;

    // Validation checks
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    const decoded = await verifyToken(token);
    if (!decoded?.forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // First fetch changeData separately
    const changeData = await prisma.requestDetails.findUnique({
      where: { id: requestId },
      select: {
        type: true,
        details: true,
        memberId: true,
      },
    });

    if (!changeData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Then fetch member data
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
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (changeData?.type === "Edit Member") {
      return handleEditMemberCase(member, changeData);
    }

    if (changeData?.type === "Add Relationship") {
      return handleAddRelationshipCase(member, changeData);
    }

    if (changeData?.type === "Edit Relationship") {
      return handleEditRelationshipCase(member, changeData);
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

  } catch (error) {
    console.error("Error in GET request:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const requestId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;
  
  // Initial validation
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(requestId)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  try {
    // Authentication
    const decoded = await verifyToken(token);
    const forDescendanceOf = decoded.forDescendanceOf;

    if (decoded.userType !== "moderator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!forDescendanceOf) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Request validation
    const requestData: RequestData = await request.json();

    if (!requestData.formData || !requestData.memberId || !requestData.type) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Verify member exists and belongs to the lineage
    const member = await prisma.member.findUnique({
      where: { 
        id: requestData.memberId,
        descendantOf: forDescendanceOf 
      },
      select: { id: true, verified: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent self-referential relationships
    if ('partnerId' in requestData.formData && 
        requestData.formData.partnerId === requestData.memberId) {
      return NextResponse.json(
        { error: "Cannot set self as partner" },
        { status: 400 }
      );
    }

    // Process request in transaction
    const result = await prisma.$transaction(async (tx) => {
      const handlers: Record<string, any> = {
        "Edit Member": handleEditMember,
        "Add Relationship": handleAddRelationship,
        "Edit Relationship": handleEditRelationship
      };

      const handler = handlers[requestData.type];
      if (!handler) throw new Error("Invalid operation type");

      const result = await handler(requestData, tx);
      
      // Delete the request after successful processing
      await tx.requestDetails.delete({ where: { id: requestId } });
      
      return result;
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in PUT request:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
    const url = new URL(request.url);
    const editDataId = parseInt(url.pathname.split('/').pop() || '', 10);
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  
    if (isNaN(editDataId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }
  
    try {
      const decoded = await verifyToken(token);
      if (decoded.userType !== "moderator") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const forDescendanceOf = decoded.forDescendanceOf;
  
      if (!forDescendanceOf) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
  
      // Fetch the request with their relationships
      const requestData = await prisma.requestDetails.findUnique({
        where: { 
          id: editDataId,
          descendantOf: forDescendanceOf
        },
        select: {
          type: true
        },
      });
  
      // If the request doesn't exist, return an error
      if (!requestData) {
        return NextResponse.json(
          { error: "Request not found" },
          { status: 404 }
        );
      }
  
      // Delete the request details
      await prisma.requestDetails.delete({
        where: { id: editDataId },
      });
  
      return NextResponse.json({
        success: true,
        message: `Rejected ${requestData.type}`,
      });
    } catch (error: any) {
      console.error("Error deleting request:", error);
  
      // Handle token verification errors
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
  
      if (error.code === "P2025") {
        // Prisma-specific error for "Record not found"
        return NextResponse.json(
          { error: "Request not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}