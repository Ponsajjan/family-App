interface MemberUpdateData {
  name: string;
  gender?: string;
  birthDate?: string | null;
  birthMonth?: string | null;
  birthYear?: string | null;
  deceased: boolean;
  deathDate?: string | null;
  deathMonth?: string | null;
  deathYear?: string | null;
  phoneNumber?: string;
  occupation?: string | null;
  education?: string | null;
  birthPlace?: string | null;
  currentAddress?: string | null;
  descendant: string;
  father?: string;
  mother?: string;
  siblings?: string;
  additionalInfo?: string;
}

interface RequestData {
  formData: any;
  memberId: number;
  type: "Edit Member";
}

export const applyHandleEditMember = async (data: RequestData, tx: any) => {
  const formData = data.formData as MemberUpdateData;
  const deceased = formData.deceased === true;

  const memberUpdateData = {
    name: formData.name,
    gender: formData.gender,
    birthDate: formData.birthDate ? parseInt(formData.birthDate) : null,
    birthMonth: formData.birthMonth ? parseInt(formData.birthMonth) : null,
    birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
    deceased,
    deathDate: deceased && formData.deathDate ? parseInt(formData.deathDate) : null,
    deathMonth: deceased && formData.deathMonth ? parseInt(formData.deathMonth) : null,
    deathYear: deceased && formData.deathYear ? parseInt(formData.deathYear) : null,
    phoneNumber: formData.phoneNumber || null,
    occupation: formData.occupation || null,
    education: formData.education || null,
    birthPlace: formData.birthPlace || null,
    currentAddress: formData.currentAddress || null,
    descendant: formData.descendant === 'Yes',
    additionalInfo: formData.additionalInfo || null,
  };

  // Update member data
  await tx.member.update({
    where: { id: data.memberId },
    data: memberUpdateData,
  });

  // Handle non-descendant relations
  if (formData.descendant === 'Yes') {
    // If member is now a descendant, remove any existing non-descendant relations
    await tx.nonDescendantRelation.deleteMany({
      where: { memberId: data.memberId },
    });
  } else if (formData.father || formData.mother || formData.siblings) {
    // If member is non-descendant and has family data, upsert the relation
    await tx.nonDescendantRelation.upsert({
      where: { memberId: data.memberId },
      update: {
        fatherName: formData.father || null,
        motherName: formData.mother || null,
        siblingNames: formData.siblings || null,
      },
      create: {
        memberId: data.memberId,
        fatherName: formData.father || null,
        motherName: formData.mother || null,
        siblingNames: formData.siblings || null,
      },
    });
  }

  return {
    success: true,
    message: "Successfully Updated Member Edit",
  };
};