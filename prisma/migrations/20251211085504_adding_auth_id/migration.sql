/*
  Warnings:

  - A unique constraint covering the columns `[memberAuthId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moderatorAuthId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Auth_mainMemberNameRef_key";

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "memberAuthId" TEXT,
ADD COLUMN     "moderatorAuthId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_memberAuthId_key" ON "Auth"("memberAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_moderatorAuthId_key" ON "Auth"("moderatorAuthId");
