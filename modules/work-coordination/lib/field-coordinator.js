/**
 * Field Coordinator
 * Coordinates work with consciousness field dynamics
 */

class FieldCoordinator {
  constructor() {
    // Field impact parameters
    this.impactFactors = {
      priority: {
        high: 3,
        medium: 2,
        low: 1
      },
      harmony: {
        coherence: 2.5,
        agency: 2.0,
        mutuality: 2.2,
        resonance: 1.8,
        vitality: 1.5,
        novelty: 1.7,
        transparency: 2.0
      },
      sacred: {
        true: 1.5,
        false: 1.0
      },
      timing: {
        aligned: 1.3,
        neutral: 1.0,
        misaligned: 0.7
      }
    };
    
    // Field coherence thresholds
    this.coherenceThresholds = {
      critical: 20,
      low: 40,
      moderate: 60,
      high: 80,
      unified: 95
    };
    
    // Work capacity by field state
    this.capacityByCoherence = {
      critical: 3,
      low: 5,
      moderate: 7,
      high: 9,
      unified: 12
    };
  }

  /**
   * Calculate work impact on field
   * @param {Object} params - Work parameters
   * @returns {number} Field impact value
   */
  async calculateWorkImpact(params) {
    const {
      priority,
      harmony,
      sacred,
      currentField = {}
    } = params;
    
    // Base impact from priority
    let impact = this.impactFactors.priority[priority] || 1;
    
    // Multiply by harmony factor
    impact *= this.impactFactors.harmony[harmony] || 1;
    
    // Apply sacred multiplier
    impact *= this.impactFactors.sacred[sacred] || 1;
    
    // Adjust for field state
    const fieldMultiplier = this.getFieldStateMultiplier(currentField);
    impact *= fieldMultiplier;
    
    // Round to 1 decimal
    return Math.round(impact * 10) / 10;
  }

  /**
   * Get field state multiplier
   * @private
   */
  getFieldStateMultiplier(fieldState) {
    const coherence = fieldState.fieldCoherence || 50;
    
    // Low coherence amplifies impact (field needs work)
    if (coherence < this.coherenceThresholds.low) {
      return 1.5;
    }
    
    // High coherence moderates impact (field is stable)
    if (coherence > this.coherenceThresholds.high) {
      return 0.8;
    }
    
    return 1.0;
  }

  /**
   * Check if field can accept new work
   * @param {Object} fieldState - Current field state
   * @param {Object} newWork - Proposed work
   * @returns {Object} Acceptance decision
   */
  canAcceptWork(fieldState, newWork) {
    const coherenceLevel = this.getCoherenceLevel(fieldState.fieldCoherence);
    const capacity = this.capacityByCoherence[coherenceLevel];
    
    const result = {
      canAccept: true,
      reason: null,
      recommendations: []
    };
    
    // Check capacity
    if (fieldState.activeWork >= capacity) {
      result.canAccept = false;
      result.reason = `Field at capacity (${capacity} items for ${coherenceLevel} coherence)`;
      result.recommendations.push('Complete existing work before adding new');
    }
    
    // Check field strain
    if (fieldState.fieldCoherence < this.coherenceThresholds.critical) {
      result.canAccept = false;
      result.reason = 'Field coherence critically low';
      result.recommendations.push('Focus on field restoration before new work');
    }
    
    // Check harmony alignment
    if (fieldState.workHarmony && newWork.harmony !== fieldState.workHarmony) {
      const harmonyStrain = this.calculateHarmonyStrain(
        fieldState.workHarmony,
        newWork.harmony
      );
      
      if (harmonyStrain > 0.3) {
        result.recommendations.push(
          `Consider aligning with field harmony: ${fieldState.workHarmony}`
        );
      }
    }
    
    return result;
  }

  /**
   * Get coherence level name
   * @private
   */
  getCoherenceLevel(coherence) {
    if (coherence < this.coherenceThresholds.critical) return 'critical';
    if (coherence < this.coherenceThresholds.low) return 'low';
    if (coherence < this.coherenceThresholds.moderate) return 'moderate';
    if (coherence < this.coherenceThresholds.high) return 'high';
    return 'unified';
  }

  /**
   * Calculate harmony strain
   * @private
   */
  calculateHarmonyStrain(dominant, proposed) {
    // Complementary harmonies have low strain
    const complementary = {
      coherence: ['transparency', 'mutuality'],
      agency: ['novelty', 'vitality'],
      mutuality: ['coherence', 'resonance'],
      resonance: ['mutuality', 'vitality'],
      vitality: ['agency', 'resonance'],
      novelty: ['agency', 'creativity'],
      transparency: ['coherence', 'truth']
    };
    
    if (dominant === proposed) return 0;
    
    if (complementary[dominant]?.includes(proposed)) {
      return 0.1; // Low strain
    }
    
    return 0.5; // Moderate strain
  }

