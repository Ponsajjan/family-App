-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "mainMemberId" INTEGER,
    "mainMemberNameRef" TEXT,
    "moderatorPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "authId" INTEGER NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "name" TEXT NOT NULL,
    "birthDate" INTEGER,
    "birthMonth" INTEGER,
    "birthYear" INTEGER,
    "deceased" BOOLEAN NOT NULL DEFAULT false,
    "deathDate" INTEGER,
    "deathMonth" INTEGER,
    "deathYear" INTEGER,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "occupation" TEXT,
    "education" TEXT,
    "additionalInfo" TEXT,
    "descendant" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 1,
    "fatherId" INTEGER,
    "motherId" INTEGER,
    "partnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestDetails" (
    "id" SERIAL NOT NULL,
    "authId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nonDescendantRelation" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "siblingNames" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nonDescendantRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorList" (
    "id" SERIAL NOT NULL,
    "moderatorName" TEXT NOT NULL,
    "moderatorContact" TEXT NOT NULL,
    "authId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeratorList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_mainMemberId_key" ON "Auth"("mainMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_mainMemberNameRef_key" ON "Auth"("mainMemberNameRef");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_password_key" ON "Auth"("password");

-- CreateIndex
CREATE UNIQUE INDEX "nonDescendantRelation_memberId_key" ON "nonDescendantRelation"("memberId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDetails" ADD CONSTRAINT "RequestDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nonDescendantRelation" ADD CONSTRAINT "nonDescendantRelation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorList" ADD CONSTRAINT "ModeratorList_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
