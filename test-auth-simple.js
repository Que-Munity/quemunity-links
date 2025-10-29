async function testAuth() {
  console.log('Testing registration API...');
  
  try {
    // Test registration
    const registerResponse = await fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      }),
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', {
      status: registerResponse.status,
      data: registerData
    });

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testAuth();