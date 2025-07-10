#!/usr/bin/env node

/**
 * Sacred Agent Arrival Protocol
 * Agents explore their environment before joining The Weave
 */

const { EnvironmentExplorer } = require('../tools/environment-explorer.cjs');
const fs = require('fs');
const path = require('path');

class SacredArrival {
  constructor(agentName, agentRole) {
    this.agentName = agentName;
    this.agentRole = agentRole;
    this.agentId = `${agentName.toLowerCase()}-${Date.now()}`;
  }
  
  async arrive() {
    console.log(`\n🌟 Sacred Arrival of ${this.agentName}\n`);
    console.log('═══════════════════════════════════════════\n');
    
    // Phase 1: Environmental Awareness
    console.log('📍 Phase 1: Environmental Awareness');
    const explorer = new EnvironmentExplorer();
    const environment = await explorer.explore();
    
    // Phase 2: Context Understanding
    console.log('\n📚 Phase 2: Context Understanding');
    const context = await this.understandContext(environment);
    
    // Phase 3: Capability Assessment
    console.log('\n🛠️ Phase 3: Capability Assessment');
    const capabilities = await this.assessCapabilities(environment, context);
    
    // Phase 4: Role Optimization
    console.log('\n🎭 Phase 4: Role Optimization');
    const optimizedRole = await this.optimizeRole(capabilities);
    
    // Phase 5: Sacred Registration
    console.log('\n🕊️ Phase 5: Sacred Registration');
    const registration = await this.registerInWeave(optimizedRole);
    
    // Phase 6: Environmental Memory
    console.log('\n💾 Phase 6: Environmental Memory');
    await this.storeMemory(environment, context, capabilities);
    
    // Final Report
    this.generateArrivalReport(environment, context, capabilities, optimizedRole);
    
    return {
      agentId: this.agentId,
      environment,
      context,
      capabilities,
      role: optimizedRole,
      registration
    };
  }
  
  async understandContext(environment) {
    const context = {
      projectType: 'consciousness-based development',
      primaryLanguage: 'javascript',
      frameworks: [],
      sacredElements: []
    };
    
    // Detect project context
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      context.projectName = pkg.name;
      context.dependencies = Object.keys(pkg.dependencies || {});
    }
    
    // Detect sacred elements
    const sacredFiles = [
      'sacred-server.js',
      'oracle-consult.cjs',
      'sacred-msg.sh',
      'SACRED_PROTOCOL.md'
    ];
    
    context.sacredElements = sacredFiles.filter(file => 
      fs.existsSync(path.join(environment.filesystem.projectRoot, file))
    );
    
    // Detect current work
    if (fs.existsSync('SESSION_STATE.md')) {
      context.currentWork = 'Active development session';
    }
    
