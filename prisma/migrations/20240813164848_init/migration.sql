/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `parentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserPartner" (
    "partnerId" INTEGER NOT NULL,
    CONSTRAINT "UserPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChildren" (
    "childrenId" INTEGER NOT NULL,
    CONSTRAINT "UserChildren_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" DATETIME,
    "contactNumber" BIGINT,
    "currentLocation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("birthday", "contactNumber", "createdAt", "currentLocation", "id", "name", "updatedAt") SELECT "birthday", "contactNumber", "createdAt", "currentLocation", "id", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserPartner_partnerId_key" ON "UserPartner"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChildren_childrenId_key" ON "UserChildren"("childrenId");
