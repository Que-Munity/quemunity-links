// Test script to verify authentication works
import bcrypt from 'bcryptjs';

async function createTestUser() {
  console.log('Creating test user with proper password hash...');
  
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Password:', password);
  console.log('Hash length:', hashedPassword.length);
  console.log('Hash starts with:', hashedPassword.substring(0, 10));
  
  // Test password verification
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password verification:', isValid ? 'SUCCESS' : 'FAILED');
  
  // Test wrong password
  const isWrong = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Wrong password test:', isWrong ? 'FAILED (should be false)' : 'SUCCESS (correctly rejected)');
}

createTestUser();