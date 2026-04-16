import { revalidatePath } from "next/cache";

interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Relationship";
}

// PUT request handler
export const applyHandleEditRelationship = async (data: RequestData, tx: any) => {
  const updatePromises: Promise<any>[] = [];
  const member = await tx.member.findUnique({
    where: { id: data.memberId },
    select: {
      partnerId: true,
      fatherOf: {
        select: { id: true },
      },
      motherOf: {
        select: { id: true },
      },
    },
  });

  // Handle partner removal (divorce)
  if (!!data.formData.deleteData?.partnerId) {
    if (member?.partnerId === data.formData.deleteData.partnerId) {
      // Remove partner from member
      updatePromises.push(
        tx.member.update({
          where: { id: data.formData.deleteData.partnerId },
          data: { partnerId: null }
        })
      );
      // Remove member from partner
      updatePromises.push(
        tx.member.update({
          where: { id: data.memberId },
          data: { partnerId: null }
        })
      );
    }
    // If no children specified during divorce, keep all children with both parents
    // Children maintain relationships with both parents after divorce

    // Standardised logic: If children are selected for removal.
    if (!!data.formData.deleteData?.childrenId?.length) {
      const memberRemovedChildren: number[] = Array.from(new Set(data.formData.deleteData.childrenId)); // Children removed from member

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
    }

  } else {
    // Handle children relations removal (NOT during divorce)
    if (!!data.formData.deleteData?.childrenId?.length) {
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
  if (!!data.formData.childrenOrder?.length) {
    updatePromises.push(
      ...data.formData.childrenOrder.map((child: any, index: number) =>
        tx.member.update({
          where: { id: child.id },
          data: { order: index + 1 }
        })
      )
    );
  }

  // Wait for all updates to complete and handle errors gracefully
  try {
    await Promise.all(updatePromises);

    revalidatePath('/api/relatives');
    revalidatePath('/api/calendar/[month]/[year]', 'page');
    revalidatePath('/api/relatives/[id]', 'page');
    revalidatePath('/tree');

    return {
      success: true,
      message: "Successfully Updated Member Relationship Edit",
    };
  } catch (error: any) {
    console.error("Error applying relationship changes:", error);

    let errorMessage = "Failed to apply relationship changes.";

    // P2025 is Prisma's error for "An operation failed because it depends on one or more records that were required but not found."
    if (error.code === 'P2025') {
      errorMessage = "One or more members involved in this relationship change no longer exist.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};