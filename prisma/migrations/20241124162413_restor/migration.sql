/*
  Warnings:

  - You are about to drop the column `fatherId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `motherId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `Member` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MembersPartner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "divorced" BOOLEAN NOT NULL DEFAULT false,
    "partnerId" INTEGER NOT NULL,
    CONSTRAINT "MembersPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembersFather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fatherId" INTEGER NOT NULL,
    CONSTRAINT "MembersFather_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembersMother" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "motherId" INTEGER NOT NULL,
    CONSTRAINT "MembersMother_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembersChildren" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "childrenId" INTEGER NOT NULL,
    CONSTRAINT "MembersChildren_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_id" TEXT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "education", "gender", "id", "name", "occupation", "phoneNumber", "updatedAt") SELECT "address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "education", "gender", "id", "name", "occupation", "phoneNumber", "updatedAt" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
