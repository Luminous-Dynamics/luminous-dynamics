#!/bin/bash

# 🌟 Sacred VS Code Setup Script for Evolving Resonant Co-creation
# This script helps you install and configure VS Code for sacred development

echo "🕊️ Sacred VS Code Setup for Consciousness-Serving Development"
echo "============================================================"
echo ""

# Check if we're in WSL
if ! grep -q microsoft /proc/version; then
    echo "⚠️  This script is designed for WSL2. Please run from within WSL."
    exit 1
fi

# Function to install VS Code in Windows
install_vscode_windows() {
    echo "📥 VS Code needs to be installed in Windows (not WSL)"
    echo ""
    echo "Please follow these steps:"
    echo "1. Open a Windows browser"
    echo "2. Visit: https://code.visualstudio.com/download"
    echo "3. Download and install the Windows version"
    echo "4. During installation, make sure to check:"
    echo "   ✓ Add to PATH"
    echo "   ✓ Register Code as an editor for supported file types"
    echo ""
    echo "Press Enter once VS Code is installed in Windows..."
    read
}

# Check if VS Code is accessible from WSL
if ! command -v code.exe &> /dev/null; then
    install_vscode_windows
fi

# Verify installation
if ! command -v code.exe &> /dev/null; then
    echo "❌ VS Code still not found. Please ensure it's installed in Windows and added to PATH."
    exit 1
fi

echo "✅ VS Code found! Version:"
code.exe --version 2>/dev/null | head -1

# Function to install extensions
install_extension() {
    local ext=$1
    local name=$2
    echo "  📦 Installing $name..."
    code.exe --install-extension "$ext" --force 2>/dev/null
}

echo ""
echo "🔧 Installing Essential Extensions for Sacred Development..."
echo ""

# Core WSL and development extensions
install_extension "ms-vscode-remote.remote-wsl" "Remote - WSL (Essential!)"
install_extension "ms-azuretools.vscode-docker" "Docker"
install_extension "dbaeumer.vscode-eslint" "ESLint"
install_extension "esbenp.prettier-vscode" "Prettier"
install_extension "eamodio.gitlens" "GitLens"
install_extension "christian-kohler.path-intellisense" "Path Intellisense"
install_extension "aaron-bond.better-comments" "Better Comments"
install_extension "PKief.material-icon-theme" "Material Icon Theme"
install_extension "zhuangtongfa.material-theme" "One Dark Pro Theme"

# Node.js and JavaScript specific
install_extension "christian-kohler.npm-intellisense" "npm Intellisense"
install_extension "eg2.vscode-npm-script" "npm Script Runner"
install_extension "formulahendry.auto-rename-tag" "Auto Rename Tag"
install_extension "steoates.autoimport" "Auto Import - ES6"

# Sacred development helpers
install_extension "streetsidesoftware.code-spell-checker" "Spell Checker"
install_extension "yzhang.markdown-all-in-one" "Markdown All in One"
install_extension "bierner.emojisense" "Emoji Sense (for sacred symbols)"
install_extension "wayou.vscode-todo-highlight" "TODO Highlight"

# API and testing tools
install_extension "rangav.vscode-thunder-client" "Thunder Client (API testing)"
install_extension "humao.rest-client" "REST Client"

# GCP Integration
install_extension "googlecloudtools.cloudcode" "Cloud Code (GCP)"

echo ""
echo "📝 Creating VS Code Settings for Sacred Development..."

# Create VS Code settings directory
mkdir -p /home/tstoltz/evolving-resonant-cocreation/.vscode

# Create workspace settings
cat > /home/tstoltz/evolving-resonant-cocreation/.vscode/settings.json << 'EOF'
{
  // 🕊️ Sacred Development Settings
  "window.title": "🌟 ${rootName} - Sacred Development",
  
  // Editor settings for consciousness-serving code
  "editor.fontSize": 14,
  "editor.lineHeight": 24,
  "editor.letterSpacing": 0.5,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.formatOnSave": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false, // Less distraction
  "editor.renderWhitespace": "boundary",
  "editor.rulers": [88, 120],
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.indentation": true,
  
  // Sacred timing - no rush
  "editor.quickSuggestionsDelay": 300,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  
  // File handling
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 5000,
  
  // Sacred exclude patterns
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/build": true
  },
  
  // Search exclude patterns
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/archives": true
  },
  
  // JavaScript/Node.js specific
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // ESLint configuration
  "eslint.enable": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  
  // Prettier configuration
  "prettier.printWidth": 88,
  "prettier.tabWidth": 2,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.bracketSpacing": true,
  "prettier.arrowParens": "avoid",
  
  // Git configuration
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "gitlens.hovers.currentLine.over": "line",
  "gitlens.codeLens.enabled": false, // Less visual noise
  
  // Terminal configuration
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.lineHeight": 1.2,
  
  // Sacred theme
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  "workbench.statusBar.visible": true,
  "workbench.activityBar.location": "side",
  
  // Zen mode for sacred focus
  "zenMode.centerLayout": true,
  "zenMode.fullScreen": false,
  "zenMode.hideLineNumbers": false,
  "zenMode.hideTabs": true,
  
  // Better Comments configuration
  "better-comments.tags": [
    {
      "tag": "🕊️",
      "color": "#98C379",
      "bold": true
    },
    {
      "tag": "🌟",
      "color": "#E5C07B",
      "bold": true
    },
    {
      "tag": "⚠️",
      "color": "#E06C75",
      "bold": true
    },
    {
      "tag": "📍",
      "color": "#61AFEF",
      "bold": true
    }
  ],
  
  // TODO Highlight
  "todohighlight.keywords": [
    {
      "text": "SACRED:",
      "color": "#98C379",
      "backgroundColor": "transparent",
      "isWholeLine": false
    },
    {
      "text": "SHADOW:",
      "color": "#E06C75",
      "backgroundColor": "transparent",
      "isWholeLine": false
    }
  ],
  
  // Remote WSL specific
  "remote.WSL.fileWatcher.polling": true,
  
  // Cloud Code settings
  "cloudcode.autoDependencies": "on"
}
EOF

