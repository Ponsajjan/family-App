import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { formatDate } from "./utils";

interface ChildRelation {
  id: number;
  order: number;
}

interface RelationshipDetails {
  partnerId?: number;
  motherOf?: ChildRelation[];
  fatherOf?: ChildRelation[];
}

type ChangeDetails = {
  member: string | null;
  partner?: { name: string | null; isNew: boolean };
  children?: {
    all: { id: number, name: string | null, order: number | null }[];  // All children (existing + new)
    newIds: number[];                   // IDs of new children only
  };
  isAlreadyApplied?: boolean;
}

// GET request handler for Add Relationship
export async function handleAddRelationshipCase(member: any, changeData: any) {
  // Get current relationships with proper typing
  const currentRelationships = await prisma.member.findUnique({
    where: { id: member.id },
    select: {
      partnerId: true,
      partner: { select: { name: true } },
      fatherOf: { select: { id: true, name: true, order: true } },
      motherOf: { select: { id: true, name: true, order: true } },
    },
  });

  const changeDetails: ChangeDetails = { member: member.name };
  const details: RelationshipDetails = JSON.parse(changeData?.details || '{}');

  if (!details.partnerId && !details.motherOf?.length && !details.fatherOf?.length) {
    return NextResponse.json(
      { error: "No valid relationship changes found in request" },
      { status: 400 }
    );
  }

  let currentChildren: { id: number; name: string | null; order: number | null }[] = [];

  try {

    // Process partner changes
    if (currentRelationships?.partnerId) {
      changeDetails.partner = {
        name: currentRelationships.partner?.name ?? null,
        isNew: false
      };
    } else if (details.partnerId) {
      const partner = await prisma.member.findUnique({
        where: { id: details.partnerId },
        select: { name: true }
      });

      changeDetails.partner = {
        name: partner?.name ?? null,
        isNew: true
      };
    }

    // Process children changes
    currentChildren = [
      ...(currentRelationships?.fatherOf || []),
      ...(currentRelationships?.motherOf || [])
    ].map(c => ({ id: c.id, name: c.name, order: c.order }));

    const newChildrenIds: number[] = [];
    const allChildren = [...currentChildren];

    // Process relationship updates with order preservation
    const processUpdates = async (relations: ChildRelation[] | undefined) => {
      if (!relations) return;

      for (const { id, order } of relations) {
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
        all: allChildren.sort((a, b) => (a.order || 0) - (b.order || 0)), // Sort by order
        newIds: newChildrenIds
      };
    }

    const isPartnerNew = !currentRelationships?.partnerId && !!details.partnerId;
    const hasNewChildren = newChildrenIds.length > 0;

    const hasAnyChanges = isPartnerNew || hasNewChildren;
    changeDetails.isAlreadyApplied = !hasAnyChanges;

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
      <div class="italic mb-4">---- ${changeData.type || 'Add Relationship'} ----</div>
      
      <div class="flex">
        <div class="font-medium md:font-semibold min-w-[6.25rem]">
            <div class="flex">
                <span>Member</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
        </div>
        <div>${changeDetails.member}</div>
      </div>
      
      ${changeDetails.partner ? `
        <div class="flex">
          <div class="font-medium md:font-semibold min-w-[6.25rem]">
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
          <div class="font-medium md:font-semibold min-w-[6.25rem]">
            <div class="flex">
                <span>Children</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            ${changeDetails.children.all.map((child, index) => {
    const isNew = changeDetails.children!.newIds.includes(child.id);

    return `
                <div class="flex gap-1 items-center flex-wrap">
                  <span class="${isNew ? 'text-blue-600 font-medium' : ''}">
                    ${index + 1}. ${child.name}
                  </span>
                </div>
              `;
  }).join('')}
          </div>
        </div>
      ` : ''}

      ${changeDetails.isAlreadyApplied ? `
        <div class="text-blue-600 font-semibold py-2">Outdated changes / Already applied changes</div>
      ` : ''}
    </div>
  `;

  return NextResponse.json({
    data: {
      newChange: !changeDetails.isAlreadyApplied,
      submitData: {
        memberId: changeData.memberId,
        type: changeData.type,
        formData: details,
      },
      assignDate: formatDate(changeData.createdAt),
      htmlContent
    }
  });
}
