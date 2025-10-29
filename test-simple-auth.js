// Quick test of the simple auth system
async function testSimpleAuth() {
  console.log('🚀 Testing Simple Authentication System...\n');
  
  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await fetch('http://localhost:3000/api/simple-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password12345',
        firstName: 'Test',
        lastName: 'User',
      }),
    });

    const registerData = await registerResponse.json();
    console.log('Registration Status:', registerResponse.status);
    console.log('Registration Response:', registerData);
    console.log('✅ Registration test completed\n');

    // Test 2: Try to login
    console.log('2️⃣ Testing Login...');
    const loginResponse = await fetch('http://localhost:3000/api/simple-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password12345',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginData);
    console.log('✅ Login test completed\n');

    // Summary
    if (registerResponse.ok && loginResponse.ok) {
      console.log('🎉 SUCCESS! Both registration and login are working!');
      console.log('📍 You can now test at: http://localhost:3000/simple-signup');
    } else {
      console.log('❌ Some tests failed. Check the responses above.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSimpleAuth();