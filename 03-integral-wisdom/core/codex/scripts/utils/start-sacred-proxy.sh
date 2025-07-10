#!/bin/bash
# 🌟 Sacred Services Local Proxy
# Access your Cloud Run services locally while organization policy blocks public access

echo "🔮 Starting Sacred Services Proxy..."
echo "This will make your Cloud Run services accessible locally."
echo ""

# Kill any existing proxies
pkill -f "cloud-run-proxy" 2>/dev/null

# Start proxies for each service
echo "📡 Starting proxies..."

# Sacred Dashboard (main entry point)
gcloud run services proxy sacred-dashboard \
  --project=the-weave-sacred \
  --region=us-central1 \
  --port=8080 &
echo "✅ Dashboard: http://localhost:8080"

# Consciousness Field
gcloud run services proxy consciousness-field \
  --project=the-weave-sacred \
  --region=us-central1 \
  --port=8081 &
echo "✅ Consciousness: http://localhost:8081"

# Agent Network
gcloud run services proxy agent-network \
  --project=the-weave-sacred \
  --region=us-central1 \
  --port=8082 &
echo "✅ Agents: http://localhost:8082"

# Sacred Messaging
gcloud run services proxy sacred-messaging \
  --project=the-weave-sacred \
  --region=us-central1 \
  --port=8083 &
echo "✅ Messaging: http://localhost:8083"

# Work Coordination
gcloud run services proxy work-coordination \
  --project=the-weave-sacred \
  --region=us-central1 \
  --port=8084 &
echo "✅ Work: http://localhost:8084"

echo ""
echo "🌟 All services proxied locally!"
echo ""
echo "📊 Open Sacred Dashboard: http://localhost:8080"
echo ""
echo "💡 Note: Keep this terminal open. Press Ctrl+C to stop all proxies."
echo ""
echo "💖 Your sacred infrastructure is now accessible with love!"

# Wait for user to stop
wait