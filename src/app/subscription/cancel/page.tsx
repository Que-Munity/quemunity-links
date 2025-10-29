import Link from 'next/link';

export default function SubscriptionCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Cancelled
        </h1>
        
        <p className="text-gray-600 mb-8">
          No worries! Your subscription setup was cancelled. You can still enjoy our free features 
          and upgrade anytime you're ready.
        </p>

        <div className="space-y-4">
          <Link
            href="/recipes"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Explore Free Recipes
          </Link>
          
          <Link
            href="/pricing"
            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors inline-block"
          >
            View Plans Again
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Questions? Contact us at support@que-munity.com
        </p>
      </div>
    </div>
  );
}