import { revalidatePath } from "next/cache";

interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Relationship";
}

// PUT request handler
export const applyHandleEditRelationship = async (data: RequestData, tx: any) => {
  const updatePromises: Promise<any>[] = [];

  // Get all children of the member to determine custody split
  const memberChildren = await tx.member.findUnique({
    where: { id: data.memberId },
    select: {
      fatherOf: { select: { id: true } },
      motherOf: { select: { id: true } }
    }
  });

  const allMemberChildren = [
    ...(memberChildren?.fatherOf?.map((child: any) => child.id) || []),
    ...(memberChildren?.motherOf?.map((child: any) => child.id) || [])
  ];

  // Handle partner removal (divorce)
  if (data.formData.deleteData?.partnerId) {
    updatePromises.push(
      tx.$transaction([
        // Remove partner from member
        tx.member.update({
          where: { id: data.formData.deleteData.partnerId },
          data: { partnerId: null }
        }),
        // Remove member from partner
        tx.member.update({
          where: { id: data.memberId },
          data: { partnerId: null }
        })
      ])
    );

    // If no children specified during divorce, keep all children with both parents
    // Children maintain relationships with both parents after divorce

    // Custody split during divorce (only if children specified)
    if (data.formData.deleteData?.childrenId?.length) {
      const memberRemovedChildren: number[] = Array.from(new Set(data.formData.deleteData.childrenId)); // Children removed from member
      const memberKeptChildren: number[] = allMemberChildren.filter(childId => !memberRemovedChildren.includes(childId)); // Children kept by member

      // Remove specified children from MEMBER (member loses custody)
      if (memberRemovedChildren.length > 0) {
        updatePromises.push(
          tx.member.update({
            where: { id: data.memberId },
            data: {
              fatherOf: { disconnect: memberRemovedChildren.map(id => ({ id })) },
              motherOf: { disconnect: memberRemovedChildren.map(id => ({ id })) },
            },
          })
        );
      }

      // Remove kept children from PARTNER (partner loses custody of the ones member keeps)
      if (memberKeptChildren.length > 0) {
        updatePromises.push(
          tx.member.update({
            where: { id: data.formData.deleteData.partnerId },
            data: {
              fatherOf: { disconnect: memberKeptChildren.map(id => ({ id })) },
              motherOf: { disconnect: memberKeptChildren.map(id => ({ id })) },
            },
          })
        );
      }
    }
    // If no children specified during divorce, children automatically stay with both parents
  } else {
    // Handle children relations removal (NOT during divorce)
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

      // Remove children from partner only when NOT during divorce
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
  }

  // Handle children order updates
  if (data.formData.childrenOrder?.length) {
    updatePromises.push(
      ...data.formData.childrenOrder.map((child: any, index: number) =>
        tx.member.update({
          where: { id: child.id },
          data: { order: index + 1 }
        })
      )
    );
  }

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  revalidatePath('/api/relatives');
  revalidatePath('/api/calendar/[month]/[year]');
  revalidatePath('/api/relatives/[id]');
  revalidatePath('/tree');

  return {
    success: true,
    message: "Successfully Updated Member Relationship Edit",
  };
};