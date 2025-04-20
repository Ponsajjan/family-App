import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestId = parseInt(url.pathname.split('/').pop() || '');
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

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
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Helper functions for different request types
async function handleEditMemberCase(member: any, changeData: any) {
  const formData = {
    name: member.name,
    gender: member.gender,
    birthDate: member.birthDate?.toString().padStart(2, '0') ?? null,
    birthMonth: member.birthMonth?.toString().padStart(2, '0') ?? null,
    birthYear: member.birthYear?.toString() ?? null,
    deceased: member.deceased,
    deathDate: member.deathDate?.toString().padStart(2, '0') ?? null,
    deathMonth: member.deathMonth?.toString().padStart(2, '0') ?? null,
    deathYear: member.deathYear?.toString() ?? null,
    phoneNumber: member.phoneNumber,
    occupation: member.occupation,
    education: member.education,
    address: member.address,
    descendant: member.descendant ? 'Yes' : 'No',
    father: member.nonDescendantRelation?.[0]?.fatherName,
    mother: member.nonDescendantRelation?.[0]?.motherName,
    siblings: member.nonDescendantRelation?.[0]?.siblingNames,
  };

  let changeDetails:any = {};
  try {
    changeDetails = JSON.parse(changeData?.details || '{}');
  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  const changesJsx = Object.entries(formData).map(([key, value]) => {
    const newValue = changeDetails[key] ?? value;
    const hasChanged = normalizeValue(value, key) !== normalizeValue(newValue, key);

    return `
      <div class="flex gap-2" key="${key}">
        <p class="whitespace-nowrap font-semibold min-w-[130px]">${formatFieldName(key)}</p>
        <div class="flex flex-wrap items-center gap-1">
          ${hasChanged ? `<p class="line-through">${displayValue(value, key)}</p>` : ''}
          <p class="${hasChanged ? 'text-blue-600 font-medium' : ''}">${displayValue(newValue, key)}</p>
        </div>
      </div>
    `;
  }).join('');

  return NextResponse.json({ 
    data: {
      submitData: {
        memberId: changeData.memberId,
        type: changeData.type,
        formData: { ...formData, ...changeDetails },
      },
      htmlContent: `<div class="space-y-2 bg-main_background text-text_color">
      <div class="italic mb-4">---- ${changeData.type} ----</div>
      ${changesJsx}
      </div>`
    },
  });
}

interface ChildRelation {
  id: number;
  order: number;
}

interface RelationshipDetails {
  partnerId?: number;
  motherOf?: ChildRelation[];
  fatherOf?: ChildRelation[];
}

async function handleAddRelationshipCase(member: any, changeData: any) {
  // Get current relationships with proper typing
  const currentRelationships = await prisma.member.findUnique({
    where: { id: member.id },
    select: {
      partnerId: true,
      fatherOf: { select: { id: true, name: true, order: true } },
      motherOf: { select: { id: true, name: true, order: true } },
    },
  });

  const changeDetails: {
    member: string | null;
    partner?: { name: string | null; isNew: boolean };
    children?: { 
      all: {id: number, name: string, order: number}[];  // All children (existing + new)
      newIds: number[];                   // IDs of new children only
    };
  } = { member: member.name };

  const details: RelationshipDetails = JSON.parse(changeData?.details || '{}');
  
  if (!details.partnerId && !details.motherOf?.length && !details.fatherOf?.length) {
    return NextResponse.json(
      { error: "No valid relationship changes found in request" },
      { status: 400 }
    );
  }

  try {
    // Process partner changes
    if (details.partnerId) {
      const partner = await prisma.member.findUnique({
        where: { id: details.partnerId },
        select: { name: true }
      });
      
      changeDetails.partner = {
        name: partner?.name ?? null,
        isNew: details.partnerId !== currentRelationships?.partnerId
      };
    }

    // Process children changes
    const currentChildren = [
      ...(currentRelationships?.fatherOf || []),
      ...(currentRelationships?.motherOf || [])
    ].map(c => ({ id: c.id, name: c.name, order: c.order }));

    const newChildrenIds: number[] = [];
    const allChildren = [...currentChildren];

    // Process relationship updates with order preservation
    const processUpdates = async (relations: ChildRelation[] | undefined) => {
      if (!relations) return;

      for (const {id, order} of relations) {
        const existingIndex = allChildren.findIndex(c => c.id === id);
        
        if (existingIndex >= 0) {
          // Update order for existing child
          allChildren[existingIndex].order = order;
        } else {
          // Add new child
          newChildrenIds.push(id);
          const child = await prisma.member.findUnique({
            where: { id },
            select: { name: true }
          });
          allChildren.push({ 
            id, 
            name: child?.name || `Unknown (${id})`,
            order 
          });
        }
      }
    };

    await processUpdates(details.motherOf);
    await processUpdates(details.fatherOf);

    if (allChildren.length > 0) {
      changeDetails.children = {
        all: allChildren.sort((a, b) => a.order - b.order), // Sort by order
        newIds: newChildrenIds
      };
    }

  } catch (error) {
    console.error('Error processing relationships:', error);
    return NextResponse.json(
      { error: "Failed to process relationship changes" },
      { status: 500 }
    );
  }

  // Generate HTML response
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="italic mb-4">---- ${changeData.type} ----</div>
      
      <div class="flex gap-2">
        <p class="font-semibold min-w-[90px]">Member</p>
        <p>${changeDetails.member}</p>
      </div>
      
      ${changeDetails.partner ? `
        <div class="flex gap-2">
          <p class="font-semibold min-w-[90px]">Partner</p>
          <p class="${changeDetails.partner.isNew ? 'text-blue-600 font-medium' : ''}">
            ${changeDetails.partner.name || '-'}
          </p>
        </div>
      ` : ''}
      
      ${changeDetails.children ? `
        <div class="flex gap-2">
          <p class="font-semibold min-w-[90px]">Children</p>
          <div class="flex flex-col gap-1">
            ${changeDetails.children.all.map((child, index) => `
              <span class="${changeDetails.children!.newIds.includes(child.id) ? 'text-blue-600 font-medium' : ''}">
                ${index + 1}. ${child.name}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  return NextResponse.json({ 
    data: {
      submitData: {
        memberId: changeData.memberId,
        type: changeData.type,
        formData: details,
      },
      htmlContent
    }
  });
}

interface EditRelationshipDetails {
  deleteData?: {
    partnerId?: number | null;
    childrenId?: number[];
  };
  hasPartner?: number;
  childrenOrder?: Array<{
    id: number;
    name: string;
    verified: boolean;
    order: number;
  }>;
}

async function handleEditRelationshipCase(member: any, changeData: any) {
  // First get current relationships
  const currentRelationships = await prisma.member.findUnique({
    where: { id: member.id },
    select: {
      partnerId: true,
      fatherOf: { select: { id: true, name: true, order: true } },
      motherOf: { select: { id: true, name: true, order: true } },
    },
  });

  // Define the type for children data
  type ChildrenData = {
    all: { id: number; name: string; currentOrder?: number; newOrder?: number }[];
    removedIds: number[];
    reorderedIds: number[];
  };

  const changeDetails: {
    member: string | null;
    partner?: { name: string | null; isRemoved: boolean };
    children?: ChildrenData;
  } = { member: member.name };

  const details: EditRelationshipDetails = JSON.parse(changeData?.details || '{}');

  if (!details.deleteData && !details.hasPartner && !details.childrenOrder) {
    return NextResponse.json(
      { error: "No valid relationship changes found in request" },
      { status: 400 }
    );
  }

  try {  
    // Handle partner changes
    const currentPartnerId = currentRelationships?.partnerId;
    const newPartnerId = details.hasPartner;
    const isRemovingPartner = details.deleteData?.partnerId;

    if (isRemovingPartner && currentPartnerId) {
      // Partner is being removed (deleteData.partnerId exists)
      const currentPartner = await prisma.member.findUnique({
        where: { id: currentPartnerId },
        select: { name: true }
      });
      
      changeDetails.partner = {
        name: currentPartner?.name ?? null,
        isRemoved: true
      };
    } else if (newPartnerId) {
      // Partner is not being changed (hasPartner exists)
      const partner = await prisma.member.findUnique({
        where: { id: newPartnerId },
        select: { name: true }
      });
      
      changeDetails.partner = {
        name: partner?.name ?? null,
        isRemoved: false
      };
    }

    // Process children changes
    const currentChildren = [
      ...(currentRelationships?.fatherOf || []),
      ...(currentRelationships?.motherOf || [])
    ];

    const childrenData: ChildrenData = {
      all: currentChildren.map(child => ({
        id: child.id,
        name: child.name || `Unknown (${child.id})`,
        currentOrder: child.order
      })),
      removedIds: details.deleteData?.childrenId || [],
      reorderedIds: []
    };

    // Check if children order has actually changed
    if (details.childrenOrder) {
      const currentOrder = currentChildren
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(c => c.id);
      
      const newOrder = details.childrenOrder.map(c => c.id);
      
      // Only consider it a reorder if the sequence has changed
      if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) {
        const newOrders = new Map<number, number>();
        details.childrenOrder.forEach((child, index) => {
          newOrders.set(child.id, index + 1);
        });

        childrenData.all.forEach(child => {
          if (newOrders.has(child.id)) {
            child.newOrder = newOrders.get(child.id);
            childrenData.reorderedIds.push(child.id);
          }
        });
      }
    }

    // Only add children to changeDetails if there are any
    if (childrenData.all.length > 0) {
      changeDetails.children = childrenData;
    }

  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  // Determine what changes exist
  const hasOrderChanges = changeDetails.children?.reorderedIds && changeDetails.children?.reorderedIds.length > 0;
  const hasRemovedChildren = changeDetails.children?.removedIds && changeDetails.children?.removedIds.length > 0;
  const hasPartnerChanges = changeDetails.partner;
  const hasAnyChanges = hasPartnerChanges || hasOrderChanges || hasRemovedChildren;

  // Generate HTML
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="italic mb-4">---- ${changeData.type} ----</div>
      <div class="flex gap-2">
        <p class="whitespace-nowrap font-semibold min-w-[90px]">Member</p>
        <p>${changeDetails.member || '-'}</p>
      </div>
      
      ${hasPartnerChanges ? `
        <div class="flex gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[90px]">Partner</p>
          <p> <span class="${changeDetails.partner?.isRemoved ? 'line-through' : ''} whitespace-nowrap">
            ${changeDetails.partner?.name || '-'}</span>
            <span class="text-blue-600 font-medium">${changeDetails.partner?.isRemoved ? ' (Removed)' : ''}</span>
          </p>
        </div>
      ` : ''}
      
      ${changeDetails.children ? `
        <div class="flex gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[90px]">Children</p>
          
          ${hasAnyChanges ? `
            <div class="flex flex-col gap-2">
              ${hasOrderChanges ? `
                <div>
                  <p class="font-semibold">New Order:</p>
                  <div class="flex flex-col gap-1 pl-4 mt-1">
                    ${changeDetails.children.all
                      .filter(child => changeDetails.children?.reorderedIds.includes(child.id))
                      .sort((a, b) => (a.newOrder || 0) - (b.newOrder || 0))
                      .map(child => `
                        <div class="flex gap-1 items-center">
                          <span class="whitespace-nowrap">${child.newOrder}. ${child.name}</span>
                          <span class="text-blue-600 font-medium">
                            ${child.newOrder !== child.currentOrder ? `(Moved from ${child.currentOrder})` : ''}
                          </span>
                        </div>
                      `).join('')}
                    ${changeDetails.children.all
                      .filter(child => !changeDetails.children?.reorderedIds.includes(child.id) && 
                                      !changeDetails.children?.removedIds.includes(child.id))
                      .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
                      .map(child => `
                        <div class="flex gap-1 items-center">
                          <span>${child.currentOrder}. ${child.name}</span>
                        </div>
                      `).join('')}
                  </div>
                </div>
              ` : `
                <div class="flex flex-col gap-1">
                  ${changeDetails.children.all
                    .filter(child => !changeDetails.children?.removedIds.includes(child.id))
                    .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
                    .map(child => `
                      <div class="flex gap-1 items-center">
                        <span>${child.currentOrder}. ${child.name}</span>
                      </div>
                    `).join('')}
                </div>
              `}
              
              ${hasRemovedChildren ? `
                <div>
                  <p class="font-semibold">Removed Children:</p>
                  <div class="flex flex-col gap-1 pl-4 mt-1">
                    ${changeDetails.children.all
                      .filter(child => changeDetails.children?.removedIds.includes(child.id))
                      .map((child, index) => `
                        <div class="flex gap-1 items-center">
                          <span>${index + 1}.</span>
                          <span class="line-through whitespace-nowrap">
                             ${child.name}
                          </span>
                          <span class="text-blue-600 font-medium"> (Removed order ${child.currentOrder})</span>
                        </div>
                      `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="flex flex-col gap-1">
              ${changeDetails.children.all
                .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
                .map(child => `
                  <div class="flex gap-1 items-center">
                    <span>${child.currentOrder}. ${child.name}</span>
                  </div>
                `).join('')}
            </div>
          `}
        </div>
      ` : `
        <div class="text-gray-500">No children relationships to display</div>
      `}
    </div>
  `;

  return NextResponse.json({ 
    data: {
      submitData: {
        memberId: changeData.memberId,
        type: changeData.type,
        formData: details
      },
      htmlContent
    },
  });
}

// Utility functions
function normalizeValue(value: any, key: string): string {
  if (value == null) return 'null';
  if (key === 'descendant' || key === 'deceased') {
    return (value === true || value === 'Yes') ? 'true' : 'false';
  }
  return String(value).trim();
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

function displayValue(val: any, key: string): string {
  if (val == null) return '-';
  if (key === 'descendant' || key === 'deceased') {
    return val === true || val === 'Yes' ? 'Yes' : 'No';
  }
  return String(val);
}

// Type definitions
interface MemberUpdateData {
  name: string;
  gender?: string;
  birthDate?: string | null;
  birthMonth?: string | null;
  birthYear?: string | null;
  deceased: boolean;
  deathDate?: string | null;
  deathMonth?: string | null;
  deathYear?: string | null;
  phoneNumber?: string;
  occupation?: string | null;
  education?: string | null;
  address?: string | null;
  descendant: string;
  father?: string;
  mother?: string;
  siblings?: string;
}

interface RelationshipData {
  partnerId?: number;
  fatherOf?: { connect: { id: number }[] };
  motherOf?: { connect: { id: number }[] };
}

interface RequestData {
  formData: {
    deleteData?: {
      partnerId?: number | null;
      childrenId?: number[];
    };
    hasPartner?: number | null;
    childrenOrder?: Array<{
      id: number;
      name: string;
      verified: boolean;
      order: number;
    }>;
  };
  memberId: number;
  type: "Edit Member" | "Add Relationship" | "Edit Relationship";
}

// Handler functions
const handleEditMember = async (data: RequestData, tx: any) => {
  const formData = data.formData as MemberUpdateData;
  const deceased = formData.deceased === true;

  const memberUpdateData = {
    name: formData.name,
    gender: formData.gender,
    birthDate: formData.birthDate ? parseInt(formData.birthDate) : null,
    birthMonth: formData.birthMonth ? parseInt(formData.birthMonth) : null,
    birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
    deceased,
    deathDate: deceased && formData.deathDate ? parseInt(formData.deathDate) : null,
    deathMonth: deceased && formData.deathMonth ? parseInt(formData.deathMonth) : null,
    deathYear: deceased && formData.deathYear ? parseInt(formData.deathYear) : null,
    phoneNumber: formData.phoneNumber,
    occupation: formData.occupation || null,
    education: formData.education || null,
    address: formData.address || null,
    descendant: formData.descendant == 'Yes',
  };

  await tx.member.update({
    where: { id: data.memberId },
    data: memberUpdateData,
  });

  if (
    formData.descendant === 'No' &&
    (formData.father || formData.mother || formData.siblings)
  ) {
    await tx.nonDescendantRelation.upsert({
      where: { memberId: data.memberId },
      update: {
        fatherName: formData.father || null,
        motherName: formData.mother || null,
        siblingNames: formData.siblings || null,
      },
      create: {
        memberId: data.memberId,
        fatherName: formData.father || null,
        motherName: formData.mother || null,
        siblingNames: formData.siblings || null,
      },
    });
  }

  return {
    success: true,
    message: "Successfully Updated Member Edit",
  };
};

const handleAddRelationship = async (data: RequestData, tx: any) => {
  const formData = data.formData as RelationshipData;
  const updatedMember = await tx.member.update({
    where: { id: data.memberId },
    data: formData,
  });

  // Batch update children order
  if (formData.fatherOf?.connect || formData.motherOf?.connect) {
    const childrenIds = [
      ...(formData.fatherOf?.connect?.map(c => c.id) || []),
      ...(formData.motherOf?.connect?.map(c => c.id) || []),
    ];

    await tx.member.updateMany({
      where: { id: { in: childrenIds } },
      data: { order: { increment: 1 } },
    });
  }

  // Update partner relationships
  if (formData.partnerId) {
    const partnerUpdateData: Partial<RelationshipData> = { 
      partnerId: data.memberId 
    };

    if (formData.fatherOf) {
      partnerUpdateData.motherOf = formData.fatherOf;
    }

    if (formData.motherOf) {
      partnerUpdateData.fatherOf = formData.motherOf;
    }

    await tx.member.update({
      where: { id: formData.partnerId },
      data: partnerUpdateData,
    });
  }

  return {
    success: true,
    message: "Successfully Added Relationship",
    data: updatedMember,
  };
};

const handleEditRelationship = async (data: RequestData, tx: any) => {
  const updatePromises: Promise<any>[] = [];

  // Handle partner removal
  if (data.formData.deleteData?.partnerId) {
    updatePromises.push(
      tx.member.update({ 
        where: { id: data.formData.deleteData.partnerId }, 
        data: { partnerId: null } 
      }),
      tx.member.update({ 
        where: { id: data.memberId }, 
        data: { partnerId: null } 
      })
    );
  }

  // Handle children removal
  if (data.formData.deleteData?.childrenId?.length) {
    const removeChildRelation = Array.from(new Set(data.formData.deleteData.childrenId));

    updatePromises.push(
      tx.member.update({
        where: { id: data.memberId },
        data: {
          fatherOf: { disconnect: removeChildRelation.map(id => ({ id })) },
          motherOf: { disconnect: removeChildRelation.map(id => ({ id })) },
        },
      })
    );

    if (data.formData.hasPartner) {
      updatePromises.push(
        tx.member.update({
          where: { id: data.formData.hasPartner },
          data: {
            fatherOf: { disconnect: removeChildRelation.map(id => ({ id })) },
            motherOf: { disconnect: removeChildRelation.map(id => ({ id })) },
          },
        })
      );
    }
  }

  // Handle children order updates
  if (data.formData.childrenOrder?.length) {
    updatePromises.push(
      ...data.formData.childrenOrder.map((child, index) =>
        tx.member.update({ 
          where: { id: child.id }, 
          data: { order: index + 1 } 
        })
      )
    );
  }

  await Promise.all(updatePromises);

  return {
    success: true,
    message: "Successfully Edited Relationship",
  };
};

// Main PUT handler
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const requestId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
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
      const handlers = {
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

    return NextResponse.json(
      { error: error.message || "Internal server error" },
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