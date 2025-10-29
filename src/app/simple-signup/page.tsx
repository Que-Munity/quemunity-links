'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleSignupPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Sign Up...</h2>
        <p className="text-gray-600">Redirecting to our unified authentication page...</p>
      </div>
    </div>
  );
}