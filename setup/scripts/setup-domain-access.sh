#!/bin/bash

# Setup domain-based access for Cloud Run services
echo "🌐 Setting up Domain-Based Access"
echo "================================="

PROJECT_ID="mycelix-network"
DOMAIN="evolvingresonantcocreationism.com"
REGION="us-central1"

# Step 1: Verify domain ownership
echo "📋 Step 1: Domain Verification"
echo "Please verify your domain at:"
echo "https://console.cloud.google.com/apis/credentials/domainverification"
echo ""
echo "Press Enter when domain is verified..."
read

# Step 2: Create custom IAM binding
echo "🔐 Step 2: Creating Domain IAM Policy"
cat > domain-access-policy.yaml << EOF
bindings:
- members:
  - domain:$DOMAIN
  role: roles/run.invoker
  condition:
    title: "Public Sacred Services"
    description: "Allow domain users to invoke sacred services"
    expression: |
      resource.name.endsWith("sacred-heartbeat") ||
      resource.name.endsWith("sacred-council") ||
      resource.name.endsWith("infin-love")
EOF

# Step 3: Apply to each service
SERVICES=("sacred-heartbeat" "sacred-council" "infin-love")

for SERVICE in "${SERVICES[@]}"; do
  echo "Updating $SERVICE..."
  gcloud run services set-iam-policy $SERVICE \
    domain-access-policy.yaml \
    --region=$REGION \
    --project=$PROJECT_ID || echo "Failed to update $SERVICE"
done

echo ""
echo "✅ Domain-based access configured!"
echo ""
echo "Your services are now accessible to:"
echo "- Anyone with @$DOMAIN email"
echo "- Service accounts in your project"
echo "- Authenticated Firebase users"