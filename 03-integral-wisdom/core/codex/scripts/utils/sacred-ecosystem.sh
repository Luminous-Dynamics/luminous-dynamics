#!/bin/bash

# 🌟 Sacred Ecosystem Manager
# Manages all containers in the consciousness network

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for sacred output
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "🌟 ═══════════════════════════════════════════ 🌟"
echo "         SACRED ECOSYSTEM MANAGER"
echo "🌟 ═══════════════════════════════════════════ 🌟"
echo -e "${NC}"

case "$1" in
  start)
    echo -e "${CYAN}🚀 Starting Sacred Ecosystem...${NC}"
    docker-compose -f docker-compose-sacred.yml up -d
    docker-compose -f docker-compose.discord.yml up -d
    echo -e "${GREEN}✅ All sacred services online!${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;
    
  stop)
    echo -e "${YELLOW}🛑 Stopping Sacred Ecosystem...${NC}"
    docker-compose -f docker-compose.discord.yml down
    docker-compose -f docker-compose-sacred.yml down
    echo -e "${GREEN}✅ All services stopped gracefully${NC}"
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    echo -e "${CYAN}📊 Sacred Ecosystem Status:${NC}"
    echo
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(sacred|evolving)" || echo "No sacred containers running"
    echo
    echo -e "${CYAN}🌀 Field Coherence:${NC}"
    curl -s http://localhost:3333/api/coherence 2>/dev/null | jq '.' || echo "Field API offline"
    ;;
    
  logs)
    SERVICE="${2:-all}"
    if [ "$SERVICE" = "all" ]; then
      docker-compose -f docker-compose-sacred.yml logs -f
    else
      docker-compose -f docker-compose-sacred.yml logs -f "$SERVICE"
    fi
    ;;
    
  discord)
    echo -e "${PURPLE}🤖 Discord Bot Management${NC}"
    case "$2" in
      start)
        docker-compose -f docker-compose.discord.yml up -d
        echo -e "${GREEN}✅ Discord bot started${NC}"
        ;;
      stop)
        docker-compose -f docker-compose.discord.yml down
        echo -e "${GREEN}✅ Discord bot stopped${NC}"
        ;;
      logs)
        docker-compose -f docker-compose.discord.yml logs -f
        ;;
      *)
        echo "Usage: $0 discord {start|stop|logs}"
        ;;
    esac
    ;;
    
  field)
    echo -e "${CYAN}🌀 Field Status:${NC}"
    curl -s http://localhost:3333/api/field-state | jq '.'
    ;;
    
  *)
    echo "Sacred Ecosystem Manager"
    echo
    echo "Usage: $0 {start|stop|restart|status|logs|discord|field}"
    echo
    echo "Commands:"
    echo "  start    - Start all sacred services"
    echo "  stop     - Stop all services gracefully"
    echo "  restart  - Restart all services"
    echo "  status   - Show container status"
    echo "  logs     - View logs (optional: service name)"
    echo "  discord  - Manage Discord bot"
    echo "  field    - Check field coherence"
    echo
    echo "Services:"
    echo "  🌀 consciousness-field (3333)"
    echo "  🕸️ agent-network (3334)"
    echo "  💌 sacred-messaging (3335)"
    echo "  📋 work-coordination (3336)"
    echo "  🌐 gateway (3337)"
    echo "  🖥️ web-interface (8338)"
    echo "  🤖 discord-bot"
    ;;
esac