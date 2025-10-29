import Stripe from 'stripe';

// Create Stripe instance only if key is available (for development)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    })
  : null;

export const SUBSCRIPTION_PLANS = {
  premium: {
    name: 'Premium BBQ Chef',
    price: 4.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    features: [
      '✅ Ad-free browsing',
      '✅ Unlimited recipe saves',
      '✅ Advanced recipe search',
      '✅ Premium BBQ guides',
      '✅ Priority customer support',
      '✅ Export recipes to PDF',
      '✅ Custom meal planning',
      '✅ Exclusive premium recipes'
    ],
    interval: 'month'
  },
  pro: {
    name: 'Pro Pitmaster',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    features: [
      '✅ Everything in Premium',
      '✅ Creator monetization tools',
      '✅ Live streaming access',
      '✅ Advanced analytics',
      '✅ Custom branding',
      '✅ Direct fan messaging',
      '✅ Event hosting tools',
      '✅ Revenue sharing program'
    ],
    interval: 'month'
  }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;