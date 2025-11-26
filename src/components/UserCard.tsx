'use client';

import Link from 'next/link';
import { FollowButton } from './FollowButton';

interface User {
  id: string;
  username: string;
  displayName: string | null;
  name: string | null;
  image: string | null;
  bio: string | null;
  _count?: {
    recipes: number;
    followers: number;
  };
}

interface UserCardProps {
  user: User;
  showFollowButton?: boolean;
}

export function UserCard({ user, showFollowButton = true }: UserCardProps) {
  const displayName = user.displayName || user.username;
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link href={`/profile/${user.username}`}>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform">
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </Link>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${user.username}`}>
            <h3 className="font-bold text-lg md:text-xl text-gray-900 hover:text-orange-500 transition-colors truncate cursor-pointer">
              {displayName}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">@{user.username}</p>

          {user.bio && (
            <p className="text-gray-700 mt-2 text-sm line-clamp-2">{user.bio}</p>
          )}

          {/* Stats */}
          {user._count && (
            <div className="flex gap-4 mt-3 text-sm">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{user._count.recipes}</span> recipes
              </div>
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{user._count.followers}</span> followers
              </div>
            </div>
          )}
        </div>

        {/* Follow Button */}
        {showFollowButton && (
          <div className="flex-shrink-0">
            <FollowButton userId={user.id} className="text-sm px-4 py-1.5" />
          </div>
        )}
      </div>
    </div>
  );
}
