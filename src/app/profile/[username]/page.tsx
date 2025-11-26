'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FollowButton } from '@/components/FollowButton';

interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  smokerType: string | null;
  experienceLevel: string | null;
  joinedAt: string;
  _count: {
    recipes: number;
    reviews: number;
    followers: number;
    follows: number;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const username = params.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users?username=${username}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 404) {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const isOwnProfile = session?.user?.username === username;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName || user.username;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-3xl md:text-4xl flex-shrink-0">
              {user.image ? (
                <img src={user.image} alt={displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                {/* Follow Button / Edit Profile */}
                <div>
                  {isOwnProfile ? (
                    <Link
                      href="/profile/edit"
                      className="inline-block px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    <FollowButton userId={user.id} />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base mb-4">
                <div className="text-gray-700">
                  <span className="font-bold text-gray-900">{user._count.recipes}</span> recipes
                </div>
                <Link href={`/profile/${username}/followers`} className="text-gray-700 hover:text-orange-500 transition-colors">
                  <span className="font-bold text-gray-900">{user._count.followers}</span> followers
                </Link>
                <Link href={`/profile/${username}/following`} className="text-gray-700 hover:text-orange-500 transition-colors">
                  <span className="font-bold text-gray-900">{user._count.follows}</span> following
                </Link>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 mb-3">{user.bio}</p>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </div>
                )}
                {user.smokerType && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {user.smokerType}
                  </div>
                )}
                {user.experienceLevel && (
                  <div className="capitalize">
                    {user.experienceLevel} level
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {formatDate(user.joinedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs/Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-orange-500 text-orange-500 font-medium">
                Recipes
              </button>
              <button className="pb-4 border-b-2 border-transparent text-gray-600 font-medium hover:text-gray-900">
                Reviews
              </button>
            </div>
          </div>

          {/* Recipes Grid */}
          {user._count.recipes === 0 ? (
            <div className="text-center py-12">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes yet</h3>
              <p className="mt-2 text-gray-600">
                {isOwnProfile
                  ? 'Start sharing your BBQ recipes with the community!'
                  : `${displayName} hasn't shared any recipes yet`}
              </p>
              {isOwnProfile && (
                <Link
                  href="/recipes/create"
                  className="mt-6 inline-block px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                >
                  Create Your First Recipe
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recipe cards will go here - placeholder for now */}
              <div className="text-center py-8 text-gray-600">
                Recipe cards coming soon...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
