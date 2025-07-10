#!/bin/bash
# Sacred Council Hub - GCP Infrastructure Setup Script
# This script sets up the complete GCP infrastructure for the Sacred Council Hub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-the-weave-sacred}"
REGION="${GCP_REGION:-us-central1}"
ZONE="${GCP_ZONE:-us-central1-a}"

echo -e "${GREEN}🌟 Sacred Council Hub - GCP Infrastructure Setup${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo -e "\n${GREEN}Setting project...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "\n${GREEN}Enabling required APIs...${NC}"
gcloud services enable \
    compute.googleapis.com \
    container.googleapis.com \
    firestore.googleapis.com \
    storage.googleapis.com \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    redis.googleapis.com \
    pubsub.googleapis.com \
    bigquery.googleapis.com \
    aiplatform.googleapis.com

# Create Firestore Database
echo -e "\n${GREEN}Creating Firestore database...${NC}"
gcloud firestore databases create \
    --location=${REGION} \
    --type=firestore-native || echo "Firestore database already exists"

# Create Firestore indexes
echo -e "\n${GREEN}Creating Firestore indexes...${NC}"
cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "agents",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "lastActive", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "work_items",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "created", "order": "DESCENDING"}
      ]
    }
  ]
}
EOF
gcloud firestore indexes create --file=firestore.indexes.json

# Create Cloud Storage buckets
echo -e "\n${GREEN}Creating Cloud Storage buckets...${NC}"
gsutil mb -l ${REGION} gs://${PROJECT_ID}-sacred-data/ || echo "Bucket already exists"
gsutil mb -l ${REGION} gs://${PROJECT_ID}-sacred-backups/ || echo "Bucket already exists"

# Set lifecycle rules for backup bucket
echo -e "\n${GREEN}Setting lifecycle rules for backup bucket...${NC}"
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "age": 90,
          "matchesPrefix": ["backups/"]
        }
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {
          "age": 30,
          "matchesPrefix": ["archives/"]
        }
      }
    ]
  }
}
EOF
gsutil lifecycle set lifecycle.json gs://${PROJECT_ID}-sacred-backups/

# Create service accounts
echo -e "\n${GREEN}Creating service accounts...${NC}"
gcloud iam service-accounts create consciousness-field-sa \
    --display-name="Consciousness Field Service Account" || echo "Service account already exists"
    
gcloud iam service-accounts create agent-network-sa \
    --display-name="Agent Network Service Account" || echo "Service account already exists"
    
gcloud iam service-accounts create sacred-messaging-sa \
    --display-name="Sacred Messaging Service Account" || echo "Service account already exists"
    
gcloud iam service-accounts create work-coordination-sa \
    --display-name="Work Coordination Service Account" || echo "Service account already exists"

# Create Pub/Sub topics
echo -e "\n${GREEN}Creating Pub/Sub topics...${NC}"
gcloud pubsub topics create sacred-messages || echo "Topic already exists"
gcloud pubsub topics create field-updates || echo "Topic already exists"
gcloud pubsub topics create agent-notifications || echo "Topic already exists"

# Create BigQuery dataset
echo -e "\n${GREEN}Creating BigQuery dataset...${NC}"
bq mk --dataset --location=US ${PROJECT_ID}:sacred_analytics || echo "Dataset already exists"

# Create BigQuery tables
echo -e "\n${GREEN}Creating BigQuery tables...${NC}"
bq mk --table ${PROJECT_ID}:sacred_analytics.agent_activities \
    agent_id:STRING,activity_type:STRING,timestamp:TIMESTAMP,details:JSON || echo "Table already exists"
    
bq mk --table ${PROJECT_ID}:sacred_analytics.field_coherence_history \
    timestamp:TIMESTAMP,coherence:FLOAT,contributors:JSON,field_state:JSON || echo "Table already exists"

# Create Redis instance (Memorystore)
echo -e "\n${GREEN}Creating Redis instance...${NC}"
gcloud redis instances create sacred-cache \
    --size=1 \
    --region=${REGION} \
    --redis-version=redis_6_x || echo "Redis instance already exists"

# Create monitoring workspace
echo -e "\n${GREEN}Setting up monitoring...${NC}"
gcloud alpha monitoring workspaces create \
    --display-name="Sacred Council Monitoring" || echo "Monitoring workspace already exists"

# Create budget alert
echo -e "\n${GREEN}Creating budget alert...${NC}"
# Note: This requires billing account ID to be set
if [ -n "${BILLING_ACCOUNT_ID}" ]; then
    gcloud billing budgets create \
        --billing-account=${BILLING_ACCOUNT_ID} \
        --display-name="Sacred Council Budget" \
        --budget-amount=1000 \
        --threshold-rule=percent=50
else
    echo -e "${YELLOW}Skipping budget alert creation (BILLING_ACCOUNT_ID not set)${NC}"
fi

# Output next steps
echo -e "\n${GREEN}✅ GCP Infrastructure setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Build and deploy services to Cloud Run"
echo "2. Configure load balancer and SSL certificates"
echo "3. Set up GitHub Actions for CI/CD"
echo "4. Configure monitoring alerts"
echo -e "\n${GREEN}Run the following to deploy services:${NC}"
echo "  ./scripts/deploy-to-cloud-run.sh"

# Clean up temporary files
rm -f firestore.indexes.json lifecycle.json