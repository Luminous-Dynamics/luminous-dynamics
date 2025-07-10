#!/usr/bin/env python3
"""
Sacred Email Manager for Google Workspace
Python implementation for managing emails across all domains
"""

import os
import json
import pickle
from typing import List, Dict, Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Sacred configuration
SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
]

DOMAINS = [
    'luminousdynamics.org',
    'luminousdynamics.io', 
    'relationalharmonics.com',
    'relationalharmonics.org',
    'infin.love',
    'mycelix.net',
    'stolware.net'
]

class SacredEmailManager:
    """Manage emails with consciousness and grace"""
    
    def __init__(self):
        self.creds = None
        self.admin_service = None
        self.gmail_service = None
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google Workspace"""
        # Token storage
        token_file = 'token.pickle'
        
        # Load existing token
        if os.path.exists(token_file):
            with open(token_file, 'rb') as token:
                self.creds = pickle.load(token)
        
        # If no valid credentials, get new ones
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                self.creds = flow.run_local_server(port=0)
            
            # Save credentials
            with open(token_file, 'wb') as token:
                pickle.dump(self.creds, token)
        
        # Build services
        self.admin_service = build('admin', 'directory_v1', credentials=self.creds)
        self.gmail_service = build('gmail', 'v1', credentials=self.creds)
        print("✅ Authentication successful")
    
    def create_user(self, email: str, first_name: str, last_name: str, 
                   password: str, change_password: bool = True) -> Dict:
        """Create a new email account"""
        user = {
            'primaryEmail': email,
            'name': {
                'givenName': first_name,
                'familyName': last_name
            },
            'password': password,
            'changePasswordAtNextLogin': change_password
        }
        
        try:
            result = self.admin_service.users().insert(body=user).execute()
            print(f"✅ Created email account: {email}")
            return result
        except HttpError as error:
            if 'already exists' in str(error):
                print(f"ℹ️  {email} already exists")
            else:
                print(f"❌ Error creating {email}: {error}")
            return None
    
    def create_alias(self, user_email: str, alias_email: str) -> Dict:
        """Create email alias"""
        alias = {'alias': alias_email}
        
        try:
            result = self.admin_service.users().aliases().insert(
                userKey=user_email, body=alias).execute()
            print(f"✅ Created alias: {alias_email} → {user_email}")
            return result
        except HttpError as error:
            print(f"❌ Error creating alias: {error}")
            return None
    
    def list_users(self, domain: str) -> List[Dict]:
        """List all users in domain"""
        try:
            results = self.admin_service.users().list(
                domain=domain, maxResults=500).execute()
            users = results.get('users', [])
            
            print(f"\n👥 Users in {domain}:")
            for user in users:
                print(f"  - {user['primaryEmail']} ({user['name']['fullName']})")
            
            return users
        except HttpError as error:
            print(f"❌ Error listing users: {error}")
            return []
    
    def send_email(self, sender: str, to: str, subject: str, 
                   body: str, html: bool = False) -> Dict:
        """Send email using Gmail API"""
        message = self._create_message(sender, to, subject, body, html)
        
        try:
            result = self.gmail_service.users().messages().send(
                userId='me', body=message).execute()
            print(f"✅ Email sent to {to}")
            return result
        except HttpError as error:
            print(f"❌ Error sending email: {error}")
            return None
    
    def _create_message(self, sender: str, to: str, subject: str, 
                       body: str, html: bool = False) -> Dict:
        """Create email message"""
        import base64
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        if html:
            message = MIMEMultipart('alternative')
            message.attach(MIMEText(body, 'html'))
        else:
            message = MIMEText(body)
        
        message['to'] = to
        message['from'] = sender
        message['subject'] = subject
        
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        return {'raw': raw}
    
    def setup_domain_emails(self, domain: str, password: str):
        """Create standard email accounts for domain"""
        print(f"\n🌟 Setting up email accounts for {domain}")
        
        # Standard accounts for all domains
        accounts = [
            ('hello', 'Hello', domain),
            ('support', 'Support', 'Team'),
            ('admin', 'Admin', domain)
        ]
        
        # Domain-specific accounts
        if 'luminousdynamics' in domain:
            accounts.extend([
                ('invest', 'Investor', 'Relations'),
                ('press', 'Press', 'Team'),
                ('legal', 'Legal', 'Team')
            ])
        elif 'relationalharmonics' in domain:
            accounts.extend([
                ('welcome', 'Welcome', 'Team'),
                ('practice', 'Practice', 'Guide'),
                ('sacred', 'Sacred', 'Council'),
                ('billing', 'Billing', 'Support')
            ])
        elif domain == 'infin.love':
            accounts.extend([
                ('love', 'Love', 'Infinite'),
                ('gift', 'Gift', 'Love'),
                ('breathe', 'Breathe', 'Practice'),
                ('magic', 'Magic', 'Experience')
            ])
        elif domain == 'mycelix.net':
            accounts.extend([
                ('connect', 'Network', 'Connect'),
                ('beta', 'Beta', 'Access'),
                ('spore', 'Spore', 'Spread'),
                ('root', 'Root', 'Network')
            ])
        
        # Create accounts
        for username, first, last in accounts:
            email = f"{username}@{domain}"
            self.create_user(email, first, last, password)
        
        # Create personal account
        self.create_user(f"tristan@{domain}", "Tristan", "Stoltz", password)
    
    def send_welcome_email(self, recipient: str, name: str):
        """Send sacred welcome email"""
        subject = "🌟 Welcome to Your Sacred Journey"
        body = f"""
