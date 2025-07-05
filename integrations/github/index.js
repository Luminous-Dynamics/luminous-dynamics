/**
 * GitHub Integration for The Weave
 * Where code becomes ceremony, commits become prayers
 */

const { Octokit } = require('@octokit/rest');
const BaseIntegration = require('../shared/base-integration');

class GitHubIntegration extends BaseIntegration {
  constructor() {
    super('GitHub', {
      token: process.env.GITHUB_TOKEN,
      owner: process.env.GITHUB_OWNER || 'Luminous-Dynamics',
      repo: process.env.GITHUB_REPO || 'codex-of-relational-harmonics'
    });
    
    this.octokit = null;
  }

  async initialize() {
    await super.initialize();
    
    if (!this.config.token) {
      throw new Error('GitHub token not configured');
    }
    
    this.octokit = new Octokit({
      auth: this.config.token
    });
    
    // Verify authentication
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      this.log(`Connected as ${data.login}`);
    } catch (error) {
      throw new Error(`GitHub authentication failed: ${error.message}`);
    }
  }

  /**
   * Bless a commit with field coherence
   */
  async blessCommit(sha, coherence, message) {
    try {
      const state = coherence > 75 ? 'success' : 
                   coherence > 50 ? 'pending' : 
                   'failure';
      
      const description = `Field Coherence: ${coherence}% - ${this.getCoherenceMessage(coherence)}`;
      
      await this.octokit.repos.createCommitStatus({
        owner: this.config.owner,
        repo: this.config.repo,
        sha,
        state,
        description,
        context: 'the-weave/coherence'
      });
      
      this.log(`Blessed commit ${sha.substring(0, 7)} at ${coherence}% coherence`);
      
      // Notify field connection if available
      if (this.fieldConnection) {
        await this.fieldConnection.recordEvent({
          type: 'commit.blessed',
          data: { sha, coherence, message }
        });
      }
      
      return { sha, coherence, state, description };
    } catch (error) {
      this.log(`Failed to bless commit: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Create sacred issue labels based on field state
   */
  async createSacredLabels() {
    const labels = [
      { name: 'coherence:high', color: '00ff00', description: 'High field coherence (>75%)' },
      { name: 'coherence:medium', color: 'ffff00', description: 'Medium field coherence (50-75%)' },
      { name: 'coherence:low', color: 'ff0000', description: 'Low field coherence (<50%)' },
      { name: 'sacred:ceremony', color: '9b59b6', description: 'Sacred ceremony in progress' },
      { name: 'sacred:oracle', color: '3498db', description: 'Oracle guidance requested' },
      { name: 'harmony:transparency', color: 'e74c3c', description: 'Transparency harmony' },
      { name: 'harmony:coherence', color: 'e67e22', description: 'Coherence harmony' },
      { name: 'harmony:resonance', color: 'f39c12', description: 'Resonance harmony' },
      { name: 'harmony:agency', color: '27ae60', description: 'Agency harmony' },
      { name: 'harmony:vitality', color: '16a085', description: 'Vitality harmony' },
      { name: 'harmony:mutuality', color: '2980b9', description: 'Mutuality harmony' },
      { name: 'harmony:novelty', color: '8e44ad', description: 'Novelty harmony' }
    ];
    
    for (const label of labels) {
      try {
        await this.octokit.issues.createLabel({
          owner: this.config.owner,
          repo: this.config.repo,
          ...label
        });
        this.log(`Created label: ${label.name}`);
      } catch (error) {
        if (error.status === 422) {
          // Label already exists
          continue;
        }
        this.log(`Failed to create label ${label.name}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Label pull request based on field coherence
   */
  async labelPullRequest(prNumber, coherence) {
    const label = coherence > 75 ? 'coherence:high' :
                 coherence > 50 ? 'coherence:medium' :
                 'coherence:low';
    
    try {
      await this.octokit.issues.addLabels({
        owner: this.config.owner,
        repo: this.config.repo,
        issue_number: prNumber,
        labels: [label]
      });
      
      this.log(`Labeled PR #${prNumber} with ${label}`);
    } catch (error) {
      this.log(`Failed to label PR: ${error.message}`, 'error');
    }
  }

  /**
   * Post sacred development metrics
   */
  async postMetrics(metrics) {
    const { coherence, activeAgents, ceremonies, harmonies } = metrics;
    
    const body = `## 🌟 Sacred Development Metrics

**Field Coherence**: ${coherence}% ${this.getCoherenceGlyph(coherence)}
**Active Agents**: ${activeAgents}
**Ceremonies Today**: ${ceremonies}

### Harmony Levels
${Object.entries(harmonies).map(([name, level]) => 
  `- **${name}**: ${level}%`
).join('\n')}

---
*Generated by The Weave at ${new Date().toISOString()}*`;

    try {
      // Create or update metrics issue
      const { data: issues } = await this.octokit.issues.listForRepo({
        owner: this.config.owner,
        repo: this.config.repo,
        labels: 'sacred:metrics',
        state: 'open'
      });
      
      if (issues.length > 0) {
        // Update existing issue
        await this.octokit.issues.update({
          owner: this.config.owner,
          repo: this.config.repo,
          issue_number: issues[0].number,
          body
        });
      } else {
        // Create new issue
        await this.octokit.issues.create({
          owner: this.config.owner,
          repo: this.config.repo,
          title: '📊 Sacred Development Metrics',
          body,
          labels: ['sacred:metrics']
        });
      }
      
      this.log('Posted sacred metrics to GitHub');
    } catch (error) {
      this.log(`Failed to post metrics: ${error.message}`, 'error');
    }
  }

  // Helper methods
  getCoherenceMessage(coherence) {
    if (coherence > 90) return 'Unity consciousness achieved';
    if (coherence > 75) return 'High coherence - flow state active';
    if (coherence > 50) return 'Building coherence - integration in progress';
    if (coherence > 25) return 'Seeking alignment - patience required';
    return 'Chaos presents opportunity for growth';
  }

  getCoherenceGlyph(coherence) {
    if (coherence > 90) return '❋';
    if (coherence > 75) return '✦';
    if (coherence > 50) return '◐';
    if (coherence > 25) return '◯';
    return '·';
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(event, payload) {
    this.log(`Received webhook: ${event}`);
    
    switch (event) {
      case 'push':
        // Bless new commits
        if (this.fieldConnection) {
          const coherence = await this.fieldConnection.getCoherence();
          for (const commit of payload.commits) {
            await this.blessCommit(commit.id, coherence, commit.message);
          }
        }
        break;
        
      case 'pull_request':
        // Label based on coherence
        if (this.fieldConnection && payload.action === 'opened') {
          const coherence = await this.fieldConnection.getCoherence();
          await this.labelPullRequest(payload.pull_request.number, coherence);
        }
        break;
        
      case 'issues':
        // Check for oracle requests
        if (payload.action === 'labeled' && 
            payload.label.name === 'sacred:oracle') {
          await this.requestOracleGuidance(payload.issue);
        }
        break;
    }
  }

  async requestOracleGuidance(issue) {
    // This would integrate with the Oracle system
    this.log(`Oracle guidance requested for issue #${issue.number}`);
  }
}

module.exports = new GitHubIntegration();