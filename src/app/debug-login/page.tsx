'use client';

import { useState } from 'react';

export default function UltraSimpleAuth() {
  const [status, setStatus] = useState('Ready to test login');
  const [debugInfo, setDebugInfo] = useState('');

  const testLogin = async () => {
    setStatus('🔄 Starting login test...');
    setDebugInfo('Step 1: Button clicked\n');
    
    try {
      setDebugInfo(prev => prev + 'Step 2: Preparing request\n');
      
      const requestData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      setDebugInfo(prev => prev + `Step 3: Request data: ${JSON.stringify(requestData)}\n`);
      setDebugInfo(prev => prev + 'Step 4: Sending fetch request to /api/simple-login\n');
      
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      setDebugInfo(prev => prev + `Step 5: Response received - Status: ${response.status}\n`);
      
      const responseText = await response.text();
      setDebugInfo(prev => prev + `Step 6: Raw response: ${responseText}\n`);
      
      let data: any;
      try {
        data = JSON.parse(responseText);
        setDebugInfo(prev => prev + `Step 7: Parsed JSON: ${JSON.stringify(data, null, 2)}\n`);
      } catch (parseError) {
        setDebugInfo(prev => prev + `Step 7: JSON parse error: ${parseError}\n`);
        setStatus('❌ Invalid JSON response');
        return;
      }
      
      if (response.ok && data.success) {
        setStatus('✅ LOGIN SUCCESS! Welcome ' + data.user.name);
        setDebugInfo(prev => prev + 'Step 8: Login successful!\n');
      } else {
        setStatus(`❌ Login failed: ${data.message || 'Unknown error'}`);
        setDebugInfo(prev => prev + `Step 8: Login failed - ${data.message}\n`);
      }
      
    } catch (error) {
      setStatus(`❌ Network error: ${error}`);
      setDebugInfo(prev => prev + `ERROR: ${error}\n`);
      console.error('Full error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">
          🚨 ULTRA SIMPLE LOGIN TEST 🚨
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-4">Testing with: test@example.com / password123</p>
          <button
            onClick={testLogin}
            className="bg-red-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-600"
          >
            🧪 TEST LOGIN NOW
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Status:</h3>
          <div className="bg-gray-100 p-4 rounded text-lg font-mono">
            {status}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">Debug Log:</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            <pre>{debugInfo || 'No debug info yet...'}</pre>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-100 rounded">
          <h4 className="font-bold">What should happen:</h4>
          <ol className="list-decimal list-inside text-sm mt-2">
            <li>Click button</li>
            <li>Send POST to /api/simple-login</li>
            <li>Server logs should show "=== LOGIN REQUEST RECEIVED ==="</li>
            <li>Should return success: true</li>
            <li>Status should show "LOGIN SUCCESS"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}