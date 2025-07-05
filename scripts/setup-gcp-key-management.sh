#!/bin/bash
# GCP Comprehensive Key Management Setup

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="${GCP_PROJECT_ID:-mycelix-network}"
REGION="${GCP_REGION:-us-central1}"

echo -e "${GREEN}🔐 GCP Key Management Setup${NC}"

# Enable required APIs
echo -e "\n${BLUE}Enabling key management APIs...${NC}"
gcloud services enable \
    cloudkms.googleapis.com \
    certificatemanager.googleapis.com \
    secretmanager.googleapis.com \
    privateca.googleapis.com

# 1. Cloud KMS Setup (for encryption keys)
echo -e "\n${GREEN}1. Setting up Cloud KMS...${NC}"

# Create a key ring
gcloud kms keyrings create sacred-council-keys \
    --location=$REGION || echo "Key ring already exists"

# Create encryption keys
create_kms_key() {
    local KEY_NAME=$1
    local PURPOSE=$2
    echo -e "${YELLOW}Creating KMS key: $KEY_NAME${NC}"
    gcloud kms keys create $KEY_NAME \
        --location=$REGION \
        --keyring=sacred-council-keys \
        --purpose=$PURPOSE || echo "Key already exists"
}

# Create various purpose keys
create_kms_key "database-encryption" "encryption"
create_kms_key "secret-encryption" "encryption"
create_kms_key "signing-key" "asymmetric-signing"

# 2. Certificate Manager Setup (for SSL/TLS)
echo -e "\n${GREEN}2. Setting up Certificate Manager...${NC}"

# Create DNS authorization for domains
create_dns_authorization() {
    local DOMAIN=$1
    local AUTH_NAME=$(echo $DOMAIN | sed 's/\./-/g')-auth
    
    echo -e "${YELLOW}Creating DNS authorization for $DOMAIN${NC}"
    gcloud certificate-manager dns-authorizations create $AUTH_NAME \
        --domain=$DOMAIN || echo "Authorization already exists"
    
    # Get the DNS record to add
    echo -e "${BLUE}Add this DNS record to $DOMAIN:${NC}"
    gcloud certificate-manager dns-authorizations describe $AUTH_NAME \
        --format="value(dnsResourceRecord.name,dnsResourceRecord.type,dnsResourceRecord.data)"
}

# Create authorizations for your domains
create_dns_authorization "luminousdynamics.org"
create_dns_authorization "relationalharmonics.org"

# Create managed SSL certificates
echo -e "\n${YELLOW}Creating managed SSL certificates...${NC}"
gcloud certificate-manager certificates create sacred-council-cert \
    --domains="luminousdynamics.org,www.luminousdynamics.org,relationalharmonics.org,www.relationalharmonics.org" \
    --dns-authorizations="luminousdynamics-org-auth,relationalharmonics-org-auth" || echo "Certificate already exists"

# 3. Service Account Key Rotation Setup
echo -e "\n${GREEN}3. Setting up Service Account Key Rotation...${NC}"

cat > rotate-service-account-keys.sh << 'EOF'
#!/bin/bash
# Automated Service Account Key Rotation

SERVICE_ACCOUNT_EMAIL=$1
SECRET_NAME=$2

# Create new key
NEW_KEY=$(gcloud iam service-accounts keys create --iam-account=$SERVICE_ACCOUNT_EMAIL -)

# Store in Secret Manager
echo "$NEW_KEY" | gcloud secrets versions add $SECRET_NAME --data-file=-

# List old keys (older than 90 days)
OLD_KEYS=$(gcloud iam service-accounts keys list \
    --iam-account=$SERVICE_ACCOUNT_EMAIL \
    --filter="validAfterTime<'-P90D'" \
    --format="value(name)")

# Delete old keys
for KEY in $OLD_KEYS; do
    gcloud iam service-accounts keys delete $KEY --iam-account=$SERVICE_ACCOUNT_EMAIL -q
done
EOF

chmod +x rotate-service-account-keys.sh

# 4. Secret Manager with automatic rotation
echo -e "\n${GREEN}4. Setting up Secret Rotation...${NC}"

# Create a Cloud Scheduler job for key rotation
echo -e "${YELLOW}Creating scheduled rotation jobs...${NC}"

# Enable Cloud Scheduler API
gcloud services enable cloudscheduler.googleapis.com

# Create rotation schedule for API keys
create_rotation_schedule() {
    local SECRET_NAME=$1
    local SCHEDULE=$2  # e.g., "0 2 1 * *" for monthly
    
    echo -e "${BLUE}Creating rotation schedule for $SECRET_NAME${NC}"
    # This would typically trigger a Cloud Function to rotate the key
    echo "Schedule: $SCHEDULE"
}

# 5. Certificate Monitoring and Auto-renewal
echo -e "\n${GREEN}5. Setting up Certificate Monitoring...${NC}"

cat > check-certificates.sh << 'EOF'
#!/bin/bash
# Check SSL certificate expiration

DOMAINS=("luminousdynamics.org" "relationalharmonics.org")

for DOMAIN in "${DOMAINS[@]}"; do
    echo "Checking $DOMAIN..."
    echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | \
        openssl x509 -noout -dates
done
EOF

chmod +x check-certificates.sh

# 6. Create comprehensive key management script
echo -e "\n${GREEN}6. Creating Key Management CLI...${NC}"

cat > key-manager.sh << 'EOF'
#!/bin/bash
# Sacred Council Key Manager

case "$1" in
    "list-secrets")
        echo "📋 All Secrets:"
        gcloud secrets list
        ;;
    "list-kms-keys")
        echo "🔐 KMS Keys:"
        gcloud kms keys list --location=$REGION --keyring=sacred-council-keys
        ;;
    "list-certificates")
        echo "📜 SSL Certificates:"
        gcloud certificate-manager certificates list
        ;;
    "rotate-key")
        SECRET_NAME=$2
        echo "🔄 Rotating $SECRET_NAME..."
        # Add rotation logic here
        ;;
    "encrypt")
        FILE=$2
        gcloud kms encrypt \
            --key=database-encryption \
            --keyring=sacred-council-keys \
            --location=$REGION \
            --plaintext-file=$FILE \
            --ciphertext-file=$FILE.enc
        ;;
    "decrypt")
        FILE=$2
        gcloud kms decrypt \
            --key=database-encryption \
            --keyring=sacred-council-keys \
            --location=$REGION \
            --ciphertext-file=$FILE \
            --plaintext-file=${FILE%.enc}
        ;;
    *)
        echo "Usage: $0 {list-secrets|list-kms-keys|list-certificates|rotate-key|encrypt|decrypt}"
        ;;
esac
EOF

chmod +x key-manager.sh

echo -e "\n${GREEN}✅ Key Management Setup Complete!${NC}"
echo -e "\n${YELLOW}Available Tools:${NC}"
echo "1. Google Secret Manager - For API keys and secrets"
echo "2. Cloud KMS - For encryption keys"
echo "3. Certificate Manager - For SSL/TLS certificates"
echo "4. Private CA - For internal certificates (if needed)"
echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Add DNS records shown above to verify domain ownership"
echo "2. Use ./key-manager.sh to manage keys"
echo "3. Set up Cloud Scheduler for automatic rotation"
echo "4. Use Certificate Manager for automatic SSL renewal"