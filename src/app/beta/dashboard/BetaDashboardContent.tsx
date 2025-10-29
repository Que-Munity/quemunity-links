'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BetaChat from '@/components/BetaChat';
import { Flame, MessageCircle, Users, Award, Clock } from 'lucide-react';

interface BetaTesterInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  joinedAt: string;
  inviteCode: string;
}

export default function BetaDashboardContent() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('code');
  
  const [testerInfo, setTesterInfo] = useState<BetaTesterInfo | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inviteCode) {
      fetchTesterInfo();
    } else {
      setError('No invite code provided');
      setLoading(false);
    }
  }, [inviteCode]);

  const fetchTesterInfo = async () => {
    try {
      const response = await fetch(`/api/beta/dashboard?code=${inviteCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setTesterInfo(data.tester);
      } else {
        setError(data.error || 'Failed to load beta dashboard');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your beta dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/beta"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
          >
            Back to Beta Signup
          </a>
        </div>
      </div>
    );
  }

  if (!testerInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beta Tester Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your beta testing information. Please check your invite code.
          </p>
          <a
            href="/beta"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
          >
            Back to Beta Signup
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      {/* Welcome Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-600" />
                Welcome, {testerInfo.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Beta Tester • Joined {new Date(testerInfo.joinedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {testerInfo.status}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Invite Code: <span className="font-mono">{testerInfo.inviteCode}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Beta Features */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Beta Features
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Recipe Creator Pro</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Advanced Analytics</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Live Events</span>
              <span className="bg-gray-400 text-white px-2 py-1 rounded text-xs">COMING SOON</span>
            </div>
          </div>
        </div>

        {/* Testing Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Testing Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Features Tested</span>
                <span>7/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Feedback Provided</span>
                <span>23 reports</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Beta Community
          </h3>
          <div className="space-y-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <div className="text-sm text-blue-700">Active Beta Testers</div>
            </div>
            <a
              href={`/beta/chat?code=${testerInfo.inviteCode}`}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Team
            </a>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Quick Chat (Old)
            </button>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2 lg:col-span-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest Beta Updates</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-orange-600 pl-4">
              <h4 className="font-medium text-gray-900">Recipe Creator Pro Enhancement</h4>
              <p className="text-gray-600 text-sm">Added drag-and-drop ingredient ordering and cooking time calculator.</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-medium text-gray-900">Performance Improvements</h4>
              <p className="text-gray-600 text-sm">Reduced page load times by 40% across all recipe pages.</p>
              <p className="text-xs text-gray-500 mt-1">1 day ago</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <h4 className="font-medium text-gray-900">Bug Fixes</h4>
              <p className="text-gray-600 text-sm">Fixed issue with recipe image uploads and improved mobile responsiveness.</p>
              <p className="text-xs text-gray-500 mt-1">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      {isChatOpen && (
        <BetaChat
          betaTesterId={testerInfo.inviteCode}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}