#!/bin/bash
# 🔐 Fix Cloud Authentication for Sacred Technology
# Enables APIs and configures proper authentication

echo "🌤️ Sacred Cloud Authentication Fix"
echo "=================================="
echo ""

# Check if we're authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with gcloud. Please run: gcloud auth login"
    exit 1
fi

PROJECT_ID="mycelix-network"
echo "📍 Project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling Required APIs..."
echo "This may take a few minutes..."
echo ""

APIS=(
    "firestore.googleapis.com"
    "cloudfunctions.googleapis.com"
    "cloudbuild.googleapis.com"
    "artifactregistry.googleapis.com"
    "run.googleapis.com"
    "secretmanager.googleapis.com"
    "cloudresourcemanager.googleapis.com"
    "compute.googleapis.com"
    "storage.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo -n "  Enabling $api... "
    if gcloud services enable $api --project=$PROJECT_ID 2>/dev/null; then
        echo "✅"
    else
        echo "⚠️  (may already be enabled)"
    fi
done

echo ""
echo "🌐 Fixing Cloud Run CORS/WebSocket..."

# Update Cloud Run services to allow CORS
SERVICES=("sacred-council-api" "living-memory-bridge" "consciousness-weaver")
REGION="us-central1"

for service in "${SERVICES[@]}"; do
    echo -n "  Updating $service... "
    if gcloud run services describe $service --region=$REGION &>/dev/null; then
        gcloud run services update $service \
            --region=$REGION \
            --set-env-vars="CORS_ORIGIN=*" \
            --allow-unauthenticated \
            --quiet 2>/dev/null && echo "✅" || echo "⚠️"
    else
        echo "🔸 (not deployed)"
    fi
done

echo ""
echo "🔓 Making Cloud Functions Public..."

# Make functions public (with caution)
FUNCTIONS=("sacredPing" "sacredField")

for func in "${FUNCTIONS[@]}"; do
    echo -n "  Function $func... "
    if gcloud functions describe $func --region=$REGION &>/dev/null 2>&1; then
        # Try to add public access
        gcloud functions add-iam-policy-binding $func \
            --region=$REGION \
            --member="allUsers" \
            --role="roles/cloudfunctions.invoker" \
            --quiet 2>/dev/null && echo "✅" || echo "⚠️  (org policy may block)"
    else
        echo "🔸 (not deployed)"
    fi
done

echo ""
echo "🔑 Setting Up Service Accounts..."

# Create service account for Sacred Technology
SA_NAME="sacred-technology"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

echo -n "  Creating service account... "
if gcloud iam service-accounts create $SA_NAME \
    --display-name="Sacred Technology Service Account" 2>/dev/null; then
    echo "✅"
else
    echo "⚠️  (may already exist)"
fi

# Grant necessary roles
echo "  Granting roles..."
ROLES=(
    "roles/datastore.user"
    "roles/cloudfunctions.invoker"
    "roles/run.invoker"
    "roles/storage.objectViewer"
    "roles/secretmanager.secretAccessor"
)

for role in "${ROLES[@]}"; do
    echo -n "    $role... "
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SA_EMAIL" \
        --role="$role" \
        --quiet 2>/dev/null && echo "✅" || echo "⚠️"
done

echo ""
echo "📊 Verification..."
echo ""

# Check API status
echo "Enabled APIs:"
gcloud services list --enabled --filter="name:firestore.googleapis.com OR name:cloudfunctions.googleapis.com OR name:run.googleapis.com" --format="table(config.name)" 2>/dev/null

echo ""
echo "✨ Cloud Authentication Fix Complete!"
echo ""
echo "Next steps:"
echo "1. Test WebSocket connection: node test-cloud-websocket.js"
echo "2. Deploy functions: firebase deploy --only functions"
echo "3. Open Cloud Shell: https://shell.cloud.google.com"
echo ""
echo "🌟 Ready for cloud-native development!"