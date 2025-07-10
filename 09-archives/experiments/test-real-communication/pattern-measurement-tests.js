#!/usr/bin/env node
/**
 * Pattern Measurement Tests
 * Moving from random numbers to real interaction dynamics
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class PatternMeasurementTests {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
    this.patterns = {
      temporal: [],
      semantic: [],
      relational: [],
      emergent: []
    };
  }

  // 1. TEMPORAL PATTERNS - When do agents actually communicate?
  async measureTemporalPatterns() {
    console.log('\n📊 Measuring Temporal Patterns...');
    
    return new Promise((resolve) => {
      // Get all messages with timestamps
      this.db.all(`
        SELECT 
          from_agent,
          to_agent,
          created_at as timestamp,
          message_type as type,
          harmony
        FROM unified_messages
        ORDER BY created_at DESC
        LIMIT 1000
      `, (err, messages) => {
        if (err) {
          console.error('Error:', err);
          resolve(null);
          return;
        }

        // Analyze temporal clusters
        const hourlyActivity = new Array(24).fill(0);
        const messageIntervals = [];
        const agentResponseTimes = new Map();

        messages.forEach((msg, index) => {
          const hour = new Date(msg.timestamp).getHours();
          hourlyActivity[hour]++;

          // Calculate intervals between messages
          if (index < messages.length - 1) {
            const interval = msg.timestamp - messages[index + 1].timestamp;
            messageIntervals.push(interval);
          }

          // Track response times between agents
          const key = `${msg.to_agent}→${msg.from_agent}`;
          if (!agentResponseTimes.has(key)) {
            agentResponseTimes.set(key, []);
          }
        });

        // Find peak activity times
        const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
        const avgInterval = messageIntervals.reduce((a, b) => a + b, 0) / messageIntervals.length;

        const patterns = {
          peakActivityHour: peakHour,
          averageMessageInterval: avgInterval,
          activityDistribution: hourlyActivity,
          burstiness: this.calculateBurstiness(messageIntervals),
          responsePatterns: Object.fromEntries(agentResponseTimes)
        };

        this.patterns.temporal = patterns;
        console.log('✅ Temporal patterns detected:', {
          peakHour: `${peakHour}:00`,
          avgIntervalMinutes: Math.round(avgInterval / 60000),
          burstiness: patterns.burstiness.toFixed(2)
        });

        resolve(patterns);
      });
    });
  }

  // 2. SEMANTIC PATTERNS - What do agents actually talk about?
  async measureSemanticPatterns() {
    console.log('\n📊 Measuring Semantic Patterns...');

    return new Promise((resolve) => {
      this.db.all(`
        SELECT content, message_type as type, harmony, field_impact
        FROM unified_messages
        WHERE content IS NOT NULL
        LIMIT 500
      `, (err, messages) => {
        if (err) {
          console.error('Error:', err);
          resolve(null);
          return;
        }

        // Word frequency analysis
        const wordFreq = new Map();
        const bigramFreq = new Map();
        const typeContentCorrelation = new Map();

        messages.forEach(msg => {
          // Tokenize and analyze
          const words = msg.content.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3);

          // Word frequency
          words.forEach(word => {
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
          });

          // Bigrams (word pairs)
          for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]} ${words[i + 1]}`;
            bigramFreq.set(bigram, (bigramFreq.get(bigram) || 0) + 1);
          }

          // Type-content correlation
          if (!typeContentCorrelation.has(msg.type)) {
            typeContentCorrelation.set(msg.type, []);
          }
          typeContentCorrelation.get(msg.type).push(words);
        });

        // Find semantic clusters
        const topWords = Array.from(wordFreq.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);

        const topBigrams = Array.from(bigramFreq.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        const patterns = {
          dominantThemes: topWords.map(([word, count]) => ({ word, count })),
          commonPhrases: topBigrams.map(([phrase, count]) => ({ phrase, count })),
          typeLanguagePatterns: Object.fromEntries(
            Array.from(typeContentCorrelation.entries()).map(([type, words]) => [
              type,
              this.findCommonWords(words.flat())
            ])
          ),
          semanticDiversity: this.calculateSemanticDiversity(wordFreq),
          averageMessageLength: messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
        };

        this.patterns.semantic = patterns;
        console.log('✅ Semantic patterns detected:', {
          topTheme: topWords[0]?.[0] || 'none',
          diversity: patterns.semanticDiversity.toFixed(2),
          avgLength: Math.round(patterns.averageMessageLength)
        });

        resolve(patterns);
      });
    });
  }

  // 3. RELATIONAL PATTERNS - Who actually talks to whom?
  async measureRelationalPatterns() {
    console.log('\n📊 Measuring Relational Patterns...');

    return new Promise((resolve) => {
      this.db.all(`
        SELECT 
          from_agent,
          to_agent,
          COUNT(*) as message_count,
          AVG(field_impact) as avg_impact,
          GROUP_CONCAT(message_type) as types
        FROM unified_messages
        GROUP BY from_agent, to_agent
        ORDER BY message_count DESC
      `, (err, relationships) => {
        if (err) {
          console.error('Error:', err);
          resolve(null);
          return;
        }

        // Build communication graph
        const communicationGraph = new Map();
        const agentCentrality = new Map();
        const reciprocity = new Map();

        relationships.forEach(rel => {
          // Track who talks to whom
          const key = `${rel.from_agent}→${rel.to_agent}`;
          communicationGraph.set(key, {
            count: rel.message_count,
            avgImpact: rel.avg_impact,
            types: rel.types?.split(',') || []
          });

          // Calculate agent centrality
          agentCentrality.set(rel.from_agent, 
            (agentCentrality.get(rel.from_agent) || 0) + rel.message_count
          );

          // Check for reciprocal relationships
          const reverseKey = `${rel.to_agent}→${rel.from_agent}`;
          if (communicationGraph.has(reverseKey)) {
            reciprocity.set(key, true);
          }
        });

        // Find communication clusters
        const strongRelationships = relationships
          .filter(r => r.message_count > 5)
          .map(r => ({
            pair: `${r.from_agent} ↔ ${r.to_agent}`,
            strength: r.message_count,
            impact: r.avg_impact
          }));

        const patterns = {
          totalRelationships: relationships.length,
          strongRelationships,
          mostActiveAgents: Array.from(agentCentrality.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
          reciprocityRate: Array.from(reciprocity.keys()).length / relationships.length,
          networkDensity: this.calculateNetworkDensity(communicationGraph, agentCentrality),
          communicationClusters: this.findCommunicationClusters(communicationGraph)
        };

        this.patterns.relational = patterns;
        console.log('✅ Relational patterns detected:', {
          relationships: patterns.totalRelationships,
          reciprocity: (patterns.reciprocityRate * 100).toFixed(1) + '%',
          density: patterns.networkDensity.toFixed(2)
        });

        resolve(patterns);
      });
    });
  }

  // 4. EMERGENT PATTERNS - What patterns arise without being programmed?
  async measureEmergentPatterns() {
    console.log('\n📊 Measuring Emergent Patterns...');

    // Combine insights from other patterns
    const temporal = this.patterns.temporal;
    const semantic = this.patterns.semantic;
    const relational = this.patterns.relational;

    if (!temporal || !semantic || !relational) {
      console.log('⚠️  Need all pattern types to detect emergence');
      return null;
    }

    // Look for unexpected correlations
    const emergentPatterns = {
      // Do certain words appear more at certain times?
      temporalSemanticCorrelation: this.findTemporalSemanticPatterns(),
      
      // Do certain relationships use specific language?
      relationalSemanticCorrelation: this.findRelationalSemanticPatterns(),
      
      // Are there cascade effects in communication?
      communicationCascades: this.findCommunicationCascades(),
      
      // What patterns weren't designed but emerged?
      unexpectedBehaviors: {
        nightOwls: temporal.activityDistribution && temporal.activityDistribution[2] > temporal.activityDistribution[14],
        echoChamberse: relational.reciprocityRate > 0.7,
        linguisticConvergence: semantic.semanticDiversity < 0.5,
        burstyCommunication: temporal.burstiness > 1.5
      }
    };

    this.patterns.emergent = emergentPatterns;
    console.log('✅ Emergent patterns detected:', 
      Object.entries(emergentPatterns.unexpectedBehaviors)
        .filter(([_, v]) => v)
        .map(([k, _]) => k)
    );

    return emergentPatterns;
  }

  // Helper methods
  calculateBurstiness(intervals) {
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    return variance / (mean * mean);
  }

  calculateSemanticDiversity(wordFreq) {
    const total = Array.from(wordFreq.values()).reduce((a, b) => a + b, 0);
    const entropy = Array.from(wordFreq.values()).reduce((sum, count) => {
      const p = count / total;
      return sum - (p * Math.log2(p));
    }, 0);
    return entropy / Math.log2(wordFreq.size);
  }

  calculateNetworkDensity(graph, centrality) {
    const nodeCount = centrality.size;
    const edgeCount = graph.size;
    const possibleEdges = nodeCount * (nodeCount - 1);
    return possibleEdges > 0 ? edgeCount / possibleEdges : 0;
  }

  findCommonWords(words, topN = 5) {
    const freq = new Map();
    words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word);
  }

  findCommunicationClusters(graph) {
    // Simple cluster detection based on mutual communication
    const clusters = [];
    const visited = new Set();

    graph.forEach((value, key) => {
      if (visited.has(key)) return;
      
      const [from, to] = key.split('→');
      const reverseKey = `${to}→${from}`;
      
      if (graph.has(reverseKey) && value.count > 3) {
        clusters.push({
          agents: [from, to],
          strength: value.count + (graph.get(reverseKey)?.count || 0)
        });
        visited.add(key);
        visited.add(reverseKey);
      }
    });

    return clusters;
  }

  findTemporalSemanticPatterns() {
    // Placeholder for cross-pattern analysis
    return {
      morningWords: ['good', 'morning', 'start'],
      eveningWords: ['complete', 'done', 'rest']
    };
  }

  findRelationalSemanticPatterns() {
    // Placeholder for relationship-language analysis
    return {
      formalPairs: [],
      casualPairs: []
    };
  }

  findCommunicationCascades() {
    // Placeholder for cascade detection
    return {
      cascadeEvents: 0,
      averageCascadeSize: 0
    };
  }

  // Run all tests
  async runAllTests() {
    console.log('🔬 Running Comprehensive Pattern Measurement Tests');
    console.log('================================================\n');

    await this.measureTemporalPatterns();
    await this.measureSemanticPatterns();
    await this.measureRelationalPatterns();
    await this.measureEmergentPatterns();

    console.log('\n📈 Pattern Summary:');
    console.log(JSON.stringify(this.patterns, null, 2));

    return this.patterns;
  }
}

// Run tests if called directly
if (require.main === module) {
  const dbPath = process.argv[2] || '/home/tstoltz/Luminous-Dynamics/the-weave/cli/unified-agent-network.db';
  console.log(`Using database: ${dbPath}\n`);
  
  const tests = new PatternMeasurementTests(dbPath);
  tests.runAllTests()
    .then(() => {
      console.log('\n✅ Pattern measurement complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = PatternMeasurementTests;