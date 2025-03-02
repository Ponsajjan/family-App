/*
  Warnings:

  - A unique constraint covering the columns `[mainMemberId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auth_mainMemberId_key" ON "Auth"("mainMemberId");
