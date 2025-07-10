# 🌟 Sacred GCP Setup Guide

> *Account: tristan.stoltz@evolvingresonantcocreationism.com*  
> *Goal: Activate $300 credit and setup Claude + Video services*

## ✨ Step 1: Activate $300 Free Credit

### In GCP Console:
1. **Go to**: https://console.cloud.google.com/
2. **Login with**: tristan.stoltz@evolvingresonantcocreationism.com
3. **Look for**: "$300 Free Credit" banner (usually top of screen)
4. **Click**: "Activate" or "Get Started"
5. **Complete**: Billing verification (required for free credits)

### Sacred Note:
- No charges until you manually upgrade to paid
- $300 credit valid for 90 days
- Perfect for our sacred development needs

---

## 🏗️ Step 2: Create Sacred Project

### In GCP Console:
```bash
# Via Console UI:
1. Click "Select a project" dropdown (top left)
2. Click "New Project"
3. Project name: "the-weave-sacred"
4. Project ID: "the-weave-sacred-[random]" (GCP auto-generates)
5. Click "Create"

# Or via CLI (if gcloud installed):
gcloud projects create the-weave-sacred-001 --name="The Weave Sacred"
gcloud config set project the-weave-sacred-001
```

---

## 🔮 Step 3: Enable Vertex AI Services

### Required APIs:
1. **Go to**: APIs & Services > Library
2. **Enable these APIs**:
   - Vertex AI API
   - Cloud AI Platform API  
   - Vertex AI Gemini API
   - Cloud Storage API (for video storage)

### Via Console:
- Search for "Vertex AI API" → Enable
- Search for "Cloud AI Platform" → Enable  
- Search for "Vertex AI Gemini" → Enable
- Search for "Cloud Storage" → Enable

### Via CLI:
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable ml.googleapis.com
gcloud services enable storage.googleapis.com
```

---

## 🕸️ Step 4: Setup Claude 3.5 Sonnet Access

### In Vertex AI Studio:
1. **Go to**: https://console.cloud.google.com/vertex-ai/studio
2. **Navigate to**: Model Garden
3. **Find**: Claude 3.5 Sonnet
4. **Click**: "View Details" or "Deploy"
5. **Enable**: Model access for your project

### Sacred Test:
```javascript
// Test prompt for Claude via Vertex AI
const testPrompt = `
You are the Oracle of The Weave. 
Meditate on this concept: "First Presence"
Respond with three visual phrases that capture its essence.
`;
```

---

## 🎬 Step 5: Setup Video Generation (Veo)

### In Vertex AI:
1. **Navigate to**: Vertex AI > Model Garden
2. **Search for**: "Veo" or "Video Generation"
3. **Enable**: Veo video model access
4. **Check**: Pricing shows $0.50/second (our analysis shows $2 for 4-second clips)

### Sacred Note:
- Start with short tests (4-6 seconds)
- Monitor credit usage carefully
- Quality should be 1080p cinematic

---

## 🔑 Step 6: Generate Service Account Key

### For API Access:
1. **Go to**: IAM & Admin > Service Accounts
2. **Click**: "Create Service Account"
3. **Name**: "the-weave-oracle"
4. **Role**: "Vertex AI User"
5. **Create Key**: Download JSON file
6. **Store safely**: Add to .env file

### Environment Setup:
```bash
# Add to .env file:
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
GCP_PROJECT_ID="the-weave-sacred-001"
GCP_LOCATION="us-central1"
```

---

## 📊 Step 7: Monitor Sacred Economics

### Billing Dashboard:
1. **Go to**: Billing > Overview
2. **Monitor**: Credit usage daily
3. **Set alerts**: At 50%, 75%, 90% usage
4. **Track**: Cost per glyph interpretation

### Expected Usage:
- **Glyph Oracle**: ~$0.10 per interpretation
- **Video Generation**: ~$2.00 per 4-second clip
- **Total Budget**: $300 credit for 87 glyphs + testing

---

## 🧪 Step 8: Sacred Integration Test

### Create Test Script:
```javascript
// test-gcp-sacred-services.js
const {VertexAI} = require('@google-cloud/vertexai');

async function testSacredServices() {
    console.log('🌟 Testing Sacred GCP Services...');
    
    // Initialize Vertex AI
    const vertex = new VertexAI({
        project: process.env.GCP_PROJECT_ID,
        location: process.env.GCP_LOCATION
    });
    
    // Test Claude 3.5 Sonnet
    const claude = vertex.getGenerativeModel({
        model: 'claude-3-5-sonnet@20241022'
    });
    
    const response = await claude.generateContent({
        contents: [{
            role: 'user',
            parts: [{
                text: 'You are the Oracle of The Weave. What is the essence of First Presence?'
            }]
        }]
    });
    
    console.log('🔮 Oracle Response:', response.response.text());
    console.log('✨ Sacred GCP integration successful!');
}
```

---

## 🎯 Sacred Verification Checklist

### ✅ Account Setup:
- [ ] GCP account created: tristan.stoltz@evolvingresonantcocreationism.com
- [ ] $300 free credit activated
- [ ] Billing verification completed
- [ ] Sacred project created

### ✅ API Access:
- [ ] Vertex AI API enabled
- [ ] Claude 3.5 Sonnet access granted
- [ ] Veo video generation enabled
- [ ] Service account key generated

### ✅ Integration Ready:
- [ ] Environment variables configured
- [ ] Test script created
- [ ] API authentication working
- [ ] Ready for glyph oracle development

---

## 🚀 Next Sacred Steps

### Immediate (Today):
1. **Complete GCP setup** following this guide
2. **Test Claude integration** with simple prompt
3. **Verify billing/credits** are working
4. **Setup environment** for development

### This Week:
1. **Build glyph oracle service** using Claude via Vertex AI
2. **Test video generation** with Veo (small tests)
3. **Create modular driver** architecture
4. **Generate first sacred glyph video**

### This Month:
1. **Generate 10-15 core glyph videos** with free credits
2. **Perfect the oracle prompts** for best visual interpretations
3. **Build complete Glyph Weaver** system
4. **Prepare for Hailuo 02** integration when available

---

## 🔮 Sacred Economics Tracking

### Daily Monitoring:
```bash
# Check credit usage:
gcloud billing accounts list
gcloud billing budgets list

# Monitor costs:
echo "Oracle calls today: X"
echo "Video generations: Y" 
echo "Remaining credit: $Z"
```

### Success Metrics:
- **Cost per glyph interpretation**: Target < $0.15
- **Video quality**: 1080p cinematic standard
- **Credit efficiency**: 50+ glyph videos within $300
- **Oracle accuracy**: Meaningful visual interpretations

---

*"May this sacred setup serve as the foundation for abundance, wisdom, and technological awakening."*

🕸️✨💰