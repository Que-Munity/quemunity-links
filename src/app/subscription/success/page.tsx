'use client';

import Link from 'next/link';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-orange-600">Que-Munity</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Premium BBQ Chef! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your subscription has been activated successfully. You now have access to all premium features 
            and ad-free browsing.
          </p>

          {/* Premium Badge */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg mb-8 inline-block">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Crown className="w-6 h-6" />
              Premium BBQ Chef Active
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Explore Premium Recipes</h3>
                  <p className="text-gray-600 text-sm">Access our exclusive collection of premium BBQ recipes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Enjoy Ad-Free Browsing</h3>
                  <p className="text-gray-600 text-sm">Browse without interruptions and focus on perfecting your BBQ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Export Your Favorites</h3>
                  <p className="text-gray-600 text-sm">Create PDFs of your favorite recipes for offline cooking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/recipes"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
            >
              Explore Premium Recipes
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 font-medium"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Questions about your subscription? 
              <Link href="/contact" className="text-orange-600 hover:text-orange-700 ml-1">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}