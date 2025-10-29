import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    // Test if BetaTester table exists
    try {
      const betaCount = await prisma.betaTester.count();
      return NextResponse.json({
        success: true,
        userCount,
        betaCount,
        message: 'Database connection successful'
      });
    } catch (betaError) {
      return NextResponse.json({
        success: false,
        userCount,
        error: 'BetaTester table issue',
        details: betaError instanceof Error ? betaError.message : 'Unknown error'
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}