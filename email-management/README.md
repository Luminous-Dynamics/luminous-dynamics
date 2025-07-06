# 📧 Sacred Email Management System

Complete email management solution for all your domains through Google Workspace APIs.

## 🌟 Features

- **Create email accounts** programmatically across all domains
- **Manage aliases** and email forwarding
- **Send emails** through Gmail API
- **Bulk operations** for efficient management
- **Email templates** for consistent communication
- **Both Node.js and Python** implementations

## 🚀 Quick Start

### 1. Install Dependencies

**For Node.js version:**
```bash
npm install
```

**For Python version:**
```bash
pip install -r requirements.txt
```

### 2. Set Up Google Workspace

1. Create account at [workspace.google.com](https://workspace.google.com)
2. Add your domains
3. Enable APIs in Google Cloud Console:
   - Admin SDK API
   - Gmail API

### 3. Get Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Download as `credentials.json`
4. Place in this directory

### 4. Run the Manager

**Interactive Mode (Node.js):**
```bash
./google-workspace-email-manager.js
```

**Interactive Mode (Python):**
```bash
./sacred_email_manager.py
```

**Quick Operations:**
```bash
./quick-email-ops.sh
```

## 📋 Standard Email Structure

### Primary Domains

**luminousdynamics.org**
- hello@ - Main contact
- support@ - Tech support  
- invest@ - Investors
- press@ - Media
- tristan@ - Personal

**relationalharmonics.com**
- welcome@ - Onboarding
- support@ - Customer support
- practice@ - Guidance
- sacred@ - Council
- billing@ - Payments

**infin.love**
- love@ - Main contact
- gift@ - Gifts
- breathe@ - Practices
- magic@ - Special

**mycelix.net**
- connect@ - Network
- beta@ - Beta access
- spore@ - Referrals
- root@ - Deep work

## 🛠️ Usage Examples

### Create Email Account
```bash
# Node.js
node google-workspace-email-manager.js create tristan@luminousdynamics.org "Tristan" "Stoltz"

# Python
python sacred_email_manager.py
# Then select option 1
```

### Send Email
```javascript
// Node.js
manager.sendEmail(
  'hello@luminousdynamics.org',
  'recipient@example.com',
  'Welcome to the Sacred Journey',
  'Your transformation begins...'
);
```

```python
# Python
manager.send_email(
  'hello@luminousdynamics.org',
  'recipient@example.com',
  'Welcome to the Sacred Journey',
  'Your transformation begins...'
)
```

### Bulk Setup Domain
```bash
# Sets up all standard accounts for a domain
./quick-email-ops.sh
# Select option 1
```

## 📁 File Structure

```
email-management/
├── google-workspace-email-manager.js  # Node.js implementation
├── sacred_email_manager.py           # Python implementation
├── quick-email-ops.sh               # Bash quick operations
├── GOOGLE_WORKSPACE_EMAIL_SETUP.md  # Detailed setup guide
├── credentials.json                 # Your OAuth credentials (don't commit!)
├── token.json                      # Auth token (auto-generated)
├── package.json                    # Node dependencies
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

## 🔐 Security Notes

1. **Never commit** `credentials.json` or `token.json`
2. **Use strong passwords** for all accounts
3. **Enable 2FA** on admin accounts
4. **Regular audits** of user access
5. **Set up SPF/DKIM/DMARC** for each domain

## 🌊 Advanced Features

### Email Templates
```javascript
// Built-in templates
- welcome
- beta_invite
- sacred_ceremony
- gift_received
```

### Automated Sequences
- Onboarding flows
- Drip campaigns
- Event reminders
- Practice guidance

### Monitoring
- Delivery tracking
- Open rates
- Bounce handling
- Spam score checking

## 💰 Cost Optimization

- Start with 3 users ($18/month)
- Use aliases for multiple addresses
- Shared inboxes for team emails
- Upgrade as you grow

## 🚨 Troubleshooting

**"Insufficient permissions"**
- Enable domain-wide delegation
- Check API scopes

**"User already exists"**
- Normal on re-run
- Use aliases instead

**"Invalid domain"**
- Verify domain in Google Workspace
- Check DNS settings

## 📚 Documentation

- [Full Setup Guide](GOOGLE_WORKSPACE_EMAIL_SETUP.md)
- [Google Workspace Docs](https://developers.google.com/workspace)
- [API Reference](https://developers.google.com/admin-sdk)

---

*"Sacred communication through conscious technology"* 📧✨

## Support

For help: support@luminousdynamics.org