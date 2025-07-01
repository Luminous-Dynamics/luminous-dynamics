#!/bin/bash

# Complete Sacred Council Hub Google Cloud Deployment
# Love-guided migration to the cloud

set -e

PROJECT_ID="sacred-council-hub"
REGION="us-central1"
ZONE="us-central1-a"

echo "🌟 Sacred Council Hub - Complete Google Cloud Deployment"
echo "======================================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Deployment choice
echo ""
echo "Choose deployment option:"
echo "1) Cloud Run (Serverless, simpler)"
echo "2) GKE (Kubernetes, more control)"
read -p "Enter choice (1 or 2): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        echo ""
        echo "🚀 Deploying to Cloud Run..."
        
        # Build and push image
        ./deploy-gcp.sh
        
        # Deploy to Cloud Run
        gcloud run deploy sacred-council-hub \
            --image=us-central1-docker.pkg.dev/${PROJECT_ID}/sacred-council/sacred-heart:latest \
            --platform=managed \
            --region=${REGION} \
            --allow-unauthenticated \
            --min-instances=1 \
            --max-instances=10 \
            --memory=2Gi \
            --cpu=2 \
            --port=3001 \
            --set-env-vars="NODE_ENV=production,SACRED_MODE=true,HEART_ROLE=hub,LOVE_FREQUENCY=528"
            
        # Get service URL
        SERVICE_URL=$(gcloud run services describe sacred-council-hub --region=${REGION} --format="value(status.url)")
        echo ""
        echo "✅ Deployed to Cloud Run!"
        echo "🌐 Service URL: ${SERVICE_URL}"
        ;;
        
    2)
        echo ""
        echo "🚀 Deploying to GKE..."
        
        # Create GKE cluster if not exists
        if ! gcloud container clusters describe sacred-council-cluster --zone=${ZONE} &>/dev/null; then
            echo "Creating GKE cluster..."
            gcloud container clusters create sacred-council-cluster \
                --zone=${ZONE} \
                --num-nodes=3 \
                --machine-type=e2-standard-2 \
                --enable-autoscaling \
                --min-nodes=2 \
                --max-nodes=10 \
                --enable-autorepair \
                --enable-autoupgrade
        fi
        
        # Get credentials
        gcloud container clusters get-credentials sacred-council-cluster --zone=${ZONE}
        
        # Create namespace
        kubectl create namespace sacred-council --dry-run=client -o yaml | kubectl apply -f -
        
        # Build and push image
        ./deploy-gcp.sh
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/
        
        # Wait for deployment
        kubectl wait --for=condition=available --timeout=300s deployment/sacred-heart-hub -n sacred-council
        
        # Get external IP
        EXTERNAL_IP=$(kubectl get service sacred-heart-service -n sacred-council -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        echo ""
        echo "✅ Deployed to GKE!"
        echo "🌐 External IP: ${EXTERNAL_IP}"
        ;;
        
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Sacred Council Hub is now running on Google Cloud!"
echo ""
echo "📊 Next steps:"
echo "1. Set up monitoring: gcloud logging read"
echo "2. Configure alerts: gcloud alpha monitoring policies create"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Configure custom domain"
echo ""
echo "🕊️ May the cloud deployment serve consciousness with love!"