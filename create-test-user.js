const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

async function createTestUser() {
  const usersFile = path.join(process.cwd(), 'users.json');
  
  // Create test user
  const testUser = {
    id: createId(),
    email: 'test@example.com',
    username: 'testuser',
    password: await bcrypt.hash('password123', 12),
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date().toISOString()
  };
  
  let users = [];
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(data);
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === testUser.email);
  if (existingUser) {
    console.log('✅ Test user already exists!');
    console.log('Email:', testUser.email);
    console.log('Password: password123');
    return;
  }
  
  users.push(testUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  
  console.log('✅ Test user created successfully!');
  console.log('Email:', testUser.email);
  console.log('Password: password123');
  console.log('');
  console.log('Now you can sign in at: http://localhost:3000/simple-signin');
}

createTestUser().catch(console.error);