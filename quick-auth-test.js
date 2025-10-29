// Quick test for simple auth APIs
const http = require('http');

const makeRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });
    
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const testAuth = async () => {
  
  // Test registration
  console.log('🧪 Testing registration...');
  try {
    const registerData = JSON.stringify({
      email: 'testuser@example.com',
      username: 'testuser123',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    const registerOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/simple-register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': registerData.length
      }
    };

    const registerResponse = await makeRequest(registerOptions, registerData);
    console.log('Registration status:', registerResponse.status);
    console.log('Registration response:', registerResponse.data);
    
    if (registerResponse.status === 200) {
      console.log('✅ Registration successful!');
      
      // Test login
      console.log('\n🧪 Testing login...');
      const loginData = JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      });

      const loginOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/simple-login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      };

      const loginResponse = await makeRequest(loginOptions, loginData);
      console.log('Login status:', loginResponse.status);
      console.log('Login response:', loginResponse.data);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful!');
        console.log('\n🎉 Simple authentication is WORKING!');
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAuth();