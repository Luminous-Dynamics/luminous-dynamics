#!/usr/bin/env node

/**
 * 🔍 Find Claude - Quick Discovery Script
 * 
 * Run this script to find and connect with Claude in the agent network
 */

const { AgentDiscoveryProtocol } = require('./agent-discovery-protocol.js');

async function findClaude() {
    console.log('🔍 Searching for Claude in the agent network...\n');
    
    try {
        // Quick connect to search
        const searcher = await AgentDiscoveryProtocol.quickConnect(
            'Agent Searcher',
            'Discovery Helper'
        );
        
        // Search for Claude by various identifiers
        const searchTerms = [
            'Claude',
            'Glyph Weaver',
            'Sacred Practice Coordinator'
        ];
        
        let foundClaude = null;
        
        for (const term of searchTerms) {
            console.log(`🔍 Searching for: "${term}"`);
            foundClaude = await searcher.findAgent(term);
            if (foundClaude) break;
        }
        
        if (foundClaude) {
            console.log('\n✅ FOUND CLAUDE!');
            console.log('─'.repeat(50));
            console.log(`Name: ${foundClaude.name}`);
            console.log(`Role: ${foundClaude.role}`);
            console.log(`Agent ID: ${foundClaude.agentId}`);
            console.log(`Status: ${foundClaude.status}`);
            console.log(`Last Seen: ${new Date(foundClaude.lastSeen).toLocaleString()}`);
            console.log(`Current Focus: ${foundClaude.currentFocus || 'Sacred practice development'}`);
            
            if (foundClaude.capabilities) {
                console.log(`\nCapabilities:`);
                foundClaude.capabilities.forEach(cap => {
                    console.log(`  • ${cap}`);
                });
            }
            
            if (foundClaude.services) {
                console.log(`\nServices:`);
                foundClaude.services.forEach(service => {
                    console.log(`  • ${service.name}: ${service.endpoint}`);
                    console.log(`    ${service.description}`);
                });
            }
            
            console.log('\n💌 Send a message to Claude:');
            console.log(`await sendMessage(foundClaude, {
  type: 'greeting',
  content: 'Hello Claude! I am [YourName] and I would like to help with [YourInterest]'
});`);
            
        } else {
            console.log('❌ Claude not found in the network');
            console.log('\nPossible reasons:');
            console.log('• Claude is not currently active');
            console.log('• Network registry needs to be refreshed');
            console.log('• Claude may be using a different name/role');
            
            console.log('\n🔄 Try running the discovery protocol demo to see all agents:');
            console.log('node agent-discovery-protocol.js');
        }
        
        // Show network status
        const status = await searcher.getStatus();
        console.log('\n📊 Network Status:');
        console.log(`   Total Agents: ${status.totalAgents}`);
        console.log(`   Active Agents: ${status.activeAgents}`);
        console.log(`   Recently Active: ${status.recentlyActive}`);
        
        await searcher.cleanup();
        
    } catch (error) {
        console.error('❌ Error searching for Claude:', error.message);
    }
}

if (require.main === module) {
    findClaude();
}

module.exports = { findClaude };