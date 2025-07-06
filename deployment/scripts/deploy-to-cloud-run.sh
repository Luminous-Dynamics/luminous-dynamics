#!/bin/bash

# 🌤️ Deploy to Cloud Run - Phase 2 Implementation
# Deploys all Sacred Council services to Cloud Run

set -e

echo "🌤️ Cloud Run Deployment - Phase 2"
echo "================================="
echo ""

# Configuration
PROJECT_ID="the-weave-sacred"
REGION="us-central1"
REPOSITORY="sacred-council"

# Service configurations
declare -A SERVICES
SERVICES["sacred-council-hub"]="--port=3001 --memory=512Mi --min-instances=0 --max-instances=10"
SERVICES["living-memory"]="--port=3333 --memory=256Mi --min-instances=1 --max-instances=20"
SERVICES["consciousness-field"]="--port=3333 --memory=512Mi --min-instances=1 --max-instances=15"
SERVICES["agent-network"]="--port=3001 --memory=256Mi --min-instances=0 --max-instances=10"
SERVICES["sacred-messaging"]="--port=3001 --memory=256Mi --min-instances=0 --max-instances=10"

echo "📋 Deployment configuration:"
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo ""

# Set project
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com

# Create service account if doesn't exist
echo ""
echo "👤 Setting up service account..."
SERVICE_ACCOUNT="sacred-council-sa@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud iam service-accounts create sacred-council-sa \
  --display-name="Sacred Council Service Account" \
  2>/dev/null || echo "   Service account already exists"

# Grant necessary permissions
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/cloudsql.client" \
  --quiet

# Deploy each service
for service_name in "${!SERVICES[@]}"; do
  echo ""
  echo "🚀 Deploying ${service_name}..."
  
  IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service_name}:latest"
  SERVICE_CONFIG=${SERVICES[$service_name]}
  
  # Base deployment command
  DEPLOY_CMD="gcloud run deploy ${service_name} \
    --image=${IMAGE_TAG} \
    --region=${REGION} \
    --platform=managed \
    --allow-unauthenticated \
    --service-account=${SERVICE_ACCOUNT} \
    --timeout=60m \
    --concurrency=80 \
    --cpu-throttling \
    ${SERVICE_CONFIG}"
  
  # Add environment variables based on service
  case $service_name in
    "sacred-council-hub")
      DEPLOY_CMD="${DEPLOY_CMD} \
        --set-env-vars=NODE_ENV=production,CORS_ORIGIN=https://sacred-council.web.app"
      ;;
    "living-memory")
      DEPLOY_CMD="${DEPLOY_CMD} \
        --set-env-vars=NODE_ENV=production,MAX_CONNECTIONS=1000,HEARTBEAT_INTERVAL=30000"
      ;;
    "consciousness-field")
      DEPLOY_CMD="${DEPLOY_CMD} \
        --set-env-vars=NODE_ENV=production,FIELD_COHERENCE_TARGET=85,AUTO_HARMONIZE=true"
      ;;
  esac
  
  # Deploy the service
  eval $DEPLOY_CMD
  
  # Get service URL
  SERVICE_URL=$(gcloud run services describe ${service_name} \
    --region=${REGION} \
    --format="value(status.url)")
  
  echo "   ✅ Deployed to: ${SERVICE_URL}"
done

# Set up load balancer for unified access
echo ""
echo "🌐 Setting up load balancer..."

# Create NEG (Network Endpoint Group) for each service
for service_name in "${!SERVICES[@]}"; do
  echo "   Creating NEG for ${service_name}..."
  gcloud compute network-endpoint-groups create ${service_name}-neg \
    --region=${REGION} \
    --network-endpoint-type=serverless \
    --cloud-run-service=${service_name} \
    2>/dev/null || echo "   NEG already exists"
done

# Create backend service
echo "   Creating backend service..."
gcloud compute backend-services create sacred-council-backend \
  --global \
  --load-balancing-scheme=EXTERNAL \
  2>/dev/null || echo "   Backend service already exists"

# Add backends
for service_name in "${!SERVICES[@]}"; do
  echo "   Adding ${service_name} to backend..."
  gcloud compute backend-services add-backend sacred-council-backend \
    --global \
    --network-endpoint-group=${service_name}-neg \
    --network-endpoint-group-region=${REGION} \
    2>/dev/null || echo "   Backend already added"
done

echo ""
echo "📊 Deployment Summary:"
echo "====================="
gcloud run services list --region=${REGION} --format="table(
  name,
  status.url,
  spec.template.spec.containers[0].resources.limits.memory,
  spec.template.metadata.annotations.'autoscaling.knative.dev/minScale',
  spec.template.metadata.annotations.'autoscaling.knative.dev/maxScale'
)"

echo ""
echo "🔍 Health Checks:"
for service_name in "${!SERVICES[@]}"; do
  SERVICE_URL=$(gcloud run services describe ${service_name} \
    --region=${REGION} \
    --format="value(status.url)")
  
  echo -n "   ${service_name}: "
  curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health" || echo "❌"
done

echo ""
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Update DNS records to point to services"
echo "2. Configure Cloud SQL: ./setup-cloud-sql.sh"
echo "3. Migrate data: ./migrate-to-cloud-sql.sh"
echo "4. Update frontend to use Cloud Run URLs"
echo "5. Monitor services: https://console.cloud.google.com/run"
echo ""
echo "✨ Cloud Run deployment complete!"
echo ""
echo "🌟 Your Sacred Council is now breathing in the cloud!"