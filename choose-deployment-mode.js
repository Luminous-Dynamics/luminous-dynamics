#!/usr/bin/env node
/**
 * 🌉 Deployment Mode Selector
 * Helps choose between local, cloud, or hybrid
 */

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class DeploymentModeSelector {
  async start() {
    console.log('\n🌉 Sacred Technology Deployment Mode Selector');
    console.log('===========================================\n');
    
    const answers = {};
    
    // Question 1: Primary use case
    answers.useCase = await this.ask(
      'What\'s your primary use case?\n' +
      '1) Personal development/testing\n' +
      '2) Team collaboration\n' +
      '3) Public service/demo\n' +
      '4) Mixed use\n' +
      'Choice (1-4): '
    );
    
    // Question 2: Internet reliability
    answers.internet = await this.ask(
      '\nHow reliable is your internet connection?\n' +
      '1) Always connected, fast\n' +
      '2) Usually good, occasional issues\n' +
      '3) Often offline or slow\n' +
      'Choice (1-3): '
    );
    
    // Question 3: Cost sensitivity
    answers.cost = await this.ask(
      '\nHow sensitive are you to cloud costs?\n' +
      '1) Cost is not a concern\n' +
      '2) Moderate budget ($50-200/mo)\n' +
      '3) Minimize costs\n' +
      'Choice (1-3): '
    );
    
    // Question 4: Data requirements
    answers.data = await this.ask(
      '\nWhat are your data requirements?\n' +
      '1) Need persistent, shared data\n' +
      '2) Mostly temporary/experimental\n' +
      '3) Both persistent and experimental\n' +
      'Choice (1-3): '
    );
    
    // Question 5: Technical comfort
    answers.technical = await this.ask(
      '\nComfort with managing infrastructure?\n' +
      '1) Very comfortable, enjoy it\n' +
      '2) Can do it, prefer not to\n' +
      '3) Want it to just work\n' +
      'Choice (1-3): '
    );
    
    rl.close();
    
    // Analyze and recommend
    this.recommend(answers);
  }
  
  ask(question) {
    return new Promise(resolve => {
      rl.question(question, answer => {
        resolve(answer.trim());
      });
    });
  }
  
  recommend(answers) {
    console.log('\n📊 Analysis Complete!');
    console.log('====================\n');
    
    let localScore = 0;
    let cloudScore = 0;
    let hybridScore = 0;
    
    // Score based on answers
    // Use case scoring
    switch(answers.useCase) {
      case '1': localScore += 3; break;
      case '2': cloudScore += 3; hybridScore += 2; break;
      case '3': cloudScore += 3; break;
      case '4': hybridScore += 3; break;
    }
    
    // Internet scoring
    switch(answers.internet) {
      case '1': cloudScore += 2; hybridScore += 1; break;
      case '2': hybridScore += 3; localScore += 1; break;
      case '3': localScore += 3; hybridScore += 1; break;
    }
    
    // Cost scoring
    switch(answers.cost) {
      case '1': cloudScore += 2; break;
      case '2': hybridScore += 3; cloudScore += 1; break;
      case '3': localScore += 3; hybridScore += 1; break;
    }
    
    // Data scoring
    switch(answers.data) {
      case '1': cloudScore += 3; hybridScore += 2; break;
      case '2': localScore += 3; break;
      case '3': hybridScore += 3; break;
    }
    
    // Technical scoring
    switch(answers.technical) {
      case '1': localScore += 1; hybridScore += 2; break;
      case '2': hybridScore += 3; break;
      case '3': cloudScore += 3; break;
    }
    
    // Determine recommendation
    const scores = {
      local: localScore,
      cloud: cloudScore,
      hybrid: hybridScore
    };
    
    const recommended = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    // Show results
    console.log('🎯 Recommendation: ' + this.getRecommendation(recommended));
    console.log('\n📊 Scoring:');
    console.log(`   Local:  ${'⭐'.repeat(localScore)} (${localScore})`);
    console.log(`   Cloud:  ${'⭐'.repeat(cloudScore)} (${cloudScore})`);
    console.log(`   Hybrid: ${'⭐'.repeat(hybridScore)} (${hybridScore})`);
    
    // Provide specific guidance
    console.log('\n📝 ' + this.getGuidance(recommended));
    
    // Show commands
    console.log('\n🚀 Quick Start Commands:');
    this.showCommands(recommended);
  }
  
  getRecommendation(mode) {
    const recommendations = {
      local: '💻 LOCAL DEVELOPMENT',
      cloud: '☁️  CLOUD DEPLOYMENT',
      hybrid: '🌉 HYBRID APPROACH'
    };
    return recommendations[mode];
  }
  
  getGuidance(mode) {
    const guidance = {
      local: 'Perfect for your needs! Stay local for fast iteration and zero costs.\n' +
             '   Consider cloud later when you need collaboration or always-on access.',
      
      cloud: 'Go cloud-native! You\'ll benefit from global access and no maintenance.\n' +
             '   Keep a local backup for offline work if needed.',
      
      hybrid: 'Best of both worlds! Develop locally and sync to cloud as needed.\n' +
              '   This gives you flexibility without compromising on features.'
    };
    return guidance[mode];
  }
  
  showCommands(mode) {
    const commands = {
      local: [
        '   # Start local development',
        '   ./start-local.sh',
        '   node sacred-bridge-unified.js',
        '   open http://localhost:8339'
      ],
      
      cloud: [
        '   # Deploy to cloud',
        '   ./fix-cloud-auth.sh',
        '   ./deploy-unified-cloud.sh',
        '   open https://mycelix-network.web.app'
      ],
      
      hybrid: [
        '   # Set up hybrid mode',
        '   ./start-local.sh',
        '   ./deploy-unified-cloud.sh',
        '   NODE_ENV=hybrid node sacred-bridge-hybrid.js'
      ]
    };
    
    console.log(commands[mode].join('\n'));
    console.log('\n✨ May your choice serve the highest good!\n');
  }
}

// Run selector
if (require.main === module) {
  const selector = new DeploymentModeSelector();
  selector.start().catch(console.error);
}

module.exports = DeploymentModeSelector;