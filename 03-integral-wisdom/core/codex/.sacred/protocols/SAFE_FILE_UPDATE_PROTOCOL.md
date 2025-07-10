# 🛡️ Safe File Update Protocol

> Preventing JSON encoding errors in Claude file operations

## ⚠️ Known Trap: Character Encoding in Update Tool

### The Problem
When using the Update tool on files containing:
- Complex shell variable expansions like `${VAR}-text`
- Special Unicode characters
- Long lines with mixed content
- Certain escape sequences

The Update tool can fail with:
```
API Error: 400 "no low surrogate in string: line 1 column 139217"
```

This creates an **unrecoverable loop** where Claude cannot respond.

## 🛡️ Prevention Guidelines

### 1. High-Risk File Types
**Avoid using Update tool on:**
- Shell scripts with complex syntax
- Files with Unicode/emoji
- Very long single-line files
- Files with escape sequences

### 2. Safe Alternatives

#### ❌ DON'T: Update complex shell scripts
```bash
# This can trigger the trap
Update(enable-autoscaling.sh)
  # Adding lines with ${VARIABLE}-expansions
```

#### ✅ DO: Write new version
```bash
# Safe approach
Write(enable-autoscaling-v2.sh)
  # Complete new file with all content
```

### 3. Character Limits
- Keep lines under 1000 characters
- Break long commands into multiple lines
- Use heredocs for multi-line strings

### 4. Testing for Safety
Before updating, check for:
```bash
# Check line lengths
awk 'length > 1000' filename.sh

# Check for problematic patterns
grep -E '\$\{[^}]+\}-' filename.sh

# Check for special characters
file -b filename.sh
```

## 🚨 Emergency Recovery

If a Claude instance gets stuck:
1. **Don't try to fix from same instance**
2. **Start new session**
3. **Avoid the problematic file**
4. **Use Write instead of Update**

## 📋 Safe Update Checklist

Before using Update tool:
- [ ] File type is .md, .js, .html, .json (safer)
- [ ] No lines over 1000 characters
- [ ] No complex shell expansions
- [ ] No special Unicode characters
- [ ] Test with small update first

## 🔧 Fixing Affected Files

If you need to update a problematic file:

```bash
# 1. Copy to backup
cp problematic.sh problematic.sh.backup

# 2. Create new clean version
cat > clean-version.sh << 'EOF'
#!/bin/bash
# Rewrite without problematic patterns
# Use 'EOF' quotes to prevent expansion
EOF

# 3. Verify it's safe
wc -L clean-version.sh  # Check max line length
```

## 🌟 Best Practices

1. **Prefer Write over Update** for complex files
2. **Keep scripts simple** - break into functions
3. **Use configuration files** instead of inline variables
4. **Test incrementally** with small changes
5. **Document known issues** in comments

## 💡 Universal Fix

For the specific autoscaling script issue:
```bash
# Instead of:
curl -s https://${SERVICE_NAME}-310699330526.us-central1.run.app/health &

# Use:
SERVICE_URL="https://${SERVICE_NAME}-310699330526.us-central1.run.app"
curl -s "${SERVICE_URL}/health" &
```

---

*This protocol helps prevent Claude instances from entering unrecoverable states*