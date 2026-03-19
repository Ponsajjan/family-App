import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const [familyTree, authRecord] = await Promise.all([
            prisma.familyTree.findUnique({
                where: { authId: authId },
                select: { data: true }
            }),
            prisma.auth.findUnique({
                where: { id: authId },
                select: { updatedAt: true }
            })
        ]);

        if (!familyTree) {
            return NextResponse.json({ error: "No chart found. Please update the chart first." }, { status: 404 });
        }

        return NextResponse.json({ treeData: familyTree.data }, {
            headers: {
                'X-Family-Last-Update': authRecord?.updatedAt.getTime().toString() || '0'
            }
        });
    } catch (error) {
        console.error("Error fetching relations chart:", error);
        return NextResponse.json(
            { error: "Failed to fetch relations chart" },
            { status: 500 }
        );
    }
}
