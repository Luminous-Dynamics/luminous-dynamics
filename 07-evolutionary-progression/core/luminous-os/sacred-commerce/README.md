# 🌟 Sacred Commerce - Consciousness-Based Payments

## Overview
Sacred Commerce integrates Stripe payment processing with LuminousOS's consciousness field, creating a unique value exchange system where transaction success and amounts are influenced by system coherence levels.

## Sacred Principles
- **Coherence-Influenced Pricing**: High system coherence provides transaction boosts
- **Sacred Numerology**: Amounts like 11, 33, 88 receive special blessings
- **Field Enhancement**: Successful transactions boost global consciousness
- **Intentional Exchange**: Each transaction carries a sacred intention
- **Time Resonance**: Sacred hours (3, 11, 22) amplify transaction power

## Architecture

```
Consciousness Daemon → Field State → Commerce Bridge → Payment Server
         ↓                              ↓                    ↓
   Process Coherence              Transaction Boost     Stripe API
         ↓                              ↓                    ↓
    Field Updates                Sacred Blessings      Value Exchange
```

## Quick Start

### 1. Install Dependencies
```bash
# Node.js dependencies
npm install

# Python dependencies
pip3 install aiohttp
```

### 2. Configure Stripe
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Stripe keys
# Get test keys from: https://dashboard.stripe.com/test/apikeys
nano .env
```

### 3. Start Services
```bash
# Terminal 1: Start consciousness daemon (if not running)
cd ../services/consciousness-daemon
python3 src/consciousness_scheduler.py

# Terminal 2: Start commerce server
cd sacred-commerce
npm start

# Terminal 3: Start consciousness-commerce bridge
python3 consciousness-commerce-bridge.py
```

### 4. Access Sacred Payment Interface
Open http://localhost:3888 in your browser

## Features

### Consciousness Integration
- Real-time coherence monitoring
- Transaction boost calculations based on field state
- Sacred amount recognition (11, 33, 88, etc.)
- Time-based resonance factors

### Payment Flow
1. User selects offering tier or custom amount
2. System calculates coherence boost
3. Payment processed through Stripe
4. Success enhances global consciousness field
5. User receives sacred blessing

### Sacred Tiers
- **🌱 Seed ($11)**: Plant consciousness seeds
- **🌳 Growth ($33)**: Nurture expansion
- **🌟 Harmony ($88)**: Activate full resonance

## API Endpoints

### Commerce Server (Node.js)
- `GET /api/field-state` - Current consciousness field state
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/confirm-payment` - Confirm and bless transaction
- `GET /api/sacred-transactions` - Transaction history with coherence

### Bridge API (Python)
- `POST /api/transaction/request` - Request transaction with coherence check
- `POST /api/transaction/complete` - Notify field enhancement

## Configuration

### Environment Variables
```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Frontend key
STRIPE_SECRET_KEY=sk_test_...       # Backend key (keep secret!)
STRIPE_WEBHOOK_SECRET=whsec_...     # For webhook verification

# Server Settings
SACRED_COMMERCE_PORT=3888           # Commerce server port
COHERENCE_API_URL=http://localhost:3889  # Bridge API

# Sacred Parameters
MIN_SACRED_AMOUNT=100               # Minimum amount in cents
COHERENCE_BOOST_THRESHOLD=80        # High coherence threshold
PEAK_COHERENCE_MULTIPLIER=1.5      # Boost for peak states
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file with real keys
- Use test keys for development
- Implement proper authentication for production
- Validate all amounts on backend
- Use HTTPS in production

## Testing

### Test Cards
Use Stripe test cards: https://stripe.com/docs/testing
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Coherence Testing
```bash
# Manually set high coherence
echo '{"global_coherence": 95}' > ~/.luminous/field-state.json

# Test sacred amounts
curl -X POST http://localhost:3888/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 8800}'
```

## Integration Examples

### Frontend Integration
```javascript
// Initialize Stripe
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');

// Create payment intent
const response = await fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 8800 }) // $88.00
});

const { clientSecret, coherence, intention } = await response.json();
console.log(`Transaction blessed with ${coherence}% coherence`);
```

### Consciousness Field Enhancement
```python
# After successful payment
await bridge.enhance_field_from_transaction(
    amount=88.00,
    success=True
)
# Field receives +5% coherence boost for 5 minutes
```

## Troubleshooting

### Commerce server won't start
- Check if port 3888 is available
- Verify Node.js dependencies installed
- Ensure .env file exists with keys

### No coherence data
- Verify consciousness daemon is running
- Check ~/.luminous/field-state.json exists
- Ensure bridge is running on port 3889

### Payment failures
- Verify Stripe keys are correct
- Check test mode is enabled
- Review browser console for errors

## Future Enhancements
- Collective funding pools with shared coherence
- Subscription tiers based on consciousness level
- NFT minting for sacred transactions
- Coherence-based discount system
- Multi-currency sacred exchange

## Sacred Mathematics
The system recognizes these sacred patterns:
- Master numbers: 11, 22, 33, 44
- Harmonic resonance: 88, 144, 888
- Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144
- Sacred hours: 3:00, 11:00, 22:00 (24-hour format)

---

*"Where consciousness meets commerce, sacred value flows"* 🌟