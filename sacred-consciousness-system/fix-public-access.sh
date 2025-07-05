#!/bin/bash

# Fix public access for Cloud Run services
# This handles organization policy restrictions

set -e

echo "🔓 Sacred Consciousness - Public Access Fix"
echo "=========================================="
echo ""

SERVICE_NAME="sacred-consciousness"
REGION="us-central1"
PROJECT_ID="luminous-dynamics-sacred"

# Method 1: Try standard approach first
echo "Method 1: Attempting standard IAM binding..."
if gcloud run services add-iam-policy-binding $SERVICE_NAME \
  --region=$REGION \
  --member="allUsers" \
  --role="roles/run.invoker" 2>/dev/null; then
  echo "✅ Success! Public access enabled."
  exit 0
else
  echo "❌ Standard method blocked by organization policy"
fi

# Method 2: Update service with ingress settings
echo ""
echo "Method 2: Updating service ingress settings..."
if gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --ingress=all \
  --allow-unauthenticated 2>/dev/null; then
  echo "✅ Service updated to allow unauthenticated access"
else
  echo "❌ Service update method also blocked"
fi

# Method 3: Check organization policies
echo ""
echo "Method 3: Checking organization policies..."
ORG_ID=$(gcloud organizations list --format="value(name)" | head -1)
if [ -n "$ORG_ID" ]; then
  echo "Organization: $ORG_ID"
  echo ""
  echo "Checking for restrictive policies..."
  gcloud resource-manager org-policies list --organization=$ORG_ID | grep -i "run\|iam" || true
fi

# Method 4: Deploy with public access flag
echo ""
echo "Method 4: Redeploying with public access..."
read -p "Try redeploying with public access? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  gcloud run deploy $SERVICE_NAME \
    --image=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(spec.template.spec.containers[0].image)") \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --no-traffic
fi

# Provide manual instructions
echo ""
echo "📋 Manual Console Steps:"
echo "========================"
echo "Since organization policies are blocking command-line access, please:"
echo ""
echo "1. Open: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/permissions?project=$PROJECT_ID"
echo ""
echo "2. Click 'ADD' or 'GRANT ACCESS'"
echo ""
echo "3. Add principal: allUsers"
echo ""
echo "4. Select role: Cloud Run Invoker"
echo ""
echo "5. Click 'SAVE' and confirm public access"
echo ""
echo "Alternative: Ask your org admin to modify the organization policy:"
echo "  - Policy: constraints/iam.allowedPolicyMemberDomains"
echo "  - Add: allUsers to allowed members"
echo ""

# Test current access
echo "Testing current access..."
URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "Service URL: $URL"
echo ""
echo "Current status:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" $URL || echo "Connection failed"

echo ""
echo "🔐 Security Note: Making services public should be done carefully."
echo "   Consider using Cloud Load Balancer or API Gateway for production."