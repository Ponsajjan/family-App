-- AlterTable
ALTER TABLE "FamilyTree" ADD COLUMN     "lastBuildStartedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed',
ALTER COLUMN "data" DROP NOT NULL;
