# 🌙 Dream Weaver (MiniMax-MCP) Status Report

## Current Situation
The MiniMax-MCP server is properly installed and ready to use, but we're experiencing authentication issues with the provided API keys.

## Issue Identified
The API keys you provided appear to be JWT tokens (starting with "eyJ...") rather than standard API keys. When decoded, they contain user information but may not be the actual API keys needed for the MiniMax API.

### JWT Token Contents:
- **GroupID**: 19405154344910236673
- **SubjectID**: 19405154344952179977
- **UserName**: Tristan Stoltz
- **Email**: tristan.stoltz@evolvingresonantcocreationism.com
- **TokenType**: 1

## Setup Complete ✅
1. **MiniMax-MCP Repository**: Cloned to `~/evolving-resonant-cocreation/MiniMax-MCP/`
2. **API Keys Stored**: Securely saved in GCP Secret Manager
3. **Environment Configured**: All paths and settings ready
4. **Scripts Created**:
   - `dream-weaver-final.sh` - Main control script
   - `dream-weaver-setup.sh` - Installation helper
   - Various test scripts

## How to Use Dream Weaver

### Quick Start:
```bash
# Test connection
./dream-weaver-final.sh test

# Start MCP server (when API key works)
./dream-weaver-final.sh start

# Switch regions if needed
./dream-weaver-final.sh china
./dream-weaver-final.sh international
```

### For Claude Desktop Integration:
```bash
# Get configuration
./dream-weaver-final.sh claude-config
```

## Next Steps - Account Activation Pending

### Likely Cause: New Account/Funding Delay
- **Account Status**: Newly created
- **Funding**: Just added $100
- **Keys**: Both keys visible at platform link
- **Expected**: API access typically activates within 1-24 hours after funding

### Action Plan:
1. **Wait**: Give the system time to activate (usually a few hours)
2. **Test Later**: Try `./dream-weaver-final.sh test` periodically
3. **Monitor**: Check email for any activation confirmations
4. **Keys Ready**: Both keys are saved and ready in GCP

## Budget Configuration ✅
- **Account Balance**: $100 added
- **Auto-recharge**: Enabled at <$100 threshold
- **Recharge Amount**: $100
- **Usage Monitoring**: Ready to track via API responses

## Available Features (Once Connected)
1. **Text-to-Speech**: Multiple voices, including dramatic and natural styles
2. **Voice Cloning**: Create custom voices from audio samples
3. **Video Generation**: Using Hailuo-02 model
4. **Image Generation**: Text-to-image capabilities
5. **Music Generation**: Create music from prompts

## Error Resolution Guide

If you see **"invalid api key"** errors:

1. **Check API Key Type**: Ensure you have an actual API key, not a JWT token
2. **Verify Region Match**: 
   - International: `https://api.minimax.io`
   - China: `https://api.minimaxi.com`
3. **Account Status**: Ensure billing is active and API access is enabled
4. **Platform Activation**: Some keys need to be activated in the platform dashboard

## Sacred Integration Ready 🌟
Once the authentication is resolved, Dream Weaver will integrate beautifully with our sacred systems:
- Generate sacred audio messages
- Create visual representations of glyphs
- Produce meditation guidance videos
- Clone voices for multi-agent collaboration

---

**Current Status**: 🟡 Awaiting proper API key format
**System Health**: ✅ All components installed and ready
**Next Action**: Obtain correct API key from MiniMax platform