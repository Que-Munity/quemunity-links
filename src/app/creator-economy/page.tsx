import CreatorEconomy from '@/components/CreatorEconomy';
import MonetizationDashboard from '@/components/MonetizationDashboard';

export default function CreatorEconomyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💰 Creator Economy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your BBQ passion into profit. Join thousands of creators earning from their expertise 
              with our comprehensive monetization platform.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Creator Economy Overview */}
        <CreatorEconomy />
        
        {/* Monetization Dashboard Preview */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Your Earning Potential
            </h2>
            <p className="text-gray-600">
              See what you could be earning with our creator monetization tools
            </p>
          </div>
          <MonetizationDashboard />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 How to Start Earning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Quality Content</h3>
              <p className="text-gray-600">
                Share your BBQ recipes, guides, and techniques. Quality content attracts followers and builds your reputation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Audience</h3>
              <p className="text-gray-600">
                Engage with the community, respond to comments, and build relationships with fellow BBQ enthusiasts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monetize & Earn</h3>
              <p className="text-gray-600">
                Launch premium content, receive tips, offer consultations, and start earning from your passion.
              </p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💪 Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-orange-700">MJ</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Mike "Pitmaster" Johnson</h4>
                  <p className="text-sm text-gray-500">Texas BBQ Expert</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3 italic">
                "Started with sharing my family brisket recipe. Now I earn $1,200/month from premium guides and consultations!"
              </p>
              <div className="text-lg font-bold text-green-600">$1,200/month</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-pink-700">BB</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">BBQ Betty</h4>
                  <p className="text-sm text-gray-500">Competition Champion</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3 italic">
                "My rib masterclass series has 200+ students paying $49 each. The passive income is amazing!"
              </p>
              <div className="text-lg font-bold text-green-600">$847/month</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">SK</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">SmokeKing</h4>
                  <p className="text-sm text-gray-500">Recipe Creator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3 italic">
                "Tips and donations from my followers cover my equipment costs. Building my dream BBQ setup!"
              </p>
              <div className="text-lg font-bold text-green-600">$432/month</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ❓ Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How much can I realistically earn?</h4>
              <p className="text-gray-600 mb-4">
                Most active creators earn $200-800/month. Top creators with premium courses and consultations earn $1,000+/month.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">What percentage does QueMunity take?</h4>
              <p className="text-gray-600 mb-4">
                We keep only 10% to cover payment processing and platform costs. You keep 90% of all earnings.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Do I need to be a professional chef?</h4>
              <p className="text-gray-600">
                Not at all! Many successful creators are weekend warriors who share their passion and learn as they go.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When do I get paid?</h4>
              <p className="text-gray-600 mb-4">
                Earnings are paid out weekly via PayPal or bank transfer. No minimum threshold required.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">What content performs best?</h4>
              <p className="text-gray-600 mb-4">
                Step-by-step recipes with photos, troubleshooting guides, and beginner-friendly content tend to earn the most.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Can I sell physical products?</h4>
              <p className="text-gray-600">
                Yes! Many creators sell rubs, sauces, and equipment through their profiles with our integrated marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}