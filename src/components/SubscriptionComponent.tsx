'use client';
import { useState } from 'react';
import { TrendingUp, CheckCircle, Zap, DollarSign } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Pitmaster',
    price: 0,
    yearlyPrice: 0,
    features: [
      'Access to all recipes & guides',
      'Save unlimited favorites',
      'Basic community access',
      'View ads (help support creators)',
      'Mobile app access',
      'Basic temperature guides'
    ]
  },
  {
    id: 'basic',
    name: 'Ad-Free BBQ',
    price: 9.99,
    yearlyPrice: 99.99,
    features: [
      'Everything in Free Pitmaster',
      '🚫 Completely ad-free experience',
      '🔔 Advanced temperature alerts & timers',
      '📱 Premium mobile app (no ads)',
      '💬 Priority community support',
      '📚 Exclusive monthly recipe collections (10+ new recipes)',
      '🎥 HD cooking technique video library',
      '📊 Personal cooking analytics & progress tracking',
      '⏰ Smart cooking reminders & notifications',
      '📋 Custom shopping lists with price tracking',
      '🏆 Access to competition-winning recipes',
      '💾 Unlimited cloud recipe storage'
    ]
  },
  {
    id: 'premium',
    name: 'Pitmaster Pro',
    price: 24.99,
    yearlyPrice: 249.99,
    popular: true,
    features: [
      'Everything in Ad-Free BBQ',
      '💰 Monetize your recipes & guides',
      '📈 4%/month earning potential*',
      '🎯 90% revenue share on your content',
      '👥 Build paid subscriber base',
      '💳 Direct tips & donations from fans',
      '🏪 Sell products through your profile',
      '🎓 Create & sell BBQ courses',
      '📞 Offer paid consultations',
      '📈 Advanced creator analytics',
      '🎯 Priority placement in search results',
      '✅ Verified creator badge'
    ]
  },
  {
    id: 'enterprise',
    name: 'Restaurant Pro',
    price: 49.99,
    yearlyPrice: 499.99,
    features: [
      'Everything in Pitmaster Pro',
      '🏢 Commercial recipe licensing',
      '💼 Sell courses & masterclasses',
      '📊 Advanced analytics & insights',
      '🎪 Host paid BBQ events',
      '👨‍🍳 Staff training materials',
      '☎️ Custom consultation calls',
      '🏷️ White-label options',
      '🔌 API access for scaling'
    ]
  }
];

export default function SubscriptionComponent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = (tierId: string) => {
    setSelectedPlan(tierId);
    // Here you would integrate with your payment processor
    alert(`Subscribing to ${subscriptionTiers.find(t => t.id === tierId)?.name}! Payment integration coming soon.`);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-red-50 rounded-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔥 Unlock Premium BBQ Knowledge
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of pitmasters who've transformed their BBQ game
        </p>
        
        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'font-semibold text-orange-600' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'font-semibold text-orange-600' : 'text-gray-500'}`}>
            Annual (Save 20%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-white rounded-lg shadow-sm p-6 ${
              tier.popular ? 'ring-2 ring-orange-500 transform scale-105' : 'border border-gray-200'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${isYearly ? tier.yearlyPrice : tier.price}
                </span>
                <span className="text-gray-500">
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>
              
              {/* Special 4% highlight for premium */}
              {tier.id === 'premium' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-semibold">4%/month potential*</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    *Based on premium recipe monetization
                  </p>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(tier.id)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                tier.popular
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {selectedPlan === tier.id ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-gray-500">
          * Earning potential based on recipe sales, guide monetization, tip revenue, and content licensing. 
          Results vary by engagement and content quality. Cancel anytime. See terms for details.
        </p>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-2">💰 How You Can Earn:</h4>
          <div className="text-xs text-green-700 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>• Recipe sales & licensing</div>
            <div>• Premium guide subscriptions</div>
            <div>• Direct tips from followers</div>
            <div>• Cooking class bookings</div>
            <div>• Brand partnerships</div>
            <div>• Equipment affiliate commissions</div>
          </div>
        </div>
      </div>
    </div>
  );
}