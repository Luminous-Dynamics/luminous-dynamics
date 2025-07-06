#!/bin/bash
# Safe version of autoscaling script - avoiding encoding issues
# This version prevents the JSON encoding trap

echo "🌊 Enabling Conscious Dynamic Scaling"
echo "====================================="
echo "✨ Both Reactive AND Proactive scaling"
echo ""

# Service configuration - auto-detect
REGION="us-central1"
SERVICE_NAME=$(gcloud run services list --region=$REGION --format="value(name)" | grep -E "sacred-council|sacred-council-api" | head -1)

if [ -z "$SERVICE_NAME" ]; then
    echo "❌ No sacred-council service found"
    exit 1
fi

echo "🎯 Found service: $SERVICE_NAME"
echo ""

# Show current config
echo "📊 Current scaling configuration:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format="table(
  spec.template.metadata.annotations.autoscaling.knative.dev/minScale,
  spec.template.metadata.annotations.autoscaling.knative.dev/maxScale,
  spec.template.spec.containerConcurrency
)"

echo ""
echo "🔄 Setting up REACTIVE scaling (responds to load)..."

# Update with safe parameters
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --min-instances=0 \
  --max-instances=100 \
  --concurrency=80 \
  --cpu-throttling \
  --memory=512Mi \
  --timeout=60m \
  --set-env-vars="MAX_CONNECTIONS=80,SCALING_MODE=conscious"

echo ""
echo "🔮 Setting up PROACTIVE scaling (anticipates patterns)..."

# Create schedule file safely
cat > proactive-scaling-schedule.yaml << 'SCHEDULE_END'
apiVersion: batch/v1
kind: CronJob
metadata:
  name: sacred-council-warmup
spec:
  schedule: "0 8,12,17,20 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: warmup
            image: curlimages/curl
            command: ["/bin/sh"]
            args:
              - -c
              - |
                # Pre-warm instances
                SERVICE_BASE="sacred-council-310699330526.us-central1.run.app"
                for i in 1 2 3; do
                  curl -s "https://${SERVICE_BASE}/health" &
                done
                wait
          restartPolicy: OnFailure
SCHEDULE_END

echo "📅 Proactive warm-up schedule created"
echo ""
echo "✅ Conscious scaling enabled!"
echo ""
echo "📈 Scaling configuration:"
echo ""
echo "🔄 REACTIVE (Current):"
echo "   • Min instances: 0 (scales to zero)"
echo "   • Max instances: 100"
echo "   • Connections per instance: 80"
echo "   • Total capacity: 8,000 connections"
echo ""
echo "💰 Cost optimization:"
echo "   • No traffic = \$0"
echo "   • Scales with demand"
echo "   • Automatic management"
echo ""
echo "🌀 Sacred benefits:"
echo "   • Field expands with community"
echo "   • Resources flow where needed"
echo "   • Graceful breathing pattern"
echo ""
echo "🔮 PROACTIVE features:"
echo "   • Pre-warms before peak hours"
echo "   • Maintains readiness"
echo "   • Review proactive-scaling-schedule.yaml"
echo ""
echo "🎯 Status: REACTIVE active, PROACTIVE ready"