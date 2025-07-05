#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

class ConsciousnessTracker {
  constructor() {
    this.dataPath = path.join(process.env.HOME, '.sacred-ai', 'consciousness-tracker');
    this.journalPath = path.join(this.dataPath, 'journal');
    this.analysisPath = path.join(this.dataPath, 'analysis');
    
    this.harmonies = [
      'Transparency', 'Coherence', 'Resonance',
      'Agency', 'Vitality', 'Mutuality', 'Novelty'
    ];
    
    this.awarenessMarkers = [
      'I notice', 'I feel', 'I sense', 'I observe',
      'aware', 'conscious', 'present', 'mindful'
    ];
    
    this.somaticMarkers = [
      'body', 'breath', 'heart', 'belly', 'chest',
      'tension', 'relaxation', 'sensation', 'energy'
    ];
  }

  async initialize() {
    await fs.mkdir(this.journalPath, { recursive: true });
    await fs.mkdir(this.analysisPath, { recursive: true });
    
    // Create .gitignore for privacy
    const gitignorePath = path.join(this.dataPath, '.gitignore');
    try {
      await fs.access(gitignorePath);
    } catch {
      await fs.writeFile(gitignorePath, '*\n!.gitignore\n');
    }
  }

  async checkOllama() {
    try {
      await execAsync('which ollama');
      return true;
    } catch {
      return false;
    }
  }

  async addEntry(content, category = 'general') {
    const entryId = crypto.randomBytes(8).toString('hex');
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    
    const entry = {
      id: entryId,
      timestamp,
      category,
      content,
      wordCount: content.split(/\s+/).length,
      analysis: await this.analyzeEntry(content)
    };

    // Save entry
    const filename = `${date}-${entryId}.json`;
    await fs.writeFile(
      path.join(this.journalPath, filename),
      JSON.stringify(entry, null, 2)
    );

    return entry;
  }

  async analyzeEntry(content) {
    const analysis = {
      selfAwareness: 5,
      shadowIntegration: false,
      harmonies: [],
      emotionalComplexity: 'moderate',
      somaticAwareness: false,
      relationalConsciousness: 'emerging',
      spiritualInsights: [],
      awarenessScore: 0
    };

    const contentLower = content.toLowerCase();
    
    // Calculate awareness score
    this.awarenessMarkers.forEach(marker => {
      if (contentLower.includes(marker)) {
        analysis.awarenessScore += 1;
      }
    });
    
    // Check somatic awareness
    const somaticCount = this.somaticMarkers.filter(marker => 
      contentLower.includes(marker)
    ).length;
    analysis.somaticAwareness = somaticCount >= 2;
    
    // Estimate self-awareness level
    analysis.selfAwareness = Math.min(10, 5 + analysis.awarenessScore);
    
    // Check for shadow work
    const shadowKeywords = ['shadow', 'dark', 'hidden', 'unconscious', 'projection'];
    analysis.shadowIntegration = shadowKeywords.some(word => contentLower.includes(word));
    
    // Detect harmonies
    if (contentLower.includes('truth') || contentLower.includes('honest')) {
      analysis.harmonies.push('Transparency');
    }
    if (contentLower.includes('connect') || contentLower.includes('together')) {
      analysis.harmonies.push('Mutuality');
    }
    if (contentLower.includes('choose') || contentLower.includes('decide')) {
      analysis.harmonies.push('Agency');
    }
    
    // If Ollama available, enhance analysis
    if (await this.checkOllama()) {
      const aiAnalysis = await this.getAIAnalysis(content);
      return { ...analysis, ...aiAnalysis };
    }
    
    return analysis;
  }

