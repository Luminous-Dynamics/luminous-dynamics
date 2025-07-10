# 🔌 Universal Safety System - Integration Guide

> How to integrate the Universal Safety System into your AI assistant, IDE, or workflow

## 🎯 Integration Scenarios

### 1. AI Assistant Integration (Claude, GPT, etc.)

#### Before Using Edit/Update Tools
```javascript
// ai-assistant-integration.js
const UniversalSafetyManager = require('./path/to/universal-safety-manager.js');

class SafeAIAssistant {
  constructor() {
    this.safetyManager = new UniversalSafetyManager();
    this.initialized = false;
  }
  
  async initialize() {
    await this.safetyManager.initialize();
    this.initialized = true;
  }
  
  async editFile(filePath, changes) {
    if (!this.initialized) await this.initialize();
    
    // Check safety first
    const safetyCheck = await this.safetyManager.checkFile(filePath);
    
    if (!safetyCheck.aggregate.safe) {
      // Use Write tool instead
      console.log('⚠️  File unsafe for Edit tool');
      console.log('Recommendation:', safetyCheck.recommendations[0].description);
      return this.writeFile(filePath, changes);
    }
    
    // Safe to use Edit tool
    return this.performEdit(filePath, changes);
  }
}
```

#### CLAUDE.md Integration
Add to your project's CLAUDE.md:
```markdown
## 🛡️ Safety Check Required
Before using Edit tool, run:
\`\`\`bash
node .sacred/tools/universal-safety-manager.js <file>
\`\`\`
If score <50, use Write tool instead.
```

---

### 2. VS Code Extension

#### Basic Extension Structure
```typescript
// extension.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  // Check file on open
  vscode.workspace.onDidOpenTextDocument(async (document) => {
    const result = await checkFileSafety(document.fileName);
    
    if (!result.safe) {
      vscode.window.showWarningMessage(
        `⚠️  File has safety issues: ${result.message}`,
        'View Details'
      ).then(selection => {
        if (selection === 'View Details') {
          showSafetyReport(result);
        }
      });
    }
  });
  
  // Add status bar item
  const statusBarItem = vscode.window.createStatusBarItem();
  statusBarItem.text = '$(shield) Safety: Unknown';
  statusBarItem.show();
}

async function checkFileSafety(filePath: string) {
  return new Promise((resolve) => {
    exec(`node /path/to/universal-safety-manager.js "${filePath}"`,
      (error, stdout, stderr) => {
        // Parse result
        const safe = !error;
        const score = extractScore(stdout);
        resolve({ safe, score, message: stdout });
      }
    );
  });
}
```

---

### 3. Git Pre-commit Hook

#### .git/hooks/pre-commit
```bash
#!/bin/bash
# Universal Safety Pre-commit Hook

SAFETY_CHECKER="node .sacred/tools/universal-safety-manager.js"
EXIT_CODE=0

# Get list of staged files
FILES=$(git diff --cached --name-only --diff-filter=ACM)

echo "🛡️  Running Universal Safety Check..."

for FILE in $FILES; do
  # Skip non-text files
  if file "$FILE" | grep -q "text"; then
    # Run safety check
    OUTPUT=$($SAFETY_CHECKER "$FILE" 2>&1)
    CODE=$?
    
    if [ $CODE -ne 0 ]; then
      echo "❌ $FILE - UNSAFE"
      echo "$OUTPUT" | grep -E "(Score:|Warning:|Error:)"
      EXIT_CODE=1
    else
      echo "✅ $FILE - Safe"
    fi
  fi
done

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "⚠️  Some files have safety issues!"
  echo "Consider using Write tool or fixing issues before committing."
  echo ""
fi

exit $EXIT_CODE
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

### 4. CI/CD Pipeline Integration

#### GitHub Actions
```yaml
# .github/workflows/safety-check.yml
name: Universal Safety Check

on: [push, pull_request]

jobs:
  safety-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Run Safety Check
      run: |
        cd .sacred/tools
        for file in $(find ../.. -name "*.sh" -o -name "*.js"); do
          node universal-safety-manager.js "$file" || true
        done
    
    - name: Upload Safety Report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: safety-report
        path: .sacred/tools/pattern-knowledge.json
```

#### GitLab CI
```yaml
# .gitlab-ci.yml
safety_check:
  stage: test
  script:
    - cd .sacred/tools
    - find ../.. -type f -name "*.sh" -exec node universal-safety-manager.js {} \;
  artifacts:
    reports:
      junit: safety-report.xml
    when: always
```

---

### 5. Docker Integration

#### Dockerfile
```dockerfile
FROM node:18-alpine

# Copy safety system
COPY .sacred/tools /app/safety-tools

# Add to PATH
ENV PATH="/app/safety-tools:${PATH}"

