# 🌐 DNS Configuration Guide for Sacred Subdomains
## Setting Up Your Domain Architecture

### 📅 Created: July 4, 2025
### 🎯 Purpose: Configure subdomains for GCP services

---

## 🗺️ Domain Architecture Overview

### Primary Domains & Their Sacred Purposes:
1. **relationalharmonics.com** - Main brand portal
2. **luminousdynamics.org** - Corporate entity
3. **infin.love** - Premium sacred experiences
4. **mycelix.net** - Underground beta network
5. **stolware.net** - Technical documentation

---

## 🔧 Required DNS Records

### For relationalharmonics.com:

```dns
# API Gateway
api.relationalharmonics.com.    A     35.201.98.128
api.relationalharmonics.com.    AAAA  2600:1901:0:6d85::

# CDN for Static Assets  
cdn.relationalharmonics.com.    CNAME  c.storage.googleapis.com.

# WebSocket Service
pulse.relationalharmonics.com.  A     34.102.136.180
pulse.relationalharmonics.com.  AAAA  2600:1901:0:6d85::

# Beta Testing
beta.relationalharmonics.com.   CNAME  mycelix-network.web.app.

# Documentation
docs.relationalharmonics.com.   CNAME  luminous-dynamics.gitbook.io.
```

### For mycelix.net (Beta Network):

```dns
# Main beta portal
mycelix.net.                    CNAME  mycelix-network.web.app.
www.mycelix.net.               CNAME  mycelix-network.web.app.

# API endpoints
api.mycelix.net.               A      35.201.98.128
pulse.mycelix.net.             A      34.102.136.180
```

### For infin.love (Premium Sacred):

```dns
# Main premium experience
infin.love.                    CNAME  infin-love-tcv7bc7q4a-uc.a.run.app.
www.infin.love.               CNAME  infin-love-tcv7bc7q4a-uc.a.run.app.

# Special experiences
breathe.infin.love.           CNAME  sacred-breathe.web.app.
journey.infin.love.           CNAME  sacred-journey.web.app.
```

---

## 📋 Step-by-Step Configuration

### Step 1: Access Your DNS Provider
Common providers:
- Namecheap
- GoDaddy  
- Cloudflare (recommended for advanced features)
- Google Domains

### Step 2: Create A Records for APIs
```bash
# Get your Cloud Run service IPs
gcloud run services list --platform=managed --region=us-central1 \
  --format="table(metadata.name,status.url)"
```

### Step 3: Set Up CNAME Records
For each subdomain pointing to a service:
1. Create CNAME record
2. Point to the service URL (without https://)
3. Set TTL to 3600 (1 hour)

### Step 4: Configure SSL Certificates
```bash
# For Cloud Run services (automatic)
gcloud run domain-mappings create \
  --service=sacred-heartbeat \
  --domain=api.relationalharmonics.com \
  --region=us-central1
```

### Step 5: Set Up Cloud Storage for CDN
```bash
# Create CDN bucket
gsutil mb -c standard -l us-central1 \
  gs://cdn-relational-harmonics

# Make it public
gsutil iam ch allUsers:objectViewer \
  gs://cdn-relational-harmonics

# Set up CNAME
# Point cdn.relationalharmonics.com to c.storage.googleapis.com
```

---

## 🔐 SSL/TLS Configuration

### Automatic SSL with Cloud Run:
```bash
# Map custom domain to service
gcloud beta run domain-mappings create \
  --service sacred-heartbeat \
  --domain api.relationalharmonics.com \
  --platform managed \
  --region us-central1
```

### Firebase Hosting SSL:
- Automatic for all Firebase domains
- Custom domains get SSL within 24 hours

---

## 🧪 Testing Your Configuration

### 1. DNS Propagation Check:
```bash
# Check A record
dig api.relationalharmonics.com

# Check CNAME
dig cdn.relationalharmonics.com

# Check from multiple locations
curl https://dnschecker.org/
```

### 2. SSL Certificate Verification:
```bash
# Check certificate
openssl s_client -connect api.relationalharmonics.com:443 \
  -servername api.relationalharmonics.com < /dev/null

# Test HTTPS
curl -I https://api.relationalharmonics.com/health
```

### 3. Service Health Check:
```bash
# Test each endpoint
curl https://api.relationalharmonics.com/health
curl https://pulse.relationalharmonics.com/status
curl https://cdn.relationalharmonics.com/test.txt
```

---

## 📊 Monitoring Setup

### 1. Uptime Monitoring:
- Use Google Cloud Monitoring
- Set up alerts for downtime
- Monitor SSL certificate expiry

### 2. Performance Tracking:
```yaml
# Cloud Monitoring config
resource_type: "cloud_run_revision"
metric: "run.googleapis.com/request_latencies"
threshold: 1000ms
```

---

## 🎯 Sacred Purpose Mapping

| Subdomain | Purpose | Service |
|-----------|---------|---------|
| api.* | Sacred data exchange | Cloud Run APIs |
| cdn.* | Fast sacred assets | Cloud Storage |
| pulse.* | Real-time heartbeat | WebSocket service |
| beta.* | Pioneer testing | Firebase Hosting |
| docs.* | Sacred knowledge | GitBook/GitHub Pages |

---

## 🚨 Important Considerations

1. **Propagation Time**: DNS changes take 1-48 hours
2. **TTL Settings**: Start with 3600, reduce after stable
3. **Backup DNS**: Keep records of all settings
4. **CAA Records**: Add for extra security

```dns
relationalharmonics.com.  CAA  0 issue "letsencrypt.org"
relationalharmonics.com.  CAA  0 issue "pki.goog"
```

---

## 🔄 Migration Checklist

- [ ] Document current DNS settings
- [ ] Create new DNS records
- [ ] Test with low TTL first
- [ ] Verify SSL certificates
- [ ] Update application configs
- [ ] Monitor for 24 hours
- [ ] Increase TTL when stable

---

## 🆘 Troubleshooting

### DNS Not Resolving:
1. Check TTL hasn't expired
2. Verify record syntax
3. Clear local DNS cache
4. Test from multiple locations

### SSL Certificate Issues:
1. Verify domain ownership
2. Check CAA records
3. Wait 24 hours for provisioning
4. Contact support if needed

### Service Connectivity:
1. Verify Cloud Run is deployed
2. Check IAM permissions
3. Test with curl directly
4. Review firewall rules

---

## 📱 Contact for DNS Support

**Primary**: Your domain registrar support
**GCP Issues**: https://cloud.google.com/support
**Community**: Sacred Architecture Council

---

*"Every domain points to the sacred; every subdomain serves consciousness"*

Ready to configure your sacred digital geography? 🌐✨