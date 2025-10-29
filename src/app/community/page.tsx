'use client';
import Link from 'next/link';
import SimpleUserNav from '@/components/SimpleUserNav';
import { Users, MessageSquare, Trophy, Calendar, TrendingUp, Star, Plus, Edit3, Clock, ThumbsUp, AlertCircle, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Events Preview Component  
function EventsPreview() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Generate some sample learning events based on current posts and trends
    const sampleEvents = [
      {
        id: '1',
        title: 'Brisket Stall Masterclass',
        type: 'Workshop',
        date: '2025-10-12T14:00:00Z',
        instructor: 'PitmasterJoe',
        description: 'Learn how to handle the brisket stall like a pro',
        attendees: 15,
        maxAttendees: 25,
        status: 'upcoming',
        tags: ['brisket', 'technique', 'advanced']
      },
      {
        id: '2', 
        title: 'Beginner BBQ Q&A Session',
        type: 'Q&A',
        date: '2025-10-15T19:00:00Z',
        instructor: 'Community',
        description: 'Ask questions and get help from experienced pitmasters',
        attendees: 8,
        maxAttendees: 50,
        status: 'upcoming',
        tags: ['beginner', 'help', 'community']
      },
      {
        id: '3',
        title: 'Wood Selection Workshop', 
        type: 'Discussion',
        date: '2025-10-18T18:00:00Z',
        instructor: 'SmokeExpert',
        description: 'Perfect pairings: which wood for which protein',
        attendees: 12,
        maxAttendees: 30,
        status: 'upcoming',
        tags: ['wood', 'pairing', 'technique']
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop': return 'bg-orange-100 text-orange-800';
      case 'Q&A': return 'bg-blue-100 text-blue-800';
      case 'Discussion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Workshop': return '🎓';
      case 'Q&A': return '❓';
      case 'Discussion': return '💭';
      default: return '📅';
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                  <p className="text-gray-600 text-xs">by {event.instructor}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-3">{event.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>📅 {formatEventDate(event.date)}</span>
                <span>👥 {event.attendees}/{event.maxAttendees}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 2).map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-green-800 text-sm font-medium mb-1">
            📚 Interactive Learning Events
          </p>
          <p className="text-green-700 text-xs">
            Join live discussions, workshops, and Q&A sessions with the community!
          </p>
        </div>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm w-full">
          📅 View Event Calendar
        </button>
      </div>
    </div>
  );
}

