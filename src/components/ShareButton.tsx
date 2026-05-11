'use client';

import { useState, useRef } from 'react';
import { Share2, Link2, Facebook, Check, X } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {}
    } else {
      setOpen(!open);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleNativeShare}
        className="flex items-center px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors"
      >
        <Share2 className="h-5 w-5 mr-1" />Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Share Recipe</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-1">
              <button
                onClick={shareOnFacebook}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 gap-3"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Share on Facebook
              </button>
              <button
                onClick={copyLink}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 gap-3"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-green-500" />Link copied!</>
                ) : (
                  <><Link2 className="w-4 h-4 text-gray-500" />Copy link</>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
