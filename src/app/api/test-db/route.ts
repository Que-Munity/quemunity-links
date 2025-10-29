import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check environment variables first
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL environment variable not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test raw connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      message: 'Database connection successful',
      userCount: userCount,
      hasDbUrl: !!dbUrl,
      dbUrlPreview: dbUrl ? `${dbUrl.substring(0, 20)}...` : 'not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}