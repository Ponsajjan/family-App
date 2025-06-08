import { NextResponse } from "next/server";
import prisma from "@/db/db";

interface ChildRelation {
  id: number;
  order: number;
}

interface RelationshipDetails {
  partnerId?: number;
  motherOf?: ChildRelation[];
  fatherOf?: ChildRelation[];
}
// GET request handler for Add Relationship
export async function handleAddRelationshipCase(member: any, changeData: any) {
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
      
      <div class="flex">
        <div class="font-semibold min-w-[100px]">
            <div class="flex">
                <span>Member</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
        </div>
        <div>${changeDetails.member}</div>
      </div>
      
      ${changeDetails.partner ? `
        <div class="flex">
          <div class="font-semibold min-w-[100px]">
            <div class="flex">
                <span>Partner</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
          </div>
          <div class="${changeDetails.partner.isNew ? 'text-blue-600 font-medium' : ''}">
            ${changeDetails.partner.name || '-'}
          </div>
        </div>
      ` : ''}
      
      ${changeDetails.children ? `
        <div class="flex">
          <div class="font-semibold min-w-[100px]">
            <div class="flex">
                <span>Children</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
          </div>
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