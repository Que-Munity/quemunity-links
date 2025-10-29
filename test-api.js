// Test script to verify all APIs are working
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3001';

async function testAPI(endpoint, options = {}) {
  try {
    console.log(`🧪 Testing ${endpoint}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    console.log(`✅ ${endpoint}: ${response.status} - ${response.ok ? 'SUCCESS' : 'FAILED'}`);
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${endpoint}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  // Test GET requests
  await testAPI('/api/recipes');
  await testAPI('/api/recipes/1'); // Should fail until we fix the temp user ID
  
  // Test user registration
  await testAPI('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    })
  });

  console.log('\n🎉 API Testing Complete!');
  console.log('💡 Check the browser at http://localhost:3001 to test the UI');
  console.log('🗄️ Check Prisma Studio at http://localhost:5555 to see database data');
}

runTests();