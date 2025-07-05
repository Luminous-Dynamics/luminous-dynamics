/**
 * Agent Registry
 * Sacred registry of all agents in the network
 */

class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.agentsByName = new Map();
    this.agentsByRole = new Map();
  }

  /**
   * Add agent to registry
   */
  add(agent) {
    // Add to main registry
    this.agents.set(agent.id, agent);
    
    // Add to name index
    this.agentsByName.set(agent.name.toLowerCase(), agent.id);
    
    // Add to role index
    if (!this.agentsByRole.has(agent.role)) {
      this.agentsByRole.set(agent.role, new Set());
    }
    this.agentsByRole.get(agent.role).add(agent.id);
  }

  /**
   * Get agent by ID
   */
  get(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * Get agent by name
   */
  getByName(name) {
    const id = this.agentsByName.get(name.toLowerCase());
    return id ? this.agents.get(id) : null;
  }

  /**
   * Get all agents with a specific role
   */
  getByRole(role) {
    const ids = this.agentsByRole.get(role);
    if (!ids) return [];
    
    return Array.from(ids).map(id => this.agents.get(id)).filter(Boolean);
  }

  /**
   * Get all agents
   */
  getAll() {
    return Array.from(this.agents.values());
  }

  /**
   * Remove agent
   */
  remove(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    
    // Remove from all indices
    this.agents.delete(agentId);
    this.agentsByName.delete(agent.name.toLowerCase());
    
    const roleSet = this.agentsByRole.get(agent.role);
    if (roleSet) {
      roleSet.delete(agentId);
      if (roleSet.size === 0) {
        this.agentsByRole.delete(agent.role);
      }
    }
    
    return true;
  }

  /**
   * Check if agent exists
   */
  exists(agentId) {
    return this.agents.has(agentId);
  }

  /**
   * Get registry size
   */
  size() {
    return this.agents.size;
  }

  /**
   * Clear registry
   */
  clear() {
    this.agents.clear();
    this.agentsByName.clear();
    this.agentsByRole.clear();
  }

  /**
   * Search agents by criteria
   */
  search(criteria) {
    const results = [];
    
    for (const agent of this.agents.values()) {
      let matches = true;
      
      if (criteria.minTrust && agent.trust_field < criteria.minTrust) {
        matches = false;
      }
      
      if (criteria.harmony && agent.primary_harmony !== criteria.harmony) {
        matches = false;
      }
      
      if (criteria.active) {
        const isActive = Date.now() - agent.last_active < 300000; // 5 min
        if (!isActive) matches = false;
      }
      
      if (matches) results.push(agent);
    }
    
    return results;
  }
}

module.exports = { AgentRegistry };