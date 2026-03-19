import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

/**
 * Lightweight endpoint to check the current family data version.
 * Returns only the updatedAt timestamp.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const id = decoded.authId;

    if (!id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const authRecord = await prisma.auth.findUnique({
      where: { id },
      select: { updatedAt: true }
    });

    if (!authRecord) {
      return NextResponse.json({ error: "Auth record not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      updatedAt: authRecord.updatedAt.getTime() 
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
