/*
  Warnings:

  - You are about to drop the column `partner1Id` on the `Partnership` table. All the data in the column will be lost.
  - You are about to drop the column `partner2Id` on the `Partnership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[person1Id,person2Id]` on the table `Partnership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `person1Id` to the `Partnership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person2Id` to the `Partnership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Partnership" DROP CONSTRAINT "Partnership_partner1Id_fkey";

-- DropForeignKey
ALTER TABLE "Partnership" DROP CONSTRAINT "Partnership_partner2Id_fkey";

-- DropIndex
DROP INDEX "Partnership_partner1Id_partner2Id_key";

-- AlterTable
ALTER TABLE "Partnership" DROP COLUMN "partner1Id",
DROP COLUMN "partner2Id",
ADD COLUMN     "person1Id" INTEGER NOT NULL,
ADD COLUMN     "person2Id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_person1Id_person2Id_key" ON "Partnership"("person1Id", "person2Id");

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_person1Id_fkey" FOREIGN KEY ("person1Id") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_person2Id_fkey" FOREIGN KEY ("person2Id") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
