import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';
import fs from 'fs';
import path from 'path';

// Simple file-based user storage for now
const usersFile = path.join(process.cwd(), 'users.json');

function getUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Error reading users file:', error);
  }
  return [];
}

function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.log('Error saving users:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email, username, password, firstName, lastName } = body;
    
    // Basic validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Get existing users
    const users = getUsers();
    console.log('Current users:', users.length);
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email.toLowerCase() || u.username === username.toLowerCase());
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = {
      id: createId(),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      experienceLevel: 'beginner',
      joinedAt: new Date().toISOString(),
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save users
    if (!saveUsers(users)) {
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }
    
    console.log('User created successfully:', newUser.email);
    
    // Return success (don't include password)
    const { password: _, ...userResponse } = newUser;
    
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userResponse,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}