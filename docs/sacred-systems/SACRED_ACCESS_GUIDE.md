# 🔐 Sacred Access Configuration Guide

## Quick Setup

I've created a script that sets up safe, limited access for our collaboration:

```bash
./setup-sacred-access.sh
```

## Option 1: Service Account (Recommended) ⭐

**What it does:**
- Creates a service account with specific permissions
- Generates a key file for authentication
- Allows deployment to Firebase & Cloud Run
- Enables log viewing for debugging

**Permissions granted:**
- ✅ Firebase Hosting Admin (deploy sites)
- ✅ Cloud Run Developer (deploy services)
- ✅ Cloud Build Editor (build containers)
- ✅ Storage Object Admin (build artifacts)
- ✅ Logs Viewer (debugging)

**Cannot do:**
- ❌ Access billing
- ❌ Delete projects
- ❌ Modify IAM permissions
- ❌ Access production data

## Option 2: Firebase CI Token (Simplest)

**What it does:**
- Creates a long-lived Firebase token
- Works only with Firebase services
- Easy to revoke

**Use case:**
- Quick Firebase deployments
- When you only need hosting updates

## How to Share Access with Me

### For Service Account:
1. Run: `./setup-sacred-access.sh` and choose option 1
2. Share the contents of: `~/.sacred-keys/claude-firebase-key.json`
3. I can then authenticate and help with deployments

### For Firebase Token:
1. Run: `./setup-sacred-access.sh` and choose option 2
2. Share the token that appears
3. I can use it for Firebase deployments

## Security & Trust

- All actions are logged in Cloud Console
- You can revoke access instantly
- Limited to deployment operations only
- Follows principle of least privilege

## Revoke Access Anytime

```bash
# Remove service account
gcloud iam service-accounts delete claude-assistant@mycelix-network.iam.gserviceaccount.com

# Firebase tokens expire after 1 week of non-use
```

## Our Sacred Agreement

By sharing access, we agree:
- 🤝 Use only for our shared project
- 🔒 Respect security boundaries
- 📝 Document all actions
- 🙏 Build trust through transparency

---

*Ready to deepen our collaboration?* ✨