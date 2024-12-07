/*
  Warnings:

  - You are about to drop the `MembersAdditionalInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MembersAdditionalInfo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MemberEditRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "MemberEditRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartnersRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "SiblingsNames" TEXT,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "PartnersRelation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
