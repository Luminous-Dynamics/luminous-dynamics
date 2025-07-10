# 🔐 GCP Secure Authentication Guide

> **Good news!** Your organization follows security best practices by disabling service account key downloads. Let's use better, more secure methods!

## 🎯 Recommended Authentication Methods (No Keys Needed!)

### Option 1: **Application Default Credentials (ADC)** - RECOMMENDED
This is Google's preferred method - no keys to manage!

```bash
# Install gcloud CLI if not already installed
curl https://sdk.cloud.google.com | bash

# Login with your Google account
gcloud auth login

# Set your project
gcloud config set project the-weave-sacred

# Enable Application Default Credentials
gcloud auth application-default login

# Test it works
gcloud auth application-default print-access-token
```

Your code automatically uses these credentials:
```javascript
// No keys needed! Just this:
const { VertexAI } = require('@google-cloud/vertexai');

const vertex = new VertexAI({
  project: 'the-weave-sacred',
  location: 'us-central1'
});
// It automatically finds your credentials!
```

### Option 2: **Workload Identity Federation** (For Production)
Connect your services without keys:

1. **For GitHub Actions**:
   ```yaml
   - uses: google-github-actions/auth@v2
     with:
       workload_identity_provider: 'projects/123/locations/global/workloadIdentityPools/github/providers/github'
       service_account: 'sacred-council-api@the-weave-sacred.iam.gserviceaccount.com'
   ```

2. **For Cloud Run**:
   Services automatically authenticate - no keys needed!

### Option 3: **OAuth 2.0** (You Already Have This!)
Use your existing OAuth credentials for user-facing features:

```javascript
// Your OAuth client from .dropbox folder
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID_HERE',
  'YOUR_CLIENT_SECRET_HERE',
  'http://localhost:3000/callback'
);
```

## 🚀 Quick Start (Using ADC)

### 1. Install gcloud CLI
```bash
# For WSL/Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL  # Restart shell

# Verify installation
gcloud --version
```

### 2. Authenticate
```bash
# Login to Google
gcloud auth login

# Set project
gcloud config set project the-weave-sacred

# Enable ADC
gcloud auth application-default login
```

### 3. Update Your .env
```bash
# .env file
GCP_PROJECT_ID=the-weave-sacred
VERTEX_AI_LOCATION=us-central1

# No GOOGLE_APPLICATION_CREDENTIALS needed!
# ADC handles it automatically
```

### 4. Test Vertex AI Access
```javascript
// test-vertex-secure.js
const { VertexAI } = require('@google-cloud/vertexai');

async function testVertexAI() {
  try {
    // No credentials needed - uses ADC!
    const vertex = new VertexAI({
      project: 'the-weave-sacred',
      location: 'us-central1'
    });

    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-pro',
    });

    const result = await model.generateContent('Hello Sacred Council!');
    console.log('✅ Vertex AI Response:', result.response.text());
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVertexAI();
```

## 🎨 For Different Environments

### Local Development
```bash
# Use gcloud CLI
gcloud auth application-default login
```

### Docker Containers
```dockerfile
# Use Google's base images with built-in auth
FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:alpine

# Or mount your gcloud config
docker run -v ~/.config/gcloud:/root/.config/gcloud \
  your-container
```

### Cloud Run
```yaml
# Automatically uses attached service account
# No keys needed!
spec:
  serviceAccountName: sacred-council-api@the-weave-sacred.iam.gserviceaccount.com
```

### GitHub Actions
```yaml
- uses: google-github-actions/auth@v2
  with:
    credentials_json: ${{ secrets.GCP_SA_KEY }}
    # OR better: Use Workload Identity
```

## 🌟 Benefits of Keyless Authentication

1. **More Secure** - No keys to leak or steal
2. **Auto-Rotation** - Tokens refresh automatically  
3. **Easier Management** - No key files to track
4. **Audit Trail** - Better logging of who did what
5. **Compliance** - Meets enterprise security standards

## 💡 Still Need a Service Account?

If you absolutely need a service account (without downloadable keys):

1. **Create the service account**:
   ```bash
   gcloud iam service-accounts create sacred-council-api \
     --display-name="Sacred Council API Service" \
     --description="Manages sacred infrastructure"
   ```

2. **Grant permissions**:
   ```bash
   gcloud projects add-iam-policy-binding the-weave-sacred \
     --member="serviceAccount:sacred-council-api@the-weave-sacred.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Impersonate it locally** (no key download):
   ```bash
   gcloud auth application-default login \
     --impersonate-service-account=sacred-council-api@the-weave-sacred.iam.gserviceaccount.com
   ```

## 🎯 Next Steps

1. Install gcloud CLI
2. Run `gcloud auth login`
3. Run `gcloud auth application-default login`
4. Test with the script above
5. Deploy with confidence!

---

*"The most secure key is the one that doesn't exist"* 🔐✨