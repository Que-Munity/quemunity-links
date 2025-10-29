-- Drop existing tables and enum to start fresh
DROP TABLE IF EXISTS "chat_messages" CASCADE;
DROP TABLE IF EXISTS "beta_testers" CASCADE;
DROP TYPE IF EXISTS "BetaStatus" CASCADE;

-- Create BetaStatus enum with exact Prisma mapping
CREATE TYPE "BetaStatus" AS ENUM ('PENDING', 'APPROVED', 'WAITLIST', 'REJECTED');

-- Create beta_testers table with EXACT Prisma schema mapping
CREATE TABLE "beta_testers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "experience" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "status" "BetaStatus" NOT NULL DEFAULT 'PENDING',
    "inviteCode" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "beta_testers_email_key" ON "beta_testers"("email");
CREATE UNIQUE INDEX "beta_testers_inviteCode_key" ON "beta_testers"("inviteCode");
CREATE UNIQUE INDEX "beta_testers_userId_key" ON "beta_testers"("userId");

-- Create chat_messages table with exact Prisma mapping
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "betaTesterId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
    "adminName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_betaTesterId_fkey" 
    FOREIGN KEY ("betaTesterId") REFERENCES "beta_testers"("id") ON DELETE CASCADE ON UPDATE CASCADE;