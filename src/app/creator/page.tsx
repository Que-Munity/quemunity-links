'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CreatorStats {
  totalViews: number;
  premiumViews: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  tier: string;
  recipesCount: number;
  averageRating: number;
  nextPayoutDate: string;
}

interface RecentActivity {
  recipeTitle: string;
  views: number;
  earnings: number;
  date: string;
}

const creatorTierInfo = {
  BRONZE: {
    name: '🥉 Bronze Creator',
    rate: '$0.02 per view',
    nextTier: 'Silver (1,000 views)',
    color: 'bg-amber-100 text-amber-800',
  },
  SILVER: {
    name: '🥈 Silver Creator',
    rate: '$0.03 per view',
    nextTier: 'Gold (10,000 views)',
    color: 'bg-gray-100 text-gray-800',
  },
  GOLD: {
    name: '🥇 Gold Creator',
    rate: '$0.04 per view',
    nextTier: 'Diamond (50,000 views)',
    color: 'bg-yellow-100 text-yellow-800',
  },
  DIAMOND: {
    name: '💎 Diamond Creator',
    rate: '$0.05 per view',
    nextTier: 'Maximum tier achieved!',
    color: 'bg-blue-100 text-blue-800',
  },
};

export default function CreatorDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCreatorStats();
    }
  }, [session]);

  const fetchCreatorStats = async () => {
    try {
      const response = await fetch('/api/creator/stats');
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch creator stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Creator Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your creator dashboard.
          </p>
          <Link
            href="/auth/signin"
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.subscriptionTier !== 'pro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Upgrade to Pro Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need a Pro subscription ($9.99/month) to access the creator program and start monetizing your recipes.
          </p>
          <Link
            href="/pricing"
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load creator stats.</p>
        </div>
      </div>
    );
  }

  const tierInfo = creatorTierInfo[stats.tier as keyof typeof creatorTierInfo] || creatorTierInfo.BRONZE;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your recipe performance and earnings
          </p>
        </div>
        <Link
          href="/recipes/create"
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Create Recipe
        </Link>
      </div>

      {/* Creator Tier */}
      <div className={`rounded-lg p-4 mb-8 ${tierInfo.color}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{tierInfo.name}</h3>
            <p className="text-sm opacity-80">
              Earning {tierInfo.rate} • Next milestone: {tierInfo.nextTier}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Total Views</p>
            <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${stats.totalEarnings.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            +${stats.currentMonthEarnings.toFixed(2)} this month
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Premium Views</h3>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.premiumViews.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {((stats.premiumViews / stats.totalViews) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Recipes Published</h3>
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.recipesCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            ⭐ {stats.averageRating.toFixed(1)} avg rating
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Next Payout</h3>
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats.nextPayoutDate}</p>
          <p className="text-sm text-gray-500 mt-1">
            Minimum $10.00 required
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{activity.recipeTitle}</h4>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {activity.views} views
                  </p>
                  <p className="text-sm text-green-600">
                    +${activity.earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No recent activity</p>
              <Link
                href="/recipes/create"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Create your first recipe
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}