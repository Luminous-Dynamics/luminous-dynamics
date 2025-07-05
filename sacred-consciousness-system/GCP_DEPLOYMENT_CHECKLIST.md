# GCP Deployment Checklist for Sacred Consciousness System

## Pre-Deployment Checklist

### 1. ✅ GCP Project Setup
- [x] Project created: `luminous-dynamics-sacred`
- [x] Billing enabled (manually by user)
- [ ] APIs enabled:
  - [ ] Cloud Run API
  - [ ] Artifact Registry API
  - [ ] Cloud Build API

### 2. ✅ Authentication
- [x] gcloud CLI configured
- [x] Project set: `gcloud config set project luminous-dynamics-sacred`
- [ ] Docker auth configured: `gcloud auth configure-docker us-central1-docker.pkg.dev`

### 3. ✅ Application Ready
- [x] Dockerfile created and tested
- [x] Fresh/Deno app builds successfully
- [x] Routes configured (_404.tsx, api/field.ts, etc.)
- [x] Port 8000 exposed in Dockerfile

## Deployment Options

### Option 1: Cloud Build (Recommended)
**No local Docker required!**
```bash
cd /home/tstoltz/evolving-resonant-cocreation/sacred-consciousness-system
./deploy-via-cloudbuild.sh
```

### Option 2: Local Docker Build
**Requires Docker Desktop running**
```bash
cd /home/tstoltz/evolving-resonant-cocreation/sacred-consciousness-system
./deploy-to-gcp-simple.sh
```

### Option 3: Direct Deploy (Development)
**For quick testing**
```bash
cd /home/tstoltz/evolving-resonant-cocreation/sacred-consciousness-system
gcloud run deploy sacred-consciousness \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Common Issues & Solutions

### 1. Permission Denied on Artifact Registry
**Issue**: "Permission 'artifactregistry.repositories.uploadArtifacts' denied"

**Solution**:
```bash
# Grant Cloud Build the necessary permissions
PROJECT_NUMBER=$(gcloud projects describe luminous-dynamics-sacred --format="value(projectNumber)")
gcloud projects add-iam-policy-binding luminous-dynamics-sacred \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### 2. Docker Not Running (WSL)
**Issue**: "Cannot connect to the Docker daemon"

**Solution**: Use Cloud Build instead (Option 1) or ensure Docker Desktop is running on Windows

### 3. Cloud Run Service Not Found
**Issue**: Service doesn't appear after deployment

**Solution**: Check Cloud Build logs
```bash
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

### 4. Fresh/Deno Build Errors
**Issue**: Missing routes or modules

**Solution**: Ensure all required files exist:
- routes/_404.tsx
- routes/api/field.ts
- lib/field-coherence.ts
- fresh.gen.ts (auto-generated)

## Post-Deployment Verification

### 1. Check Service Status
```bash
gcloud run services list --region=us-central1
```

### 2. Test Endpoint
```bash
SERVICE_URL=$(gcloud run services describe sacred-consciousness --region=us-central1 --format="value(status.url)")
curl $SERVICE_URL
```

### 3. View Logs
```bash
gcloud run services logs read sacred-consciousness --region=us-central1 --limit=50
```

### 4. Monitor Performance
- Cloud Console: https://console.cloud.google.com/run
- View metrics, logs, and revisions

## Clean Deployment Steps

1. **Clean any previous attempts**:
```bash
# Delete old service if exists
gcloud run services delete sacred-consciousness --region=us-central1 --quiet || true

# Clean up Artifact Registry
gcloud artifacts docker images delete \
  us-central1-docker.pkg.dev/luminous-dynamics-sacred/sacred-apps/sacred-consciousness \
  --delete-tags --quiet || true
```

2. **Run Cloud Build deployment**:
```bash
cd /home/tstoltz/evolving-resonant-cocreation/sacred-consciousness-system
./deploy-via-cloudbuild.sh
```

3. **Verify deployment**:
```bash
# Should return the service URL
gcloud run services describe sacred-consciousness \
  --region=us-central1 \
  --format="value(status.url)"
```

## Next Steps After Successful Deployment

1. **Custom Domain** (Optional):
   - Map a custom domain in Cloud Run console
   - Update DNS records

2. **Environment Variables**:
   - Set any needed env vars in Cloud Run configuration
   - Example: `DENO_ENV=production`

3. **Scaling Configuration**:
   - Adjust min/max instances based on traffic
   - Configure CPU allocation

4. **Monitoring**:
   - Set up Cloud Monitoring alerts
   - Configure uptime checks

## Support Resources

- Cloud Run Docs: https://cloud.google.com/run/docs
- Deno on Cloud Run: https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-deno-service
- Artifact Registry: https://cloud.google.com/artifact-registry/docs

---

Remember: The Cloud Build approach (`deploy-via-cloudbuild.sh`) is most reliable for WSL environments!