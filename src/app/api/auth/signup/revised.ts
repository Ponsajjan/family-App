import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    if (!formData.name || !formData.gender || !formData.password) {
      return NextResponse.json(
        { error: "Name, gender, and password are required." },
        { status: 400 }
      );
    }

    const deceased = formData.deceased === true;

    const capitalizeWords = (name: string) =>
      name.replace(/\b\w/g, (char) => char.toUpperCase());

    const formatTwoDigits = (value: number | null) =>
      value !== null ? parseInt(String(value).padStart(2, "0")) : null;

    const generateUniqueString = (input: string): string => {
      const sanitizedString = input.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${sanitizedString}_${randomString}`;
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
      descendant: true,
    };

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the member
      const createdMember = await prisma.member.create({
        data: member,
      });

      // Create the auth record using the ID of the created member
      const authRecord = await prisma.auth.create({
        data: {
          forDescendanceOf: descendantOf,
          mainMemberId: -1,
          password: process.env.SUPER_ADMIN_PASSWORD || 'trust me, there is a password',
          moderatorName: "hi",
          moderatorContact: "hi",
          moderatorPassword: "hi"
        },
      });

      return { member: createdMember, auth: authRecord };
    });

    return NextResponse.json({
      success: true,
      message: "Login set created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating Login set:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
}