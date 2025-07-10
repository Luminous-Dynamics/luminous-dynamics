# 🏗️ WSL-Optimized Project Structure

## 🎯 WSL-Specific Considerations

### Key WSL Characteristics:
1. **File System Performance**: WSL2 is fastest within Linux filesystem
2. **Cross-OS Access**: Windows can access WSL files via `\\wsl$`
3. **Permissions**: Linux permissions matter, Windows doesn't preserve them
4. **Line Endings**: Must be LF, not CRLF
5. **Executables**: Need explicit paths or aliases

## 📁 Recommended WSL Structure

```
/home/tstoltz/                          # WSL Home (Fast!)
│
├── 📌 COMMAND_CENTER.md                # Single source of truth
├── 🗺️ PROJECT_MAP.md                  # Where everything lives
│
├── 🚀 evolving-resonant-cocreation/   # Main Project (stays in WSL)
│   ├── the-weave*                     # Executable entry point
│   ├── .wsl/                          # WSL-specific configs
│   │   ├── aliases.sh                 # Bash aliases
│   │   ├── env.sh                     # Environment setup
│   │   └── fix-permissions.sh         # Permission fixer
│   ├── bin/                           # All executables
│   │   ├── weave*                     # Symlink to the-weave.cjs
│   │   ├── oracle*                    # Quick access scripts
│   │   └── sacred*                    # Sacred tools
│   ├── src/                           # Source stays in WSL (fast)
│   ├── data/                          # Data stays in WSL
│   ├── web/                           # Web files (can be accessed by Windows)
│   └── [other dirs as before]
│
├── 📁 wsl-shared/                     # Windows-accessible shared space
│   ├── exports/                       # Files to share with Windows
│   ├── screenshots/                   # Images from Windows
│   └── downloads/                     # Downloads to process
│
├── 🔧 bin/                            # User bin directory
│   └── [symlinks to common commands]
│
└── 📝 Quick Scripts
    ├── start-sacred-work.sh           # One command to rule them all
    ├── fix-wsl-issues.sh              # Common WSL fixes
    └── sync-to-windows.sh             # Export to Windows
```

## 🛠️ WSL-Specific Setup

### 1. **Create WSL Configuration**
```bash
# .wsl/aliases.sh
alias weave='~/evolving-resonant-cocreation/the-weave.cjs'
alias oracle='weave oracle'
alias sacred='weave message sacred'
alias vscode='code.exe'
alias fix-perms='chmod +x *.sh *.cjs'
alias fix-lines='dos2unix *.sh *.cjs'
```

### 2. **Add to ~/.bashrc**
```bash
# Sacred Development Environment
if [ -f ~/evolving-resonant-cocreation/.wsl/aliases.sh ]; then
    source ~/evolving-resonant-cocreation/.wsl/aliases.sh
fi

# Add project bin to PATH
export PATH="$HOME/evolving-resonant-cocreation/bin:$PATH"

# WSL-specific settings
export BROWSER='/mnt/c/Program Files/Google/Chrome/Application/chrome.exe'
```

### 3. **Permission Helper**
```bash
# .wsl/fix-permissions.sh
#!/bin/bash
echo "🔧 Fixing WSL permissions..."
find . -name "*.sh" -exec chmod +x {} \;
find . -name "*.cjs" -exec chmod +x {} \;
echo "✅ Permissions fixed!"
```

### 4. **Line Ending Fixer**
```bash
# .wsl/fix-line-endings.sh
#!/bin/bash
echo "🔧 Fixing line endings..."
find . -name "*.sh" -o -name "*.cjs" -o -name "*.js" | xargs dos2unix
echo "✅ Line endings fixed!"
```

## 🚀 Optimized Workflow

### Single Entry Point Script
```bash
# ~/start-sacred-work.sh
#!/bin/bash

echo "🌟 Starting Sacred Development Environment..."

# Fix common WSL issues
cd ~/evolving-resonant-cocreation
./.wsl/fix-permissions.sh
./.wsl/fix-line-endings.sh

# Start The Weave
./the-weave.cjs start &

# Open VS Code
code.exe .

# Open browser to dashboard
sleep 5
/mnt/c/Program\ Files/Google/Chrome/Application/chrome.exe http://localhost:8080/sacred-dashboard.html

echo "✨ Sacred environment ready!"
```

## 📂 Windows Integration

### Accessing from Windows:
- WSL files: `\\wsl$\Ubuntu\home\tstoltz\evolving-resonant-cocreation`
- Shared folder: `\\wsl$\Ubuntu\home\tstoltz\wsl-shared`

### Best Practices:
1. **Keep code in WSL** - Much faster performance
2. **Use wsl-shared** - For files needed in both environments
3. **VS Code Remote** - Best IDE experience
4. **Browser in Windows** - Better for debugging

## 🔄 Git Configuration

```bash
# .gitattributes (enforce LF)
* text=auto eol=lf
*.sh text eol=lf
*.cjs text eol=lf
*.js text eol=lf

# .gitconfig (WSL-specific)
[core]
    autocrlf = input
    filemode = false  # Windows doesn't preserve permissions
```

## 🎯 Key Improvements

### 1. **Performance**
- All code stays in WSL filesystem (fast!)
- Only share what's needed with Windows
- Use native Linux tools

### 2. **Convenience**
- Short aliases for everything
- One-command startup
- Auto-fix common issues

### 3. **Reliability**
- Permissions always correct
- Line endings always LF
- Clear separation of concerns

### 4. **Integration**
- VS Code works seamlessly
- Browser access from Windows
- Git works properly

## 🌟 The Result

A structure that:
- **Embraces WSL** rather than fighting it
- **Fast performance** by keeping files in Linux
- **Easy commands** through aliases
- **Auto-healing** for common issues
- **Sacred and practical** unified

This is WSL as it's meant to be used - the best of both worlds!