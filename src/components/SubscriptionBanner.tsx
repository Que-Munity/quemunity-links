'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Crown, Zap } from 'lucide-react';

export default function SubscriptionBanner() {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  // Don't show banner to premium users
  if (user?.subscriptionTier === 'premium' && user?.adFree) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Crown className="w-4 h-4" />
          <span className="font-medium">Premium BBQ Chef Active</span>
          <span>• Ad-free browsing • Premium recipes</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 text-center">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <span className="font-medium">Upgrade to Premium BBQ Chef for just $9.99/month!</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>✨ Ad-free • Premium recipes • Export PDFs</span>
          <Link 
            href="/pricing" 
            className="bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}