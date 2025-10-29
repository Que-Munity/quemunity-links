import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  
  try {
    const body = await req.json();
    console.log('Received beta signup:', body);
    
    // Test if betaTester property exists (case-sensitive)
    console.log('Testing betaTester property...');
    console.log('prisma.betaTester exists:', 'betaTester' in prisma);
    console.log('Type of prisma.betaTester:', typeof (prisma as any).betaTester);
    
    // Try different case variations
    const variations = ['betaTester', 'BetaTester', 'betatester', 'BETATESTER'];
    for (const variation of variations) {
      console.log(`${variation} exists:`, variation in prisma);
    }
    
    // Try to access the betaTester methods
    try {
      const testCount = await (prisma as any).betaTester.count();
      console.log('betaTester.count() worked! Count:', testCount);
      
      // If count works, try the actual signup
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        experience, 
        equipment, 
        interests, 
        motivation 
      } = body;

      const newBetaTester = await (prisma as any).betaTester.create({
        data: {
          id: crypto.randomUUID(),
          firstName,
          lastName,
          email,
          phone: phone || null,
          experience,
          equipment,
          interests: Array.isArray(interests) ? interests.join(', ') : interests,
          motivation,
          status: 'PENDING',
          inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        },
      });
      
      console.log('Beta tester created successfully:', newBetaTester);
      
      return NextResponse.json({
        success: true,
        message: 'Beta signup successful!',
        id: newBetaTester.id
      });
      
    } catch (methodError) {
      console.error('Error calling betaTester methods:', methodError);
      return NextResponse.json({
        success: false,
        error: 'BetaTester method error: ' + (methodError as Error).message,
        stack: (methodError as Error).stack
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Final test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}