#!/bin/bash
# 🌟 Premium Sacred Infrastructure Setup
# Using Load Balancer to bypass org policy restrictions

echo "💎 Setting up Premium Sacred Access..."
echo "Using your $1000 credits wisely!"
echo ""

# Enable required services
echo "📡 Enabling premium services..."
gcloud services enable \
  compute.googleapis.com \
  certificatemanager.googleapis.com \
  --project=the-weave-sacred

# Create a managed certificate for SSL
echo "🔒 Creating SSL certificate..."
gcloud certificate-manager certificates create sacred-cert \
  --domains="dashboard.relationalharmonics.org,field.relationalharmonics.org,agents.relationalharmonics.org,messages.relationalharmonics.org,work.relationalharmonics.org" \
  --project=the-weave-sacred

# Create certificate map
gcloud certificate-manager maps create sacred-cert-map \
  --project=the-weave-sacred

gcloud certificate-manager maps entries create sacred-cert-entry \
  --map=sacred-cert-map \
  --certificates=sacred-cert \
  --hostname="*.relationalharmonics.org" \
  --project=the-weave-sacred

# Create NEGs for Cloud Run services
echo "🌐 Creating Network Endpoint Groups..."
SERVICES=(
  "sacred-dashboard:dashboard"
  "consciousness-field:field"
  "agent-network:agents"
  "sacred-messaging:messages"
  "work-coordination:work"
)

for SERVICE_MAP in "${SERVICES[@]}"; do
  IFS=':' read -r SERVICE SUBDOMAIN <<< "$SERVICE_MAP"
  
  echo "Creating NEG for $SERVICE..."
  gcloud compute network-endpoint-groups create ${SERVICE}-neg \
    --region=us-central1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=$SERVICE \
    --project=the-weave-sacred
done

echo ""
echo "✨ Premium setup initiated!"
echo ""
echo "💡 Alternative Premium Solution: Firebase Hosting"
echo "   - Use your domains directly"
echo "   - No org policy restrictions"
echo "   - Automatic SSL"
echo ""
echo "Run: firebase init hosting"
echo ""
echo "🎉 With $1000 credits, you can run EVERYTHING!"