'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Crown, Check, X, Zap, ArrowLeft } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = session?.user as any;
  const isPremium = user?.subscriptionTier === 'premium' && user?.adFree;

  const handleSubscribe = async (plan = 'premium') => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-orange-600">Que-Munity</h1>
            </Link>
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isPremium ? (
          // Premium user view
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg mb-8">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">You're a Premium BBQ Chef!</h1>
              <p className="text-yellow-100">Enjoying ad-free browsing and premium features</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Your Premium Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    {feature.replace('✅ ', '')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Free user upgrade view
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Upgrade to Premium BBQ Chef
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take your BBQ skills to the next level with ad-free browsing, premium recipes, 
                and exclusive features for just $4.99/month.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Free Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                  <p className="text-4xl font-bold text-gray-900 mt-2">$0</p>
                  <p className="text-gray-600">Forever</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Basic recipe access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Community features</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Basic BBQ guides</span>
                  </div>
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-400">Ad-supported</span>
                  </div>
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-400">Limited recipe saves</span>
                  </div>
                </div>
                <div className="text-center">
                  <button disabled className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-md">
                    Current Plan
                  </button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-orange-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-orange-500" />
                    Premium BBQ Chef
                  </h3>
                  <p className="text-4xl font-bold text-orange-600 mt-2">$4.99</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <div className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleSubscribe('premium')}
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Upgrade to Premium
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-purple-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-purple-500" />
                    Pro Pitmaster
                  </h3>
                  <p className="text-4xl font-bold text-purple-600 mt-2">$9.99</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <div className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleSubscribe('pro')}
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        Upgrade to Pro
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Why Upgrade to Premium?
              </h3>
              <p className="text-orange-800 mb-4">
                Support Que-Munity's growth while enjoying an enhanced, ad-free BBQ experience. 
                Your subscription helps us create better content and maintain the best BBQ community online.
              </p>
              <div className="text-sm text-orange-700">
                🔒 Secure payments powered by Stripe • Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}