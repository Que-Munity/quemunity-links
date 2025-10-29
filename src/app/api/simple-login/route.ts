import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
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

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN REQUEST RECEIVED ===');
    const body = await request.json();
    console.log('Raw body:', body);
    console.log('Request body keys:', Object.keys(body));
    console.log('Email:', body.email);
    console.log('Password provided:', !!body.password);
    
    const { email, password } = body;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email and password are required' 
        },
        { status: 400 }
      );
    }
    
    // Get existing users
    const users = getUsers();
    console.log('Looking for user in', users.length, 'users');
    
    // Find user
    const user = users.find((u: any) => u.email === email.toLowerCase());
    
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }
    
    console.log('Login successful for:', email);
    
    // Return success (don't include password)
    const { password: _, ...userResponse } = user;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userResponse,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}