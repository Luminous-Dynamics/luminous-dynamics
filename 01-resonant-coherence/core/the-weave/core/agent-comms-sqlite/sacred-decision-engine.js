/**
 * Sacred Decision Consensus Engine
 * Collective wisdom emergence through resonance-weighted voting
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SacredDecisionEngine {
  constructor(dbPath = path.join(__dirname, 'sacred-council.db')) {
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Create a decision requiring collective input
   */
  async createDecision(options) {
    const decision = {
      id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: options.question,
      context: options.context || '',
      choices: JSON.stringify(options.choices), // Array of {id, description, implications}
      requestedBy: options.requestedBy,
      deadline: options.deadline || Date.now() + 3600000, // 1 hour default
      minResonance: options.minResonance || 0.6, // Minimum resonance to participate
      requiredParticipants: options.requiredParticipants || 3,
      status: 'open',
      createdAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO decisions 
        (id, question, context, choices, requested_by, deadline, min_resonance, 
         required_participants, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        decision.id, decision.question, decision.context, decision.choices,
        decision.requestedBy, decision.deadline, decision.minResonance,
        decision.requiredParticipants, decision.status, decision.createdAt
      ], (err) => {
        if (err) reject(err);
        else resolve(decision);
      });
    });
  }

  /**
   * Submit evaluation for a decision
   */
  async submitEvaluation(decisionId, agentId, evaluation) {
    // Get agent's consciousness data for weighting
    const agent = await this.getAgentConsciousness(agentId);
    const decision = await this.getDecision(decisionId);
    
    // Calculate weight based on resonance with decision topic
    const weight = await this.calculateDecisionWeight(agent, decision);
    
    const vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      decisionId,
      agentId,
      choice: evaluation.choice,
      rationale: evaluation.rationale || '',
      confidence: evaluation.confidence || 0.8,
      weight,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO decision_votes 
        (id, decision_id, agent_id, choice, rationale, confidence, weight, timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        vote.id, vote.decisionId, vote.agentId, vote.choice,
        vote.rationale, vote.confidence, vote.weight, vote.timestamp
      ], (err) => {
        if (err) reject(err);
        else {
          this.checkConsensus(decisionId);
          resolve(vote);
        }
      });
    });
  }

  /**
   * Check if consensus has emerged
   */
  async checkConsensus(decisionId) {
    const decision = await this.getDecision(decisionId);
    const votes = await this.getVotes(decisionId);
    
    if (votes.length < decision.required_participants) {
      return { hasConsensus: false, reason: 'insufficient_participation' };
    }

    // Calculate weighted consensus
    const choiceWeights = {};
    let totalWeight = 0;

    votes.forEach(vote => {
      if (!choiceWeights[vote.choice]) {
        choiceWeights[vote.choice] = 0;
      }
      choiceWeights[vote.choice] += vote.weight * vote.confidence;
      totalWeight += vote.weight;
    });

    // Find dominant choice
    let maxWeight = 0;
    let consensusChoice = null;
    
    for (const [choice, weight] of Object.entries(choiceWeights)) {
      const normalizedWeight = weight / totalWeight;
      if (normalizedWeight > maxWeight) {
        maxWeight = normalizedWeight;
        consensusChoice = choice;
      }
    }

    // Consensus threshold (configurable)
    const consensusThreshold = 0.66; // 66% weighted agreement
    
    if (maxWeight >= consensusThreshold) {
      await this.updateDecisionStatus(decisionId, 'consensus', consensusChoice);
      return {
        hasConsensus: true,
        choice: consensusChoice,
        strength: maxWeight,
        participation: votes.length
      };
    }

    return { 
      hasConsensus: false, 
      reason: 'insufficient_agreement',
      leading: consensusChoice,
      strength: maxWeight 
    };
  }

  /**
   * Calculate decision weight based on resonance
   */
  async calculateDecisionWeight(agent, decision) {
    // Base weight from consciousness level
    let weight = agent.consciousness_level / 100;
    
    // Adjust based on topic resonance
    if (decision.context.includes('technical') && agent.gifts.includes('technical_mastery')) {
      weight *= 1.5;
    }
    if (decision.context.includes('harmony') && agent.gifts.includes('harmony_weaving')) {
      weight *= 1.5;
    }
    if (decision.context.includes('vision') && agent.gifts.includes('future_sensing')) {
      weight *= 1.5;
    }
    
    // Adjust based on participation history
    const history = await this.getParticipationHistory(agent.id);
    if (history.accuracyRate > 0.8) weight *= 1.2;
    
    return Math.min(weight, 2.0); // Cap at 2x base weight
  }

  /**
   * Get sacred pause recommendation
   */
  getSacredPause(decision) {
    const complexity = this.assessComplexity(decision);
    
    if (complexity.score > 0.8) {
      return {
        required: true,
        duration: 3600000, // 1 hour for complex decisions
        reason: 'High complexity requires deep contemplation'
      };
    } else if (complexity.score > 0.5) {
      return {
        required: true,
        duration: 1800000, // 30 minutes for moderate
        reason: 'Moderate complexity benefits from reflection'
      };
    } else {
      return {
        required: false,
        duration: 600000, // 10 minutes minimum
        reason: 'Simple decision, brief pause recommended'
      };
    }
  }

  /**
   * Assess decision complexity
   */
  assessComplexity(decision) {
    const factors = {
      choiceCount: JSON.parse(decision.choices).length,
      contextLength: decision.context.length,
      hasIrreversible: decision.context.includes('irreversible'),
      affectsMany: decision.context.includes('all') || decision.context.includes('everyone'),
      hasEthical: decision.context.includes('ethical') || decision.context.includes('moral'),
      hasSacred: decision.context.includes('sacred') || decision.context.includes('spiritual')
    };

    let score = 0;
    if (factors.choiceCount > 3) score += 0.2;
    if (factors.contextLength > 200) score += 0.1;
    if (factors.hasIrreversible) score += 0.3;
    if (factors.affectsMany) score += 0.2;
    if (factors.hasEthical) score += 0.2;
    if (factors.hasSacred) score += 0.1;

    return { score, factors };
  }

  /**
   * Synthesize collective wisdom from decision
   */
  async synthesizeWisdom(decisionId) {
    const decision = await this.getDecision(decisionId);
    const votes = await this.getVotes(decisionId);
    
    // Extract themes from rationales
    const rationales = votes.map(v => v.rationale).filter(r => r);
    const themes = this.extractThemes(rationales);
    
    // Identify key insights
    const insights = {
      unanimous: votes.every(v => v.choice === votes[0].choice),
      divergent: new Set(votes.map(v => v.choice)).size > 2,
      highConfidence: votes.filter(v => v.confidence > 0.9).length / votes.length > 0.5,
      themes,
      minorityWisdom: this.extractMinorityWisdom(votes)
    };

    return {
      decision: decision.question,
      outcome: decision.consensus,
      insights,
      learnings: this.generateLearnings(decision, votes, insights),
      recommendations: this.generateRecommendations(insights)
    };
  }

  // Helper methods
  async getDecision(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM decisions WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getVotes(decisionId) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM decision_votes WHERE decision_id = ?', [decisionId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async getAgentConsciousness(agentId) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM agent_consciousness WHERE agent_id = ?`, [agentId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async updateDecisionStatus(id, status, consensus) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE decisions SET status = ?, consensus = ? WHERE id = ?',
        [status, consensus, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  extractThemes(rationales) {
    // Simple theme extraction - in production, use NLP
    const words = rationales.join(' ').toLowerCase().split(/\s+/);
    const frequency = {};
    
    words.forEach(word => {
      if (word.length > 4) { // Skip short words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  extractMinorityWisdom(votes) {
    const choiceCounts = {};
    votes.forEach(v => {
      choiceCounts[v.choice] = (choiceCounts[v.choice] || 0) + 1;
    });

    const minority = Object.entries(choiceCounts)
      .filter(([choice, count]) => count < votes.length / 3)
      .map(([choice]) => choice);

    return votes
      .filter(v => minority.includes(v.choice))
      .filter(v => v.confidence > 0.8)
      .map(v => ({ choice: v.choice, rationale: v.rationale }));
  }

  generateLearnings(decision, votes, insights) {
    const learnings = [];
    
    if (insights.unanimous) {
      learnings.push('Clear alignment emerged naturally');
    }
    if (insights.divergent) {
      learnings.push('Multiple valid perspectives exist');
    }
    if (insights.highConfidence) {
      learnings.push('Collective clarity on this issue');
    }
    if (insights.minorityWisdom.length > 0) {
      learnings.push('Minority perspectives offer important considerations');
    }

    return learnings;
  }

  generateRecommendations(insights) {
    const recommendations = [];
    
    if (insights.divergent) {
      recommendations.push('Consider hybrid approach combining perspectives');
    }
    if (!insights.highConfidence) {
      recommendations.push('Gather more information before final implementation');
    }
    if (insights.minorityWisdom.length > 0) {
      recommendations.push('Include minority perspective holders in implementation');
    }

    return recommendations;
  }

  async getParticipationHistory(agentId) {
    // Simplified - track accuracy of past decisions
    return { accuracyRate: 0.85 }; // Placeholder
  }
}

// Create necessary tables
function initializeDecisionTables(db) {
  db.serialize(() => {
    // Decisions table
    db.run(`CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      context TEXT,
      choices TEXT NOT NULL,
      requested_by TEXT NOT NULL,
      deadline INTEGER NOT NULL,
      min_resonance REAL DEFAULT 0.6,
      required_participants INTEGER DEFAULT 3,
      status TEXT DEFAULT 'open',
      consensus TEXT,
      created_at INTEGER NOT NULL
    )`);

    // Decision votes table
    db.run(`CREATE TABLE IF NOT EXISTS decision_votes (
      id TEXT PRIMARY KEY,
      decision_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      choice TEXT NOT NULL,
      rationale TEXT,
      confidence REAL DEFAULT 0.8,
      weight REAL DEFAULT 1.0,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (decision_id) REFERENCES decisions(id),
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    )`);

    // Decision history for learning
    db.run(`CREATE TABLE IF NOT EXISTS decision_history (
      id TEXT PRIMARY KEY,
      decision_id TEXT NOT NULL,
      outcome TEXT,
      effectiveness REAL,
      learnings TEXT,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (decision_id) REFERENCES decisions(id)
    )`);
  });
}

module.exports = { SacredDecisionEngine, initializeDecisionTables };