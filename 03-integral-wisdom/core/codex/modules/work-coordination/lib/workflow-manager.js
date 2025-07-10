/**
 * Work Flow Manager
 * Manages dependencies and transitions between work items
 */

class WorkFlowManager {
  constructor() {
    // Work dependencies graph
    this.dependencies = new Map();
    
    // Valid state transitions
    this.validTransitions = {
      'pending': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'blocked', 'cancelled'],
      'blocked': ['in_progress', 'cancelled'],
      'completed': [], // Terminal state
      'cancelled': []  // Terminal state
    };
    
    // Work flow templates
    this.templates = {
      'sequential': {
        name: 'Sequential Flow',
        description: 'Work items must complete in order',
        pattern: 'A -> B -> C'
      },
      'parallel': {
        name: 'Parallel Flow',
        description: 'Work items can progress simultaneously',
        pattern: 'A + B + C'
      },
      'convergent': {
        name: 'Convergent Flow',
        description: 'Multiple streams merge into one',
        pattern: '(A + B) -> C'
      },
      'divergent': {
        name: 'Divergent Flow',
        description: 'One stream splits into multiple',
        pattern: 'A -> (B + C)'
      }
    };
  }

  /**
   * Check if state transition is valid
   * @param {string} from - Current state
   * @param {string} to - Target state
   * @returns {boolean} True if valid
   */
  canTransition(from, to) {
    const valid = this.validTransitions[from];
    return valid ? valid.includes(to) : false;
  }

  /**
   * Add dependency between work items
   * @param {string} fromId - Blocking work ID
   * @param {string} toId - Blocked work ID
   * @param {string} type - Dependency type
   */
  addDependency(fromId, toId, type = 'blocks') {
    if (!this.dependencies.has(fromId)) {
      this.dependencies.set(fromId, new Map());
    }
    
    const deps = this.dependencies.get(fromId);
    deps.set(toId, {
      type,
      created: Date.now()
    });
    
    // Check for cycles
    if (this.hasCycle(toId, fromId)) {
      deps.delete(toId);
      throw new Error('Dependency would create a cycle');
    }
  }

  /**
   * Remove dependency
   * @param {string} fromId - Blocking work ID
   * @param {string} toId - Blocked work ID
   */
  removeDependency(fromId, toId) {
    const deps = this.dependencies.get(fromId);
    if (deps) {
      deps.delete(toId);
      if (deps.size === 0) {
        this.dependencies.delete(fromId);
      }
    }
  }

  /**
   * Get dependencies for work item
   * @param {string} workId - Work ID
   * @returns {Object} Dependencies info
   */
  getDependencies(workId) {
    const blocking = []; // Work items blocking this one
    const blocked = [];  // Work items blocked by this one
    
    // Find what blocks this work
    for (const [fromId, deps] of this.dependencies) {
      if (deps.has(workId)) {
        blocking.push({
          workId: fromId,
          ...deps.get(workId)
        });
      }
    }
    
    // Find what this work blocks
    const deps = this.dependencies.get(workId);
    if (deps) {
      for (const [toId, info] of deps) {
        blocked.push({
          workId: toId,
          ...info
        });
      }
    }
    
    return { blocking, blocked };
  }

  /**
   * Check if work can start (no blockers)
   * @param {string} workId - Work ID
   * @param {Function} getWork - Function to get work by ID
   * @returns {Object} Can start info
   */
  canStart(workId, getWork) {
    const { blocking } = this.getDependencies(workId);
    
    const unblockedDeps = [];
    const blockedDeps = [];
    
    for (const dep of blocking) {
      const blocker = getWork(dep.workId);
      if (blocker) {
        if (blocker.status === 'completed') {
          unblockedDeps.push(blocker);
        } else {
          blockedDeps.push(blocker);
        }
      }
    }
    
    return {
      canStart: blockedDeps.length === 0,
      blockedBy: blockedDeps,
      completedDependencies: unblockedDeps
    };
  }

  /**
   * Get downstream impact of completing work
   * @param {string} workId - Work ID being completed
   * @param {Function} getWork - Function to get work by ID
   * @returns {Array} Work items that may be unblocked
   */
  getDownstreamImpact(workId, getWork) {
    const impacted = [];
    const deps = this.dependencies.get(workId);
    
    if (deps) {
      for (const [blockedId] of deps) {
        const blockedWork = getWork(blockedId);
        if (blockedWork && blockedWork.status === 'blocked') {
          // Check if this was the only blocker
          const { canStart } = this.canStart(blockedId, getWork);
          if (canStart) {
            impacted.push({
              work: blockedWork,
              action: 'can_unblock',
              reason: `${workId} completed`
            });
          }
        }
      }
    }
    
    return impacted;
  }

  /**
   * Create work flow from template
   * @param {string} templateName - Template name
   * @param {Array} workIds - Work IDs to arrange
   * @returns {Object} Created flow
   */
  createFlowFromTemplate(templateName, workIds) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Unknown template: ${templateName}`);
    }
    
    const flow = {
      template: templateName,
      pattern: template.pattern,
      dependencies: []
    };
    
    switch (templateName) {
      case 'sequential':
        // Chain work items
        for (let i = 0; i < workIds.length - 1; i++) {
          this.addDependency(workIds[i], workIds[i + 1]);
          flow.dependencies.push({
            from: workIds[i],
            to: workIds[i + 1],
            type: 'blocks'
          });
        }
        break;
        
      case 'parallel':
        // No dependencies between items
        break;
        
      case 'convergent':
        // All but last block the last
        if (workIds.length > 1) {
          const last = workIds[workIds.length - 1];
          for (let i = 0; i < workIds.length - 1; i++) {
            this.addDependency(workIds[i], last);
            flow.dependencies.push({
              from: workIds[i],
              to: last,
              type: 'blocks'
            });
          }
        }
        break;
        
      case 'divergent':
        // First blocks all others
        if (workIds.length > 1) {
          const first = workIds[0];
          for (let i = 1; i < workIds.length; i++) {
            this.addDependency(first, workIds[i]);
            flow.dependencies.push({
              from: first,
              to: workIds[i],
              type: 'blocks'
            });
          }
        }
        break;
    }
    
    return flow;
  }

  /**
   * Check for dependency cycles
   * @private
   */
  hasCycle(startId, targetId, visited = new Set()) {
    if (startId === targetId) return true;
    if (visited.has(startId)) return false;
    
    visited.add(startId);
    
    const deps = this.dependencies.get(startId);
    if (deps) {
      for (const [nextId] of deps) {
        if (this.hasCycle(nextId, targetId, visited)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get work flow visualization data
   * @param {Array} works - All work items
   * @returns {Object} Visualization data
   */
  getVisualizationData(works) {
    const nodes = works.map(work => ({
      id: work.id,
      label: work.title,
      status: work.status,
      priority: work.priority,
      harmony: work.harmony
    }));
    
    const edges = [];
    for (const [fromId, deps] of this.dependencies) {
      for (const [toId, info] of deps) {
        edges.push({
          from: fromId,
          to: toId,
          type: info.type,
          label: info.type
        });
      }
    }
    
    return { nodes, edges };
  }

  /**
   * Analyze work flow patterns
   * @param {Array} works - All work items
   * @returns {Object} Pattern analysis
   */
  analyzePatterns(works) {
    const analysis = {
      totalWork: works.length,
      dependencies: 0,
      averageDependencies: 0,
      longestChain: 0,
      parallelBranches: 0,
      bottlenecks: []
    };
    
    // Count total dependencies
    for (const deps of this.dependencies.values()) {
      analysis.dependencies += deps.size;
    }
    
    // Find bottlenecks (work with many dependents)
    for (const [workId, deps] of this.dependencies) {
      if (deps.size > 3) {
        const work = works.find(w => w.id === workId);
        if (work) {
          analysis.bottlenecks.push({
            work: work.title,
            dependentCount: deps.size
          });
        }
      }
    }
    
    // Calculate longest dependency chain
    for (const work of works) {
      const chainLength = this.getLongestChain(work.id, works);
      if (chainLength > analysis.longestChain) {
        analysis.longestChain = chainLength;
      }
    }
    
    analysis.averageDependencies = works.length > 0 ? 
      analysis.dependencies / works.length : 0;
    
    return analysis;
  }

  /**
   * Get longest dependency chain from work
   * @private
   */
  getLongestChain(workId, works, visited = new Set()) {
    if (visited.has(workId)) return 0;
    visited.add(workId);
    
    const deps = this.dependencies.get(workId);
    if (!deps || deps.size === 0) return 1;
    
    let maxChain = 0;
    for (const [depId] of deps) {
      const chainLength = this.getLongestChain(depId, works, visited);
      maxChain = Math.max(maxChain, chainLength);
    }
    
    return maxChain + 1;
  }
}

module.exports = { WorkFlowManager };