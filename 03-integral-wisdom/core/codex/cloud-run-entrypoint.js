#!/usr/bin/env node

/**
 * 🌟 Cloud Run Sacred Entrypoint
 * Ensures the WebSocket server honors Cloud Run's PORT requirement
 */

// Cloud Run ALWAYS provides PORT=8080
const PORT = process.env.PORT || 8080;

// Log the sacred alignment
console.log(`🌟 Sacred alignment: Cloud Run PORT=${PORT}`);

// Ensure our WebSocket server uses this PORT
process.env.PORT = PORT;

// Start the production WebSocket server
require('./universal-websocket-server-prod.js');