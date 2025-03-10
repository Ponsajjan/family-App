/*
  Warnings:

  - You are about to drop the column `moderatorId` on the `ModeratorList` table. All the data in the column will be lost.
  - Added the required column `authId` to the `ModeratorList` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ModeratorList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moderatorName" TEXT NOT NULL,
    "moderatorContact" TEXT NOT NULL,
    "authId" INTEGER NOT NULL,
    CONSTRAINT "ModeratorList_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ModeratorList" ("id", "moderatorContact", "moderatorName") SELECT "id", "moderatorContact", "moderatorName" FROM "ModeratorList";
DROP TABLE "ModeratorList";
ALTER TABLE "new_ModeratorList" RENAME TO "ModeratorList";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
