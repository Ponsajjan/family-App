import { NextResponse } from "next/server";
import prisma from "@/db/db";

interface EditRelationshipDetails {
  deleteData?: {
    partnerId?: number | null;
    childrenId?: number[];
  };
  hasPartner?: number;
  childrenOrder?: Array<{
    id: number;
    order: number;
  }>;
}

type ChildrenData = {
  all: { id: number; name: string; currentOrder?: number; newOrder?: number }[];
  removedIds: number[];
  reorderedIds: number[];
};

type ChangeDetails = {
  member: string;
  partner?: { name: string | null; isRemoved: boolean; };
  children?: ChildrenData;
  isAbsolute?: boolean;
};

// GET request handler for Edit Relationship
export async function handleEditRelationshipCase(member: any, changeData: any) {
  // First get current relationships
  const currentRelationships = await prisma.member.findUnique({
    where: { id: member.id },
    select: {
      partnerId: true,
      fatherOf: { select: { id: true, name: true, order: true } },
      motherOf: { select: { id: true, name: true, order: true } },
    },
  });

  const changeDetails: ChangeDetails = { member: member.name };

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
    const removedPartnerId = details.hasPartner;
    const isRemovingPartner = !!details.deleteData?.partnerId;

    if (isRemovingPartner) {
      if (removedPartnerId === currentPartnerId) {
        const removedPartner = await prisma.member.findUnique({
          where: { id: removedPartnerId },
          select: { name: true }
        });
        changeDetails.partner = {
          name: removedPartner?.name ?? null,
          isRemoved: true
        };
      } else {
        const currentPartner = await prisma.member.findUnique({
          where: { id: currentPartnerId || -1 },
          select: { name: true }
        });
        changeDetails.partner = {
          name: currentPartner?.name ?? "-",
          isRemoved: false
        };
      }
    }

    if (details.childrenOrder || details.deleteData?.childrenId) {
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
      changeDetails.children = childrenData;
    }

  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  // Determine what changes exist
  const hasOrderChanges = changeDetails.children?.reorderedIds && changeDetails.children?.reorderedIds.length > 0;
  const hasRemovedChildren = changeDetails.children?.removedIds && changeDetails.children?.removedIds.length > 0;
  const hasPartnerChanges = !!changeDetails.partner?.isRemoved;
  const hasAnyChanges = hasPartnerChanges || hasOrderChanges || hasRemovedChildren;

  // Generate HTML
  const htmlContent = `
    <div class="space-y-2 bg-main_background text-text_color">
      <div class="italic mb-4">---- ${changeData.type || 'Edit Relationship'} ----</div>
      <div class="flex">
        <div class="font-medium md:font-semibold min-w-[100px]">
            <div class="flex">
                <span>Member</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
        </div>
        <div>${changeDetails.member || '-'}</div>
      </div>
    
      <div class="flex">
        <div class="font-medium md:font-semibold min-w-[100px]">
          <div class="flex">
              <span>Partner</span>
              <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
          </div>
        </div>
        <div> <span class="${hasPartnerChanges ? 'line-through' : ''} ">
          ${changeDetails.partner?.name || '-'}</span>
          <span class="text-blue-600 font-medium">${hasPartnerChanges ? ' (Removed)' : ''}</span>
        </div>
      </div>
   
      ${changeDetails.children ? `
      <div class="flex gap-2">
        <div class="font-medium md:font-semibold min-w-[100px]">
          <div class="flex">
              <span>Children</span>
              <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
          </div>
        </div>
          
          ${hasAnyChanges ? `
            <div class="flex flex-col gap-2">
              ${hasOrderChanges ? `
                <div>
                  <div class="font-semibold">New Order:</div>
                  <div class="flex flex-col gap-1 pl-4 mt-1">
                    ${changeDetails.children?.all
            .filter(child => changeDetails.children?.reorderedIds.includes(child.id))
            .sort((a, b) => (a.newOrder || 0) - (b.newOrder || 0))
            .map(child => `
                        <div class="flex gap-1 items-center flex-wrap">
                          <span>${child.newOrder}. ${child.name}</span>
                          <span class="text-blue-600 font-medium">
                            ${child.newOrder !== child.currentOrder ? `(Moved from ${child.currentOrder})` : ''}
                          </span>
                        </div>
                      `).join('')}
                    ${changeDetails.children?.all
            .filter(child => !changeDetails.children?.reorderedIds.includes(child.id) &&
              !changeDetails.children?.removedIds.includes(child.id))
            .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
            .map(child => `
                        <div class="flex gap-1 items-center flex-wrap">
                          <span>${child.currentOrder}. ${child.name}</span>
                        </div>
                      `).join('')}
                  </div>
                </div>
              ` : `
                <div class="flex flex-col gap-1">
                  ${changeDetails.children?.all
          .filter(child => !changeDetails.children?.removedIds.includes(child.id))
          .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
          .map(child => `
                      <div class="flex gap-1 items-center flex-wrap">
                        <span>${child.currentOrder}. ${child.name}</span>
                      </div>
                    `).join('')}
                </div>
              `}
              
              ${hasRemovedChildren ? `
                <div>
                  <div class="font-semibold">Removed Children:</div>
                  <div class="flex flex-col gap-1 pl-4 mt-1">
                    ${changeDetails.children?.all && changeDetails.children?.all
            .filter(child => changeDetails.children?.removedIds.includes(child.id)).length > 0
            ? changeDetails.children?.all
              .filter(child => changeDetails.children?.removedIds.includes(child.id)).map((child, index) => `
                        <div class="flex gap-1 items-center flex-wrap">
                          <span>${index + 1}.</span>
                          <span class="line-through ">
                             ${child.name}
                          </span>
                          <span class="text-blue-600 font-medium"> (Removed order ${child.currentOrder})</span>
                        </div>
                      `).join('')
            : `<div class="text-blue-600 font-medium">Already Applied changes</div>`
          }
                  </div>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="flex flex-col gap-1">
              ${changeDetails.children?.all
        .sort((a, b) => (a.currentOrder || 0) - (b.currentOrder || 0))
        .map(child => `
                  <div class="flex gap-1 items-center flex-wrap">
                    <span>${child.currentOrder}. ${child.name}</span>
                  </div>
                `).join('')}
            </div>
          `}
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