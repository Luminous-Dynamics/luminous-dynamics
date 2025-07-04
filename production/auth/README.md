# 🔐 Sacred System Authentication

## Overview
This directory contains authentication configuration and tools for the Sacred System's cloud services.

## Quick Start

### 1. Authenticate with Google Cloud
```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project mycelix-network

# Verify authentication
./get-token.sh test
```

### 2. Get Authentication Token
```bash
# Get user identity token
TOKEN=$(./get-token.sh user)

# Use in API calls
curl -H "Authorization: Bearer $TOKEN" \
  https://sacred-council-api-310699330526.us-central1.run.app/health
```

### 3. Use Secure WebSocket Client
```bash
# Install dependencies
npm install ws

# Run secure client
node secure-websocket-client.js
```

## Authentication Methods

### Bearer Token (Recommended)
- Used for: API calls, WebSocket connections
- Token type: Google Identity Token
- Lifetime: 1 hour
- Refresh: Automatic via gcloud

### Service Account
- Used for: Server-to-server communication
- Stored in: GCP Secret Manager
- Access: Via application default credentials

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use short-lived tokens** - refresh frequently
3. **Validate tokens** on every request
4. **Log authentication events** for monitoring
5. **Use HTTPS/WSS** for all connections

## Troubleshooting

### "Permission Denied" Errors
1. Check you're authenticated: `gcloud auth list`
2. Verify project: `gcloud config get-value project`
3. Ensure roles are granted: Check IAM in Cloud Console

### Token Expiration
- Tokens expire after 1 hour
- Get fresh token: `./get-token.sh user`
- Client auto-refreshes on reconnect

### WebSocket Authentication Fails
1. Ensure token is included in headers
2. Check WebSocket URL uses `wss://` (not `ws://`)
3. Verify Cloud Run service allows WebSocket upgrade

## Files

- `auth-config.json` - Authentication configuration
- `get-token.sh` - Token retrieval helper
- `secure-websocket-client.js` - Authenticated WebSocket client
- `setup-auth.sh` - This setup script

## Related Documentation
- [GCP Authentication](https://cloud.google.com/docs/authentication)
- [Cloud Run IAM](https://cloud.google.com/run/docs/authenticating/overview)
- [Firebase Auth](https://firebase.google.com/docs/auth)
