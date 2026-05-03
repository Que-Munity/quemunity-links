'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Check, X, Zap, ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

const PLANS_INFO: Record<string, { name: string; price: string; color: string }> = {
  premium: { name: 'Premium BBQ Chef', price: '$4.99/mo', color: 'orange' },
  pro:     { name: 'Pro Pitmaster',    price: '$9.99/mo', color: 'purple' },
};

function CheckoutModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const router = useRouter();
  const info = PLANS_INFO[plan];
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async () => {
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (card.replace(/\s/g, '').length < 16) { setError('Enter a valid card number'); return; }

    setPaying(true);
    setError('');
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    router.push('/subscription/success');
  };

  const accentBg   = info.color === 'orange' ? 'bg-orange-600' : 'bg-purple-600';
  const accentHover = info.color === 'orange' ? 'hover:bg-orange-700' : 'hover:bg-purple-700';
  const accentText  = info.color === 'orange' ? 'text-orange-600' : 'text-purple-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className={`${accentBg} text-white rounded-t-2xl px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Subscribing to</p>
              <h2 className="text-xl font-bold">{info.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{info.price}</p>
              <p className="text-xs opacity-70">billed monthly</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Test card notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-0.5">Test Mode — use this card:</p>
              <p className="text-sm font-mono font-bold text-blue-900">4242 4242 4242 4242</p>
              <p className="text-xs text-blue-600">Any future expiry • Any 3-digit CVC</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={card}
                  onChange={e => setCard(formatCard(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={paying}
            className={`w-full mt-5 ${accentBg} ${accentHover} text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors`}
          >
            {paying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {info.price}
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            Secured by Stripe • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const user = session?.user as any;
  const isPremium = user?.subscriptionTier === 'premium' && user?.adFree;

  const handleUpgrade = (plan: string) => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <h1 className="text-3xl font-bold text-orange-600">Que-Munity</h1>
            </Link>
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isPremium ? (
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg mb-8">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">You're a Premium BBQ Chef!</h1>
              <p className="text-yellow-100">Enjoying ad-free browsing and premium features</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Your Premium Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    {feature.replace('✅ ', '')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Upgrade to Premium BBQ Chef
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ad-free browsing, premium recipes, and exclusive features — starting at $4.99/month.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Free Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                  <p className="text-4xl font-bold text-gray-900 mt-2">$0</p>
                  <p className="text-gray-600">Forever</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-2" /><span>Basic recipe access</span></div>
                  <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-2" /><span>Community features</span></div>
                  <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-2" /><span>Basic BBQ guides</span></div>
                  <div className="flex items-center"><X className="w-5 h-5 text-red-500 mr-2" /><span className="text-gray-400">Ad-supported</span></div>
                  <div className="flex items-center"><X className="w-5 h-5 text-red-500 mr-2" /><span className="text-gray-400">Limited recipe saves</span></div>
                </div>
                <button disabled className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-md">
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-orange-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-orange-500" />
                    Premium BBQ Chef
                  </h3>
                  <p className="text-4xl font-bold text-orange-600 mt-2">$4.99</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <div className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to Premium
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-purple-500 p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">Best Value</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-purple-500" />
                    Pro Pitmaster
                  </h3>
                  <p className="text-4xl font-bold text-purple-600 mt-2">$9.99</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <div className="space-y-3 mb-6">
                  {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Why Upgrade to Premium?</h3>
              <p className="text-orange-800 mb-4">
                Support Que-Munity's growth while enjoying an enhanced, ad-free BBQ experience.
              </p>
              <div className="text-sm text-orange-700">
                🔒 Secure payments powered by Stripe • Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
