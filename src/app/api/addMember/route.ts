import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function POST(request: Request) {
  try {
    // Parse the JSON payload from the request body
    const formData = await request.json(); 
    const deceased = formData.deceased === true; // Handle as a boolean

    const user = {
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birthDate ? parseInt(formData.birthDate, 10) : null,
        birthMonth: formData.birthMonth ? parseInt(formData.birthMonth, 10) : null,
        birthYear: formData.birthYear ? parseInt(formData.birthYear, 10) : null,
        deceased: deceased,
        deathDate: deceased && formData.deathDate ? parseInt(formData.deathDate, 10) : null,
        deathMonth: deceased && formData.deathMonth ? parseInt(formData.deathMonth, 10) : null,
        deathYear: deceased && formData.deathYear ? parseInt(formData.deathYear, 10) : null,
        phoneNumber: formData.phoneNumber,
        occupation: formData.occupation || null,
        education: formData.education || null,
        address: formData.address || null,
      };

    // Save user to the database
    const newUser = await prisma.user.create({
      data: user,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add user" },
      { status: 500 }
    );
  }
} 