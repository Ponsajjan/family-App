/*
  Warnings:

  - Added the required column `updatedAt` to the `PartnersRelation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PartnersRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "SiblingsNames" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PartnersRelation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PartnersRelation" ("SiblingsNames", "fatherName", "id", "memberId", "motherName") SELECT "SiblingsNames", "fatherName", "id", "memberId", "motherName" FROM "PartnersRelation";
DROP TABLE "PartnersRelation";
ALTER TABLE "new_PartnersRelation" RENAME TO "PartnersRelation";
CREATE UNIQUE INDEX "PartnersRelation_memberId_key" ON "PartnersRelation"("memberId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
