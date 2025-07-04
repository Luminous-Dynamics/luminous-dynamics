#!/bin/bash

# Authentication setup for Sacred System
# Configures GCP service accounts and API authentication

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ID="mycelix-network"
SERVICE_NAME="sacred-council-api"
REGION="us-central1"

echo -e "${BLUE}🔐 Sacred System Authentication Setup${NC}"
echo "======================================="

# Check if gcloud is authenticated
check_gcloud_auth() {
    echo -e "\n${BLUE}Checking gcloud authentication...${NC}"
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo -e "${RED}❌ No active gcloud authentication found${NC}"
        echo -e "\n${BLUE}Please authenticate with:${NC}"
        echo "  gcloud auth login"
        echo -e "\n${BLUE}Then set the project:${NC}"
        echo "  gcloud config set project $PROJECT_ID"
        exit 1
    fi
    
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✓ Authenticated as: $ACTIVE_ACCOUNT${NC}"
    
    # Check project
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
    if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
        echo -e "${BLUE}Setting project to $PROJECT_ID...${NC}"
        gcloud config set project $PROJECT_ID
    fi
    echo -e "${GREEN}✓ Project: $PROJECT_ID${NC}"
}

# Create service account for API
create_service_account() {
    echo -e "\n${BLUE}Setting up service account...${NC}"
    
    SA_NAME="sacred-council-sa"
    SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
    
    # Check if service account exists
    if gcloud iam service-accounts describe $SA_EMAIL &>/dev/null; then
        echo -e "${GREEN}✓ Service account already exists: $SA_EMAIL${NC}"
    else
        echo "Creating service account..."
        gcloud iam service-accounts create $SA_NAME \
            --display-name="Sacred Council Service Account" \
            --description="Service account for Sacred Council API authentication"
        echo -e "${GREEN}✓ Service account created${NC}"
    fi
    
    # Grant necessary roles
    echo -e "${BLUE}Granting IAM roles...${NC}"
    
    ROLES=(
        "roles/run.invoker"
        "roles/firebase.admin"
        "roles/firestore.user"
    )
    
    for ROLE in "${ROLES[@]}"; do
        echo "  Granting $ROLE..."
        gcloud projects add-iam-policy-binding $PROJECT_ID \
            --member="serviceAccount:$SA_EMAIL" \
            --role="$ROLE" \
            --quiet &>/dev/null || true
    done
    
    echo -e "${GREEN}✓ IAM roles configured${NC}"
}

# Generate authentication configuration
generate_auth_config() {
    echo -e "\n${BLUE}Generating authentication configuration...${NC}"
    
    mkdir -p production/auth
    
    # Create environment configuration
    cat > production/auth/auth-config.json << EOF
{
  "gcp": {
    "projectId": "$PROJECT_ID",
    "region": "$REGION",
    "serviceAccount": "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
  },
  "services": {
    "sacred-council-api": {
      "url": "https://sacred-council-api-310699330526.us-central1.run.app",
      "authRequired": true,
      "authMethod": "bearer-token"
    },
    "sacred-council": {
      "url": "https://sacred-council-310699330526.us-central1.run.app",
      "authRequired": false
    }
  },
  "firebase": {
    "authDomain": "$PROJECT_ID.firebaseapp.com",
    "databaseURL": "https://$PROJECT_ID.firebaseio.com",
    "storageBucket": "$PROJECT_ID.appspot.com"
  }
}
EOF

    echo -e "${GREEN}✓ Configuration saved to production/auth/auth-config.json${NC}"
}

# Create authentication helper script
create_auth_helper() {
    echo -e "\n${BLUE}Creating authentication helper...${NC}"
    
    cat > production/auth/get-token.sh << 'EOF'
#!/bin/bash

# Get authentication token for Sacred Council API

# Get identity token for current user
get_user_token() {
    gcloud auth print-identity-token 2>/dev/null
}

# Get access token for service account
get_service_token() {
    gcloud auth print-access-token 2>/dev/null
}

# Test authenticated API call
test_api_auth() {
    local TOKEN=$(get_user_token)
    local API_URL="https://sacred-council-api-310699330526.us-central1.run.app"
    
    echo "Testing API authentication..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        "$API_URL/health")
    
    if [ "$RESPONSE" = "200" ]; then
        echo "✓ Authentication successful!"
    else
        echo "❌ Authentication failed (HTTP $RESPONSE)"
        echo "Token (first 20 chars): ${TOKEN:0:20}..."
    fi
}

# Main
case "$1" in
    user)
        get_user_token
        ;;
    service)
        get_service_token
        ;;
    test)
        test_api_auth
        ;;
    *)
        echo "Usage: $0 {user|service|test}"
        echo "  user    - Get identity token for current user"
        echo "  service - Get access token for service account"
        echo "  test    - Test API authentication"
        ;;
esac
EOF

    chmod +x production/auth/get-token.sh
    echo -e "${GREEN}✓ Helper script created at production/auth/get-token.sh${NC}"
}

