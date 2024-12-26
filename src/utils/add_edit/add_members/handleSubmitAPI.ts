import { AddMemberFormValueTypes } from "@/types/add__edit/add_member/types";

export const handleSubmitAPI = async (formData: AddMemberFormValueTypes) => {
  // Prepare member data
  const deceased = formData.deceased;
  const descendant = formData.descendant === "Yes";
  const memberData = {
    name: formData.name,
    gender: formData.gender,
    birthDate: formData.birth_date ? parseInt(formData.birth_date, 10) : null,
    birthMonth: formData.birth_month ? parseInt(formData.birth_month, 10) : null,
    birthYear: formData.birth_year ? parseInt(formData.birth_year, 10) : null,
    deceased: formData.deceased,
    deathDate: deceased && formData.death_date ? parseInt(formData.death_date, 10) : null,
    deathMonth: deceased && formData.death_month ? parseInt(formData.death_month, 10) : null,
    deathYear: deceased && formData.death_year ? parseInt(formData.death_year, 10) : null,
    phoneNumber: formData.phone_number,
    occupation: formData.occupation,
    education: formData.education,
    address: formData.address,
    descendant: descendant,
    father: descendant ? null : formData.father,
    mother: descendant ? null : formData.mother,
    siblings: descendant ? null : formData.siblings
  };

  // API Call
  const response = await fetch("/api/addMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  // Handle API response
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong");
    // throw allows the error to be caught and handled by any surrounding `try...catch` blocks or global error handlers
  }
};