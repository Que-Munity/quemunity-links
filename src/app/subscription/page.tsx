'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Crown, Check, X, Send, CheckCircle } from 'lucide-react';

const FREE_FEATURES = [
  { text: 'Browse all public recipes', included: true },
  { text: 'Post in community forums', included: true },
  { text: 'Save up to 10 recipes', included: true },
  { text: 'Basic BBQ guides', included: true },
  { text: 'Ad-supported experience', included: false },
  { text: 'Unlimited recipe saves', included: false },
  { text: 'Ad-free browsing', included: false },
  { text: 'Exclusive premium recipes', included: false },
  { text: 'Creator tools & analytics', included: false },
  { text: 'Premium Que-Master badge', included: false },
];

const PREMIUM_FEATURES = [
  { text: 'Everything in Free', included: true },
  { text: 'Ad-free browsing', included: true },
  { text: 'Unlimited recipe saves', included: true },
  { text: 'Exclusive premium recipes', included: true },
  { text: 'Advanced BBQ guides', included: true },
  { text: 'Priority community support', included: true },
  { text: 'Export recipes to PDF', included: true },
  { text: 'Creator tools & analytics', included: true },
  { text: 'Premium Que-Master badge', included: true },
  { text: 'Direct fan messaging', included: true },
];

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Join the Waitlist 🔥</h2>
              <p className="text-orange-100 text-sm mt-0.5">Be first to access Premium Que-Master</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re on the List!</h3>
              <p className="text-gray-600 mb-6">We&apos;ll notify you the moment Premium Que-Master launches. Stay fired up! 🔥</p>
              <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What features matter most to you?</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                  placeholder="Tell us what premium features you're most excited about..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                {submitting ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Sending...</>
                ) : (
                  <><Send className="w-4 h-4" />Join the Waitlist</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/"><h1 className="text-3xl font-bold text-orange-600">Que-Munity</h1></Link>
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Flame className="w-4 h-4" /> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Premium Que-Master is launching soon. Join the waitlist and lock in your spot.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Free</h2>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 mb-2">/month</span>
              </div>
              <p className="text-gray-500 mt-2">Perfect for getting started with BBQ</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  {f.included
                    ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <X className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                  <span className={f.included ? 'text-gray-800' : 'text-gray-400'}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signin"
              className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-2xl border-2 border-orange-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-orange-500 text-white px-5 py-1.5 rounded-full text-sm font-bold">Most Popular</span>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Crown className="w-6 h-6 text-orange-500" />
                Premium Que-Master
              </h2>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-orange-600">$7.99</span>
                <span className="text-gray-500 mb-2">/month</span>
              </div>
              <p className="text-gray-500 mt-2">For serious BBQ enthusiasts</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800">{f.text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowWaitlist(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
              <Crown className="w-5 h-5" />
              Learn More — Join Waitlist
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center text-gray-500 text-sm">
          🔒 No credit card required to join the waitlist &nbsp;•&nbsp; Cancel anytime after launch
        </div>
      </div>
    </div>
  );
}
