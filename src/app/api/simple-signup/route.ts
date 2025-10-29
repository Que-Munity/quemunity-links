import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, displayName, phone, birthday } = await request.json();

    // Basic validation
    if (!email || !password || !firstName || !lastName || !displayName || !birthday) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingByEmail = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingByEmail.rows.length > 0) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Check if display name already exists
    const existingByDisplay = await pool.query(
      'SELECT id FROM users WHERE display_name = $1',
      [displayName]
    );

    if (existingByDisplay.rows.length > 0) {
      return NextResponse.json(
        { message: 'Display name already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Parse birthday into a Date (expect yyyy-mm-dd)
    const birthdayDate = new Date(birthday);

    // Create user (attempt to insert new fields)
    const result = await pool.query(
      `INSERT INTO users (email, password, username, name, first_name, last_name, display_name, phone, birthday, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING id, email, username, name, display_name`,
      [
        email,
        hashedPassword,
        displayName || email.split('@')[0],
        `${firstName} ${lastName}`,
        firstName,
        lastName,
        displayName,
        phone || null,
        isNaN(birthdayDate.getTime()) ? null : birthdayDate,
      ]
    );

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        displayName: user.display_name
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}