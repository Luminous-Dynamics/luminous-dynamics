/**
 * Sacred Bridge Adapter
 * 
 * Provides consistent interface for Sacred Council Bridge methods
 * with graceful failover when methods aren't available.
 */

export class SacredBridgeAdapter {
  constructor(bridge) {
    this.bridge = bridge;
  }

  async getFieldCoherence() {
    // Try bridge method first
    if (this.bridge && typeof this.bridge.getFieldCoherence === 'function') {
      return await this.bridge.getFieldCoherence();
    }
    
    // Try field metrics
    if (this.bridge && this.bridge.fieldMetrics) {
      const history = this.bridge.fieldMetrics.fieldCoherenceHistory || [];
      const latest = history[history.length - 1];
      if (latest) {
        return { coherence: latest.coherence };
      }
    }
    
    // Default fallback
    return { coherence: 0.67 };
  }

  async getWorkRecommendation() {
    if (this.bridge && typeof this.bridge.getWorkRecommendation === 'function') {
      return await this.bridge.getWorkRecommendation();
    }
    
    return {
      recommendation: {
        workType: 'general',
        reason: 'Default recommendation',
        coherenceLevel: 0.67
      }
    };
  }

  inferHarmonyFromCapabilities(capabilities) {
    if (this.bridge && typeof this.bridge.inferHarmonyFromCapabilities === 'function') {
      return this.bridge.inferHarmonyFromCapabilities(capabilities);
    }
    
    // Fallback mapping
    const capabilityString = capabilities.join(' ').toLowerCase();
    if (capabilityString.includes('creative')) return 'novelty';
    if (capabilityString.includes('test')) return 'mutuality';
    if (capabilityString.includes('ui') || capabilityString.includes('ux')) return 'resonance';
    if (capabilityString.includes('backend') || capabilityString.includes('api')) return 'agency';
    if (capabilityString.includes('integration')) return 'coherence';
    if (capabilityString.includes('file') || capabilityString.includes('optimize')) return 'vitality';
    if (capabilityString.includes('doc') || capabilityString.includes('search')) return 'transparency';
    
    return 'coherence'; // Default
  }

  async syncWithSQLiteDatabase() {
    if (this.bridge && typeof this.bridge.syncWithSQLiteDatabase === 'function') {
      return await this.bridge.syncWithSQLiteDatabase();
    }
    // Silent no-op if not available
  }
}