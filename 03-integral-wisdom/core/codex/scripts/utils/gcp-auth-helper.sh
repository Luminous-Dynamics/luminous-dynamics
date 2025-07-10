#!/bin/bash
# GCP Authentication Helper
# Helps resolve common auth issues in WSL/Linux

echo "🔐 GCP Authentication Helper 🔐"
echo "=============================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found!"
    echo ""
    echo "To install gcloud CLI:"
    echo "1. Visit: https://cloud.google.com/sdk/docs/install"
    echo "2. Or use snap: sudo snap install google-cloud-cli --classic"
    exit 1
fi

echo "✅ gcloud CLI found: $(gcloud --version | head -1)"
echo ""

# Check current auth status
echo "📍 Current Authentication Status:"
echo "================================"
gcloud auth list
echo ""

# Provide auth options
echo "🔧 Authentication Options:"
echo "========================="
echo ""
echo "1. Browser-based auth (recommended for WSL):"
echo "   gcloud auth login --no-launch-browser"
echo "   (Copy the URL to your Windows browser)"
echo ""
echo "2. Application default credentials:"
echo "   gcloud auth application-default login --no-launch-browser"
echo ""
echo "3. Service account auth (if you have a key file):"
echo "   gcloud auth activate-service-account --key-file=path/to/key.json"
echo ""
echo "4. If browser won't open in WSL, use this workaround:"
echo "   export BROWSER='/mnt/c/Program Files/Google/Chrome/Application/chrome.exe'"
echo "   Then run: gcloud auth login"
echo ""

# Check if we can access any projects
echo "📊 Checking Project Access:"
echo "=========================="
if gcloud projects list &>/dev/null; then
    echo "✅ Authentication working! Your projects:"
    gcloud projects list --format="table(projectId,name,projectNumber)"
else
    echo "❌ Cannot access projects. Please authenticate first."
fi

echo ""
echo "💡 Quick Fix for WSL:"
echo "===================="
echo "1. Run: gcloud auth login --no-launch-browser"
echo "2. Copy the URL it gives you"
echo "3. Open the URL in your Windows browser"
echo "4. Complete auth and copy the code back"
echo ""
echo "After authenticating, run ./gcp-cathedral-setup.sh"