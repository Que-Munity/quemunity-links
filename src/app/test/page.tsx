'use client';

import Link from 'next/link';
import { CheckCircle, ExternalLink, Play, User, ChefHat, Star } from 'lucide-react';

export default function TestPage() {
  const testSteps = [
    {
      id: 1,
      title: "Sign Up",
      url: "/auth/signup",
      description: "Create a new account with any email/password",
      status: "ready"
    },
    {
      id: 2,
      title: "Sign In", 
      url: "/auth/signin",
      description: "Sign in with your credentials",
      status: "ready"
    },
    {
      id: 3,
      title: "Create Recipe",
      url: "/recipes/create", 
      description: "Share your BBQ recipe with the Que-Munity",
      status: "ready"
    },
    {
      id: 4,
      title: "View Your Recipes",
      url: "/recipes",
      description: "Browse all BBQ recipes in the Que-Munity",
      status: "ready"
    },
    {
      id: 5,
      title: "Browse All Recipes",
      url: "/recipes",
      description: "Explore the recipe collection",
      status: "ready"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Que-Munity Test Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test all the BBQ recipe features we've built! Follow the steps below to see everything in action.
          </p>
        </div>

        {/* Quick Test Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Play className="w-6 h-6 mr-3 text-orange-600" />
            Quick Test Guide
          </h2>
          
          <div className="space-y-4">
            {testSteps.map((step) => (
              <div key={step.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  {step.id}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {step.title}
                    {step.status === 'new' && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        NEW!
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                
                <Link
                  href={step.url}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Features Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              ✅ Completed Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• User Authentication (Sign Up/Sign In)</li>
              <li>• Recipe Creation Form</li>
              <li>• Recipe Detail Pages</li>
              <li>• User Profiles (NEW!)</li>
              <li>• Recipe Listing & Search</li>
              <li>• BBQ-Specific Fields</li>
              <li>• Database Integration</li>
              <li>• Responsive Design</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-3 text-orange-600" />
              🆕 User Profile Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Personal profile pages</li>
              <li>• Recipe collection display</li>
              <li>• User stats (recipes, favorites, reviews)</li>
              <li>• Profile customization options</li>
              <li>• Social features ready</li>
              <li>• Professional layout</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Start Testing Now!
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              <Star className="w-5 h-5 mr-2" />
              View Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}