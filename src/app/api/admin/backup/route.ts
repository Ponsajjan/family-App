import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/client/client";

/**
 * GET: Export database data
 * Query Param: authId (optional) - if provided, exports only a specific family
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPayload = await verifyToken(token);

    if (!userPayload || userPayload.userType !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const authId = searchParams.get("authId") ? parseInt(searchParams.get("authId")!) : null;

    const data: any = {};

    if (authId) {
      // Single Family Backup
      data.type = "single";
      data.authId = authId;
      data.members = await prisma.member.findMany({ where: { authId } });
      data.requests = await prisma.requestDetails.findMany({ where: { authId } });
      data.nonDescendantRelations = await prisma.nonDescendantRelation.findMany({
        where: { member: { authId } },
      });
      data.moderators = await prisma.moderatorList.findMany({ where: { authId } });
    } else {
      // Full Database Backup
      data.type = "full";
      data.auths = await prisma.auth.findMany();
      data.members = await prisma.member.findMany();
      data.requests = await prisma.requestDetails.findMany();
      data.nonDescendantRelations = await prisma.nonDescendantRelation.findMany();
      data.moderators = await prisma.moderatorList.findMany();
      data.familyTrees = await prisma.familyTree.findMany();
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Backup Export] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Restore database from JSON
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPayload = await verifyToken(token);

    if (!userPayload || userPayload.userType !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backupData = await request.json();
    const { type, authId } = backupData;

    if (type === "single" && authId) {
       // Restore single family
       await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
         // 1. Delete existing data for this family
         await tx.requestDetails.deleteMany({ where: { authId } });
         await tx.nonDescendantRelation.deleteMany({ where: { member: { authId } } });
         await tx.moderatorList.deleteMany({ where: { authId } });
         await tx.familyTree.deleteMany({ where: { authId } });
         await tx.member.deleteMany({ where: { authId } });

         // 2. Restore members (preserving IDs where possible to maintain relations)
         if (backupData.members?.length > 0) {
            const membersToRestore = backupData.members.map((m: any) => {
               const { address, ...rest } = m;
               return {
                  ...rest,
                  currentAddress: rest.currentAddress || address,
               };
            });
            await tx.member.createMany({ data: membersToRestore });
         }

         // 3. Restore relations
         if (backupData.nonDescendantRelations?.length > 0) {
            await tx.nonDescendantRelation.createMany({ data: backupData.nonDescendantRelations });
         }

         // 4. Restore moderators
         if (backupData.moderators?.length > 0) {
            await tx.moderatorList.createMany({ data: backupData.moderators });
         }

         // 5. Restore requests
         if (backupData.requests?.length > 0) {
            await tx.requestDetails.createMany({ data: backupData.requests });
         }
       });

       return NextResponse.json({ message: "Family data restored successfully" });
    } else if (type === "full") {
       // Full Database Restore (Extremely dangerous!)
       await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
         // Delete everything
         await tx.familyTree.deleteMany();
         await tx.requestDetails.deleteMany();
         await tx.nonDescendantRelation.deleteMany();
         await tx.moderatorList.deleteMany();
         await tx.member.deleteMany();
         await tx.auth.deleteMany();

         // Restore Auths first (because others depend on it)
         if (backupData.auths?.length > 0) {
            await tx.auth.createMany({ data: backupData.auths });
         }
         
         if (backupData.members?.length > 0) {
            const membersToRestore = backupData.members.map((m: any) => {
               const { address, ...rest } = m;
               return {
                  ...rest,
                  currentAddress: rest.currentAddress || address,
               };
            });
            await tx.member.createMany({ data: membersToRestore });
         }

         if (backupData.nonDescendantRelations?.length > 0) {
            await tx.nonDescendantRelation.createMany({ data: backupData.nonDescendantRelations });
         }

         if (backupData.moderators?.length > 0) {
            await tx.moderatorList.createMany({ data: backupData.moderators });
         }

         if (backupData.requests?.length > 0) {
            await tx.requestDetails.createMany({ data: backupData.requests });
         }
         
         if (backupData.familyTrees?.length > 0) {
            await tx.familyTree.createMany({ data: backupData.familyTrees });
         }
       });

       return NextResponse.json({ message: "Full database restored successfully" });
    }

    return NextResponse.json({ error: "Invalid backup type" }, { status: 400 });
  } catch (error: any) {
    console.error("[Backup Restore] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

