/*
  Warnings:

  - You are about to drop the column `Address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Descendant` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Education` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_id" TEXT,
    "name" TEXT NOT NULL,
    "birthday" DATETIME,
    "deceased" BOOLEAN NOT NULL DEFAULT false,
    "deathday" DATETIME,
    "gender" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "occupation" TEXT,
    "education" TEXT,
    "descendant" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("birthday", "createdAt", "deathday", "deceased", "gender", "id", "name", "occupation", "phoneNumber", "reference_id", "updatedAt") SELECT "birthday", "createdAt", "deathday", "deceased", "gender", "id", "name", "occupation", "phoneNumber", "reference_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
