/*
  Warnings:

  - You are about to drop the column `gender` on the `RequestDetails` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RequestDetails` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descendantOf" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "RequestDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RequestDetails" ("descendantOf", "details", "id", "memberId", "type") SELECT "descendantOf", "details", "id", "memberId", "type" FROM "RequestDetails";
DROP TABLE "RequestDetails";
ALTER TABLE "new_RequestDetails" RENAME TO "RequestDetails";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
