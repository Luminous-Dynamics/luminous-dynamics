/**
 * 🛡️ Base Safety Detector
 * Universal interface for all safety detection modules
 */

class SafetyDetector {
  constructor(config) {
    this.name = config.name;
    this.version = config.version || '1.0.0';
    this.severity = config.severity || 'medium';
    this.patterns = config.patterns || [];
    this.description = config.description;
    this.enabled = config.enabled !== false;
  }

  /**
   * Check a file for safety issues
   * @param {string} filePath - Path to file to check
   * @param {string} content - File content (optional, will read if not provided)
   * @returns {Promise<SafetyResult>}
   */
  async check(filePath, content) {
    throw new Error('Subclass must implement check method');
  }

  /**
   * Get recommended fix for detected issues
   * @param {SafetyResult} result - Result from check()
   * @returns {SafetyRecommendation}
   */
  getRecommendation(result) {
    return {
      action: 'review',
      description: 'Manual review recommended',
      automated: false
    };
  }

  /**
   * Can this detector auto-fix the issue?
   * @returns {boolean}
   */
  canAutoFix() {
    return false;
  }

  /**
   * Attempt to auto-fix the issue
   * @param {string} filePath - Path to file
   * @param {SafetyResult} result - Result from check()
   * @returns {Promise<AutoFixResult>}
   */
  async autoFix(filePath, result) {
    throw new Error('Auto-fix not implemented for this detector');
  }
}

/**
 * Standard result format for all detectors
 */
class SafetyResult {
  constructor(data) {
    this.safe = data.safe !== false;
    this.score = data.score || 100;
    this.warnings = data.warnings || [];
    this.errors = data.errors || [];
    this.metadata = data.metadata || {};
  }

  get severity() {
    if (this.errors.length > 0) return 'critical';
    if (this.warnings.length > 2) return 'high';
    if (this.warnings.length > 0) return 'medium';
    return 'low';
  }

  toJSON() {
    return {
      safe: this.safe,
      score: this.score,
      severity: this.severity,
      warnings: this.warnings,
      errors: this.errors,
      metadata: this.metadata
    };
  }
}

module.exports = {
  SafetyDetector,
  SafetyResult
};