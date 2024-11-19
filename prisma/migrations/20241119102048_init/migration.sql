/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAdditionalInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserChildren` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFather` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMother` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPartner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserAdditionalInfo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserChildren";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserFather";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserMother";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPartner";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Member" (
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

-- CreateTable
CREATE TABLE "MembersAdditionalInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "MembersAdditionalInfo_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
