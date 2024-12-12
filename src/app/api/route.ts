import { NextResponse } from "next/server";
import prisma from "@/db/db"; // Adjust the import path as needed
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forType = searchParams.get("for");
  const gender = searchParams.get("gender");
  const showCousin = searchParams.get("showCousin") === "true"; // Parse to boolean

  // Parse excludeId to a number array
  const excludeIdParam = searchParams.get("excludeId");
  const excludeId = excludeIdParam
    ? excludeIdParam.split(",").map(Number).filter(Boolean)
    : [];

  try {
    let memberList: any[] = [];

    // Calculate current year minus 18
    const currentYear = new Date().getFullYear();
    const yearThreshold = currentYear - 18;


    switch (forType) {
      case "selectMember":
        memberList = await prisma.member.findMany({
          select: {
            id: true,
            name: true,
            gender: true,
            descendant: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "selectPartner":
        memberList = await prisma.member.findMany({
          where: {
            gender: gender === "Male" ? "Female" : gender === "Female" ? "Male" : undefined,
            partnerId: null,
            id: { notIn: excludeId },
            descendant: showCousin,
            AND: {
              OR: [
                { birthYear: { lt: yearThreshold } }, // Birth year less than current year - 18
                { birthYear: null },
              ],
            }
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            father: { select: { name: true } },
            mother: { select: { name: true } },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "selectChildren":
        memberList = await prisma.member.findMany({
          where: {
            id: { notIn: excludeId },
            fatherId: null,
            motherId: null,
            descendant: true,
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "editRelationship":
        memberList = await prisma.member.findMany({
          where: {
            OR: [
              { fatherOf: { some: {} } },
              { motherOf: { some: {} } },
              { partnerId: { not: null } },
            ],
          },
          select: {
            id: true,
            name: true,
            gender: true,
            birthYear: true,
            partner: { select: { name: true } },
          },
          orderBy: { name: "asc" },
        });
        break;

      default:
        console.warn("Invalid 'forType' parameter:", forType);
        return NextResponse.json(
          { error: `'${forType}' is not a valid 'for' parameter` },
          { status: 400 }
        );
    }

    return NextResponse.json(memberList);
  } catch (error) {
    console.error("Error fetching memberList:", error);
    return NextResponse.json({ error: "Error fetching memberList" }, { status: 500 });
  }
}
