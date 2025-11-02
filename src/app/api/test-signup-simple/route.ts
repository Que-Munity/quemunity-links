import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // First, let's just try to select from users to see what happens
    const testQuery = await pool.query('SELECT id, email FROM users LIMIT 1');
    
    return NextResponse.json({
      success: true,
      message: 'Test successful',
      sampleUser: testQuery.rows[0] || 'No users found',
      emailToTest: email
    });

  } catch (error) {
    console.error('Test signup error:', error);
    return NextResponse.json(
      { 
        message: 'Test failed', 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}