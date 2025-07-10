#!/bin/bash
# Quick Email Operations for Google Workspace
# Sacred email management made simple

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EMAIL_MANAGER="$SCRIPT_DIR/google-workspace-email-manager.js"

# Function to display menu
show_menu() {
    echo -e "\n${PURPLE}📧 Sacred Email Quick Operations${RESET}"
    echo "================================="
    echo "1. Create standard emails for a domain"
    echo "2. Create personal email (tristan@domain)"
    echo "3. Send welcome email"
    echo "4. List all users in domain"
    echo "5. Create email alias"
    echo "6. Check email setup status"
    echo "0. Exit"
    echo ""
}

# Create standard emails for domain
create_standard_emails() {
    echo -e "${CYAN}Available domains:${RESET}"
    echo "1. luminousdynamics.org"
    echo "2. relationalharmonics.com"
    echo "3. infin.love"
    echo "4. mycelix.net"
    echo "5. stolware.net"
    
    read -p "Select domain (1-5): " domain_choice
    
    case $domain_choice in
        1) DOMAIN="luminousdynamics.org" ;;
        2) DOMAIN="relationalharmonics.com" ;;
        3) DOMAIN="infin.love" ;;
        4) DOMAIN="mycelix.net" ;;
        5) DOMAIN="stolware.net" ;;
        *) echo "Invalid choice"; return ;;
    esac
    
    echo -e "\n${YELLOW}Creating standard emails for $DOMAIN...${RESET}"
    
    # Standard accounts for all domains
    EMAILS=(
        "hello@$DOMAIN"
        "support@$DOMAIN"
        "admin@$DOMAIN"
    )
    
    # Domain-specific accounts
    if [[ $DOMAIN == *"luminousdynamics"* ]]; then
        EMAILS+=("invest@$DOMAIN" "press@$DOMAIN" "legal@$DOMAIN")
    elif [[ $DOMAIN == *"relationalharmonics"* ]]; then
        EMAILS+=("welcome@$DOMAIN" "practice@$DOMAIN" "sacred@$DOMAIN" "billing@$DOMAIN")
    elif [[ $DOMAIN == "infin.love" ]]; then
        EMAILS+=("love@$DOMAIN" "gift@$DOMAIN" "breathe@$DOMAIN" "magic@$DOMAIN")
    elif [[ $DOMAIN == "mycelix.net" ]]; then
        EMAILS+=("connect@$DOMAIN" "beta@$DOMAIN" "spore@$DOMAIN" "root@$DOMAIN")
    fi
    
    echo -e "${CYAN}Will create these emails:${RESET}"
    for email in "${EMAILS[@]}"; do
        echo "  - $email"
    done
    
    read -p "Continue? (y/n): " confirm
    if [[ $confirm == "y" ]]; then
        node "$EMAIL_MANAGER" setup-domain "$DOMAIN"
    fi
}

# Send welcome email
send_welcome_email() {
    read -p "Recipient email: " recipient
    read -p "Recipient name: " name
    
    SUBJECT="🌟 Welcome to Your Sacred Journey"
    BODY="Dear $name,

Welcome to Relational Harmonics!

You've just taken a profound step toward conscious relationship mastery.

Your journey begins with understanding the sacred patterns that shape all relationships.

Your next steps:
- Complete your profile at relationalharmonics.com/profile
- Begin with First Presence practice
- Join our next Sacred Council ceremony

In service of love,
The Relational Harmonics Team

P.S. Questions? Reply to this email. A real human reads every message."

    echo -e "\n${YELLOW}Sending welcome email to $recipient...${RESET}"
    node "$EMAIL_MANAGER" send "welcome@relationalharmonics.com" "$recipient" "$SUBJECT" "$BODY"
}

# Check email setup status
check_status() {
    echo -e "\n${CYAN}📊 Email Setup Status${RESET}"
    echo "====================="
    
    # Check if credentials exist
    if [ -f "$SCRIPT_DIR/credentials.json" ]; then
        echo -e "✅ Credentials file found"
    else
        echo -e "❌ Missing credentials.json"
        echo "   Run setup guide to create"
    fi
    
    # Check if token exists
    if [ -f "$SCRIPT_DIR/token.json" ]; then
        echo -e "✅ Authentication token found"
    else
        echo -e "⚠️  No authentication token"
        echo "   Will need to authenticate on first use"
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "✅ Node.js installed: $NODE_VERSION"
    else
        echo -e "❌ Node.js not installed"
    fi
    
    # Check dependencies
    if [ -f "$SCRIPT_DIR/package.json" ]; then
        echo -e "✅ Package.json exists"
        if [ -d "$SCRIPT_DIR/node_modules" ]; then
            echo -e "✅ Dependencies installed"
        else
            echo -e "⚠️  Dependencies not installed"
            echo "   Run: npm install"
        fi
    else
        echo -e "⚠️  No package.json"
        echo "   Run: npm init -y && npm install googleapis readline"
    fi
}

# Quick setup guide
show_setup_guide() {
    echo -e "\n${PURPLE}🚀 Quick Setup Guide${RESET}"
    echo "==================="
    echo "1. Create Google Workspace account at workspace.google.com"
    echo "2. Add your domains in Admin Console"
    echo "3. Enable Admin SDK and Gmail APIs in Cloud Console"
    echo "4. Create OAuth 2.0 credentials"
    echo "5. Download as credentials.json to this directory"
    echo "6. Run: npm install"
    echo "7. Use this script for quick operations!"
    echo ""
    echo -e "${YELLOW}Full guide: GOOGLE_WORKSPACE_EMAIL_SETUP.md${RESET}"
}

# Main loop
main() {
    # Check if email manager exists
    if [ ! -f "$EMAIL_MANAGER" ]; then
        echo -e "${RED}❌ Email manager not found!${RESET}"
        echo "Expected at: $EMAIL_MANAGER"
        exit 1
    fi
    
    while true; do
        show_menu
        read -p "Select option: " choice
        
        case $choice in
            1) create_standard_emails ;;
            2) 
                read -p "Domain: " domain
                node "$EMAIL_MANAGER" create "tristan@$domain" "Tristan" "Stoltz"
                ;;
            3) send_welcome_email ;;
            4)
                read -p "Domain: " domain
                node "$EMAIL_MANAGER" list "$domain"
                ;;
            5)
                read -p "User email: " user_email
                read -p "Alias email: " alias_email
                node "$EMAIL_MANAGER" alias "$user_email" "$alias_email"
                ;;
            6) check_status ;;
            0) 
                echo -e "\n${GREEN}✨ Sacred email operations complete${RESET}"
                exit 0
                ;;
            *) echo "Invalid option" ;;
        esac
    done
}

# Run main function
main