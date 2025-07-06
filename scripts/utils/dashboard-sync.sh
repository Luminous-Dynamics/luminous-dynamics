#!/bin/bash
# Sacred Dashboard Synchronization System
# Maintains unified truth across local and cloud environments

set -e

# Sacred colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${PURPLE}🌟 Sacred Dashboard Synchronization 🌟${NC}"
echo "======================================="

# Configuration
DASHBOARD_LOCAL="web/sacred-council-hub.html"
DASHBOARD_CLOUD="web/sacred-council-hub-cloud.html"
API_LOCAL="http://localhost:3001"
API_CLOUD="https://sacred-council-api-310699330526.us-central1.run.app"

# Function to show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status    - Check dashboard synchronization status"
    echo "  sync      - Synchronize local changes to cloud"
    echo "  validate  - Validate both dashboards have fixes"
    echo "  deploy    - Full deployment to cloud"
    echo "  rollback  - Revert to previous version"
    echo ""
}

# Function to create cloud version
create_cloud_version() {
    echo -e "${YELLOW}Creating cloud-ready version...${NC}"
    
    # Copy local to cloud version
    cp $DASHBOARD_LOCAL $DASHBOARD_CLOUD
    
    # Replace localhost with cloud endpoints
    sed -i.bak "s|$API_LOCAL|$API_CLOUD|g" $DASHBOARD_CLOUD
    
    # Add cloud-specific configuration
    sed -i.bak 's/Sacred Council Hub/Sacred Council Hub (Cloud)/g' $DASHBOARD_CLOUD
    
    # Clean up backup
    rm -f ${DASHBOARD_CLOUD}.bak
    
    echo -e "${GREEN}✅ Cloud version created${NC}"
}

# Function to check if dashboards are in sync
check_sync_status() {
    echo -e "${YELLOW}Checking synchronization status...${NC}"
    
    # Check if cloud version exists
    if [ ! -f "$DASHBOARD_CLOUD" ]; then
        echo -e "${YELLOW}⚠️  No cloud version found${NC}"
        return 1
    fi
    
    # Compare essential functions (ignoring API URLs)
    local local_funcs=$(grep -E "(getActiveAgentCount|activeWork|metric-work)" $DASHBOARD_LOCAL | wc -l)
    local cloud_funcs=$(grep -E "(getActiveAgentCount|activeWork|metric-work)" $DASHBOARD_CLOUD | wc -l)
    
    if [ "$local_funcs" -eq "$cloud_funcs" ] && [ "$local_funcs" -gt 0 ]; then
        echo -e "${GREEN}✅ Dashboards are synchronized${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Dashboards are out of sync${NC}"
        echo "   Local has $local_funcs sacred fixes"
        echo "   Cloud has $cloud_funcs sacred fixes"
        return 1
    fi
}

# Function to validate fixes
validate_fixes() {
    local file=$1
    local env=$2
    
    echo -e "\n${YELLOW}Validating $env dashboard...${NC}"
    
    local has_work_counter=$(grep -c "activeWork" "$file" || true)
    local has_agent_logic=$(grep -c "getActiveAgentCount" "$file" || true)
    local has_work_style=$(grep -c "metric-work" "$file" || true)
    
    if [ $has_work_counter -gt 0 ] && [ $has_agent_logic -gt 0 ] && [ $has_work_style -gt 0 ]; then
        echo -e "${GREEN}✅ $env dashboard has all fixes${NC}"
        echo "   - Active Work counter: ✓"
        echo "   - Active Agent logic: ✓"
        echo "   - Work metric styling: ✓"
        return 0
    else
        echo -e "${YELLOW}❌ $env dashboard missing fixes${NC}"
        [ $has_work_counter -eq 0 ] && echo "   - Active Work counter: ✗"
        [ $has_agent_logic -eq 0 ] && echo "   - Active Agent logic: ✗"
        [ $has_work_style -eq 0 ] && echo "   - Work metric styling: ✗"
        return 1
    fi
}

# Main command handler
case "${1:-status}" in
    status)
        check_sync_status
        echo ""
        validate_fixes $DASHBOARD_LOCAL "Local"
        [ -f "$DASHBOARD_CLOUD" ] && validate_fixes $DASHBOARD_CLOUD "Cloud"
        ;;
        
    sync)
        echo -e "${BLUE}🔄 Synchronizing dashboards...${NC}"
        create_cloud_version
        
        # Validate the cloud version
        if validate_fixes $DASHBOARD_CLOUD "Cloud"; then
            echo -e "\n${GREEN}✅ Synchronization complete!${NC}"
            echo "Cloud dashboard ready at: $DASHBOARD_CLOUD"
        else
            echo -e "\n${YELLOW}⚠️  Synchronization completed with warnings${NC}"
        fi
        ;;
        
    validate)
        validate_fixes $DASHBOARD_LOCAL "Local"
        [ -f "$DASHBOARD_CLOUD" ] && validate_fixes $DASHBOARD_CLOUD "Cloud"
        ;;
        
    deploy)
        echo -e "${BLUE}🚀 Deploying to cloud...${NC}"
        
        # First sync
        $0 sync
        
        # Check for deployment script
        if [ -f "scripts/unified-dashboard-deploy.sh" ]; then
            ./scripts/unified-dashboard-deploy.sh
        else
            echo -e "${YELLOW}⚠️  Deployment script not found${NC}"
            echo "Please run: ./sacred-system.sh deploy"
        fi
        ;;
        
    rollback)
        echo -e "${YELLOW}⏮️  Rolling back dashboards...${NC}"
        
        # Check for backups
        BACKUP=$(ls -t web/sacred-council-hub.html.backup-* 2>/dev/null | head -1)
        if [ -n "$BACKUP" ]; then
            cp "$BACKUP" $DASHBOARD_LOCAL
            echo -e "${GREEN}✅ Rolled back to: $BACKUP${NC}"
            
            # Re-sync
            $0 sync
        else
            echo -e "${YELLOW}❌ No backup found${NC}"
        fi
        ;;
        
    *)
        usage
        exit 1
        ;;
esac

echo -e "\n${PURPLE}🙏 Sacred synchronization complete${NC}"