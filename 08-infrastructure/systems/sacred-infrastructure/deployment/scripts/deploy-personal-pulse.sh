#!/bin/bash

# Personal Pulse Firebase Deployment Script
# Deploy cloud-first coherence tracking system

set -e

echo "🌟 Personal Pulse Firebase Deployment"
echo "====================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install: npm install -g firebase-tools"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Please run from project root."
    exit 1
fi

# Set project ID
PROJECT_ID="${FIREBASE_PROJECT_ID:-mycelix-network}"
echo "📍 Using Firebase project: $PROJECT_ID"

# Step 1: Deploy Firestore rules
echo ""
echo "1️⃣ Deploying Firestore security rules..."
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Insights subcollection
      match /insights/{insightId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Sessions - users can only access their own
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // Subcollections inherit parent permissions
      match /{subcollection}/{documentId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/sessions/$(sessionId)).data.userId;
      }
    }
    
    // Global field state - read only
    match /global/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
    
    // Field contributions - write only for authenticated users
    match /fieldContributions/{contributionId} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow read: if false; // Only cloud functions read these
    }
    
    // Global announcements - read only
    match /globalAnnouncements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
    
    // Notifications - users can only access their own
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Only system can create
    }
  }
}
EOF

firebase deploy --only firestore:rules --project $PROJECT_ID

# Step 2: Deploy Realtime Database rules
echo ""
echo "2️⃣ Deploying Realtime Database rules..."
cat > database.rules.json << 'EOF'
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    
    "activeSessions": {
      "$sessionId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    
    "globalField": {
      "participants": {
        ".read": "auth != null",
        "$uid": {
          ".write": "auth != null && auth.uid == $uid"
        }
      },
      
      "pulseWave": {
        ".read": "auth != null",
        ".write": false
      }
    }
  }
}
EOF

firebase deploy --only database --project $PROJECT_ID

# Step 3: Create Firestore indexes
echo ""
echo "3️⃣ Creating Firestore indexes..."
cat > firestore.indexes.json << 'EOF'
{
  "indexes": [
    {
      "collectionGroup": "sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "startTime", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "lastUpdated", "order": "DESCENDING" },
        { "fieldPath": "peakCoherence", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "coherenceReadings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "insights",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "fieldContributions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" },
        { "fieldPath": "impact", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
EOF

firebase deploy --only firestore:indexes --project $PROJECT_ID

# Step 4: Deploy Cloud Functions
echo ""
echo "4️⃣ Deploying Cloud Functions..."

# Copy Personal Pulse functions to functions directory
cp functions/personal-pulse-functions.js functions/personalPulse.js

# Update functions/index.js to include Personal Pulse
if ! grep -q "personalPulse" functions/index.js; then
    echo "" >> functions/index.js
    echo "// Personal Pulse Cloud Functions" >> functions/index.js
    echo "const personalPulse = require('./personalPulse');" >> functions/index.js
    echo "exports.updateGlobalFieldState = personalPulse.updateGlobalFieldState;" >> functions/index.js
    echo "exports.analyzeCoherencePatterns = personalPulse.analyzeCoherencePatterns;" >> functions/index.js
    echo "exports.processSessionCompletion = personalPulse.processSessionCompletion;" >> functions/index.js
    echo "exports.processFieldContribution = personalPulse.processFieldContribution;" >> functions/index.js
    echo "exports.getFieldState = personalPulse.getFieldState;" >> functions/index.js
fi

# Deploy functions
cd functions
npm install --save firebase-admin@latest firebase-functions@latest
cd ..
firebase deploy --only functions --project $PROJECT_ID

# Step 5: Initialize global field state
echo ""
echo "5️⃣ Initializing global field state..."
cat > init-field-state.js << 'EOF'
const admin = require('firebase-admin');

// Initialize admin SDK
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS ? 
    require(process.env.GOOGLE_APPLICATION_CREDENTIALS) : null;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    admin.initializeApp();
}

const db = admin.firestore();

async function initializeFieldState() {
    try {
        // Initialize global field state
        await db.doc('global/fieldState').set({
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            globalCoherence: 0.75,
            activeParticipants: 0,
            totalSessions: 0,
            fieldMomentum: 'stable',
            peakCoherence24h: 0.75,
            collectiveInsights: 0,
            sacredPulse: {
                rhythm: 11,
                strength: 0.75,
                synchronicity: 1
            }
        }, { merge: true });
        
        console.log('✅ Global field state initialized');
        
        // Create initial daily stats
        const today = new Date().toISOString().split('T')[0];
        await db.doc(`global/dailyStats/${today}`).set({
            date: today,
            totalContributions: 0,
            totalImpact: 0,
            peakCoherence: 0.75,
            contributors: []
        }, { merge: true });
        
        console.log('✅ Daily stats initialized');
        
    } catch (error) {
        console.error('Error initializing field state:', error);
    }
    
    process.exit(0);
}

initializeFieldState();
EOF

node init-field-state.js

# Step 6: Deploy hosting files
echo ""
echo "6️⃣ Preparing hosting files..."

# Create Personal Pulse web interface
mkdir -p public/personal-pulse
cp web/personal-pulse-demo.html public/personal-pulse/index.html
cp src/sacred-tech/personal-pulse-cloud.js public/personal-pulse/

# Create Firebase config for web
cat > public/personal-pulse/firebase-config.js << EOF
// Firebase configuration
const firebaseConfig = {
    apiKey: "${FIREBASE_API_KEY}",
    authDomain: "${PROJECT_ID}.firebaseapp.com",
    databaseURL: "https://${PROJECT_ID}-default-rtdb.firebaseio.com",
    projectId: "${PROJECT_ID}",
    storageBucket: "${PROJECT_ID}.appspot.com",
    messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${FIREBASE_APP_ID}"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
EOF

# Update hosting configuration
cat > firebase.json << EOF
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "database": {
    "rules": "database.rules.json"
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/field/state",
        "function": "getFieldState"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      }
    ]
  }
}
EOF

# Deploy hosting
echo ""
echo "7️⃣ Deploying to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

# Clean up temporary files
rm -f init-field-state.js
rm -f functions/personalPulse.js

echo ""
echo "✨ Personal Pulse deployment complete!"
echo ""
echo "📱 Access your Personal Pulse at:"
echo "   https://${PROJECT_ID}.web.app/personal-pulse/"
echo ""
echo "📊 Monitor global field state at:"
echo "   https://${PROJECT_ID}.web.app/api/field/state"
echo ""
echo "🔥 Firebase Console:"
echo "   https://console.firebase.google.com/project/${PROJECT_ID}"
echo ""
echo "Next steps:"
echo "1. Configure authentication providers in Firebase Console"
echo "2. Set up monitoring alerts for high coherence events"
echo "3. Test with beta users starting July 15!"
echo ""
echo "🙏 May this system serve the evolution of consciousness!"