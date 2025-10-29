const http = require('http');

// Test login with the test user we created
const loginData = JSON.stringify({
  email: 'test@example.com',
  password: 'password123'
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

console.log('Testing login API...');
console.log('Data:', loginData);

const req = http.request(options, (res) => {
  let data = '';
  
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed with status:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.write(loginData);
req.end();