/*
  Warnings:

  - Added the required column `updatedAt` to the `nonDescendantRelation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_nonDescendantRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "siblingNames" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "nonDescendantRelation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_nonDescendantRelation" ("siblingNames", "fatherName", "id", "memberId", "motherName") SELECT "siblingNames", "fatherName", "id", "memberId", "motherName" FROM "nonDescendantRelation";
DROP TABLE "nonDescendantRelation";
ALTER TABLE "new_nonDescendantRelation" RENAME TO "nonDescendantRelation";
CREATE UNIQUE INDEX "nonDescendantRelation_memberId_key" ON "nonDescendantRelation"("memberId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
