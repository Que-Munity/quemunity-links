'use client';

import { useState } from 'react';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ LOGIN SUCCESS: Welcome ${data.user.name}!`);
      } else {
        setResult(`❌ LOGIN FAILED: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`❌ NETWORK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const testRegister = async () => {
    setIsLoading(true);
    setResult('Testing registration...');
    
    try {
      const response = await fetch('/api/simple-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: 'Test User',
          email, 
          password 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ REGISTRATION SUCCESS: User created with ID ${data.user.id}`);
      } else {
        setResult(`❌ REGISTRATION FAILED: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`❌ NETWORK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
          Authentication Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter password"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={testLogin}
              disabled={!email || !password || isLoading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              Test Login
            </button>
            
            <button
              onClick={testRegister}
              disabled={!email || !password || isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Test Register
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md text-sm">
            <h3 className="font-bold mb-2">Test Credentials:</h3>
            <p>Email: test@example.com</p>
            <p>Password: password123</p>
            <p className="mt-2 text-gray-600">Or use your email: quemunity.service@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}