# Create secure WebSocket client
create_websocket_client() {
    echo -e "\n${BLUE}Creating secure WebSocket client...${NC}"
    
    cat > production/auth/secure-websocket-client.js << 'EOF'
#!/usr/bin/env node

/**
 * Secure WebSocket Client for Sacred Council API
 * Handles authentication and connection management
 */

const WebSocket = require('ws');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SecureWebSocketClient {
    constructor(url = 'wss://sacred-council-api-310699330526.us-central1.run.app') {
        this.url = url;
        this.ws = null;
        this.token = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async getAuthToken() {
        try {
            const { stdout } = await execAsync('gcloud auth print-identity-token');
            return stdout.trim();
        } catch (error) {
            console.error('Failed to get auth token:', error);
            throw error;
        }
    }

    async connect() {
        try {
            // Get fresh token
            this.token = await this.getAuthToken();
            console.log('🔐 Got authentication token');

            // Create WebSocket with auth headers
            this.ws = new WebSocket(this.url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            this.setupEventHandlers();

        } catch (error) {
            console.error('Connection failed:', error);
            this.handleReconnect();
        }
    }

    setupEventHandlers() {
        this.ws.on('open', () => {
            console.log('✅ Connected to Sacred Council API');
            this.reconnectAttempts = 0;
            
            // Send initial message
            this.send({
                type: 'register',
                agent: 'secure-client',
                capabilities: ['authenticated', 'sacred-aware']
            });
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('📨 Received:', message);
                
                // Handle different message types
                switch (message.type) {
                    case 'welcome':
                        console.log('🌟 Welcome message received');
                        break;
                    case 'field-update':
                        console.log(`🌀 Field coherence: ${message.coherence}%`);
                        break;
                    default:
                        console.log('Message:', message);
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        this.ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
        });

        this.ws.on('close', (code, reason) => {
            console.log(`🔌 Disconnected: ${code} - ${reason}`);
            this.handleReconnect();
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Reconnecting in ${delay/1000}s... (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('❌ Max reconnection attempts reached');
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.error('Cannot send - WebSocket not connected');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// CLI usage
if (require.main === module) {
    const client = new SecureWebSocketClient();
    
    console.log('🚀 Starting Secure WebSocket Client...');
    client.connect();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down...');
        client.close();
        process.exit();
    });

    // Keep process alive
    process.stdin.resume();
}

module.exports = SecureWebSocketClient;
EOF

    echo -e "${GREEN}✓ Secure WebSocket client created${NC}"
}

# Create authentication documentation
create_auth_docs() {
    echo -e "\n${BLUE}Creating authentication documentation...${NC}"
    
    cat > production/auth/README.md << 'EOF'
# 🔐 Sacred System Authentication

## Overview
This directory contains authentication configuration and tools for the Sacred System's cloud services.

## Quick Start

### 1. Authenticate with Google Cloud
```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project mycelix-network

# Verify authentication
./get-token.sh test
```

### 2. Get Authentication Token
```bash
# Get user identity token
TOKEN=$(./get-token.sh user)

# Use in API calls
curl -H "Authorization: Bearer $TOKEN" \
  https://sacred-council-api-310699330526.us-central1.run.app/health
```

### 3. Use Secure WebSocket Client
```bash
# Install dependencies
npm install ws

# Run secure client
node secure-websocket-client.js
```

## Authentication Methods

### Bearer Token (Recommended)
- Used for: API calls, WebSocket connections
- Token type: Google Identity Token
- Lifetime: 1 hour
- Refresh: Automatic via gcloud

### Service Account
- Used for: Server-to-server communication
- Stored in: GCP Secret Manager
- Access: Via application default credentials

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use short-lived tokens** - refresh frequently
3. **Validate tokens** on every request
4. **Log authentication events** for monitoring
5. **Use HTTPS/WSS** for all connections

## Troubleshooting

### "Permission Denied" Errors
1. Check you're authenticated: `gcloud auth list`
2. Verify project: `gcloud config get-value project`
3. Ensure roles are granted: Check IAM in Cloud Console

### Token Expiration
- Tokens expire after 1 hour
- Get fresh token: `./get-token.sh user`
- Client auto-refreshes on reconnect

### WebSocket Authentication Fails
1. Ensure token is included in headers
2. Check WebSocket URL uses `wss://` (not `ws://`)
3. Verify Cloud Run service allows WebSocket upgrade

## Files

- `auth-config.json` - Authentication configuration
- `get-token.sh` - Token retrieval helper
- `secure-websocket-client.js` - Authenticated WebSocket client
- `setup-auth.sh` - This setup script

## Related Documentation
- [GCP Authentication](https://cloud.google.com/docs/authentication)
- [Cloud Run IAM](https://cloud.google.com/run/docs/authenticating/overview)
- [Firebase Auth](https://firebase.google.com/docs/auth)
EOF

    echo -e "${GREEN}✓ Documentation created${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting authentication setup...${NC}\n"
    
    check_gcloud_auth
    create_service_account
    generate_auth_config
    create_auth_helper
    create_websocket_client
    create_auth_docs
    
    echo -e "\n${GREEN}✅ Authentication setup complete!${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Test authentication: ./production/auth/get-token.sh test"
    echo "2. Try secure WebSocket: node production/auth/secure-websocket-client.js"
    echo "3. Read docs: cat production/auth/README.md"
}

# Run main
main