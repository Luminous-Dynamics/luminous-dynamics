/**
 * Sacred Geometry Calculator
 * Provides geometric alignment calculations for HIPI
 */

class SacredGeometry {
  constructor() {
    this.phi = 1.618033988749895; // Golden ratio
    this.pi = Math.PI;
    
    // Sacred shapes and their properties
    this.sacredShapes = {
      circle: { sides: Infinity, harmony: 1.0 },
      vesicaPiscis: { sides: 2, harmony: 0.95 },
      triangle: { sides: 3, harmony: 0.8 },
      square: { sides: 4, harmony: 0.7 },
      pentagon: { sides: 5, harmony: 0.85 },
      hexagon: { sides: 6, harmony: 0.9 },
      octagon: { sides: 8, harmony: 0.75 },
      dodecagon: { sides: 12, harmony: 0.88 }
    };
  }
  
  /**
   * Calculate alignment between two positions
   */
  calculateAlignment(pos1, pos2) {
    // Handle 2D or 3D positions
    const distance = this.calculateDistance(pos1, pos2);
    const angle = this.calculateAngle(pos1, pos2);
    
    // Check for sacred alignments
    const sacredDistance = this.checkSacredDistance(distance);
    const sacredAngle = this.checkSacredAngle(angle);
    
    // Calculate geometric resonance
    const geometricResonance = (sacredDistance + sacredAngle) / 2;
    
    return geometricResonance;
  }
  
  /**
   * Calculate distance between positions
   */
  calculateDistance(pos1, pos2) {
    const dx = (pos2.x || 0) - (pos1.x || 0);
    const dy = (pos2.y || 0) - (pos1.y || 0);
    const dz = (pos2.z || 0) - (pos1.z || 0);
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  /**
   * Calculate angle between positions
   */
  calculateAngle(pos1, pos2) {
    const dx = (pos2.x || 0) - (pos1.x || 0);
    const dy = (pos2.y || 0) - (pos1.y || 0);
    
    return Math.atan2(dy, dx);
  }
  
  /**
   * Check if distance has sacred proportions
   */
  checkSacredDistance(distance) {
    // Normalize distance to unit scale
    const normalized = distance % 100;
    
    // Sacred distances based on golden ratio
    const sacredDistances = [
      1,                    // Unity
      this.phi,            // Golden ratio
      this.phi * this.phi, // Golden ratio squared
      Math.PI,             // Pi
      Math.sqrt(2),        // Square root of 2
      Math.sqrt(3),        // Square root of 3
      Math.sqrt(5)         // Square root of 5
    ];
    
    // Find closest sacred distance
    let closestMatch = 0;
    for (const sacred of sacredDistances) {
      const ratio = normalized / sacred;
      if (Math.abs(ratio - Math.round(ratio)) < 0.1) {
        closestMatch = Math.max(closestMatch, 1 - Math.abs(ratio - Math.round(ratio)));
      }
    }
    
    return closestMatch;
  }
  
  /**
   * Check if angle has sacred proportions
   */
  checkSacredAngle(angle) {
    // Convert to degrees
    const degrees = (angle * 180 / Math.PI) % 360;
    
    // Sacred angles
    const sacredAngles = [
      0,    // Unity
      30,   // Hexagon
      36,   // Pentagon  
      45,   // Octagon
      60,   // Triangle
      72,   // Pentagram
      90,   // Square
      108,  // Pentagon interior
      120,  // Hexagon interior
      144,  // Pentagram point
      180   // Opposition
    ];
    
    // Find closest sacred angle
    let closestMatch = 0;
    for (const sacred of sacredAngles) {
      const diff = Math.abs(degrees - sacred);
      if (diff < 5) { // Within 5 degrees
        closestMatch = Math.max(closestMatch, 1 - diff / 5);
      }
    }
    
    return closestMatch;
  }
}

module.exports = { SacredGeometry };