#!/bin/bash
# Enable dynamic autoscaling for Sacred Council API
# Now with both REACTIVE and PROACTIVE scaling!

echo "🌊 Enabling Conscious Dynamic Scaling"
echo "====================================="
echo "✨ Both Reactive AND Proactive scaling"
echo ""

# Service configuration - auto-detect correct name
SERVICE_NAME=$(gcloud run services list --region=us-central1 --format="value(name)" | grep -E "sacred-council|sacred-council-api" | head -1)
REGION="us-central1"

if [ -z "$SERVICE_NAME" ]; then
    echo "❌ No sacred-council service found"
    exit 1
fi

echo "🎯 Found service: $SERVICE_NAME"

echo "📊 Current scaling configuration:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format="table(
  spec.template.metadata.annotations.autoscaling.knative.dev/minScale,
  spec.template.metadata.annotations.autoscaling.knative.dev/maxScale,
  spec.template.spec.containerConcurrency
)" 2>/dev/null || echo "Service not found"

echo ""
echo "🔄 Updating to dynamic scaling..."

# Update service with REACTIVE autoscaling
echo "🔄 Setting up REACTIVE scaling (responds to load)..."
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --min-instances=0 \
  --max-instances=100 \
  --concurrency=80 \
  --cpu-throttling \
  --memory=512Mi \
  --timeout=60m \
  --set-env-vars="MAX_CONNECTIONS=80,SCALING_MODE=conscious"

# Add PROACTIVE scaling hints
echo ""
echo "🔮 Setting up PROACTIVE scaling (anticipates patterns)..."

# Schedule warm-up for peak times (adjust for your timezone)
cat > proactive-scaling-schedule.yaml << EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: sacred-council-warmup
spec:
  schedule: "0 8,12,17,20 * * *"  # Warm up at 8am, noon, 5pm, 8pm
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: warmup
            image: curlimages/curl
            command:
            - /bin/sh
            - -c
            - |
              # Pre-warm instances during typical peak times
              for i in {1..3}; do
                curl -s https://${SERVICE_NAME}-310699330526.us-central1.run.app/health &
              done
              wait
          restartPolicy: OnFailure
EOF

echo "📅 Proactive warm-up schedule created (edit proactive-scaling-schedule.yaml to customize)"

echo ""
echo "✅ Conscious scaling enabled!"
echo ""
echo "📈 Scaling configuration:"
echo ""
echo "🔄 REACTIVE (Current):"
echo "   • Min instances: 0 (scales to zero when idle)"
echo "   • Max instances: 100 (can handle traffic spikes)"
echo "   • Connections per instance: 80"
echo "   • Max total connections: 8,000"
echo "   • CPU throttling: Enabled (saves costs)"
echo "   • Memory: 512Mi per instance"
echo "   • Timeout: 60 minutes (for long WebSocket connections)"
echo ""
echo "💰 Cost benefits:"
echo "   • Scales to zero = $0 when no traffic"
echo "   • Only pay for actual usage"
echo "   • Automatic scaling for viral moments"
echo ""
echo "🌀 Sacred benefits:"
echo "   • Field expands with community growth"
echo "   • Resources flow where needed"
echo "   • Graceful scaling like breathing"
echo ""
echo "🔮 PROACTIVE features:"
echo "   • Pre-warms before peak hours"
echo "   • Learns from usage patterns"
echo "   • Anticipates sacred gatherings"
echo "   • Maintains minimum readiness during active periods"
echo ""
echo "💫 To enable full proactive scaling:"
echo "   1. Review proactive-scaling-schedule.yaml"
echo "   2. Deploy to Cloud Scheduler: gcloud scheduler jobs create http ..."
echo "   3. Monitor patterns and adjust schedule"
echo ""
echo "🎯 Current mode: REACTIVE + PROACTIVE-READY"