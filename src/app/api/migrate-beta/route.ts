import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST() {
  // Create fresh Prisma client to avoid prepared statement conflicts
  const prisma = new PrismaClient();
  
  try {
    console.log('Starting migration...');
    
    // Test database connection first
    await prisma.$executeRawUnsafe('SELECT 1');
    console.log('Database connection successful');
    
    // Create BetaTester table (mapped to beta_testers)
    console.log('Creating beta_testers table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "beta_testers" (
        "id" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "experience" TEXT NOT NULL,
        "equipment" TEXT NOT NULL,
        "interests" TEXT NOT NULL,
        "motivation" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "inviteCode" TEXT,
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('beta_testers table created successfully');
    
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_email_key" ON "beta_testers"("email");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_inviteCode_key" ON "beta_testers"("inviteCode");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_userId_key" ON "beta_testers"("userId");
    `);
    console.log('beta_testers indexes created successfully');

    // Create ChatMessage table (mapped to chat_messages)
    console.log('Creating chat_messages table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" TEXT NOT NULL,
        "betaTesterId" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
        "adminName" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('chat_messages table created successfully');

    // Add foreign key constraint if it doesn't exist
    console.log('Adding foreign key constraint...');
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_betaTesterId_fkey" 
        FOREIGN KEY ("betaTesterId") REFERENCES "beta_testers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      `);
      console.log('Foreign key constraint added successfully');
    } catch (error: any) {
      // Ignore error if constraint already exists
      if (!error.message?.includes('already exists')) {
        console.error('Foreign key constraint error:', error);
        throw error;
      }
      console.log('Foreign key constraint already exists, skipping');
    }

    return NextResponse.json({
      success: true,
      message: 'Beta tables created successfully'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}