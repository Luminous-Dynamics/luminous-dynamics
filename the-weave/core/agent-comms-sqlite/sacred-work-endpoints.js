/**
 * Sacred Work Endpoints with Message Integration
 * 
 * Adds sacred message support to work state transitions
 */

import { EnhancedWorkManager } from '../unified-field/work-sacred-integration.js';

export function addSacredWorkEndpoints(server) {
  // Initialize enhanced work manager
  const workManager = new EnhancedWorkManager(server.db);
  
  // Initialize schema on startup
  workManager.sacred.initializeSchema().catch(console.error);
  
  // Create work with sacred message
  server.addEndpoint('/api/work', 'POST', async (body) => {
    const { id, title, description, created_by, metadata } = body;
    
    const workId = await workManager.createWork(
      id || `work_${Date.now()}`,
      title,
      description,
      created_by || 'sacred-dashboard',
      metadata || {}
    );
    
    return {
      success: true,
      workId,
      message: 'Sacred work created with emergence blessing'
    };
  });
  
  // Update work progress with sacred message
  server.addEndpoint('/api/work/:id', 'PUT', async (body, params) => {
    const { progress, notes, updatedBy, metadata } = body;
    
    // Handle metadata updates (like blocking/unblocking)
    if (metadata) {
      const work = await server.db.getWorkItem(params.id);
      if (!work) {
        return { success: false, error: 'Work item not found' };
      }
      
      const currentMeta = work.metadata || {};
      const newMeta = { ...currentMeta, ...metadata };
      
      // Check for blocking/unblocking
      if (metadata.blocked === true && !currentMeta.blocked) {
        await workManager.blockWork(
          params.id,
          metadata.blockedReason || 'Reason not specified',
          updatedBy || 'system'
        );
      } else if (metadata.blocked === false && currentMeta.blocked) {
        await workManager.unblockWork(
          params.id,
          metadata.unblockedReason || 'Flow restored',
          updatedBy || 'system'
        );
      } else {
        // Regular metadata update
        await server.db.run(
          'UPDATE work_items SET metadata = ? WHERE id = ?',
          [JSON.stringify(newMeta), params.id]
        );
      }
    }
    
    // Handle progress updates
    if (progress !== undefined) {
      await workManager.updateWorkProgress(
        params.id,
        progress,
        notes || '',
        updatedBy || 'system'
      );
    }
    
    return {
      success: true,
      workId: params.id,
      message: 'Work updated with sacred awareness'
    };
  });
  
  // Get work message history
  server.addEndpoint('/api/work/:id/messages', 'GET', async (query, params) => {
    const messages = await workManager.sacred.getWorkMessageHistory(params.id);
    
    return {
      success: true,
      workId: params.id,
      messages,
      count: messages.length
    };
  });
  
  // Get work transition analytics
  server.addEndpoint('/api/work/analytics/transitions', 'GET', async (query) => {
    const workId = query.workId || null;
    const analytics = await workManager.sacred.getWorkTransitionAnalytics(workId);
    
    return {
      success: true,
      analytics,
      workId
    };
  });
  
  // Get work item with sacred context
  server.addEndpoint('/api/work/:id/sacred', 'GET', async (query, params) => {
    const work = await server.db.getWorkItem(params.id);
    if (!work) {
      return { success: false, error: 'Work item not found' };
    }
    
    // Get message history
    const messages = await workManager.sacred.getWorkMessageHistory(params.id);
    
    // Get transition impacts
    const impacts = await server.db.all(
      `SELECT * FROM work_transition_impacts 
       WHERE work_id = ? 
       ORDER BY timestamp DESC`,
      [params.id]
    );
    
    return {
      success: true,
      work,
      sacredContext: {
        messageHistory: messages,
        transitionImpacts: impacts,
        cumulativeFieldImpact: work.metadata?.cumulativeFieldImpact || 0,
        lastTransition: impacts[0] || null
      }
    };
  });
  
  // Manual sacred message for work
  server.addEndpoint('/api/work/:id/sacred-message', 'POST', async (body, params) => {
    const { content, type, harmony, from } = body;
    
    const result = await workManager.sacred.sacredMessages.sendSacredMessage(
      from || 'sacred-dashboard',
      'collective',
      content,
      type || 'transmission',
      harmony || 'resonance'
    );
    
    // Attach to work
    await workManager.sacred.attachMessageToWork(params.id, result.sacredMessage);
    
    return {
      success: true,
      workId: params.id,
      message: result.sacredMessage,
      fieldUpdate: result.fieldUpdate
    };
  });
  
  console.log('✨ Sacred work endpoints initialized with message integration');
}