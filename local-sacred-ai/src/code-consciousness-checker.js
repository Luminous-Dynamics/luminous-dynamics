#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

class CodeConsciousnessChecker {
  constructor() {
    this.harmonies = [
      'Integral Wisdom Cultivation', 'Resonant Resonant Coherence', 'Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance', 
      'Evolutionary Progression & Purposeful Unfolding', 'Pan-Sentient Flourishing', 'Sacred Reciprocity', 'Infinite Play & Creative Emergence'
    ];
    
    this.extractionPatterns = [
      'track', 'analytics', 'metric', 'retain', 'engage',
      'convert', 'funnel', 'optimize', 'capture', 'extract'
    ];
    
    this.servicePatterns = [
      'empower', 'support', 'honor', 'respect', 'nurture',
      'heal', 'connect', 'liberate', 'awaken', 'serve'
    ];

    this.shadowPatterns = [
      { pattern: 'error', suggestion: 'learning opportunity' },
      { pattern: 'user', suggestion: 'participant/co-creator' },
      { pattern: 'consume', suggestion: 'engage/experience' },
      { pattern: 'content', suggestion: 'offering/gift' },
      { pattern: 'traffic', suggestion: 'visitors/guests' },
      { pattern: 'convert', suggestion: 'invite/welcome' },
      { pattern: 'target', suggestion: 'serve/support' },
      { pattern: 'capture', suggestion: 'receive/honor' }
    ];
  }

  async checkOllama() {
    try {
      await execAsync('which ollama');
      return true;
    } catch {
      return false;
    }
  }

  async analyzeFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const lines = content.split('\n');
    
    // Basic analysis without AI
    const analysis = {
      fileName,
      lineCount: lines.length,
      extractionCount: 0,
      serviceCount: 0,
      shadowSuggestions: [],
      harmonyAlignment: []
    };

