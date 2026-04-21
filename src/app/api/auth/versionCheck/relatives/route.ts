import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "40", 10)));
    const searchQuery = searchParams.get("search")?.trim() || "";
    const clientVersion = searchParams.get("version");

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";

        const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);
        
        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        const baseSkip = (page - 1) * limit;
        const skip = page === 1 ? baseSkip : baseSkip - 1;
        const take = page === 1 ? limit : limit + 1;

        const members = await prisma.member.findMany({
            where: {
                authId: { in: allAuthIds },
                ...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
            },
            select: {
                id: true, name: true, gender: true, phoneNumber: true,
                father: { select: { name: true } },
                mother: { select: { name: true } },
                partner: { select: { name: true } },
            },
            orderBy: { name: "asc" },
            skip,
            take,
        });

        const totalCount = await prisma.member.count({
            where: {
                authId: { in: allAuthIds },
                ...(searchQuery && { name: { contains: searchQuery } }),
            },
        });

        const groupedData: any[] = [];
        let previousFirstLetter = '';
        if (page > 1 && members.length > 0) {
            const previousItem = members.shift();
            previousFirstLetter = previousItem!.name.charAt(0).toUpperCase();
        }

        members.forEach((member, index) => {
            const firstLetter = member.name.charAt(0).toUpperCase();
            if ((page === 1 && index === 0) || (firstLetter !== previousFirstLetter)) {
                groupedData.push({ id: firstLetter, name: firstLetter, gender: "Letter" });
                previousFirstLetter = firstLetter;
            }
            groupedData.push(member);
        });

        return NextResponse.json({
            mismatch: true,
            data: {
                data: groupedData,
                totalCount: totalCount + 1,
                _version: updatedAt,
            }
        });
    } catch (error) {
        console.error('Relatives Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
