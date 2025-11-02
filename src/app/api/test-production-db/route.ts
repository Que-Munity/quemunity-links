import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    const prisma = new PrismaClient();
    
    // Test database connection and check users table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      columns: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, displayName, phone, birthday } = await request.json();
    
    const prisma = new PrismaClient();
    
    // Test inserting a user
    const result = await prisma.$queryRaw`
      INSERT INTO users (email, password, username, name, first_name, last_name, display_name, phone, birthday, created_at)
      VALUES (${email}, ${password}, ${displayName}, ${firstName + ' ' + lastName}, ${firstName}, ${lastName}, ${displayName}, ${phone}, ${birthday}::timestamp, NOW())
      RETURNING id, email, username, name, display_name
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Test signup successful',
      user: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}