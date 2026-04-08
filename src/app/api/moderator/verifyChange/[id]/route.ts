import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { applyHandleEditRelationship } from "./applyHandleEditRelationship";
import { applyHandleAddRelationship } from "./applyHandleAddRelationship";
import { applyHandleEditMember } from "./applyHandleEditMember";
import { handleEditRelationshipCase } from "./handleEditRelationshipCase";
import { handleAddRelationshipCase } from "./handleAddRelationshipCase";
import { handleEditMemberCase } from "./handleEditMemberCase";
import { revalidatePath } from "next/cache";
import { bumpFamilyUpdateVersion } from "@/utils/syncUtils";

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
    if (!decoded?.authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // First fetch changeData separately
    const changeData = await prisma.requestDetails.findUnique({
      where: { id: requestId },
      select: {
        type: true,
        details: true,
        memberId: true,
        createdAt: true,
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
        additionalInfo: true,
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

import { getModeratorCounts } from "@/utils/moderatorCounts";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const requestId = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;
  const selectedAuthIdsCookie = request.cookies.get("selectedAuthId")?.value || "[]";

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
    const authId = decoded.authId;
    const userType = decoded.userType;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (userType !== "Moderator") {
      return NextResponse.json({ error: "Access denied: Moderator access required" }, { status: 403 });
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
    const member = await prisma.member.findFirst({
      where: {
        id: requestData.memberId,
        authId: authId
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
        "Edit Member": applyHandleEditMember,
        "Add Relationship": applyHandleAddRelationship,
        "Edit Relationship": applyHandleEditRelationship
      };

      const handler = handlers[requestData.type];
      if (!handler) throw new Error("Invalid operation type");

      const result = await handler(requestData, tx);

      // Delete the request only if the operation was successful
      if (result.success === true) {
        await tx.requestDetails.delete({ where: { id: requestId } });
      }

      return result;
    });

    await bumpFamilyUpdateVersion(authId);

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]');
    revalidatePath('/api/relatives/[id]');
    revalidatePath('/tree');

    const counts = await getModeratorCounts(authId, userType, selectedAuthIdsCookie);

    return NextResponse.json({
      ...result,
      moderatorCounts: counts
    });

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
  const selectedAuthIdsCookie = request.cookies.get("selectedAuthId")?.value || "[]";

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
    const authId = decoded.authId;
    const userType = decoded.userType;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (userType !== "Moderator") {
      return NextResponse.json({ error: "Access denied: Moderator access required" }, { status: 403 });
    }

    // Fetch the request with their relationships
    const requestData = await prisma.requestDetails.findFirst({
      where: {
        id: editDataId,
        authId: authId
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

    await bumpFamilyUpdateVersion(authId);

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]');
    revalidatePath('/api/relatives/[id]');
    revalidatePath('/tree');

    const counts = await getModeratorCounts(authId, userType, selectedAuthIdsCookie);

    return NextResponse.json({
      success: true,
      message: `Rejected ${requestData.type}`,
      moderatorCounts: counts
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