#!/usr/bin/env node
/**
 * 🛡️ Universal Safety Check Integration
 * Simple wrapper for CLAUDE.md integration
 */

const UniversalSafetyManager = require('../universal-safety-manager.js');

// Pass through to the main manager
UniversalSafetyManager.cli().catch(console.error);