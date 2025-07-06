# 🔑 GCloud Authentication Steps

## ⚠️ Important: Each authentication attempt generates a NEW URL

The verification code you have is for a previous session and won't work with a new URL.

## Option 1: Use the Helper Script (Recommended)

```bash
# Run our helper script
./gcloud-auth-helper.sh
```

This will:
- Start authentication
- Guide you through the process
- Configure your project automatically

## Option 2: Manual Steps

1. **Start fresh authentication:**
   ```bash
   gcloud auth login --no-launch-browser
   ```

2. **Copy the NEW URL it shows**
   - Each attempt generates a unique URL
   - Don't use old URLs or codes

3. **In your Windows browser:**
   - Paste the URL
   - Sign in with your Google account
   - Grant permissions (click "Allow")

4. **Copy the NEW verification code**
   - It will look like: `4/0AV...`

5. **Paste it in the terminal**
   - Paste when prompted "Enter verification code:"

## After authentication, configure your project:

```bash
# Set your default project
gcloud config set project the-weave-sacred

# Set default region
gcloud config set compute/region us-central1

# Enable Application Default Credentials
gcloud auth application-default login --no-launch-browser
```

## Verify everything works:

```bash
# Check you're logged in
gcloud auth list

# Check project is set
gcloud config get-value project

# Test API access
gcloud projects describe the-weave-sacred
```

---

*Once authenticated, you can delete this file for security* 🔐