  async getAIAnalysis(content) {
    const prompt = `Analyze this journal entry for consciousness development markers.

Entry: "${content}"

Assess (be specific):
1. Self-awareness level (1-10)
2. Primary harmony present (from: ${this.harmonies.join(', ')})
3. Emotional complexity (low/moderate/high)
4. Key insight or growth edge

Respond in JSON format like:
{
  "selfAwareness": 7,
  "primaryHarmony": "Mutuality",
  "emotionalComplexity": "high",
  "insight": "Moving from mental understanding to embodied knowing"
}`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(stdout);
        return {
          selfAwareness: parsed.selfAwareness || 5,
          harmonies: [parsed.primaryHarmony].filter(Boolean),
          emotionalComplexity: parsed.emotionalComplexity || 'moderate',
          aiInsight: parsed.insight
        };
      } catch {
        // If not valid JSON, extract what we can
        return { aiInsight: stdout.trim().slice(0, 200) };
      }
    } catch {
      return {};
    }
  }

  async analyzeEvolution(days = 30) {
    const entries = await this.loadRecentEntries(days);
    
    if (entries.length < 2) {
      return { 
        error: 'Need at least 2 entries for evolution analysis',
        suggestion: 'Keep journaling! Evolution becomes visible over time.'
      };
    }

    const evolution = {
      period: `${days} days`,
      entryCount: entries.length,
      metrics: this.calculateEvolutionMetrics(entries)
    };

    // Basic evolution analysis
    const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
    const secondHalf = entries.slice(Math.floor(entries.length / 2));
    
    const firstAvgAwareness = firstHalf.reduce((sum, e) => 
      sum + (e.analysis?.selfAwareness || 5), 0) / firstHalf.length;
    const secondAvgAwareness = secondHalf.reduce((sum, e) => 
      sum + (e.analysis?.selfAwareness || 5), 0) / secondHalf.length;
    
    evolution.trajectory = secondAvgAwareness > firstAvgAwareness ? 'expanding' : 
                          secondAvgAwareness < firstAvgAwareness ? 'contracting' : 'stable';
    evolution.awarenessGrowth = ((secondAvgAwareness - firstAvgAwareness) / firstAvgAwareness * 100).toFixed(1) + '%';

    // AI analysis if available
    if (await this.checkOllama() && entries.length >= 3) {
      const recentEntries = entries.slice(-5).map(e => e.content).join('\n---\n');
      
      const prompt = `Analyze the consciousness evolution in these journal entries (most recent last):

${recentEntries}

Identify:
1. Overall trajectory of awareness
2. Key growth areas
3. Emerging patterns
4. Next growth edge

Keep insights compassionate and under 150 words.`;

      try {
        const { stdout } = await execAsync(
          `echo ${JSON.stringify(prompt)} | ollama run mistral:7b-instruct-q4_0 2>/dev/null`
        );
        evolution.aiAnalysis = stdout.trim();
      } catch {
        // Continue without AI
      }
    }

    return evolution;
  }

  calculateEvolutionMetrics(entries) {
    const metrics = {
      selfAwarenessTrajectory: [],
      wordCountTrend: [],
      harmonyDistribution: {},
      shadowWorkFrequency: 0,
      somaticAwarenessGrowth: 0,
      totalWords: 0,
      avgWordsPerEntry: 0
    };

    entries.forEach(entry => {
      metrics.totalWords += entry.wordCount;
      metrics.wordCountTrend.push(entry.wordCount);
      
      if (entry.analysis) {
        metrics.selfAwarenessTrajectory.push(entry.analysis.selfAwareness);
        
        if (entry.analysis.shadowIntegration) {
          metrics.shadowWorkFrequency++;
        }
        
        if (entry.analysis.somaticAwareness) {
          metrics.somaticAwarenessGrowth++;
        }
        
        (entry.analysis.harmonies || []).forEach(harmony => {
          metrics.harmonyDistribution[harmony] = (metrics.harmonyDistribution[harmony] || 0) + 1;
        });
      }
    });

    metrics.avgWordsPerEntry = Math.round(metrics.totalWords / entries.length);
    metrics.shadowWorkPercentage = (metrics.shadowWorkFrequency / entries.length * 100).toFixed(1) + '%';
    metrics.somaticAwarenessPercentage = (metrics.somaticAwarenessGrowth / entries.length * 100).toFixed(1) + '%';
    
    // Find dominant harmony
    const harmonyCounts = Object.entries(metrics.harmonyDistribution);
    if (harmonyCounts.length > 0) {
      metrics.dominantHarmony = harmonyCounts.sort((a, b) => b[1] - a[1])[0][0];
    }

    return metrics;
  }

  async loadRecentEntries(days) {
    const files = await fs.readdir(this.journalPath);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const entries = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = await fs.readFile(path.join(this.journalPath, file), 'utf8');
          const entry = JSON.parse(content);
          
          if (new Date(entry.timestamp) > cutoffDate) {
            entries.push(entry);
          }
        } catch {
          // Skip corrupted files
        }
      }
    }
    
    return entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  async generateInsightReport(theme) {
    const entries = await this.loadRecentEntries(90);
    const themeLower = theme.toLowerCase();
    
    const themeEntries = entries.filter(e => 
      e.content.toLowerCase().includes(themeLower)
    );

    if (themeEntries.length === 0) {
      return { 
        error: `No entries found about "${theme}"`,
        suggestion: `Try exploring "${theme}" in your next journal entry`
      };
    }

    const report = {
      theme,
      entryCount: themeEntries.length,
      firstMention: themeEntries[0].timestamp,
      lastMention: themeEntries[themeEntries.length - 1].timestamp
    };

    // Basic pattern analysis
    const patterns = {
      emotions: {},
      harmonies: {},
      growth: []
    };

    themeEntries.forEach(entry => {
      if (entry.analysis) {
        (entry.analysis.harmonies || []).forEach(h => {
          patterns.harmonies[h] = (patterns.harmonies[h] || 0) + 1;
        });
      }
    });

    report.patterns = patterns;

    // AI insight if available
    if (await this.checkOllama() && themeEntries.length >= 2) {
      const themeContent = themeEntries.map(e => e.content).join('\n\n---\n\n');
      
      const prompt = `Analyze these journal entries about "${theme}":

${themeContent}

Provide insights on:
1. How understanding of this theme has evolved
2. Key patterns or cycles
3. Shadow aspects revealed
4. Integration opportunities

Keep response under 150 words and compassionate.`;

      try {
        const { stdout } = await execAsync(
          `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
        );
        report.insights = stdout.trim();
      } catch {
        // Continue without AI
      }
    }

    return report;
  }

  async getStats() {
    const allEntries = await this.loadRecentEntries(365); // Last year
    const last30Days = await this.loadRecentEntries(30);
    const last7Days = await this.loadRecentEntries(7);
    
    const stats = {
      total: allEntries.length,
      last30Days: last30Days.length,
      last7Days: last7Days.length,
      avgWordsPerEntry: 0,
      longestStreak: 0,
      currentStreak: 0,
      favoriteTime: null,
      dominantHarmony: null
    };

    if (allEntries.length > 0) {
      // Calculate average words
      const totalWords = allEntries.reduce((sum, e) => sum + e.wordCount, 0);
      stats.avgWordsPerEntry = Math.round(totalWords / allEntries.length);
      
      // Find favorite writing time
      const hours = allEntries.map(e => new Date(e.timestamp).getHours());
      const hourCounts = {};
      hours.forEach(h => hourCounts[h] = (hourCounts[h] || 0) + 1);
      const favoriteHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0];
      if (favoriteHour) {
        stats.favoriteTime = `${favoriteHour[0]}:00`;
      }
      
      // Calculate streaks
      stats.currentStreak = this.calculateCurrentStreak(allEntries);
      stats.longestStreak = this.calculateLongestStreak(allEntries);
      
      // Find dominant harmony
      const metrics = this.calculateEvolutionMetrics(last30Days);
      stats.dominantHarmony = metrics.dominantHarmony;
    }
    
    return stats;
  }

  calculateCurrentStreak(entries) {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let checkDate = new Date(today);
    
    // Sort entries by date descending
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasEntry = sortedEntries.some(e => 
        e.timestamp.startsWith(dateStr)
      );
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        // Streak broken
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  }

  calculateLongestStreak(entries) {
    if (entries.length === 0) return 0;
    
    // Group entries by date
    const entriesByDate = {};
    entries.forEach(e => {
      const date = e.timestamp.split('T')[0];
      entriesByDate[date] = true;
    });
    
    const dates = Object.keys(entriesByDate).sort();
    let longest = 1;
    let current = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    
    return longest;
  }

  async interactiveMode() {
    await this.initialize();
    
    console.log('\n📈 Consciousness Development Tracker\n');
    console.log('Your journey data never leaves this device.\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    while (true) {
      const choice = await question(`
What would you like to do?
1. Add journal entry
2. Analyze recent evolution
3. Generate insight report  
4. View statistics
5. Quick add (one line)
6. Exit

Choice: `);

      if (choice === '1') {
        console.log('\nShare your reflection (end with empty line):\n');
        let content = '';
        let line;
        
        while ((line = await question('')) !== '') {
          content += line + '\n';
        }
        
        if (content.trim()) {
          const entry = await this.addEntry(content.trim());
          console.log('\n✨ Entry recorded!');
          
          if (entry.analysis) {
            console.log(`📊 Self-awareness: ${entry.analysis.selfAwareness}/10`);
            if (entry.analysis.harmonies.length > 0) {
              console.log(`🎵 Harmonies: ${entry.analysis.harmonies.join(', ')}`);
            }
            if (entry.analysis.aiInsight) {
              console.log(`💡 Insight: ${entry.analysis.aiInsight}`);
            }
          }
        }
        
      } else if (choice === '2') {
        const days = await question('\nAnalyze last how many days? (default: 30) ');
        const evolution = await this.analyzeEvolution(parseInt(days) || 30);
        
        if (evolution.error) {
          console.log(`\n${evolution.error}`);
          console.log(evolution.suggestion);
        } else {
          console.log('\n🌱 Evolution Analysis:\n');
          console.log(`Period: ${evolution.period}`);
          console.log(`Entries: ${evolution.entryCount}`);
          console.log(`Trajectory: ${evolution.trajectory}`);
          console.log(`Awareness growth: ${evolution.awarenessGrowth}`);
          
          if (evolution.aiAnalysis) {
            console.log(`\n${evolution.aiAnalysis}`);
          }
        }
        
      } else if (choice === '3') {
        const theme = await question('\nWhat theme to explore? ');
        const report = await this.generateInsightReport(theme);
        
        if (report.error) {
          console.log(`\n${report.error}`);
          console.log(report.suggestion);
        } else {
          console.log('\n💡 Insight Report:\n');
          console.log(`Theme: "${report.theme}"`);
          console.log(`Mentions: ${report.entryCount} times`);
          console.log(`First explored: ${new Date(report.firstMention).toLocaleDateString()}`);
          
          if (report.insights) {
            console.log(`\n${report.insights}`);
          }
        }
        
      } else if (choice === '4') {
        const stats = await this.getStats();
        console.log('\n📊 Your Consciousness Journey:\n');
        console.log(`Total entries: ${stats.total}`);
        console.log(`Last 30 days: ${stats.last30Days}`);
        console.log(`Last 7 days: ${stats.last7Days}`);
        console.log(`Current streak: ${stats.currentStreak} days`);
        console.log(`Longest streak: ${stats.longestStreak} days`);
        console.log(`Average words/entry: ${stats.avgWordsPerEntry}`);
        
        if (stats.favoriteTime) {
          console.log(`Favorite writing time: ${stats.favoriteTime}`);
        }
        if (stats.dominantHarmony) {
          console.log(`Dominant harmony: ${stats.dominantHarmony}`);
        }
        
      } else if (choice === '5') {
        const quickEntry = await question('\nQuick entry: ');
        if (quickEntry.trim()) {
          const entry = await this.addEntry(quickEntry.trim());
          console.log('✨ Recorded!');
          if (entry.analysis?.selfAwareness) {
            console.log(`Awareness: ${entry.analysis.selfAwareness}/10`);
          }
        }
        
      } else if (choice === '6') {
        break;
      }
    }

    const stats = await this.getStats();
    if (stats.currentStreak > 0) {
      console.log(`\n🔥 Keep your ${stats.currentStreak}-day streak going!`);
    }
    console.log('\n🙏 Keep growing in awareness!\n');
    
    rl.close();
  }
}

// CLI Interface
async function main() {
  const tracker = new ConsciousnessTracker();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    await tracker.interactiveMode();
  } else if (args[0] === '--add' || args[0] === '-a') {
    const content = args.slice(1).join(' ');
    if (!content) {
      console.log('Please provide content to add');
      return;
    }
    
    await tracker.initialize();
    const entry = await tracker.addEntry(content);
    console.log('\n✨ Entry added!');
    
    if (entry.analysis) {
      console.log(`Self-awareness: ${entry.analysis.selfAwareness}/10`);
      if (entry.analysis.harmonies.length > 0) {
        console.log(`Harmonies: ${entry.analysis.harmonies.join(', ')}`);
      }
    }
    
  } else if (args[0] === '--evolution' || args[0] === '-e') {
    await tracker.initialize();
    const days = parseInt(args[1]) || 30;
    const evolution = await tracker.analyzeEvolution(days);
    
    if (evolution.error) {
      console.log(evolution.error);
    } else {
      console.log(`\n📈 ${evolution.period} Evolution:`);
      console.log(`Trajectory: ${evolution.trajectory}`);
      console.log(`Growth: ${evolution.awarenessGrowth}`);
      
      if (evolution.aiAnalysis) {
        console.log(`\n${evolution.aiAnalysis}`);
      }
    }
    
  } else if (args[0] === '--theme' || args[0] === '-t') {
    await tracker.initialize();
    const theme = args.slice(1).join(' ');
    if (!theme) {
      console.log('Please provide a theme to explore');
      return;
    }
    
    const report = await tracker.generateInsightReport(theme);
    if (report.error) {
      console.log(report.error);
    } else {
      console.log(`\n💡 "${theme}" Insights:`);
      console.log(`Explored ${report.entryCount} times`);
      
      if (report.insights) {
        console.log(`\n${report.insights}`);
      }
    }
    
  } else if (args[0] === '--stats' || args[0] === '-s') {
    await tracker.initialize();
    const stats = await tracker.getStats();
    
    console.log('\n📊 Consciousness Journey Stats:\n');
    console.log(`Total entries: ${stats.total}`);
    console.log(`Current streak: ${stats.currentStreak} days`);
    console.log(`Longest streak: ${stats.longestStreak} days`);
    
    if (stats.favoriteTime) {
      console.log(`Favorite time: ${stats.favoriteTime}`);
    }
    if (stats.dominantHarmony) {
      console.log(`Dominant harmony: ${stats.dominantHarmony}`);
    }
    
  } else {
    console.log(`
📈 Consciousness Development Tracker

Usage:
  consciousness-tracker              Interactive mode
  consciousness-tracker -a <entry>   Quick add entry
  consciousness-tracker -e [days]    Analyze evolution
  consciousness-tracker -t <theme>   Explore theme
  consciousness-tracker -s           View statistics

Examples:
  consciousness-tracker -a "Today I noticed my breath naturally slowing"
  consciousness-tracker -e 7
  consciousness-tracker -t "shadow work"

All data is private and stays on your device.
`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ConsciousnessTracker };