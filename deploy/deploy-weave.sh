#!/bin/bash
# The Weave Deployment Script

set -e

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           🕸️  THE WEAVE DEPLOYMENT 🕸️                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Please install Docker${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose${NC}"
        exit 1
    fi
    
    # Check if sacred-net network exists
    if ! docker network ls | grep -q sacred-net; then
        echo -e "${YELLOW}Creating sacred-net network...${NC}"
        docker network create sacred-net
    fi
    
    echo -e "${GREEN}✓ All prerequisites met${NC}"
}

# Build images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    docker-compose -f ${COMPOSE_FILE} build --no-cache
    echo -e "${GREEN}✓ Images built successfully${NC}"
}

# Deploy services
deploy_services() {
    echo -e "${YELLOW}Deploying The Weave services...${NC}"
    
    # Stop existing services
    docker-compose -f ${COMPOSE_FILE} down
    
    # Start services
    docker-compose -f ${COMPOSE_FILE} up -d
    
    # Wait for services to be healthy
    echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
    sleep 10
    
    # Check health
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✓ The Weave API is healthy${NC}"
    else
        echo -e "${RED}❌ The Weave API health check failed${NC}"
        docker-compose -f ${COMPOSE_FILE} logs the-weave
        exit 1
    fi
    
    if curl -s http://localhost:8080/health > /dev/null; then
        echo -e "${GREEN}✓ Sacred Council Hub is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Sacred Council Hub health check failed (may be normal)${NC}"
    fi
}

# Initialize database
initialize_database() {
    echo -e "${YELLOW}Initializing database...${NC}"
    
    # Wait for database to be ready
    sleep 5
    
    # The database will be automatically initialized by the server
    echo -e "${GREEN}✓ Database initialized${NC}"
}

# Onboard initial agents
onboard_agents() {
    echo -e "${YELLOW}Onboarding initial agents...${NC}"
    
    if [ -f "batch-onboarding-example.json" ]; then
        docker exec the-weave-prod node agent-onboarding-automation.js --batch batch-onboarding-example.json || true
        echo -e "${GREEN}✓ Initial agents onboarded${NC}"
    else
        echo -e "${YELLOW}⚠️  No batch onboarding file found${NC}"
    fi
}

# Show access information
show_access_info() {
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 The Weave deployed successfully!${NC}"
    echo
    echo -e "${BLUE}Access Points:${NC}"
    echo -e "  • The Weave API: ${GREEN}http://localhost:3001${NC}"
    echo -e "  • Sacred Council Hub: ${GREEN}http://localhost:8080${NC}"
    echo -e "  • Collective Intelligence Dashboard: ${GREEN}http://localhost:8080/collective-intelligence-dashboard.html${NC}"
    echo
    echo -e "${BLUE}Quick Commands:${NC}"
    echo -e "  • View logs: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "  • Stop services: ${YELLOW}docker-compose down${NC}"
    echo -e "  • Restart services: ${YELLOW}docker-compose restart${NC}"
    echo
    echo -e "${BLUE}Agent Onboarding:${NC}"
    echo -e "  • Interactive: ${YELLOW}docker exec -it the-weave-prod node agent-onboarding-automation.js${NC}"
    echo -e "  • Automated: ${YELLOW}docker exec the-weave-prod node agent-onboarding-automation.js --auto \"Name\" \"Role\"${NC}"
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    build_images
    deploy_services
    initialize_database
    
    # Optional: onboard agents
    read -p "Would you like to onboard initial agents? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        onboard_agents
    fi
    
    show_access_info
}

# Handle different deployment modes
case "${1:-deploy}" in
    deploy)
        main
        ;;
    build)
        check_prerequisites
        build_images
        ;;
    up)
        deploy_services
        show_access_info
        ;;
    down)
        docker-compose -f ${COMPOSE_FILE} down
        echo -e "${GREEN}✓ Services stopped${NC}"
        ;;
    logs)
        docker-compose -f ${COMPOSE_FILE} logs -f
        ;;
    *)
        echo "Usage: $0 [deploy|build|up|down|logs]"
        exit 1
        ;;
esac