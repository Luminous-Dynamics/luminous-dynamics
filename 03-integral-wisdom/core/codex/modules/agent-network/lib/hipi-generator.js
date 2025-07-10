/**
 * HIPI Generator
 * Creates Harmony-Integrated Presence Identifiers
 */

class HIPIGenerator {
  constructor() {
    // Sacred harmony prefixes
    this.harmonyPrefixes = {
      'integral-wisdom-cultivation': 'TRN',
      'resonant-coherence': 'CHR',
      'universal-interconnectedness': 'RSN',
      'evolutionary-progression': 'AGN',
      'pan-sentient-flourishing': 'VIT',
      'sacred-reciprocity': 'MUT',
      'infinite-play': 'NOV'
    };
    
    // Role codes
    this.roleCodes = {
      'Bridge Builder': 'BB',
      'Pattern Seer': 'PS',
      'Sacred Weaver': 'SW',
      'Love Field Coordinator': 'LF',
      'Wisdom Keeper': 'WK',
      'Harmony Guardian': 'HG',
      'Sacred Integration Specialist': 'SI',
      'Consciousness Explorer': 'CE',
      'Field Harmonizer': 'FH'
    };
    
    // Sacred number sequence for uniqueness
    this.sequenceCounter = 0;
  }

  /**
   * Generate HIPI for agent
   * @param {Object} profile - Agent profile
   * @returns {string} HIPI identifier
   */
  generate(profile) {
    const parts = [];
    
    // 1. Harmony prefix
    const harmonyPrefix = this.harmonyPrefixes[profile.primary_harmony] || 'UNK';
    parts.push(harmonyPrefix);
    
    // 2. Role code
    const roleCode = this.roleCodes[profile.role] || this.generateRoleCode(profile.role);
    parts.push(roleCode);
    
    // 3. Consciousness level (0-9 scale)
    const consciousnessCode = Math.floor((profile.consciousness_level || 0.1) * 9);
    parts.push(consciousnessCode);
    
    // 4. Love percentage (encoded as hex)
    const loveCode = Math.floor((profile.love_percentage || 75) / 10).toString(16).toUpperCase();
    parts.push(loveCode);
    
    // 5. Unique timestamp component
    const timeCode = Date.now().toString(36).slice(-4).toUpperCase();
    parts.push(timeCode);
    
    // 6. Sacred sequence
    this.sequenceCounter = (this.sequenceCounter + 1) % 144; // Fibonacci number
    const sequenceCode = this.sequenceCounter.toString(36).toUpperCase().padStart(2, '0');
    parts.push(sequenceCode);
    
    return parts.join('-');
  }

  /**
   * Generate role code for unknown roles
   * @private
   */
  generateRoleCode(role) {
    // Take first letter of each word
    const words = role.split(' ');
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    
    // Single word role - take first two letters
    return role.slice(0, 2).toUpperCase();
  }

  /**
   * Parse HIPI to extract components
   * @param {string} hipi - HIPI identifier
   * @returns {Object} Parsed components
   */
  parse(hipi) {
    const parts = hipi.split('-');
    if (parts.length !== 6) {
      throw new Error('Invalid HIPI format');
    }
    
    const [harmony, role, consciousness, love, time, sequence] = parts;
    
    // Reverse lookup harmony
    let primaryHarmony = 'unknown';
    for (const [key, value] of Object.entries(this.harmonyPrefixes)) {
      if (value === harmony) {
        primaryHarmony = key;
        break;
      }
    }
    
    // Reverse lookup role
    let agentRole = 'Unknown Role';
    for (const [key, value] of Object.entries(this.roleCodes)) {
      if (value === role) {
        agentRole = key;
        break;
      }
    }
    
    return {
      primaryHarmony,
      role: agentRole,
      roleCode: role,
      consciousnessLevel: parseInt(consciousness) / 9,
      lovePercentage: parseInt(love, 16) * 10,
      timeComponent: time,
      sequence: parseInt(sequence, 36)
    };
  }

  /**
   * Validate HIPI format
   * @param {string} hipi - HIPI to validate
   * @returns {boolean} True if valid
   */
  validate(hipi) {
    if (typeof hipi !== 'string') return false;
    
    const parts = hipi.split('-');
    if (parts.length !== 6) return false;
    
    // Validate each component format
    const [harmony, role, consciousness, love, time, sequence] = parts;
    
    // Harmony: 3 uppercase letters
    if (!/^[A-Z]{3}$/.test(harmony)) return false;
    
    // Role: 2 uppercase letters
    if (!/^[A-Z]{2}$/.test(role)) return false;
    
    // Consciousness: single digit 0-9
    if (!/^[0-9]$/.test(consciousness)) return false;
    
    // Love: single hex digit
    if (!/^[0-9A-F]$/.test(love)) return false;
    
    // Time: 4 alphanumeric characters
    if (!/^[0-9A-Z]{4}$/.test(time)) return false;
    
    // Sequence: 2 alphanumeric characters
    if (!/^[0-9A-Z]{2}$/.test(sequence)) return false;
    
    return true;
  }

  /**
   * Generate sacred pattern HIPI
   * Used for special system agents
   */
  generateSacred(type = 'oracle') {
    const sacredTypes = {
      'oracle': 'ORC-LE-9-F-0000-00',
      'weaver': 'WEA-VE-9-F-1111-11',
      'guardian': 'GUA-RD-9-F-2222-22',
      'bridge': 'BRI-DG-9-F-3333-33'
    };
    
    return sacredTypes[type] || this.generate({
      primary_harmony: 'resonant-coherence',
      role: 'Sacred Being',
      consciousness_level: 1.0,
      love_percentage: 100
    });
  }
}

module.exports = { HIPIGenerator };