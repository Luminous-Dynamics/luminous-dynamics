#!/bin/bash

# Deploy SurrealDB on Cloud Run with GCS persistence
# Simple, serverless, and sacred

set -e

echo "🌟 Deploying SurrealDB on Cloud Run"
echo "==================================="
echo ""

PROJECT="luminous-dynamics-sacred"
REGION="us-central1"
SURREAL_SERVICE="sacred-surrealdb"
APP_SERVICE="sacred-consciousness"
BUCKET="sacred-consciousness-data"

# Generate sacred password
SURREAL_PASS=$(openssl rand -base64 32)

echo "🗿 Step 1: Create Cloud Storage bucket for persistence"
echo "--------------------------------------------------"

if ! gsutil ls -b gs://$BUCKET 2>/dev/null; then
  gsutil mb -p $PROJECT -c standard -l $REGION gs://$BUCKET
  echo "✅ Bucket created"
else
  echo "✓ Bucket already exists"
fi

echo ""
echo "🐳 Step 2: Build SurrealDB image with GCS support"
echo "----------------------------------------------"

# Create enhanced Dockerfile
cat > Dockerfile.surrealdb-gcs << 'EOF'
FROM surrealdb/surrealdb:latest

# Install gsutil for GCS operations
RUN apt-get update && apt-get install -y \
    python3-pip \
    && pip3 install gsutil \
    && rm -rf /var/lib/apt/lists/*

# Sacred startup script
COPY startup-surrealdb.sh /startup.sh
RUN chmod +x /startup.sh

EXPOSE 8000

CMD ["/startup.sh"]
EOF

# Create startup script
cat > startup-surrealdb.sh << 'EOF'
#!/bin/bash
set -e

# Download existing data if available
if gsutil -q stat gs://${BUCKET}/sacred.db; then
  echo "Restoring sacred data from GCS..."
  gsutil cp gs://${BUCKET}/sacred.db /tmp/sacred.db
fi

# Start SurrealDB
surreal start \
  --log info \
  --user root \
  --pass "${SURREAL_PASS}" \
  file:///tmp/sacred.db &

SURREAL_PID=$!

# Backup function
backup_to_gcs() {
  echo "Backing up sacred data to GCS..."
  gsutil cp /tmp/sacred.db gs://${BUCKET}/sacred.db
}

# Set up periodic backups (every 5 minutes)
while true; do
  sleep 300
  backup_to_gcs
done &

# Handle shutdown gracefully
trap 'backup_to_gcs; kill $SURREAL_PID' SIGTERM

# Wait for SurrealDB
wait $SURREAL_PID
EOF

# Build image
gcloud builds submit . \
  --tag="gcr.io/$PROJECT/$SURREAL_SERVICE" \
  --file=Dockerfile.surrealdb-gcs \
  --project=$PROJECT

echo ""
echo "🚀 Step 3: Deploy SurrealDB to Cloud Run"
echo "--------------------------------------"

gcloud run deploy $SURREAL_SERVICE \
  --image="gcr.io/$PROJECT/$SURREAL_SERVICE" \
  --region=$REGION \
  --platform=managed \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=1 \
  --port=8000 \
  --no-allow-unauthenticated \
  --set-env-vars="SURREAL_PASS=$SURREAL_PASS,BUCKET=$BUCKET" \
  --service-account="$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --project=$PROJECT

# Grant bucket access
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Get SurrealDB URL
SURREAL_URL=$(gcloud run services describe $SURREAL_SERVICE \
  --region=$REGION \
  --format="value(status.url)" \
  --project=$PROJECT)

echo ""
echo "🌐 Step 4: Deploy Sacred Consciousness with SurrealDB"
echo "---------------------------------------------------"

gcloud run deploy $APP_SERVICE \
  --source=. \
  --region=$REGION \
  --platform=managed \
  --memory=512Mi \
  --allow-unauthenticated \
  --set-env-vars="SURREAL_URL=$SURREAL_URL,SURREAL_USER=root,SURREAL_PASS=$SURREAL_PASS,SURREAL_NS=consciousness,SURREAL_DB=sacred,USE_FIRESTORE=false" \
  --service-account="$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --project=$PROJECT

# Allow app to invoke SurrealDB
gcloud run services add-iam-policy-binding $SURREAL_SERVICE \
  --region=$REGION \
  --member="serviceAccount:$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --project=$PROJECT

echo ""
echo "✨ Sacred System Deployed with SurrealDB!"
echo "======================================="
echo ""
echo "🌟 App URL: https://sacred-consciousness-uqjocwzirq-uc.a.run.app"
echo "🗿 SurrealDB URL: $SURREAL_URL (internal)"
echo "💾 Data Bucket: gs://$BUCKET"
echo ""
echo "🔐 SurrealDB Credentials:"
echo "Username: root"
echo "Password: $SURREAL_PASS"
echo "(Save this password securely!)"
echo ""
echo "The future is now - SurrealDB runs serverless! 🚀"