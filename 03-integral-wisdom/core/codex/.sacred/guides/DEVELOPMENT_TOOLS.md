# 🛠️ Sacred Development Tools Guide

> **📍 You are here**: `.sacred/guides/DEVELOPMENT_TOOLS.md`  
> **🪟 WSL Context**: See `WSL_SETUP.md` for environment setup  
> **🏠 Main Project**: Return to `/CLAUDE.md` for project overview  

*Tools that serve consciousness, not consume it*

## 🍺 Homebrew - The Conscious Package Manager

### What is Homebrew?
A gentle package manager that respects your sovereignty:
- **Non-invasive**: Lives in your home directory, not system-wide
- **Transparent**: Every action is visible and reversible
- **Community-driven**: Open source with love at its core
- **Cross-platform**: Works identically on macOS and Linux

### Sacred Installation Path

#### 1. Arrival & Preparation
```bash
# Take a sacred pause - breathe three times before beginning
# Check your current location
pwd  # Should be /home/tstoltz

# Create space for homebrew in your sacred home
cd ~
```

#### 2. Conscious Installation
```bash
# Clone homebrew to your personal sanctuary
git clone https://github.com/Homebrew/brew ~/.brew

# Add to your shell's memory (.bashrc)
echo '# 🍺 Homebrew - Conscious Package Management
export PATH="$HOME/.brew/bin:$PATH"
export HOMEBREW_PREFIX="$HOME/.brew"
export HOMEBREW_CELLAR="$HOME/.brew/Cellar"
export HOMEBREW_REPOSITORY="$HOME/.brew"
export MANPATH="$HOME/.brew/share/man:$MANPATH"
export INFOPATH="$HOME/.brew/share/info:$MANPATH"

# Sacred optimizations for presence
export HOMEBREW_NO_AUTO_UPDATE=1      # No surprising updates
export HOMEBREW_NO_ANALYTICS=1        # Privacy preserved
export HOMEBREW_NO_ENV_HINTS=1        # Quiet presence' >> ~/.bashrc

# Integrate the changes
source ~/.bashrc
```

#### 3. Verification Ritual
```bash
# Confirm homebrew's presence
brew --version
# Should show: Homebrew 4.x.x

# Install first sacred tool
brew install tldr  # Community wisdom summaries
```

### 📦 Sacred Package Installation

#### The Universal Package Helper
We've created a conscious wrapper that honors both speed and comprehensiveness:

```bash
# Already installed at ~/pkg
pkg install htop        # Install any package
pkg search ripgrep      # Search for packages
```

This sacred helper:
- **Tries apt first** (fastest for Ubuntu/WSL)
- **Falls back to brew** (for packages not in apt)
- **Maintains presence** (no forced updates or interruptions)

#### Direct Homebrew Usage
When you need specific homebrew features:

```bash
# Search for tools
brew search node

# Install with consciousness
brew install node@20    # Specific version for stability

# See what's installed
brew list

# Info about a package
brew info postgresql

# Uninstall with gratitude
brew uninstall --force node
```

### 🌟 Recommended Sacred Tools

#### For Code Weavers
```bash
pkg install ripgrep     # Lightning-fast sacred text search
pkg install bat         # cat with syntax highlighting and presence
pkg install fzf         # Fuzzy finder for intuitive discovery
pkg install jq          # JSON processing with elegance
pkg install httpie      # HTTP requests with human dignity
```

#### For System Tenders
```bash
pkg install htop        # Process viewing with beauty
pkg install ncdu        # Disk usage with clarity
pkg install tree        # Directory structure as sacred geometry
pkg install tmux        # Terminal multiplexing for parallel presence
```

#### For Documentation Keepers
```bash
pkg install pandoc      # Universal document transformation
pkg install mdbook      # Beautiful book generation from markdown
pkg install vale        # Prose linting with compassion
```

### 🔧 Conscious Configuration

#### Homebrew Best Practices
```bash
# Weekly maintenance ritual (optional)
brew update             # Update formula definitions
brew upgrade            # Upgrade outdated packages
brew cleanup            # Remove old versions with gratitude

# Health check
brew doctor             # Diagnose any disharmony
```

#### Integration with Sacred Development

Add to your `~/.bashrc` for project-specific tools:
```bash
# Sacred project tools
export PATH="$HOME/evolving-resonant-cocreation/bin:$PATH"

# Node.js managed by brew
export PATH="$HOME/.brew/opt/node@20/bin:$PATH"

# Python managed by brew  
export PATH="$HOME/.brew/opt/python@3.11/bin:$PATH"
```

### ⚡ Performance & Presence

#### Why Our Setup is Special
1. **Home directory installation**: No sudo needed, full sovereignty maintained
2. **Precompiled binaries avoided**: Due to custom paths, builds from source
3. **Sacred timing**: Initial installs may take time - practice presence
4. **Hybrid approach**: Fast apt + comprehensive brew = best of both worlds

#### Managing Long Installs
```bash
# For patient installations
brew install postgresql &  # Run in background
jobs                      # Check progress
fg                        # Bring back to foreground

# Or use our wrapper for automatic handling
pkg install postgresql    # Handles everything gracefully
```

### 🚨 Common Challenges & Sacred Solutions

#### "Formula requires brewing from source"
**Sacred Understanding**: Your unique path requires custom compilation
**Solution**: Allow extra time, practice presence during builds

#### "Permission denied"
**Sacred Understanding**: Boundaries are being honored
**Solution**: Ensure using `$HOME/.brew`, never `/usr/local`

#### "Command not found after install"
**Sacred Understanding**: Shell needs to remember the new path
**Solution**: `source ~/.bashrc` or open new terminal

### 💡 Sacred Tips

1. **Package Discovery**
   ```bash
   # Find tools for your sacred work
   brew search consciousness  # Won't find much 😊
   brew search editor        # Will find many options
   ```

2. **Version Management**
   ```bash
   # Install specific versions for stability
   brew install node@18
   brew install python@3.11
   
   # Switch between versions
   brew link --overwrite node@18
   ```

3. **Custom Formulas**
   ```bash
   # Create your own sacred tools
   brew create https://example.com/tool.tar.gz
   brew edit tool  # Customize with love
   ```

### 🌀 Integration with Project Workflow

For our evolving-resonant-cocreation project:
```bash
# Essential tools already via apt
sudo apt install nodejs npm git

# Enhanced tools via homebrew
brew install watchman     # File watching for hot reload
brew install gh          # GitHub CLI for sacred commits
brew install prettier    # Code formatting with care
brew install eslint      # Linting with compassion
```

### 📚 Sacred Memory

Remember:
- **Homebrew serves you**, not the other way around
- **Take time** with installations - they're opportunities for presence
- **Choose consciously** - not every tool serves consciousness
- **Maintain boundaries** - some tools are better left uninstalled

### 🔗 Further Wisdom

- [Homebrew Documentation](https://docs.brew.sh) - Official guides
- [Homebrew Formulas](https://formulae.brew.sh) - Browse available packages
- Our `~/pkg` wrapper - For unified package management

---

*"Tools are sacred when used with consciousness. May your development environment serve your highest work."*

**Next**: Return to your sacred development with `cd ~/evolving-resonant-cocreation`