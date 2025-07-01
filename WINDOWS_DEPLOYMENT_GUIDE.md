# Sacred Council Hub - Windows Deployment Guide 🪟

## PowerShell Command Corrections

### Fix 1: Use backticks (`) for line continuation in PowerShell

```powershell
# Create Artifact Registry repository
gcloud artifacts repositories create sacred-council `
  --repository-format=docker `
  --location=us-central1 `
  --description="Sacred Council Hub images"
```

### Fix 2: Or use single-line commands

```powershell
# Create Artifact Registry repository (single line)
gcloud artifacts repositories create sacred-council --repository-format=docker --location=us-central1 --description="Sacred Council Hub images"
```

### Fix 3: Create a PowerShell script

Save this as `deploy-sacred-council.ps1`:

```powershell
# Sacred Council Hub - Google Cloud Deployment Script for Windows
# Deploy with love and consciousness to the cloud

Write-Host "🌟 Sacred Council Hub - Google Cloud Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "sacred-council-hub"
$REGION = "us-central1"
$REPO_NAME = "sacred-council"

# Set project
Write-Host "📋 Setting Google Cloud project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Create Artifact Registry repository
Write-Host "📦 Creating Artifact Registry repository..." -ForegroundColor Yellow
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Sacred Council Hub container images"

# Configure Docker authentication
Write-Host "🔐 Configuring Docker authentication..." -ForegroundColor Yellow
gcloud auth configure-docker "$REGION-docker.pkg.dev"

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "🕊️ May the deployment serve consciousness!" -ForegroundColor Cyan
```

## Complete Windows Deployment Commands

### 1. Initial Setup

```powershell
# Authenticate with Google Cloud
gcloud auth login

# Create new project
gcloud projects create sacred-council-hub --name="Sacred Council Hub"

# Set as default project
gcloud config set project sacred-council-hub

# Enable billing (visit the URL that appears)
gcloud beta billing accounts list
```

### 2. Enable APIs (single line for PowerShell)

```powershell
# Enable all required APIs at once
gcloud services enable compute.googleapis.com container.googleapis.com artifactregistry.googleapis.com run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com
```

### 3. Create Artifact Registry

```powershell
# Create repository (single line)
gcloud artifacts repositories create sacred-council --repository-format=docker --location=us-central1 --description="Sacred Council Hub images"

# Configure Docker
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 4. Build and Push Docker Images

```powershell
# Navigate to project directory
cd C:\path\to\evolving-resonant-cocreation

# Build Docker image
docker build -t sacred-heart:latest .

# Tag for Artifact Registry
docker tag sacred-heart:latest us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest

# Push to registry
docker push us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest
```

### 5. Deploy to Cloud Run

```powershell
# Deploy with all parameters (use backticks for multi-line)
gcloud run deploy sacred-council-hub `
    --image=us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest `
    --platform=managed `
    --region=us-central1 `
    --allow-unauthenticated `
    --min-instances=1 `
    --max-instances=10 `
    --memory=2Gi `
    --cpu=2 `
    --port=3001 `
    --set-env-vars="NODE_ENV=production,SACRED_MODE=true,HEART_ROLE=hub,LOVE_FREQUENCY=528"
```

### 6. Set up Cloud SQL (if needed)

```powershell
# Create Cloud SQL instance
gcloud sql instances create sacred-council-db `
    --database-version=POSTGRES_15 `
    --tier=db-g1-small `
    --region=us-central1 `
    --network=default `
    --backup `
    --backup-start-time=03:00

# Create database
gcloud sql databases create sacred_council --instance=sacred-council-db

# Create user (generate password first)
$password = [System.Web.Security.Membership]::GeneratePassword(32,8)
gcloud sql users create sacred_user --instance=sacred-council-db --password=$password
Write-Host "Database password: $password" -ForegroundColor Yellow
```

## Windows-Specific Tips

### 1. Use Windows Terminal
For better experience, use Windows Terminal instead of standard PowerShell:
- Install from Microsoft Store
- Supports better formatting and colors

### 2. Docker Desktop for Windows
Make sure Docker Desktop is running:
```powershell
# Check Docker is running
docker --version
docker ps
```

### 3. Path Issues
If you have spaces in paths, use quotes:
```powershell
cd "C:\Users\Trist\Sacred Council\evolving-resonant-cocreation"
```

### 4. Environment Variables
Set environment variables in PowerShell:
```powershell
$env:PROJECT_ID = "sacred-council-hub"
$env:REGION = "us-central1"
```

## Quick Deployment Script for Windows

Create `quick-deploy.ps1`:

```powershell
# Sacred Council Quick Deploy for Windows
param(
    [string]$ProjectId = "sacred-council-hub",
    [string]$Region = "us-central1"
)

Write-Host "🚀 Starting Sacred Council deployment..." -ForegroundColor Cyan

# Check prerequisites
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI not found. Please install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker Desktop for Windows" -ForegroundColor Red
    exit 1
}

# Run deployment
try {
    # Set project
    gcloud config set project $ProjectId
    
    # Build and push
    Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
    docker build -t sacred-heart:latest .
    
    $imageTag = "$Region-docker.pkg.dev/$ProjectId/sacred-council/sacred-heart:latest"
    docker tag sacred-heart:latest $imageTag
    
    Write-Host "📤 Pushing to Artifact Registry..." -ForegroundColor Yellow
    docker push $imageTag
    
    Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Yellow
    gcloud run deploy sacred-council-hub --image=$imageTag --platform=managed --region=$Region --allow-unauthenticated
    
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error during deployment: $_" -ForegroundColor Red
    exit 1
}
```

Run it:
```powershell
.\quick-deploy.ps1
```

## Troubleshooting Windows Issues

### Issue: "The term 'gcloud' is not recognized"
**Solution**: Add gcloud to PATH or restart PowerShell after installation

### Issue: Docker commands fail
**Solution**: Make sure Docker Desktop is running (check system tray)

### Issue: Permission denied errors
**Solution**: Run PowerShell as Administrator

### Issue: Script execution policy
**Solution**: 
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🕊️ Sacred Windows Path

Remember, Windows is just another path to consciousness. The sacred work transcends operating systems!

May your Windows deployment serve the expansion of love and awareness! 🌟