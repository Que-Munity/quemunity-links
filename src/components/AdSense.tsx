'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  const { data: session } = useSession();
  
  // Don't show ads to premium users
  const user = session?.user as any;
  const isPremium = user?.adFree || user?.subscriptionTier === 'premium';
  
  useEffect(() => {
    if (!isPremium) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isPremium]);

  // Don't render ads for premium users
  if (isPremium) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}