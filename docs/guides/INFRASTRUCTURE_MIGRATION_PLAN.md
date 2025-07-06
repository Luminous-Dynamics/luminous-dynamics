# 🚨 Infrastructure Migration Plan - 300+ Files!

## The Shocking Discovery
We have **300+ infrastructure files** scattered across the main repository! This includes:
- 52 deploy scripts
- 34 setup scripts  
- 60+ Docker files
- 27 cloud deployment files
- 149 other infrastructure scripts

## 🎯 Migration Strategy

### Phase 1A: Create Sacred Infrastructure Directory Structure
```bash
sacred-infrastructure/
├── deployment/
│   ├── scripts/        # All deploy-*.sh scripts
│   ├── docker/         # Dockerfiles and docker-compose
│   ├── kubernetes/     # K8s manifests
│   ├── cloud-run/      # Cloud Run specific
│   └── terraform/      # Infrastructure as Code
├── setup/
│   ├── scripts/        # All setup-*.sh scripts
│   ├── local/          # Local development setup
│   └── cloud/          # Cloud environment setup
├── monitoring/
│   ├── dashboards/     # Monitoring dashboards
│   └── alerts/         # Alert configurations
├── ceremonies/         # Sacred deployment ceremonies
└── docs/              # Infrastructure documentation
```

### Phase 1B: Smart Migration Order

1. **First Wave - Core Infrastructure** (Highest Priority)
   ```bash
   # Production deployment files
   - deploy-to-cloud-run.sh
   - docker-compose-sacred.yml
   - Dockerfile.cloudrun
   - cloudbuild.yaml
   ```

2. **Second Wave - Kubernetes**
   ```bash
   # All k8s/ directory contents
   - k8s/*.yaml → sacred-infrastructure/deployment/kubernetes/
   ```

3. **Third Wave - Setup Scripts**
   ```bash
   # Development environment setup
   - setup-*.sh → sacred-infrastructure/setup/scripts/
   ```

4. **Fourth Wave - Archive Duplicates**
   ```bash
   # .staging/infrastructure/ appears to be duplicates
   # Move to .archive/ for now
   ```

### Phase 1C: Critical Path Items

**Must Update After Moving:**
1. GitHub Actions workflows that reference scripts
2. Documentation that points to old locations
3. README files with setup instructions
4. Any hardcoded paths in scripts

### Phase 1D: Deduplication Strategy

We have massive duplication:
- 21 deploy scripts in root
- 21 MORE in .staging/infrastructure/
- Same pattern for setup scripts

**Action**: Compare and keep only the latest/best version

## 🛠️ Migration Script

```bash
#!/bin/bash
# migrate-infrastructure.sh

# Create target structure
echo "Creating Sacred Infrastructure directories..."
cd /home/tstoltz/sacred-infrastructure
mkdir -p deployment/{scripts,docker,kubernetes,cloud-run,terraform}
mkdir -p setup/{scripts,local,cloud}
mkdir -p monitoring/{dashboards,alerts}
mkdir -p ceremonies docs

# Move files with git to preserve history
cd /home/tstoltz/evolving-resonant-cocreation

# Deploy scripts
echo "Moving deployment scripts..."
git mv deploy-*.sh ../sacred-infrastructure/deployment/scripts/ 2>/dev/null || true

# Docker files
echo "Moving Docker files..."
git mv Dockerfile* ../sacred-infrastructure/deployment/docker/ 2>/dev/null || true
git mv docker-compose*.yml ../sacred-infrastructure/deployment/docker/ 2>/dev/null || true

# Kubernetes
echo "Moving Kubernetes manifests..."
git mv k8s ../sacred-infrastructure/deployment/kubernetes/ 2>/dev/null || true

# Setup scripts
echo "Moving setup scripts..."
git mv setup-*.sh ../sacred-infrastructure/setup/scripts/ 2>/dev/null || true

# Cloud Build
echo "Moving Cloud Build configs..."
git mv cloudbuild*.yaml ../sacred-infrastructure/deployment/cloud-run/ 2>/dev/null || true

echo "Infrastructure migration complete!"
```

## 📊 Expected Outcome

**Before**: 
- 300+ infrastructure files in main repo
- No organization
- Massive duplication
- Can't find anything

**After**:
- 0 infrastructure files in main repo
- Everything in sacred-infrastructure
- Clear organization
- Easy to find and maintain

## ⚠️ Risks & Mitigations

1. **Risk**: Breaking existing workflows
   **Mitigation**: Update all references after move

2. **Risk**: Losing important scripts
   **Mitigation**: Use git mv to preserve history

3. **Risk**: Missing dependencies
   **Mitigation**: Test key scripts after migration

## 🎯 Success Criteria

- [ ] All infrastructure files moved
- [ ] No duplicate files remain
- [ ] Sacred Infrastructure repo is useful
- [ ] Main repo under 100 files
- [ ] All scripts still work

---

*"From 300 scattered files to one sacred infrastructure"* 🏗️