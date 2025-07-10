/**
 * 🛡️ Encoding Trap Detector
 * Detects dangerous patterns that can cause JSON encoding errors
 */

const fs = require('fs').promises;
const { SafetyDetector, SafetyResult } = require('./base-detector.js');

class EncodingTrapDetector extends SafetyDetector {
  constructor() {
    super({
      name: 'encoding_trap',
      version: '1.0.0',
      severity: 'critical',
      description: 'Detects patterns that cause JSON encoding errors in AI tools',
      patterns: [
        // Dangerous variable expansion patterns
        /\$\{[^}]+\}-/g,
        // Unpaired high surrogates
        /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g,
        // Unpaired low surrogates  
        /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
        // Control characters that break JSON
        /[\x00-\x08\x0B\x0C\x0E-\x1F]/g
      ]
    });
  }

  async check(filePath, content) {
    try {
      // Read file if content not provided
      if (!content) {
        content = await fs.readFile(filePath, 'utf8');
      }

      const warnings = [];
      const errors = [];
      let score = 100;

      // Check each pattern
      for (const pattern of this.patterns) {
        const matches = content.match(pattern);
        if (matches) {
          const issue = {
            pattern: pattern.toString(),
            count: matches.length,
            examples: matches.slice(0, 3)
          };

          if (pattern.toString().includes('\\$\\{')) {
            errors.push({
              type: 'variable_expansion_trap',
              message: `Found ${matches.length} dangerous \${VAR}- patterns`,
              details: issue
            });
            score -= 50;
          } else if (pattern.toString().includes('\\uD800')) {
            errors.push({
              type: 'surrogate_pair_error',
              message: `Found ${matches.length} unpaired Unicode surrogates`,
              details: issue
            });
            score -= 50;
          } else {
            warnings.push({
              type: 'control_characters',
              message: `Found ${matches.length} problematic control characters`,
              details: issue
            });
            score -= 20;
          }
        }
      }

      // Check line lengths
      const lines = content.split('\n');
      const longLines = lines.filter(line => line.length > 1000);
      if (longLines.length > 0) {
        const maxLength = Math.max(...longLines.map(l => l.length));
        
        if (maxLength > 2000) {
          errors.push({
            type: 'extreme_line_length',
            message: `${longLines.length} lines exceed 2000 characters (max: ${maxLength})`,
            maxLength
          });
          score -= 50;
        } else {
          warnings.push({
            type: 'long_lines',
            message: `${longLines.length} lines exceed 1000 characters (max: ${maxLength})`,
            maxLength
          });
          score -= 20;
        }
      }

      // Check for mixed encoding indicators
      if (content.includes('\r\n') && content.includes('\n')) {
        warnings.push({
          type: 'mixed_line_endings',
          message: 'File contains mixed line endings (CRLF and LF)'
        });
        score -= 5;
      }

      return new SafetyResult({
        safe: errors.length === 0,
        score: Math.max(0, score),
        warnings,
        errors,
        metadata: {
          fileSize: content.length,
          lineCount: lines.length,
          encoding: 'utf8' // Could be enhanced with actual detection
        }
      });

    } catch (error) {
      return new SafetyResult({
        safe: false,
        score: 0,
        errors: [{
          type: 'read_error',
          message: `Failed to analyze file: ${error.message}`
        }]
      });
    }
  }

  getRecommendation(result) {
    if (!result.safe) {
      return {
        action: 'use_write',
        description: 'Use Write tool instead of Edit to avoid encoding errors',
        automated: false,
        steps: [
          '1. Create backup: cp file.sh file.sh.backup',
          '2. Rewrite without dangerous patterns',
          '3. Use quoted heredocs for multi-line content',
          '4. Break long lines into shorter segments'
        ]
      };
    }
    
    if (result.warnings.length > 0) {
      return {
        action: 'proceed_with_caution',
        description: 'Minor issues detected, proceed carefully',
        automated: true,
        steps: ['Consider splitting into smaller edits']
      };
    }

    return {
      action: 'safe_to_edit',
      description: 'No encoding issues detected',
      automated: true
    };
  }

  canAutoFix() {
    return true; // We can attempt some fixes
  }

  async autoFix(filePath, result) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let fixed = content;
      let fixCount = 0;

      // Fix dangerous variable expansions
      fixed = fixed.replace(/\$\{([^}]+)\}-/g, (match, varName) => {
        fixCount++;
        return `\${${varName}}_`; // Replace dash with underscore
      });

      // Remove control characters
      fixed = fixed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

      // Fix line endings
      if (result.warnings.some(w => w.type === 'mixed_line_endings')) {
        fixed = fixed.replace(/\r\n/g, '\n');
        fixCount++;
      }

      // Write fixed version to new file
      const fixedPath = `${filePath}.safe`;
      await fs.writeFile(fixedPath, fixed, 'utf8');

      return {
        success: true,
        fixedPath,
        fixCount,
        message: `Created safe version at ${fixedPath} with ${fixCount} fixes`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = EncodingTrapDetector;