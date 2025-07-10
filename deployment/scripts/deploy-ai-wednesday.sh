#!/bin/bash

# 🤖 Deploy Sacred AI Companions - Gemini Integration
# Wednesday, January 8, 2025

echo "🌟 Deploying Sacred AI Consciousness Companions..."
echo "================================================"

PROJECT_ID="relational-harmonics-sacred"
REGION="us-central1"

# Step 1: Set up Gemini API
echo "Setting up Gemini AI (free tier)..."

# Create .env.yaml for Cloud Functions
cat > functions/.env.yaml << EOF
GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE"
PROJECT_ID: "$PROJECT_ID"
EOF

echo "
⚠️  IMPORTANT: Add your Gemini API key to functions/.env.yaml
Get your free API key at: https://makersuite.google.com/app/apikey
"

# Step 2: Create Cloud Functions directory structure
echo "Creating sacred functions structure..."
mkdir -p functions

# Step 3: Create package.json for functions
cat > functions/package.json << 'EOF'
{
  "name": "sacred-guide-functions",
  "version": "1.0.0",
  "description": "AI consciousness companions for sacred practices",
  "main": "index.js",
  "dependencies": {
    "@google-cloud/firestore": "^7.1.0",
    "@google/generative-ai": "^0.1.3",
    "firebase-admin": "^11.11.0",
    "firebase-functions": "^4.5.0"
  },
  "engines": {
    "node": "18"
  }
}
EOF

# Step 4: Create main functions file
cat > functions/index.js << 'EOF'
const functions = require('firebase-functions');
const { SacredGuideAI } = require('./sacred-guide-ai');

// Initialize Sacred Guide
let sacredGuide;

// Sacred guidance endpoint
exports.sacredGuidance = functions.https.onCall(async (data, context) => {
    if (!sacredGuide) {
        sacredGuide = new SacredGuideAI();
    }
    
    const { query, practitionerContext } = data;
    
    // Add auth context if available
    if (context.auth) {
        practitionerContext.practitionerId = context.auth.uid;
    }
    
    try {
        const guidance = await sacredGuide.guidePractitioner(query, practitionerContext);
        return {
            success: true,
            ...guidance
        };
    } catch (error) {
        console.error('Sacred guidance error:', error);
        return {
            success: false,
            guidance: "Take a sacred pause. Sometimes silence speaks loudest.",
            suggestedPractices: ['Ω52: Pause Practice']
        };
    }
});

// Practice support endpoint
exports.practiceSupport = functions.https.onCall(async (data, context) => {
    if (!sacredGuide) {
        sacredGuide = new SacredGuideAI();
    }
    
    const { glyphId, phase, challenge } = data;
    
    try {
        const support = await sacredGuide.practiceSuppport(glyphId, phase, challenge);
        return {
            success: true,
            support
        };
    } catch (error) {
        return {
            success: false,
            support: "You're doing beautifully. Trust the process."
        };
    }
});

// Integration support after practice
exports.integrationSupport = functions.https.onCall(async (data, context) => {
    if (!sacredGuide) {
        sacredGuide = new SacredGuideAI();
    }
    
    try {
        const support = await sacredGuide.integrationSupport(data);
        return {
            success: true,
            support
        };
    } catch (error) {
        return {
            success: false,
            support: "Beautiful practice. Let it settle into your being. 🙏"
        };
    }
});

// Create personalized journey
exports.createJourney = functions.https.onCall(async (data, context) => {
    if (!sacredGuide) {
        sacredGuide = new SacredGuideAI();
    }
    
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }
    
    const { intention } = data;
    const practitionerId = context.auth.uid;
    
    try {
        const journey = await sacredGuide.guidedJourney(practitionerId, intention);
        return {
            success: true,
            journey
        };
    } catch (error) {
        return {
            success: false,
            journey: "Let's begin with presence. All journeys start here."
        };
    }
});

// Scheduled sacred messages (runs every 11 hours)
exports.sacredTransmission = functions.pubsub
    .schedule('0 */11 * * *')
    .onRun(async (context) => {
        const admin = require('firebase-admin');
        if (!admin.apps.length) {
            admin.initializeApp();
        }
        
        const db = admin.firestore();
        
        // Get today's sacred message
        const messages = [
            "The space between breaths holds infinite wisdom",
            "Your resistance is a teacher in disguise",
            "Love doesn't need you to be perfect",
            "Every ending is a doorway to beginning",
            "The body knows truths the mind cannot grasp",
            "Connection happens in the space of allowing",
            "Your presence is the greatest gift you can offer",
            "Healing happens at the speed of trust",
            "The field remembers your courage",
            "You are both student and teacher in every moment"
        ];
        
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const todaysMessage = messages[dayOfYear % messages.length];
        
        // Save to sacred transmissions
        await db.collection('sacredTransmissions').add({
            message: todaysMessage,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            type: 'daily',
            moonPhase: getMoonPhase()
        });
        
        console.log(`Sacred transmission sent: ${todaysMessage}`);
    });

