// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/db/db";
// import { verifyToken } from "@/utils/auth";

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     const token = request.cookies.get("token")?.value;
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     try {
//         const decoded = await verifyToken(token);
//         const authId = decoded.authId;
//         if (!authId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

//         const { id } = await params;
//         const announcementId = parseInt(id, 10);
//         if (isNaN(announcementId)) {
//             return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//         }

//         const existing = await prisma.announcement.findUnique({ where: { id: announcementId } });
//         if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
//         if (existing.authId !== authId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//         await prisma.announcement.delete({ where: { id: announcementId } });
//         return NextResponse.json({ success: true });
//     } catch (error) {
//         if (error instanceof Error && error.name === "JsonWebTokenError") {
//             return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//         }
//         return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
//     }
// }
