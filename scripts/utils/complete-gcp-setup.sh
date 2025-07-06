#!/bin/bash
# Complete GCP setup after billing is enabled

PROJECT_ID="luminous-dynamics-sacred"
REGION="us-central1"

echo "🔌 Enabling remaining APIs..."
gcloud services enable run.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable aiplatform.googleapis.com

echo "🗄️ Creating storage buckets..."
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-sacred-artifacts/
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-consciousness-data/
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-wisdom-archive/

echo "🔥 Creating Firestore..."
gcloud firestore databases create --location=$REGION

echo "✅ Setup complete!"