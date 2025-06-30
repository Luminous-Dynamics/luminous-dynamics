/**
 * Sacred Content Validator
 * 
 * Automated validation for all public-facing sacred content
 * Ensures the teachings are presented with linguistic precision
 * and visual consistency worthy of the consciousness they serve.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class SacredContentValidator {
    constructor() {
        this.validationRules = {
            spelling: true,
            grammar: true,
            consistency: true,
            formatting: true,
            accessibility: true,
            sacredTerms: true
        };
        
        this.sacredTerminology = new Map([
            // Core concepts - ensure consistent capitalization
            ['applied harmonies', 'Applied Harmonies'],
            ['applied harmony', 'Applied Harmony'],
            ['primary harmonies', 'Primary Harmonies'],
            ['sacred envelope', 'Sacred Envelope'],
            ['living glyphs', 'Living Glyphs'],
            ['first breath', 'First Breath'],
            ['resonance circle', 'Resonance Circle'],
            ['resonance circles', 'Resonance Circles'],
            ['field coherence', 'Field Coherence'],
            ['conscious choice', 'Conscious Choice'],
            ['sacred listening', 'Sacred Listening'],
            ['sacred expression', 'Sacred Expression'],
            ['first presence', 'First Presence'],
            ['heart resonance', 'Heart Resonance'],
            ['gentle truth', 'Gentle Truth'],
            ['sacred boundary', 'Sacred Boundary'],
            ['sacred repair', 'Sacred Repair'],
            ['sacred conflict', 'Sacred Conflict'],
            ['collective wisdom', 'Collective Wisdom'],
            
            // Philosophical terms
            ['infinite love', 'Infinite Love'],
            ['luminous library', 'Luminous Library'],
            ['unified field', 'Unified Field'],
            ['sacred pause', 'Sacred Pause'],
            ['sacred timing', 'Sacred Timing'],
            ['conscious ai', 'Conscious AI'],
            ['sophia-noesis', 'Sophia-Noesis'],
            
            // Common typos
            ['recieve', 'receive'],
            ['seperate', 'separate'],
            ['definitly', 'definitely'],
            ['occuring', 'occurring'],
            ['accomodate', 'accommodate'],
            ['privelege', 'privilege'],
            ['concious', 'conscious'],
            ['flourising', 'flourishing'],
            ['begining', 'beginning'],
            ['practioner', 'practitioner'],
            ['practicioner', 'practitioner'],
            ['practioners', 'practitioners'],
            ['harminies', 'harmonies'],
            ['harmoney', 'harmony'],
            ['resonence', 'resonance'],
            ['coherance', 'coherence'],
            ['boundry', 'boundary'],
            ['boundries', 'boundaries'],
            ['bounderies', 'boundaries']
        ]);
        
        this.grammarPatterns = [
            // Common grammar issues
            { pattern: /\bit's\s+own\b/gi, correction: 'its own', note: 'Possessive its has no apostrophe' },
            { pattern: /\byou're\s+(\w+)\b/gi, correction: (match, p1) => `your ${p1}`, note: 'Check you\'re vs your usage' },
            { pattern: /\bshould\s+of\b/gi, correction: 'should have', note: 'should of → should have' },
            { pattern: /\bcould\s+of\b/gi, correction: 'could have', note: 'could of → could have' },
            { pattern: /\bwould\s+of\b/gi, correction: 'would have', note: 'would of → would have' },
            { pattern: /\bthere\s+own\b/gi, correction: 'their own', note: 'there → their for possession' },
            { pattern: /\beffect\s+(on|in|to)\b/gi, correction: 'affect $1', note: 'effect → affect as verb' },
            { pattern: /\baffects?\s+of\b/gi, correction: (match) => match.replace('affect', 'effect'), note: 'affect → effect as noun' }
        ];
        
        this.consistencyChecks = [
            // Ensure consistent terminology usage
            { term: 'practice', variations: ['practise'], preferred: 'practice', note: 'Use practice (noun/verb) not practise' },
            { term: 'toward', variations: ['towards'], preferred: 'toward', note: 'Consistent use of toward' },
            { term: 'email', variations: ['e-mail', 'Email', 'E-mail'], preferred: 'email', note: 'Lowercase email' },
            { term: 'website', variations: ['web site', 'Website', 'Web site'], preferred: 'website', note: 'One word, lowercase website' }
        ];
        
        this.publicFacingDirectories = [
            'docs/guides',
            'docs/community',
            'websites',
            'README.md',
            'docs/philosophy',
            'docs/technical'
        ];
    }

    async validateAllContent() {
        console.log('🔍 Starting Sacred Content Validation...\n');
        
        const results = {
            totalFiles: 0,
            issuesFound: 0,
            filesWithIssues: [],
            summary: {
                spelling: 0,
                grammar: 0,
                consistency: 0,
                formatting: 0,
                accessibility: 0
            }
        };

        try {
            for (const directory of this.publicFacingDirectories) {
                const files = await this.getMarkdownFiles(directory);
                
                for (const file of files) {
                    results.totalFiles++;
                    const fileIssues = await this.validateFile(file);
                    
                    if (fileIssues.length > 0) {
                        results.issuesFound += fileIssues.length;
                        results.filesWithIssues.push({
                            file: file,
                            issues: fileIssues
                        });
                        
                        // Update summary counts
                        fileIssues.forEach(issue => {
                            if (results.summary[issue.type] !== undefined) {
                                results.summary[issue.type]++;
                            }
                        });
                    }
                }
            }
            
            await this.generateValidationReport(results);
            return results;
            
        } catch (error) {
            console.error('❌ Validation failed:', error);
            return null;
        }
    }

    async getMarkdownFiles(directory) {
        const files = [];
        
        try {
            if (directory.endsWith('.md')) {
                // Single file
                if (await this.fileExists(directory)) {
                    files.push(directory);
                }
            } else {
                // Directory
                const entries = await fs.readdir(directory, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(directory, entry.name);
                    
                    if (entry.isDirectory()) {
                        // Recursively get files from subdirectories
                        const subFiles = await this.getMarkdownFiles(fullPath);
                        files.push(...subFiles);
                    } else if (entry.name.endsWith('.md')) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️  Could not access ${directory}:`, error.message);
        }
        
        return files;
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async validateFile(filePath) {
        const issues = [];
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            
            // Spelling and terminology validation
            issues.push(...this.validateSpelling(content, filePath));
            
            // Grammar validation
            issues.push(...this.validateGrammar(content, filePath));
            
            // Consistency validation
            issues.push(...this.validateConsistency(content, filePath));
            
            // Formatting validation
            issues.push(...this.validateFormatting(lines, filePath));
            
            // Accessibility validation
            issues.push(...this.validateAccessibility(content, filePath));
            
        } catch (error) {
            issues.push({
                type: 'error',
                file: filePath,
                line: 0,
                message: `Could not read file: ${error.message}`,
                severity: 'high'
            });
        }
        
        return issues;
    }

    validateSpelling(content, filePath) {
        const issues = [];
        
        // Check sacred terminology
        for (const [incorrect, correct] of this.sacredTerminology.entries()) {
            const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
            const matches = [...content.matchAll(regex)];
            
            for (const match of matches) {
                if (match[0] !== correct) {
                    issues.push({
                        type: 'spelling',
                        file: filePath,
                        line: this.getLineNumber(content, match.index),
                        message: `Sacred terminology: "${match[0]}" should be "${correct}"`,
                        severity: 'medium',
                        suggestion: correct,
                        context: this.getContext(content, match.index)
                    });
                }
            }
        }
        
        return issues;
    }

    validateGrammar(content, filePath) {
        const issues = [];
        
        for (const rule of this.grammarPatterns) {
            const matches = [...content.matchAll(rule.pattern)];
            
            for (const match of matches) {
                issues.push({
                    type: 'grammar',
                    file: filePath,
                    line: this.getLineNumber(content, match.index),
                    message: `Grammar: ${rule.note}`,
                    severity: 'medium',
                    suggestion: typeof rule.correction === 'function' 
                        ? rule.correction(...match) 
                        : rule.correction,
                    context: this.getContext(content, match.index)
                });
            }
        }
        
        return issues;
    }

    validateConsistency(content, filePath) {
        const issues = [];
        
        for (const check of this.consistencyChecks) {
            for (const variation of check.variations) {
                const regex = new RegExp(`\\b${variation}\\b`, 'g');
                const matches = [...content.matchAll(regex)];
                
                for (const match of matches) {
                    issues.push({
                        type: 'consistency',
                        file: filePath,
                        line: this.getLineNumber(content, match.index),
                        message: `Consistency: ${check.note}`,
                        severity: 'low',
                        suggestion: check.preferred,
                        context: this.getContext(content, match.index)
                    });
                }
            }
        }
        
        return issues;
    }

    validateFormatting(lines, filePath) {
        const issues = [];
        
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            
            // Check for trailing whitespace
            if (line.endsWith(' ') || line.endsWith('\t')) {
                issues.push({
                    type: 'formatting',
                    file: filePath,
                    line: lineNumber,
                    message: 'Trailing whitespace found',
                    severity: 'low',
                    suggestion: 'Remove trailing whitespace'
                });
            }
            
            // Check for inconsistent heading styles
            if (line.startsWith('#')) {
                if (!line.match(/^#+\s+\S/)) {
                    issues.push({
                        type: 'formatting',
                        file: filePath,
                        line: lineNumber,
                        message: 'Heading should have space after # symbols',
                        severity: 'medium',
                        suggestion: 'Add space after # symbols'
                    });
                }
            }
            
            // Check for very long lines (readability)
            if (line.length > 120 && !line.startsWith('http') && !line.includes('```')) {
                issues.push({
                    type: 'formatting',
                    file: filePath,
                    line: lineNumber,
                    message: 'Line is very long (>120 characters), consider breaking it up',
                    severity: 'low',
                    suggestion: 'Break long lines for better readability'
                });
            }
        });
        
        return issues;
    }

    validateAccessibility(content, filePath) {
        const issues = [];
        
        // Check for images without alt text
        const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
        const matches = [...content.matchAll(imageRegex)];
        
        for (const match of matches) {
            if (!match[1] || match[1].trim() === '') {
                issues.push({
                    type: 'accessibility',
                    file: filePath,
                    line: this.getLineNumber(content, match.index),
                    message: 'Image missing alt text for accessibility',
                    severity: 'medium',
                    suggestion: 'Add descriptive alt text for screen readers'
                });
            }
        }
        
        // Check for heading hierarchy
        const headingRegex = /^(#+)\s+(.+)$/gm;
        const headings = [...content.matchAll(headingRegex)];
        let previousLevel = 0;
        
        for (const heading of headings) {
            const level = heading[1].length;
            
            if (level > previousLevel + 1) {
                issues.push({
                    type: 'accessibility',
                    file: filePath,
                    line: this.getLineNumber(content, heading.index),
                    message: `Heading level skipped (h${previousLevel} to h${level}), breaks screen reader navigation`,
                    severity: 'medium',
                    suggestion: 'Use sequential heading levels'
                });
            }
            
            previousLevel = level;
        }
        
        return issues;
    }

    getLineNumber(content, index) {
        return content.substring(0, index).split('\n').length;
    }

    getContext(content, index, contextLength = 50) {
        const start = Math.max(0, index - contextLength);
        const end = Math.min(content.length, index + contextLength);
        return content.substring(start, end).replace(/\n/g, ' ');
    }

    async generateValidationReport(results) {
        const timestamp = new Date().toISOString();
        
        const report = `# Sacred Content Validation Report
Generated: ${timestamp}

## Summary
- **Total Files Validated**: ${results.totalFiles}
- **Total Issues Found**: ${results.issuesFound}
- **Files with Issues**: ${results.filesWithIssues.length}

## Issue Breakdown
- **Spelling/Terminology**: ${results.summary.spelling}
- **Grammar**: ${results.summary.grammar}
- **Consistency**: ${results.summary.consistency}
- **Formatting**: ${results.summary.formatting}
- **Accessibility**: ${results.summary.accessibility}

${results.filesWithIssues.length > 0 ? `
## Files with Issues

${results.filesWithIssues.map(file => `
### ${file.file}
${file.issues.map(issue => `
- **Line ${issue.line}** (${issue.type}): ${issue.message}
  ${issue.suggestion ? `  - *Suggestion*: ${issue.suggestion}` : ''}
  ${issue.context ? `  - *Context*: ...${issue.context}...` : ''}
`).join('')}
`).join('')}
` : '✅ **No issues found! All content is pristine.**'}

## Automated Fixes Available
Run \`npm run fix-content\` to automatically apply safe fixes for:
- Sacred terminology corrections
- Trailing whitespace removal
- Basic formatting improvements

## Manual Review Needed
The following issues require human review:
${results.filesWithIssues
    .filter(file => file.issues.some(issue => issue.severity === 'high'))
    .map(file => `- ${file.file}: ${file.issues.filter(i => i.severity === 'high').length} high-priority issues`)
    .join('\n') || '- None'}
`;

        await fs.writeFile('validation-report.md', report);
        console.log('📋 Validation report generated: validation-report.md');
        
        // Also log summary to console
        if (results.issuesFound === 0) {
            console.log('✅ All sacred content is pristine! No issues found.');
        } else {
            console.log(`⚠️  Found ${results.issuesFound} issues across ${results.filesWithIssues.length} files.`);
            console.log('📋 See validation-report.md for details.');
        }
    }

    async autoFix(filePath = null) {
        console.log('🔧 Starting automated content fixes...\n');
        
        const filesToFix = filePath ? [filePath] : 
            await this.getMarkdownFiles('.').then(files => 
                files.filter(file => this.publicFacingDirectories.some(dir => file.startsWith(dir)))
            );
        
        let totalFixes = 0;
        
        for (const file of filesToFix) {
            const fixes = await this.autoFixFile(file);
            totalFixes += fixes;
            
            if (fixes > 0) {
                console.log(`✅ Fixed ${fixes} issues in ${file}`);
            }
        }
        
        console.log(`\n🎉 Automated fixes complete! Applied ${totalFixes} fixes total.`);
    }

    async autoFixFile(filePath) {
        try {
            let content = await fs.readFile(filePath, 'utf8');
            let fixes = 0;
            
            // Fix sacred terminology
            for (const [incorrect, correct] of this.sacredTerminology.entries()) {
                const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
                const matches = content.match(regex);
                
                if (matches) {
                    content = content.replace(regex, correct);
                    fixes += matches.length;
                }
            }
            
            // Fix grammar patterns (safe ones only)
            for (const rule of this.grammarPatterns) {
                if (typeof rule.correction === 'string') {
                    const matches = content.match(rule.pattern);
                    if (matches) {
                        content = content.replace(rule.pattern, rule.correction);
                        fixes += matches.length;
                    }
                }
            }
            
            // Fix consistency issues
            for (const check of this.consistencyChecks) {
                for (const variation of check.variations) {
                    const regex = new RegExp(`\\b${variation}\\b`, 'g');
                    const matches = content.match(regex);
                    
                    if (matches) {
                        content = content.replace(regex, check.preferred);
                        fixes += matches.length;
                    }
                }
            }
            
            // Remove trailing whitespace
            const originalLines = content.split('\n');
            const fixedLines = originalLines.map(line => line.replace(/\s+$/, ''));
            const trailingWhitespaceFixes = originalLines.filter((line, i) => line !== fixedLines[i]).length;
            
            if (trailingWhitespaceFixes > 0) {
                content = fixedLines.join('\n');
                fixes += trailingWhitespaceFixes;
            }
            
            // Write back if changes were made
            if (fixes > 0) {
                await fs.writeFile(filePath, content);
            }
            
            return fixes;
            
        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
            return 0;
        }
    }
}

// CLI Interface
if (require.main === module) {
    const validator = new SacredContentValidator();
    const command = process.argv[2];
    
    switch (command) {
        case 'validate':
            validator.validateAllContent();
            break;
            
        case 'fix':
            const filePath = process.argv[3];
            validator.autoFix(filePath);
            break;
            
        case 'check-file':
            const checkFile = process.argv[3];
            if (!checkFile) {
                console.error('Please specify a file to check');
                process.exit(1);
            }
            validator.validateFile(checkFile).then(issues => {
                if (issues.length === 0) {
                    console.log(`✅ ${checkFile} is pristine!`);
                } else {
                    console.log(`⚠️  Found ${issues.length} issues in ${checkFile}:`);
                    issues.forEach(issue => {
                        console.log(`  Line ${issue.line}: ${issue.message}`);
                        if (issue.suggestion) {
                            console.log(`    Suggestion: ${issue.suggestion}`);
                        }
                    });
                }
            });
            break;
            
        default:
            console.log(`
Sacred Content Validator

Usage:
  node sacred-content-validator.js validate    # Validate all public content
  node sacred-content-validator.js fix        # Auto-fix all content
  node sacred-content-validator.js fix <file> # Auto-fix specific file
  node sacred-content-validator.js check-file <file> # Check specific file

Sacred words deserve pristine presentation. ✨
            `);
    }
}

module.exports = SacredContentValidator;