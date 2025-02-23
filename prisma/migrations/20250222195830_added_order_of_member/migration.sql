/*
  Warnings:

  - You are about to drop the column `moderatorContact` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `moderatorName` on the `Auth` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ModeratorList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moderatorName" TEXT NOT NULL,
    "moderatorContact" TEXT NOT NULL,
    "moderatorId" INTEGER NOT NULL,
    CONSTRAINT "ModeratorList_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Auth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "forDescendanceOf" TEXT NOT NULL,
    "mainMemberId" INTEGER NOT NULL,
    "moderatorPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Auth" ("forDescendanceOf", "id", "mainMemberId", "moderatorPassword", "password") SELECT "forDescendanceOf", "id", "mainMemberId", "moderatorPassword", "password" FROM "Auth";
DROP TABLE "Auth";
ALTER TABLE "new_Auth" RENAME TO "Auth";
CREATE UNIQUE INDEX "Auth_password_key" ON "Auth"("password");
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descendantOf" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "name" TEXT NOT NULL,
    "birthDate" INTEGER,
    "birthMonth" INTEGER,
    "birthYear" INTEGER,
    "deceased" BOOLEAN NOT NULL DEFAULT false,
    "deathDate" INTEGER,
    "deathMonth" INTEGER,
    "deathYear" INTEGER,
    "gender" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "occupation" TEXT,
    "education" TEXT,
    "descendant" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 1,
    "fatherId" INTEGER,
    "motherId" INTEGER,
    "partnerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "descendantOf", "education", "fatherId", "gender", "id", "motherId", "name", "occupation", "partnerId", "phoneNumber", "updatedAt", "verified") SELECT "address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "descendantOf", "education", "fatherId", "gender", "id", "motherId", "name", "occupation", "partnerId", "phoneNumber", "updatedAt", "verified" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
