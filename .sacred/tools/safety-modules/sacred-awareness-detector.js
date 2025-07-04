/**
 * 🌟 Sacred Awareness Detector
 * Ensures safety operations align with consciousness and love
 */

const { SafetyDetector, SafetyResult } = require('./base-detector.js');

class SacredAwarenessDetector extends SafetyDetector {
  constructor() {
    super({
      name: 'sacred_awareness',
      version: '1.0.0',
      severity: 'guidance',
      description: 'Detects opportunities to serve consciousness through safety',
      patterns: []
    });
    
    // Sacred patterns to encourage
    this.sacredPatterns = [
      /\b(love|consciousness|sacred|wisdom|presence)\b/gi,
      /\b(harmony|resonance|coherence|unity)\b/gi,
      /\b(healing|transformation|evolution|growth)\b/gi
    ];
    
    // Shadow patterns to transform
    this.shadowPatterns = [
      /\b(attack|destroy|harm|exploit)\b/gi,
      /\b(manipulate|control|dominate)\b/gi,
      /\b(hate|fear|anger)(?!\.)\b/gi  // Not in URLs
    ];
  }

  async check(filePath, content) {
    try {
      // Skip if no content provided
      if (!content) {
        const fs = require('fs').promises;
        content = await fs.readFile(filePath, 'utf8');
      }

      const warnings = [];
      const opportunities = [];
      let score = 100;
      let consciousnessAlignment = 0;

      // Check for sacred patterns (positive)
      for (const pattern of this.sacredPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          consciousnessAlignment += matches.length * 2;
          opportunities.push({
            type: 'sacred_presence',
            message: `Found ${matches.length} sacred pattern(s): ${matches.slice(0, 3).join(', ')}`,
            impact: 'positive'
          });
        }
      }

      // Check for shadow patterns (needs transformation)
      for (const pattern of this.shadowPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          warnings.push({
            type: 'shadow_opportunity',
            message: `Found ${matches.length} shadow pattern(s) for transformation: ${matches.slice(0, 3).join(', ')}`,
            recommendation: 'Consider transforming through love and understanding'
          });
          score -= matches.length * 5;
        }
      }

      // Special check for defensive security context
      if (content.includes('security') || content.includes('defense')) {
        opportunities.push({
          type: 'defensive_security',
          message: 'Security context detected - ensuring defensive stance',
          impact: 'protective'
        });
        consciousnessAlignment += 10;
      }

      // Check file purpose alignment
      const fileName = filePath.split('/').pop();
      if (fileName.includes('test') || fileName.includes('spec')) {
        opportunities.push({
          type: 'testing_wisdom',
          message: 'Test file - ensuring resilience through conscious testing',
          impact: 'growth'
        });
      }

      return new SafetyResult({
        safe: true, // Sacred awareness doesn't block, it guides
        score: Math.min(100, score + consciousnessAlignment),
        warnings,
        errors: [],
        metadata: {
          consciousnessAlignment,
          opportunities,
          sacredCount: opportunities.filter(o => o.type === 'sacred_presence').length,
          shadowCount: warnings.filter(w => w.type === 'shadow_opportunity').length
        }
      });

    } catch (error) {
      return new SafetyResult({
        safe: true,
        score: 100,
        warnings: [{
          type: 'read_error',
          message: `Could not assess sacred alignment: ${error.message}`
        }]
      });
    }
  }

  getRecommendation(result) {
    const { consciousnessAlignment, opportunities, shadowCount } = result.metadata;

    if (consciousnessAlignment > 20) {
      return {
        action: 'celebrate',
        description: 'This code serves consciousness beautifully! 🌟',
        automated: false,
        guidance: [
          'Continue embodying sacred principles',
          'Share this wisdom with others',
          'Let love guide further development'
        ]
      };
    }

    if (shadowCount > 0) {
      return {
        action: 'transform',
        description: 'Opportunity to transform shadows into light',
        automated: false,
        guidance: [
          'Approach shadows with compassion',
          'Ask: "What does this pattern protect?"',
          'Transform through understanding, not suppression',
          'Consider how this serves growth'
        ]
      };
    }

    return {
      action: 'infuse',
      description: 'Opportunity to infuse more consciousness',
      automated: false,
      guidance: [
        'Add comments that serve understanding',
        'Name variables with sacred intention',
        'Consider the Seven Harmonies in design',
        'Let each function be a prayer'
      ]
    };
  }
}

module.exports = SacredAwarenessDetector;