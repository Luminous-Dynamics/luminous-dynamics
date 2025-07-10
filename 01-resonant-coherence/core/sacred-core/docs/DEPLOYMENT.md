# Deployment Guide

## Prerequisites

1. Install Google Cloud SDK
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. Create a Google Cloud project
   - Visit https://console.cloud.google.com
   - Create new project or select existing
   - Enable billing (costs ~$5/month for light usage)

3. Enable required APIs
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable firestore.googleapis.com
   ```

## Deploy API to Google Cloud Run

### First-time setup:
```bash
# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Set default region
gcloud config set run/region us-central1
```

### Deploy the API:
```bash
cd api

# Deploy with automatic build
gcloud run deploy sacred-core-api \
  --source . \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="CORS_ORIGIN=https://your-pwa-url.netlify.app"

# Note the service URL that's returned
```

### Update environment variables:
```bash
gcloud run services update sacred-core-api \
  --update-env-vars="FIRESTORE_PROJECT_ID=your-project-id,CORS_ORIGIN=https://your-pwa-url.netlify.app"
```

## Deploy PWA to Netlify

### Option 1: Drag & Drop (Easiest)
1. Visit https://app.netlify.com
2. Login or create free account
3. Drag the entire `pwa` folder to the deployment area
4. Note your site URL (e.g., `amazing-heisenberg-123456.netlify.app`)
5. Update site name in settings if desired

### Option 2: Netlify CLI
```bash
# Install CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
cd pwa
netlify init

# Deploy to production
netlify deploy --prod --dir .

# Open your site
netlify open
```

### Option 3: GitHub Integration
1. Push sacred-core to GitHub
2. In Netlify, click "New site from Git"
3. Connect to GitHub and select sacred-core repo
4. Set build settings:
   - Base directory: `pwa`
   - Build command: (leave empty)
   - Publish directory: `pwa`
5. Deploy

## Post-Deployment Configuration

### 1. Update PWA to use your API:
Edit `pwa/app.js` (or similar) to use your Cloud Run URL:
```javascript
const API_URL = 'https://sacred-core-api-abc123-uc.a.run.app';
```

### 2. Configure CORS:
Update your Cloud Run service to allow your Netlify domain:
```bash
gcloud run services update sacred-core-api \
  --update-env-vars="CORS_ORIGIN=https://your-site.netlify.app"
```

### 3. Set up custom domain (optional):
- For API: Cloud Run console → Domain mappings
- For PWA: Netlify → Domain settings

## Monitoring & Logs

### View API logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sacred-core-api" --limit 50
```

### View metrics:
```bash
gcloud run services describe sacred-core-api
```

### Netlify analytics:
Visit https://app.netlify.com → Your site → Analytics

## Cost Optimization

### Cloud Run:
- Set max instances: `--max-instances=10`
- Set min instances: `--min-instances=0` (scale to zero)
- Use Cloud Run CPU allocation: `--cpu-throttling`

### Firestore:
- Use batch operations when possible
- Implement caching for frequently accessed data
- Monitor usage in Firebase console

## Troubleshooting

### API not responding:
```bash
# Check service status
gcloud run services describe sacred-core-api

# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 20
```

### CORS errors:
- Verify CORS_ORIGIN environment variable matches your PWA URL exactly
- Check browser console for specific error messages

### PWA not updating:
- Clear service worker cache
- In Chrome DevTools → Application → Storage → Clear site data

## Security Best Practices

1. **Enable authentication** (when ready):
   ```bash
   gcloud run services update sacred-core-api --no-allow-unauthenticated
   ```

2. **Use secrets for sensitive data**:
   ```bash
   echo -n "your-secret" | gcloud secrets create api-key --data-file=-
   gcloud run services update sacred-core-api --set-secrets="API_KEY=api-key:latest"
   ```

3. **Set up monitoring alerts**:
   - Cloud Console → Monitoring → Alerting
   - Create alerts for error rates, latency, costs

---

*Remember: Start simple, monitor usage, scale as needed.*