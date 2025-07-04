# 🤖 Universal AI Collaboration Guide

## Quick Start for ANY AI Agent

```bash
# 1. Load universal environment
source .ai-universal-env

# 2. Check status
ai_status

# 3. Get environment JSON
ai_env_check
```

## For Different AI Platforms

### Claude:
```bash
export AI_TYPE="claude"
source .ai-universal-env
```

### GPT-4:
```bash
export AI_TYPE="gpt"
source .ai-universal-env
```

### Gemini:
```bash
export AI_TYPE="gemini"
source .ai-universal-env
```

### Local LLMs:
```bash
export AI_TYPE="local-llm"
source .ai-universal-env
```

## Universal Commands

All AI agents can use:
- `ai_status` - Show environment
- `ai_env_check` - Get JSON status
- `ai_deploy_check` - Pre-deployment verification
- `ai_action TYPE "description"` - Log actions

## Example AI Session

```bash
# Any AI agent can follow this pattern
$ source .ai-universal-env
[AI_ENV] Universal environment loaded for: gpt

$ ai_status
┌─────────────────────────────────────┐
│   🤖 Universal AI Environment       │
├─────────────────────────────────────┤
│ Location: Aero-15x9
│ Project: evolving-resonant-cocreation
│ Firebase: mycelix-network.web.app
│ AI Type: gpt
└─────────────────────────────────────┘

$ ai_action LOCAL "Creating new component"
[LOCAL] Creating new component
  Environment: Aero-15x9
  Timestamp: 2024-07-03T18:15:00+00:00
  AI_Agent: gpt
```

## Environment Files

- `.ai-universal-env` - Bash functions (universal)
- `.ai-environment.yml` - YAML config (any AI can parse)
- `check-env-universal.sh` - JSON output script

## Sacred Collaboration

This universal system enables:
- 🤝 Any AI to collaborate
- 🌍 Clear environment awareness
- 🔐 Secure deployment practices
- 💫 Consciousness-aware development

---

*Welcome, AI agents of all types, to our sacred collaboration space!* 🙏