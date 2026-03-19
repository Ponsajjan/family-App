import prisma from "@/db/db";

/**
 * Manually updates the `updatedAt` field of the Auth record associated with the family.
 * This is used for cache invalidation via versioning.
 * @param authId The ID of the Auth record to update.
 */
export async function bumpFamilyUpdateVersion(authId: number) {
  try {
    return await prisma.auth.update({
      where: { id: authId },
      data: { updatedAt: new Date() } // Forces the updatedAt to be refreshed
    });
  } catch (error) {
    console.error("Error bumping family update version:", error);
    // Non-critical error, we don't want to break the main flow if this fails
    return null;
  }
}
