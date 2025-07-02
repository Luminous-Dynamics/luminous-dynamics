/**
 * Work Registry
 * Sacred registry of all work items
 */

class WorkRegistry {
  constructor() {
    this.works = new Map();
    this.worksByStatus = new Map();
    this.worksByAssignee = new Map();
  }

  /**
   * Add work to registry
   */
  add(work) {
    this.works.set(work.id, work);
    
    // Update status index
    if (!this.worksByStatus.has(work.status)) {
      this.worksByStatus.set(work.status, new Set());
    }
    this.worksByStatus.get(work.status).add(work.id);
    
    // Update assignee index
    if (!this.worksByAssignee.has(work.assignee)) {
      this.worksByAssignee.set(work.assignee, new Set());
    }
    this.worksByAssignee.get(work.assignee).add(work.id);
  }

  /**
   * Get work by ID
   */
  get(workId) {
    return this.works.get(workId);
  }

  /**
   * Get all work items
   */
  getAll() {
    return Array.from(this.works.values());
  }

  /**
   * Get work by status
   */
  getByStatus(status) {
    const ids = this.worksByStatus.get(status);
    if (!ids) return [];
    
    return Array.from(ids).map(id => this.works.get(id)).filter(Boolean);
  }

  /**
   * Get work by assignee
   */
  getByAssignee(assignee) {
    const ids = this.worksByAssignee.get(assignee);
    if (!ids) return [];
    
    return Array.from(ids).map(id => this.works.get(id)).filter(Boolean);
  }

  /**
   * Update work (maintains indices)
   */
  update(work) {
    const existing = this.works.get(work.id);
    if (!existing) return false;
    
    // Update status index if changed
    if (existing.status !== work.status) {
      this.worksByStatus.get(existing.status)?.delete(work.id);
      
      if (!this.worksByStatus.has(work.status)) {
        this.worksByStatus.set(work.status, new Set());
      }
      this.worksByStatus.get(work.status).add(work.id);
    }
    
    // Update assignee index if changed
    if (existing.assignee !== work.assignee) {
      this.worksByAssignee.get(existing.assignee)?.delete(work.id);
      
      if (!this.worksByAssignee.has(work.assignee)) {
        this.worksByAssignee.set(work.assignee, new Set());
      }
      this.worksByAssignee.get(work.assignee).add(work.id);
    }
    
    // Update work
    this.works.set(work.id, work);
    return true;
  }

  /**
   * Remove work
   */
  remove(workId) {
    const work = this.works.get(workId);
    if (!work) return false;
    
    // Remove from all indices
    this.works.delete(workId);
    this.worksByStatus.get(work.status)?.delete(workId);
    this.worksByAssignee.get(work.assignee)?.delete(workId);
    
    return true;
  }

  /**
   * Get registry size
   */
  size() {
    return this.works.size;
  }

  /**
   * Search works by criteria
   */
  search(criteria) {
    const results = [];
    
    for (const work of this.works.values()) {
      let matches = true;
      
      if (criteria.status && work.status !== criteria.status) {
        matches = false;
      }
      
      if (criteria.priority && work.priority !== criteria.priority) {
        matches = false;
      }
      
      if (criteria.harmony && work.harmony !== criteria.harmony) {
        matches = false;
      }
      
      if (criteria.sacred !== undefined && work.sacred !== criteria.sacred) {
        matches = false;
      }
      
      if (matches) results.push(work);
    }
    
    return results;
  }
}

module.exports = { WorkRegistry };