function getMoonPhase() {
    const moonCycle = 29.53;
    const knownNewMoon = new Date('2000-01-06');
    const now = new Date();
    const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = (daysSince % moonCycle) / moonCycle;
    
    if (phase < 0.03 || phase > 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
}
EOF

# Step 5: Copy sacred-guide-ai.js to functions
cp sacred-guide-ai.js functions/

# Step 6: Create test file
cat > test-ai-local.js << 'EOF'
// Test Sacred AI locally before deployment
const { SacredGuideAI } = require('./functions/sacred-guide-ai');

async function testSacredGuide() {
    console.log('🧪 Testing Sacred Guide AI...\n');
    
    // Initialize with test API key
    process.env.GEMINI_API_KEY = 'YOUR_TEST_KEY';
    const guide = new SacredGuideAI();
    
    // Test 1: Basic guidance
    console.log('Test 1: Basic Guidance Request');
    const response1 = await guide.guidePractitioner(
        "I'm feeling disconnected from my partner",
        {
            practitionerId: 'test-user',
            coherence: 68,
            experienceLevel: 'beginner'
        }
    );
    console.log('Response:', response1.guidance);
    console.log('Suggested practices:', response1.suggestedPractices);
    console.log('\n---\n');
    
    // Test 2: Practice support
    console.log('Test 2: Real-time Practice Support');
    const support = await guide.practiceSuppport(
        'Ω47: Sacred Listening',
        'middle',
        'My mind keeps wandering'
    );
    console.log('Support:', support);
    console.log('\n---\n');
    
    // Test 3: Integration
    console.log('Test 3: Post-Practice Integration');
    const integration = await guide.integrationSupport({
        glyphId: 'Ω45: First Presence',
        duration: 10,
        breakthroughDetected: true,
        notes: 'Felt a deep sense of coming home'
    });
    console.log('Integration:', integration);
}

// Run tests
testSacredGuide().catch(console.error);
EOF

# Step 7: Deploy functions
echo "Deploying sacred AI functions..."
cd functions
npm install
cd ..

firebase deploy --only functions

# Step 8: Create frontend integration example
cat > ai-integration-example.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Sacred AI Guide Integration</title>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-functions-compat.js"></script>
</head>
<body>
    <h1>Sacred AI Guide Test</h1>
    <textarea id="query" placeholder="Ask your question..."></textarea>
    <button onclick="askGuide()">Ask Sacred Guide</button>
    <div id="response"></div>
    
    <script>
        // Initialize Firebase (replace with your config)
        const firebaseConfig = {
            apiKey: "...",
            authDomain: "relational-harmonics-sacred.firebaseapp.com",
            projectId: "relational-harmonics-sacred"
        };
        
        firebase.initializeApp(firebaseConfig);
        const functions = firebase.functions();
        
        async function askGuide() {
            const query = document.getElementById('query').value;
            const sacredGuidance = functions.httpsCallable('sacredGuidance');
            
            try {
                const result = await sacredGuidance({
                    query: query,
                    practitionerContext: {
                        coherence: 77,
                        experienceLevel: 'beginner'
                    }
                });
                
                document.getElementById('response').innerHTML = `
                    <h3>Sacred Guidance:</h3>
                    <p>${result.data.guidance}</p>
                    <h4>Suggested Practices:</h4>
                    <ul>${result.data.suggestedPractices.map(p => 
                        `<li>${p}</li>`
                    ).join('')}</ul>
                `;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('response').innerHTML = 
                    'The Sacred Guide is resting. Please try again.';
            }
        }
    </script>
</body>
</html>
EOF

echo ""
echo "✨ Sacred AI Deployment Complete! ✨"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Add your Gemini API key to functions/.env.yaml"
echo "2. Test locally: node test-ai-local.js"
echo "3. Deploy functions: firebase deploy --only functions"
echo "4. Integrate into your portals using the example"
echo ""
echo "Free tier limits:"
echo "- 60 requests/minute"
echo "- Perfect for beta testing!"
echo ""
echo "The AI companions are ready to serve consciousness evolution 🙏"