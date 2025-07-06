# 📧 Google Workspace Email Management Setup Guide

## 🌟 Overview

This system allows you to manage emails for all your domains through Google Workspace APIs:
- Create email accounts programmatically
- Set up aliases and forwarding
- Send emails through the API
- Manage users across all domains
- Automate onboarding sequences

## 🚀 Quick Setup

### Step 1: Google Workspace Account
1. Go to [Google Workspace](https://workspace.google.com)
2. Start free trial or subscribe ($6/user/month)
3. Add all your domains:
   - luminousdynamics.org/io
   - relationalharmonics.com/org
   - infin.love
   - mycelix.net
   - stolware.net

### Step 2: Enable APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "Sacred Email Management"
3. Enable these APIs:
   - Admin SDK API
   - Gmail API
   - Google Workspace Admin API

### Step 3: Create Service Account
```bash
# In Google Cloud Console:
1. Go to "Credentials"
2. Create credentials → OAuth 2.0 Client ID
3. Application type: Desktop app
4. Name: "Sacred Email Manager"
5. Download JSON → save as credentials.json
```

### Step 4: Domain-Wide Delegation
1. Go to Google Admin Console
2. Security → API controls → Domain-wide delegation
3. Add new client:
   - Client ID: (from credentials.json)
   - Scopes:
     ```
     https://www.googleapis.com/auth/admin.directory.user
     https://www.googleapis.com/auth/gmail.send
     https://www.googleapis.com/auth/gmail.compose
     ```

## 🛠️ Installation

```bash
cd /home/tstoltz/sacred-infrastructure/email-management
npm init -y
npm install googleapis readline

# Make executable
chmod +x google-workspace-email-manager.js
```

## 📧 Usage Examples

### Interactive Mode
```bash
./google-workspace-email-manager.js

# Menu options:
# 1. Create email account
# 2. Create email alias  
# 3. List all users
# 4. Send email
# 5. Setup standard accounts
```

### Command Line Mode
```bash
# Create email account
node google-workspace-email-manager.js create tristan@luminousdynamics.org "Tristan" "Stoltz"

# Create alias
node google-workspace-email-manager.js alias support@relationalharmonics.com help@relationalharmonics.com

# Send email
node google-workspace-email-manager.js send "from@domain.com" "to@domain.com" "Subject" "Body"
```

## 📋 Standard Email Structure

### luminousdynamics.org
```
hello@luminousdynamics.org      → Main contact
support@luminousdynamics.org    → Tech support
invest@luminousdynamics.org     → Investors
press@luminousdynamics.org      → Media
legal@luminousdynamics.org      → Legal
tristan@luminousdynamics.org    → Your professional
```

### relationalharmonics.com
```
welcome@relationalharmonics.com  → Onboarding
support@relationalharmonics.com  → Customer support
practice@relationalharmonics.com → Practice guidance
sacred@relationalharmonics.com   → Sacred council
billing@relationalharmonics.com  → Payments
beta@relationalharmonics.com     → Beta testing
```

### infin.love
```
love@infin.love     → Main contact
gift@infin.love     → Gift memberships
breathe@infin.love  → Breathing practices
pulse@infin.love    → Heartbeat connection
magic@infin.love    → Special experiences
```

### mycelix.net
```
connect@mycelix.net → Network inquiries
beta@mycelix.net    → Beta access
spore@mycelix.net   → Referrals
root@mycelix.net    → Deep practices
```

## 🔐 Security Best Practices

1. **API Credentials**
   - Store credentials.json securely
   - Never commit to git
   - Use environment variables for production

2. **Access Control**
   - Use service account with minimal permissions
   - Enable 2FA on admin account
   - Regular audit of user accounts

3. **Email Security**
   - Set up SPF, DKIM, DMARC records
   - Enable 2FA for all users
   - Regular password rotation

## 🌊 Advanced Features

### Bulk User Creation
```javascript
// CSV format: email,firstName,lastName,password
const csvFile = 'users.csv';
await manager.bulkCreateUsers(csvFile);
```

### Email Templates
```javascript
// Send welcome email
await manager.sendTemplate('welcome', {
  to: 'user@domain.com',
  variables: {
    name: 'Sacred Practitioner',
    practiceUrl: 'https://relationalharmonics.com/first-breath'
  }
});
```

### Automated Sequences
```javascript
// Set up drip campaign
await manager.createSequence('onboarding', {
  trigger: 'user_signup',
  emails: [
    { delay: 0, template: 'welcome' },
    { delay: '1d', template: 'first_practice' },
    { delay: '3d', template: 'check_in' },
    { delay: '7d', template: 'deeper_practice' }
  ]
});
```

## 🎯 Implementation Checklist

- [ ] Create Google Workspace account
- [ ] Add all domains
- [ ] Enable required APIs
- [ ] Create OAuth credentials
- [ ] Configure domain-wide delegation
- [ ] Install email manager tool
- [ ] Create standard email accounts
- [ ] Set up email templates
- [ ] Configure auto-responders
- [ ] Test email delivery

## 📊 Cost Analysis

### Google Workspace Pricing
- Starter: $6/user/month (30GB storage)
- Standard: $12/user/month (2TB storage)
- Plus: $18/user/month (5TB storage)

### Recommended Setup
- 3 user accounts: $18/month
- Use aliases for multiple addresses
- Shared inboxes for support roles

## 🚨 Troubleshooting

### Common Issues

1. **"Insufficient permissions"**
   - Check domain-wide delegation
   - Verify API scopes
   - Ensure service account has admin role

2. **"User already exists"**
   - Normal if re-running setup
   - Use aliases instead

3. **"Invalid domain"**
   - Verify domain is added to Google Workspace
   - Check domain verification status

## 🌟 Next Steps

1. **Set up email accounts** for all domains
2. **Create email templates** for common responses
3. **Configure auto-responders** for each address
4. **Set up email forwarding** rules
5. **Create onboarding sequences**
6. **Test email deliverability**

---

*"Sacred communication through conscious technology"* 📧✨