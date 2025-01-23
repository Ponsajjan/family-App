import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function POST(request: Request) {
  try {
    // Parse the JSON payload from the request body
    const formData = await request.json(); 
    const deceased = formData.deceased === true; // Handle as a boolean
    
    // Utility function
    const capitalizeWords = (name: string) => {
      return name.replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .replace(/,\s*\w/g, (char) => char.toUpperCase());
    }
    const formatTwoDigits = (value: number | null) => {
      return value !== null ? parseInt(String(value).padStart(2, '0'), 10) : null;
    };

    const member = {
      name: capitalizeWords(formData.name),
      gender: formData.gender,
      birthDate: formData.birthDate ? formatTwoDigits(formData.birthDate) : null,
      birthMonth: formData.birthMonth ? formatTwoDigits(formData.birthMonth) : null,
      birthYear: formData.birthYear ? parseInt(formData.birthYear, 10) : null,
      deceased: deceased,
      deathDate: deceased && formData.deathDate ? formatTwoDigits(formData.deathDate) : null,
      deathMonth: deceased && formData.deathMonth ? formatTwoDigits(formData.deathMonth) : null,
      deathYear: deceased && formData.deathYear ? parseInt(formData.deathYear, 10) : null,
      phoneNumber: formData.phoneNumber,
      occupation: formData.occupation || null,
      education: formData.education || null,
      address: formData.address || null,
      descendant: formData.descendant,
    };

    if (!formData.gender) {
      return NextResponse.json({
        error: 'Gender not assigned',
      }, { status: 400 });
    }
    // Save member to the database
    const newMember = await prisma.member.create({
      data: member,
    });

    if (formData.descendant === false) {
      await prisma.nonDescendantRelation.create({
        data: {
          fatherName: formData.father ? capitalizeWords(formData.father) : null,
          motherName: formData.mother ? capitalizeWords(formData.mother) : null,
          siblingNames: formData.siblings ? capitalizeWords(formData.siblings) : null,
          memberId: newMember.id, // Link nonDescendantRelation to the newly created Member
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Member added successfully", 
      member: newMember });
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
} 