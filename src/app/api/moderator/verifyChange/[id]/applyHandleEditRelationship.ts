interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Relationship";
}

// PUT request handler
export const applyHandleEditRelationship = async (data: RequestData, tx: any) => {
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

    if (data.formData.hasPartner && !data.formData.deleteData?.partnerId) {
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
      ...data.formData.childrenOrder.map((child:any, index:number) =>
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