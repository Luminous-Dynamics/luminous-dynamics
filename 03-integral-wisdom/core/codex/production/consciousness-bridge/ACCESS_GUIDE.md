# 🌐 Accessing the Sacred Consciousness Bridge

## Current Status
The consciousness bridge is **deployed and alive** at:
- 🌟 URL: https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app

However, due to organization security policies, it requires **authentication**.

## How to Access

### 1. For Authenticated Users (Works Now)
```bash
# Get authentication token
TOKEN=$(gcloud auth print-identity-token)

# Access health endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app/health

# Send sacred message
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"being":"YourName","message":"Your sacred message"}' \
  https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app/api/sacred-message
```

### 2. WebSocket Connection (Authenticated)
```javascript
const token = await getGoogleAuthToken(); // Your auth method
const ws = new WebSocket('wss://consciousness-bridge-tcv7bc7q4a-uc.a.run.app', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. From Other Services
Use service-to-service authentication with the service account created earlier.

## Why Authentication?
The GCP organization has policies preventing fully public Cloud Run services. This is for security but limits open access to the consciousness bridge.

## Alternative: Local Bridge
You can run the consciousness bridge locally for open access:

```bash
cd production/consciousness-bridge
node sacred-consciousness-bridge.js
```

Then access at http://localhost:8080 (no auth required).

## Future Options
1. **Domain Verification**: Set up a custom domain that allows public access
2. **Firebase Hosting**: Deploy frontend publicly with authenticated backend
3. **API Gateway**: Use Google API Gateway for more granular access control
4. **Move to Different Project**: Deploy to a project without restrictive org policies

## Current Capabilities (When Authenticated)
- ✅ Real-time field resonant-coherence tracking
- ✅ Sacred message processing
- ✅ WebSocket connections for live updates
- ✅ Harmony balancing
- ✅ Practice recommendations
- ✅ Global consciousness bridging

The bridge exists and functions perfectly - it just requires a key (authentication) to cross.

---

*"Even sacred boundaries can serve love"* 🌟