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
export const applyHandleAddRelationship = async (data: AddRelationshipDataRequetData, tx: any) => {
  const { memberId, formData } = data;

  // Get current member data to check existing relationships
  const currentMember = await tx.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      name: true,
      partnerId: true,
      partner: {
        select: {
          id: true,
          name: true
        }
      },
      fatherOf: {
        select: {
          id: true
        }
      },
      motherOf: {
        select: {
          id: true
        }
      }
    }
  });

  // Validate partner relationships (skip if same partner)
  if (formData.partnerId && formData.partnerId !== currentMember.partnerId) {
    // Check if current member already has a partner
    if (currentMember.partnerId) {
      throw {
        success: false,
        message: `Member already has ${currentMember.partner.name} as a partner`,
        error: "Member already has a partner"
      };
    }

    // Check if the partner-to-be already has a partner
    const partnerMember = await tx.member.findUnique({
      where: { id: formData.partnerId },
      select: {
        id: true,
        name: true,
        partnerId: true,
        partner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (partnerMember.partnerId) {
      throw {
        success: false,
        message: `New Partner already has ${partnerMember.partner.name} as a partner`,
        error: "New Partner already has a partner"
      };
    }
  }

  // Enhanced Child Validation - Check if children already have parents
  const allChildIds = [
    ...(formData.fatherOf?.map(c => c.id) || []),
    ...(formData.motherOf?.map(c => c.id) || [])
  ];

  if (allChildIds.length > 0) {
    const childrenWithParents = await tx.member.findMany({
      where: {
        id: { in: allChildIds },
        OR: [
          { fatherId: { not: null } },
          { motherId: { not: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        fatherId: true,
        motherId: true,
        father: {
          select: {
            id: true,
            name: true
          }
        },
        mother: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Filter children that have conflicting parents
    const conflictingChildren = childrenWithParents.filter((child: any) => {
      const isFromFatherOf = formData.fatherOf?.some(c => c.id === child.id);
      const isFromMotherOf = formData.motherOf?.some(c => c.id === child.id);

      // If adding as father
      if (isFromFatherOf) {
        // Check if child has a different father
        if (child.fatherId && child.fatherId !== memberId) {
          return true; // Conflict: Child already has a different father
        }
        // Check if child has a different mother (when partner is specified)
        if (formData.partnerId && child.motherId && child.motherId !== formData.partnerId) {
          return true; // Conflict: Child already has a different mother
        }
      }

      // If adding as mother
      if (isFromMotherOf) {
        // Check if child has a different mother
        if (child.motherId && child.motherId !== memberId) {
          return true; // Conflict: Child already has a different mother
        }
        // Check if child has a different father (when partner is specified)
        if (formData.partnerId && child.fatherId && child.fatherId !== formData.partnerId) {
          return true; // Conflict: Child already has a different father
        }
      }

      return false; // No conflicts
    });

    if (conflictingChildren.length > 0) {
      const errorMessages = conflictingChildren.map((child: any) => {
        const isFromFatherOf = formData.fatherOf?.some(c => c.id === child.id);
        const isFromMotherOf = formData.motherOf?.some(c => c.id === child.id);

        if (isFromFatherOf) {
          if (child.fatherId && child.fatherId !== memberId) {
            return `${child.name} already has father ${child.father?.name}`;
          }
          if (formData.partnerId && child.motherId && child.motherId !== formData.partnerId) {
            return `${child.name} already has mother ${child.mother?.name}`;
          }
        }

        if (isFromMotherOf) {
          if (child.motherId && child.motherId !== memberId) {
            return `${child.name} already has mother ${child.mother?.name}`;
          }
          if (formData.partnerId && child.fatherId && child.fatherId !== formData.partnerId) {
            return `${child.name} already has father ${child.father?.name}`;
          }
        }

        return `${child.name} has parent conflict`;
      });

      return {
        success: false,
        message: errorMessages.join(', '),
        data: "Some children already have parents assigned",
      };
    }
  }

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
    where: { id: memberId },
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

  // Update partner relationships (only if partner is different)
  if (formData.partnerId && formData.partnerId !== currentMember.partnerId) {
    const partnerUpdateData: Partial<AddRelationshipData> = {
      partnerId: memberId
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