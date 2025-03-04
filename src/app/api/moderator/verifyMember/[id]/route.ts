import { NextResponse } from "next/server";
import prisma from "@/db/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { verified } = await request.json();

    if (typeof verified !== "boolean") {
      return NextResponse.json(
        { error: "The 'verified' field is required and must be a boolean." },
        { status: 400 }
      );
    }

    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data: { verified },
    });

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member." },
      { status: 500 }
    );
  }
}