/*
  Warnings:

  - You are about to drop the column `memberId` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `mainMemberId` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorContact` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorName` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorPassword` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "forDescendanceOf" TEXT NOT NULL,
    "mainMemberId" INTEGER NOT NULL,
    "moderatorName" TEXT NOT NULL,
    "moderatorContact" TEXT NOT NULL,
    "moderatorPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Auth" ("forDescendanceOf", "id", "password") SELECT "forDescendanceOf", "id", "password" FROM "Auth";
DROP TABLE "Auth";
ALTER TABLE "new_Auth" RENAME TO "Auth";
CREATE UNIQUE INDEX "Auth_password_key" ON "Auth"("password");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