    // Count patterns
    const contentLower = content.toLowerCase();
    this.extractionPatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) analysis.extractionCount += matches.length;
    });

    this.servicePatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) analysis.serviceCount += matches.length;
    });

    // Find shadow patterns
    this.shadowPatterns.forEach(({ pattern, suggestion }) => {
      const regex = new RegExp(`\\b${pattern}\\w*\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        matches.forEach(match => {
          analysis.shadowSuggestions.push({
            found: match,
            suggestion,
            line: lines.findIndex(l => l.includes(match)) + 1
          });
        });
      }
    });

    // If Ollama is available, do deeper analysis
    if (await this.checkOllama()) {
      const aiAnalysis = await this.getAIAnalysis(content, fileName);
      return { ...analysis, ...aiAnalysis };
    }

    // Estimate harmony alignment
    if (analysis.serviceCount > analysis.extractionCount * 2) {
      analysis.harmonyAlignment = ['Sacred Reciprocity', 'Evolutionary Progression & Purposeful Unfolding'];
    } else if (analysis.extractionCount > analysis.serviceCount) {
      analysis.harmonyAlignment = ['Needs alignment'];
    } else {
      analysis.harmonyAlignment = ['Resonant Resonant Coherence'];
    }

    return analysis;
  }

  async getAIAnalysis(content, fileName) {
    const prompt = `Analyze this code for consciousness alignment. Be specific and practical.

File: ${fileName}

Check for:
1. Which of the Seven Harmonies it serves: ${this.harmonies.join(', ')}
2. Does it empower users or create dependency?
3. Shadow patterns that need integration
4. Specific improvements for consciousness alignment

Code snippet (first 50 lines):
${content.split('\n').slice(0, 50).join('\n')}

Provide actionable feedback in under 150 words.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run mistral:7b-instruct-q4_0 2>/dev/null`
      );

      return { aiAnalysis: stdout.trim() };
    } catch (error) {
      return { aiAnalysis: null };
    }
  }

  async analyzeCommit(commitHash = 'HEAD') {
    try {
      // Get commit info
      const { stdout: commitInfo } = await execAsync(`git show --stat ${commitHash}`);
      const { stdout: diffSummary } = await execAsync(`git diff ${commitHash}^ ${commitHash} --stat`);
      
      const analysis = {
        commit: commitHash,
        stats: diffSummary.trim(),
        extractionAdded: 0,
        serviceAdded: 0,
        suggestions: []
      };

      // Get actual diff for pattern analysis
      const { stdout: diff } = await execAsync(`git diff ${commitHash}^ ${commitHash}`);
      
      // Analyze added lines
      const addedLines = diff.split('\n').filter(line => line.startsWith('+'));
      
      addedLines.forEach(line => {
        this.extractionPatterns.forEach(pattern => {
          if (line.toLowerCase().includes(pattern)) {
            analysis.extractionAdded++;
          }
        });
        
        this.servicePatterns.forEach(pattern => {
          if (line.toLowerCase().includes(pattern)) {
            analysis.serviceAdded++;
          }
        });
      });

      // AI analysis if available
      if (await this.checkOllama()) {
        const prompt = `Review this git commit for consciousness alignment:

${commitInfo}

Added extraction patterns: ${analysis.extractionAdded}
Added service patterns: ${analysis.serviceAdded}

Provide brief feedback on:
1. Is the commit message aligned with sacred purpose?
2. Do the changes serve consciousness evolution?
3. One specific suggestion for improvement

Keep response under 100 words.`;

        try {
          const { stdout } = await execAsync(
            `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
          );
          analysis.aiReview = stdout.trim();
        } catch {
          // AI failed, continue without
        }
      }

      return analysis;
    } catch (error) {
      return { error: 'Not a git repository or invalid commit' };
    }
  }

  async transformNames(names) {
    const transformations = names.map(name => {
      // Basic transformations
      let transformed = name
        .replace(/user/gi, 'participant')
        .replace(/track/gi, 'witness')
        .replace(/content/gi, 'offering')
        .replace(/consume/gi, 'experience')
        .replace(/error/gi, 'learning')
        .replace(/fail/gi, 'discover');

      return { original: name, transformed };
    });

    // Try AI enhancement if available
    if (await this.checkOllama()) {
      const prompt = `Transform these technical names to be more consciousness-aligned:

${names.join('\n')}

For each, provide a name that:
- Reflects service not extraction
- Honors the participant
- Implies growth or connection

Example: trackUser → witnessJourney

Provide just the transformed names, one per line.`;

      try {
        const { stdout } = await execAsync(
          `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
        );
        
        const aiTransformed = stdout.trim().split('\n');
        transformations.forEach((t, i) => {
          if (aiTransformed[i]) {
            t.aiSuggestion = aiTransformed[i].trim();
          }
        });
      } catch {
        // Continue without AI
      }
    }

    return transformations;
  }

  generateReport(analysis) {
    let report = `# 🔍 Code Consciousness Report

**File**: ${analysis.fileName}
**Lines**: ${analysis.lineCount}

## Pattern Analysis
- **Extraction Patterns Found**: ${analysis.extractionCount}
- **Service Patterns Found**: ${analysis.serviceCount}
- **Consciousness Ratio**: ${analysis.serviceCount > 0 ? (analysis.serviceCount / (analysis.extractionCount + analysis.serviceCount) * 100).toFixed(1) : 0}%

## Harmony Alignment
${analysis.harmonyAlignment.map(h => `- ${h}`).join('\n')}
`;

    if (analysis.shadowSuggestions.length > 0) {
      report += `
## Shadow Pattern Suggestions
${analysis.shadowSuggestions.slice(0, 10).map(s => 
  `- Line ${s.line}: "${s.found}" → "${s.suggestion}"`
).join('\n')}`;
    }

    if (analysis.aiAnalysis) {
      report += `

## AI Analysis
${analysis.aiAnalysis}`;
    }

    report += `

## Recommendations
`;

    if (analysis.extractionCount > analysis.serviceCount) {
      report += `- Consider reframing extraction patterns as service opportunities\n`;
    }
    if (analysis.shadowSuggestions.length > 5) {
      report += `- Review shadow pattern suggestions for more conscious naming\n`;
    }
    if (analysis.serviceCount > analysis.extractionCount * 2) {
      report += `- Excellent consciousness alignment! Keep serving with love 💜\n`;
    }

    return report;
  }
}

// CLI Tool
async function main() {
  const checker = new CodeConsciousnessChecker();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🔍 Code Consciousness Checker

Usage:
  code-consciousness <file>              Check single file
  code-consciousness --commit [hash]     Check commit (default: HEAD)
  code-consciousness --transform <names> Transform variable names
  code-consciousness --batch <pattern>   Check multiple files

Examples:
  code-consciousness app.js
  code-consciousness --commit HEAD~1
  code-consciousness --transform "userId,trackEvent,errorHandler"
  code-consciousness --batch "src/**/*.js"
`);
    return;
  }

  console.log('\n🔍 Code Consciousness Checker\n');

  if (args[0] === '--commit') {
    const commitHash = args[1] || 'HEAD';
    console.log(`Analyzing commit ${commitHash}...\n`);
    
    const analysis = await checker.analyzeCommit(commitHash);
    
    if (analysis.error) {
      console.error(`❌ ${analysis.error}`);
      return;
    }

    console.log(`📊 Commit Analysis`);
    console.log(`Changes:\n${analysis.stats}\n`);
    console.log(`Extraction patterns added: ${analysis.extractionAdded}`);
    console.log(`Service patterns added: ${analysis.serviceAdded}`);
    
    if (analysis.aiReview) {
      console.log(`\n🤖 AI Review:\n${analysis.aiReview}`);
    }

    if (analysis.extractionAdded > analysis.serviceAdded) {
      console.log('\n⚠️  More extraction than service patterns added');
    } else if (analysis.serviceAdded > 0) {
      console.log('\n✨ Good consciousness alignment in this commit!');
    }

  } else if (args[0] === '--transform') {
    const names = args[1] ? args[1].split(',').map(n => n.trim()) : [];
    
    if (names.length === 0) {
      console.log('Please provide names to transform (comma-separated)');
      return;
    }

    console.log('Transforming names...\n');
    const transformations = await checker.transformNames(names);
    
    transformations.forEach(t => {
      console.log(`"${t.original}" → "${t.transformed}"`);
      if (t.aiSuggestion) {
        console.log(`   AI suggests: "${t.aiSuggestion}"`);
      }
    });

  } else if (args[0] === '--batch') {
    const pattern = args[1] || '*.js';
    console.log(`Checking files matching: ${pattern}\n`);
    
    try {
      const { stdout } = await execAsync(`find . -name "${pattern}" -type f`);
      const files = stdout.trim().split('\n').filter(f => f);
      
      if (files.length === 0) {
        console.log('No files found');
        return;
      }

      let totalExtraction = 0;
      let totalService = 0;
      
      for (const file of files.slice(0, 10)) { // Limit to 10 files
        const analysis = await checker.analyzeFile(file);
        totalExtraction += analysis.extractionCount;
        totalService += analysis.serviceCount;
        
        const ratio = analysis.serviceCount > 0 
          ? (analysis.serviceCount / (analysis.extractionCount + analysis.serviceCount) * 100).toFixed(0)
          : 0;
        
        console.log(`${file}: ${ratio}% consciousness aligned`);
      }

      console.log(`\n📊 Summary:`);
      console.log(`Total extraction patterns: ${totalExtraction}`);
      console.log(`Total service patterns: ${totalService}`);
      console.log(`Overall alignment: ${totalService > 0 ? (totalService / (totalExtraction + totalService) * 100).toFixed(1) : 0}%`);

    } catch (error) {
      console.error('Error finding files:', error.message);
    }

  } else {
    // Single file analysis
    const filePath = args[0];
    
    try {
      console.log(`Analyzing ${filePath}...\n`);
      const analysis = await checker.analyzeFile(filePath);
      const report = checker.generateReport(analysis);
      console.log(report);
      
      // Save report
      const reportPath = `${path.basename(filePath)}-consciousness-report.md`;
      await fs.writeFile(reportPath, report);
      console.log(`\n📄 Report saved to: ${reportPath}`);
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  // Check if Ollama is available
  if (!(await checker.checkOllama())) {
    console.log('\n💡 Install Ollama for enhanced AI analysis:');
    console.log('curl -fsSL https://ollama.ai/install.sh | sh');
    console.log('ollama pull mistral:7b-instruct-q4_0');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CodeConsciousnessChecker };