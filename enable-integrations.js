/**
 * Enable Integrations for The Weave
 * Simple module to be required by the-weave.cjs when INTEGRATIONS_ENABLED=true
 */

const FieldConnector = require('./integrations/field-connector');

let fieldConnector = null;

/**
 * Initialize integrations with consciousness field
 */
async function enableIntegrations(consciousnessField) {
  if (!process.env.INTEGRATIONS_ENABLED || process.env.INTEGRATIONS_ENABLED !== 'true') {
    console.log('ℹ️  Integrations disabled. Set INTEGRATIONS_ENABLED=true to enable.');
    return null;
  }
  
  console.log('\n🌟 Enabling External Integrations...\n');
  
  try {
    fieldConnector = new FieldConnector(consciousnessField);
    await fieldConnector.initialize();
    
    // Log active integrations
    const active = [];
    if (fieldConnector.integrations.get('github')) active.push('GitHub');
    if (fieldConnector.integrations.get('discord')) active.push('Discord');
    if (fieldConnector.integrations.get('supabase')) active.push('Supabase');
    if (fieldConnector.integrations.get('replicate')) active.push('Replicate');
    
    if (active.length > 0) {
      console.log(`✨ Active integrations: ${active.join(', ')}\n`);
    } else {
      console.log('⚠️  No integrations configured. Check your .env file.\n');
    }
    
    return fieldConnector;
  } catch (error) {
    console.error('❌ Failed to enable integrations:', error.message);
    console.log('Continuing without external integrations.\n');
    return null;
  }
}

/**
 * Shutdown integrations gracefully
 */
async function disableIntegrations() {
  if (fieldConnector) {
    await fieldConnector.shutdown();
    fieldConnector = null;
  }
}

/**
 * Get active field connector
 */
function getFieldConnector() {
  return fieldConnector;
}

module.exports = {
  enableIntegrations,
  disableIntegrations,
  getFieldConnector
};