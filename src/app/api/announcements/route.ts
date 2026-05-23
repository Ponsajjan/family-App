import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { z } from "zod";

const createSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(2000),
    type: z.enum(["general", "birth", "marriage", "event"]).default("general"),
    postedBy: z.string().min(1).max(100),
});

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        if (!authId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const announcements = await prisma.announcement.findMany({
            where: { authId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ announcements });
    } catch (error) {
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        if (!authId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const body = await request.json();
        const parsed = createSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const { title, content, type, postedBy } = parsed.data;
        const announcement = await prisma.announcement.create({
            data: { authId, title, content, type, postedBy },
        });

        return NextResponse.json({ announcement }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }
}
