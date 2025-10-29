import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if Prisma is working at all
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('Prisma client created successfully');
    
    // Test basic connection
    await prisma.$connect();
    console.log('Database connected');
    
    // Test raw query
    const result = await prisma.$executeRawUnsafe('SELECT 1 as test');
    console.log('Raw query result:', result);
    
    // Test if betaTester exists on client
    console.log('Prisma client keys:', Object.keys(prisma));
    console.log('Has betaTester?', 'betaTester' in prisma);
    
    if ('betaTester' in prisma) {
      const count = await (prisma as any).betaTester.count();
      console.log('BetaTester count:', count);
      
      return NextResponse.json({
        success: true,
        message: 'All tests passed',
        count: count,
        hasModel: true
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'BetaTester model not found on Prisma client',
        prismaKeys: Object.keys(prisma),
        hasModel: false
      });
    }
    
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}