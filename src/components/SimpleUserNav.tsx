'use client';

import Link from 'next/link';
import { User, LogOut, Settings, ChefHat } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SimpleUserNav() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          setUser(JSON.parse(currentUser));
        } catch (error) {
          localStorage.removeItem('currentUser');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/simple-signin"
          className="text-gray-700 hover:text-orange-600 font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/simple-signup"
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-orange-600"
      >
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-orange-600" />
        </div>
        <span className="font-medium">{user.name || 'User'}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            href={`/profile/${user?.username}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            <ChefHat className="w-4 h-4 mr-2" />
            Create Recipe
          </Link>
          <hr className="my-1" />
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}