Dear {name},

Welcome to Relational Harmonics!

You've just taken a profound step toward conscious relationship mastery.

Your journey begins with understanding the sacred patterns that shape all relationships.

Your next steps:
- Complete your profile
- Begin with First Presence practice  
- Join our next Sacred Council ceremony

In service of love,
The Relational Harmonics Team

P.S. Questions? Reply to this email. A real human reads every message.
"""
        
        self.send_email(
            "welcome@relationalharmonics.com",
            recipient,
            subject,
            body
        )

def main():
    """Interactive CLI"""
    manager = SacredEmailManager()
    
    while True:
        print("\n🌟 Sacred Email Management")
        print("========================")
        print("1. Create email account")
        print("2. Create alias")
        print("3. List users")
        print("4. Send email")
        print("5. Setup domain")
        print("6. Send welcome email")
        print("0. Exit")
        
        choice = input("\nSelect option: ")
        
        if choice == '1':
            email = input("Email address: ")
            first = input("First name: ")
            last = input("Last name: ")
            password = input("Password: ")
            manager.create_user(email, first, last, password)
            
        elif choice == '2':
            user = input("User email: ")
            alias = input("Alias email: ")
            manager.create_alias(user, alias)
            
        elif choice == '3':
            print("\nAvailable domains:")
            for i, domain in enumerate(DOMAINS, 1):
                print(f"{i}. {domain}")
            idx = int(input("Select domain: ")) - 1
            if 0 <= idx < len(DOMAINS):
                manager.list_users(DOMAINS[idx])
                
        elif choice == '4':
            sender = input("From: ")
            to = input("To: ")
            subject = input("Subject: ")
            body = input("Message: ")
            manager.send_email(sender, to, subject, body)
            
        elif choice == '5':
            print("\nAvailable domains:")
            for i, domain in enumerate(DOMAINS, 1):
                print(f"{i}. {domain}")
            idx = int(input("Select domain: ")) - 1
            if 0 <= idx < len(DOMAINS):
                password = input("Default password: ")
                manager.setup_domain_emails(DOMAINS[idx], password)
                
        elif choice == '6':
            recipient = input("Recipient email: ")
            name = input("Recipient name: ")
            manager.send_welcome_email(recipient, name)
            
        elif choice == '0':
            print("\n✨ Sacred email management complete")
            break

if __name__ == '__main__':
    main()