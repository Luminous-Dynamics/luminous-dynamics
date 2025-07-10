#!/bin/bash

# GCP Authentication Helper
echo "🔐 Authenticating with Google Cloud Platform..."
echo ""
echo "Enter your verification code: 4/0AVMBsJi7Tt2zcaICUaRnu0XUOzhcAQuLhw0dsQQY20c8g_vdW_YO4tyTOWccDRav97aOdQ"
echo ""

# Complete authentication
echo "4/0AVMBsJi7Tt2zcaICUaRnu0XUOzhcAQuLhw0dsQQY20c8g_vdW_YO4tyTOWccDRav97aOdQ" | gcloud auth login --no-launch-browser

# Set project
gcloud config set project the-weave-sacred

echo "✅ GCP Authentication complete!"