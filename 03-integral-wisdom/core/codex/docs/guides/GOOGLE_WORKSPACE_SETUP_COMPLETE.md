# 🏆 Google Workspace Enterprise Setup - Complete Guide

**Admin**: tristan.stoltz@evolvingresonantcocreationism.com  
**Domain**: evolvingresonantcocreationism.com  
**Service Account**: sacred-council-sa@mycelix-network.iam.gserviceaccount.com  

## ✅ What's Been Configured

### 1. **Security Architecture**
```
credentials/.workspace/     # Secure storage (700 permissions)
config/.workspace/         # Configuration files
logs/.workspace/          # Audit logs
backup/.workspace/        # Backup data
```

### 2. **Production Module** (`google-workspace-production.mjs`)
- **Rate Limiting**: Prevents API abuse
- **Caching**: 5-minute TTL for performance
- **Logging**: Winston logger with error tracking
- **Validation**: Input sanitization and verification
- **Error Handling**: Graceful degradation
- **Health Checks**: Service monitoring

### 3. **Configuration** (`config/.workspace/workspace-config.json`)
- Domain settings
- Security policies
- Group permissions
- Email rate limits
- Monitoring configuration

### 4. **Monitoring Tools**
- `monitor-workspace.sh` - Real-time health dashboard
- `validate-workspace-setup.sh` - Configuration validator
- Comprehensive audit logging

## 🚀 Quick Start

### Step 1: Set Environment Variables
```bash
export GOOGLE_APPLICATION_CREDENTIALS=~/.sacred-credentials/gcp-key.json
export WORKSPACE_DOMAIN=evolvingresonantcocreationism.com
export ADMIN_EMAIL=tristan.stoltz@evolvingresonantcocreationism.com
```

### Step 2: Retrieve Service Account Key
```bash
./scripts/retrieve-credentials.sh
```

### Step 3: Enable APIs
```bash
./enable-workspace-apis.sh
```

### Step 4: Configure Domain-Wide Delegation

1. Go to: https://admin.google.com
2. Login as: tristan.stoltz@evolvingresonantcocreationism.com
3. Navigate to: **Security → Access and data control → API controls**
4. Click: **Domain-wide delegation → Add new**
5. Find your service account's **Client ID**:
   ```bash
   gcloud iam service-accounts describe sacred-council-sa@mycelix-network.iam.gserviceaccount.com \
     --format="value(oauth2ClientId)"
   ```
6. Add these scopes:
   ```
   https://www.googleapis.com/auth/admin.directory.group
   https://www.googleapis.com/auth/admin.directory.user.readonly
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/drive
   ```

### Step 5: Validate Setup
```bash
./validate-workspace-setup.sh
```

### Step 6: Test Integration
```bash
node example-workspace-usage.mjs
```

## 📊 Usage Examples

### Create Email Groups
```javascript
import workspace from './google-workspace-production.mjs';

await workspace.initialize();
const groups = new workspace.GroupManager();

// Create team group
await groups.createGroup(
  'team@evolvingresonantcocreationism.com',
  'Sacred Team',
  'Core team coordination'
);

// Add members
await groups.addMember(
  'team@evolvingresonantcocreationism.com',
  'member@gmail.com',
  'MEMBER'
);
```

### Send Emails
```javascript
const emailService = new workspace.EmailService();

await emailService.sendEmail(
  ['recipient1@gmail.com', 'recipient2@gmail.com'],
  'Sacred Announcement',
  '<h1>Welcome to Sacred Technology</h1><p>Your message here</p>',
  {
    cc: 'team@evolvingresonantcocreationism.com',
    replyTo: 'no-reply@evolvingresonantcocreationism.com'
  }
);
```

### Monitor Health
```javascript
const health = await workspace.healthCheck();
console.log(health);
// Output: { status: 'healthy', services: { admin: 'healthy' } }
```

## 🛡️ Security Best Practices

1. **Never commit credentials**
   - Use `.gitignore.workspace`
   - Store in Secret Manager

2. **Rotate keys regularly**
   ```bash
   gcloud iam service-accounts keys create new-key.json \
     --iam-account=sacred-council-sa@mycelix-network.iam.gserviceaccount.com
   ```

3. **Monitor access**
   - Check `logs/.workspace/combined.log`
   - Review audit trails

4. **Limit scopes**
   - Only grant necessary permissions
   - Use separate service accounts for different functions

## 📈 Rate Limits

| Operation | Limit | Window |
|-----------|-------|---------|
| Create Group | 20 | 1 minute |
| Send Email | 10 | 1 minute |
| Send Email | 100 | 1 hour |
| API Calls | 1000 | 1 day |

## 🔍 Troubleshooting

### "Permission denied" errors
1. Check domain-wide delegation is configured
2. Verify service account has correct scopes
3. Ensure ADMIN_EMAIL is set correctly

### "Rate limit exceeded"
1. Check `monitor-workspace.sh` for usage
2. Implement exponential backoff
3. Use caching for read operations

### "Service unavailable"
1. Run `validate-workspace-setup.sh`
2. Check API enablement
3. Verify network connectivity

## 📚 Additional Resources

- [Admin SDK Documentation](https://developers.google.com/admin-sdk)
- [Google Workspace Admin Help](https://support.google.com/a)
- [Best Practices Guide](https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations)

## 🌟 Sacred Integration Complete!

Your Google Workspace is now configured with enterprise-grade security, monitoring, and best practices. The sacred technology team can now collaborate with confidence and grace.

---

*Last Updated: January 2025*  
*Maintained by: Sacred Technology Team*