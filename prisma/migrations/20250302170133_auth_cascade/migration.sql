/*
  Warnings:

  - A unique constraint covering the columns `[forDescendanceOf]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Member_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_descendantOf_fkey" FOREIGN KEY ("descendantOf") REFERENCES "Auth" ("forDescendanceOf") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "descendantOf", "education", "fatherId", "gender", "id", "motherId", "name", "occupation", "order", "partnerId", "phoneNumber", "updatedAt", "verified") SELECT "address", "birthDate", "birthMonth", "birthYear", "createdAt", "deathDate", "deathMonth", "deathYear", "deceased", "descendant", "descendantOf", "education", "fatherId", "gender", "id", "motherId", "name", "occupation", "order", "partnerId", "phoneNumber", "updatedAt", "verified" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_forDescendanceOf_key" ON "Auth"("forDescendanceOf");