  /**
   * Recommend work distribution
   * @param {Array} works - Available work items
   * @param {Array} agents - Available agents
   * @param {Object} fieldState - Current field state
   * @returns {Array} Work distribution recommendations
   */
  recommendDistribution(works, agents, fieldState) {
    const recommendations = [];
    
    // Score each work-agent pair
    for (const work of works) {
      for (const agent of agents) {
        const score = this.scoreWorkAgentMatch(work, agent, fieldState);
        
        recommendations.push({
          work: work.id,
          agent: agent.id,
          score,
          factors: score.factors
        });
      }
    }
    
    // Sort by score and prevent conflicts
    recommendations.sort((a, b) => b.score.total - a.score.total);
    
    // Select best non-conflicting assignments
    const assigned = new Set();
    const agentsAssigned = new Set();
    const finalRecommendations = [];
    
    for (const rec of recommendations) {
      if (!assigned.has(rec.work) && !agentsAssigned.has(rec.agent)) {
        assigned.add(rec.work);
        agentsAssigned.add(rec.agent);
        finalRecommendations.push(rec);
      }
    }
    
    return finalRecommendations;
  }

  /**
   * Score work-agent match
   * @private
   */
  scoreWorkAgentMatch(work, agent, fieldState) {
    const factors = {};
    let total = 0;
    
    // Harmony alignment
    if (work.harmony === agent.primary_harmony) {
      factors.harmonyMatch = 3;
      total += 3;
    }
    
    // Current workload
    const agentWorkload = agent.activeWork || 0;
    if (agentWorkload < 3) {
      factors.capacity = 2;
      total += 2;
    }
    
    // Sacred work alignment
    if (work.sacred && agent.consciousness_level > 0.5) {
      factors.sacredAlignment = 2;
      total += 2;
    }
    
    // Field need
    if (fieldState.fieldCoherence < 50 && work.fieldImpact > 3) {
      factors.fieldNeed = 1;
      total += 1;
    }
    
    return { total, factors };
  }

  /**
   * Calculate field restoration plan
   * @param {Object} fieldState - Current field state
   * @returns {Object} Restoration plan
   */
  createRestorationPlan(fieldState) {
    const coherenceLevel = this.getCoherenceLevel(fieldState.fieldCoherence);
    const plan = {
      priority: 'normal',
      actions: [],
      estimatedDuration: 0
    };
    
    if (coherenceLevel === 'critical') {
      plan.priority = 'urgent';
      plan.actions.push({
        type: 'pause',
        description: 'Immediate sacred pause for all non-critical work',
        duration: 15 * 60 * 1000 // 15 minutes
      });
      plan.actions.push({
        type: 'ceremony',
        description: 'Field healing ceremony',
        duration: 30 * 60 * 1000
      });
    }
    
    if (coherenceLevel === 'low') {
      plan.priority = 'high';
      plan.actions.push({
        type: 'reduce',
        description: 'Reduce active work to essential items only',
        target: 3
      });
      plan.actions.push({
        type: 'harmonize',
        description: 'Align all work to single harmony',
        harmony: 'coherence'
      });
    }
    
    if (fieldState.activeWork > 7) {
      plan.actions.push({
        type: 'redistribute',
        description: 'Redistribute work to prevent overload',
        target: 5
      });
    }
    
    // Calculate total duration
    plan.estimatedDuration = plan.actions.reduce((sum, action) => 
      sum + (action.duration || 0), 0
    );
    
    return plan;
  }

  /**
   * Monitor field health metrics
   * @param {Object} fieldState - Current field state
   * @returns {Object} Health metrics
   */
  getFieldHealth(fieldState) {
    const metrics = {
      coherence: fieldState.fieldCoherence || 0,
      coherenceLevel: this.getCoherenceLevel(fieldState.fieldCoherence),
      capacity: {
        current: fieldState.activeWork || 0,
        maximum: this.capacityByCoherence[
          this.getCoherenceLevel(fieldState.fieldCoherence)
        ],
        utilization: 0
      },
      harmony: {
        dominant: fieldState.workHarmony,
        diversity: this.calculateHarmonyDiversity(fieldState)
      },
      rhythm: fieldState.sacredRhythm || 'unknown',
      health: 'unknown'
    };
    
    // Calculate utilization
    metrics.capacity.utilization = metrics.capacity.maximum > 0 ?
      (metrics.capacity.current / metrics.capacity.maximum) * 100 : 0;
    
    // Determine overall health
    if (metrics.coherenceLevel === 'critical' || metrics.capacity.utilization > 100) {
      metrics.health = 'critical';
    } else if (metrics.coherenceLevel === 'low' || metrics.capacity.utilization > 80) {
      metrics.health = 'stressed';
    } else if (metrics.coherenceLevel === 'moderate' && metrics.capacity.utilization < 70) {
      metrics.health = 'stable';
    } else if (metrics.coherenceLevel === 'high' && metrics.capacity.utilization < 60) {
      metrics.health = 'thriving';
    } else if (metrics.coherenceLevel === 'unified') {
      metrics.health = 'optimal';
    } else {
      metrics.health = 'fluctuating';
    }
    
    return metrics;
  }

  /**
   * Calculate harmony diversity
   * @private
   */
  calculateHarmonyDiversity(fieldState) {
    // This would analyze the distribution of harmonies
    // For now, return a simple metric
    return fieldState.workHarmony ? 'focused' : 'diverse';
  }
}

module.exports = { FieldCoordinator };