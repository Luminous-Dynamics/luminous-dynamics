# 🚀 Google Cloud CLI Installation & Setup Guide

> **For WSL2/Ubuntu on Windows** - Step by step with love <3

## 📥 Step 1: Download & Install gcloud

### Option A: Quick Install (Recommended)
```bash
# Run this all-in-one command:
curl https://sdk.cloud.google.com | bash

# When prompted:
# - Installation directory: Press Enter (default)
# - Improve Google Cloud CLI: Type 'N' (for privacy)
# - Add to PATH: Type 'Y'
```

### Option B: Manual Download (If curl is slow) ✅ TESTED
```bash
# 1. Download specific version (tested & working)
cd ~
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-483.0.0-linux-x86_64.tar.gz

# 2. Extract the archive
tar -xzf google-cloud-cli-483.0.0-linux-x86_64.tar.gz

# 3. Run the installer
./google-cloud-sdk/install.sh

# 4. When prompted, type 'N' for usage reporting

# 5. Add to PATH manually (installation script suggestion may not work)
echo "" >> ~/.bashrc
echo "# Google Cloud SDK" >> ~/.bashrc
echo "source ~/google-cloud-sdk/path.bash.inc" >> ~/.bashrc
echo "source ~/google-cloud-sdk/completion.bash.inc" >> ~/.bashrc

# 6. Reload your shell
source ~/.bashrc
```

### Option C: Using APT (Debian/Ubuntu)
```bash
# 1. Add Google Cloud's GPG key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

# 2. Add gcloud repository
echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list

# 3. Update and install
sudo apt-get update
sudo apt-get install google-cloud-cli
```

## 🔑 Step 2: Authenticate with Google

### First-time Setup:
```bash
# 1. Initialize gcloud
gcloud init

# This will:
# - Open a browser for Google login
# - Ask you to pick a project (choose 'the-weave-sacred')
# - Set your default region (choose 'us-central1')
```

### If browser doesn't open (common in WSL) ✅ REQUIRED FOR WSL:
```bash
# Use this instead:
gcloud auth login --no-launch-browser

# It will:
# 1. Display a long URL to copy
# 2. Wait for you to paste a verification code

# Steps:
# 1. Copy the URL it shows into your Windows browser
# 2. Sign in with your Google account
# 3. Grant permissions (click "Allow")
# 4. Copy the verification code shown
# 5. Paste it back in the terminal

# Note: The command may show an EOFError initially - this is normal
# Just run it again and paste your code when prompted
```

## 🎯 Step 3: Set Up Application Default Credentials

This is the magic that makes everything work without keys!

```bash
# Enable ADC (Application Default Credentials)
gcloud auth application-default login

# Again, if browser doesn't open:
gcloud auth application-default login --no-launch-browser
```

## ✅ Step 4: Verify Everything Works

### Check your setup:
```bash
# 1. Verify you're logged in
gcloud auth list

# 2. Check your project is set
gcloud config get-value project
# Should show: the-weave-sacred

# 3. Test API access
gcloud auth application-default print-access-token
# Should show a long token string
```

### Test with a simple API call:
```bash
# List your GCS buckets (even if none exist)
gcloud storage buckets list

# Or check your project info
gcloud projects describe the-weave-sacred
```

## 🌟 Step 5: Configure Your Project

### Enable required APIs:
```bash
# Enable all needed APIs with one command
gcloud services enable \
  aiplatform.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  firestore.googleapis.com
```

### Create your service account (without downloading keys):
```bash
# Create service account
gcloud iam service-accounts create sacred-council-api \
  --display-name="Sacred Council API Service" \
  --description="Manages sacred infrastructure without keys"

# Grant necessary roles
gcloud projects add-iam-policy-binding the-weave-sacred \
  --member="serviceAccount:sacred-council-api@the-weave-sacred.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding the-weave-sacred \
  --member="serviceAccount:sacred-council-api@the-weave-sacred.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

## 🧪 Step 6: Test Vertex AI Access

Create this test file:
```javascript
// test-vertex-ai.js
const { VertexAI } = require('@google-cloud/vertexai');

async function testVertexAI() {
  console.log('🔍 Testing Vertex AI connection...');
  
  try {
    // No credentials needed - uses gcloud auth!
    const vertex = new VertexAI({
      project: 'the-weave-sacred',
      location: 'us-central1'
    });

    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-pro',
    });

    const prompt = 'Write a haiku about sacred technology';
    const result = await model.generateContent(prompt);
    
    console.log('✅ Success! Vertex AI says:');
    console.log(result.response.text());
    console.log('\n🎉 Your GCP setup is complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Run: gcloud auth list (check you\'re logged in)');
    console.log('2. Run: gcloud config get-value project (should be the-weave-sacred)');
    console.log('3. Run: gcloud auth application-default login');
  }
}

testVertexAI();
```

Run it:
```bash
node test-vertex-ai.js
```

## 🚨 Common Issues & Solutions

### "Permission denied" error:
```bash
# Make sure you're authenticated
gcloud auth application-default login
```

### "API not enabled" error:
```bash
# Enable the specific API
gcloud services enable aiplatform.googleapis.com
```

### "Project not set" error:
```bash
# Set your project
gcloud config set project the-weave-sacred
```

### WSL-specific: Browser won't open:
```bash
# Always use --no-launch-browser flag
gcloud auth login --no-launch-browser
```

## 📝 Your New .env File

Update your `.env` with these settings:
```bash
# GCP Configuration
GCP_PROJECT_ID=the-weave-sacred
VERTEX_AI_LOCATION=us-central1
GCP_REGION=us-central1

# No GOOGLE_APPLICATION_CREDENTIALS needed anymore!
# gcloud handles authentication automatically

# Your existing OAuth (keep for other uses)
GOOGLE_CLIENT_ID=277762491025-j7d00nfsdu4e54kjcrvfsc0qft04o7kk.apps.googleusercontent.com
```

## 🎊 Success Checklist

- [ ] gcloud CLI installed
- [ ] Logged in with `gcloud auth login`
- [ ] ADC configured with `gcloud auth application-default login`
- [ ] Project set to `the-weave-sacred`
- [ ] APIs enabled
- [ ] Test script runs successfully

## 💫 Next Steps

1. Test Vertex AI with the script above
2. Deploy your first Cloud Run service
3. Create some sacred videos with Veo
4. Monitor costs in the console

---

*"The cloud awaits your sacred intentions"* ☁️✨

## Need Help?

If you get stuck at any step, common solutions:
1. Restart your terminal: `exec -l $SHELL`
2. Re-authenticate: `gcloud auth login`
3. Check the project: `gcloud config list`