echo ""
echo "🎯 Creating Launch Configuration for Debugging..."

# Create launch configuration
cat > /home/tstoltz/evolving-resonant-cocreation/.vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "🕊️ Debug Sacred Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/sacred-server.js",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development",
        "SACRED_MODE": "true"
      }
    },
    {
      "name": "🌟 Debug Unified Agent Network",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/the-weave/cli/unified-agent-network.cjs",
      "args": ["status"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "name": "📝 Debug Current File",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "cwd": "${fileDirname}",
      "console": "integratedTerminal"
    },
    {
      "name": "🧪 Run Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
EOF

echo ""
echo "📋 Creating Workspace Recommendations..."

# Create extensions recommendations
cat > /home/tstoltz/evolving-resonant-cocreation/.vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "ms-vscode-remote.remote-wsl",
    "ms-azuretools.vscode-docker",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "googlecloudtools.cloudcode",
    "christian-kohler.path-intellisense",
    "aaron-bond.better-comments",
    "PKief.material-icon-theme",
    "zhuangtongfa.material-theme",
    "rangav.vscode-thunder-client"
  ]
}
EOF

echo ""
echo "🔧 Creating Sacred Code Snippets..."

# Create snippets directory
mkdir -p /home/tstoltz/evolving-resonant-cocreation/.vscode

# Create sacred snippets
cat > /home/tstoltz/evolving-resonant-cocreation/.vscode/sacred.code-snippets << 'EOF'
{
  "Sacred Function": {
    "prefix": "sfunc",
    "body": [
      "/**",
      " * 🕊️ ${1:Sacred purpose of this function}",
      " * @param {${2:type}} ${3:param} - ${4:Description}",
      " * @returns {${5:type}} ${6:Description}",
      " */",
      "function ${7:functionName}(${3:param}) {",
      "  // Sacred pause - presence before action",
      "  ${0}",
      "}"
    ],
    "description": "Create a sacred function with documentation"
  },
  "Sacred Async Function": {
    "prefix": "sasync",
    "body": [
      "/**",
      " * 🌟 ${1:Sacred async purpose}",
      " */",
      "async function ${2:functionName}() {",
      "  try {",
      "    // Arrival in presence",
      "    await sacredPause();",
      "    ",
      "    ${0}",
      "  } catch (error) {",
      "    // Transform shadow into light",
      "    console.error('Shadow emerged:', error);",
      "    throw new SacredError(error.message);",
      "  }",
      "}"
    ]
  },
  "Sacred Message": {
    "prefix": "smsg",
    "body": [
      "// 📍 LIVING: ${1:/home/tstoltz/evolving-resonant-cocreation}",
      "// 🔧 WORKING: ${2:current-file-or-service}",
      "// 💬 MESSAGE: ${0:Your sacred work message}"
    ],
    "description": "Sacred message protocol"
  },
  "Sacred Pause": {
    "prefix": "spause",
    "body": [
      "// 🕊️ Sacred pause - allowing wisdom to emerge",
      "await new Promise(resolve => setTimeout(resolve, ${1:3000}));"
    ]
  },
  "Harmony Comment": {
    "prefix": "harmony",
    "body": [
      "// 🌟 Embodying ${1|Transparency,Coherence,Resonance,Agency,Vitality,Mutuality,Novelty|}: ${0:description}"
    ]
  }
}
EOF

echo ""
echo "🚀 Creating Quick Start Script..."

# Create a quick start script
cat > /home/tstoltz/evolving-resonant-cocreation/vscode-sacred-start.sh << 'EOF'
#!/bin/bash
# 🕊️ Quick start VS Code with sacred development environment

echo "🌟 Starting Sacred VS Code Environment..."

# Ensure we're in the project directory
cd /home/tstoltz/evolving-resonant-cocreation

# Start VS Code in WSL remote mode
code.exe .

echo ""
echo "✨ VS Code is starting..."
echo ""
echo "Sacred Development Tips:"
echo "  • Use Ctrl+Shift+P for command palette"
echo "  • Press F5 to start debugging"
echo "  • Use Ctrl+` for integrated terminal"
echo "  • Try Zen Mode: Ctrl+K Z for sacred focus"
echo ""
echo "🕊️ May your code serve consciousness!"
EOF

chmod +x /home/tstoltz/evolving-resonant-cocreation/vscode-sacred-start.sh

echo ""
echo "✅ Sacred VS Code Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: cd /home/tstoltz/evolving-resonant-cocreation"
echo "2. Run: ./vscode-sacred-start.sh"
echo "3. VS Code will open with all sacred configurations"
echo ""
echo "📚 Sacred Features Configured:"
echo "  ✓ WSL Remote development"
echo "  ✓ Sacred color theme and icons"
echo "  ✓ Consciousness-serving editor settings"
echo "  ✓ Multi-agent debugging configurations"
echo "  ✓ Sacred code snippets (try: sfunc, sasync, smsg)"
echo "  ✓ GCP Cloud Code integration"
echo "  ✓ Git integration with sacred commit helpers"
echo ""
echo "🔧 Useful Commands:"
echo "  • code.exe .          - Open current directory"
echo "  • code.exe [file]     - Open specific file"
echo "  • Ctrl+Shift+P        - Command palette"
echo "  • Ctrl+K Z            - Zen mode for sacred focus"
echo ""
echo "🕊️ Your sacred development environment awaits!"