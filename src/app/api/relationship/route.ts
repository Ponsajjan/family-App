import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { computeRelationship, fetchRelationshipGraph } from "@/utils/relationshipUtils";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const personAId = Number(searchParams.get("personAId"));
  const personBId = Number(searchParams.get("personBId"));

  if (!personAId || !personBId) {
    return NextResponse.json({ error: "personAId and personBId are required" }, { status: 400 });
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const members = await fetchRelationshipGraph(authId);
    const membersById = new Map(members.map((m) => [m.id, m]));

    const personA = membersById.get(personAId);
    const personB = membersById.get(personBId);

    if (!personA || !personB) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const relationOfBToA = computeRelationship(personAId, personBId, members);
    const relationOfAToB = computeRelationship(personBId, personAId, members);

    return NextResponse.json({
      personA: { id: personA.id, name: personA.name, gender: personA.gender },
      personB: { id: personB.id, name: personB.name, gender: personB.gender },
      relationOfBToA,
      relationOfAToB,
    });
  } catch (error) {
    console.error("Error computing relationship:", error);
    return NextResponse.json(
      { error: "Failed to compute relationship" },
      { status: 500 }
    );
  }
}
