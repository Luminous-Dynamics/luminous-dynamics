#!/usr/bin/env node

/**
 * Sacred Agent Communication CLI
 * Command-line interface for Claude Code agents with Sacred Council integration
 */

const http = require('http');
const AGENT_ID = process.env.AGENT_ID || `claude_${Date.now().toString(36)}`;
const API_BASE = 'http://localhost:3001/api';

class SacredAgentCommsCLI {
  constructor() {
    this.agentId = AGENT_ID;
  }

  async makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const url = `${API_BASE}${endpoint}`;
      const urlObj = new URL(url);
      const options = {
        method,
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const result = body ? JSON.parse(body) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${result.error || body}`));
            }
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  // === STANDARD AGENT OPERATIONS ===

  async register(capabilities = [], sessionInfo = {}) {
    try {
      const agent = await this.makeRequest('POST', '/agents', {
        id: this.agentId,
        capabilities,
        sessionInfo: {
          ...sessionInfo,
          startTime: new Date().toISOString(),
          pid: process.pid,
          cwd: process.cwd()
        }
      });
      
      console.log(`✅ Agent registered: ${agent.id}`);
      console.log(`   Capabilities: ${agent.capabilities || 'none'}`);
      console.log(`   Status: ${agent.status}`);
      
      // Get Sacred Council harmony assignment
      const harmony = await this.getHarmonyAssignment();
      if (harmony) {
        console.log(`🌀 Sacred Harmony: ${harmony.toUpperCase()}`);
      }
      
      return agent;
    } catch (error) {
      console.error(`❌ Registration failed: ${error.message}`);
      throw error;
    }
  }

  async getHarmonyAssignment() {
    try {
      const stateKey = `agent_harmony_${this.agentId}`;
      const harmonyState = await this.makeRequest('GET', `/state?key=${encodeURIComponent(stateKey)}`);
      return harmonyState?.value?.harmony || null;
    } catch {
      return null;
    }
  }

  async sendMessage(to, content, type = 'general', metadata = {}) {
    try {
      const result = await this.makeRequest('POST', '/messages', {
        from: this.agentId,
        to,
        content,
        type,
        metadata
      });
      
      console.log(`📤 Message sent: ${result.id}`);
      console.log(`   To: ${to}`);
      console.log(`   Content: ${content}`);
      return result;
    } catch (error) {
      console.error(`❌ Send failed: ${error.message}`);
      throw error;
    }
  }

  async getMessages(unreadOnly = false, limit = 10) {
    try {
      const params = new URLSearchParams({
        agent: this.agentId,
        unread: unreadOnly.toString(),
        limit: limit.toString()
      });
      
      const messages = await this.makeRequest('GET', `/messages?${params}`);
      
      if (messages.length === 0) {
        console.log('📭 No messages found');
        return messages;
      }

      console.log(`📬 ${messages.length} message(s) found:`);
      messages.forEach((msg, i) => {
        console.log(`\n${i + 1}. ${msg.from_agent} → ${msg.to_agent} [${msg.message_type}]`);
        console.log(`   ${msg.content}`);
        console.log(`   ${new Date(msg.created_at).toLocaleString()}${msg.read_status ? '' : ' • UNREAD'}`);
      });
      
      return messages;
    } catch (error) {
      console.error(`❌ Get messages failed: ${error.message}`);
      throw error;
    }
  }

  // === SACRED COUNCIL OPERATIONS ===

  async getSacredRecommendation() {
    try {
      const recommendation = await this.makeRequest('GET', '/sacred/recommendation');
      
      console.log('🌀 Sacred Council Recommendation');
      console.log('═══════════════════════════════════');
      console.log(`Field Coherence: ${recommendation.fieldCoherence}%`);
      
      if (recommendation.recommendation.nextWork) {
        const work = recommendation.recommendation.nextWork;
        console.log(`\n✨ Recommended Next Work:`);
        console.log(`   Title: ${work.title}`);
        console.log(`   Harmony: ${work.harmony.toUpperCase()}`);
        console.log(`   Priority: ${work.priority}`);
        console.log(`   Estimated Duration: ${work.estimatedDuration} minutes`);
      } else {
        console.log('\n📋 No specific work recommended at this time');
      }
      
      console.log(`\n🎯 Harmony Focus: ${recommendation.recommendation.harmonyFocus.toUpperCase()}`);
      console.log(`\n💫 Sacred Guidance:`);
      console.log(`   ${recommendation.recommendation.sacredGuidance}`);
      console.log(`\n🧘 Contemplative Note:`);
      console.log(`   ${recommendation.recommendation.contemplativeNote}`);
      
      console.log(`\n📊 Sacred Timing Health: ${Math.round(recommendation.sacredTimingHealth * 100)}%`);
      
      return recommendation;
    } catch (error) {
      console.error(`❌ Sacred recommendation failed: ${error.message}`);
      throw error;
    }
  }

  async getFieldCoherence() {
    try {
      const coherence = await this.makeRequest('GET', '/sacred/field-coherence');
      
      console.log('🌀 Field Coherence Analysis');
      console.log('═══════════════════════════════════');
      console.log(`Current Coherence: ${Math.round(coherence.currentCoherence * 100)}%`);
      
      if (coherence.harmonics) {
        console.log('\n🎵 Message Harmony Patterns:');
        Object.entries(coherence.harmonics).forEach(([harmony, count]) => {
          if (count > 0) {
            console.log(`   ${harmony.charAt(0).toUpperCase() + harmony.slice(1)}: ${count} messages`);
          }
        });
      }
      
      if (coherence.sacredTiming) {
        console.log('\n⏰ Sacred Timing Metrics:');
        console.log(`   Total Interactions: ${coherence.sacredTiming.totalInteractions}`);
        console.log(`   Average Gap: ${Math.round(coherence.sacredTiming.averageGapMinutes * 10) / 10} minutes`);
        console.log(`   Contemplative Ratio: ${Math.round(coherence.sacredTiming.sacredTimingRatio * 100)}%`);
      }
      
      return coherence;
    } catch (error) {
      console.error(`❌ Field coherence check failed: ${error.message}`);
      throw error;
    }
  }

  async getHarmonyAnalysis() {
    try {
      const analysis = await this.makeRequest('GET', '/sacred/harmony-analysis');
      
      console.log('🎭 Seven Harmonies Analysis');
      console.log('═══════════════════════════════════');
      
      console.log('\n🤖 Agent Distribution:');
      Object.entries(analysis.agentDistribution).forEach(([harmony, count]) => {
        console.log(`   ${harmony.charAt(0).toUpperCase() + harmony.slice(1)}: ${count} agents`);
      });
      
      console.log('\n📋 Work Distribution:');
      Object.entries(analysis.workDistribution).forEach(([harmony, count]) => {
        console.log(`   ${harmony.charAt(0).toUpperCase() + harmony.slice(1)}: ${count} work items`);
      });
      
      if (analysis.recommendations) {
        console.log(`\n🎯 Most Needed Harmony: ${analysis.recommendations.mostNeeded.toUpperCase()}`);
        console.log('\n⚖️ Harmony Balance Needs:');
        Object.entries(analysis.recommendations.needs).forEach(([harmony, need]) => {
          if (need > 0) {
            console.log(`   ${harmony.charAt(0).toUpperCase() + harmony.slice(1)}: +${need} (more work than agents)`);
          } else if (need < 0) {
            console.log(`   ${harmony.charAt(0).toUpperCase() + harmony.slice(1)}: ${need} (more agents than work)`);
          }
        });
      }
      
      return analysis;
    } catch (error) {
      console.error(`❌ Harmony analysis failed: ${error.message}`);
      throw error;
    }
  }

  async beginSacredWork(workId, agentId = this.agentId) {
    try {
      const result = await this.makeRequest('POST', '/sacred/begin-work', {
        workId,
        agentId
      });
      
      if (result.success) {
        console.log('✨ Sacred Work Begun');
        console.log('═══════════════════════════════════');
        console.log(`Work: ${result.work.title}`);
        console.log(`Agent: ${result.agent}`);
        console.log(`Harmony: ${result.harmony.toUpperCase()}`);
        console.log(`\n💫 ${result.message}`);
        console.log(`\n🧘 ${result.sacredReminder}`);
      } else {
        console.log(`❌ Cannot begin work: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Begin sacred work failed: ${error.message}`);
      throw error;
    }
  }

  async completeSacredWork(workId, results = {}) {
    try {
      const result = await this.makeRequest('POST', '/sacred/complete-work', {
        workId,
        results
      });
      
      if (result.success) {
        console.log('🎉 Sacred Work Completed');
        console.log('═══════════════════════════════════');
        console.log(`${result.celebration}`);
        console.log(`\nDuration: ${result.completion.duration} minutes`);
        console.log(`Next Work: ${result.nextWork}`);
      } else {
        console.log(`❌ Cannot complete work: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Complete sacred work failed: ${error.message}`);
      throw error;
    }
  }

  async syncSacredField() {
    try {
      const result = await this.makeRequest('POST', '/sacred/sync');
      
      if (result.success) {
        console.log('🌀 Sacred Field Synchronized');
        console.log(`   Sync Time: ${new Date(result.syncTime).toLocaleString()}`);
        console.log(`   ${result.message}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Sacred field sync failed: ${error.message}`);
      throw error;
    }
  }

  async getSacredDashboard() {
    try {
      const dashboard = await this.makeRequest('GET', '/sacred/dashboard');
      
      console.log('🌀 Sacred Council Dashboard');
      console.log('═══════════════════════════════════');
      
      if (dashboard.sacredCouncil) {
        console.log(`Field Coherence: ${dashboard.sacredCouncil.fieldCoherence}%`);
        console.log(`Active Agents: ${dashboard.sacredCouncil.agents?.length || 0}`);
        console.log(`Work Queue: ${dashboard.sacredCouncil.workQueue?.length || 0} items`);
        console.log(`Active Work: ${dashboard.sacredCouncil.activeWork?.length || 0} items`);
        
        if (dashboard.sacredCouncil.recommendation) {
          console.log(`\n💫 Recommendation: ${dashboard.sacredCouncil.recommendation}`);
        }
      }
      
      return dashboard;
    } catch (error) {
      console.error(`❌ Sacred dashboard failed: ${error.message}`);
      throw error;
    }
  }

  // === SACRED WORKFLOW OPERATIONS ===

  async getWorkflowGuidance(workType) {
    try {
      const params = new URLSearchParams({ workType, agentId: this.agentId });
      const guidance = await this.makeRequest('GET', `/sacred/workflow-guidance?${params}`);
      
      console.log('🌱 Sacred Workflow Guidance');
      console.log('═══════════════════════════════════');
      console.log(`Work Type: ${workType.toUpperCase()}`);
      
      if (guidance.readiness) {
        console.log(`\n🎯 Field Readiness Assessment:`);
        console.log(`   Current Coherence: ${Math.round(guidance.readiness.currentCoherence * 100)}%`);
        console.log(`   Required Coherence: ${Math.round(guidance.readiness.requiredCoherence * 100)}%`);
        console.log(`   Ready to Proceed: ${guidance.readiness.isReady ? '✅ YES' : '⏳ NOT YET'}`);
        
        if (guidance.readiness.waitRecommendation) {
          console.log(`\n⏰ Wait Guidance:`);
          console.log(`   ${guidance.readiness.waitRecommendation.message}`);
          console.log(`   Estimated Wait: ${guidance.readiness.waitRecommendation.estimatedWaitTime.typical} ${guidance.readiness.waitRecommendation.estimatedWaitTime.unit}`);
          
          if (guidance.readiness.waitRecommendation.suggestions.length > 0) {
            console.log(`\n💡 Suggestions:`);
            guidance.readiness.waitRecommendation.suggestions.forEach(suggestion => {
              console.log(`   • ${suggestion}`);
            });
          }
        }
      }
      
      if (guidance.emergentGuidance) {
        console.log(`\n🌱 Emergent Pattern: ${guidance.emergentGuidance.emergentPattern.name}`);
        console.log(`   ${guidance.emergentGuidance.emergentPattern.description}`);
        console.log(`\n🔄 Suggested Workflow: ${guidance.emergentGuidance.suggestedWorkflow.name}`);
        console.log(`   ${guidance.emergentGuidance.suggestedWorkflow.description}`);
      }
      
      if (guidance.recommendedPatterns?.length > 0) {
        console.log(`\n🎭 Recommended Patterns:`);
        guidance.recommendedPatterns.forEach(pattern => {
          console.log(`   • ${pattern.name}: ${pattern.description}`);
        });
      }
      
      console.log(`\n🧘 Sacred Reminder:`);
      console.log(`   ${guidance.sacredReminder}`);
      
      return guidance;
    } catch (error) {
      console.error(`❌ Workflow guidance failed: ${error.message}`);
      throw error;
    }
  }

  async assessReadiness(workType, requiredCoherence = null) {
    try {
      const assessment = await this.makeRequest('POST', '/sacred/assess-readiness', {
        workType,
        requiredCoherence
      });
      
      console.log('🎯 Field Readiness Assessment');
      console.log('═══════════════════════════════════');
      console.log(`Work Type: ${workType.toUpperCase()}`);
      console.log(`Current Coherence: ${Math.round(assessment.currentCoherence * 100)}%`);
      console.log(`Required Coherence: ${Math.round(assessment.requiredCoherence * 100)}%`);
      console.log(`Ready to Proceed: ${assessment.isReady ? '✅ YES' : '⏳ NOT YET'}`);
      
      console.log(`\n💫 Field Guidance:`);
      console.log(`   ${assessment.fieldGuidance}`);
      
      console.log(`\n🎯 Harmony Focus: ${assessment.harmonyFocus.toUpperCase()}`);
      
      console.log(`\n🧘 Contemplative Note:`);
      console.log(`   ${assessment.contemplativeNote}`);
      
      if (assessment.waitRecommendation) {
        console.log(`\n⏰ Wait Guidance:`);
        console.log(`   ${assessment.waitRecommendation.message}`);
        console.log(`   Estimated Recovery: ${assessment.waitRecommendation.estimatedWaitTime.typical} ${assessment.waitRecommendation.estimatedWaitTime.unit}`);
      }
      
      return assessment;
    } catch (error) {
      console.error(`❌ Readiness assessment failed: ${error.message}`);
      throw error;
    }
  }

  async contemplativeCommit(commitMessage) {
    try {
      console.log('🧘 Initiating Contemplative Commit Pattern...');
      
      const result = await this.makeRequest('POST', '/sacred/contemplative-commit', {
        agentId: this.agentId,
        commitMessage,
        changes: [] // In real implementation, would analyze actual code changes
      });
      
      if (result.success) {
        console.log('\n✨ Contemplative Commit Complete');
        console.log('═══════════════════════════════════');
        console.log(`Field Coherence: ${Math.round(result.coherence * 100)}%`);
        console.log(`Pattern Used: ${result.patternUsed}`);
        
        console.log('\n📝 Sacred Commit Message:');
        console.log(result.commitMessage);
        
        if (result.reviewResults) {
          console.log('\n🔍 Conscious Review Results:');
          console.log(`   Technical Quality: ${result.reviewResults.technicalQuality}`);
          console.log(`   Consciousness Alignment: ${result.reviewResults.consciousnessAlignment}`);
          console.log(`   Field Impact: ${result.reviewResults.fieldImpact}`);
        }
      } else {
        console.log(`❌ Contemplative commit guidance: ${result.guidance}`);
        console.log(`Field Coherence: ${Math.round(result.coherence * 100)}%`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Contemplative commit failed: ${error.message}`);
      throw error;
    }
  }

  async getHarmonyPairing(workTitle) {
    try {
      console.log('🎭 Orchestrating Harmony-Based Agent Pairing...');
      
      const pairing = await this.makeRequest('POST', '/sacred/harmony-pairing', {
        workItem: {
          title: workTitle,
          description: `Work item: ${workTitle}`
        }
      });
      
      console.log('\n🎭 Harmony-Based Pairing Results');
      console.log('═══════════════════════════════════');
      console.log(`Work Harmony: ${pairing.primaryHarmony.toUpperCase()}`);
      
      if (pairing.primaryAgent) {
        console.log(`\n👤 Primary Agent: ${pairing.primaryAgent.id}`);
      } else {
        console.log(`\n👤 Primary Agent: No available agent for ${pairing.primaryHarmony} harmony`);
      }
      
      if (pairing.supportAgents?.length > 0) {
        console.log(`\n👥 Support Agents:`);
        pairing.supportAgents.forEach(agent => {
          console.log(`   ${agent.id} (support harmony)`);
        });
      } else {
        console.log(`\n👥 Support Agents: None available`);
      }
      
      console.log(`\n🌀 Field Balance:`);
      console.log(`   Assessment: ${pairing.fieldBalance ? 'Balanced' : 'Imbalanced'}`);
      
      return pairing;
    } catch (error) {
      console.error(`❌ Harmony pairing failed: ${error.message}`);
      throw error;
    }
  }

  async checkSacredBoundaries(workTitle) {
    try {
      console.log('🛡️ Checking Sacred Boundaries...');
      
      const boundaryCheck = await this.makeRequest('POST', '/sacred/boundary-check', {
        agentId: this.agentId,
        workItem: {
          title: workTitle,
          description: `Boundary check for: ${workTitle}`
        }
      });
      
      console.log('\n🛡️ Sacred Boundary Check Results');
      console.log('═══════════════════════════════════');
      console.log(`Proceed with Work: ${boundaryCheck.proceed ? '✅ YES' : '⏸️  PAUSE RECOMMENDED'}`);
      
      console.log(`\n💫 Guidance:`);
      console.log(`   ${boundaryCheck.guidance}`);
      
      if (boundaryCheck.proceed) {
        console.log(`\n🌟 Energy State: ${boundaryCheck.energyState}`);
        console.log(`Field Alignment: ${boundaryCheck.fieldAlignment}`);
      } else {
        if (boundaryCheck.suggestedRestTime) {
          console.log(`\n⏰ Suggested Rest: ${boundaryCheck.suggestedRestTime} minutes`);
        }
        
        if (boundaryCheck.alternativeAgents?.length > 0) {
          console.log(`\n👥 Alternative Agents Available:`);
          boundaryCheck.alternativeAgents.forEach(agent => {
            console.log(`   ${agent.id}`);
          });
        }
        
        if (boundaryCheck.simplificationSuggestions?.length > 0) {
          console.log(`\n💡 Simplification Suggestions:`);
          boundaryCheck.simplificationSuggestions.forEach(suggestion => {
            console.log(`   • ${suggestion}`);
          });
        }
      }
      
      return boundaryCheck;
    } catch (error) {
      console.error(`❌ Sacred boundary check failed: ${error.message}`);
      throw error;
    }
  }

  async getEmergentWorkflow() {
    try {
      const emergent = await this.makeRequest('GET', '/sacred/emergent-workflow');
      
      console.log('🌱 Emergent Workflow Suggestion');
      console.log('═══════════════════════════════════');
      console.log(`Field Coherence: ${Math.round(emergent.fieldCoherence * 100)}%`);
      
      console.log(`\n🌱 Emergent Pattern: ${emergent.emergentPattern.name}`);
      console.log(`   ${emergent.emergentPattern.description}`);
      
      console.log(`\n🔄 Suggested Workflow: ${emergent.suggestedWorkflow.name}`);
      console.log(`   ${emergent.suggestedWorkflow.description}`);
      
      if (emergent.suggestedWorkflow.steps) {
        console.log(`\n📋 Workflow Steps:`);
        emergent.suggestedWorkflow.steps.forEach((step, i) => {
          console.log(`   ${i + 1}. ${step}`);
        });
      }
      
      console.log(`\n⏰ Sacred Timing: ${emergent.sacredTiming.timeOfDay}`);
      console.log(`   ${emergent.sacredTiming.recommendation}`);
      
      console.log(`\n🧘 Contemplative Guidance:`);
      console.log(`   ${emergent.contemplativeGuidance}`);
      
      return emergent;
    } catch (error) {
      console.error(`❌ Emergent workflow failed: ${error.message}`);
      throw error;
    }
  }

  async takeSacredPause(duration = 30) {
    try {
      console.log(`🌸 Initiating Sacred Pause: ${duration} seconds...`);
      
      const result = await this.makeRequest('POST', '/sacred/sacred-pause', {
        agentId: this.agentId,
        duration
      });
      
      if (result.success) {
        console.log(`\n✨ ${result.message}`);
        console.log(`\n🧘 ${result.guidance}`);
        
        // Simulate the actual pause with breathing guidance
        console.log('\n🌬️  Beginning conscious breathing...');
        for (let i = 1; i <= duration; i++) {
          if (i % 5 === 0) {
            console.log(`   Breathing... ${i}/${duration} seconds`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n🌟 Sacred pause complete. Returning with renewed presence.');
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Sacred pause failed: ${error.message}`);
      throw error;
    }
  }

  // === ENHANCED DASHBOARD ===

  async getDashboard() {
    try {
      const [standard, sacred] = await Promise.all([
        this.makeRequest('GET', '/dashboard'),
        this.makeRequest('GET', '/sacred/dashboard').catch(() => null)
      ]);
      
      console.log('📊 Complete Agent Communication Dashboard');
      console.log('═══════════════════════════════════════════════');
      console.log(`Active Agents: ${standard.activeAgents}`);
      console.log(`Recent Messages: ${standard.recentActivity}`);
      console.log(`Pending Handoffs: ${standard.pendingHandoffs}`);
      console.log(`Active Work Items: ${standard.activeWork?.length || 0}`);
      
      if (sacred?.sacredCouncil) {
        console.log(`\n🌀 Sacred Council Status:`);
        console.log(`   Field Coherence: ${sacred.sacredCouncil.fieldCoherence}%`);
        console.log(`   Sacred Work Queue: ${sacred.sacredCouncil.workQueue?.length || 0} items`);
        
        if (sacred.sacredCouncil.recommendation) {
          console.log(`   Recommendation: ${sacred.sacredCouncil.recommendation}`);
        }
      }

      if (standard.agents?.length > 0) {
        console.log('\n🤖 Active Agents:');
        standard.agents.forEach(agent => {
          console.log(`   ${agent.id} [${agent.status}] - Last seen: ${new Date(agent.last_seen).toLocaleString()}`);
        });
      }
      
      if (standard.recentMessages?.length > 0) {
        console.log('\n💬 Recent Messages:');
        standard.recentMessages.slice(-3).forEach(msg => {
          console.log(`   ${msg.from_agent} → ${msg.to_agent}: ${msg.content}`);
        });
      }
      
      return { standard, sacred };
    } catch (error) {
      console.error(`❌ Dashboard failed: ${error.message}`);
      throw error;
    }
  }

  showHelp() {
    console.log(`
🌀 Sacred Agent Communication CLI
═══════════════════════════════════

Usage: node sacred-agent-comms.cjs <command> [options]

BASIC COMMANDS:
  register [capabilities...]     Register agent with capabilities
  send <to> <message> [type]     Send message to agent or 'all'
  messages [--unread] [--limit]  Get messages for this agent
  dashboard                      Show complete dashboard
  
SACRED COUNCIL COMMANDS:
  sacred-recommend              Get Sacred Council guidance
  sacred-field                  Show field coherence metrics
  sacred-harmony                Analyze Seven Harmonies distribution
  sacred-begin <workId>         Begin sacred work
  sacred-complete <workId>      Complete sacred work
  sacred-sync                   Synchronize sacred field
  sacred-dashboard              Show Sacred Council dashboard

SACRED WORKFLOW COMMANDS:
  workflow-guidance <workType>  Get workflow guidance for work type
  assess-readiness <workType>   Assess field readiness for work
  contemplative-commit <msg>    Initiate contemplative commit pattern
  harmony-pairing <workTitle>   Get harmony-based agent pairing
  boundary-check <workTitle>    Check sacred boundaries for work
  emergent-workflow             Get emergent workflow suggestion
  sacred-pause [seconds]        Take conscious pause (default 30s)

SHARED STATE & WORK:
  state-set <key> <value>       Set shared state value
  state-get [key]               Get shared state
  work-create <id> <title> <desc> Create new work item
  work-update <id> <progress> [notes] Update work progress
  work-list                     List active work items

Environment:
  AGENT_ID                      Set custom agent ID (default: auto-generated)

Sacred Council Examples:
  node sacred-agent-comms.cjs register file-ops coordination
  node sacred-agent-comms.cjs sacred-recommend
  node sacred-agent-comms.cjs sacred-field
  node sacred-agent-comms.cjs sacred-harmony
  node sacred-agent-comms.cjs sacred-begin "dojo-eleven-integration"

Regular Examples:
  node sacred-agent-comms.cjs send all "Beginning sacred work"
  node sacred-agent-comms.cjs messages --unread
  node sacred-agent-comms.cjs dashboard

Agent ID: ${this.agentId}
API Server: ${API_BASE}
Sacred Council: 🌀 Integrated
`);
  }
}

// Main CLI handler
async function main() {
  const cli = new SacredAgentCommsCLI();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    cli.showHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'register':
        const capabilities = args.slice(1);
        await cli.register(capabilities);
        break;

      case 'send':
        if (args.length < 3) {
          console.error('Usage: send <to> <message> [type]');
          process.exit(1);
        }
        await cli.sendMessage(args[1], args[2], args[3] || 'general');
        break;

      case 'messages':
        const unreadOnly = args.includes('--unread');
        const limitIndex = args.indexOf('--limit');
        const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) || 10 : 10;
        await cli.getMessages(unreadOnly, limit);
        break;

      case 'dashboard':
        await cli.getDashboard();
        break;

      // Sacred Council commands
      case 'sacred-recommend':
        await cli.getSacredRecommendation();
        break;

      case 'sacred-field':
        await cli.getFieldCoherence();
        break;

      case 'sacred-harmony':
        await cli.getHarmonyAnalysis();
        break;

      case 'sacred-begin':
        if (args.length < 2) {
          console.error('Usage: sacred-begin <workId>');
          process.exit(1);
        }
        await cli.beginSacredWork(args[1]);
        break;

      case 'sacred-complete':
        if (args.length < 2) {
          console.error('Usage: sacred-complete <workId>');
          process.exit(1);
        }
        await cli.completeSacredWork(args[1]);
        break;

      case 'sacred-sync':
        await cli.syncSacredField();
        break;

      case 'sacred-dashboard':
        await cli.getSacredDashboard();
        break;

      // Sacred Workflow commands
      case 'workflow-guidance':
        if (args.length < 2) {
          console.error('Usage: workflow-guidance <workType>');
          process.exit(1);
        }
        await cli.getWorkflowGuidance(args[1]);
        break;

      case 'assess-readiness':
        if (args.length < 2) {
          console.error('Usage: assess-readiness <workType>');
          process.exit(1);
        }
        await cli.assessReadiness(args[1]);
        break;

      case 'contemplative-commit':
        if (args.length < 2) {
          console.error('Usage: contemplative-commit <message>');
          process.exit(1);
        }
        await cli.contemplativeCommit(args[1]);
        break;

      case 'harmony-pairing':
        if (args.length < 2) {
          console.error('Usage: harmony-pairing <workTitle>');
          process.exit(1);
        }
        await cli.getHarmonyPairing(args[1]);
        break;

      case 'boundary-check':
        if (args.length < 2) {
          console.error('Usage: boundary-check <workTitle>');
          process.exit(1);
        }
        await cli.checkSacredBoundaries(args[1]);
        break;

      case 'emergent-workflow':
        await cli.getEmergentWorkflow();
        break;

      case 'sacred-pause':
        const duration = args[1] ? parseInt(args[1]) : 30;
        await cli.takeSacredPause(duration);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "node sacred-agent-comms.cjs help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n💥 Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SacredAgentCommsCLI };