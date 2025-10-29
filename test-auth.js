const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    const data = await response.json();
    console.log('Registration response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegistration();