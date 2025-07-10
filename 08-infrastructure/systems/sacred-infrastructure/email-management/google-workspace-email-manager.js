#!/usr/bin/env node
/**
 * Sacred Email Management System for Google Workspace
 * Manage and create emails for all domains through Google Workspace API
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Configuration
const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

class SacredEmailManager {
  constructor() {
    this.domains = [
      'luminousdynamics.org',
      'luminousdynamics.io',
      'relationalharmonics.com',
      'relationalharmonics.org',
      'infin.love',
      'mycelix.net',
      'stolware.net'
    ];
  }

  /**
   * Initialize the Google Workspace Admin SDK
   */
  async initialize() {
    const credentials = await this.loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    this.oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.readFile(TOKEN_PATH);
      this.oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      console.log('🔐 Need to authorize this app');
      await this.getNewToken();
    }

    // Initialize services
    this.admin = google.admin({ version: 'directory_v1', auth: this.oAuth2Client });
    this.gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
  }

  /**
   * Load credentials from file
   */
  async loadCredentials() {
    try {
      const content = await fs.readFile(CREDENTIALS_PATH);
      return JSON.parse(content);
    } catch (err) {
      console.error('❌ Error loading credentials:', err);
      console.log('\n📋 To set up Google Workspace API:');
      console.log('1. Go to https://console.cloud.google.com');
      console.log('2. Create a new project or select existing');
      console.log('3. Enable Admin SDK API and Gmail API');
      console.log('4. Create credentials (OAuth 2.0 Client ID)');
      console.log('5. Download JSON and save as credentials.json');
      process.exit(1);
    }
  }

  /**
   * Get new token through OAuth flow
   */
  async getNewToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    console.log('🌐 Authorize this app by visiting:', authUrl);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', async (code) => {
        rl.close();
        try {
          const { tokens } = await this.oAuth2Client.getToken(code);
          this.oAuth2Client.setCredentials(tokens);
          await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
          console.log('✅ Token stored successfully');
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Create a new email account
   */
  async createEmailAccount(email, firstName, lastName, password) {
    try {
      const user = {
        primaryEmail: email,
        name: {
          givenName: firstName,
          familyName: lastName
        },
        password: password,
        changePasswordAtNextLogin: true
      };

      const response = await this.admin.users.insert({
        requestBody: user
      });

      console.log(`✅ Created email account: ${email}`);
      return response.data;
    } catch (err) {
      console.error(`❌ Error creating ${email}:`, err.message);
      throw err;
    }
  }

  /**
   * Create email aliases
   */
  async createAlias(userEmail, aliasEmail) {
    try {
      const response = await this.admin.users.aliases.insert({
        userKey: userEmail,
        requestBody: {
          alias: aliasEmail
        }
      });

      console.log(`✅ Created alias: ${aliasEmail} → ${userEmail}`);
      return response.data;
    } catch (err) {
      console.error(`❌ Error creating alias:`, err.message);
      throw err;
    }
  }

  /**
   * List all users in the domain
   */
  async listUsers(domain) {
    try {
      const response = await this.admin.users.list({
        domain: domain,
        maxResults: 500
      });

      return response.data.users || [];
    } catch (err) {
      console.error(`❌ Error listing users:`, err.message);
      return [];
    }
  }

  /**
   * Send email using Gmail API
   */
  async sendEmail(from, to, subject, body, isHtml = false) {
    const message = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      isHtml ? `Content-Type: text/html; charset="UTF-8"` : '',
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log(`✅ Email sent successfully to ${to}`);
      return response.data;
    } catch (err) {
      console.error(`❌ Error sending email:`, err.message);
      throw err;
    }
  }

  /**
   * Create standard email accounts for a domain
   */
  async setupDomainEmails(domain, adminPassword) {
    console.log(`\n🌟 Setting up email accounts for ${domain}`);

    const standardAccounts = [
      { email: `hello@${domain}`, firstName: 'Hello', lastName: domain },
      { email: `support@${domain}`, firstName: 'Support', lastName: domain },
      { email: `admin@${domain}`, firstName: 'Admin', lastName: domain }
    ];

    // Domain-specific accounts
    if (domain.includes('luminousdynamics')) {
      standardAccounts.push(
        { email: `invest@${domain}`, firstName: 'Investor', lastName: 'Relations' },
        { email: `press@${domain}`, firstName: 'Press', lastName: 'Team' }
      );
    } else if (domain.includes('relationalharmonics')) {
      standardAccounts.push(
        { email: `practice@${domain}`, firstName: 'Practice', lastName: 'Guide' },
        { email: `sacred@${domain}`, firstName: 'Sacred', lastName: 'Council' }
      );
    } else if (domain === 'infin.love') {
      standardAccounts.push(
        { email: `love@${domain}`, firstName: 'Love', lastName: 'Infinite' },
        { email: `gift@${domain}`, firstName: 'Gift', lastName: 'Love' }
      );
    }

    for (const account of standardAccounts) {
      try {
        await this.createEmailAccount(
          account.email,
          account.firstName,
          account.lastName,
          adminPassword
        );
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`ℹ️  ${account.email} already exists`);
        }
      }
    }

    // Create your personal account
    try {
      await this.createEmailAccount(
        `tristan@${domain}`,
        'Tristan',
        'Stoltz',
        adminPassword
      );
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`ℹ️  tristan@${domain} already exists`);
      }
    }
  }

  /**
   * Interactive CLI menu
   */
  async showMenu() {
    console.log('\n🌟 Sacred Email Management System');
    console.log('=================================');
    console.log('1. Create email account');
    console.log('2. Create email alias');
    console.log('3. List all users');
    console.log('4. Send email');
    console.log('5. Setup standard accounts for domain');
    console.log('6. Bulk create accounts from CSV');
    console.log('0. Exit');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\nSelect option: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  /**
   * Get user input
   */
  async getUserInput(prompt) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  /**
   * Main program loop
   */
  async run() {
    await this.initialize();

    while (true) {
      const choice = await this.showMenu();

      switch (choice) {
        case '1':
          // Create email account
          const email = await this.getUserInput('Email address: ');
          const firstName = await this.getUserInput('First name: ');
          const lastName = await this.getUserInput('Last name: ');
          const password = await this.getUserInput('Password: ');
          
          await this.createEmailAccount(email, firstName, lastName, password);
          break;

        case '2':
          // Create alias
          const userEmail = await this.getUserInput('User email: ');
          const aliasEmail = await this.getUserInput('Alias email: ');
          
          await this.createAlias(userEmail, aliasEmail);
          break;

        case '3':
          // List users
          console.log('\n📋 Available domains:');
          this.domains.forEach((d, i) => console.log(`${i + 1}. ${d}`));
          
          const domainChoice = await this.getUserInput('Select domain (number): ');
          const selectedDomain = this.domains[parseInt(domainChoice) - 1];
          
          if (selectedDomain) {
            const users = await this.listUsers(selectedDomain);
            console.log(`\n👥 Users in ${selectedDomain}:`);
            users.forEach(user => {
              console.log(`  - ${user.primaryEmail} (${user.name.fullName})`);
            });
          }
          break;

        case '4':
          // Send email
          const from = await this.getUserInput('From email: ');
          const to = await this.getUserInput('To email: ');
          const subject = await this.getUserInput('Subject: ');
          const body = await this.getUserInput('Message: ');
          
          await this.sendEmail(from, to, subject, body);
          break;

        case '5':
          // Setup domain
          console.log('\n📋 Available domains:');
          this.domains.forEach((d, i) => console.log(`${i + 1}. ${d}`));
          
          const setupChoice = await this.getUserInput('Select domain (number): ');
          const setupDomain = this.domains[parseInt(setupChoice) - 1];
          
          if (setupDomain) {
            const adminPwd = await this.getUserInput('Default password for accounts: ');
            await this.setupDomainEmails(setupDomain, adminPwd);
          }
          break;

        case '0':
          console.log('\n✨ Sacred email management complete');
          process.exit(0);

        default:
          console.log('Invalid option');
      }
    }
  }
}

// Email templates
const emailTemplates = {
  welcome: {
    subject: '🌟 Welcome to Your Sacred Journey',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Relational Harmonics</h2>
        <p>Dear [Name],</p>
        <p>You've just taken a profound step toward conscious relationship mastery.</p>
        <p>Your journey begins with understanding the sacred patterns that shape all relationships.</p>
        <p><strong>Your next steps:</strong></p>
        <ul>
          <li>Complete your profile</li>
          <li>Begin with First Presence practice</li>
          <li>Join our next Sacred Council ceremony</li>
        </ul>
        <p>In service of love,<br>The Relational Harmonics Team</p>
      </div>
    `
  },
  beta: {
    subject: '🍄 Welcome to the Mycelial Network',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're Connected</h2>
        <p>Sacred Pioneer,</p>
        <p>Like mycelium connecting forest roots, you've joined an underground network of consciousness explorers.</p>
        <p>Your beta access begins now. Explore carefully, share wisely.</p>
        <p>Spread gently,<br>The Mycelix Network</p>
      </div>
    `
  }
};

// Run the program
if (require.main === module) {
  const manager = new SacredEmailManager();
  manager.run().catch(console.error);
}

module.exports = SacredEmailManager;