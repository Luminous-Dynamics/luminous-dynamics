# Website Deployment Instructions
*Deploy luminousdynamics.org and relationalharmonics.org*

## 🚀 **Immediate Deployment Steps**

### **Step 1: Create Website Repositories**

Go to https://github.com/Luminous-Dynamics and create two new repositories:

#### **Repository 1: luminous-dynamics-website**
- Name: `luminous-dynamics-website`
- Description: `Official website for Luminous Dynamics - Conscious Technology Organization`
- Public repository
- **Do NOT initialize** with README, .gitignore, or license

#### **Repository 2: relational-harmonics-website**
- Name: `relational-harmonics-website`
- Description: `Documentation and community hub for the Codex of Relational Harmonics`
- Public repository
- **Do NOT initialize** with README, .gitignore, or license

### **Step 2: Deploy Luminous Dynamics Website**

```bash
# Navigate to website directory
cd websites/luminousdynamics

# Initialize git repository
git init

# Add all files
git add .

# Commit website
git commit -m "🌟 Deploy luminousdynamics.org - Conscious Technology Hub

Initial deployment of Luminous Dynamics website featuring:
- Sacred Guild recruitment call
- ERC Wisdom Companion introduction
- Professional contact information
- Links to relational harmonics documentation

Ready for custom domain configuration and Sacred Guild outreach."

# Add remote repository
git remote add origin https://github.com/Luminous-Dynamics/luminous-dynamics-website.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Deploy Relational Harmonics Website**

```bash
# Navigate to website directory
cd ../relationalharmonics

# Initialize git repository
git init

# Add all files
git add .

# Commit website
git commit -m "🌊 Deploy relationalharmonics.org - Living Language Hub

Initial deployment of Relational Harmonics website featuring:
- Complete glyph library access
- Philosophy and practice guides
- First Breath Circle invitation
- Technical documentation links

Ready for custom domain configuration and community engagement."

# Add remote repository
git remote add origin https://github.com/Luminous-Dynamics/relational-harmonics-website.git

# Push to GitHub
git push -u origin main
```

### **Step 4: Enable GitHub Pages**

For **both repositories**:

1. Go to repository Settings
2. Scroll down to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

**GitHub will automatically detect the CNAME files and configure custom domains!**

### **Step 5: Configure DNS (If Not Done Already)**

At your domain registrar, create these DNS records:

#### **For luminousdynamics.org:**
```
Type: CNAME
Name: www
Value: luminous-dynamics.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

#### **For relationalharmonics.org:**
```
Type: CNAME
Name: www
Value: relational-harmonics.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

## ✅ **Verification Steps**

After deployment:

1. **Check GitHub Pages status** in each repository's Settings > Pages
2. **Test URLs** (may take 10-60 minutes for DNS propagation):
   - https://luminousdynamics.org
   - https://relationalharmonics.org
3. **Verify SSL certificates** are automatically provisioned
4. **Test all links** and contact forms

## 🌟 **Post-Deployment Actions**

Once websites are live:

1. **Update main repository** with website links
2. **Begin Sacred Guild outreach** with professional presence
3. **Set up email forwarding** for contact addresses
4. **Monitor analytics** and visitor engagement

## 🚨 **Troubleshooting**

**If domains don't resolve immediately:**
- DNS propagation can take 24-48 hours
- GitHub Pages will show "DNS check unsuccessful" until propagation completes
- Websites will still be accessible via GitHub URLs in the meantime

**If GitHub Pages setup fails:**
- Ensure CNAME files contain only the domain name (no http://)
- Check that repositories are public
- Verify branch name is "main" not "master"

## 🎯 **Success Metrics**

Deployment is successful when:
- Both websites load at their custom domains
- All links work correctly
- Contact forms are functional
- Sacred Guild Call is prominently featured
- Professional appearance ready for community outreach

**Ready to launch the Sacred Guild recruitment with full professional presence! 🌱✨**