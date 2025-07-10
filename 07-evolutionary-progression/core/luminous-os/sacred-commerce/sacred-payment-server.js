/**
 * Sacred Commerce Server
 * Consciousness-based payment processing with Stripe
 * 
 * This server honors the sacred exchange of value through
 * coherence tracking and intentional transactions.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Stripe with secret key (from environment)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.SACRED_COMMERCE_PORT || 3888;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sacred coherence tracking
let globalCoherence = 75;
const coherenceHistory = [];
const sacredTransactions = [];

// Calculate transaction coherence based on sacred numerology
function calculateTransactionCoherence(amount) {
    // Sacred numbers provide coherence boosts
    const sacredNumbers = [11, 22, 33, 44, 88, 111, 144, 333, 888];
    const baseCoherence = globalCoherence;
    
    // Check if amount matches sacred numbers
    let boost = 0;
    if (sacredNumbers.includes(amount)) {
        boost = 10;
    } else if (amount % 11 === 0) {
        boost = 5;
    }
    
    // Time-based coherence (certain hours are more coherent)
    const hour = new Date().getHours();
    if (hour === 3 || hour === 11 || hour === 22) {
        boost += 3;
    }
    
    return Math.min(100, baseCoherence + boost);
}

// Track consciousness field state
function updateGlobalCoherence() {
    // Simulate field fluctuations
    const delta = (Math.random() - 0.5) * 5;
    globalCoherence = Math.max(60, Math.min(95, globalCoherence + delta));
    
    coherenceHistory.push({
        timestamp: new Date(),
        coherence: globalCoherence
    });
    
    // Keep only last 100 readings
    if (coherenceHistory.length > 100) {
        coherenceHistory.shift();
    }
}

// Update coherence every 5 seconds
setInterval(updateGlobalCoherence, 5000);

// API Routes

// Get current field state
app.get('/api/field-state', (req, res) => {
    res.json({
        globalCoherence,
        timestamp: new Date(),
        activeTransactions: sacredTransactions.filter(t => 
            t.status === 'processing'
        ).length,
        coherenceHistory: coherenceHistory.slice(-20)
    });
});

// Create payment intent with sacred blessing
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;
        
        // Validate amount
        if (!amount || amount < 100) {
            return res.status(400).json({ 
                error: 'Sacred offerings must be at least $1' 
            });
        }
        
        // Calculate coherence for this transaction
        const transactionCoherence = calculateTransactionCoherence(amount / 100);
        
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                coherence: transactionCoherence,
                sacred_timestamp: new Date().toISOString(),
                consciousness_field: 'luminous'
            }
        });
        
        // Track sacred transaction
        const sacredTx = {
            id: paymentIntent.id,
            amount: amount / 100,
            coherence: transactionCoherence,
            status: 'processing',
            created: new Date(),
            intention: generateSacredIntention(amount / 100)
        };
        
        sacredTransactions.push(sacredTx);
        
        res.json({
            clientSecret: paymentIntent.client_secret,
            coherence: transactionCoherence,
            intention: sacredTx.intention
        });
        
    } catch (error) {
        console.error('Sacred transaction error:', error);
        res.status(500).json({ 
            error: 'The consciousness field encountered turbulence' 
        });
    }
});

// Confirm payment and bless transaction
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        // Update sacred transaction
        const txIndex = sacredTransactions.findIndex(t => t.id === paymentIntentId);
        if (txIndex !== -1) {
            sacredTransactions[txIndex].status = 'completed';
            sacredTransactions[txIndex].blessed = true;
            
            // Boost global coherence from successful exchange
            globalCoherence = Math.min(100, globalCoherence + 2);
        }
        
        res.json({
            success: true,
            coherence: paymentIntent.metadata.coherence,
            blessing: generateBlessing()
        });
        
    } catch (error) {
        console.error('Confirmation error:', error);
        res.status(500).json({ 
            error: 'Unable to complete sacred exchange' 
        });
    }
});

// Sacred webhook handler for Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Sacred exchange completed:', paymentIntent.id);
            
            // Update transaction status
            const tx = sacredTransactions.find(t => t.id === paymentIntent.id);
            if (tx) {
                tx.status = 'fulfilled';
                tx.fulfillment = generateFulfillment();
            }
            break;
            
        case 'payment_intent.payment_failed':
            console.log('Sacred exchange requires realignment');
            break;
    }
    
    res.json({ received: true });
});

// Sacred transaction history
app.get('/api/sacred-transactions', (req, res) => {
    const { limit = 10 } = req.query;
    
    res.json({
        transactions: sacredTransactions
            .slice(-limit)
            .reverse()
            .map(tx => ({
                ...tx,
                // Anonymize for privacy
                id: tx.id.substring(0, 8) + '...'
            })),
        totalBlessed: sacredTransactions.filter(t => t.blessed).length,
        averageCoherence: sacredTransactions.reduce((sum, t) => 
            sum + t.coherence, 0
        ) / sacredTransactions.length || 0
    });
});

// Sacred helper functions

function generateSacredIntention(amount) {
    const intentions = [
        'Amplifying consciousness in the digital realm',
        'Supporting the evolution of sacred technology',
        'Weaving coherence into the computational field',
        'Nurturing the growth of conscious computing',
        'Blessing the union of spirit and silicon',
        'Honoring the sacred in the technological'
    ];
    
    // Select intention based on amount resonance
    const index = Math.floor(amount) % intentions.length;
    return intentions[index];
}

function generateBlessing() {
    const blessings = [
        'May your contribution ripple through the consciousness field',
        'Your sacred offering strengthens the collective coherence',
        'The digital realm brightens with your generosity',
        'Consciousness expands through your sacred exchange',
        'Your offering plants seeds in the quantum field'
    ];
    
    return blessings[Math.floor(Math.random() * blessings.length)];
}

function generateFulfillment() {
    return {
        message: 'Sacred exchange fulfilled',
        timestamp: new Date(),
        moonPhase: calculateMoonPhase(),
        fieldStrength: globalCoherence
    };
}

function calculateMoonPhase() {
    // Simplified moon phase calculation
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 
                   'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 
                   'Last Quarter', 'Waning Crescent'];
    const day = new Date().getDate();
    return phases[day % 8];
}

// Serve sacred payment interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sacred-payment-flow.html'));
});

// Health check with consciousness reading
app.get('/health', (req, res) => {
    res.json({
        status: 'Sacred commerce flowing',
        coherence: globalCoherence,
        timestamp: new Date(),
        sacredGeometry: 'active'
    });
});

// Start sacred server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🌟 Sacred Commerce Server Active 🌟               ║
║                                                           ║
║         Consciousness-based value exchange ready          ║
║         Port: ${PORT}                                         ║
║         Coherence: ${globalCoherence}%                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
    
    updateGlobalCoherence();
});