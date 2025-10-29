import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test if we can access the BetaTester table
    const count = await prisma.betaTester.count();
    console.log('BetaTester count:', count);
    
    return NextResponse.json({
      success: true,
      message: 'BetaTester table accessible',
      count: count
    });
  } catch (error) {
    console.error('BetaTester table test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    console.log('Debug signup request:', requestBody);
    
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      experience, 
      equipment, 
      interests, 
      motivation 
    } = requestBody;

    // Test database connection
    console.log('Testing database connection...');
    const testResult = await prisma.$executeRawUnsafe('SELECT 1 as test');
    console.log('Database connection test result:', testResult);

    // Test BetaTester table access
    console.log('Testing BetaTester table access...');
    const tableCount = await prisma.betaTester.count();
    console.log('Current BetaTester count:', tableCount);

    // Validation
    if (!firstName || !lastName || !email || !experience || !equipment || !motivation) {
      console.log('Validation failed:', { firstName, lastName, email, experience, equipment, motivation });
      return NextResponse.json(
        { error: 'Missing required fields', details: { firstName: !!firstName, lastName: !!lastName, email: !!email, experience: !!experience, equipment: !!equipment, motivation: !!motivation } },
        { status: 400 }
      );
    }

    // Check if email already exists
    console.log('Checking for existing email...');
    const existingTester = await prisma.betaTester.findUnique({
      where: { email },
    });
    console.log('Existing tester check result:', existingTester);

    if (existingTester) {
      return NextResponse.json(
        { error: 'Email already registered for beta program' },
        { status: 409 }
      );
    }

    // Check approved count
    console.log('Checking approved count...');
    const approvedCount = await prisma.betaTester.count({
      where: { status: 'APPROVED' },
    });
    console.log('Approved count:', approvedCount);

    const status = approvedCount >= 50 ? 'WAITLIST' : 'PENDING';

    // Generate invite code for approved users
    const inviteCode = status === 'PENDING' ? Math.random().toString(36).substring(2, 8).toUpperCase() : null;

    console.log('Creating new beta tester...');
    // Create new beta tester
    const betaTester = await prisma.betaTester.create({
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
        status,
        inviteCode,
      },
    });

    console.log('Beta tester created successfully:', betaTester.id);

    return NextResponse.json({
      success: true,
      message: status === 'PENDING' 
        ? 'Application submitted successfully! You\'ll receive an invite code soon.' 
        : 'Added to waitlist. We\'ll contact you when spots open up.',
      status,
      inviteCode: status === 'PENDING' ? inviteCode : undefined
    });

  } catch (error) {
    console.error('Debug signup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
}