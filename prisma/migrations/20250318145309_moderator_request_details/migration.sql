/*
  Warnings:

  - Made the column `descendantOf` on table `RequestDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `RequestDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `RequestDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RequestDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "descendantOf" TEXT NOT NULL,
    CONSTRAINT "RequestDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RequestDetails" ("descendantOf", "details", "gender", "id", "memberId", "name", "type") SELECT "descendantOf", "details", "gender", "id", "memberId", "name", "type" FROM "RequestDetails";
DROP TABLE "RequestDetails";
ALTER TABLE "new_RequestDetails" RENAME TO "RequestDetails";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
