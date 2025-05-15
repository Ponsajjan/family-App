import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

// Type definitions
interface MemberWithRelationships {
  id: number;
  name: string;
  gender: string;
  verified: boolean;
  phoneNumber?: string | null;
  address?: string | null;
  occupation?: string | null;
  education?: string | null;
  birthDate?: number | null;
  birthMonth?: number | null;
  birthYear?: number | null;
  deceased: boolean;
  deathDate?: number | null;
  deathMonth?: number | null;
  deathYear?: number | null;
  descendant: boolean;
  fatherId?: number | null;
  motherId?: number | null;
  partnerships: {
    partner: {
      id: number;
      name: string;
      verified: boolean;
    };
  }[];
  partneredWith: {
    member: {
      id: number;
      name: string;
      verified: boolean;
    };
  }[];
  fatherOf: { id: number; name: string; order: number }[];
  motherOf: { id: number; name: string; order: number }[];
  nonDescendantRelation?: {
    id: number;
    memberId: number;
    fatherName?: string | null;
    motherName?: string | null;
    siblingNames?: string | null;
  }[];
}

interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Member" | "Add Relationship" | "Edit Relationship";
}

interface RelationshipDetails {
  partnerId?: number;
  fatherOf?: { id: number; order: number }[];
  motherOf?: { id: number; order: number }[];
}

interface EditRelationshipDetails {
  deleteData?: {
    partnerId?: number;
    childrenId?: number[];
  };
  hasPartner?: number;
  childrenOrder?: { id: number; order: number }[];
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

// GET endpoint
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

    // Fetch request details
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

