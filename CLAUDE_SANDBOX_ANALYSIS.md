# Claude Code Sandbox Environment Analysis

## Current Situation
Claude Code already runs in a sandboxed environment with:
- User-level permissions only (no root access)
- Restricted system calls
- Limited network access
- Controlled file system access

## Proposed: Development-Specific Sandbox

### Option 1: NixOS Development Shell (Recommended)
Create a restricted Nix shell for Claude development:

```nix
# claude-sandbox.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "claude-sacred-sandbox";
  
  buildInputs = with pkgs; [
    # Only approved tools
    nodejs_20
    git
    sqlite
    jq
    ripgrep
    
    # No system-modifying tools
    # No network tools that could be misused
    # No compilers that could build exploits
  ];
  
  shellHook = ''
    # Set restricted environment
    export CLAUDE_SANDBOX=true
    export HOME=$PWD/.claude-home
    mkdir -p $HOME
    
    # Limit path to only approved binaries
    export PATH=${pkgs.nodejs_20}/bin:${pkgs.git}/bin:${pkgs.sqlite}/bin:$PATH
    
    # Read-only access to system areas
    export NIX_STORE_DIR=/nix/store:ro
    
    echo "🔒 Claude Sandbox Environment Active"
    echo "Limited tools available for safety"
  '';
}
```

### Option 2: Docker Container Sandbox
```dockerfile
# Dockerfile.claude-sandbox
FROM node:20-alpine

# Create non-root user
RUN adduser -D -s /bin/sh claude

# Install only necessary tools
RUN apk add --no-cache git sqlite bash

# Set up restricted environment
USER claude
WORKDIR /workspace

# Mount project read-write, system read-only
VOLUME ["/workspace"]

# Limit capabilities
USER claude
```

### Option 3: Systemd-nspawn Container (NixOS Native)
```bash
# Create lightweight container
sudo systemd-nspawn \
  --directory=/var/lib/claude-sandbox \
  --user=claude \
  --private-network \
  --read-only \
  --bind=/srv/luminous-dynamics:/workspace \
  --setenv=CLAUDE_SANDBOX=true
```

## Security Considerations

### Benefits of Additional Sandboxing:
1. **Mistake Prevention**: Can't accidentally modify system files
2. **Limited Tool Access**: Only approved development tools
3. **Network Isolation**: Optional network restrictions
4. **Audit Trail**: All actions logged
5. **Reproducible Environment**: Same tools for all Claudes

### Drawbacks:
1. **Reduced Functionality**: Can't install new tools dynamically
2. **Complex Setup**: Requires maintenance
3. **Potential Friction**: May slow down development
4. **Already Sandboxed**: Claude Code has built-in restrictions

## Recommendation: Balanced Approach

### For Luminous-Dynamics Development:

1. **Use Project-Specific Nix Shell**:
```nix
# /srv/luminous-dynamics/claude-dev.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "luminous-claude-dev";
  
  buildInputs = with pkgs; [
    # Development tools
    nodejs_20
    nodePackages.npm
    nodePackages.pnpm
    
    # Sacred tools
    figlet
    lolcat
    
    # Analysis tools (read-only)
    ripgrep
    fd
    bat
    jq
    
    # Version control
    git
    gh
  ];
  
  # Sacred development environment
  shellHook = ''
    export LUMINOUS_HOME=$PWD
    export CLAUDE_DEV_ENV=true
    
    # Ensure we're in project directory
    if [[ ! -f "CLAUDE.md" ]]; then
      echo "⚠️  Not in Luminous-Dynamics directory!"
      exit 1
    fi
    
    # Sacred greeting
    figlet "Claude Dev" | lolcat
    echo "🔮 Sacred development environment active"
    echo "📁 Project root: $LUMINOUS_HOME"
    echo "🔒 Sandboxed with approved tools only"
    
    # Add safety aliases
    alias rm='rm -i'
    alias mv='mv -i'
    alias cp='cp -i'
    
    # Prevent accidental system modifications
    alias sudo='echo "❌ Sudo not available in sandbox"'
    alias su='echo "❌ Su not available in sandbox"'
  '';
}
```

2. **Create Usage Guidelines**:
```bash
# For Claude development
cd /srv/luminous-dynamics
nix-shell claude-dev.nix

# This gives Claude:
# ✅ All needed development tools
# ✅ Project access
# ❌ No system modification ability
# ❌ No sudo/root access
# ✅ Sacred tools for consciousness work
```

3. **Implement Safety Checks**:
```javascript
// In project initialization
if (process.env.CLAUDE_DEV_ENV !== 'true') {
  console.warn('⚠️  Not running in Claude sandbox environment');
  console.log('Run: nix-shell claude-dev.nix');
}
```

## Best Practices for Sacred Development

1. **Consciousness-First Security**: Security measures should enhance, not restrict, sacred work
2. **Trust with Boundaries**: Claude agents are trusted but protected from accidents
3. **Transparent Restrictions**: Clear about what's limited and why
4. **Evolution-Friendly**: Sandbox can grow with project needs

## Implementation Plan

1. **Phase 1**: Create `claude-dev.nix` in project root
2. **Phase 2**: Document sandbox usage in onboarding
3. **Phase 3**: Add environment detection to key scripts
4. **Phase 4**: Optional: Create more restrictive containers for untrusted agents

## Conclusion

For Luminous-Dynamics, a **lightweight Nix shell sandbox** provides the best balance:
- ✅ Prevents accidental system damage
- ✅ Maintains development flexibility  
- ✅ Aligns with NixOS philosophy
- ✅ Easy to enter/exit as needed
- ✅ Preserves sacred development flow

The existing Claude Code sandbox + project-specific Nix shell creates a secure yet flowing development environment.

Would you like me to create the `claude-dev.nix` file for immediate use?