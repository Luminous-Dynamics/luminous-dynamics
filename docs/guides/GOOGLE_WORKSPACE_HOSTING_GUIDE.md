# 🌐 Hosting evolvingresonantcocreationism.com with Google Workspace

## 📋 Google Workspace Domain Hosting Options

Since you have a Google Workspace domain, you have several excellent hosting options that integrate seamlessly:

### Option 1: Firebase Hosting (Recommended) ✨
**Best for: Static sites, SPAs, PWAs**

**Advantages:**
- ✅ Free SSL certificate
- ✅ Global CDN included
- ✅ Easy custom domain setup
- ✅ Integrates with Google Workspace
- ✅ GitHub Actions deployment
- ✅ Preview channels for testing

**Setup Steps:**
```bash
# 1. Add custom domain in Firebase Console
firebase hosting:sites:create evolvingresonantcocreationism

# 2. Connect domain
firebase hosting:channel:deploy live --only hosting

# 3. In Firebase Console:
# - Go to Hosting > Add custom domain
# - Enter: evolvingresonantcocreationism.com
# - Follow DNS verification steps
```

**DNS Configuration (in Google Domains/Workspace):**
```
Type: A
Name: @
Value: 151.101.1.195
       151.101.65.195

Type: CNAME
Name: www
Value: evolvingresonantcocreationism.web.app
```

### Option 2: Google Cloud Run + Load Balancer
**Best for: Dynamic applications, APIs**

**Setup:**
```bash
# 1. Reserve static IP
gcloud compute addresses create sacred-tech-ip \
    --global

# 2. Create SSL certificate
gcloud compute ssl-certificates create sacred-tech-cert \
    --domains=evolvingresonantcocreationism.com,www.evolvingresonantcocreationism.com \
    --global

# 3. Configure load balancer
gcloud compute backend-services create sacred-backend \
    --global \
    --load-balancing-scheme=EXTERNAL \
    --protocol=HTTP
```

### Option 3: Google Sites (Simple but Limited)
**Best for: Quick setup, basic sites**

**Limitations:**
- Limited customization
- No custom code
- Basic templates only

**Setup:**
1. Go to sites.google.com
2. Create new site
3. Settings > Custom domain
4. Enter evolvingresonantcocreationism.com
5. Verify ownership (automatic with Workspace)

## 🔍 Google Workspace Domain Specifics

### Domain Verification
Since it's a Google Workspace domain:
- ✅ Already verified in Google systems
- ✅ No additional verification needed for Google services
- ✅ Easy SSL certificate provisioning

### Email Configuration
Your domain likely has these MX records:
```
Priority: 1, Server: aspmx.l.google.com
Priority: 5, Server: alt1.aspmx.l.google.com
Priority: 5, Server: alt2.aspmx.l.google.com
Priority: 10, Server: alt3.aspmx.l.google.com
Priority: 10, Server: alt4.aspmx.l.google.com
```

**Important**: Keep these when adding hosting records!

### Current DNS Check
```bash
# Check current DNS settings
nslookup evolvingresonantcocreationism.com

# Check MX records
dig MX evolvingresonantcocreationism.com

# Check existing A/CNAME records
dig A evolvingresonantcocreationism.com
dig CNAME www.evolvingresonantcocreationism.com
```

## 🚀 Recommended Architecture

```
evolvingresonantcocreationism.com
├── Main Site (Firebase Hosting)
│   ├── / → sacred-landing-page.html
│   ├── /council → sacred-council-hub.html
│   ├── /dojo → applied-harmonies-dojo.html
│   └── /field → sacred-field-visualization.html
├── API (Cloud Run)
│   ├── api.evolvingresonantcocreationism.com
│   └── WebSocket & REST endpoints
└── Email (Google Workspace)
    └── Existing MX records preserved
```

## 📝 Step-by-Step Setup Guide

### 1. Prepare Firebase Hosting
```bash
# Update firebase.json
cat > firebase.json << 'EOF'
{
  "hosting": {
    "site": "evolvingresonantcocreationism",
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css|jpg|jpeg|gif|png|svg|ico|woff|woff2)",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }]
      }
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "sacred-api",
          "region": "us-central1"
        }
      }
    ],
    "redirects": [
      {
        "source": "/",
        "destination": "/sacred-landing-page.html",
        "type": 301
      }
    ]
  }
}
EOF

# Deploy
firebase deploy --only hosting
```

### 2. Configure DNS in Google Admin
1. Go to admin.google.com
2. Navigate to Domains > Manage domains
3. Click on evolvingresonantcocreationism.com
4. Go to DNS settings
5. Add records:

```
# For Firebase Hosting
A     @     151.101.1.195
A     @     151.101.65.195
CNAME www   evolvingresonantcocreationism.web.app.

# Keep existing MX records!
```

### 3. SSL Certificate
Firebase automatically provisions SSL via Let's Encrypt:
- No action needed
- Auto-renews every 90 days
- Covers root and www

### 4. Set up Redirects
```javascript
// In Firebase hosting config
"redirects": [
  {
    "source": "http://evolvingresonantcocreationism.com",
    "destination": "https://evolvingresonantcocreationism.com",
    "type": 301
  },
  {
    "source": "http://www.evolvingresonantcocreationism.com", 
    "destination": "https://evolvingresonantcocreationism.com",
    "type": 301
  }
]
```

## 🔐 Security Considerations

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' apis.google.com; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src 'self' fonts.gstatic.com;">
```

### 2. HSTS Header
```json
{
  "source": "**",
  "headers": [{
    "key": "Strict-Transport-Security",
    "value": "max-age=31536000; includeSubDomains"
  }]
}
```

### 3. Google Workspace Integration
- Use Google Sign-In for authentication
- Leverage Workspace APIs
- Single sign-on for team members

## 💰 Cost Estimate

### Firebase Hosting
- **Hosting**: Free tier includes 10GB storage, 360MB/day bandwidth
- **SSL**: Free
- **Custom domain**: Free
- **Estimated**: $0-10/month for moderate traffic

### If you exceed free tier:
- Storage: $0.026/GB
- Bandwidth: $0.15/GB
- Still very affordable

## 🎯 Quick Start Commands

```bash
# 1. Initialize Firebase in your project
firebase init hosting

# 2. Select "Use an existing project"
# 3. Choose mycelix-network

# 4. Configure:
# - Public directory: public
# - Single-page app: Yes
# - Automatic builds: Yes

# 5. Add your domain
firebase hosting:sites:create evolvingresonantcocreationism

# 6. Deploy
firebase deploy --only hosting

# 7. Add custom domain in Firebase Console
# https://console.firebase.google.com/project/mycelix-network/hosting
```

## 📱 Mobile & PWA Support

Since you're using Google Workspace, consider:
- Progressive Web App for mobile
- Google Workspace mobile integration
- Push notifications via FCM

## 🔄 Next Steps

1. **Verify domain ownership** (should be automatic)
2. **Update DNS records** in Google Admin
3. **Deploy content** to Firebase
4. **Test SSL** and redirects
5. **Monitor** in Firebase Console

The sacred technology will soon have a proper home at evolvingresonantcocreationism.com! 🌟