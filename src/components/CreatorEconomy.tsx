'use client';
import { DollarSign, Users, Star, TrendingUp, Gift, BookOpen, Video } from 'lucide-react';

const monetizationFeatures = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Recipe Monetization",
    description: "Sell premium recipes, cooking guides, and technique videos directly to your followers.",
    earning: "$50-200/month"
  },
  {
    icon: <Gift className="w-8 h-8" />,
    title: "Fan Tips & Donations", 
    description: "Receive direct support from your community with built-in tipping and donation features.",
    earning: "$25-150/month"
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Masterclass Courses",
    description: "Create and sell comprehensive BBQ courses with video content and certificates.",
    earning: "$100-500/month"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Paid Consultations",
    description: "Offer 1-on-1 BBQ coaching sessions and group workshops at your own rates.",
    earning: "$75-300/month"
  }
];

export default function CreatorEconomy() {
  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-8 mb-8 border border-green-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <DollarSign className="w-8 h-8 mr-3 text-green-600" />
          Creator Economy Platform
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Turn your BBQ passion into a profitable business. QueMunity's creator economy lets you monetize your expertise 
          with multiple revenue streams and keep <span className="font-bold text-green-600">90% of earnings</span>.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-white/60 rounded-lg">
          <div className="text-2xl font-bold text-green-600">4.2%</div>
          <div className="text-sm text-gray-600">Avg Monthly Return</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">2,847</div>
          <div className="text-sm text-gray-600">Active Creators</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">$1.2M</div>
          <div className="text-sm text-gray-600">Creator Earnings</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">90%</div>
          <div className="text-sm text-gray-600">Revenue Share</div>
        </div>
      </div>

      {/* Monetization Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {monetizationFeatures.map((feature, index) => (
          <div key={index} className="bg-white/80 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                {feature.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {feature.earning}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Stories */}
      <div className="bg-white/60 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          💰 Creator Success Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>
            <p className="text-sm text-gray-700 italic mb-2">
              "Made $847 last month selling my brisket rub recipe and coaching sessions!"
            </p>
            <p className="text-xs text-gray-500">- PitmasterMike</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">$1,230</div>
            <p className="text-sm text-gray-700 mb-2">
              Monthly earnings from BBQ masterclass series
            </p>
            <p className="text-xs text-gray-500">- BBQBetty</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600 mb-1">6.8% ROI</div>
            <p className="text-sm text-gray-700 mb-2">
              Average monthly return on content creation
            </p>
            <p className="text-xs text-gray-500">- SmokeKing</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          🚀 Ready to Monetize Your BBQ Skills?
        </h3>
        <p className="text-gray-600 mb-6">
          Join thousands of creators earning from their passion. Start building your BBQ business today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Start Monetizing Free
          </button>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors">
            Learn More About Creator Program
          </button>
        </div>
      </div>
    </div>
  );
}