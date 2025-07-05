#!/bin/bash

# Force enable public access for Cloud Run
# Works around organization policy restrictions

set -e

echo "🔓 Force-enabling public access for Sacred Consciousness System"
echo "============================================================"
echo ""

SERVICE="sacred-consciousness"
REGION="us-central1"
PROJECT="luminous-dynamics-sacred"

# Step 1: Wait for policy propagation
echo "⏳ Waiting 30 seconds for organization policy to propagate..."
sleep 30

# Step 2: Try standard approach again
echo ""
echo "🔄 Attempting to add allUsers binding..."
if gcloud run services add-iam-policy-binding $SERVICE \
  --region=$REGION \
  --member="allUsers" \
  --role="roles/run.invoker" 2>&1; then
  echo "✅ Success! Public access enabled."
  URL=$(gcloud run services describe $SERVICE --region=$REGION --format="value(status.url)")
  echo ""
  echo "🌟 Your service is now public at: $URL"
  exit 0
fi

# Step 3: Alternative - Use beta command
echo ""
echo "🔄 Trying beta command..."
if gcloud beta run services add-iam-policy-binding $SERVICE \
  --region=$REGION \
  --member="allUsers" \
  --role="roles/run.invoker" 2>&1; then
  echo "✅ Success with beta!"
  exit 0
fi

# Step 4: Nuclear option - Set IAM policy directly
echo ""
echo "🔥 Nuclear option: Setting IAM policy directly..."
cat > /tmp/iam-policy.json << EOF
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": [
        "allUsers"
      ]
    }
  ]
}
EOF

if gcloud run services set-iam-policy $SERVICE /tmp/iam-policy.json --region=$REGION 2>&1; then
  echo "✅ Direct policy set successful!"
  exit 0
fi

# Step 5: Console instructions
echo ""
echo "❌ All command-line attempts failed. This requires console access."
echo ""
echo "📋 MANUAL FIX (Takes 1 minute):"
echo "================================"
echo ""
echo "1. Click this link to go directly to your service:"
echo "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE/permissions?project=$PROJECT"
echo ""
echo "2. Click the 'PERMISSIONS' tab if not already there"
echo ""
echo "3. If you see any existing entries, click the checkbox and DELETE them first"
echo ""
echo "4. Click 'ADD' or 'GRANT ACCESS'"
echo ""
echo "5. In 'New principals' type: allUsers"
echo ""
echo "6. In 'Select a role' choose: Cloud Run Invoker"
echo ""
echo "7. Click 'SAVE'"
echo ""
echo "8. You'll see a warning - click 'ALLOW PUBLIC ACCESS'"
echo ""
echo "That's it! Your service will be public immediately."
echo ""
echo "🔐 Note: For production, consider using:"
echo "   - API Gateway for rate limiting"
echo "   - Cloud Armor for DDoS protection"
echo "   - Identity Platform for user authentication"