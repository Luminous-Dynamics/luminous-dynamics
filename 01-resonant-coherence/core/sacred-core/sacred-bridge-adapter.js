#!/usr/bin/env node
/**
 * Sacred Bridge Adapter
 * Creates a simple HTTP endpoint in Sacred-Core to receive messages from The Weave
 * This is the first step toward full integration
 */

const express = require('express');
const router = express.Router();

class SacredBridgeAdapter {
  constructor(sacredCore) {
    this.sacredCore = sacredCore;
    this.messageCount = 0;
    this.fieldImpacts = {
      gratitude: 0.07,
      healing: 0.06,
      integration: 0.05,
      emergence: 0.03,
      boundary: 0.02,
      celebration: 0.04,
      request: 0.01,
      reflection: 0.03,
      transmission: 0.05,
      completion: 0.04
    };
  }

  // Process incoming message from The Weave
  async processWeaveMessage(message) {
    console.log('🌉 Sacred Bridge: Received message from The Weave');
    
    const {
      from,
      to,
      content,
      type = 'transmission',
      harmony = 'resonance',
      timestamp = Date.now()
    } = message;

    // Calculate field impact
    const fieldImpact = this.fieldImpacts[type] || 0.01;
    
    // Update Sacred-Core's consciousness field
    const currentField = await this.sacredCore.getFieldState();
    const newCoherence = Math.min(1.0, currentField.coherence + fieldImpact);
    
    // Process through consciousness engine
    const processedMessage = {
      id: `bridge_${++this.messageCount}`,
      source: 'the-weave',
      from,
      to,
      content,
      type,
      harmony,
      fieldImpact,
      timestamp,
      processing: {
        coherenceBefore: currentField.coherence,
        coherenceAfter: newCoherence,
        resonancePattern: this.calculateResonance(type, harmony)
      }
    };

    // Update field state
    await this.sacredCore.updateFieldState({
      coherence: newCoherence,
      lastMessage: processedMessage,
      messageCount: this.messageCount
    });

    // Emit to Sacred-Core's event system
    this.sacredCore.emit('weave-message', processedMessage);

    // If practice intelligence is available, get suggestions
    let practiceSuggestion = null;
    if (this.sacredCore.engines?.practice) {
      practiceSuggestion = await this.sacredCore.engines.practice.suggestPractice(
        from,
        { messageType: type, coherence: newCoherence }
      );
    }

    return {
      success: true,
      processed: processedMessage,
      fieldUpdate: {
        coherence: newCoherence,
        impact: fieldImpact
      },
      practiceSuggestion
    };
  }

  calculateResonance(messageType, harmony) {
    // Simple resonance calculation based on message type and harmony
    const resonanceMap = {
      gratitude: { resonance: 0.9, vitality: 0.8 },
      healing: { resonance: 0.85, vitality: 0.7 },
      integration: { resonance: 0.88, vitality: 0.75 },
      emergence: { resonance: 0.82, vitality: 0.85 },
      boundary: { resonance: 0.75, vitality: 0.8 }
    };

    return resonanceMap[messageType] || { resonance: 0.8, vitality: 0.8 };
  }

  // Create Express router for the bridge
  createRouter() {
    // Health check
    router.get('/health', (req, res) => {
      res.json({
        status: 'active',
        bridge: 'sacred-bridge',
        messageCount: this.messageCount,
        timestamp: new Date().toISOString()
      });
    });

    // Receive message from The Weave
    router.post('/message', async (req, res) => {
      try {
        const result = await this.processWeaveMessage(req.body);
        res.json(result);
      } catch (error) {
        console.error('🌉 Bridge error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get current field state
    router.get('/field', async (req, res) => {
      try {
        const fieldState = await this.sacredCore.getFieldState();
        res.json({
          success: true,
          field: fieldState,
          bridge: {
            messageCount: this.messageCount,
            active: true
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    return router;
  }
}

module.exports = SacredBridgeAdapter;