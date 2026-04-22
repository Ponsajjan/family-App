import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchMemberData } from "@/utils/memberUtils";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const token = request.cookies.get("token")?.value;
  const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";
  const loginAuthIds = JSON.parse(selectedAuthId);

  // Validate inputs
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNaN(id)) return NextResponse.json({ error: "Invalid Member ID" }, { status: 400 });

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;
    const userType = decoded.userType;
    if (!authId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { updatedAt } = await getAllAuthIds(authId, userType, "");

    const responseData = await fetchMemberData(id, loginAuthIds.length);

    if (!responseData) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    return NextResponse.json({
      data: responseData,
      _version: updatedAt
    });
  } catch (error) {
    console.error("Error fetching member data:", error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

