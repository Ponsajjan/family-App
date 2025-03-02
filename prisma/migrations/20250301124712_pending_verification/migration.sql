/*
  Warnings:

  - You are about to drop the `MemberEditRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MemberEditRequest";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RequestDetails" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "RequestDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
