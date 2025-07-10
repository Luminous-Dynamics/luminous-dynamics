#!/bin/bash
# Phase 1: Infrastructure Migration Script
# Moves ~300 infrastructure files to sacred-infrastructure repository

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${CYAN}🚀 Starting Infrastructure Migration - Phase 1${RESET}"
echo -e "${YELLOW}Moving ~300 files to sacred-infrastructure repository${RESET}\n"

# Paths
MAIN_REPO="/home/tstoltz/evolving-resonant-cocreation"
INFRA_REPO="/home/tstoltz/sacred-infrastructure"

# Create directory structure in sacred-infrastructure
echo -e "${CYAN}Creating directory structure...${RESET}"
cd "$INFRA_REPO"
mkdir -p deployment/{scripts,docker,kubernetes,cloud-run,terraform,ceremonies}
mkdir -p setup/{scripts,local,cloud,development}
mkdir -p monitoring/{dashboards,alerts,metrics}
mkdir -p docs/{guides,architecture,runbooks}
mkdir -p .archive/duplicates

# Go back to main repo for moving files
cd "$MAIN_REPO"

# Function to safely move files
move_files() {
    local pattern=$1
    local destination=$2
    local count=0
    
    for file in $pattern; do
        if [[ -f "$file" ]]; then
            # Skip if already moved
            if [[ -f "$INFRA_REPO/$destination/$(basename $file)" ]]; then
                echo -e "${YELLOW}Skipping (already exists): $file${RESET}"
            else
                cp "$file" "$INFRA_REPO/$destination/"
                git rm "$file" 2>/dev/null || rm "$file"
                ((count++))
            fi
        fi
    done
    
    echo -e "${GREEN}Moved $count files to $destination${RESET}"
}

# 1. Move deployment scripts
echo -e "\n${CYAN}Moving deployment scripts...${RESET}"
move_files "deploy-*.sh" "deployment/scripts"

# 2. Move Docker files
echo -e "\n${CYAN}Moving Docker files...${RESET}"
move_files "Dockerfile*" "deployment/docker"
move_files "docker-compose*.yml" "deployment/docker"
move_files ".dockerignore" "deployment/docker"

# 3. Move setup scripts
echo -e "\n${CYAN}Moving setup scripts...${RESET}"
move_files "setup-*.sh" "setup/scripts"

# 4. Move Cloud Build configs
echo -e "\n${CYAN}Moving Cloud Build configs...${RESET}"
move_files "cloudbuild*.yaml" "deployment/cloud-run"

# 5. Move Kubernetes manifests
echo -e "\n${CYAN}Moving Kubernetes manifests...${RESET}"
if [[ -d "k8s" ]]; then
    cp -r k8s/* "$INFRA_REPO/deployment/kubernetes/" 2>/dev/null || true
    git rm -r k8s 2>/dev/null || rm -rf k8s
    echo -e "${GREEN}Moved k8s directory${RESET}"
fi

# 6. Move infrastructure directory
echo -e "\n${CYAN}Moving infrastructure directory contents...${RESET}"
if [[ -d "infrastructure" ]]; then
    # Move Terraform files
    if [[ -d "infrastructure/terraform" ]]; then
        cp -r infrastructure/terraform/* "$INFRA_REPO/deployment/terraform/" 2>/dev/null || true
    fi
    # Move other infrastructure files
    cp -r infrastructure/* "$INFRA_REPO/docs/architecture/" 2>/dev/null || true
    git rm -r infrastructure 2>/dev/null || rm -rf infrastructure
    echo -e "${GREEN}Moved infrastructure directory${RESET}"
fi

# 7. Archive duplicates from .staging
echo -e "\n${CYAN}Archiving .staging/infrastructure duplicates...${RESET}"
if [[ -d ".staging/infrastructure" ]]; then
    cp -r .staging/infrastructure "$INFRA_REPO/.archive/duplicates/staging-infrastructure"
    git rm -r .staging/infrastructure 2>/dev/null || rm -rf .staging/infrastructure
    echo -e "${GREEN}Archived .staging/infrastructure${RESET}"
fi

# 8. Move deployment ceremonies
echo -e "\n${CYAN}Moving deployment ceremonies...${RESET}"
if [[ -d "deployment" ]]; then
    cp -r deployment/* "$INFRA_REPO/deployment/ceremonies/" 2>/dev/null || true
    git rm -r deployment 2>/dev/null || rm -rf deployment
    echo -e "${GREEN}Moved deployment ceremonies${RESET}"
fi

# 9. Create migration summary
echo -e "\n${CYAN}Creating migration summary...${RESET}"
cat > "$INFRA_REPO/MIGRATION_SUMMARY.md" << EOF
# Infrastructure Migration Summary
Date: $(date)

## Files Migrated from evolving-resonant-cocreation

### Deployment Scripts
- Location: deployment/scripts/
- Files: All deploy-*.sh scripts

### Docker Configuration  
- Location: deployment/docker/
- Files: Dockerfiles, docker-compose files

### Kubernetes Manifests
- Location: deployment/kubernetes/
- Files: All k8s YAML manifests

### Setup Scripts
- Location: setup/scripts/
- Files: All setup-*.sh scripts

### Cloud Build
- Location: deployment/cloud-run/
- Files: cloudbuild*.yaml

### Archived Duplicates
- Location: .archive/duplicates/
- Files: Duplicate scripts from .staging

## Next Steps
1. Update all documentation to reflect new paths
2. Test critical deployment scripts
3. Update CI/CD pipelines
4. Remove any remaining duplicates
EOF

# Commit changes in main repo
echo -e "\n${CYAN}Committing changes in main repository...${RESET}"
cd "$MAIN_REPO"
git add -A
git commit -m "🚛 Phase 1: Migrate infrastructure files to sacred-infrastructure repo" || true

# Commit new files in infrastructure repo
echo -e "\n${CYAN}Committing new files in sacred-infrastructure...${RESET}"
cd "$INFRA_REPO"
git add -A
git commit -m "📦 Receive infrastructure files from main repository migration" || true

# Final summary
echo -e "\n${GREEN}✅ Phase 1 Migration Complete!${RESET}"
echo -e "${CYAN}Summary:${RESET}"
echo "- Infrastructure files moved to sacred-infrastructure"
echo "- Directory structure created"
echo "- Duplicates archived"
echo ""
echo -e "${YELLOW}Next Steps:${RESET}"
echo "1. Push both repositories to GitHub"
echo "2. Update documentation with new paths"
echo "3. Test critical scripts still work"
echo "4. Proceed to Phase 2: Main repo deep clean"