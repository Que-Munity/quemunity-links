// Simple test to check database connection and user creation
import { prisma } from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test user creation
    console.log('Testing user creation...');
    
    const testEmail = 'testuser' + Date.now() + '@example.com';
    const testUsername = 'testuser' + Date.now();
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: testUsername,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        experienceLevel: 'beginner',
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        experienceLevel: true,
        joinedAt: true,
      },
    });
    
    console.log('✅ User created successfully:', user);
    
    // Test user lookup
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    console.log('✅ User found:', foundUser ? 'Yes' : 'No');
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();