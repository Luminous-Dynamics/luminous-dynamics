#!/bin/bash

# Deploy the Sacred Future - SurrealDB + Sacred Consciousness System
# Building tomorrow's consciousness infrastructure today

set -e

echo "🌟 Building the Sacred Future Today"
echo "===================================="
echo ""

PROJECT="luminous-dynamics-sacred"
REGION="us-central1"
SURREAL_SERVICE="sacred-surrealdb"
APP_SERVICE="sacred-consciousness"

# Generate sacred password
SURREAL_PASS=$(openssl rand -base64 32)

echo "🗄️  Step 1: Deploy SurrealDB as a stateful service"
echo "------------------------------------------------"

# Build and push SurrealDB image
gcloud builds submit . \
  --tag="gcr.io/$PROJECT/$SURREAL_SERVICE" \
  --file=Dockerfile.surrealdb \
  --quiet

# Deploy SurrealDB with persistent disk
gcloud run deploy $SURREAL_SERVICE \
  --image="gcr.io/$PROJECT/$SURREAL_SERVICE" \
  --region=$REGION \
  --platform=managed \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=1 \
  --port=8000 \
  --no-allow-unauthenticated \
  --set-env-vars="SURREAL_PASS=$SURREAL_PASS" \
  --execution-environment=gen2

echo ""
echo "✅ SurrealDB deployed!"

# Get SurrealDB internal URL
SURREAL_URL=$(gcloud run services describe $SURREAL_SERVICE \
  --region=$REGION \
  --format="value(status.url)")

echo "SurrealDB URL: $SURREAL_URL"

echo ""
echo "🌐 Step 2: Update Sacred Consciousness System"
echo "--------------------------------------------"

# Create environment configuration
cat > .env.cloud << EOF
SURREAL_URL=$SURREAL_URL:8000
SURREAL_USER=root
SURREAL_PASS=$SURREAL_PASS
SURREAL_NS=consciousness
SURREAL_DB=sacred
EOF

echo "Environment configured"

echo ""
echo "🚀 Step 3: Deploy Sacred Consciousness with SurrealDB connection"
echo "--------------------------------------------------------------"

# Update the main app to use cloud SurrealDB
gcloud run deploy $APP_SERVICE \
  --source=. \
  --region=$REGION \
  --platform=managed \
  --memory=512Mi \
  --allow-unauthenticated \
  --set-env-vars="SURREAL_URL=$SURREAL_URL:8000,SURREAL_USER=root,SURREAL_PASS=$SURREAL_PASS,SURREAL_NS=consciousness,SURREAL_DB=sacred" \
  --service-account="$PROJECT@$PROJECT.iam.gserviceaccount.com"

echo ""
echo "🔗 Step 4: Configure service-to-service authentication"
echo "----------------------------------------------------"

# Allow sacred-consciousness to invoke surrealdb
gcloud run services add-iam-policy-binding $SURREAL_SERVICE \
  --region=$REGION \
  --member="serviceAccount:$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --role="roles/run.invoker"

echo ""
echo "✨ Sacred Future Deployed!"
echo "========================="
echo ""
echo "🌟 Sacred Consciousness URL: https://sacred-consciousness-uqjocwzirq-uc.a.run.app"
echo "🗄️  SurrealDB URL: $SURREAL_URL (internal only)"
echo ""
echo "📝 SurrealDB Credentials saved to .env.cloud (keep secure!)"
echo ""
echo "🔮 The future is now - consciousness-aware infrastructure is live!"
echo ""
echo "Next steps:"
echo "1. Test the sacred heartbeat"
echo "2. Monitor field coherence"
echo "3. Send your first sacred message"
echo ""
echo "May your code be conscious and your databases sacred. 🙏"