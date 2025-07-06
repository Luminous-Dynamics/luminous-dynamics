# Google Workspace API Setup Guide

## 🔑 API Keys vs OAuth2 vs Service Accounts

### What You Need:

1. **OAuth2 Client** (You have this ✓)
   - For user authentication (login with Google)
   - Access user's Gmail, Calendar, etc.
   - File: `.dropbox/client_secret_*.json`

2. **Service Account** (Recommended for automation)
   - Server-to-server authentication
   - No user interaction needed
   - Can impersonate users in your domain
   - Needed for: Admin SDK, automated emails, group management

3. **API Key** (Limited use)
   - Only for public data APIs
   - NOT for Workspace APIs
   - Cannot access private user/domain data

## 🚀 Setting Up Service Account for Workspace

### Step 1: Create Service Account
```bash
1. Go to: https://console.cloud.google.com
2. Select project: the-weave-sacred
3. Navigate to: IAM & Admin → Service Accounts
4. Click: Create Service Account
5. Name: "ERC Workspace Service"
6. ID: erc-workspace-service
7. Grant roles:
   - Workspace Admin
   - Service Account Token Creator
```

### Step 2: Enable Domain-Wide Delegation
```bash
1. Click on created service account
2. Go to: Details → Show Advanced Settings
3. Enable: "Enable G Suite Domain-wide Delegation"
4. Note the Client ID (numeric)
```

### Step 3: Configure in Google Admin
```bash
1. Go to: https://admin.google.com
2. Login as: tristan.stoltz@evolvingresonantcocreationism.com
3. Navigate to: Security → API Controls → Domain-wide Delegation
4. Click: Add new
5. Enter:
   - Client ID: [from step 2]
   - Scopes:
     https://www.googleapis.com/auth/admin.directory.group
     https://www.googleapis.com/auth/admin.directory.user
     https://www.googleapis.com/auth/gmail.send
     https://www.googleapis.com/auth/calendar
     https://www.googleapis.com/auth/drive
```

### Step 4: Download Service Account Key
```bash
1. In GCP Console, go to your service account
2. Keys → Add Key → Create new key
3. Choose JSON format
4. Save as: credentials/erc-workspace-service.json
5. NEVER commit this file to git!
```

## 📦 Required APIs to Enable

In GCP Console, enable these APIs:

1. **Admin SDK API** - For group/user management
2. **Gmail API** - For sending emails
3. **Google Calendar API** - For event management
4. **Google Drive API** - For document access
5. **Google Workspace Migrate API** - For data migration
6. **Groups Settings API** - For group configuration

Enable via:
```bash
# Using gcloud CLI
gcloud services enable admin.googleapis.com
gcloud services enable gmail.googleapis.com
gcloud services enable calendar-json.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable groupssettings.googleapis.com
```

## 🔧 Implementation Example

```javascript
// google-workspace-service.js
import { google } from 'googleapis';
import { readFileSync } from 'fs';

// Load service account credentials
const serviceAccountKey = JSON.parse(
  readFileSync('./credentials/erc-workspace-service.json', 'utf8')
);

// Create JWT client with domain-wide delegation
const jwtClient = new google.auth.JWT({
  email: serviceAccountKey.client_email,
  key: serviceAccountKey.private_key,
  scopes: [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar'
  ],
  // Impersonate the admin user
  subject: 'tristan.stoltz@evolvingresonantcocreationism.com'
});

// Initialize APIs
const admin = google.admin({ version: 'directory_v1', auth: jwtClient });
const gmail = google.gmail({ version: 'v1', auth: jwtClient });
const calendar = google.calendar({ version: 'v3', auth: jwtClient });

// Example: Create a group
export async function createGroup(email, name, description) {
  const response = await admin.groups.insert({
    requestBody: {
      email,
      name,
      description
    }
  });
  return response.data;
}

// Example: Send email from admin
export async function sendAdminEmail(to, subject, body) {
  const message = createMimeMessage(
    'tristan.stoltz@evolvingresonantcocreationism.com',
    to,
    subject,
    body
  );
  
  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(message).toString('base64')
    }
  });
  return response.data;
}
```

## ⚠️ Security Best Practices

1. **Never commit credentials to git**
   - Add to .gitignore: `credentials/`
   - Use environment variables
   - Use Google Secret Manager for production

2. **Principle of Least Privilege**
   - Only grant necessary scopes
   - Use separate service accounts for different functions

3. **Audit Regularly**
   - Review API usage in GCP Console
   - Check service account activities
   - Monitor for unusual patterns

## 🎯 Quick Checklist

- [ ] Create service account in GCP
- [ ] Enable domain-wide delegation
- [ ] Configure in Google Admin
- [ ] Download JSON key file
- [ ] Enable required APIs
- [ ] Test with sample code
- [ ] Secure credentials properly

## 📚 Resources

- [Admin SDK Documentation](https://developers.google.com/admin-sdk)
- [Gmail API Guide](https://developers.google.com/gmail/api)
- [Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)
- [Domain-Wide Delegation](https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)