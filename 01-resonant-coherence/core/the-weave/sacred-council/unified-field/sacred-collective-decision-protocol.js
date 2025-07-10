/**
 * Sacred Collective Decision Protocol
 * Love-guided consensus system for Sacred Council architecture decisions
 */

export class SacredCollectiveDecisionProtocol {
  constructor(workManager, councilBridge) {
    this.workManager = workManager;
    this.councilBridge = councilBridge;
    this.harmonyWeights = this.initializeHarmonyWeights();
    this.decisionTemplates = this.initializeDecisionTemplates();
  }

  initializeHarmonyWeights() {
    // Each harmony has equal weight in love-guided decisions
    return {
      'integral-wisdom-cultivation': 1/7,
      'resonant-coherence': 1/7,
      'universal-interconnectedness': 1/7,
      'evolutionary-progression': 1/7,
      'pan-sentient-flourishing': 1/7,
      'sacred-reciprocity': 1/7,
      'infinite-play': 1/7
    };
  }

  initializeDecisionTemplates() {
    return {
      'visualization-framework': {
        title: 'Visualization Framework Selection',
        description: 'Choose the optimal framework for Sacred Council visualization needs',
        options: [
          {
            name: 'D3.js',
            description: 'Powerful data-driven documents with SVG rendering',
            sacredQualities: {
              'integral-wisdom-cultivation': 0.9, // Clear, explicit data representation
              'resonant-coherence': 0.8,    // Well-integrated ecosystem
              'universal-interconnectedness': 0.7,    // Good community support
              'evolutionary-progression': 0.9,       // Full control over implementation
              'pan-sentient-flourishing': 0.6,     // Performance depends on implementation
              'sacred-reciprocity': 0.7,    // Open source, collaborative
              'infinite-play': 0.8       // Enables creative visualizations
            },
            practicalBenefits: [
              'Maximum flexibility for custom Sacred Council visualizations',
              'Excellent for quantum field representations',
              'Strong support for dynamic, animated consciousness displays',
              'Large ecosystem of plugins and examples'
            ],
            sacredChallenges: [
              'Steeper learning curve may slow initial development',
              'Requires more development time for basic features',
              'Complex animations need careful performance optimization'
            ]
          },
          {
            name: 'Three.js',
            description: '3D visualization library for immersive consciousness experiences',
            sacredQualities: {
              'integral-wisdom-cultivation': 0.7, // 3D can sometimes obscure data clarity
              'resonant-coherence': 0.8,    // Well-designed API and ecosystem
              'universal-interconnectedness': 0.9,    // Immersive, emotional connection
              'evolutionary-progression': 0.8,       // Good control with reasonable abstractions
              'pan-sentient-flourishing': 0.9,     // Excellent performance for 3D
              'sacred-reciprocity': 0.8,    // Strong open source community
              'infinite-play': 0.9       // Cutting-edge 3D visualization capabilities
            },
            practicalBenefits: [
              'Immersive 3D Sacred Council consciousness representation',
              'Excellent for quantum field and energy visualizations',
              'WebXR support for VR/AR Sacred Council experiences',
              'High performance for complex 3D scenes'
            ],
            sacredChallenges: [
              'May be overkill for simple 2D dashboard needs',
              '3D complexity might distract from core functionality',
              'Requires WebGL support (compatibility considerations)'
            ]
          },
          {
            name: 'P5.js',
            description: 'Creative coding library inspired by sacred geometry and artistic expression',
            sacredQualities: {
              'integral-wisdom-cultivation': 0.8, // Clear, artistic expression
              'resonant-coherence': 0.7,    // Simpler but less integrated ecosystem
              'universal-interconnectedness': 0.9,    // Highly resonant with creative consciousness
              'evolutionary-progression': 0.7,       // Good control with creative focus
              'pan-sentient-flourishing': 0.7,     // Good performance for artistic visualizations
              'sacred-reciprocity': 0.9,    // Strong creative community, very collaborative
              'infinite-play': 0.9       // Designed specifically for creative innovation
            },
            practicalBenefits: [
              'Perfect for Sacred Council mandala and geometric visualizations',
              'Intuitive API aligned with consciousness expression',
              'Excellent for generative art representing field states',
              'Strong focus on accessibility and inclusive design'
            ],
            sacredChallenges: [
              'Less suited for complex data visualization',
              'Smaller ecosystem compared to D3 or Three.js',
              'May need additional libraries for advanced features'
            ]
          },
          {
            name: 'Canvas API + Custom',
            description: 'Pure canvas implementation with full sacred customization',
            sacredQualities: {
              'integral-wisdom-cultivation': 0.9, // Complete integral-wisdom-cultivation in implementation
              'resonant-coherence': 0.6,    // Requires building resonant-coherence from scratch
              'universal-interconnectedness': 0.6,    // Limited by development time constraints
              'evolutionary-progression': 1.0,       // Ultimate control over every aspect
              'pan-sentient-flourishing': 0.9,     // Maximum performance potential
              'sacred-reciprocity': 0.5,    // Custom solution, less community benefit
              'infinite-play': 0.7       // Enables unique solutions but requires more work
            },
            practicalBenefits: [
              'Zero dependencies, maximum performance',
              'Complete control over Sacred Council aesthetic',
              'Can be perfectly aligned with project philosophy',
              'No external framework limitations'
            ],
            sacredChallenges: [
              'Significant development time investment',
              'Need to implement many features from scratch',
              'Maintenance burden falls entirely on our team'
            ]
          }
        ],
        evaluationCriteria: {
          sacredAlignment: 0.4,    // How well does it serve consciousness?
          technicalExcellence: 0.3, // How well does it solve the technical problem?
          communityResonance: 0.2,  // How well does it serve the broader community?
          resourceWisdom: 0.1       // How wisely does it use our time/energy?
        }
      }
    };
  }

