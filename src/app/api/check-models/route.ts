import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Import Prisma and check what's available
    const { PrismaClient } = await import('@prisma/client');
    console.log('PrismaClient imported successfully');
    
    // Create instance and check available properties
    const prisma = new PrismaClient();
    const allKeys = Object.getOwnPropertyNames(prisma);
    const modelKeys = allKeys.filter(key => !key.startsWith('_') && !key.startsWith('$') && key !== 'constructor');
    
    console.log('All Prisma keys:', allKeys);
    console.log('Model-like keys:', modelKeys);
    
    // Check specifically for betaTester variations
    const betaKeys = allKeys.filter(key => key.toLowerCase().includes('beta'));
    console.log('Beta-related keys:', betaKeys);
    
    // Try to access betaTester directly
    let betaTesterExists = false;
    let betaTesterType = 'undefined';
    
    try {
      const betaTester = (prisma as any).betaTester;
      if (betaTester) {
        betaTesterExists = true;
        betaTesterType = typeof betaTester;
        console.log('betaTester found:', typeof betaTester);
      }
    } catch (error) {
      console.log('Error accessing betaTester:', error);
    }
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      allKeys: allKeys.slice(0, 50), // Limit output
      modelKeys,
      betaKeys,
      betaTesterExists,
      betaTesterType,
      totalKeys: allKeys.length
    });
    
  } catch (error) {
    console.error('Model check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}