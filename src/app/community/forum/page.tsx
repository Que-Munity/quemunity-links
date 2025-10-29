'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Clock, User, Tag, AlertCircle, Eye, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content?: string;
  problem?: string;
  details?: string;
  category: string;
  tags: string[];
  author: string;
  authorId?: string;
  createdAt: string;
  votes: number;
  replies?: number;
  answers?: number;
  type?: string;
  urgency?: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [userVotes, setUserVotes] = useState<any>({});

  useEffect(() => {
    // Load current user
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Load user votes
    const votes = localStorage.getItem('userVotes');
    if (votes) {
      setUserVotes(JSON.parse(votes));
    }

    // Load posts from localStorage
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Add some example posts if none exist
      const examplePosts: Post[] = [
        {
          id: '1',
          title: 'Perfect Brisket Bark - My Secret Method',
          content: 'After years of experimenting, I finally cracked the code for getting that perfect bark on brisket. The key is in the rub application and temperature control...',
          category: 'techniques',
          tags: ['brisket', 'bark', 'technique'],
          author: 'PitmasterJoe',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          votes: 12,
          replies: 8
        },
        {
          id: '2',
          title: 'Help! My ribs keep coming out tough - what am I doing wrong?',
          problem: 'Every time I smoke ribs, they come out tough and chewy instead of tender',
          details: 'Using a Weber Smokey Mountain, 225°F, baby back ribs, dry rub overnight, smoking for 4-5 hours with apple wood. They look great but always tough.',
          category: 'troubleshooting',
          tags: ['ribs', 'tough', 'weber', 'help'],
          author: 'BBQNewbie',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          votes: 3,
          answers: 5,
          type: 'question',
          urgency: 'normal'
        }
      ];
      setPosts(examplePosts);
      localStorage.setItem('communityPosts', JSON.stringify(examplePosts));
    }
  }, []);

  const handleVote = (postId: string, direction: 'up' | 'down') => {
    if (!currentUser) {
      alert('Please log in to vote on posts');
      return;
    }

    const voteKey = `${currentUser.id}_${postId}`;
    const existingVote = userVotes[voteKey];

    // If user already voted in same direction, remove vote
    if (existingVote === direction) {
      const newVotes = { ...userVotes };
      delete newVotes[voteKey];
      setUserVotes(newVotes);
      localStorage.setItem('userVotes', JSON.stringify(newVotes));

      // Update post vote count (remove vote)
      updatePostVotes(postId, direction === 'up' ? -1 : 1);
      return;
    }

    // Calculate vote change
    let voteChange = direction === 'up' ? 1 : -1;
    if (existingVote) {
      // User switching vote direction (remove old vote and add new)
      voteChange = direction === 'up' ? 2 : -2;
    }

    // Update user votes
    const newVotes = { ...userVotes, [voteKey]: direction };
    setUserVotes(newVotes);
    localStorage.setItem('userVotes', JSON.stringify(newVotes));

    // Update post vote count
    updatePostVotes(postId, voteChange);
  };

  const updatePostVotes = (postId: string, change: number) => {
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            votes: post.votes + change
          };
        }
        return post;
      });
      localStorage.setItem('communityPosts', JSON.stringify(updated));
      return updated;
    });
  };

  const getUserVote = (postId: string) => {
    if (!currentUser) return null;
    return userVotes[`${currentUser.id}_${postId}`] || null;
  };

  const getFilteredPosts = () => {
    let filtered = posts;
    
    if (filter !== 'all') {
      if (filter === 'questions') {
        filtered = posts.filter(post => post.type === 'question');
      } else if (filter === 'discussions') {
        filtered = posts.filter(post => post.type !== 'question');
      } else {
        filtered = posts.filter(post => post.category === filter);
      }
    }

    // Sort posts
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.votes - a.votes;
        case 'active':
          return (b.replies || b.answers || 0) - (a.replies || a.answers || 0);
        default:
          return 0;
      }
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'general': 'bg-gray-100 text-gray-800',
      'techniques': 'bg-orange-100 text-orange-800',
      'equipment': 'bg-blue-100 text-blue-800',
      'recipes': 'bg-green-100 text-green-800',
      'competition': 'bg-purple-100 text-purple-800',
      'beginners': 'bg-yellow-100 text-yellow-800',
      'showoff': 'bg-pink-100 text-pink-800',
      'troubleshooting': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/community" 
            className="flex items-center text-gray-600 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600 mt-2">{posts.length} discussions and questions</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/community/create-post"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Share Your BBQ
              </Link>
              <Link
                href="/community/ask-question"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Ask for Help
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter('questions')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'questions' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setFilter('discussions')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'discussions' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setFilter('techniques')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'techniques' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Techniques
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="active">Most Active</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {getFilteredPosts().map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.urgency && post.type === 'question' && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getUrgencyColor(post.urgency)}`}>
                      {post.urgency.toUpperCase()}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  {post.type === 'question' && (
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
              
              <div className="text-gray-600 text-sm mb-4">
                {post.type === 'question' ? (
                  <>
                    <p className="mb-2 font-medium">Problem: {post.problem}</p>
                    <p className="line-clamp-2">{post.details}</p>
                  </>
                ) : (
                  <p className="line-clamp-2">{post.content}</p>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                        getUserVote(post.id) === 'up' 
                          ? 'bg-green-100 text-green-700' 
                          : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.votes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className={`p-1 rounded transition-colors ${
                        getUserVote(post.id) === 'down'
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">
                      {post.type === 'question' ? `${post.answers || 0} answers` : `${post.replies || 0} replies`}
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/community/forum/${post.id}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {getFilteredPosts().length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Be the first to start a discussion or ask a question!</p>
            <Link
              href="/community/create-post"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}