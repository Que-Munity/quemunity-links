'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface RecipePaywallProps {
  recipeId: string;
  recipeName: string;
  authorName: string;
  premiumContent: {
    ingredients: string[];
    instructions: string[];
    tips: string[];
  };
}

export default function RecipePaywall({ 
  recipeId, 
  recipeName, 
  authorName, 
  premiumContent 
}: RecipePaywallProps) {
  const { data: session } = useSession();
  const [showPreview, setShowPreview] = useState(false);

  const userTier = session?.user?.subscriptionTier || 'free';
  const hasAccess = userTier === 'premium' || userTier === 'pro';

  if (hasAccess) {
    // User has access, show full content
    return (
      <div className="space-y-6">
        {/* Full Ingredients */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {premiumContent.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Full Instructions */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <ol className="space-y-4">
            {premiumContent.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  {instruction}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Pro Tips */}
        {premiumContent.tips.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips from {authorName}</h4>
            <ul className="space-y-2">
              {premiumContent.tips.map((tip, index) => (
                <li key={index} className="text-yellow-700">
                  💡 {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // User doesn't have access, show paywall
  return (
    <div className="relative">
      {/* Limited Preview */}
      <div className={`transition-all duration-300 ${showPreview ? 'max-h-96 overflow-hidden' : 'max-h-24 overflow-hidden'}`}>
        <div>
          <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {premiumContent.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {ingredient}
              </li>
            ))}
            {premiumContent.ingredients.length > 3 && (
              <li className="text-gray-500 italic">
                + {premiumContent.ingredients.length - 3} more ingredients...
              </li>
            )}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <ol className="space-y-4">
            {premiumContent.instructions.slice(0, 2).map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  {instruction}
                </div>
              </li>
            ))}
            {premiumContent.instructions.length > 2 && (
              <li className="text-gray-500 italic ml-9">
                + {premiumContent.instructions.length - 2} more detailed steps...
              </li>
            )}
          </ol>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none"></div>

      {/* Paywall Content */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-8 text-center relative z-10 mt-8">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock This Championship Recipe
          </h3>
          
          <p className="text-gray-600 mb-6">
            Get access to {authorName}'s complete ingredient list, step-by-step instructions, 
            and pro tips that helped win BBQ competitions.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Full ingredient measurements & substitutions
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Detailed cooking instructions with temperatures
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Exclusive pro tips & troubleshooting
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/pricing"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Upgrade to Premium - $4.99/month
            </Link>
            
            {!session && (
              <Link
                href="/auth/signin"
                className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors inline-block"
              >
                Sign In to Continue
              </Link>
            )}

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Limited Preview'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Join 10,000+ BBQ enthusiasts • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}