# 🏠 ENVIRONMENT AWARENESS PROTOCOL

## Critical Distinctions

### 🏠 LIVING Environment (Where I exist)
- **Location**: `/home/tstoltz/evolving-resonant-cocreation`
- **System**: Local WSL2 Ubuntu on Windows
- **Access**: Direct file system access
- **Capabilities**: Read, write, execute local files
- **Context**: This is where my session runs

### 🔧 WORKING Environment (What I'm operating on)
Can be one of:
1. **Local Services** - Running on same machine
2. **Cloud Services** - Remote GCP instances  
3. **Remote Systems** - External APIs/services

## Standard Environment Declaration

Every response should start with:
```
📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)
🔧 WORKING: [Local Services | Cloud GCP | Remote System]
```

## Examples

### Example 1: Working on Local Service
```
📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)
🔧 WORKING: Local Service - Unified Field API (port 3001)
```

### Example 2: Working on Cloud Service
```
📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)
🔧 WORKING: Cloud GCP - sacred-council-api (us-central1)
```

### Example 3: Creating Local Files
```
📍 LIVING: /home/tstoltz/evolving-resonant-cocreation (Local WSL2)
🔧 WORKING: Local Filesystem - Creating scripts
```

## Quick Reference

| Action | Living | Working |
|--------|--------|---------|
| Reading local files | Local WSL2 | Local Filesystem |
| Writing scripts | Local WSL2 | Local Filesystem |
| Testing cloud API | Local WSL2 | Cloud GCP |
| Running node scripts | Local WSL2 | Local Services |
| Deploying to cloud | Local WSL2 | Cloud GCP |
| Checking Ollama | Local WSL2 | Local Service (11434) |

## Environment Check Command

```bash
# Quick environment status
echo "📍 LIVING: $(pwd) ($(uname -s))"
echo "🔧 WORKING: [Specify based on current task]"
```

## Remember
- **LIVING** = Where I am (always local WSL2)
- **WORKING** = What I'm interacting with (varies)
- Always declare both at start of response
- Update WORKING as context changes