import { displayValue, formatDate, formatFieldName, normalizeValue } from "./utils";
import { NextResponse } from "next/server";

// GET request handler for Edit Member
export async function handleEditMemberCase(member: any, changeData: any) {
  let changeDetails: any = {};
  try {
    changeDetails = JSON.parse(changeData?.details || '{}');
  } catch (e) {
    console.error('Error parsing change details:', e);
  }

  const showNonDescendant = member.descendant && (changeDetails.descendant === 'Yes' || changeDetails.descendant === undefined)

  const formData = {
    name: member.name,
    gender: member.gender,
    birthDate: member.birthDate?.toString().padStart(2, '0') ?? null,
    birthMonth: member.birthMonth?.toString().padStart(2, '0') ?? null,
    birthYear: member.birthYear?.toString() ?? null,
    deceased: member.deceased,
    deathDate: member.deathDate?.toString().padStart(2, '0') ?? null,
    deathMonth: member.deathMonth?.toString().padStart(2, '0') ?? null,
    deathYear: member.deathYear?.toString() ?? null,
    phoneNumber: member.phoneNumber || null,
    occupation: member.occupation || null,
    education: member.education || null,
    birthPlace: member.birthPlace || null,
    address: member.address || null,
    city: member.city || null,
    district: member.district || null,
    state: member.state || null,
    country: member.country || null,
    descendant: member.descendant ? 'Yes' : 'No',
    ...showNonDescendant ? null : { father: member.nonDescendantRelation?.[0]?.fatherName },
    ...showNonDescendant ? null : { mother: member.nonDescendantRelation?.[0]?.motherName },
    ...showNonDescendant ? null : { siblings: member.nonDescendantRelation?.[0]?.siblingNames },
    additionalInfo: member.additionalInfo || null,
  };

  let anyFieldChanged = false;

  const changesJsx = Object.entries(formData).map(([key, value]) => {
    const newValue = key in changeDetails ? changeDetails[key] : value;
    const hasChanged =
      (value == null && newValue != null) ||
      (value != null && newValue == null) ||
      normalizeValue(value, key) !== normalizeValue(newValue, key);

    if (hasChanged) anyFieldChanged = true;

    return `
      <div class="flex" key="${key}">
        <div class="font-medium md:font-semibold min-w-[9.375rem]">
            <div class="flex">
                <span class="whitespace-nowrap">${formatFieldName(key)}</span>
                <span class="border-b border-dotted border-border_color w-full mb-1 mx-1"></span>
            </div>
        </div>
        <div class="flex flex-wrap items-center gap-1">
          ${hasChanged ? `<p class="line-through">${displayValue(value, key)}</p>` : ''}
          <p class="${hasChanged ? 'text-blue-600 font-medium' : ''}">${displayValue(newValue, key) == '1600' ? '' : displayValue(newValue, key)}</p>
        </div>
      </div>
    `;
  }).join('');

  return NextResponse.json({
    data: {
      newChange: anyFieldChanged,
      submitData: {
        memberId: changeData.memberId,
        type: changeData.type,
        formData: { ...formData, ...changeDetails },
      },
      assignDate: formatDate(changeData.createdAt),
      htmlContent: `<div class="space-y-2 bg-main_background text-text_color">
        <div class="italic mb-4">---- ${changeData.type || 'Edit Member'} ----</div>
        ${changesJsx}
        ${!anyFieldChanged ? '<div class="text-blue-600 font-semibold py-2">Outdated changes / Already applied changes</div>' : ''}
      </div>`
    },
  });
}