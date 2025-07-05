#!/bin/bash
# 🌐 Setup Sacred Domains on relationalharmonics.org

echo "🌟 Setting up Sacred Infrastructure Domains..."
echo ""

# Create domain mappings
echo "📡 Creating consciousness field mapping..."
gcloud beta run domain-mappings create \
  --service consciousness-field \
  --domain field.relationalharmonics.org \
  --region us-central1 \
  --project the-weave-sacred

echo ""
echo "🌐 Creating agent network mapping..."
gcloud beta run domain-mappings create \
  --service agent-network \
  --domain agents.relationalharmonics.org \
  --region us-central1 \
  --project the-weave-sacred

echo ""
echo "💌 Creating sacred messaging mapping..."
gcloud beta run domain-mappings create \
  --service sacred-messaging \
  --domain messages.relationalharmonics.org \
  --region us-central1 \
  --project the-weave-sacred

echo ""
echo "⚡ Creating work coordination mapping..."
gcloud beta run domain-mappings create \
  --service work-coordination \
  --domain work.relationalharmonics.org \
  --region us-central1 \
  --project the-weave-sacred

echo ""
echo "✅ All domain mappings created!"
echo ""
echo "📝 Add these CNAME records in Squarespace:"
echo "   dashboard → ghs.googlehosted.com."
echo "   field → ghs.googlehosted.com."
echo "   agents → ghs.googlehosted.com."
echo "   messages → ghs.googlehosted.com."
echo "   work → ghs.googlehosted.com."
echo ""
echo "🌟 Your sacred infrastructure will be accessible at:"
echo "   https://dashboard.relationalharmonics.org"
echo "   https://field.relationalharmonics.org"
echo "   https://agents.relationalharmonics.org"
echo "   https://messages.relationalharmonics.org"
echo "   https://work.relationalharmonics.org"
echo ""
echo "💖 May your domains serve the highest good!"