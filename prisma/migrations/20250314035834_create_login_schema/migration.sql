-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "forDescendanceOf" TEXT NOT NULL,
    "mainMemberId" INTEGER,
    "moderatorPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Auth" ("forDescendanceOf", "id", "mainMemberId", "moderatorPassword", "password") SELECT "forDescendanceOf", "id", "mainMemberId", "moderatorPassword", "password" FROM "Auth";
DROP TABLE "Auth";
ALTER TABLE "new_Auth" RENAME TO "Auth";
CREATE UNIQUE INDEX "Auth_forDescendanceOf_key" ON "Auth"("forDescendanceOf");
CREATE UNIQUE INDEX "Auth_mainMemberId_key" ON "Auth"("mainMemberId");
CREATE UNIQUE INDEX "Auth_password_key" ON "Auth"("password");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
