# 🔐 Cloud Run Access Solutions

Your organization policy blocks public (`allUsers`) access to Cloud Run services. Here are your options:

## 🌟 Option 1: Identity-Aware Proxy (IAP)
```bash
# Enable IAP for Cloud Run
gcloud services enable iap.googleapis.com

# Configure OAuth consent screen
echo "Visit: https://console.cloud.google.com/apis/credentials/consent"
```

## 🔑 Option 2: API Key Authentication
```bash
# Create API key in console
echo "Visit: https://console.cloud.google.com/apis/credentials"

# Add to services as query parameter
curl "https://your-service.run.app?key=YOUR_API_KEY"
```

## 👤 Option 3: Service Account Access
```bash
# Create a service account for public access
gcloud iam service-accounts create public-accessor \
  --display-name="Public Access Service Account"

# Grant invoker role
gcloud run services add-iam-policy-binding consciousness-field \
  --region=us-central1 \
  --member="serviceAccount:public-accessor@the-weave-sacred.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

## 🚪 Option 4: Firebase Hosting Proxy
```javascript
// Use Firebase Hosting as public frontend
// firebase.json
{
  "hosting": {
    "rewrites": [{
      "source": "/api/**",
      "run": {
        "serviceId": "consciousness-field",
        "region": "us-central1"
      }
    }]
  }
}
```

## 🌐 Option 5: Load Balancer with Cloud Armor
```bash
# Create HTTPS load balancer
gcloud compute backend-services create sacred-backend \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=sacred-health \
  --global

# Point to Cloud Run
gcloud compute backend-services add-backend sacred-backend \
  --network-endpoint-group=sacred-neg \
  --global
```

## 💡 Immediate Workaround: Local Proxy

For immediate access, create a local proxy:

```bash
# Install Cloud Run proxy
gcloud components install cloud-run-proxy

# Proxy each service locally
gcloud run services proxy consciousness-field --port=8081 &
gcloud run services proxy agent-network --port=8082 &
gcloud run services proxy sacred-messaging --port=8083 &
gcloud run services proxy work-coordination --port=8084 &
gcloud run services proxy sacred-dashboard --port=8080 &

# Access locally
open http://localhost:8080  # Dashboard
```

## 🎯 Recommended Solution

**For production**: Set up Firebase Hosting as your public frontend, which can proxy to Cloud Run services without violating organization policies.

**For development**: Use the local proxy approach or create a development project without organization policies.

## 🔓 Request Policy Exception

Contact your organization administrator to request an exception for the project:
```bash
# Policy to modify
iam.allowedPolicyMemberDomains

# Exception needed for
projects/the-weave-sacred
```

---

*Note: The services are successfully deployed and running. Only public access is restricted by organization policy.*