async function testRegistration() {
  try {
    console.log('Testing registration...');
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test3@example.com',
        username: 'testuser3',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRegistration();