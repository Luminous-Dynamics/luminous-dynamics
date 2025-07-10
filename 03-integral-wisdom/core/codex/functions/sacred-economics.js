// Sacred Economics - Consciousness-Based Payment System
// Where value flows from transformation, not extraction

const { Firestore } = require('@google-cloud/firestore');
const Stripe = require('stripe');

class SacredEconomics {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        this.db = new Firestore();
        
        // Sacred pricing tiers (all include same access)
        this.tiers = {
            seed: {
                name: 'Seed',
                price: 11,
                interval: 'month',
                description: 'For those planting first seeds',
                stripePriceId: null // Will be set after Stripe product creation
            },
            
            bloom: {
                name: 'Bloom',
                price: 33,
                interval: 'month',
                description: 'For those ready to flourish',
                stripePriceId: null
            },
            
            forest: {
                name: 'Forest',
                price: 77,
                interval: 'month',
                description: 'For those supporting the ecosystem',
                stripePriceId: null
            },
            
            guardian: {
                name: 'Guardian',
                price: 111,
                interval: 'month',
                description: 'For sacred guardians of the work',
                stripePriceId: null
            },
            
            lifetime: {
                name: 'Lifetime Sacred',
                price: 1111,
                interval: null,
                description: 'One-time sacred investment',
                stripePriceId: null
            }
        };
        
