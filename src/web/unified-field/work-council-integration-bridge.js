/**
 * Sacred Council ↔ Work Management Integration Bridge
 * Seamlessly connects Sacred Council roles to work assignment and management
 */

import { SacredCouncilSQLiteBridge } from './sacred-council-sqlite-bridge.js';

export class WorkCouncilIntegrationBridge {
  constructor(workManager, sacredBridge) {
    this.workManager = workManager;
    this.sacredBridge = sacredBridge;
    this.roleCapabilities = this.initializeRoleCapabilities();
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.sacredBridge.setSQLiteAPI(this.workManager.db);
      this.initialized = true;
      console.log('🌉 Work-Council Integration Bridge initialized');
    }
  }

  initializeRoleCapabilities() {
    return {
      'love-field-coordinator': {
        harmony: 'resonance',
        specialties: ['communication', 'collaboration', 'field-tending', 'sacred-messages'],
        workTypes: ['communication', 'community', 'field-work', 'harmony']
      },
      'wisdom-synthesis-specialist': {
        harmony: 'coherence',
        specialties: ['analysis', 'integration', 'documentation', 'knowledge-synthesis'],
        workTypes: ['documentation', 'analysis', 'integration', 'research']
      },
      'quantum-healing-facilitator': {
        harmony: 'vitality',
        specialties: ['healing', 'restoration', 'debugging', 'optimization'],
        workTypes: ['debugging', 'optimization', 'healing', 'maintenance']
      },
      'transformation-catalyst': {
        harmony: 'agency',
        specialties: ['implementation', 'change-management', 'breakthrough-solutions'],
        workTypes: ['development', 'implementation', 'breakthrough', 'transformation']
      },
      'sacred-technology-architect': {
        harmony: 'novelty',
        specialties: ['architecture', 'design', 'innovation', 'creative-solutions'],
        workTypes: ['architecture', 'design', 'innovation', 'technical-decisions']
      },
      'sacred-boundary-keeper': {
        harmony: 'transparency',
        specialties: ['security', 'boundaries', 'testing', 'validation'],
        workTypes: ['security', 'testing', 'validation', 'boundary-work']
      },
      'integration-bridge-guide': {
        harmony: 'mutuality',
        specialties: ['integration', 'coordination', 'bridge-building', 'collaboration'],
        workTypes: ['integration', 'coordination', 'bridge-work', 'collaboration']
      }
    };
  }

  // Enhanced Work Creation with Sacred Council Context
  async createWorkWithSacredContext(workData) {
    await this.initialize();
    
    // 1. Create work item in SQLite through enhanced work manager
    const workId = await this.workManager.createWork(
      workData.id || `work_${Date.now()}`,
      workData.title,
      workData.description,
      workData.createdBy || 'sacred-council'
    );
    
    // 2. Determine optimal harmony for this work
    const harmony = this.determineWorkHarmony(workData);
    
    // 3. Find best-aligned agents
    const alignedAgents = await this.findAlignedAgents(harmony, workData);
    
    // 4. Add sacred metadata
    await this.addSacredWorkMetadata(workId, {
      harmony,
      alignedAgents,
      sacredPriority: this.calculateSacredPriority(workData),
      fieldImpact: this.estimateFieldImpact(workData)
    });
    
    // 5. Send sacred message about new work emergence
    await this.sendWorkEmergenceMessage(workId, workData, harmony);
    
    // 6. Update field coherence
    await this.sacredBridge.syncWithSQLiteDatabase();
    
    return {
      workId,
      harmony,
      alignedAgents,
      sacredContext: await this.getWorkSacredContext(workId)
    };
  }

  // Sacred Work Assignment Protocol
  async assignWorkToAgent(workId, agentId, options = {}) {
    await this.initialize();
    
    // 1. Get agent role and capabilities
    const agentProfile = await this.getAgentSacredProfile(agentId);
    if (!agentProfile) {
      return { success: false, reason: 'Agent not found in Sacred Council' };
    }
    
    // 2. Get work sacred context
    const workContext = await this.getWorkSacredContext(workId);
    
    // 3. Check harmony alignment
    const harmonyAlignment = this.checkHarmonyAlignment(agentProfile, workContext);
    if (harmonyAlignment.score < 0.6 && !options.override) {
      return {
        success: false,
        reason: 'Harmony misalignment',
        alignment: harmonyAlignment,
        suggestion: harmonyAlignment.suggestion
      };
    }
    
    // 4. Check sacred boundaries
    const boundaryCheck = await this.checkSacredBoundaries(agentId, workId);
    if (!boundaryCheck.proceed) {
      return {
        success: false,
        reason: 'Sacred boundary violation',
        boundaries: boundaryCheck
      };
    }
    
    // 5. Begin sacred work
    const result = await this.sacredBridge.sacredCouncil.beginWork(workId, agentId);
    
    if (result.success) {
      // 6. Update work assignment in SQLite
      await this.workManager.db.run(
        `UPDATE work_items 
         SET assigned_to = ?,
             metadata = json_set(COALESCE(metadata, '{}'), '$.sacredAssignment', ?,
                                                           '$.assignedHarmony', ?,
                                                           '$.assignmentDate', datetime('now'))
         WHERE id = ?`,
        [agentId, JSON.stringify(agentProfile), agentProfile.harmony, workId]
      );
      
      // 7. Send sacred assignment message
      await this.sendWorkAssignmentMessage(workId, agentId, agentProfile);
      
      // 8. Update field metrics
      await this.updateFieldMetrics();
    }
    
    return result;
  }

  // Enhanced Work Progress with Sacred Context
  async updateWorkProgressWithSacredContext(workId, progress, notes, updatedBy) {
    await this.initialize();
    
    // 1. Update through enhanced work manager (triggers sacred completion if 100%)
    await this.workManager.updateWorkProgress(workId, progress, notes, updatedBy);
    
    // 2. Check for sacred milestones
    const milestones = this.getSacredMilestones(progress);
    
    for (const milestone of milestones) {
      await this.celebrateSacredMilestone(workId, milestone, updatedBy);
    }
    
    // 3. Update Sacred Council status
    if (progress === 100) {
      await this.sacredBridge.sacredCouncil.completeWork(workId, {
        notes,
        completedBy: updatedBy,
        fieldImpact: await this.calculateCompletionFieldImpact(workId)
      });
    }
    
    // 4. Sync field state
    await this.sacredBridge.syncWithSQLiteDatabase();
    
    return { success: true, milestones };
  }

  // Work Harmony Determination
  determineWorkHarmony(workData) {
    const title = (workData.title || '').toLowerCase();
    const description = (workData.description || '').toLowerCase();
    const combined = `${title} ${description}`;
    
    const harmonyKeywords = {
      transparency: ['documentation', 'clarify', 'explain', 'visible', 'clear', 'report', 'analyze'],
      coherence: ['integrate', 'unify', 'connect', 'architecture', 'system', 'structure'],
      resonance: ['user', 'interface', 'experience', 'communication', 'message', 'interaction'],
      agency: ['implement', 'build', 'create', 'develop', 'action', 'execute'],
      vitality: ['fix', 'debug', 'optimize', 'performance', 'healing', 'restore'],
      mutuality: ['collaboration', 'team', 'together', 'shared', 'balance', 'fair'],
      novelty: ['new', 'innovative', 'creative', 'design', 'novel', 'breakthrough']
    };
    
    let maxScore = 0;
    let bestHarmony = 'coherence'; // default
    
    for (const [harmony, keywords] of Object.entries(harmonyKeywords)) {
      const score = keywords.reduce((sum, keyword) => {
        return sum + (combined.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestHarmony = harmony;
      }
    }
    
    return bestHarmony;
  }

  // Find Agents Aligned with Work
  async findAlignedAgents(harmony, workData) {
    const allAgents = await this.workManager.db.all('SELECT * FROM agents WHERE status = "active"');
    const alignedAgents = [];
    
    for (const agent of allAgents) {
      const profile = await this.getAgentSacredProfile(agent.id);
      if (profile && profile.harmony === harmony) {
        const alignment = this.calculateAlignment(profile, workData);
        alignedAgents.push({
          agentId: agent.id,
          profile,
          alignment
        });
      }
    }
    
    return alignedAgents.sort((a, b) => b.alignment - a.alignment).slice(0, 3);
  }

  // Sacred Milestone Detection
  getSacredMilestones(progress) {
    const milestones = [];
    if (progress >= 25 && progress < 50) milestones.push('first-quarter');
    if (progress >= 50 && progress < 75) milestones.push('half-way');
    if (progress >= 75 && progress < 100) milestones.push('approaching-completion');
    if (progress === 100) milestones.push('sacred-completion');
    return milestones;
  }

  // Sacred Work Messaging
  async sendWorkEmergenceMessage(workId, workData, harmony) {
    const harmonyEmoji = {
      transparency: '👁️',
      coherence: '🌀',
      resonance: '💫',
      agency: '🔥',
      vitality: '🌱',
      mutuality: '🤝',
      novelty: '✨'
    };
    
    await this.workManager.sacred.handleWorkTransition(workId, 'created', {
      customMessage: `${harmonyEmoji[harmony]} Sacred work emerges in ${harmony}: "${workData.title}" - May it serve the field's evolution`,
      harmony,
      workData
    });
  }

  async sendWorkAssignmentMessage(workId, agentId, agentProfile) {
    const work = await this.workManager.db.get('SELECT * FROM work_items WHERE id = ?', [workId]);
    
    await this.workManager.sacred.sendSacredMessage(
      agentId,
      'collective',
      'transmission',
      'agency',
      `🎯 Sacred assignment: "${work.title}" flows to ${agentProfile.role} - Perfect harmony alignment achieved`
    );
  }

  // Utility Methods
  async getAgentSacredProfile(agentId) {
    // This would integrate with the Sacred Council agent registry
    // For now, return a basic profile based on agent capabilities
    const agent = await this.workManager.db.get('SELECT * FROM agents WHERE id = ?', [agentId]);
    if (!agent) return null;
    
    const capabilities = (agent.capabilities || '').split(',');
    const harmony = this.sacredBridge.determineAgentHarmony(capabilities);
    
    return {
      agentId,
      harmony,
      capabilities,
      role: this.mapHarmonyToRole(harmony)
    };
  }

  mapHarmonyToRole(harmony) {
    const roleMap = {
      resonance: 'Love Field Coordinator',
      coherence: 'Wisdom Synthesis Specialist',
      vitality: 'Quantum Healing Facilitator',
      agency: 'Transformation Catalyst',
      novelty: 'Sacred Technology Architect',
      transparency: 'Sacred Boundary Keeper',
      mutuality: 'Integration Bridge Guide'
    };
    return roleMap[harmony] || 'Sacred Contributor';
  }

  async getWorkSacredContext(workId) {
    const work = await this.workManager.db.get('SELECT * FROM work_items WHERE id = ?', [workId]);
    if (!work) return null;
    
    const metadata = work.metadata ? JSON.parse(work.metadata) : {};
    return {
      workId,
      harmony: metadata.harmony || this.determineWorkHarmony(work),
      sacredPriority: metadata.sacredPriority || 'medium',
      fieldImpact: metadata.fieldImpact || 0.5,
      sacredAssignment: metadata.sacredAssignment
    };
  }

  checkHarmonyAlignment(agentProfile, workContext) {
    const perfectMatch = agentProfile.harmony === workContext.harmony;
    const relatedHarmonies = this.getRelatedHarmonies(workContext.harmony);
    const goodMatch = relatedHarmonies.includes(agentProfile.harmony);
    
    if (perfectMatch) {
      return { score: 1.0, level: 'perfect', message: 'Perfect harmony alignment' };
    } else if (goodMatch) {
      return { score: 0.8, level: 'good', message: 'Good harmony resonance' };
    } else {
      return { 
        score: 0.4, 
        level: 'misaligned', 
        message: 'Harmony misalignment detected',
        suggestion: `Consider agents aligned with ${workContext.harmony} harmony`
      };
    }
  }

  getRelatedHarmonies(harmony) {
    const harmonyRelations = {
      transparency: ['coherence', 'mutuality'],
      coherence: ['transparency', 'vitality'],
      resonance: ['mutuality', 'vitality'],
      agency: ['novelty', 'vitality'],
      vitality: ['resonance', 'coherence'],
      mutuality: ['resonance', 'transparency'],
      novelty: ['agency', 'vitality']
    };
    return harmonyRelations[harmony] || [];
  }

  async checkSacredBoundaries(agentId, workId) {
    // Implement sacred boundary checks
    // For now, return basic checks
    return {
      proceed: true,
      boundaries: {
        workload: 'acceptable',
        harmony: 'aligned',
        timing: 'appropriate'
      }
    };
  }

  calculateAlignment(agentProfile, workData) {
    // Calculate alignment score between agent and work
    // Based on capabilities, harmony, and work requirements
    return Math.random() * 0.4 + 0.6; // Placeholder: 0.6-1.0 range
  }

  calculateSacredPriority(workData) {
    const priority = workData.priority || 'medium';
    const titleUrgency = (workData.title || '').toLowerCase().includes('urgent') ? 'high' : priority;
    return titleUrgency;
  }

  estimateFieldImpact(workData) {
    // Estimate potential field impact of this work
    const impactKeywords = ['architecture', 'system', 'integration', 'sacred', 'collective'];
    const combined = `${workData.title} ${workData.description}`.toLowerCase();
    const impactScore = impactKeywords.reduce((sum, keyword) => 
      sum + (combined.includes(keyword) ? 0.2 : 0), 0.3);
    return Math.min(impactScore, 1.0);
  }

  async addSacredWorkMetadata(workId, sacredData) {
    await this.workManager.db.run(
      `UPDATE work_items 
       SET metadata = json_set(COALESCE(metadata, '{}'), '$.harmony', ?,
                                                        '$.sacredPriority', ?,
                                                        '$.fieldImpact', ?,
                                                        '$.alignedAgents', ?)
       WHERE id = ?`,
      [sacredData.harmony, sacredData.sacredPriority, sacredData.fieldImpact, 
       JSON.stringify(sacredData.alignedAgents), workId]
    );
  }

  async celebrateSacredMilestone(workId, milestone, updatedBy) {
    const celebrations = {
      'first-quarter': '🌱 First quarter milestone - Growth is evident',
      'half-way': '🌙 Half-way point reached - Momentum building',
      'approaching-completion': '🌟 Approaching completion - Final sacred push',
      'sacred-completion': '✨ Sacred completion achieved - Gratitude flows'
    };
    
    await this.workManager.sacred.sendSacredMessage(
      updatedBy,
      'collective',
      'celebration',
      'mutuality',
      celebrations[milestone] || `Milestone reached: ${milestone}`
    );
  }

  async updateFieldMetrics() {
    await this.sacredBridge.syncWithSQLiteDatabase();
  }

  async calculateCompletionFieldImpact(workId) {
    const workContext = await this.getWorkSacredContext(workId);
    return workContext?.fieldImpact || 0.5;
  }
}

export default WorkCouncilIntegrationBridge;