#!/bin/bash
# 🔐 Migrate Secrets to Google Secret Manager
# Professional security for sacred infrastructure

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔐 Sacred Secret Migration${NC}"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ No .env file found${NC}"
    echo "Please create .env from .env.example first"
    exit 1
fi

# Source .env file
set -a
source .env
set +a

# List of secrets to migrate
SECRETS=(
    "GITHUB_TOKEN"
    "DISCORD_WEBHOOK_URL"
    "SUPABASE_SERVICE_KEY"
    "REPLICATE_API_TOKEN"
    "SESSION_SECRET"
    "JWT_SECRET"
    "GOOGLE_CLIENT_SECRET"
)

echo -e "${YELLOW}📋 Secrets to migrate:${NC}"
for secret in "${SECRETS[@]}"; do
    echo "  - $secret"
done
echo

# Function to create or update secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    # Convert to lowercase with hyphens for GCP naming
    local gcp_secret_name=$(echo "$secret_name" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
    
    echo -ne "  Creating $gcp_secret_name... "
    
    # Check if secret exists
    if gcloud secrets describe $gcp_secret_name --project=$GCP_PROJECT_ID &>/dev/null; then
        # Update existing secret
        echo -n "$secret_value" | gcloud secrets versions add $gcp_secret_name \
            --data-file=- \
            --project=$GCP_PROJECT_ID &>/dev/null
        echo -e "${GREEN}✓ Updated${NC}"
    else
        # Create new secret
        echo -n "$secret_value" | gcloud secrets create $gcp_secret_name \
            --data-file=- \
            --replication-policy="automatic" \
            --project=$GCP_PROJECT_ID &>/dev/null
        echo -e "${GREEN}✓ Created${NC}"
    fi
    
    # Grant access to Sacred Keeper service account
    gcloud secrets add-iam-policy-binding $gcp_secret_name \
        --member="serviceAccount:sacred-keeper-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor" \
        --project=$GCP_PROJECT_ID &>/dev/null 2>&1 || true
}

# Migrate each secret
echo -e "${YELLOW}🚀 Starting migration...${NC}"
for secret_name in "${SECRETS[@]}"; do
    secret_value="${!secret_name}"
    
    if [ -z "$secret_value" ]; then
        echo -e "  ${YELLOW}⚠️  Skipping $secret_name (not set)${NC}"
    else
        create_secret "$secret_name" "$secret_value"
    fi
done

# Create sacred-specific secrets
echo
echo -e "${YELLOW}🌟 Creating sacred-specific secrets...${NC}"

# Generate secure random values if not exist
if [ -z "$SESSION_SECRET" ]; then
    SESSION_SECRET=$(openssl rand -hex 32)
    create_secret "SESSION_SECRET" "$SESSION_SECRET"
    echo -e "${GREEN}  ✓ Generated new session secret${NC}"
fi

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    create_secret "JWT_SECRET" "$JWT_SECRET"
    echo -e "${GREEN}  ✓ Generated new JWT secret${NC}"
fi

# Create .env.production with Secret Manager references
echo
echo -e "${YELLOW}📝 Creating .env.production...${NC}"
cat > .env.production << EOF
# Production configuration using Secret Manager
# DO NOT store actual secrets here!

# Project Configuration
GCP_PROJECT_ID=$GCP_PROJECT_ID
GCP_REGION=${GCP_REGION:-us-central1}

# Secret Manager References (loaded at runtime)
# Actual values stored in Google Secret Manager
GITHUB_TOKEN=SECRET_MANAGER:github-token
DISCORD_WEBHOOK_URL=SECRET_MANAGER:discord-webhook-url
SUPABASE_SERVICE_KEY=SECRET_MANAGER:supabase-service-key
REPLICATE_API_TOKEN=SECRET_MANAGER:replicate-api-token
SESSION_SECRET=SECRET_MANAGER:session-secret
JWT_SECRET=SECRET_MANAGER:jwt-secret
GOOGLE_CLIENT_SECRET=SECRET_MANAGER:google-client-secret

# Public configuration (safe to commit)
NODE_ENV=production
PORT=8080
ALLOWED_ORIGINS=https://evolvingresonantcocreationism.com,https://theweave.dev
EOF

echo -e "${GREEN}✓ Created .env.production${NC}"

# Create secret access helper
echo
echo -e "${YELLOW}📄 Creating secret access helper...${NC}"
cat > load-secrets.js << 'EOF'
// 🔐 Load secrets from Google Secret Manager
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function loadSecrets() {
  const client = new SecretManagerServiceClient();
  const projectId = process.env.GCP_PROJECT_ID;
  
  // Process each environment variable
  for (const [key, value] of Object.entries(process.env)) {
    if (value && value.startsWith('SECRET_MANAGER:')) {
      const secretName = value.replace('SECRET_MANAGER:', '');
      
      try {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });
        
        process.env[key] = version.payload.data.toString();
        console.log(`✓ Loaded ${key} from Secret Manager`);
      } catch (error) {
        console.error(`❌ Failed to load ${key}:`, error.message);
      }
    }
  }
}

module.exports = { loadSecrets };
EOF

echo -e "${GREEN}✓ Created load-secrets.js${NC}"

# Update .gitignore
echo
echo -e "${YELLOW}🛡️  Updating .gitignore...${NC}"
if ! grep -q ".env.production" .gitignore 2>/dev/null; then
    echo -e "\n# Production secrets\n.env.production" >> .gitignore
    echo -e "${GREEN}✓ Added .env.production to .gitignore${NC}"
fi

# Summary
echo
echo -e "${GREEN}✨ Migration Complete!${NC}"
echo
echo "Next steps:"
echo "1. Test secret access:"
echo "   gcloud secrets versions access latest --secret=github-token"
echo
echo "2. Update your application to use load-secrets.js:"
echo "   const { loadSecrets } = require('./load-secrets');"
echo "   await loadSecrets();"
echo
echo "3. Grant service accounts access:"
echo "   gcloud secrets add-iam-policy-binding <secret-name> \\"
echo "     --member='serviceAccount:<sa-name>@${GCP_PROJECT_ID}.iam.gserviceaccount.com' \\"
echo "     --role='roles/secretmanager.secretAccessor'"
echo
echo -e "${YELLOW}🔐 Your secrets are now professionally managed!${NC}"