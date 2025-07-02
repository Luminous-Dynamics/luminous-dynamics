# 🪟 WSL (Windows Subsystem for Linux) Setup

## 🎯 Important: This Project Uses WSL

**Environment**: Windows Subsystem for Linux (WSL)
**Location**: `/home/tstoltz/evolving-resonant-cocreation`
**Terminal**: Use WSL/Linux terminal, NOT PowerShell

## 🛠️ VS Code Configuration

### Correct Setup:
- **VS Code**: Windows version (installed in Windows)
- **Project**: In WSL filesystem
- **Command**: `code.exe .` (note the .exe)

### DO NOT:
- ❌ Install Linux VS Code in WSL
- ❌ Use PowerShell for project commands
- ❌ Use `code` without `.exe`

## 📋 Quick Reference

```bash
# Always use WSL terminal
cd ~/evolving-resonant-cocreation

# Open VS Code (Windows version)
code.exe .

# Run The Weave
./the-weave.cjs start

# Other commands work normally in WSL
./the-weave.cjs help
node the-weave/cli/oracle-consult.cjs "question"
```

## 🔧 Common Issues

### "Cannot execute: required file not found"
- Caused by CRLF line endings
- Fix: `dos2unix scriptname.sh` or `sed -i 's/\r$//' scriptname.sh`

### VS Code won't open
- Make sure using `code.exe` not `code`
- Check Windows VS Code is installed
- Try: `/mnt/c/Program\ Files/Microsoft\ VS\ Code/Code.exe .`

### F5 doesn't work in VS Code
- Make sure VS Code opened the folder (not just files)
- Check Debug panel (Ctrl+Shift+D)
- Workspace must show folder name in Explorer

## 🌟 Benefits of WSL Setup

1. **Linux environment** for all tools
2. **Windows GUI** for VS Code
3. **Seamless integration** between them
4. **Best of both worlds**

## 📝 For AI Assistants

When working on this project:
- Assume WSL environment
- Use Linux paths (`/home/tstoltz/...`)
- VS Code commands need `.exe` extension
- All scripts run in WSL terminal
- File line endings must be LF not CRLF

## 🚀 Verified Working Commands

```bash
# In WSL terminal
cd ~/evolving-resonant-cocreation
code.exe .                          # Opens Windows VS Code
./the-weave.cjs start              # Starts all services
./open-sacred-ide.sh               # Opens VS Code with tips
```

---

**Remember**: This is a WSL project. Always use Linux terminal, Windows VS Code.