import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function POST(request: Request) {
  try {
    const formData = await request.json(); 
    const deceased = formData.deceased === true;
    
    // Utility function
    const capitalizeWords = (name: string) => {
      return name.replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\b\w+\b/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .replace(/,\s*\w/g, (char) => char.toUpperCase());
    }
    const formatTwoDigits = (value: number | null) => {
      return value !== null ? parseInt(String(value).padStart(2, '0'), 10) : null;
    };

    const generateUniqueString = (input: string): string => {
      const formattedString = input.replace(/\s+/g, "_");
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${formattedString}_${randomString}`;
    };

    const descendantOf = generateUniqueString(formData.name);

    const member = {
      name: capitalizeWords(formData.name),
      descendantOf: descendantOf,
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

    const newLoginSet = await prisma.auth.create({
      data: { 
        forDescendanceOf: descendantOf, 
        password: formData.password, 
        mainMemberId: newMember.id,            
        moderatorPassword: formData.password                
      }
    });
    return NextResponse.json({ 
      success: true, 
      message: "Login set created successfully", 
      member: newLoginSet });
  } catch (error) {
    console.error("Error creating Login set:", error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
}