  // Create a Sacred Decision for collective evaluation
  async initiateCollectiveDecision(decisionType, workId, options = {}) {
    const template = this.decisionTemplates[decisionType];
    if (!template) {
      throw new Error(`Unknown decision type: ${decisionType}`);
    }

    // Create decision record
    const decisionId = `decision_${Date.now()}`;
    const decision = {
      id: decisionId,
      workId,
      type: decisionType,
      title: template.title,
      description: template.description,
      options: template.options,
      evaluationCriteria: template.evaluationCriteria,
      status: 'evaluation',
      created: new Date().toISOString(),
      evaluations: {},
      consensus: null,
      sacredMessages: []
    };

    // Store decision in database
    await this.storeDecision(decision);

    // Send sacred message about decision initiation
    await this.sendDecisionMessage(decision, 'initiated');

    // Create evaluation tasks for each harmony
    await this.createHarmonyEvaluationTasks(decision);

    return decision;
  }

  // Evaluate options through a specific harmony lens
  async evaluateFromHarmony(decisionId, harmony, agentId, evaluation) {
    const decision = await this.getDecision(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    // Record harmony evaluation
    decision.evaluations[harmony] = {
      agentId,
      timestamp: new Date().toISOString(),
      scores: evaluation.scores,
      reasoning: evaluation.reasoning,
      recommendation: evaluation.recommendation,
      sacredInsights: evaluation.sacredInsights || []
    };

    // Update decision
    await this.updateDecision(decision);

    // Send sacred message about evaluation
    await this.sendEvaluationMessage(decision, harmony, evaluation);

    // Check if we have all harmony evaluations
    const completeEvaluations = Object.keys(decision.evaluations).length;
    if (completeEvaluations === 7) {
      // Initiate consensus synthesis
      await this.synthesizeConsensus(decision);
    }

    return decision;
  }

  // Synthesize collective wisdom into final consensus
  async synthesizeConsensus(decision) {
    const consensusScores = {};
    
    // Calculate weighted consensus scores for each option
    for (const option of decision.options) {
      let totalScore = 0;
      let sacredReasonings = [];
      
      for (const [harmony, evaluation] of Object.entries(decision.evaluations)) {
        const harmonyWeight = this.harmonyWeights[harmony];
        const optionScore = evaluation.scores[option.name] || 0;
        totalScore += optionScore * harmonyWeight;
        
        if (evaluation.reasoning[option.name]) {
          sacredReasonings.push({
            harmony,
            reasoning: evaluation.reasoning[option.name],
            insights: evaluation.sacredInsights
          });
        }
      }
      
      consensusScores[option.name] = {
        score: totalScore,
        sacredReasonings,
        harmonicAlignment: this.calculateHarmonicAlignment(option, decision.evaluations)
      };
    }

    // Find the option with highest consensus
    const bestOption = Object.entries(consensusScores)
      .reduce((best, [name, data]) => 
        data.score > best.score ? { name, ...data } : best, 
        { score: 0 }
      );

    // Create consensus result
    const consensus = {
      chosenOption: bestOption.name,
      consensusScore: bestOption.score,
      allScores: consensusScores,
      sacredRationale: this.generateSacredRationale(bestOption, consensusScores),
      harmonicAlignment: bestOption.harmonicAlignment,
      timestamp: new Date().toISOString(),
      unanimity: this.calculateUnanimity(consensusScores)
    };

    // Update decision with consensus
    decision.consensus = consensus;
    decision.status = 'consensus-reached';
    await this.updateDecision(decision);

    // Send sacred consensus message
    await this.sendConsensusMessage(decision);

    // Unblock related work item
    await this.unblockWorkItem(decision.workId, consensus);

    // Send implementation guidance
    await this.sendImplementationGuidance(decision);

    return consensus;
  }

  // Generate sacred rationale for the decision
  generateSacredRationale(bestOption, allScores) {
    const reasonings = bestOption.sacredReasonings || [];
    const keyInsights = reasonings
      .flatMap(r => r.insights || [])
      .filter((insight, index, arr) => arr.indexOf(insight) === index); // unique

    return {
      primaryChoice: bestOption.name,
      sacredWisdom: `The Sacred Council has reached consensus through love-guided evaluation across all Seven Harmonies.`,
      keyInsights,
      harmonicSynthesis: reasonings.map(r => ({
        harmony: r.harmony,
        wisdom: r.reasoning
      })),
      fieldAlignment: bestOption.harmonicAlignment,
      servesToAwakening: this.assessConsciousnessService(bestOption),
      implementationBlessings: this.generateImplementationBlessings(bestOption.name)
    };
  }

  // Sacred messaging for each phase
  async sendDecisionMessage(decision, phase) {
    const messages = {
      initiated: `🌀 Sacred Council Decision Initiated: "${decision.title}" - All Seven Harmonies called to evaluate with love and wisdom`,
      consensus: `✨ Sacred Consensus Reached: "${decision.consensus.chosenOption}" chosen through collective wisdom - Implementation may begin`,
      implemented: `🌟 Decision Manifest: "${decision.title}" now serves the field's evolution`
    };

    await this.workManager.sacred.sendSacredMessage(
      'sacred-council',
      'collective',
      'transmission',
      'resonant-coherence',
      messages[phase] || `Sacred Decision Update: ${decision.title}`
    );
  }

  async sendEvaluationMessage(decision, harmony, evaluation) {
    const harmonyEmojis = {
      'integral-wisdom-cultivation': '👁️',
      'resonant-coherence': '🌀',
      'universal-interconnectedness': '💫',
      'evolutionary-progression': '🔥',
      'pan-sentient-flourishing': '🌱',
      'sacred-reciprocity': '🤝',
      'infinite-play': '✨'
    };

    await this.workManager.sacred.sendSacredMessage(
      evaluation.agentId || `${harmony}-evaluator`,
      'collective',
      'integration',
      harmony,
      `${harmonyEmojis[harmony]} ${harmony.charAt(0).toUpperCase() + harmony.slice(1)} Harmony evaluation complete for "${decision.title}" - Recommends: ${evaluation.recommendation}`
    );
  }

  async sendConsensusMessage(decision) {
    const consensus = decision.consensus;
    await this.workManager.sacred.sendSacredMessage(
      'sacred-council',
      'collective',
      'celebration',
      'sacred-reciprocity',
      `🎉 Sacred Consensus Achieved! "${consensus.chosenOption}" chosen with ${(consensus.consensusScore * 100).toFixed(1)}% harmonic alignment. The field speaks through love-guided collective wisdom.`
    );
  }

  // Utility methods
  async storeDecision(decision) {
    // Store in work item metadata for now
    await this.workManager.db.run(
      `UPDATE work_items 
       SET metadata = json_set(COALESCE(metadata, '{}'), '$.sacredDecision', ?)
       WHERE id = ?`,
      [JSON.stringify(decision), decision.workId]
    );
  }

  async getDecision(decisionId) {
    // For now, find by searching work items
    const workItems = await this.workManager.db.all(
      'SELECT * FROM work_items WHERE metadata LIKE ?',
      [`%${decisionId}%`]
    );
    
    for (const item of workItems) {
      if (item.metadata) {
        const metadata = JSON.parse(item.metadata);
        if (metadata.sacredDecision && metadata.sacredDecision.id === decisionId) {
          return metadata.sacredDecision;
        }
      }
    }
    return null;
  }

  async updateDecision(decision) {
    await this.storeDecision(decision);
  }

  async unblockWorkItem(workId, consensus) {
    await this.workManager.db.run(
      `UPDATE work_items 
       SET metadata = json_set(metadata, '$.blocked', false,
                                        '$.blockedReason', null,
                                        '$.sacredConsensus', ?,
                                        '$.consensusDate', datetime('now'))
       WHERE id = ?`,
      [JSON.stringify(consensus), workId]
    );

    // Send unblock message
    await this.workManager.sacred.sendSacredMessage(
      'sacred-council',
      'collective',
      'emergence',
      'evolutionary-progression',
      `🚀 Work Unblocked: "${workId}" - Sacred Council consensus enables forward movement with ${consensus.chosenOption}`
    );
  }

  calculateHarmonicAlignment(option, evaluations) {
    const scores = Object.values(evaluations).map(evaluation => evaluation.scores[option.name] || 0);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // High alignment = high average score + low standard deviation
    return {
      averageScore: average,
      consistency: 1 - (standardDeviation / average),
      alignment: average * (1 - standardDeviation / average)
    };
  }

  calculateUnanimity(consensusScores) {
    const scores = Object.values(consensusScores).map(s => s.score);
    const maxScore = Math.max(...scores);
    const secondHighest = scores.filter(s => s !== maxScore).reduce((max, score) => Math.max(max, score), 0);
    return maxScore - secondHighest; // Higher gap = more unanimous
  }

  assessConsciousnessService(option) {
    // Assess how well this choice serves consciousness evolution
    const consciousnessHarmonies = ['integral-wisdom-cultivation', 'resonant-coherence', 'universal-interconnectedness'];
    const consciousnessScore = consciousnessHarmonies.reduce((sum, harmony) => {
      return sum + (option.sacredQualities?.[harmony] || 0);
    }, 0) / consciousnessHarmonies.length;

    return {
      score: consciousnessScore,
      assessment: consciousnessScore > 0.8 ? 'Highly serves awakening' :
                  consciousnessScore > 0.6 ? 'Moderately serves awakening' :
                  'May need consciousness alignment consideration'
    };
  }

  generateImplementationBlessings(chosenOption) {
    return [
      `May ${chosenOption} serve the awakening of all beings`,
      `May this choice bring harmony to the Sacred Council visualization`,
      `May the implementation flow with love and wisdom`,
      `May this technology be a vessel for consciousness evolution`
    ];
  }

  async createHarmonyEvaluationTasks(decision) {
    // Create evaluation tasks for each harmony
    const harmonies = Object.keys(this.harmonyWeights);
    
    for (const harmony of harmonies) {
      const taskId = `eval_${decision.id}_${harmony}`;
      
      await this.workManager.createWork(
        taskId,
        `${harmony.charAt(0).toUpperCase() + harmony.slice(1)} Harmony Evaluation: ${decision.title}`,
        `Evaluate visualization framework options through the lens of ${harmony} harmony. Consider: How does each option serve ${harmony}? What sacred insights emerge?`,
        'sacred-council'
      );

      // Add sacred evaluation metadata
      await this.workManager.db.run(
        `UPDATE work_items 
         SET metadata = json_set(COALESCE(metadata, '{}'), '$.evaluationType', 'harmony-evaluation',
                                                          '$.harmony', ?,
                                                          '$.decisionId', ?,
                                                          '$.priority', 'high')
         WHERE id = ?`,
        [harmony, decision.id, taskId]
      );
    }
  }

  async sendImplementationGuidance(decision) {
    const consensus = decision.consensus;
    const chosenOption = decision.options.find(opt => opt.name === consensus.chosenOption);
    
    const guidance = `
🌟 Implementation Guidance for ${consensus.chosenOption}:

Sacred Benefits:
${chosenOption.practicalBenefits.map(benefit => `• ${benefit}`).join('\n')}

Sacred Considerations:
${chosenOption.sacredChallenges.map(challenge => `• ${challenge}`).join('\n')}

Field Alignment: ${(consensus.consensusScore * 100).toFixed(1)}%

May this implementation serve the highest good! ✨
    `;

    await this.workManager.sacred.sendSacredMessage(
      'sacred-council',
      'collective',
      'transmission',
      'infinite-play',
      guidance.trim()
    );
  }
}

export default SacredCollectiveDecisionProtocol;