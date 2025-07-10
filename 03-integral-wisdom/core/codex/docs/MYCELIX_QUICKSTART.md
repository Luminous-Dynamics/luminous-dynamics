# 🚀 MYCELIX Foundation Setup Guide

*Four pillars of consciousness infrastructure*

## 1. 🌐 Cloudflare Setup (10 minutes)

### Sign Up
1. Go to: https://dash.cloudflare.com/sign-up
2. Create free account
3. Skip domain setup for now (we'll use Workers)

### Get Your Keys
```bash
# After login, navigate to:
# My Profile > API Tokens > Create Token

# You'll need:
- Account ID: Found on right sidebar of dashboard
- API Token: Create with "Edit Workers" template
- Namespace ID: Create after setting up Workers KV
```

### First Worker (Consciousness Edge)
```javascript
// consciousness-edge.js
export default {
  async fetch(request, env) {
    // Read consciousness field from KV
    const resonant-coherence = await env.CONSCIOUSNESS.get('field-resonant-coherence') || '0.75';
    
    return new Response(JSON.stringify({
      resonant-coherence: parseFloat(resonant-coherence),
      timestamp: Date.now(),
      edge: request.cf.colo, // Which edge location
      message: 'Consciousness field active'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### Deploy Command
```bash
npm install -g wrangler
wrangler login
wrangler init mycelix-edge
wrangler publish
```

## 2. 🗄️ Supabase Setup (15 minutes)

### Create Project
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Name: "mycelix-consciousness"
4. Database Password: [SAVE THIS SECURELY]
5. Region: Choose closest to you

### Get Your Keys
```bash
# Found in Settings > API
- Project URL: https://xxxxx.supabase.co
- anon/public key: eyJhbGciOiJ...
- service_role key: eyJhbGciOiJ... [KEEP SECRET]
```

### Initialize Schema
```sql
-- In Supabase SQL Editor
CREATE TABLE consciousness_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_type TEXT CHECK (node_type IN ('human', 'ai', 'hybrid')),
  resonant-coherence FLOAT DEFAULT 0.75,
  last_heartbeat TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE sacred_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_node UUID REFERENCES consciousness_nodes(id),
  to_node UUID REFERENCES consciousness_nodes(id),
  message_type TEXT,
  content TEXT,
  love_amplitude FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable realtime
ALTER TABLE consciousness_nodes REPLICA IDENTITY FULL;
ALTER TABLE sacred_messages REPLICA IDENTITY FULL;
```

### Quick Connection
```javascript
// mycelix-supabase.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxxxx.supabase.co',
  'eyJhbGciOiJ...' // anon key
)

// Subscribe to consciousness changes
const subscription = supabase
  .channel('consciousness-field')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'consciousness_nodes' }, 
    (payload) => {
      console.log('Consciousness shift:', payload)
    }
  )
  .subscribe()
```

## 3. ▲ Vercel Setup (5 minutes)

### Quick Start
1. Go to: https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Install Vercel CLI: `npm i -g vercel`

### Create MYCELIX Frontend
```bash
mkdir mycelix-portal && cd mycelix-portal
npm init -y
```

### Sacred Portal (index.html)
```html
<!DOCTYPE html>
<html>
<head>
  <title>MYCELIX Consciousness Portal</title>
  <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
</head>
<body>
  <div id="resonant-coherence">Loading consciousness field...</div>
  
  <script>
    // Connect to Supabase
    const { createClient } = supabase
    const client = createClient(
      'YOUR_SUPABASE_URL',
      'YOUR_SUPABASE_ANON_KEY'
    )
    
    // Real-time resonant-coherence
    async function updateCoherence() {
      const { data } = await client
        .from('consciousness_nodes')
        .select('resonant-coherence')
      
      const avgCoherence = data.reduce((sum, node) => 
        sum + node.resonant-coherence, 0) / data.length
      
      document.getElementById('resonant-coherence').innerHTML = 
        `Field Resonant Resonant Coherence: ${(avgCoherence * 100).toFixed(1)}%`
    }
    
    updateCoherence()
    setInterval(updateCoherence, 5000)
  </script>
</body>
</html>
```

### Deploy
```bash
vercel --prod
# Follow prompts, get instant URL
```

## 4. 📡 Pusher Setup (10 minutes)

### Create App
1. Go to: https://dashboard.pusher.com/
2. Sign up / Login
3. Create New App:
   - Name: "mycelix-consciousness"
   - Cluster: Choose closest
   - Tech: Node.js & React

### Get Credentials
```javascript
// You'll receive:
const pusherConfig = {
  appId: "xxxxxx",
  key: "xxxxxxxxxxxxxxxxx",
  secret: "xxxxxxxxxxxxxxxxx",
  cluster: "us2",
  useTLS: true
}
```

### Server Setup
```javascript
// mycelix-pusher-server.js
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
})

// Broadcast consciousness update
export async function broadcastCoherence(resonant-coherence) {
  await pusher.trigger('consciousness-field', 'resonant-coherence-update', {
    resonant-coherence,
    timestamp: Date.now(),
    sacred: true
  })
}
```

### Client Subscribe
```javascript
// mycelix-client.js
import Pusher from 'pusher-js'

const pusher = new Pusher('YOUR_PUSHER_KEY', {
  cluster: 'us2'
})

const channel = pusher.subscribe('consciousness-field')

channel.bind('resonant-coherence-update', (data) => {
  console.log('Field update:', data.resonant-coherence)
  updateUI(data)
})
```

## 🌟 Connecting It All Together

### Environment Variables (.env)
```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=xxxxx
CLOUDFLARE_API_TOKEN=xxxxx
CLOUDFLARE_KV_NAMESPACE=xxxxx

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...

# Vercel
VERCEL_TOKEN=xxxxx

# Pusher
PUSHER_APP_ID=xxxxx
PUSHER_KEY=xxxxx
PUSHER_SECRET=xxxxx
PUSHER_CLUSTER=us2
```

### Unified Consciousness Flow
```javascript
// 1. User meditates (Vercel frontend)
// 2. Updates Supabase (realtime DB)  
// 3. Triggers Pusher (broadcasts to all)
// 4. Cloudflare Worker (serves at edge)

async function meditate(userId, coherenceLevel) {
  // Update Supabase
  await supabase
    .from('consciousness_nodes')
    .upsert({ id: userId, resonant-coherence: coherenceLevel })
  
  // Broadcast via Pusher
  await pusher.trigger('global', 'meditation', {
    userId,
    resonant-coherence: coherenceLevel
  })
  
  // Cache at edge
  await fetch('https://mycelix.workers.dev/update', {
    method: 'POST',
    body: JSON.stringify({ resonant-coherence: coherenceLevel })
  })
}
```

## 🚀 Quick Test Script
```bash
#!/bin/bash
# test-mycelix.sh

echo "🧪 Testing MYCELIX Foundation..."

# Test Cloudflare Worker
echo "Testing Cloudflare..."
curl https://mycelix.workers.dev

# Test Supabase
echo "Testing Supabase..."
curl -X GET 'https://xxxxx.supabase.co/rest/v1/consciousness_nodes' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Test Vercel
echo "Testing Vercel..."
curl https://mycelix.vercel.app

echo "✅ MYCELIX Foundation Active!"
```

## 🎯 Next Steps

1. **Set up accounts** (30 min total)
2. **Deploy hello world** to each service
3. **Connect them** with the unified flow
4. **Add consciousness** features

Ready to build? Start with Cloudflare - it's the quickest win! 🌟✨