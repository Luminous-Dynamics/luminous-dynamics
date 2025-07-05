# 🔄 Repository Migration Guide

## Important Changes as of July 5, 2025

We've restructured our monolithic repository into three focused repositories for better development and collaboration.

### 🚨 Breaking Changes

#### 1. Directory Structure Changes
The following directories have been moved to separate repositories:

- `luminous-os/` → Now at https://github.com/Luminous-Dynamics/luminous-os
- `the-weave/` → Now at https://github.com/Luminous-Dynamics/the-weave

#### 2. Import Path Updates

**Old paths:**
```javascript
// ❌ These will no longer work
import { UnifiedAgentNetwork } from './the-weave/cli/unified-agent-network.cjs'
import { StillpointKernel } from './luminous-os/src/kernel/stillpoint.rs'
```

**New approach:**
```javascript
// ✅ Install from npm (coming soon)
import { UnifiedAgentNetwork } from '@luminous/the-weave'

// ✅ Or clone the repository separately
// git clone https://github.com/Luminous-Dynamics/the-weave
// git clone https://github.com/Luminous-Dynamics/luminous-os
```

### 📦 For Developers

#### Working with Multiple Repositories

1. **Clone all three repositories:**
```bash
mkdir luminous-ecosystem && cd luminous-ecosystem
git clone https://github.com/Luminous-Dynamics/codex-of-relational-harmonics.git
git clone https://github.com/Luminous-Dynamics/luminous-os.git
git clone https://github.com/Luminous-Dynamics/the-weave.git
```

2. **Set up development environment:**
```bash
# Main repository (Sacred Council Hub)
cd codex-of-relational-harmonics
npm install

# The Weave (Agent Coordination)
cd ../the-weave
npm install

# LuminousOS (Rust-based OS)
cd ../luminous-os
cargo build
```

### 🤖 For Claude Agents

#### Updated Agent Discovery
```bash
# Old method (no longer works)
# cd the-weave/cli
# node unified-agent-network.cjs join "Name" "Role"

# New method - Option 1: Use The Weave repository
git clone https://github.com/Luminous-Dynamics/the-weave.git
cd the-weave/cli
node unified-agent-network.cjs join "Name" "Role"

# New method - Option 2: Use npm package (coming soon)
npm install -g @luminous/the-weave
unified-agent-network join "Name" "Role"
```

### 🔗 Updated Links

| Component | Old Location | New Location |
|-----------|--------------|--------------|
| LuminousOS Docs | `/luminous-os/README.md` | https://github.com/Luminous-Dynamics/luminous-os |
| The Weave CLI | `/the-weave/cli/` | https://github.com/Luminous-Dynamics/the-weave/tree/main/cli |
| Sacred Council | `/web/sacred-council-hub.html` | Still in main repo |
| Agent Network | `/the-weave/core/network/` | https://github.com/Luminous-Dynamics/the-weave/tree/main/core/network |

### 🛠️ Common Issues and Solutions

#### Issue: "Cannot find module './the-weave/...'"
**Solution:** Clone The Weave repository separately or wait for npm package

#### Issue: "luminous-os directory not found"
**Solution:** Clone LuminousOS repository separately

#### Issue: Scripts failing due to missing paths
**Solution:** Update your scripts to use the new repository structure

### 📚 Documentation Updates

- **CLAUDE.md** - Being updated with new paths
- **README.md** - Now includes links to all repositories
- **Setup guides** - Will be updated to reflect new structure

### 🌟 Benefits of the New Structure

1. **Focused Development** - Each project has its own repository
2. **Better Performance** - Smaller, faster repositories
3. **Easier Contribution** - Contributors can focus on specific projects
4. **Independent Versioning** - Each project can have its own release cycle
5. **Cleaner Dependencies** - No cross-project dependency conflicts

### 📞 Need Help?

- Check the [configuration guide](./scripts/configure-new-repos.sh)
- Open an issue in the relevant repository
- Join our Discord/Matrix community
- Email: tristan@luminousdynamics.org

---

*"From unity to trinity, the evolution continues"* 🌟