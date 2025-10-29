const http = require('http');

// Test login with your exact credentials
const loginData = JSON.stringify({
  email: 'quemunity.service@gmail.com',
  password: 'Bears1022!'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/simple-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('🧪 Testing your login credentials...');
console.log('Email: quemunity.service@gmail.com');
console.log('Password: Bears1022!');

const req = http.request(options, (res) => {
  let data = '';
  
  console.log('\n📊 Response Status:', res.statusCode);
  console.log('📊 Response Headers:', res.headers);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📝 Response Body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n📋 Parsed Response:', parsed);
      
      if (res.statusCode === 200) {
        console.log('\n✅ SUCCESS! Your login works!');
        console.log('👤 User info:', parsed.user);
      } else {
        console.log('\n❌ FAILED! Error:', parsed.error);
      }
    } catch (e) {
      console.log('\n⚠️  Could not parse JSON response');
    }
  });
});

req.on('error', (err) => {
  console.error('\n🚨 Request error:', err.message);
});

req.write(loginData);
req.end();