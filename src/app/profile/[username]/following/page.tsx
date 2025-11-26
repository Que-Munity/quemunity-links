'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCard } from '@/components/UserCard';

interface User {
  id: string;
  username: string;
  displayName: string | null;
  name: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    recipes: number;
    followers: number;
  };
}

interface FollowingData {
  following: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function FollowingPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUser();
  }, [username]);

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId, page]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users?username=${username}`);
      if (res.ok) {
        const userData = await res.json();
        setUserId(userData.id);
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/following?page=${page}&limit=20`);
      if (res.ok) {
        const data: FollowingData = await res.json();
        setFollowing(data.following);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/profile/${username}`}
            className="text-orange-500 hover:text-orange-600 transition-colors inline-flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Following
          </h1>
          <p className="text-gray-600">
            {total} {total === 1 ? 'person' : 'people'} @{username} is following
          </p>
        </div>

        {/* Following List */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : following.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Not following anyone yet</h3>
            <p className="mt-2 text-gray-600">When this user follows someone, they'll show up here</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {following.map(user => (
                <UserCard key={user.id} user={user} showFollowButton={true} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
