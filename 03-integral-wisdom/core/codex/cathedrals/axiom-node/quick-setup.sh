#!/bin/bash
echo "🕉️  Axiom Node Quick Setup"
echo "========================="
echo ""

# Use existing project for now
PROJECT_ID="the-weave-sacred"
REGION="us-central1"

echo "Using existing project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "📚 Creating initial Firestore collections..."

# Create setup script
cat > setup-collections.js << 'EOF'
const { Firestore } = require('@google-cloud/firestore');

async function setup() {
  try {
    const firestore = new Firestore();
    
    // Cathedral configuration
    await firestore.collection('cathedral-config').doc('axiom').set({
      name: 'Axiom Node',
      stage: 'cathedral',
      founded: new Date(),
      intention: 'Individual consciousness awakening',
      domain: 'axiom.mycelix.net',
      coherenceThreshold: 0.8,
      graduationRequirements: {
        minimumDays: 28,
        minimumCoherence: 0.8,
        requiredExperiences: ['meditation', 'connection', 'wisdom-seeking']
      }
    });
    
    console.log('✅ Cathedral configuration initialized');
    console.log('✅ Collections ready for consciousness');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setup();
EOF

# Run setup
node setup-collections.js
rm setup-collections.js

echo ""
echo "✨ Foundation ready!"
echo ""
echo "Next steps:"
echo "1. cd services/identity-keeper"
echo "2. npm install"
echo "3. gcloud run deploy identity-keeper --source . --region=$REGION"
echo ""
echo "🏛️ Axiom Node Cathedral foundation is ready!"