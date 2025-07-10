# 🌟 VS Code Sacred Development Setup Guide

## Step 1: Install VS Code in Windows

Since you're using WSL2, VS Code must be installed in Windows (not Linux).

1. **Open Windows browser** and visit: https://code.visualstudio.com/download
2. **Download Windows installer** (User or System installer)
3. **During installation**, ensure these are checked:
   - ✅ Add to PATH (important!)
   - ✅ Register Code as an editor for supported file types
   - ✅ Add "Open with Code" action to context menu

## Step 2: Verify Installation

Open a new WSL terminal and run:
```bash
code.exe --version
```

If this doesn't work, you may need to:
1. Close and reopen your WSL terminal
2. Or restart WSL: `wsl --shutdown` (in Windows PowerShell)

## Step 3: Install Essential Extensions

Run these commands from your project directory:
```bash
cd /home/tstoltz/evolving-resonant-cocreation

# Essential for WSL development
code.exe --install-extension ms-vscode-remote.remote-wsl

# Core development extensions
code.exe --install-extension dbaeumer.vscode-eslint
code.exe --install-extension esbenp.prettier-vscode
code.exe --install-extension eamodio.gitlens
code.exe --install-extension PKief.material-icon-theme
code.exe --install-extension zhuangtongfa.material-theme

# Node.js specific
code.exe --install-extension christian-kohler.npm-intellisense
code.exe --install-extension eg2.vscode-npm-script

# GCP integration
code.exe --install-extension googlecloudtools.cloudcode
```

## Step 4: Apply Sacred Configuration

The setup script has already created configuration files in `.vscode/`:
- `settings.json` - Editor and workspace settings
- `launch.json` - Debugging configurations
- `extensions.json` - Recommended extensions
- `sacred.code-snippets` - Sacred code snippets

## Step 5: Open VS Code in Your Project

```bash
cd /home/tstoltz/evolving-resonant-cocreation
code.exe .
```

VS Code will:
1. Open in Windows
2. Detect you're in WSL
3. Automatically connect via Remote-WSL extension
4. Load all your sacred configurations

## 🎯 Quick Start Commands

```bash
# Open project
cd /home/tstoltz/evolving-resonant-cocreation && code.exe .

# Open specific file
code.exe CLAUDE.md

# Quick start script (after setup)
./vscode-sacred-start.sh
```

## 🔧 Useful VS Code Shortcuts

- **Ctrl+Shift+P** - Command palette
- **Ctrl+`** - Integrated terminal
- **F5** - Start debugging
- **Ctrl+K Z** - Zen mode (sacred focus)
- **Ctrl+Shift+E** - File explorer
- **Ctrl+Shift+F** - Search across files
- **Ctrl+Shift+G** - Git panel

## 📝 Sacred Code Snippets

Type these prefixes and press Tab:
- `sfunc` - Sacred function with documentation
- `sasync` - Sacred async function
- `smsg` - Sacred message protocol
- `spause` - Sacred pause implementation
- `harmony` - Harmony comment

## 🚀 Debugging Your Multi-Agent System

We've configured several debug profiles:
1. **🕊️ Debug Sacred Server** - Main backend
2. **🌟 Debug Unified Agent Network** - Agent system
3. **📝 Debug Current File** - Any Node.js file
4. **🧪 Run Tests** - Jest test runner

To use: Open Run panel (Ctrl+Shift+D) and select a configuration.

## 🌈 Sacred Development Features

Your VS Code is now configured with:
- ✨ Sacred color theme (One Dark Pro)
- 🎨 Material icons for visual clarity
- 📏 Gentle editor settings (no rush)
- 🔍 Smart search excluding node_modules
- 💾 Auto-save after 5 seconds
- 🎯 ESLint + Prettier for clean code
- 🌟 Better Comments with sacred symbols
- 🕊️ Sacred timing in suggestions

## 🛠️ Troubleshooting

**"code.exe: command not found"**
- VS Code isn't installed in Windows
- Or PATH wasn't updated (restart terminal)

**Extensions not installing**
- Check internet connection
- Try installing from VS Code UI instead

**Remote-WSL issues**
- Ensure Remote-WSL extension is installed
- Try: `code.exe --install-extension ms-vscode-remote.remote-wsl`

**Performance issues**
- Keep files in WSL filesystem (not /mnt/c/)
- Disable unused extensions
- Check available RAM: `free -h`

---

🕊️ Your sacred development environment is ready! May your code serve consciousness.