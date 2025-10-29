const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

async function resetUsers() {
  const usersFile = path.join(process.cwd(), 'users.json');
  
  console.log('🔄 Resetting users database...');
  
  // Create fresh test users
  const users = [
    {
      id: createId(),
      email: 'test@example.com',
      username: 'testuser',
      password: await bcrypt.hash('password123', 12),
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Ask for your email
  console.log('\n📧 What email would you like to use?');
  console.log('Default: yourname@example.com');
  
  // For now, create a second test user with a different email
  const yourUser = {
    id: createId(),
    email: 'yourname@example.com',
    username: 'yourname',
    password: await bcrypt.hash('mypassword123', 12),
    firstName: 'Your',
    lastName: 'Name',
    createdAt: new Date().toISOString()
  };
  
  users.push(yourUser);
  
  // Write to file
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  
  console.log('✅ Users database reset!');
  console.log('\n🔑 Available accounts:');
  console.log('1. Email: test@example.com | Password: password123');
  console.log('2. Email: yourname@example.com | Password: mypassword123');
  console.log('\nTry signing in with either account!');
}

resetUsers().catch(console.error);