// Trending Topics Component
function TrendingTopics() {
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    // Generate trending topics from forum posts and popular searches
    const savedPosts = localStorage.getItem('communityPosts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    
    // Extract tags and topics from posts
    const topicData = [
      {
        tag: 'BrisketStall',
        posts: posts.filter((p: any) => p.tags?.includes('brisket')).length + 8,
        trend: 'up',
        category: 'technique'
      },
      {
        tag: 'PelletSmokerTips',
        posts: posts.filter((p: any) => p.category === 'equipment').length + 5,
        trend: 'up',
        category: 'equipment'
      },
      {
        tag: 'WinterSmoking',
        posts: 12,
        trend: 'hot',
        category: 'seasonal'
      },
      {
        tag: 'CompetitionPrep',
        posts: 7,
        trend: 'new',
        category: 'competition'
      },
      {
        tag: 'BeginnerHelp',
        posts: posts.filter((p: any) => p.category === 'beginners').length + 9,
        trend: 'steady',
        category: 'community'
      }
    ];

    // Sort by activity level
    const sortedTopics = topicData.sort((a, b) => b.posts - a.posts);
    setTopics(sortedTopics);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return '🔥';
      case 'up': return '📈';
      case 'new': return '✨';
      case 'steady': return '📊';
      default: return '💬';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'up': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'steady': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technique': return 'border-l-orange-400';
      case 'equipment': return 'border-l-blue-400';
      case 'seasonal': return 'border-l-purple-400';
      case 'competition': return 'border-l-yellow-400';
      case 'community': return 'border-l-green-400';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        {topics.map((topic, index) => (
          <div key={topic.tag} className={`border-l-4 ${getCategoryColor(topic.category)} pl-3 py-2 hover:bg-gray-50 rounded-r transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">#{index + 1}</span>
                <span className="font-medium text-gray-900">#{topic.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{topic.posts} posts</span>
                <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${getTrendColor(topic.trend)}`}>
                  {getTrendIcon(topic.trend)}
                  {topic.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
          <p className="text-purple-800 text-sm font-medium mb-1">
            📊 Live Community Trends
          </p>
          <p className="text-purple-700 text-xs">
            Topics trending based on community discussions and post activity!
          </p>
        </div>
        <button className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm w-full">
          🔍 Explore All Topics
        </button>
      </div>
    </div>
  );
}

// Competition Preview Component
function CompetitionPreview() {
  const [competitions, setCompetitions] = useState<any[]>([]);

  useEffect(() => {
    const savedCompetitions = localStorage.getItem('bbqCompetitions');
    if (savedCompetitions) {
      const comps = JSON.parse(savedCompetitions);
      setCompetitions(comps.filter((c: any) => c.status === 'active').slice(0, 2));
    } else {
      // Sample competitions if none exist
      const sampleCompetitions = [
        {
          id: '1',
          title: 'October Brisket Showdown',
          description: 'Show off your best brisket technique!',
          category: 'Brisket',
          endDate: '2025-10-31T23:59:59Z',
          prize: '$500 BBQ Supply Gift Card',
          participants: 23,
          maxParticipants: 50,
          status: 'active'
        },
        {
          id: '2', 
          title: 'Rookie of the Month',
          description: 'New to BBQ? Share your first success!',
          category: 'Beginner',
          endDate: '2025-10-31T23:59:59Z',
          prize: 'Starter BBQ Kit + Mentorship',
          participants: 8,
          maxParticipants: 25,
          status: 'active'
        }
      ];
      setCompetitions(sampleCompetitions);
      localStorage.setItem('bbqCompetitions', JSON.stringify(sampleCompetitions));
    }
  }, []);

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (competitions.length === 0) {
    return (
      <div className="text-center py-6">
        <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No active competitions. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Competition Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🏆</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">BBQ Competitions Coming Soon!</h3>
            <p className="text-blue-800 text-sm mb-3">
              We're building an amazing competition platform where you can showcase your BBQ skills and win great prizes.
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>What to expect:</strong></p>
              <p>• Monthly themed competitions (Brisket, Ribs, Holiday specials)</p>
              <p>• Photo submissions with recipe details</p>
              <p>• Community voting + expert judging</p>
              <p>• Real prizes: BBQ gear, gift cards, mentorship</p>
              <p>• Beginner-friendly categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Competition Previews */}
      <div className="space-y-4 mb-6">
        {competitions.map((competition) => {
          return (
            <div key={competition.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 opacity-75">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {competition.category === 'Brisket' ? '🥩' : 
                     competition.category === 'Beginner' ? '🔥' : '🏆'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{competition.title} <span className="text-sm text-gray-500">(Preview)</span></h3>
                    <p className="text-gray-600 text-sm">{competition.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium mb-1">
                    COMING SOON
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>How to enter:</strong></p>
                <p>• Submit high-quality photos of your cook</p>
                <p>• Include detailed recipe and cooking method</p>
                <p>• Share cooking temps, times, and wood used</p>
                <p>• Tell your story - challenges, successes, tips!</p>
              </div>
              <div className="mt-3 pt-3 border-t border-yellow-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    🏆 Prize: {competition.prize}
                  </span>
                  <span className="text-gray-600">
                    📅 Monthly competitions planned
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-3">
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 text-sm font-medium mb-2">
            🔥 Want to be notified when competitions launch?
          </p>
          <p className="text-orange-700 text-xs">
            Keep creating recipes and engaging in the community! We'll announce competitions here first.
          </p>
        </div>
        <div className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium cursor-not-allowed">
          🏆 Competitions Launch Soon
        </div>
      </div>
    </div>
  );
}

// Forum Preview Component
function ForumPreview() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      setRecentPosts(posts.slice(0, 3)); // Show only first 3 posts
    } else {
      // Sample posts if none exist
      const samplePosts = [
        {
          id: '1',
          title: 'Perfect Brisket Bark - My Secret Method',
          author: 'PitmasterJoe',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          votes: 12,
          replies: 8,
          category: 'techniques'
        },
        {
          id: '2', 
          title: 'Help! My ribs keep coming out tough',
          author: 'BBQNewbie',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          votes: 3,
          answers: 5,
          type: 'question',
          category: 'troubleshooting'
        }
      ];
      setRecentPosts(samplePosts);
    }
  }, []);

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

  if (recentPosts.length === 0) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No discussions yet. Be the first to start one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentPosts.map((post) => (
        <div key={post.id} className="border-l-4 border-orange-500 pl-4 py-3 bg-gray-50 rounded-r hover:bg-gray-100 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {post.type === 'question' && <AlertCircle className="w-4 h-4 text-blue-500" />}
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{post.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>by {post.author}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {post.votes}
                </div>
                <span>{post.replies || post.answers || 0} {post.type === 'question' ? 'answers' : 'replies'}</span>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleCreatePost = () => {
    if (currentUser) {
      router.push('/community/create-post');
    }
  };

  const handleAskQuestion = () => {
    if (currentUser) {
      router.push('/community/ask-question');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Que-Munity 🔥
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Where pitmasters gather to share knowledge, techniques, and stories around the virtual fire.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">2,847</h3>
            <p className="text-gray-600">Pitmasters</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">12,456</h3>
            <p className="text-gray-600">Discussions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-gray-600">Competitions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">8,234</h3>
            <p className="text-gray-600">Recipe Reviews</p>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Discussion Forums */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Active Discussions</h2>
              </div>
              <Link 
                href="/community/forum"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <ForumPreview />
            <div className="text-center mt-6">
              <Link
                href="/community/forum"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Join the Discussion
              </Link>
            </div>
          </div>

          {/* Competition Hub */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Live Competitions</h2>
              </div>
              <CompetitionPreview />
            </div>
          </div>
        </div>

        {/* Events and Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">BBQ Learning Events</h2>
            </div>
            <EventsPreview />
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <TrendingTopics />
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤝 Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Share knowledge and help fellow pitmasters
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Be respectful and constructive in discussions
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Give credit where credit is due
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Share high-quality photos and recipes
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Keep content BBQ and smoking related
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Have fun and enjoy the journey!
              </li>
            </ul>
          </div>
        </div>

        {/* Action Section - Dynamic based on auth status */}
        {currentUser ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start a Discussion</h2>
            <p className="text-xl text-gray-600 mb-8">
              Share your BBQ experiences, ask questions, or start a conversation with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleCreatePost}
                className="bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Share Your BBQ
              </button>
              <button 
                onClick={handleAskQuestion}
                className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Ask for Help
              </button>
              <Link 
                href={`/profile/${currentUser?.username}`}
                className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
              >
                My Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join the Community?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with thousands of BBQ enthusiasts and take your smoking skills to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register"
                className="bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Join Now - It's Free!
              </Link>
              <Link 
                href="/recipes"
                className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}