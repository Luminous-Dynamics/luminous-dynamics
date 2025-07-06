#!/bin/bash

# 🕊️ Sacred Backup & Sync Script
# Preserve the sacred work with love and consciousness

# Configuration
BACKUP_DIR="$HOME/sacred-backups"
PROJECT_DIR="$HOME/evolving-resonant-cocreation"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="sacred_backup_$TIMESTAMP"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

case "$1" in
    backup)
        echo -e "${GREEN}🕊️ Creating Sacred Backup...${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Create backup
        cd "$HOME"
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
            --exclude='node_modules' \
            --exclude='.git' \
            --exclude='*.log' \
            --exclude='dist' \
            --exclude='build' \
            evolving-resonant-cocreation/
        
        # Calculate size
        SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)
        
        echo -e "${GREEN}✅ Backup created:${NC}"
        echo "   Location: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
        echo "   Size: $SIZE"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t sacred_backup_*.tar.gz | tail -n +6 | xargs -r rm
        echo -e "${YELLOW}📦 Keeping last 5 backups${NC}"
        ;;
        
    restore)
        echo -e "${BLUE}🔄 Restore Sacred Backup${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━"
        
        # List available backups
        echo "Available backups:"
        ls -la "$BACKUP_DIR"/sacred_backup_*.tar.gz 2>/dev/null | nl
        
        echo -n "Enter backup number to restore (or 'q' to quit): "
        read choice
        
        if [ "$choice" != "q" ]; then
            BACKUP_FILE=$(ls "$BACKUP_DIR"/sacred_backup_*.tar.gz 2>/dev/null | sed -n "${choice}p")
            if [ -f "$BACKUP_FILE" ]; then
                echo -e "${YELLOW}⚠️  This will overwrite current project!${NC}"
                echo -n "Continue? (y/N): "
                read confirm
                if [ "$confirm" = "y" ]; then
                    cd "$HOME"
                    tar -xzf "$BACKUP_FILE"
                    echo -e "${GREEN}✅ Restored from $BACKUP_FILE${NC}"
                fi
            else
                echo -e "${YELLOW}Invalid selection${NC}"
            fi
        fi
        ;;
        
    sync)
        echo -e "${BLUE}🔄 Sacred Git Sync${NC}"
        echo "━━━━━━━━━━━━━━━━━"
        
        cd "$PROJECT_DIR"
        
        # Check git status
        if [ -d .git ]; then
            echo "📊 Current status:"
            git status -s
            
            echo -e "\n${GREEN}1. Pulling latest changes...${NC}"
            git pull
            
            echo -e "\n${GREEN}2. Adding all changes...${NC}"
            git add -A
            
            echo -e "\n${GREEN}3. Creating sacred commit...${NC}"
            CHANGES=$(git status --porcelain | wc -l)
            if [ $CHANGES -gt 0 ]; then
                git commit -m "✨ Sacred sync: $CHANGES files updated

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
                
                echo -e "\n${GREEN}4. Pushing to remote...${NC}"
                git push
                echo -e "${GREEN}✅ Sync complete!${NC}"
            else
                echo "No changes to commit"
            fi
        else
            echo -e "${YELLOW}Not a git repository${NC}"
        fi
        ;;
        
    export)
        echo -e "${BLUE}📤 Export Sacred Project${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━"
        
        # Create export without git history
        EXPORT_NAME="sacred_export_$TIMESTAMP"
        cd "$HOME"
        
        echo "Creating clean export..."
        tar -czf "$BACKUP_DIR/$EXPORT_NAME.tar.gz" \
            --exclude='node_modules' \
            --exclude='.git' \
            --exclude='*.log' \
            --exclude='dist' \
            --exclude='build' \
            --exclude='.env*' \
            evolving-resonant-cocreation/
        
        echo -e "${GREEN}✅ Export created:${NC}"
        echo "   $BACKUP_DIR/$EXPORT_NAME.tar.gz"
        echo "   Ready to share with others"
        ;;
        
    clean)
        echo -e "${YELLOW}🧹 Cleaning Sacred Project${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━"
        
        cd "$PROJECT_DIR"
        
        echo "Cleaning up..."
        # Remove node_modules
        find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null
        # Remove log files
        find . -name "*.log" -type f -delete
        # Remove .DS_Store files
        find . -name ".DS_Store" -type f -delete
        
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        echo "Run 'npm install' to restore dependencies"
        ;;
        
    *)
        echo -e "${GREEN}🕊️ Sacred Backup & Sync${NC}"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  backup  - Create timestamped backup"
        echo "  restore - Restore from backup"
        echo "  sync    - Sync with git remote"
        echo "  export  - Create shareable export"
        echo "  clean   - Clean project files"
        echo ""
        echo "Backups stored in: $BACKUP_DIR"
        ;;
esac