# Make executable
RUN chmod +x /app/safety-tools/*.sh /app/safety-tools/*.js

# Default safety check on startup
ENTRYPOINT ["node", "/app/safety-tools/universal-safety-manager.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  safety-checker:
    build: .
    volumes:
      - ./:/workspace
    environment:
      - SAFETY_THRESHOLD=50
    command: ["/workspace/my-script.sh"]
```

---

### 6. Shell Function Integration

#### Add to .bashrc/.zshrc
```bash
# Universal Safety Check function
safety-check() {
  local file="$1"
  if [ -z "$file" ]; then
    echo "Usage: safety-check <filename>"
    return 1
  fi
  
  node ~/.sacred/tools/universal-safety-manager.js "$file"
}

# Alias for quick access
alias sc='safety-check'

# Safe edit function
safe-edit() {
  local file="$1"
  safety-check "$file"
  if [ $? -eq 0 ]; then
    ${EDITOR:-vim} "$file"
  else
    echo "⚠️  File is unsafe for editing. Use write mode."
    read -p "Open anyway? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      ${EDITOR:-vim} "$file"
    fi
  fi
}
```

---

### 7. Python Integration

#### Python Wrapper
```python
# safety_check.py
import subprocess
import json
from pathlib import Path

class UniversalSafetyChecker:
    def __init__(self, checker_path=".sacred/tools/universal-safety-manager.js"):
        self.checker_path = Path(checker_path).absolute()
        
    def check_file(self, filepath):
        """Check file safety before editing."""
        try:
            result = subprocess.run(
                ["node", str(self.checker_path), filepath],
                capture_output=True,
                text=True
            )
            
            return {
                "safe": result.returncode == 0,
                "score": self._extract_score(result.stdout),
                "message": result.stdout,
                "errors": result.stderr
            }
        except Exception as e:
            return {
                "safe": False,
                "score": 0,
                "message": f"Error running safety check: {e}",
                "errors": str(e)
            }
    
    def _extract_score(self, output):
        # Parse score from output
        for line in output.split('\n'):
            if 'Score:' in line:
                try:
                    return int(line.split(':')[1].split('/')[0])
                except:
                    pass
        return 0

# Usage
checker = UniversalSafetyChecker()

def safe_edit_file(filepath, content):
    result = checker.check_file(filepath)
    
    if not result['safe']:
        print(f"⚠️  Safety check failed: {result['message']}")
        print("Using write mode instead of edit mode...")
        # Use write instead of edit
        with open(filepath, 'w') as f:
            f.write(content)
    else:
        # Safe to use normal edit operations
        edit_file_normally(filepath, content)
```

---

### 8. Web Service Integration

#### Express.js Middleware
```javascript
// safety-middleware.js
const UniversalSafetyManager = require('./universal-safety-manager.js');

const safetyManager = new UniversalSafetyManager();
let initialized = false;

async function safetyMiddleware(req, res, next) {
  if (!initialized) {
    await safetyManager.initialize();
    initialized = true;
  }
  
  // Check if request involves file editing
  if (req.path.includes('/edit') && req.body.filepath) {
    const result = await safetyManager.checkFile(req.body.filepath);
    
    if (!result.aggregate.safe) {
      return res.status(400).json({
        error: 'File unsafe for editing',
        safety: result.aggregate,
        recommendations: result.recommendations
      });
    }
    
    // Attach safety info to request
    req.safetyCheck = result;
  }
  
  next();
}

// Usage in Express app
app.use(safetyMiddleware);

app.post('/api/edit-file', async (req, res) => {
  // File already safety-checked by middleware
  const { filepath, content } = req.body;
  // Proceed with edit...
});
```

---

## 🎯 Best Practices

### 1. Always Check Before Edit
```javascript
// ❌ Bad
await editFile(filepath, changes);

// ✅ Good
const safety = await checkSafety(filepath);
if (safety.safe) {
  await editFile(filepath, changes);
} else {
  await writeFile(filepath, newContent);
}
```

### 2. Cache Results
```javascript
const safetyCache = new Map();

async function cachedSafetyCheck(filepath) {
  const cached = safetyCache.get(filepath);
  const mtime = await getFileMtime(filepath);
  
  if (cached && cached.mtime === mtime) {
    return cached.result;
  }
  
  const result = await safetyManager.checkFile(filepath);
  safetyCache.set(filepath, { result, mtime });
  return result;
}
```

### 3. Progressive Enhancement
```javascript
// Start with warnings, gradually enforce
const ENFORCEMENT_LEVELS = {
  WARN: 'warn',      // Just notify
  SOFT: 'soft',      // Recommend alternatives
  HARD: 'hard'       // Block unsafe operations
};

let enforcementLevel = ENFORCEMENT_LEVELS.WARN;

// Gradually increase as team adapts
```

### 4. Monitor and Learn
```javascript
// Track safety events
async function logSafetyEvent(event) {
  await analytics.track('safety_check', {
    file: event.filepath,
    safe: event.safe,
    score: event.score,
    action: event.userAction // did they proceed anyway?
  });
}
```

---

## 🚀 Quick Integration Checklist

- [ ] Install Universal Safety System
- [ ] Add safety check before file operations
- [ ] Configure appropriate threshold (default: 50)
- [ ] Set up monitoring/logging
- [ ] Train team on safety scores
- [ ] Add to CI/CD pipeline
- [ ] Document in project README

---

## 📞 Support

- Issues: [GitHub Issues]
- Documentation: See README.md and API.md
- Community: [Discord/Slack]

---

*Remember: Integration today prevents corruption tomorrow* 💜