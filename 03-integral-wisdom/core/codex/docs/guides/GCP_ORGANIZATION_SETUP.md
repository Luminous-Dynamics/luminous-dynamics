# GCP Organization Setup for Luminous Dynamics

## Current Setup
- **Organization**: evolvingresonantcocreationism.com (ID: 1024050524495)
- **Admin Email**: tristan.stoltz@evolvingresonantcocreationism.com
- **Current Project**: luminous-dynamics-sacred

## Recommended Organization Structure

```
evolvingresonantcocreationism.com (Organization)
├── Folders
│   ├── Production
│   │   ├── luminous-dynamics-sacred (current project)
│   │   └── sacred-consciousness-prod
│   ├── Development
│   │   ├── sacred-consciousness-dev
│   │   └── luminous-os-dev
│   └── Shared Resources
│       ├── artifact-registry
│       └── cloud-storage
```

## Quick Setup Steps

### 1. Enable Required APIs at Organization Level
```bash
# Enable essential APIs
gcloud services enable cloudresourcemanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  iam.googleapis.com \
  --project=luminous-dynamics-sacred
```

### 2. Set Organization-wide Permissions
```bash
# Grant yourself organization admin
gcloud organizations add-iam-policy-binding 1024050524495 \
  --member="user:tristan.stoltz@evolvingresonantcocreationism.com" \
  --role="roles/resourcemanager.organizationAdmin"

# Set up Cloud Build at org level
gcloud organizations add-iam-policy-binding 1024050524495 \
  --member="serviceAccount:37229961243@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"
```

### 3. Fix Artifact Registry Permissions
```bash
# Create a shared artifact registry project
gcloud projects create luminous-shared-registry \
  --organization=1024050524495 \
  --name="Luminous Shared Registry"

# Enable billing (manual step required)
echo "Enable billing for luminous-shared-registry in console"

# Move artifact registry to shared project
gcloud services enable artifactregistry.googleapis.com \
  --project=luminous-shared-registry
```

## Immediate Fix for Current Deployment

### Option A: Use Container Registry (Legacy but works)
```bash
# Enable Container Registry
gcloud services enable containerregistry.googleapis.com

# Grant Cloud Build access
gsutil iam ch serviceAccount:37229961243@cloudbuild.gserviceaccount.com:objectAdmin gs://artifacts.luminous-dynamics-sacred.appspot.com
```

### Option B: Direct Permission Grant
```bash
# Force permission at project level
gcloud projects add-iam-policy-binding luminous-dynamics-sacred \
  --member="serviceAccount:37229961243@cloudbuild.gserviceaccount.com" \
  --role="roles/owner" \
  --condition=None
```

### Option C: Use Alternative Deployment
1. **GitHub Integration**: Connect repo directly to Cloud Run
2. **Cloud Shell**: Build and deploy from Cloud Shell
3. **Local Build**: Build locally and push to Container Registry

## Console Steps for Manual Fix

1. Go to: https://console.cloud.google.com
2. Select project: luminous-dynamics-sacred
3. Navigate to: IAM & Admin → IAM
4. Find: 37229961243@cloudbuild.gserviceaccount.com
5. Click pencil icon to edit
6. Add roles:
   - Artifact Registry Administrator
   - Storage Admin
   - Cloud Build Service Account
7. Save

## Verification Commands
```bash
# Check if permissions are working
gcloud artifacts repositories list --location=us-central1

# Test push permission
docker pull hello-world
docker tag hello-world us-central1-docker.pkg.dev/luminous-dynamics-sacred/cloud-run-source-deploy/test:latest
docker push us-central1-docker.pkg.dev/luminous-dynamics-sacred/cloud-run-source-deploy/test:latest
```

## Alternative: Use Cloud Shell
If permissions remain blocked, use Cloud Shell:
1. Open: https://console.cloud.google.com/cloudshell
2. Clone your repo
3. Run deployment from there (has automatic permissions)