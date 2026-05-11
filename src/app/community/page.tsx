'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Users, MessageSquare, ThumbsUp, Clock, User,
  ChevronRight, Plus, HelpCircle, AlertCircle, Flame
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content?: string;
  problem?: string;
  category: string;
  tags: string[];
  author: { username: string };
  createdAt: string;
  votes: number;
  replies: number;
  type: 'DISCUSSION' | 'QUESTION';
  urgency?: string | null;
}

function formatTimeAgo(dateString: string) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  techniques: 'bg-orange-100 text-orange-700',
  equipment: 'bg-blue-100 text-blue-700',
  recipes: 'bg-green-100 text-green-700',
  competition: 'bg-purple-100 text-purple-700',
  beginners: 'bg-yellow-100 text-yellow-700',
  showoff: 'bg-pink-100 text-pink-700',
  troubleshooting: 'bg-red-100 text-red-700',
};

export default function CommunityPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, discussions: 0, questions: 0 });

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts?limit=6&sortBy=newest');
      if (res.ok) {
        const data = await res.json();
        const all: Post[] = data.posts || [];
        setPosts(all);
        const total = data.total ?? all.length;
        const questions = all.filter(p => p.type === 'QUESTION').length;
        setStats({ total, discussions: total - questions, questions });
      }
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Que-Munity 🔥
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Where Que-Masters gather to share knowledge, techniques, and stories around the virtual fire.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 text-center">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 mx-auto mb-2" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {loading ? '—' : stats.total}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">Total Posts</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 text-center">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mx-auto mb-2" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {loading ? '—' : stats.discussions}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">Discussions</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 text-center">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {loading ? '—' : stats.questions}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">Questions</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 text-center">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500 mx-auto mb-2" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Active</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Community</p>
          </div>
        </div>

        {/* Action buttons / Sign-in prompt */}
        {session?.user ? (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/community/create-post"
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Share Your BBQ
            </Link>
            <Link
              href="/community/ask-question"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              <HelpCircle className="w-5 h-5" />
              Ask for Help
            </Link>
            <Link
              href="/community/forum"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              <MessageSquare className="w-5 h-5" />
              Browse Forum
            </Link>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">Join the Que-Munity</p>
              <p className="text-sm text-gray-600">Sign in to share your BBQ experiences and ask questions.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/auth/signin"
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="bg-white text-orange-600 border border-orange-300 px-5 py-2 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Recent Discussions */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Discussions</h2>
            </div>
            <Link
              href="/community/forum"
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map(i => (
                <div key={i} className="px-5 sm:px-6 py-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-50 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/community/forum/${post.id}`}
                  className="flex items-start gap-3 px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {post.type === 'QUESTION' ? (
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {post.votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.replies} {post.type === 'QUESTION' ? 'answers' : 'replies'}
                      </span>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                    {post.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No discussions yet. Be the first to start one!</p>
              {session?.user && (
                <Link
                  href="/community/create-post"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 font-medium text-sm"
                >
                  Start First Discussion
                </Link>
              )}
            </div>
          )}

          {posts.length > 0 && (
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 text-center">
              <Link
                href="/community/forum"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
              >
                Browse All Discussions
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Community Guidelines */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🤝 Community Guidelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-gray-700">
            {[
              'Share knowledge and help fellow Que-Masters',
              'Be respectful and constructive in discussions',
              'Give credit where credit is due',
              'Share high-quality photos and recipes',
              'Keep content BBQ and smoking related',
              'Have fun and enjoy the journey!',
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