    // Fetch member with relationships
    const member = await prisma.member.findUnique({
      where: { id: changeData.memberId },
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
        fatherId: true,
        motherId: true,
        father: { select: { id: true, name: true, verified: true } },
        mother: { select: { id: true, name: true, verified: true } },
        partnerships: {
          include: {
            partner: {
              select: { id: true, name: true, verified: true }
            }
          }
        },
        partneredWith: {
          include: {
            member: {
              select: { id: true, name: true, verified: true }
            }
          }
        },
        fatherOf: { select: { id: true, name: true, order: true } },
        motherOf: { select: { id: true, name: true, order: true } },
        nonDescendantRelation: true,
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Combine partners from both sides
    const allPartners = [
      ...member.partnerships.map(p => p.partner),
      ...member.partneredWith.map(p => p.member)
    ];

    // Route to appropriate handler based on request type
    switch (changeData.type) {
      case "Edit Member":
        return handleEditMemberCase(member, changeData);
      case "Add Relationship":
        return handleAddRelationshipCase(member, changeData, allPartners);
      case "Edit Relationship":
        return handleEditRelationshipCase(member, changeData, allPartners);
      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// PUT endpoint
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

// DELETE endpoint
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const requestId = parseInt(url.pathname.split('/').pop() || '', 10);
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (isNaN(requestId)) {
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

    // Fetch the request to get its type
    const requestData = await prisma.requestDetails.findUnique({
      where: { 
        id: requestId,
        descendantOf: forDescendanceOf
      },
      select: {
        type: true
      },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Delete the request
    await prisma.requestDetails.delete({
      where: { id: requestId },
    });

    return NextResponse.json({
      success: true,
      message: `Rejected ${requestData.type}`,
    });
  } catch (error: any) {
    console.error("Error deleting request:", error);

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    if (error.code === "P2025") {
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

// Handler functions for GET requests
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

  let changeDetails: any = {};
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

async function handleAddRelationshipCase(member: any, changeData: any, allPartners: any[]) {
  const changeDetails: {
    member: string | null;
    partner?: { name: string | null; isNew: boolean };
    children?: { 
      all: {id: number, name: string, order: number}[];
      newIds: number[];
    };
  } = { member: member.name };

  const details: RelationshipDetails = JSON.parse(changeData?.details || '{}');
  
  if (!details.partnerId && !details.motherOf?.length && !details.fatherOf?.length) {
    return NextResponse.json({ 
      data: {
        submitData: {},
        htmlContent: '<div class="text-text_color italic mb-4">---- Invalid add relationship request ----</div>'
      }
    });
  }

  try {
    // Process partner changes
    if (details.partnerId) {
      const partner = allPartners.find(p => p.id === details.partnerId) || 
        await prisma.member.findUnique({
          where: { id: details.partnerId },
          select: { name: true }
        });
      
      changeDetails.partner = {
        name: partner?.name ?? null,
        isNew: !allPartners.some(p => p.id === details.partnerId)
      };
    }

    // Process children changes
    const currentChildren = [
      ...member.fatherOf,
      ...member.motherOf
    ].map(c => ({ id: c.id, name: c.name, order: c.order }));

    const newChildrenIds: number[] = [];
    const allChildren = [...currentChildren];

    // Process relationship updates with order preservation
    const processUpdates = async (relations: {id: number, order: number}[] | undefined) => {
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
        all: allChildren.sort((a, b) => a.order - b.order),
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

async function handleEditRelationshipCase(member: any, changeData: any, allPartners: any[]) {
  const currentRelationships = {
    partners: allPartners,
    fatherOf: member.fatherOf,
    motherOf: member.motherOf
  };

  const changeDetails: {
    member: string | null;
    partner?: { name: string | null; isRemoved: boolean };
    children?: {
      all: { id: number; name: string; currentOrder?: number; newOrder?: number }[];
      removedIds: number[];
      reorderedIds: number[];
    };
  } = { member: member.name };

  const details: EditRelationshipDetails = JSON.parse(changeData?.details || '{}');

  if (!details.deleteData && !details.hasPartner && !details.childrenOrder) {
    return NextResponse.json({ 
      data: {
        submitData: {},
        htmlContent: '<div class="text-text_color italic mb-4">---- Invalid edit relationship request ----</div>'
      }
    });
  }

  try {  
    // Handle partner changes
    const currentPartnerId = currentRelationships.partners[0]?.id;
    const newPartnerId = details.hasPartner;
    const isRemovingPartner = details.deleteData?.partnerId;

    if (isRemovingPartner && currentPartnerId) {
      const currentPartner = currentRelationships.partners.find(p => p.id === currentPartnerId) ||
        await prisma.member.findUnique({
          where: { id: currentPartnerId },
          select: { name: true }
        });
      
      changeDetails.partner = {
        name: currentPartner?.name ?? null,
        isRemoved: true
      };
    } else if (newPartnerId) {
      const partner = currentRelationships.partners.find(p => p.id === newPartnerId) ||
        await prisma.member.findUnique({
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
      ...currentRelationships.fatherOf,
      ...currentRelationships.motherOf
    ];

    interface ChildData {
      id: number;
      name: string;
      currentOrder?: number;
      newOrder?: number;
    }
    
    const childrenData: {
      all: ChildData[];
      removedIds: number[];
      reorderedIds: number[];
    } = {
      all: currentChildren.map(child => ({
        id: child.id,
        name: child.name || `Unknown (${child.id})`,
        currentOrder: child.order
      })),
      removedIds: details.deleteData?.childrenId || [],
      reorderedIds: []
    };
    
    // Check for order changes
    if (details.childrenOrder) {
      const currentOrder = currentChildren
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(c => c.id);
      
      const newOrder = details.childrenOrder.map(c => c.id);
      
      if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) {
        const newOrders = new Map<number, number>();
        details.childrenOrder.forEach((child, index) => {
          newOrders.set(child.id, index + 1);
        });
    
        childrenData.all.forEach(child => {
          if (newOrders.has(child.id)) {
            child.newOrder = newOrders.get(child.id);  // Changed from currentOrder to newOrder
            childrenData.reorderedIds.push(child.id);
          }
        });
      }
    }

    if (childrenData.all.length > 0) {
      changeDetails.children = childrenData;
    }

  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  // Generate HTML response
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="italic mb-4">---- ${changeData.type} ----</div>
      <div class="flex gap-2">
        <p class="whitespace-nowrap font-semibold min-w-[90px]">Member</p>
        <p>${changeDetails.member || '-'}</p>
      </div>
      
      ${changeDetails.partner ? `
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
          <div class="flex flex-col gap-2">
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
              
            ${changeDetails.children.removedIds.length > 0 ? `
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
        </div>
      ` : ''}
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

// Handler functions for PUT requests
const handleEditMember = async (data: RequestData, tx: any) => {
  const formData = data.formData;
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

  if (formData.descendant === 'No' && (formData.father || formData.mother || formData.siblings)) {
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
    message: "Member updated successfully",
  };
};

const handleAddRelationship = async (data: RequestData, tx: any) => {
  const formData = data.formData as RelationshipDetails;
  
  // First handle partnerships
  if (formData.partnerId) {
    await tx.partnership.createMany({
      data: [
        { memberId: data.memberId, partnerId: formData.partnerId },
        { memberId: formData.partnerId, partnerId: data.memberId }
      ]
    });
  }

  // Then handle children relationships
  const updateData: any = {};
  
  if (formData.fatherOf) {
    updateData.fatherOf = { 
      connect: formData.fatherOf.map(({id}) => ({id})) 
    };
  }

  if (formData.motherOf) {
    updateData.motherOf = { 
      connect: formData.motherOf.map(({id}) => ({id})) 
    };
  }

  if (Object.keys(updateData).length > 0) {
    await tx.member.update({
      where: { id: data.memberId },
      data: updateData
    });
  }

  // Update children orders if needed
  if (formData.fatherOf || formData.motherOf) {
    const childrenToUpdate = [
      ...(formData.fatherOf || []),
      ...(formData.motherOf || [])
    ];

    await Promise.all(
      childrenToUpdate.map(child => 
        tx.member.update({
          where: { id: child.id },
          data: { order: child.order }
        })
      )
    );
  }

  return {
    success: true,
    message: "Relationships added successfully"
  };
};

const handleEditRelationship = async (data: RequestData, tx: any) => {
  const formData = data.formData as EditRelationshipDetails;
  const updatePromises: Promise<any>[] = [];

  // Handle partner removal
  if (formData.deleteData?.partnerId) {
    updatePromises.push(
      tx.partnership.deleteMany({
        where: {
          OR: [
            { memberId: data.memberId, partnerId: formData.deleteData.partnerId },
            { memberId: formData.deleteData.partnerId, partnerId: data.memberId }
          ]
        }
      })
    );
  }

  // Handle children removal
  if (formData.deleteData?.childrenId?.length) {
    const childrenIds = [...new Set(formData.deleteData.childrenId)];

    updatePromises.push(
      tx.member.update({
        where: { id: data.memberId },
        data: {
          fatherOf: { disconnect: childrenIds.map(id => ({ id })) },
          motherOf: { disconnect: childrenIds.map(id => ({ id })) }
        }
      })
    );

    if (formData.hasPartner) {
      updatePromises.push(
        tx.member.update({
          where: { id: formData.hasPartner },
          data: {
            fatherOf: { disconnect: childrenIds.map(id => ({ id })) },
            motherOf: { disconnect: childrenIds.map(id => ({ id })) }
          }
        })
      );
    }
  }

  // Handle children order updates
  if (formData.childrenOrder?.length) {
    updatePromises.push(
      ...formData.childrenOrder.map(child => 
        tx.member.update({
          where: { id: child.id },
          data: { order: child.order }
        })
      )
    );
  }

  await Promise.all(updatePromises);

  return {
    success: true,
    message: "Relationships updated successfully"
  };
};