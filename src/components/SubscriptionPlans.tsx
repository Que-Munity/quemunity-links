'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'View all recipes',
      'Comment on recipes',
      'Community forums',
      'Basic cooking timers',
      'Basic temperature guides',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    period: 'month',
    popular: true,
    features: [
      'Everything in Free',
      'Access to full recipe details',
      'Recipe saving & cookbook',
      'Advanced search & filters',
      'Recipe collections & meal planning',
      'Smart cooking timers with notifications',
      'Complete temperature guide',
      'Wood pairing recommendations',
      'Ad-free experience',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Upload your own recipes',
      'Host live cooking sessions',
      'Creator analytics dashboard',
      'Revenue tracking & payouts',
      'Priority recipe review',
      'Advanced creator tools',
      'Priority customer support',
    ],
  },
];

export default function SubscriptionPlans() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!session?.user?.id) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    if (planId === 'free') {
      // Already free, nothing to do
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          tier: planId,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Que-Munity Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of BBQ enthusiasts mastering the art of smoking and grilling. 
          From backyard beginners to competition pitmasters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-8 ${
              plan.popular
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-500 ml-1">
                  /{plan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading === plan.id || plan.id === 'free'}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                plan.id === 'free'
                  ? 'bg-gray-100 text-gray-500 cursor-default'
                  : plan.popular
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              } ${
                loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading === plan.id ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : plan.id === 'free' ? (
                'Current Plan'
              ) : (
                `Get ${plan.name}`
              )}
            </button>

            {plan.id === 'pro' && (
              <p className="text-xs text-gray-500 text-center mt-3">
                Creator program access included
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}