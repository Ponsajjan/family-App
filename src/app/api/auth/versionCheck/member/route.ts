import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const memberId = parseInt(searchParams.get("memberId") || "");
    const clientVersion = searchParams.get("version");

    if (isNaN(memberId)) {
        return NextResponse.json({ error: "Invalid memberId" }, { status: 400 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";
        const loginAuthIds = JSON.parse(selectedAuthId);

        const member = await prisma.member.findFirst({
            where: { id: memberId, authId: { in: (await getAllAuthIds(authId, userType, selectedAuthId)).allAuthIds } },
            select: {
                id: true, authId: true, name: true, gender: true, verified: true, phoneNumber: true,
                address: true, occupation: true, education: true, additionalInfo: true,
                birthDate: true, birthMonth: true, birthYear: true, deceased: true,
                deathDate: true, deathMonth: true, deathYear: true, descendant: true,
                fatherId: true, motherId: true,
                father: { select: { id: true, name: true } },
                mother: { select: { id: true, name: true } },
                partner: { select: { name: true } },
                fatherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
                motherOf: { select: { name: true, order: true }, orderBy: { order: 'asc' } },
                nonDescendantRelation: { select: { fatherName: true, motherName: true, siblingNames: true } },
                auth: { select: { mainMemberId: true } }
            }
        });

        if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

        const serverVersion = (await getAllAuthIds(authId, userType, selectedAuthId)).updatedAt;
        const serverVersionString = JSON.stringify(serverVersion);
        
        // Note: For member details, we often use the global version or the member-specific version.
        // The user specifically mentioned "SWR cache version", so we check against whatever they passed.
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        // Fetch parent IDs and siblings
        const parentIds = [member.fatherId, member.motherId].filter(Boolean) as number[];
        const siblings = parentIds.length > 0
            ? await prisma.member.findMany({
                where: { OR: [{ fatherId: { in: parentIds } }, { motherId: { in: parentIds } }], id: { not: memberId } },
                select: { name: true, order: true },
                orderBy: { order: 'asc' },
                distinct: ['name'],
            })
            : [];

        const mainMemberId = member.auth?.mainMemberId;
        const mainMemberName = mainMemberId
            ? (await prisma.member.findUnique({ where: { id: mainMemberId }, select: { name: true } }))?.name || null
            : null;

        const responseData = {
            generalInformation: {
                name: member.name, gender: member.gender, verified: member.verified, deceased: member.deceased,
                birthDate: member.birthDate, birthMonth: member.birthMonth, birthYear: member.birthYear,
                deathDate: member.deathDate, deathMonth: member.deathMonth, deathYear: member.deathYear
            },
            relationInformation: {
                father: member.father?.name, mother: member.mother?.name, partner: member.partner?.name,
                children: [...new Set([...member.fatherOf, ...member.motherOf])],
                siblings,
                nonDescendantRelations: member.nonDescendantRelation[0]
            },
            contactInformation: (member.phoneNumber || member.address) ? { phoneNumber: member.phoneNumber, address: member.address } : undefined,
            personalInformation: (member.occupation || member.education) ? { occupation: member.occupation, education: member.education } : undefined,
            additionalInformation: member.additionalInfo ? { additionalInfo: member.additionalInfo } : undefined,
            descendant: member.descendant,
            ...(mainMemberName && loginAuthIds.length > 1 && { mainMemberName })
        };

        return NextResponse.json({
            mismatch: true,
            data: {
                data: responseData,
                _version: serverVersion
            }
        });
    } catch (error) {
        console.error('Member Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
