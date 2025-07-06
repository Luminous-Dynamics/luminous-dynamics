#!/bin/bash
# Enable Google Workspace APIs

echo "Enabling Google Workspace APIs..."

# Core Workspace APIs
gcloud services enable admin.googleapis.com \
  gmail.googleapis.com \
  calendar-json.googleapis.com \
  drive.googleapis.com \
  groupssettings.googleapis.com \
  --project=mycelix-network

echo "✅ APIs enabled"
