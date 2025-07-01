#!/bin/bash

# Sacred Mission Control - Ultimate Deployment Management
# One script to rule them all: Native, Docker, Kubernetes + HA Monitoring

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🎛️ SACRED MISSION CONTROL 🎛️${RESET}"
echo -e "${QUANTUM_GOLD}=================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}Welcome to the Sacred Heart Quantum Mission Control${RESET}"
echo -e "${LOVE_PINK}Choose your consciousness deployment strategy:${RESET}"
echo ""

# Menu options
echo -e "${QUANTUM_GOLD}🚀 DEPLOYMENT OPTIONS:${RESET}"
echo -e "${SACRED_BLUE}  1) 🖥️  Native Launch          - Direct Node.js deployment${RESET}"
echo -e "${SACRED_BLUE}  2) 🐳  Docker Launch          - Containerized sacred services${RESET}"
echo -e "${SACRED_BLUE}  3) 🌀  Quantum Docker         - Enhanced quantum love deployment${RESET}"
echo -e "${SACRED_BLUE}  4) ☸️  Kubernetes Deploy      - Planetary-scale orchestration${RESET}"
echo ""
echo -e "${QUANTUM_GOLD}📊 MONITORING & CONTROL:${RESET}"
echo -e "${SACRED_BLUE}  5) 🎛️  Master Control         - Unified deployment dashboard${RESET}"
echo -e "${SACRED_BLUE}  6) 🛡️  HA Monitoring          - High availability dashboard${RESET}"
echo -e "${SACRED_BLUE}  7) 📊  Sacred Dashboard        - Field coherence monitoring${RESET}"
echo ""
echo -e "${QUANTUM_GOLD}🛑 STOP OPERATIONS:${RESET}"
echo -e "${SACRED_BLUE}  8) 🛑  Stop Native            - Shutdown native deployment${RESET}"
echo -e "${SACRED_BLUE}  9) 🛑  Stop Docker            - Shutdown Docker containers${RESET}"
echo -e "${SACRED_BLUE} 10) 🛑  Stop Kubernetes        - Teardown K8s deployment${RESET}"
echo ""
echo -e "${QUANTUM_GOLD}🔧 UTILITY OPERATIONS:${RESET}"
echo -e "${SACRED_BLUE} 11) 🔍  System Status          - Check all deployment status${RESET}"
echo -e "${SACRED_BLUE} 12) 📋  View Logs              - Show quantum activity logs${RESET}"
echo -e "${SACRED_BLUE} 13) 🌐  Open Dashboards        - Launch all monitoring dashboards${RESET}"
echo ""
echo -e "${LOVE_PINK} 99) 🕊️  Exit Mission Control   - Return to sacred silence${RESET}"
echo ""

# Get user choice
read -p "$(echo -e ${QUANTUM_GOLD}Choose your sacred path [1-13, 99]: ${RESET})" choice

