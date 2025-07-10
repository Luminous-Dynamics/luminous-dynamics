# ⚠️ CLAUDE VISUAL WARNING SYSTEM ⚠️

> **CRITICAL**: Visual safety indicators for all Claude instances

## 🚨 RED ZONE - NEVER DO THESE
```
┌─────────────────────────────────────────────────────────┐
│ 🚨 DANGER: Update Tool Traps                            │
├─────────────────────────────────────────────────────────┤
│ ❌ NEVER use Update on files with:                      │
│    • Lines over 1000 characters                         │
│    • Complex ${VARIABLE}-pattern expansions             │
│    • Mixed quotes and escapes                           │
│    • Shell heredocs with variables                      │
└─────────────────────────────────────────────────────────┘
```

## 🟡 YELLOW ZONE - PROCEED WITH CAUTION
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  CAUTION: Check Before Update                        │
├─────────────────────────────────────────────────────────┤
│ 🔍 Check these file types:                              │
│    • .sh files (shell scripts)                          │
│    • Large JSON files                                   │
│    • Generated code                                     │
│    • Files with special characters                      │
└─────────────────────────────────────────────────────────┘
```

## 🟢 GREEN ZONE - SAFE TO UPDATE
```
┌─────────────────────────────────────────────────────────┐
│ ✅ SAFE: These Usually Work Well                        │
├─────────────────────────────────────────────────────────┤
│ ✓ Markdown files (.md)                                  │
│ ✓ Simple JavaScript (.js)                               │
│ ✓ HTML files                                            │
│ ✓ Configuration files (short)                           │
│ ✓ Python files (.py)                                    │
└─────────────────────────────────────────────────────────┘
```

## 🛡️ UNIVERSAL SAFETY PROTOCOL

### Quick Decision Tree
```
Is file > 50 lines?
  └─ YES → Use Write (safer)
  └─ NO  → Continue ↓

Has complex syntax?
  └─ YES → Use Write (safer)
  └─ NO  → Continue ↓

Has lines > 500 chars?
  └─ YES → Use Write (safer)
  └─ NO  → Update is OK ✅
```

### Scalable Safety Commands
```bash
# 1. Quick safety check (universal)
wc -L file.sh  # Max line length

# 2. Pattern detection (modular)
grep -E '\$\{.*\}-' file.sh  # Dangerous patterns

# 3. Pre-flight test (automated)
node tools/trap-detector.js --check file.sh
```

## 🌐 UNIVERSAL ESCAPE PATTERNS

### If You Get Stuck
1. **DON'T PANIC** - Don't try more updates
2. **NEW SESSION** - User should start fresh
3. **USE WRITE** - Create new file instead
4. **REPORT TRAP** - Document in trap log

### Safe Universal Patterns
```bash
# ❌ DANGEROUS (causes trap)
SERVICE_URL="${SERVICE_NAME}-${PROJECT_ID}.run.app"

# ✅ SAFE (modular approach)
SERVICE_BASE="${SERVICE_NAME}"
PROJECT_BASE="${PROJECT_ID}"
SERVICE_URL="${SERVICE_BASE}-${PROJECT_BASE}.run.app"

# ✅ SAFER (explicit construction)
SERVICE_URL=$(echo "${SERVICE_NAME}-${PROJECT_ID}.run.app")
```

## 📊 SCALABLE MONITORING

### Trap Detection Dashboard
```
┌──────────────────────────────────┐
│ File Safety Status               │
├──────────────────────────────────┤
│ ✅ Safe files:        127        │
│ ⚠️  Caution files:     23        │
│ 🚨 Dangerous files:     5        │
│ 📊 Total scanned:     155        │
└──────────────────────────────────┘
```

### Modular Safety Levels
1. **Level 1**: Basic length check
2. **Level 2**: Pattern detection  
3. **Level 3**: Full AST analysis
4. **Level 4**: ML-based prediction

## 🔧 UNIVERSAL TOOLING

### Cross-Language Safety
```javascript
// JavaScript safety module
export const isSafeToUpdate = (content) => {
  return !hasLongLines(content) && 
         !hasDangerousPatterns(content) &&
         !hasEncodingIssues(content);
};
```

```python
# Python safety module
def is_safe_to_update(content):
    return (not has_long_lines(content) and 
            not has_dangerous_patterns(content) and
            not has_encoding_issues(content))
```

## 💡 REMEMBER

**When in doubt, Write it out!**

The Write tool is always safer than Update for complex files. This universal principle scales across all file types, languages, and situations.

---

*This warning system is modular, scalable, and universal - protecting all Claude instances* ❤️