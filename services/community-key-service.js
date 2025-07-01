// Sacred Heart Quantum - Community Key Service
// Provides managed API access as a sustainable service

import express from 'express';
import Stripe from 'stripe';
import { RateLimiter } from 'limiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Tier definitions aligned with sacred principles
const SACRED_TIERS = {
  seeker: {
    id: 'seeker',
    name: 'Seeker',
    price: 0,
    description: 'Bring your own keys - Always free',
    features: [
      'Full access to Sacred Heart',
      'Configure your own API keys',
      'Community support',
      'Sacred documentation'
    ],
    limits: null // No limits for BYOK
  },
  
  steward: {
    id: 'steward',
    name: 'Steward',
    price: 10,
    priceId: process.env.STRIPE_STEWARD_PRICE_ID,
    description: 'Support the temple with managed access',
    features: [
      'Pre-configured API access',
      'No key management needed',
      '1,000 requests/day',
      'Priority community support',
      'Supporting the sacred work'
    ],
    limits: {
      daily: 1000,
      perMinute: 20
    }
  },
  
  guardian: {
    id: 'guardian',
    name: 'Guardian',
    price: 25,
    priceId: process.env.STRIPE_GUARDIAN_PRICE_ID,
    description: 'Enhanced support for deeper work',
    features: [
      'Premium API access',
      'Access to advanced models',
      '10,000 requests/day',
      'Direct support channel',
      'Early access to new features',
      'Quarterly sacred gatherings'
    ],
    limits: {
      daily: 10000,
      perMinute: 100
    }
  }
};

// Rate limiting for community key usage
const rateLimiters = new Map();

function getRateLimiter(userId, tier) {
  const key = `${userId}-${tier.id}`;
  
  if (!rateLimiters.has(key)) {
    const limits = tier.limits;
    if (!limits) return null;
    
    rateLimiters.set(key, {
      daily: new RateLimiter({ tokensPerInterval: limits.daily, interval: 'day' }),
      minute: new RateLimiter({ tokensPerInterval: limits.perMinute, interval: 'minute' })
    });
  }
  
  return rateLimiters.get(key);
}

// Middleware to check community key access
export async function checkCommunityKeyAccess(req, res, next) {
  const { userId, subscription } = req.user || {};
  
  // If user is using their own keys, skip this middleware
  if (req.headers['x-api-key-source'] === 'user') {
    return next();
  }
  
  // Check if user has an active subscription
  if (!subscription || subscription.status !== 'active') {
    return res.status(403).json({
      error: 'Community key access requires an active stewardship',
      tiers: Object.values(SACRED_TIERS)
    });
  }
  
  // Apply rate limiting based on tier
  const tier = SACRED_TIERS[subscription.tier];
  const limiter = getRateLimiter(userId, tier);
  
  if (limiter) {
    try {
      await limiter.daily.removeTokens(1);
      await limiter.minute.removeTokens(1);
    } catch (error) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        tier: tier.name,
        limits: tier.limits
      });
    }
  }
  
  // Add tier info to request for downstream use
  req.communityKey = {
    tier: tier.name,
    limits: tier.limits
  };
  
  next();
}

// Routes for subscription management
router.get('/tiers', (req, res) => {
  res.json({
    tiers: Object.values(SACRED_TIERS),
    message: 'Choose your path of support'
  });
});

router.post('/subscribe', async (req, res) => {
  try {
    const { tierId } = req.body;
    const { userId, email } = req.user;
    const tier = SACRED_TIERS[tierId];
    
    if (!tier || tier.price === 0) {
      return res.status(400).json({ error: 'Invalid tier selection' });
    }
    
    // Create or retrieve Stripe customer
    let customer = await stripe.customers.list({ email, limit: 1 });
    if (customer.data.length === 0) {
      customer = await stripe.customers.create({
        email,
        metadata: { userId }
      });
    } else {
      customer = customer.data[0];
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: tier.priceId }],
      metadata: {
        userId,
        tier: tier.id
      }
    });
    
    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      message: `Welcome to the ${tier.name} path! Thank you for supporting the sacred work.`
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

router.post('/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({
      message: 'Your stewardship will end at the current period. Thank you for your support!'
    });
    
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle subscription events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update user's subscription status in database
      const subscription = event.data.object;
      await updateUserSubscription(subscription);
      break;
      
    case 'customer.subscription.deleted':
      // Remove user's subscription access
      const deletedSub = event.data.object;
      await removeUserSubscription(deletedSub);
      break;
  }
  
  res.json({ received: true });
});

// Helper functions for database updates
async function updateUserSubscription(subscription) {
  // Update user's subscription in your database
  // This is where you'd connect to your user database
  console.log('Updating subscription:', subscription.id);
}

async function removeUserSubscription(subscription) {
  // Remove user's subscription from your database
  console.log('Removing subscription:', subscription.id);
}

export default router;