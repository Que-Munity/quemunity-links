'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings, ChefHat } from 'lucide-react';
import { useState } from 'react';

export default function UserNav() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-medium transition-colors"
        >
          Sign In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg p-2"
      >
        {session.user.image ? (
          <img
            className="w-8 h-8 rounded-full"
            src={session.user.image}
            alt={session.user.name || session.user.username || 'User'}
          />
        ) : (
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {(session.user.name || session.user.username || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden md:block font-medium">
          {session.user.name || session.user.username}
        </span>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || session.user.username}
                </p>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
              
              <Link
                href="/recipes/create"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <ChefHat className="w-4 h-4 mr-3" />
                Create Recipe
              </Link>

              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4 mr-3" />
                My Profile
              </Link>

              <Link
                href="/recipes"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <ChefHat className="w-4 h-4 mr-3" />
                My Recipes
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}