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

  if (formData.partnerId === memberId) {
    throw {
      success: false,
      message: "Cannot set self as partner",
      error: "Self-referential relationship"
    };
  }

  // Get current member data to check existing relationships
  const currentMember = await tx.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      name: true,
      gender: true,
      partnerId: true,
      partner: {
        select: {
          id: true,
          name: true
        }
      },
      fatherOf: {
        select: {
          id: true,
          name: true,
          motherId: true,
          mother: { select: { id: true, name: true } }
        }
      },
      motherOf: {
        select: {
          id: true,
          name: true,
          fatherId: true,
          father: { select: { id: true, name: true } }
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

  // Calculate effective partner ID early for validation
  // If member has partner, use existing. Otherwise use requested partner if provided.
  const effectivePartnerId = currentMember.partnerId || formData.partnerId;

  // Enhanced Child Validation - Check if children already have parents
  const existingChildren = currentMember?.gender === 'Male' ? currentMember.fatherOf : currentMember.motherOf;
  const newChildIds = [
    ...(formData.fatherOf?.map((c: any) => c.id) || []),
    ...(formData.motherOf?.map((c: any) => c.id) || [])
  ];

  // All children that need to be checked (newly added + existing children if a partner is being added/changed)
  const childrenToCheckIds = [...new Set([
    ...newChildIds,
    ...(formData.partnerId ? (existingChildren?.map((c: any) => c.id) || []) : [])
  ])];

  if (childrenToCheckIds.length > 0) {
    const childrenWithParents = await tx.member.findMany({
      where: {
        id: { in: childrenToCheckIds },
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
        father: { select: { id: true, name: true } },
        mother: { select: { id: true, name: true } }
      }
    });

    // Filter children that have conflicting parents
    const conflictingChildren = childrenWithParents.filter((child: any) => {
      // Determine expected parents for this family unit
      let expectedFatherId: number | null | undefined;
      let expectedMotherId: number | null | undefined;

      if (currentMember.gender === 'Male') {
        expectedFatherId = memberId;
        expectedMotherId = effectivePartnerId;
      } else {
        expectedMotherId = memberId;
        expectedFatherId = effectivePartnerId;
      }

      // Check for conflicts
      // 1. Check Father Conflict
      if (expectedFatherId && child.fatherId && child.fatherId !== expectedFatherId) {
        return true;
      }

      // 2. Check Mother Conflict
      if (expectedMotherId && child.motherId && child.motherId !== expectedMotherId) {
        return true;
      }

      return false;
    });

    if (conflictingChildren.length > 0) {
      const errorMessages = conflictingChildren.map((child: any) => {
        const isMemberMale = currentMember?.gender === 'Male';
        if (isMemberMale) {
          if (child.fatherId && child.fatherId !== memberId && formData.fatherOf?.some((c: any) => c.id === child.id)) {
            return `${child.name} already has ${child.father?.name} assigned as father`;
          }
          if (formData.partnerId && child.motherId && child.motherId !== formData.partnerId) {
            return `${child.name} already has ${child.mother?.name} assigned as mother`;
          }
        } else {
          if (child.motherId && child.motherId !== memberId && formData.motherOf?.some((c: any) => c.id === child.id)) {
            return `${child.name} already has ${child.mother?.name} assigned as mother`;
          }
          if (formData.partnerId && child.fatherId && child.fatherId !== formData.partnerId) {
            return `${child.name} already has ${child.father?.name} assigned as father`;
          }
        }
        return `${child.name} has parent conflict`;
      });

      throw {
        success: false,
        message: Array.from(new Set(errorMessages)).join(', '),
        error: "Some children already have parents assigned",
      };
    }
  }

  // Convert to Prisma's expected format
  const sanitizedUpdateData = {
    ...(formData.partnerId !== undefined && !currentMember.partnerId && { partnerId: formData.partnerId }),
    ...(formData.fatherOf && {
      fatherOf: { connect: formData.fatherOf.map(({ id }: any) => ({ id })) }
    }),
    ...(formData.motherOf && {
      motherOf: { connect: formData.motherOf.map(({ id }: any) => ({ id })) }
    })
  };



  const updatedMember = await tx.member.update({
    where: { id: memberId },
    data: sanitizedUpdateData,
  });

  // Batch update children orders
  const childrenUpdates: Promise<any>[] = [];

  if (formData.fatherOf) {
    childrenUpdates.push(...formData.fatherOf.map((child: any) =>
      tx.member.update({
        where: { id: child.id },
        data: { order: child.order }
      })
    ));
  }

  if (formData.motherOf) {
    childrenUpdates.push(...formData.motherOf.map((child: any) =>
      tx.member.update({
        where: { id: child.id },
        data: { order: child.order }
      })
    ));
  }

  if (childrenUpdates.length > 0) {
    await Promise.all(childrenUpdates);
  }

  // Update partner relationships (with effective partner)
  if (effectivePartnerId) {
    await tx.member.update({
      where: { id: effectivePartnerId },
      data: {
        partnerId: memberId,
        ...(currentMember.gender === 'Male'
          ? { motherOf: { connect: [...(formData.fatherOf?.map(({ id }: any) => ({ id })) || []), ...(currentMember.fatherOf.map(({ id }: any) => ({ id })))] } }
          : { fatherOf: { connect: [...(formData.motherOf?.map(({ id }: any) => ({ id })) || []), ...(currentMember.motherOf.map(({ id }: any) => ({ id })))] } }
        )
      }
    });
  }

  return {
    success: true,
    message: "Successfully Added Relationship",
    data: updatedMember,
  };
};