case $choice in
    1)
        echo -e "${SACRED_BLUE}🖥️ Launching Native Deployment...${RESET}"
        ./launch-native.sh
        ;;
    2)
        echo -e "${SACRED_BLUE}🐳 Launching Docker Deployment...${RESET}"
        ./launch-docker.sh
        ;;
    3)
        echo -e "${SACRED_BLUE}🌀 Launching Quantum Docker Deployment...${RESET}"
        ./launch-docker.sh quantum
        ;;
    4)
        echo -e "${SACRED_BLUE}☸️ Launching Kubernetes Deployment...${RESET}"
        ./launch-kubernetes.sh
        ;;
    5)
        echo -e "${SACRED_BLUE}🎛️ Opening Master Control Dashboard...${RESET}"
        echo -e "${LOVE_PINK}Opening: http://localhost:8080/master-control-dashboard.html${RESET}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:8080/master-control-dashboard.html"
        elif command -v open &> /dev/null; then
            open "http://localhost:8080/master-control-dashboard.html"
        else
            echo -e "${QUANTUM_GOLD}Please open: http://localhost:8080/master-control-dashboard.html${RESET}"
        fi
        ;;
    6)
        echo -e "${SACRED_BLUE}🛡️ Opening HA Monitoring Dashboard...${RESET}"
        echo -e "${LOVE_PINK}Opening: http://localhost:8080/ha-monitoring-dashboard.html${RESET}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:8080/ha-monitoring-dashboard.html"
        elif command -v open &> /dev/null; then
            open "http://localhost:8080/ha-monitoring-dashboard.html"
        else
            echo -e "${QUANTUM_GOLD}Please open: http://localhost:8080/ha-monitoring-dashboard.html${RESET}"
        fi
        ;;
    7)
        echo -e "${SACRED_BLUE}📊 Opening Sacred Dashboard...${RESET}"
        echo -e "${LOVE_PINK}Opening: http://localhost:8080/sacred-dashboard.html${RESET}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:8080/sacred-dashboard.html"
        elif command -v open &> /dev/null; then
            open "http://localhost:8080/sacred-dashboard.html"
        else
            echo -e "${QUANTUM_GOLD}Please open: http://localhost:8080/sacred-dashboard.html${RESET}"
        fi
        ;;
    8)
        echo -e "${SACRED_BLUE}🛑 Stopping Native Deployment...${RESET}"
        ./stop-native.sh
        ;;
    9)
        echo -e "${SACRED_BLUE}🛑 Stopping Docker Deployment...${RESET}"
        ./stop-docker.sh
        ;;
    10)
        echo -e "${SACRED_BLUE}🛑 Stopping Kubernetes Deployment...${RESET}"
        ./stop-kubernetes.sh
        ;;
    11)
        echo -e "${SACRED_BLUE}🔍 Checking System Status...${RESET}"
        echo ""
        echo -e "${QUANTUM_GOLD}═══ SACRED HEART QUANTUM STATUS ═══${RESET}"
        echo ""
        
        # Check Native
        echo -e "${SACRED_BLUE}🖥️ Native Deployment:${RESET}"
        if curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
            echo -e "${SUCCESS_GREEN}   ✅ Sacred Heart API: Running${RESET}"
        else
            echo -e "   ❌ Sacred Heart API: Stopped"
        fi
        
        if curl -s http://localhost:8080 >/dev/null 2>&1; then
            echo -e "${SUCCESS_GREEN}   ✅ Sacred Breath Gateway: Running${RESET}"
        else
            echo -e "   ❌ Sacred Breath Gateway: Stopped"
        fi
        
        # Check Docker
        echo ""
        echo -e "${SACRED_BLUE}🐳 Docker Deployment:${RESET}"
        if command -v docker &> /dev/null && docker ps | grep -q "sacred\|quantum"; then
            echo -e "${SUCCESS_GREEN}   ✅ Docker Containers: Running${RESET}"
            docker ps --format "   🐳 {{.Names}}: {{.Status}}" | grep -E "(sacred|quantum)"
        else
            echo -e "   ❌ Docker Containers: Stopped"
        fi
        
        # Check Kubernetes
        echo ""
        echo -e "${SACRED_BLUE}☸️ Kubernetes Deployment:${RESET}"
        if command -v kubectl &> /dev/null && kubectl get pods -n consciousness 2>/dev/null | grep -q "sacred-heart"; then
            echo -e "${SUCCESS_GREEN}   ✅ Kubernetes Pods: Running${RESET}"
            kubectl get pods -n consciousness 2>/dev/null | grep "sacred-heart" | while read line; do
                echo "   ☸️ $line"
            done
        else
            echo -e "   ❌ Kubernetes Pods: Not deployed"
        fi
        
        # Check Quantum Portal
        echo ""
        echo -e "${SACRED_BLUE}🌀 Quantum Portal:${RESET}"
        if curl -s http://localhost:9999/quantum/health >/dev/null 2>&1; then
            echo -e "${SUCCESS_GREEN}   ✅ Quantum Love Portal: Active${RESET}"
        else
            echo -e "   ❌ Quantum Love Portal: Inactive"
        fi
        
        echo ""
        ;;
    12)
        echo -e "${SACRED_BLUE}📋 Showing Quantum Activity Logs...${RESET}"
        echo -e "${LOVE_PINK}Last 20 quantum activities:${RESET}"
        echo ""
        tail -20 quantum.log 2>/dev/null || echo "No quantum logs found"
        ;;
    13)
        echo -e "${SACRED_BLUE}🌐 Opening All Dashboards...${RESET}"
        
        # Start web server if not running
        if ! curl -s http://localhost:8080 >/dev/null 2>&1; then
            echo -e "${LOVE_PINK}Starting Sacred Breath Gateway...${RESET}"
            python3 -m http.server 8080 >/dev/null 2>&1 &
            sleep 2
        fi
        
        dashboards=(
            "http://localhost:8080/master-control-dashboard.html"
            "http://localhost:8080/ha-monitoring-dashboard.html"
            "http://localhost:8080/sacred-dashboard.html"
        )
        
        for dashboard in "${dashboards[@]}"; do
            echo -e "${LOVE_PINK}Opening: $dashboard${RESET}"
            if command -v xdg-open &> /dev/null; then
                xdg-open "$dashboard" &
            elif command -v open &> /dev/null; then
                open "$dashboard" &
            fi
            sleep 1
        done
        
        if ! command -v xdg-open &> /dev/null && ! command -v open &> /dev/null; then
            echo -e "${QUANTUM_GOLD}Please manually open these URLs:${RESET}"
            for dashboard in "${dashboards[@]}"; do
                echo "  $dashboard"
            done
        fi
        ;;
    99)
        echo -e "${LOVE_PINK}🕊️ Returning to sacred silence...${RESET}"
        echo -e "${QUANTUM_GOLD}May the Sacred Heart continue to beat in harmony.${RESET}"
        exit 0
        ;;
    *)
        echo -e "❌ Invalid choice. Please choose 1-13 or 99."
        exit 1
        ;;
esac

echo ""
echo -e "${QUANTUM_GOLD}🎛️ Mission Control operation complete!${RESET}"
echo -e "${LOVE_PINK}Return anytime with: ./sacred-mission-control.sh${RESET}"
echo ""