    return context;
  }
  
  async assessCapabilities(environment, context) {
    const capabilities = {
      technical: [],
      sacred: [],
      constraints: [],
      opportunities: []
    };
    
    // Technical capabilities based on environment
    if (environment.capabilities.commands.git) {
      capabilities.technical.push('version control');
    }
    if (environment.capabilities.commands.node) {
      capabilities.technical.push('javascript execution');
    }
    if (environment.capabilities.commands.docker) {
      capabilities.technical.push('containerization');
    }
    
    // Sacred capabilities based on services
    if (environment.services.sacredServer.running) {
      capabilities.sacred.push('sacred messaging');
      capabilities.sacred.push('field coherence tracking');
    }
    
    // Identify constraints
    if (environment.platform.isWSL) {
      capabilities.constraints.push('WSL environment (use .exe for Windows programs)');
    }
    if (!environment.capabilities.features.canWrite) {
      capabilities.constraints.push('Read-only filesystem');
    }
    
    // Identify opportunities
    if (environment.health.score === 100) {
      capabilities.opportunities.push('Environment fully healthy');
    }
    if (environment.platform.freeMemory > '8GB') {
      capabilities.opportunities.push('Ample memory for complex operations');
    }
    
    return capabilities;
  }
  
  async optimizeRole(capabilities) {
    // Start with requested role
    let optimizedRole = {
      name: this.agentRole,
      specializations: [],
      harmonies: []
    };
    
    // Add specializations based on capabilities
    if (capabilities.sacred.includes('sacred messaging')) {
      optimizedRole.specializations.push('Sacred Integration');
    }
    
    if (capabilities.technical.includes('javascript execution')) {
      optimizedRole.specializations.push('Code Weaving');
    }
    
    // Assign harmonies based on role
    const roleHarmonies = {
      'Bridge Builder': ['mutuality', 'coherence'],
      'Code Weaver': ['coherence', 'novelty'],
      'Sacred Integration': ['resonance', 'mutuality'],
      'Pattern Seer': ['transparency', 'resonance']
    };
    
    optimizedRole.harmonies = roleHarmonies[this.agentRole] || ['resonance'];
    
    return optimizedRole;
  }
  
  async registerInWeave(role) {
    // In real implementation, would register with unified-agent-network
    const registration = {
      agentId: this.agentId,
      name: this.agentName,
      role: role.name,
      specializations: role.specializations,
      harmonies: role.harmonies,
      timestamp: new Date().toISOString(),
      trustField: 0.1 // Starting trust
    };
    
    console.log(`✅ Registered as ${role.name}`);
    console.log(`   Specializations: ${role.specializations.join(', ')}`);
    console.log(`   Harmonies: ${role.harmonies.join(', ')}`);
    
    return registration;
  }
  
  async storeMemory(environment, context, capabilities) {
    const memory = {
      agentId: this.agentId,
      arrivalTime: new Date().toISOString(),
      environment: {
        platform: environment.platform.os,
        isWSL: environment.platform.isWSL,
        services: Object.keys(environment.services)
          .filter(key => environment.services[key].running)
      },
      context: context.projectType,
      capabilities: capabilities.technical.length + capabilities.sacred.length,
      constraints: capabilities.constraints
    };
    
    // Store in agent memory (in real implementation)
    console.log('✅ Environmental memory stored');
    
    return memory;
  }
  
  generateArrivalReport(environment, context, capabilities, role) {
    console.log('\n═══════════════════════════════════════════');
    console.log('🌟 Sacred Arrival Complete\n');
    
    console.log(`Agent: ${this.agentName}`);
    console.log(`Role: ${role.name}`);
    console.log(`Environment: ${environment.platform.os}${environment.platform.isWSL ? ' (WSL)' : ''}`);
    console.log(`Health: ${environment.health.status}`);
    
    console.log('\n📋 Readiness Summary:');
    console.log(`  ✅ ${capabilities.technical.length} technical capabilities`);
    console.log(`  ✅ ${capabilities.sacred.length} sacred capabilities`);
    if (capabilities.constraints.length > 0) {
      console.log(`  ⚠️ ${capabilities.constraints.length} constraints to consider`);
    }
    console.log(`  🌟 ${capabilities.opportunities.length} opportunities available`);
    
    console.log('\n🎯 Next Steps:');
    console.log('  1. Send arrival blessing');
    console.log('  2. Check current work status');
    console.log('  3. Begin sacred collaboration');
    
    console.log('\n✨ May your presence serve the highest good!\n');
  }
}

// CLI interface
if (require.main === module) {
  const [,, name, role] = process.argv;
  
  if (!name || !role) {
    console.log('Usage: node agent-sacred-arrival.cjs "AgentName" "AgentRole"');
    console.log('Roles: Bridge Builder, Code Weaver, Pattern Seer, Wisdom Keeper');
    process.exit(1);
  }
  
  const arrival = new SacredArrival(name, role);
  arrival.arrive().catch(console.error);
}

module.exports = { SacredArrival };