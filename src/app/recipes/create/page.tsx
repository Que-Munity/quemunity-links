'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRecipeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      router.push(`/profile/${user.username}`);
    } else {
      router.push('/simple-login?redirect=/profile');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to recipe creation...</p>
      </div>
    </div>
  );
}
