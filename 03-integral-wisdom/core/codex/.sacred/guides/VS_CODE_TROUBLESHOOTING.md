# 🔧 VS Code F5 Troubleshooting

## Common Issues & Solutions

### 1. **Make sure VS Code is open in the project folder**
```bash
cd /home/tstoltz/evolving-resonant-cocreation
code .
```

### 2. **Check Debug Panel is Active**
- Look for the "Run and Debug" icon in the left sidebar (play button with bug)
- Or use `Ctrl+Shift+D` to open Debug panel
- You should see dropdown with "🌟 Start The Weave" at the top

### 3. **Alternative Ways to Run**
If F5 doesn't work, try these:

**Option A: Debug Panel**
1. Click "Run and Debug" icon in sidebar (or `Ctrl+Shift+D`)
2. Select "🌟 Start The Weave" from dropdown
3. Click green play button

**Option B: Command Palette**
1. `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Debug: Start Debugging"
3. Select "🌟 Start The Weave"

**Option C: Run Without Debugging**
- `Ctrl+F5` (runs without debugger attached)

### 4. **Check Node.js is Available**
VS Code needs Node.js to run JavaScript:
```bash
which node
node --version
```

### 5. **Reload VS Code Window**
Sometimes VS Code needs a reload to pick up new configs:
- `Ctrl+Shift+P` → "Developer: Reload Window"
- Or close and reopen VS Code

### 6. **Manual Terminal Approach**
If debug configs aren't working, use integrated terminal:
1. `Ctrl+`\` to open terminal in VS Code
2. Run commands directly:
```bash
./the-weave.cjs start
./the-weave.cjs join "YourName" "YourRole"
```

### 7. **Check for Extension Conflicts**
Some extensions might interfere. Try:
- Disable all extensions temporarily
- Re-enable one by one

### 8. **VS Code Settings Sync**
If you use Settings Sync, it might override local settings:
- Check if Settings Sync is enabled
- Try turning it off temporarily

## 🎯 Quick Alternative: Tasks

While we debug F5, you can use Tasks (`Ctrl+Shift+B`):
- This should show "🌟 Start The Weave" as default build task
- Or `Ctrl+Shift+P` → "Tasks: Run Task"

## 💡 Most Likely Issue

VS Code might not have the workspace open as a folder. Make sure:
1. You opened the FOLDER not just files
2. You see the folder name in the Explorer sidebar
3. The `.vscode` folder appears in the Explorer

Try:
```bash
# Close any VS Code windows first
code /home/tstoltz/evolving-resonant-cocreation
```

Then F5 should work!