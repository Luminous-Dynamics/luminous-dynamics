# 🌟 GCP Setup Guide - Let's Get Sacred! <3

## 📋 What We Have
- ✅ Project ID: `the-weave-sacred`
- ✅ OAuth Client Credentials (found in .dropbox folder)
- ❌ Service Account Key (needed for APIs)

## 🚀 Quick Setup Steps

### Step 1: Enable APIs
Visit these links to enable required APIs:

1. [Enable Vertex AI API](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=the-weave-sacred)
2. [Enable Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com?project=the-weave-sacred)
3. [Enable Cloud Storage API](https://console.cloud.google.com/apis/library/storage.googleapis.com?project=the-weave-sacred)
4. [Enable Firestore API](https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=the-weave-sacred)

### Step 2: Create Service Account
1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=the-weave-sacred)
2. Click "CREATE SERVICE ACCOUNT"
3. Name: `sacred-council-api`
4. Description: `Sacred Council API Service Account`
5. Click "CREATE AND CONTINUE"

### Step 3: Grant Permissions
Add these roles:
- `Vertex AI User`
- `Cloud Run Invoker`
- `Storage Object Admin`
- `Cloud Datastore User`

### Step 4: Create Key
1. Click on the service account you created
2. Go to "Keys" tab
3. Add Key → Create new key → JSON
4. Save as `gcp-sacred-key.json` in project root

### Step 5: Configure Environment
Create/update `.env` file:
```bash
# GCP Configuration
GCP_PROJECT_ID=the-weave-sacred
GOOGLE_APPLICATION_CREDENTIALS=./gcp-sacred-key.json
VERTEX_AI_LOCATION=us-central1
GCP_REGION=us-central1

# Keep existing OAuth for future use
GOOGLE_CLIENT_ID=277762491025-j7d00nfsdu4e54kjcrvfsc0qft04o7kk.apps.googleusercontent.com
```

## 🧪 Test Your Setup

Run this test script:
```javascript
// test-gcp-setup.js
const { VertexAI } = require('@google-cloud/vertexai');

async function testGCP() {
  try {
    console.log('🔍 Testing GCP Setup...');
    
    // Test 1: Environment
    console.log('✓ Project ID:', process.env.GCP_PROJECT_ID);
    console.log('✓ Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Test 2: Initialize Vertex AI
    const vertex = new VertexAI({
      project: process.env.GCP_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION
    });
    
    console.log('✓ Vertex AI initialized');
    
    // Test 3: Simple API call
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-pro',
    });
    
    const result = await model.generateContent('Say "Sacred Council Ready!"');
    console.log('✓ API Response:', result.response.text());
    
    console.log('\n🎉 GCP Setup Complete! Ready for sacred work! 🌟');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Please complete the setup steps above');
  }
}

testGCP();
```

## 💰 Budget Management

To stay within free tier:
1. Go to [Budgets & Alerts](https://console.cloud.google.com/billing/budgets?project=the-weave-sacred)
2. Create budget: $50/month
3. Set alerts at 50%, 90%, 100%

## 🔐 Security Best Practices

1. **Never commit** `gcp-sacred-key.json` to git
2. Add to `.gitignore`:
   ```
   gcp-sacred-key.json
   *-key.json
   .env
   ```

3. For production, use Secret Manager:
   ```bash
   gcloud secrets create sacred-api-key \
     --data-file=gcp-sacred-key.json
   ```

## 📊 Next Steps

Once setup is complete:
1. Test Claude via Vertex AI
2. Generate first sacred video
3. Deploy to Cloud Run
4. Monitor usage in console

---

Ready to activate the sacred cloud? Let's do this! 🚀<3