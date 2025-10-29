'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (adminToken && loginTime) {
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      // Auto-logout after 2 hours for security
      if (now - loginTimestamp < twoHours) {
        router.push('/admin');
        return;
      } else {
        // Session expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminLoginTime');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Your admin password - change this to whatever you want!
    const adminPassword = 'QueMunity2025!'; // <-- Change this password to whatever you prefer

    // Simple delay to prevent brute force attempts
    setTimeout(() => {
      if (password === adminPassword) {
        // Set session token and timestamp
        const token = `admin_${Date.now()}_${Math.random()}`;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Redirect to admin panel
        router.push('/admin');
      } else {
        setError('Invalid admin password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 1000); // 1 second delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Que-Munity</h1>
          <p className="text-orange-200 mt-2">Admin Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Enter your admin password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔒 Session expires after 2 hours of inactivity</p>
              <p>⚡ Rate limited to prevent brute force attacks</p>
              <p>🛡️ Admin access is logged for security</p>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-orange-200 hover:text-white transition-colors text-sm"
          >
            ← Back to Que-Munity
          </button>
        </div>
      </div>
    </div>
  );
}