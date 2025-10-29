const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function diagnoseLogin() {
  console.log('🔍 Diagnosing your login issue...\n');
  
  // Read users file
  const usersFile = path.join(process.cwd(), 'users.json');
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  
  // Find your user
  const yourUser = users.find(u => u.email === 'quemunity.service@gmail.com');
  
  if (!yourUser) {
    console.log('❌ User not found in database!');
    return;
  }
  
  console.log('✅ User found in database:');
  console.log('📧 Email:', yourUser.email);
  console.log('👤 Username:', yourUser.username);
  console.log('🔒 Stored password hash:', yourUser.password);
  
  // Test password comparison
  const passwordToTest = 'Bears1022!';
  console.log('\n🧪 Testing password:', passwordToTest);
  
  try {
    const isValid = await bcrypt.compare(passwordToTest, yourUser.password);
    console.log('🔐 Password comparison result:', isValid);
    
    if (isValid) {
      console.log('\n✅ PASSWORD IS CORRECT!');
      console.log('The issue must be somewhere else in the login flow.');
    } else {
      console.log('\n❌ PASSWORD MISMATCH!');
      console.log('Let me create a new hash for your password...');
      
      const newHash = await bcrypt.hash(passwordToTest, 12);
      console.log('🔑 New password hash:', newHash);
      
      // Update the user
      yourUser.password = newHash;
      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      
      console.log('✅ Password updated in database!');
      console.log('Try logging in again now.');
    }
  } catch (error) {
    console.log('🚨 Error during password comparison:', error.message);
  }
}

diagnoseLogin().catch(console.error);