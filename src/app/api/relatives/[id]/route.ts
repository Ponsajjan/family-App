import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed

export async function GET(request: Request, context: any) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const verifiedOnly = url.searchParams.get('verified') === 'true';

  if (isNaN(id)) {
    return NextResponse.json({ error: "Member ID is required and should be a valid number." });
  }

  try {
    // Step 1: Fetch the member and their direct relations
    const member = await prisma.member.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        gender: true,
        verified: true,
        phoneNumber: true,
        address: true,
        occupation: true,
        education: true,
        birthDate: true,
        birthMonth: true,
        birthYear: true,
        deceased: true,
        deathDate: true,
        deathMonth: true,
        deathYear: true,
        descendant: true,
        father: {
          select: { id: true, name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        mother: {
          select: { id: true, name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        partner: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        fatherOf: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        motherOf: {
          select: { name: true },
          where: verifiedOnly ? { verified: true } : undefined,
        },
        nonDescendantRelation: {
          select: {
            id: true,
            fatherName: true,
            motherName: true,
            siblingNames: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Step 2: Fetch siblings using father's and mother's IDs
    const siblingSet = new Set<string>(); // To avoid duplicate names

    if (member.father?.id) {
      const fatherChildren = await prisma.member.findMany({
        where: {
          fatherId: member.father.id,
          id: { not: id }, // Exclude the current member
          ...(verifiedOnly && { verified: true }),
        },
        select: { name: true },
      });
      fatherChildren.forEach((child) => siblingSet.add(child.name));
    }

    if (member.mother?.id) {
      const motherChildren = await prisma.member.findMany({
        where: {
          motherId: member.mother.id,
          id: { not: id }, // Exclude the current member
          ...(verifiedOnly && { verified: true }),
        },
        select: { name: true },
      });
      motherChildren.forEach((child) => siblingSet.add(child.name));
    }

    // Convert the sibling set to an array
    const siblings = Array.from(siblingSet);

    // Step 3: Respond with enriched data
    return NextResponse.json({
      data: {
        ...member,
        siblings,
      },
    });
  } catch (error) {
    console.error("Error fetching member data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}