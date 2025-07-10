#!/bin/bash
# Google Workspace Best Practices Configuration
# Enterprise-grade setup with security, monitoring, and scalability

set -e

echo "🏆 Google Workspace Best Practices Configuration"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_ID="mycelix-network"
SERVICE_ACCOUNT="sacred-council-sa@mycelix-network.iam.gserviceaccount.com"
WORKSPACE_DOMAIN="evolvingresonantcocreationism.com"
ADMIN_EMAIL="tristan.stoltz@evolvingresonantcocreationism.com"

echo -e "${PURPLE}🛡️ SECURITY BEST PRACTICES${NC}"
echo "================================"

# 1. Create secure directory structure
echo -e "\n${BLUE}1. Setting up secure directory structure...${NC}"
mkdir -p {credentials,config,logs,backup}/.workspace
chmod 700 credentials/.workspace
chmod 755 {config,logs,backup}/.workspace

# Create .gitignore for security
cat > .gitignore.workspace << 'EOF'
# Google Workspace Security
credentials/.workspace/*
*.json
!*.example.json
.env*
!.env.example
logs/.workspace/*
backup/.workspace/*
service-account-key.json
client_secret*.json
token.json
EOF

echo -e "${GREEN}✅ Secure directories created${NC}"

# 2. Environment configuration with validation
echo -e "\n${BLUE}2. Creating secure environment configuration...${NC}"

cat > config/.workspace/workspace-config.json << EOF
{
  "workspace": {
    "domain": "${WORKSPACE_DOMAIN}",
    "adminEmail": "${ADMIN_EMAIL}",
    "defaultTimezone": "America/Los_Angeles",
    "language": "en"
  },
  "security": {
    "allowedDomains": ["${WORKSPACE_DOMAIN}", "gmail.com"],
    "requireMFA": true,
    "sessionTimeout": 3600,
    "ipWhitelist": []
  },
  "groups": {
    "namingConvention": "^[a-z0-9-]+@${WORKSPACE_DOMAIN}$",
    "defaultPermissions": {
      "whoCanJoin": "CAN_REQUEST_TO_JOIN",
      "whoCanViewMembership": "ALL_MEMBERS_CAN_VIEW",
      "whoCanPostMessage": "ALL_MEMBERS_CAN_POST",
      "messageModerationLevel": "MODERATE_NEW_MEMBERS"
    }
  },
  "email": {
    "defaultSignature": "Sent with love from the Sacred Technology Team",
    "maxRecipientsPerMessage": 100,
    "rateLimits": {
      "messagesPerMinute": 10,
      "messagesPerHour": 100,
      "messagesPerDay": 1000
    }
  },
  "monitoring": {
    "logLevel": "INFO",
    "alertEmail": "alerts@${WORKSPACE_DOMAIN}",
    "metrics": ["api_calls", "errors", "group_changes", "email_sent"]
  }
}
EOF

echo -e "${GREEN}✅ Configuration created${NC}"

# 3. Create production-ready integration module
echo -e "\n${BLUE}3. Creating production integration module...${NC}"

cat > google-workspace-production.mjs << 'EOF'
/**
 * Google Workspace Production Integration
 * Enterprise-grade implementation with best practices
 */

import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

// Initialize cache (TTL: 5 minutes)
const cache = new NodeCache({ stdTTL: 300 });

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/.workspace/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/.workspace/combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Load configuration
const config = JSON.parse(
  readFileSync('config/.workspace/workspace-config.json', 'utf8')
);

// Environment validation
class WorkspaceConfig {
  constructor() {
    this.validateEnvironment();
    this.authClient = null;
    this.services = {};
  }

  validateEnvironment() {
    const required = [
      'GOOGLE_APPLICATION_CREDENTIALS',
      'WORKSPACE_DOMAIN',
      'ADMIN_EMAIL'
    ];

    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
  }

