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
        <p class="whitespace-nowrap font-semibold min-w-[120px]">${formatFieldName(key)}</p>
        <div class="flex flex-wrap items-center gap-1">
          ${hasChanged ? `<p class="line-through">${displayValue(value, key)}</p>` : ''}
          <p class="${hasChanged ? 'text-blue-600 font-medium' : ''}">${displayValue(newValue, key)}</p>
        </div>
      </div>
    `;
  }).join('');

  return NextResponse.json({ 
    data: {
      formData: { ...formData, ...changeDetails },
      htmlContent: `<div class="space-y-2 bg-main_background text-text_color">${changesJsx}</div>`
    },
  });
}

interface RelationshipDetails {
  partnerId?: number;
  motherOf?: { connect: { id: number }[] };
  fatherOf?: { connect: { id: number }[] };
}

async function handleAddRelationshipCase(member: any, changeData: any) {
  // First get current relationships
  const currentRelationships = await prisma.member.findUnique({
    where: { id: member.id },
    select: {
      partnerId: true,
      fatherOf: { select: { id: true, name: true } },  // Include names
      motherOf: { select: { id: true, name: true } },  // Include names
    },
  });

  const changeDetails: {
    member: string | null;
    partner?: { name: string | null; isNew: boolean };
    children?: { 
      all: {id: number, name: string}[];  // All children (existing + new)
      newIds: number[];                   // IDs of new children only
    };
  } = { member: member.name };

  try {
    const details: RelationshipDetails = JSON.parse(changeData?.details || '{}');
    
    // Handle partner comparison
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

    // Collect all current children (from both fatherOf and motherOf)
    const currentChildren = [
      ...(currentRelationships?.fatherOf || []),
      ...(currentRelationships?.motherOf || [])
    ];

    // Process updated relationships
    const updatedChildrenIds: number[] = [];
    const newChildrenIds: number[] = [];
    const allChildren: {id: number, name: string}[] = [...currentChildren];

    // Helper function to process relationship updates
    const processUpdates = async (connectData: {id: number}[] | undefined) => {
      if (!connectData) return;
      
      for (const {id} of connectData) {
        updatedChildrenIds.push(id);
        
        // Check if this is a new relationship
        if (!currentChildren.some(c => c.id === id)) {
          newChildrenIds.push(id);
          // Fetch name for new children
          const child = await prisma.member.findUnique({
            where: { id },
            select: { name: true }
          });
          if (child) {
            allChildren.push({id, name: child.name || `Unknown (${id})`});
          }
        }
      }
    };

    // Process motherOf and fatherOf updates
    await processUpdates(details.motherOf?.connect);
    await processUpdates(details.fatherOf?.connect);

    // Set children data
    if (allChildren.length > 0) {
      changeDetails.children = {
        all: allChildren,
        newIds: newChildrenIds
      };
    }

  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  // Generate HTML showing all children with new ones highlighted
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="flex gap-2">
        <p class="whitespace-nowrap font-semibold min-w-[120px]">Member</p>
        <p>${changeDetails.member || '-'}</p>
      </div>
      ${changeDetails.partner ? `
        <div class="flex gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[120px]">Partner</p>
          <p class="${changeDetails.partner.isNew ? 'text-blue-600 font-medium' : ''}">
            ${changeDetails.partner.name || '-'}
          </p>
        </div>
      ` : ''}
      ${changeDetails.children ? `
        <div class="flex gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[120px]">Children</p>
          <div class="flex flex-wrap gap-1">
            ${changeDetails.children.all.map(child => {
              const isNew = changeDetails.children?.newIds.includes(child.id);
              return `
                <span class="${isNew ? 'text-blue-600 font-medium' : ''}">
                  ${child.name}
                </span>
              `;
            }).join(', ')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  return NextResponse.json({ 
    data: {
      formData: {
        member: changeDetails.member,
        partner: changeDetails.partner?.name,
        children: changeDetails.children?.all.map(c => c.name).join(', '),
        newRelationships: {
          partner: changeDetails.partner?.isNew || false,
          children: changeDetails.children?.newIds || []
        }
      },
      htmlContent
    },
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

  try {
    const details: EditRelationshipDetails = JSON.parse(changeData?.details || '{}');
    
    // Handle partner changes
    const currentPartnerId = currentRelationships?.partnerId;
    const newPartnerId = details.hasPartner;
    const isRemovingPartner = details.deleteData?.partnerId !== undefined;

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
    } else if (newPartnerId !== undefined) {
      // Partner is being changed (hasPartner exists)
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
  const hasPartnerChanges = changeDetails.partner !== undefined;
  const hasAnyChanges = hasPartnerChanges || hasOrderChanges || hasRemovedChildren;

  // Generate HTML
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="flex gap-2">
        <p class="whitespace-nowrap font-semibold min-w-[120px]">Member</p>
        <p>${changeDetails.member || '-'}</p>
      </div>
      
      ${hasPartnerChanges ? `
        <div class="flex gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[120px]">Partner</p>
          <p class="${changeDetails.partner?.isRemoved ? 'line-through text-red-500' : ''}">
            ${changeDetails.partner?.name || '-'}
            ${changeDetails.partner?.isRemoved ? ' (Removed)' : ''}
          </p>
        </div>
      ` : ''}
      
      ${changeDetails.children ? `
        <div class="flex flex-col gap-2">
          <p class="whitespace-nowrap font-semibold min-w-[120px]">Children</p>
          
          ${hasAnyChanges ? `
            ${hasOrderChanges ? `
              <div>
                <p class="font-semibold pl-2">New Order:</p>
                <div class="flex flex-col gap-1 pl-4 mt-1">
                  ${changeDetails.children.all
                    .filter(child => changeDetails.children?.reorderedIds.includes(child.id))
                    .sort((a, b) => (a.newOrder || 0) - (b.newOrder || 0))
                    .map(child => `
                      <div class="flex gap-1 items-center">
                        <span>${child.newOrder}. ${child.name}</span>
                      </div>
                    `).join('')}
                </div>
              </div>
            ` : `
              <div class="flex flex-col gap-1 pl-4">
                ${changeDetails.children.all
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
                <p class="font-semibold pl-2">Removed Children:</p>
                <div class="flex flex-col gap-1 pl-4 mt-1">
                  ${changeDetails.children.all
                    .filter(child => changeDetails.children?.removedIds.includes(child.id))
                    .map(child => `
                      <div class="flex gap-1 items-center">
                        <span class="line-through text-red-500">
                          ${child.currentOrder}. ${child.name} (Removed)
                        </span>
                      </div>
                    `).join('')}
                </div>
              </div>
            ` : ''}
          ` : `
            <div class="flex flex-col gap-1 pl-4">
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
      formData: {
        member: changeDetails.member,
        partner: changeDetails.partner || null,
        children: changeDetails.children 
          ? {
              all: changeDetails.children.all.map(c => ({
                id: c.id,
                name: c.name,
                currentOrder: c.currentOrder,
                newOrder: c.newOrder
              })),
              removedIds: changeDetails.children.removedIds,
              reorderedIds: changeDetails.children.reorderedIds
            }
          : null,
        hasChanges: hasAnyChanges
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