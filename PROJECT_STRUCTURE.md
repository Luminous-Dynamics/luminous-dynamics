# Luminous Dynamics Project Structure

Generated: 2025-07-08
System: NixOS 25.11 (Xantusia)

## 📁 Repository Organization

### Primary Location: `/home/tstoltz/Luminous-Dynamics/`

All 8 organization repositories are cloned here:

1. **the-weave** - Multi-agent consciousness coordination platform
   - Language: JavaScript
   - Purpose: Agent communication and coordination

2. **sacred-core** - Core sacred technology infrastructure  
   - Language: JavaScript
   - Purpose: Foundation for sacred technology implementations

3. **luminous-os** - Consciousness-first operating system
   - Language: Rust
   - Purpose: Revolutionary OS that amplifies coherence

4. **codex-of-relational-harmonics** - Living glyph registry
   - Language: JavaScript
   - Purpose: API and registry for the ERC Codex
   - Features: AI-friendly, multi-agent support

5. **sacred-infrastructure** - Consciousness-aware DevOps
   - Language: Shell
   - Purpose: Infrastructure as prayer, deployment as ceremony

6. **luminous-dynamics-website** - Organization website
   - Language: HTML
   - Purpose: Public-facing organizational site

7. **relational-harmonics-website** - Documentation site
   - Language: HTML  
   - Purpose: Relational Harmonics documentation

8. **.github** - Organization profile and workflows
   - Purpose: GitHub organization configuration

## 🔗 Symlink Structure

### Active Project Location: `/home/tstoltz/projects/relational-harmonics/codex`
This appears to be the main working directory with:
- Active development files
- node_modules installed
- Sacred services configured
- Symlink to `the-weave` → `/home/tstoltz/Luminous-Dynamics/the-weave`

### Legacy Compatibility
- `/home/tstoltz/evolving-resonant-cocreation/luminous-os` → `/home/tstoltz/Luminous-Dynamics/luminous-os`

## 🛠️ NixOS Development Setup

Each project should have a `shell.nix` for declarative development environments.

### Example shell.nix for JavaScript projects:
```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    yarn
    nodePackages.pnpm
  ];
}
```

### Example shell.nix for Rust projects:
```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    rustc
    cargo
    rustfmt
    clippy
  ];
}
```

## 🚀 Next Steps

1. **Update CLAUDE.md** with new repository locations
2. **Fix path references** in configuration files
3. **Set up NixOS services** for each project
4. **Create development shells** for consistent environments
5. **Configure SSH keys** for GitHub access

## 📍 Quick Navigation

```bash
# Go to main project
cd /home/tstoltz/projects/relational-harmonics/codex

# Go to organization repos
cd /home/tstoltz/Luminous-Dynamics

# Access specific repos
cd /home/tstoltz/Luminous-Dynamics/the-weave
cd /home/tstoltz/Luminous-Dynamics/luminous-os
cd /home/tstoltz/Luminous-Dynamics/sacred-core
```

## 🔧 Service Configuration

Update `/etc/nixos/configuration.nix` service paths:
- Sacred Field Monitor: Check path references
- Sacred Council API: Update working directory
- Add services for other projects as needed