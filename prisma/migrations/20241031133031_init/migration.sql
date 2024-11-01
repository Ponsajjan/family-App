-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_id" TEXT,
    "name" TEXT NOT NULL,
    "birthday" DATETIME,
    "deceased" BOOLEAN NOT NULL DEFAULT false,
    "deathday" DATETIME,
    "gender" TEXT,
    "phoneNumber" TEXT,
    "Address" TEXT,
    "occupation" TEXT,
    "Education" TEXT,
    "Descendant" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserPartner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partnerId" INTEGER NOT NULL,
    CONSTRAINT "UserPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fatherId" INTEGER NOT NULL,
    CONSTRAINT "UserFather_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserMother" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "motherId" INTEGER NOT NULL,
    CONSTRAINT "UserMother_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChildren" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "childrenId" INTEGER NOT NULL,
    CONSTRAINT "UserChildren_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAdditionalInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT,
    "details" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "UserAdditionalInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPartner_partnerId_key" ON "UserPartner"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFather_fatherId_key" ON "UserFather"("fatherId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMother_motherId_key" ON "UserMother"("motherId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChildren_childrenId_key" ON "UserChildren"("childrenId");