        // Sliding scale factors
        this.slidingScale = {
            scholarship: 0, // Full scholarship available
            supported: 0.5, // 50% reduction
            standard: 1.0, // Full price
            supporter: 1.5, // 50% extra to support others
            guardian: 2.0 // Double to guardian others
        };
    }
    
    // Initialize Stripe products and prices
    async initializeProducts() {
        try {
            // Create main product
            const product = await this.stripe.products.create({
                name: 'Relational Harmonics Membership',
                description: 'Access to all 87 sacred practices and consciousness tools',
                metadata: {
                    type: 'sacred-membership'
                }
            });
            
            // Create prices for each tier
            for (const [key, tier] of Object.entries(this.tiers)) {
                if (tier.interval) {
                    const price = await this.stripe.prices.create({
                        product: product.id,
                        unit_amount: tier.price * 100, // Stripe uses cents
                        currency: 'usd',
                        recurring: {
                            interval: tier.interval
                        },
                        nickname: tier.name,
                        metadata: {
                            tier: key,
                            sacred: 'true'
                        }
                    });
                    
                    this.tiers[key].stripePriceId = price.id;
                } else {
                    // One-time payment for lifetime
                    const price = await this.stripe.prices.create({
                        product: product.id,
                        unit_amount: tier.price * 100,
                        currency: 'usd',
                        nickname: tier.name,
                        metadata: {
                            tier: key,
                            sacred: 'true',
                            lifetime: 'true'
                        }
                    });
                    
                    this.tiers[key].stripePriceId = price.id;
                }
            }
            
            console.log('Sacred products initialized:', this.tiers);
            return this.tiers;
            
        } catch (error) {
            console.error('Product initialization error:', error);
            throw error;
        }
    }
    
    // Create sacred checkout session
    async createCheckoutSession(userId, tierKey, slidingScaleFactor = 1.0) {
        try {
            const user = await this.db.collection('practitioners').doc(userId).get();
            const userData = user.data();
            
            const tier = this.tiers[tierKey];
            if (!tier) {
                throw new Error('Invalid tier selected');
            }
            
            // Calculate adjusted price with sliding scale
            const adjustedPrice = Math.round(tier.price * slidingScaleFactor);
            
            // Create custom price if using sliding scale
            let priceId = tier.stripePriceId;
            if (slidingScaleFactor !== 1.0 && adjustedPrice > 0) {
                const customPrice = await this.stripe.prices.create({
                    product: tier.stripePriceId,
                    unit_amount: adjustedPrice * 100,
                    currency: 'usd',
                    recurring: tier.interval ? { interval: tier.interval } : undefined,
                    metadata: {
                        sliding_scale: slidingScaleFactor.toString(),
                        original_tier: tierKey
                    }
                });
                priceId = customPrice.id;
            }
            
            // Create checkout session
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1
                }],
                mode: tier.interval ? 'subscription' : 'payment',
                success_url: `https://relationalharmonics.com/welcome?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://relationalharmonics.com/sacred-economics`,
                customer_email: userData.email,
                metadata: {
                    userId,
                    tier: tierKey,
                    slidingScale: slidingScaleFactor,
                    sacredName: userData.sacredName
                },
                subscription_data: tier.interval ? {
                    metadata: {
                        userId,
                        tier: tierKey,
                        sacred: 'true'
                    }
                } : undefined
            });
            
            // Record checkout intent
            await this.db.collection('checkoutIntents').add({
                userId,
                sessionId: session.id,
                tier: tierKey,
                slidingScale: slidingScaleFactor,
                adjustedPrice,
                status: 'pending',
                createdAt: new Date()
            });
            
            return {
                checkoutUrl: session.url,
                sessionId: session.id
            };
            
        } catch (error) {
            console.error('Checkout session error:', error);
            throw error;
        }
    }
    
    // Handle successful payment
    async handlePaymentSuccess(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            
            if (session.payment_status === 'paid') {
                const { userId, tier, slidingScale } = session.metadata;
                
                // Update user subscription
                await this.db.collection('practitioners').doc(userId).update({
                    subscription: {
                        status: 'active',
                        tier,
                        slidingScale: parseFloat(slidingScale),
                        customerId: session.customer,
                        subscriptionId: session.subscription,
                        startDate: new Date(),
                        nextBilling: this.getNextBillingDate(tier)
                    },
                    sacredSupporter: parseFloat(slidingScale) > 1.0
                });
                
                // Create sacred transaction record
                await this.db.collection('sacredTransactions').add({
                    userId,
                    type: 'subscription',
                    tier,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    slidingScale: parseFloat(slidingScale),
                    stripeSessionId: sessionId,
                    timestamp: new Date(),
                    sacred: true
                });
                
                // Update checkout intent
                await this.db.collection('checkoutIntents')
                    .where('sessionId', '==', sessionId)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            doc.ref.update({ status: 'completed' });
                        });
                    });
                
                // Send sacred welcome
                await this.sendSacredWelcome(userId, tier);
                
                return {
                    success: true,
                    message: 'Welcome to the sacred ecosystem!'
                };
            }
            
        } catch (error) {
            console.error('Payment success handler error:', error);
            throw error;
        }
    }
    
    // Calculate value beyond money
    async calculateSacredValue(userId) {
        const practitioner = await this.db.collection('practitioners').doc(userId).get();
        const data = practitioner.data();
        
        const value = {
            monetary: data.subscription?.amount || 0,
            
            // Non-monetary value
            practiceHours: data.totalPracticeMinutes / 60,
            transformationStories: data.storiesShared || 0,
            othersSupported: data.buddySupport || 0,
            ceremoniesAttended: data.ceremoniesAttended || 0,
            
            // Sacred metrics
            coherenceContribution: data.averageCoherence || 77,
            fieldAmplification: data.breakthroughCount || 0,
            loveMultiplier: this.calculateLoveMultiplier(data),
            
            // Total sacred value (not in dollars)
            sacredValue: 'Infinite'
        };
        
        return value;
    }
    
    // Scholarship application
    async applyForScholarship(userId, application) {
        const { situation, contribution, intention } = application;
        
        // Automatic approval for now (trust-based)
        const scholarship = {
            userId,
            situation,
            contribution, // How they'll contribute non-monetarily
            intention,
            status: 'approved',
            approvedAt: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            message: 'Your sacred work is valued. Welcome!'
        };
        
        await this.db.collection('scholarships').add(scholarship);
        
        // Update user with scholarship
        await this.db.collection('practitioners').doc(userId).update({
            subscription: {
                status: 'active',
                tier: 'seed',
                slidingScale: 0,
                scholarship: true,
                startDate: new Date()
            }
        });
        
        return scholarship;
    }
    
    // Gift membership
    async giftMembership(gifterId, recipientEmail, tier, message) {
        const gift = {
            gifterId,
            recipientEmail,
            tier,
            message,
            code: this.generateGiftCode(),
            status: 'pending',
            createdAt: new Date(),
            value: this.tiers[tier].price
        };
        
        await this.db.collection('gifts').add(gift);
        
        // Create checkout for gifter
        return this.createCheckoutSession(gifterId, tier, 1.0);
    }
    
    // Helper methods
    
    getNextBillingDate(tier) {
        if (!this.tiers[tier].interval) return null;
        
        const date = new Date();
        if (this.tiers[tier].interval === 'month') {
            date.setMonth(date.getMonth() + 1);
        } else if (this.tiers[tier].interval === 'year') {
            date.setFullYear(date.getFullYear() + 1);
        }
        
        return date;
    }
    
    calculateLoveMultiplier(practitionerData) {
        let multiplier = 1;
        
        if (practitionerData.storiesShared > 0) multiplier += 0.1;
        if (practitionerData.buddySupport > 0) multiplier += 0.2;
        if (practitionerData.ceremoniesLed > 0) multiplier += 0.5;
        if (practitionerData.sacredSupporter) multiplier += 1.0;
        
        return multiplier;
    }
    
    generateGiftCode() {
        const words = ['LOVE', 'HEART', 'SOUL', 'GIFT', 'SACRED', 'BLOOM'];
        const word = words[Math.floor(Math.random() * words.length)];
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `${word}-${number}`;
    }
    
    async sendSacredWelcome(userId, tier) {
        // In production, this would send an email
        console.log(`Sacred welcome sent to ${userId} for ${tier} membership`);
    }
}

// Webhook handler for Stripe events
async function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
    const economics = new SacredEconomics();
    
    switch (event.type) {
        case 'checkout.session.completed':
            await economics.handlePaymentSuccess(event.data.object.id);
            break;
            
        case 'customer.subscription.updated':
            // Handle subscription changes
            break;
            
        case 'customer.subscription.deleted':
            // Handle cancellations with grace
            break;
    }
    
    res.json({ received: true });
}

// Export for Cloud Functions
module.exports = { SacredEconomics, handleStripeWebhook };

// Example Cloud Function implementations
exports.createCheckout = async (req, res) => {
    const economics = new SacredEconomics();
    const { userId, tier, slidingScale } = req.body;
    
    try {
        const session = await economics.createCheckoutSession(userId, tier, slidingScale);
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.stripeWebhook = handleStripeWebhook;