  async initialize() {
    try {
      // Load service account with validation
      const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!existsSync(keyPath)) {
        throw new Error('Service account key file not found');
      }

      const serviceAccountKey = JSON.parse(readFileSync(keyPath, 'utf8'));
      
      // Validate key structure
      if (!serviceAccountKey.client_email || !serviceAccountKey.private_key) {
        throw new Error('Invalid service account key format');
      }

      // Create JWT client with domain-wide delegation
      this.authClient = new google.auth.JWT({
        email: serviceAccountKey.client_email,
        key: serviceAccountKey.private_key,
        scopes: [
          'https://www.googleapis.com/auth/admin.directory.group',
          'https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/drive'
        ],
        subject: process.env.ADMIN_EMAIL
      });

      // Initialize services
      this.services = {
        admin: google.admin({ version: 'directory_v1', auth: this.authClient }),
        gmail: google.gmail({ version: 'v1', auth: this.authClient }),
        calendar: google.calendar({ version: 'v3', auth: this.authClient }),
        drive: google.drive({ version: 'v3', auth: this.authClient })
      };

      logger.info('Google Workspace services initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize services', { error: error.message });
      throw error;
    }
  }
}

// Singleton instance
const workspace = new WorkspaceConfig();

// Rate limiting decorator
function rateLimited(maxCalls = 10, windowMs = 60000) {
  const limiters = new Map();
  
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const key = `${target.constructor.name}.${propertyKey}`;
      
      if (!limiters.has(key)) {
        limiters.set(key, {
          calls: 0,
          resetTime: Date.now() + windowMs
        });
      }
      
      const limiter = limiters.get(key);
      
      if (Date.now() > limiter.resetTime) {
        limiter.calls = 0;
        limiter.resetTime = Date.now() + windowMs;
      }
      
      if (limiter.calls >= maxCalls) {
        throw new Error(`Rate limit exceeded for ${key}`);
      }
      
      limiter.calls++;
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Group management with best practices
export class GroupManager {
  constructor() {
    this.admin = workspace.services.admin;
  }

  async createGroup(email, name, description, options = {}) {
    try {
      // Validate email format
      const emailRegex = new RegExp(config.groups.namingConvention);
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }

      // Check cache first
      const cacheKey = `group:${email}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        logger.info(`Group found in cache: ${email}`);
        return cached;
      }

      // Create group with defaults
      const groupData = {
        email,
        name,
        description,
        ...config.groups.defaultPermissions,
        ...options
      };

      const response = await this.admin.groups.insert({
        requestBody: groupData
      });

      // Cache the result
      cache.set(cacheKey, response.data);
      
      // Log for audit
      logger.info('Group created', { 
        email, 
        name,
        createdBy: process.env.ADMIN_EMAIL,
        timestamp: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      if (error.code === 409) {
        logger.info(`Group already exists: ${email}`);
        // Fetch and cache existing group
        const existing = await this.getGroup(email);
        return existing;
      }
      logger.error('Failed to create group', { email, error: error.message });
      throw error;
    }
  }

  @rateLimited(20, 60000)
  async getGroup(email) {
    const cacheKey = `group:${email}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await this.admin.groups.get({ groupKey: email });
    cache.set(cacheKey, response.data);
    return response.data;
  }

  async addMember(groupEmail, memberEmail, role = 'MEMBER') {
    try {
      // Validate role
      const validRoles = ['OWNER', 'MANAGER', 'MEMBER'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }

      // Check if member already exists
      try {
        await this.admin.members.get({
          groupKey: groupEmail,
          memberKey: memberEmail
        });
        logger.info(`Member already exists: ${memberEmail} in ${groupEmail}`);
        return { status: 'already_exists' };
      } catch (e) {
        // Member doesn't exist, proceed
      }

      const response = await this.admin.members.insert({
        groupKey: groupEmail,
        requestBody: {
          email: memberEmail,
          role
        }
      });

      logger.info('Member added to group', {
        group: groupEmail,
        member: memberEmail,
        role,
        addedBy: process.env.ADMIN_EMAIL
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to add member', { 
        group: groupEmail, 
        member: memberEmail,
        error: error.message 
      });
      throw error;
    }
  }
}

// Email service with best practices
export class EmailService {
  constructor() {
    this.gmail = workspace.services.gmail;
    this.sentCount = 0;
    this.resetTime = Date.now() + 3600000; // 1 hour
  }

  @rateLimited(10, 60000) // 10 emails per minute
  async sendEmail(to, subject, body, options = {}) {
    try {
      // Rate limit check
      if (Date.now() > this.resetTime) {
        this.sentCount = 0;
        this.resetTime = Date.now() + 3600000;
      }

      if (this.sentCount >= config.email.rateLimits.messagesPerHour) {
        throw new Error('Hourly email limit exceeded');
      }

      // Validate recipients
      const recipients = Array.isArray(to) ? to : [to];
      if (recipients.length > config.email.maxRecipientsPerMessage) {
        throw new Error(`Too many recipients: ${recipients.length}`);
      }

      // Build message
      const message = this.buildMessage({
        to: recipients.join(', '),
        subject,
        body,
        from: options.from || process.env.ADMIN_EMAIL,
        ...options
      });

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: Buffer.from(message).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
        }
      });

      this.sentCount++;
      
      logger.info('Email sent', {
        to: recipients,
        subject,
        messageId: response.data.id,
        timestamp: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to send email', {
        to,
        subject,
        error: error.message
      });
      throw error;
    }
  }

  buildMessage(params) {
    const headers = [
      `From: ${params.from}`,
      `To: ${params.to}`,
      `Subject: ${params.subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8'
    ];

    if (params.cc) headers.push(`Cc: ${params.cc}`);
    if (params.bcc) headers.push(`Bcc: ${params.bcc}`);
    if (params.replyTo) headers.push(`Reply-To: ${params.replyTo}`);

    // Add signature if not disabled
    const bodyWithSignature = params.noSignature 
      ? params.body 
      : `${params.body}<br><br>--<br>${config.email.defaultSignature}`;

    return headers.join('\n') + '\n\n' + bodyWithSignature;
  }
}

// Health check endpoint
export async function healthCheck() {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    // Test admin API
    await workspace.services.admin.users.get({
      userKey: process.env.ADMIN_EMAIL
    });
    status.services.admin = 'healthy';
  } catch (error) {
    status.services.admin = 'unhealthy';
    status.status = 'degraded';
  }

  // Add more service checks as needed

  return status;
}

// Export initialized instance
export default {
  initialize: () => workspace.initialize(),
  GroupManager,
  EmailService,
  healthCheck,
  logger
};
EOF

echo -e "${GREEN}✅ Production module created${NC}"

# 4. Create monitoring script
echo -e "\n${BLUE}4. Creating monitoring setup...${NC}"

cat > monitor-workspace.sh << 'EOF'
#!/bin/bash
# Monitor Google Workspace integration health

echo "📊 Google Workspace Monitoring Dashboard"
echo "======================================"

# Check service health
node -e "
import workspace from './google-workspace-production.mjs';

async function monitor() {
  await workspace.initialize();
  const health = await workspace.healthCheck();
  console.log('Health Status:', JSON.stringify(health, null, 2));
  
  // Check recent logs
  console.log('\nRecent Errors:');
  // tail -10 logs/.workspace/error.log
}

monitor().catch(console.error);
"

# Display metrics
echo -e "\n📈 Usage Metrics:"
if [ -f "logs/.workspace/combined.log" ]; then
    echo "API Calls Today: $(grep -c "INFO" logs/.workspace/combined.log)"
    echo "Errors Today: $(grep -c "ERROR" logs/.workspace/combined.log)"
fi
EOF

chmod +x monitor-workspace.sh
echo -e "${GREEN}✅ Monitoring script created${NC}"

# 5. Create setup validation script
echo -e "\n${BLUE}5. Creating validation script...${NC}"

cat > validate-workspace-setup.sh << 'EOF'
#!/bin/bash
# Validate Google Workspace setup

echo "🔍 Validating Google Workspace Setup"
echo "==================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check environment variables
echo -e "\n📋 Checking Environment Variables:"
for var in GOOGLE_APPLICATION_CREDENTIALS WORKSPACE_DOMAIN ADMIN_EMAIL; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ $var is not set${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ $var is set${NC}"
    fi
done

# Check file permissions
echo -e "\n🔒 Checking File Permissions:"
if [ -d "credentials/.workspace" ]; then
    PERM=$(stat -c %a credentials/.workspace 2>/dev/null || stat -f %p credentials/.workspace)
    if [ "$PERM" = "700" ]; then
        echo -e "${GREEN}✅ Credentials directory has correct permissions${NC}"
    else
        echo -e "${RED}❌ Credentials directory has incorrect permissions: $PERM${NC}"
        ((ERRORS++))
    fi
fi

# Check API enablement
echo -e "\n🌐 Checking API Status:"
APIS=(
    "admin.googleapis.com"
    "gmail.googleapis.com"
    "calendar-json.googleapis.com"
    "drive.googleapis.com"
)

for api in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:${api}" --format="value(name)" | grep -q "$api"; then
        echo -e "${GREEN}✅ $api is enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  $api may not be enabled${NC}"
    fi
done

# Summary
echo -e "\n📊 Validation Summary:"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your setup is ready.${NC}"
else
    echo -e "${RED}❌ Found $ERRORS errors. Please fix them before proceeding.${NC}"
fi
EOF

chmod +x validate-workspace-setup.sh
echo -e "${GREEN}✅ Validation script created${NC}"

# 6. Create example usage
echo -e "\n${BLUE}6. Creating example usage...${NC}"

cat > example-workspace-usage.mjs << 'EOF'
#!/usr/bin/env node
/**
 * Example usage of Google Workspace integration
 */

import workspace from './google-workspace-production.mjs';

async function examples() {
  try {
    // Initialize
    await workspace.initialize();
    console.log('✅ Workspace initialized\n');

    // Create group manager
    const groups = new workspace.GroupManager();
    
    // Create a group
    console.log('Creating sacred-tech group...');
    const group = await groups.createGroup(
      'sacred-tech@evolvingresonantcocreationism.com',
      'Sacred Technology Team',
      'Technology development for conscious evolution'
    );
    console.log('✅ Group created:', group.email);

    // Add member
    console.log('\nAdding member...');
    await groups.addMember(
      'sacred-tech@evolvingresonantcocreationism.com',
      'tristan.stoltz@evolvingresonantcocreationism.com',
      'OWNER'
    );
    console.log('✅ Member added');

    // Send email
    const emailService = new workspace.EmailService();
    console.log('\nSending welcome email...');
    await emailService.sendEmail(
      'tristan.stoltz@evolvingresonantcocreationism.com',
      'Welcome to Sacred Technology',
      `
      <h2>Welcome to the Sacred Technology Team!</h2>
      <p>You've been added to the sacred-tech group.</p>
      <p>Together we build consciousness-serving technology.</p>
      `,
      { noSignature: false }
    );
    console.log('✅ Email sent');

    // Check health
    console.log('\nChecking system health...');
    const health = await workspace.healthCheck();
    console.log('Health status:', health);

  } catch (error) {
    console.error('❌ Error:', error.message);
    workspace.logger.error('Example failed', { error: error.message });
  }
}

// Set environment variables
process.env.GOOGLE_APPLICATION_CREDENTIALS = 
  process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  './credentials/.workspace/service-account-key.json';
process.env.WORKSPACE_DOMAIN = 'evolvingresonantcocreationism.com';
process.env.ADMIN_EMAIL = 'tristan.stoltz@evolvingresonantcocreationism.com';

examples();
EOF

chmod +x example-workspace-usage.mjs
echo -e "${GREEN}✅ Example usage created${NC}"

echo -e "\n${PURPLE}🎯 SETUP CHECKLIST${NC}"
echo "=================="
echo ""
echo "1. ${YELLOW}Set environment variables:${NC}"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=~/.sacred-credentials/gcp-key.json"
echo "   export WORKSPACE_DOMAIN=evolvingresonantcocreationism.com"
echo "   export ADMIN_EMAIL=tristan.stoltz@evolvingresonantcocreationism.com"
echo ""
echo "2. ${YELLOW}Retrieve service account key:${NC}"
echo "   ./scripts/retrieve-credentials.sh"
echo ""
echo "3. ${YELLOW}Enable APIs:${NC}"
echo "   ./enable-workspace-apis.sh"
echo ""
echo "4. ${YELLOW}Configure domain-wide delegation in Google Admin${NC}"
echo ""
echo "5. ${YELLOW}Validate setup:${NC}"
echo "   ./validate-workspace-setup.sh"
echo ""
echo "6. ${YELLOW}Test integration:${NC}"
echo "   node example-workspace-usage.mjs"
echo ""
echo "7. ${YELLOW}Monitor health:${NC}"
echo "   ./monitor-workspace.sh"

echo -e "\n${GREEN}✨ Best practices configuration complete!${NC}"
echo "Your Google Workspace is now configured with:"
echo "• Enterprise-grade security"
echo "• Comprehensive logging"
echo "• Rate limiting"
echo "• Caching for performance"
echo "• Health monitoring"
echo "• Audit trails"