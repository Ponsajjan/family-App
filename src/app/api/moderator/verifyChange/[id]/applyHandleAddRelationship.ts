interface AddRelationshipData {
  partnerId?: number;
  fatherOf?: Array<{ id: number; order: number }>;
  motherOf?: Array<{ id: number; order: number }>;
}

interface AddRelationshipDataRequetData {
  memberId: number;
  formData: AddRelationshipData;
}

// PUT request handler
export const handleAddRelationship = async (data: AddRelationshipDataRequetData, tx: any) => {
  const formData = data.formData;
  
  // Convert to Prisma's expected format
  const prismaData = {
    partnerId: formData.partnerId,
    ...(formData.fatherOf && {
      fatherOf: { connect: formData.fatherOf.map(({ id }) => ({ id })) }
    }),
    ...(formData.motherOf && {
      motherOf: { connect: formData.motherOf.map(({ id }) => ({ id })) }
    })
  };

  const updatedMember = await tx.member.update({
    where: { id: data.memberId },
    data: prismaData,
  });

  // Batch update children orders
  const childrenUpdates: Promise<any>[] = [];
  
  if (formData.fatherOf) {
    childrenUpdates.push(...formData.fatherOf.map(child => 
      tx.member.update({
        where: { id: child.id },
        data: { order: child.order }
      })
    ));
  }

  if (formData.motherOf) {
    childrenUpdates.push(...formData.motherOf.map(child => 
      tx.member.update({
        where: { id: child.id },
        data: { order: child.order }
      })
    ));
  }

  if (childrenUpdates.length > 0) {
    await Promise.all(childrenUpdates);
  }

  // Update partner relationships
  if (formData.partnerId) {
    const partnerUpdateData: Partial<AddRelationshipData> = { 
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
      data: {
        ...partnerUpdateData,
        // Convert to Prisma format for partner update too
        ...(partnerUpdateData.fatherOf && {
          fatherOf: { connect: partnerUpdateData.fatherOf.map(({ id }) => ({ id })) }
        }),
        ...(partnerUpdateData.motherOf && {
          motherOf: { connect: partnerUpdateData.motherOf.map(({ id }) => ({ id })) }
        })
      }
    });
  }

  return {
    success: true,
    message: "Successfully Added Relationship",
    data: updatedMember,
  };
};
