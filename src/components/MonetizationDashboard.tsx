'use client';
import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Star, CreditCard, Gift, BookOpen, Video, Calendar } from 'lucide-react';

interface EarningStream {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyEarning: number;
  growth: number;
  description: string;
}

const earningStreams: EarningStream[] = [
  {
    id: 'recipes',
    name: 'Recipe Sales',
    icon: <BookOpen className="w-5 h-5" />,
    monthlyEarning: 127.50,
    growth: 23,
    description: 'Premium recipes & cooking guides'
  },
  {
    id: 'tips',
    name: 'Fan Tips',
    icon: <Gift className="w-5 h-5" />,
    monthlyEarning: 89.25,
    growth: 15,
    description: 'Direct support from followers'
  },
  {
    id: 'courses',
    name: 'BBQ Courses',
    icon: <Video className="w-5 h-5" />,
    monthlyEarning: 234.00,
    growth: 45,
    description: 'Online masterclasses & tutorials'
  },
  {
    id: 'consulting',
    name: 'Consultations',
    icon: <Calendar className="w-5 h-5" />,
    monthlyEarning: 180.00,
    growth: 12,
    description: '1-on-1 BBQ coaching sessions'
  }
];

export default function MonetizationDashboard() {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  
  const totalEarnings = earningStreams.reduce((sum, stream) => sum + stream.monthlyEarning, 0);
  const averageGrowth = earningStreams.reduce((sum, stream) => sum + stream.growth, 0) / earningStreams.length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            Monetization Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Track your earning potential and revenue streams
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">
            ${totalEarnings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Monthly Potential</div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-semibold">Total Monthly</p>
              <p className="text-2xl font-bold text-green-900">${totalEarnings.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold">Avg Growth</p>
              <p className="text-2xl font-bold text-blue-900">+{averageGrowth.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 font-semibold">Active Streams</p>
              <p className="text-2xl font-bold text-purple-900">{earningStreams.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Streams</h3>
        
        {earningStreams.map((stream) => (
          <div 
            key={stream.id}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedStream === stream.id 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedStream(selectedStream === stream.id ? null : stream.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  {stream.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{stream.name}</h4>
                  <p className="text-sm text-gray-600">{stream.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  ${stream.monthlyEarning.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${
                  stream.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stream.growth > 0 ? '+' : ''}{stream.growth}% growth
                </div>
              </div>
            </div>
            
            {selectedStream === stream.id && (
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">How to Increase Earnings:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {stream.id === 'recipes' && (
                        <>
                          <li>• Create more premium recipe collections</li>
                          <li>• Add video tutorials to recipes</li>
                          <li>• Offer seasonal/holiday recipe packs</li>
                        </>
                      )}
                      {stream.id === 'tips' && (
                        <>
                          <li>• Engage more with your community</li>
                          <li>• Share behind-the-scenes content</li>
                          <li>• Host live Q&A sessions</li>
                        </>
                      )}
                      {stream.id === 'courses' && (
                        <>
                          <li>• Create beginner-friendly courses</li>
                          <li>• Offer certification programs</li>
                          <li>• Partner with equipment brands</li>
                        </>
                      )}
                      {stream.id === 'consulting' && (
                        <>
                          <li>• Increase your hourly rate</li>
                          <li>• Offer group coaching sessions</li>
                          <li>• Create consultation packages</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Recent Activity:</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• 12 new followers this week</div>
                      <div>• 3 recipes sold yesterday</div>
                      <div>• 2 consultation bookings</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-dashed border-orange-300">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🚀 Ready to Start Monetizing?
          </h3>
          <p className="text-gray-600 mb-4">
            Upgrade to Pitmaster Pro to unlock all monetization features and start earning from your BBQ expertise.
          </p>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Upgrade to Pro ($19.99/month)
          </button>
        </div>
      </div>
    </div>
  );
}