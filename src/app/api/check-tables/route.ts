import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('Starting migration...');
    
    // Use Prisma's createMany to test connection and create records if tables exist
    // If tables don't exist, this will fail and we'll know we need to run migrations
    try {
      await prisma.betaTester.findFirst();
      console.log('BetaTester table already exists');
      return NextResponse.json({
        success: true,
        message: 'Tables already exist'
      });
    } catch (error: any) {
      console.log('Tables do not exist, need to run proper migration');
      return NextResponse.json({
        success: false,
        error: 'Tables do not exist. Please run: npx prisma migrate deploy',
        needsMigration: true
      });
    }

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