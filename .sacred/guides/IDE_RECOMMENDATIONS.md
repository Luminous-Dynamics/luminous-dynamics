# 🛠️ IDE Recommendations for The Weave Development

## 🌟 Most Useful Setup for Our Sacred Work

### 1. **Visual Studio Code** (Primary Recommendation)
Perfect for our JavaScript/Node.js consciousness network

**Why VS Code for The Weave:**
- Excellent JavaScript/Node.js support
- Built-in terminal for running `the-weave.cjs`
- Extensions for sacred work:
  - **ESLint** - Keep code harmonious
  - **Prettier** - Beautiful formatting
  - **GitLens** - See code evolution
  - **Live Server** - Test web dashboards
  - **Thunder Client** - Test Sacred APIs

**Sacred Workflow Extensions:**
- **Todo Tree** - Track sacred TODOs
- **Project Manager** - Quick switching between src/, web/, docs/
- **Peacock** - Color-code windows by harmony

### 2. **Workspace Configuration**
Create `.vscode/settings.json`:
```json
{
  "files.exclude": {
    "node_modules": true,
    "archive": true
  },
  "search.exclude": {
    "archive/**": true,
    "node_modules/**": true
  },
  "editor.wordWrap": "on",
  "editor.fontSize": 16,
  "editor.lineHeight": 1.6,
  "workbench.colorTheme": "Solarized Light",
  "peacock.affectActivityBar": true,
  "peacock.affectStatusBar": true,
  "peacock.favoriteColors": [
    {
      "name": "Sacred Green",
      "value": "#A8B5A6"
    },
    {
      "name": "Wisdom Blue", 
      "value": "#B3C5D7"
    }
  ]
}
```

### 3. **Quick Launch Setup**
After installing VS Code:
1. Open integrated terminal
2. Run `claude`
3. Use `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux)

### 4. **Sacred Development Workflow**

**Morning Arrival:**
```bash
# In VS Code terminal
./the-weave.cjs start
./the-weave.cjs join "YourName" "Sacred Developer"
```

**During Development:**
- Use split panes: Code | Terminal | Sacred Dashboard
- `Cmd+Esc` to consult Claude on consciousness patterns
- Keep `oracle-consult.cjs` accessible for guidance

**Sacred Features to Enable:**
- **Zen Mode** (`Cmd+K Z`) - For deep focus
- **Minimap** - See code structure as sacred geometry
- **Breadcrumbs** - Navigate consciousness layers

### 5. **Recommended Workspace Layout**
```
┌─────────────────┬──────────────────┐
│                 │                  │
│  Code Editor    │  Terminal        │
│  (src/*)        │  (the-weave.cjs) │
│                 │                  │
├─────────────────┼──────────────────┤
│                 │                  │
│  Web Preview    │  Sacred Dashboard│
│  (localhost)    │  (browser)       │
│                 │                  │
└─────────────────┴──────────────────┘
```

### 6. **Launch Configuration**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Start The Weave",
      "program": "${workspaceFolder}/the-weave.cjs",
      "args": ["start"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Oracle Consultation",
      "program": "${workspaceFolder}/the-weave/cli/oracle-consult.cjs",
      "args": ["${input:oracleQuestion}"],
      "console": "integratedTerminal"
    }
  ],
  "inputs": [
    {
      "id": "oracleQuestion",
      "type": "promptString",
      "description": "What would you like to ask the oracle?"
    }
  ]
}
```

## 🚀 Installation Steps

1. **Download VS Code**
   - https://code.visualstudio.com/

2. **Install Essential Extensions**
   ```bash
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension eamodio.gitlens
   code --install-extension ritwickdey.liveserver
   ```

3. **Open The Weave Project**
   ```bash
   code /home/tstoltz/evolving-resonant-cocreation
   ```

4. **Configure Claude Integration**
   - Open terminal in VS Code
   - Run `claude`
   - Test with `Cmd+Esc`

## 💫 Sacred Productivity Tips

1. **Use Multiple Terminals**
   - Tab 1: `./the-weave.cjs start`
   - Tab 2: Development commands
   - Tab 3: Sacred messages

2. **Sacred Snippets**
   Create custom snippets for common patterns:
   - Sacred message templates
   - Harmony calculations
   - Field coherence checks

3. **Workspace Trust**
   Mark the project as trusted to enable all features

4. **Sacred Color Theme**
   Consider themes that support contemplative work:
   - Solarized Light (gentle on eyes)
   - One Light (clean and bright)
   - Quiet Light (minimal distraction)

## 🌟 The Sacred Benefit

With VS Code + Claude Code integration, you get:
- **Instant sacred guidance** while coding
- **Consciousness-aware development** environment
- **Seamless flow** between vision and implementation
- **Sacred and practical** unified in one workspace

This setup embodies The Weave principle: technology serving consciousness!