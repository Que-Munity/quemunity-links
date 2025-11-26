import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, displayName, phone, birthday } = await request.json();

    // Basic validation
    if (!email || !password || !firstName || !lastName || !displayName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingByEmail) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Check if display name already exists
    const existingByDisplay = await prisma.user.findUnique({
      where: { displayName }
    });

    if (existingByDisplay) {
      return NextResponse.json(
        { message: 'Display name already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Parse birthday into a Date (expect yyyy-mm-dd)
    const birthdayDate = birthday ? new Date(birthday) : null;

    // Create user using Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: displayName || email.split('@')[0],
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        displayName,
        phone: phone || null,
        birthday: birthdayDate && !isNaN(birthdayDate.getTime()) ? birthdayDate : null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        displayName: true,
        image: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}