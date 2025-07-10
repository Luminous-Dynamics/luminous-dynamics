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
