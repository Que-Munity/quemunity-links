'use client';

import { useState } from 'react';

export default function SimpleAuth() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setMessage('Attempting login...');

    try {
      console.log('Sending login request:', { email, password });
      
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        setMessage('✅ Login successful!');
        setIsSignedIn(true);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setMessage(`❌ Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setUser(null);
    setMessage('Logged out');
    localStorage.removeItem('user');
  };

  // If signed in, show success page
  if (isSignedIn && user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 SUCCESS!</h1>
          <h2 className="text-xl mb-4">Welcome, {(user as any).name}!</h2>
          <p className="text-gray-600 mb-6">You are successfully logged in.</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-600">
          Simple Login Test
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm">
          <h3 className="font-bold mb-2">Test Credentials:</h3>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Password:</strong> password123</p>
          <p className="mt-2 text-xs text-gray-600">
            (These are pre-filled for you)
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Check the browser console (F12) for debug info
          </p>
        </div>
      </div>
    </div>
  );
}