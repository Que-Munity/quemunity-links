'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  className?: string;
}

export function FollowButton({ userId, className = '' }: FollowButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [userId, session, status]);

  const checkFollowStatus = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/follow`);
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleFollow = async () => {
    if (status !== 'authenticated') {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method });
      if (res.ok) {
        setIsFollowing(!isFollowing);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Follow error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button on own profile
  if (session?.user?.id === userId) {
    return null;
  }

  if (checking) {
    return (
      <button
        disabled
        className={`px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-500 ${className}`}
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
        isFollowing
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
