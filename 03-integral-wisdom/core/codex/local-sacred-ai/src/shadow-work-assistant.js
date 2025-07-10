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

class ShadowWorkAssistant {
  constructor() {
    this.dataPath = path.join(process.env.HOME, '.sacred-ai', 'shadow-work');
    this.sessionPath = path.join(this.dataPath, 'sessions');
    this.currentSession = null;
    
    this.shadowArchetypes = [
      { name: 'The Perfectionist', protects: 'fear of rejection', gift: 'excellence and mastery' },
      { name: 'The People Pleaser', protects: 'fear of abandonment', gift: 'harmony and connection' },
      { name: 'The Controller', protects: 'fear of chaos', gift: 'leadership and clarity' },
      { name: 'The Rebel', protects: 'fear of conformity', gift: 'authenticity and freedom' },
      { name: 'The Victim', protects: 'fear of responsibility', gift: 'compassion and empathy' },
      { name: 'The Rescuer', protects: 'fear of helplessness', gift: 'service and support' },
      { name: 'The Judge', protects: 'fear of being judged', gift: 'discernment and wisdom' },
      { name: 'The Avoider', protects: 'fear of conflict', gift: 'peace and acceptance' }
    ];
  }

  async initialize() {
    await fs.mkdir(this.sessionPath, { recursive: true });
    
    // Create .gitignore to ensure privacy
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

  async createSession(theme) {
    const sessionId = crypto.randomBytes(16).toString('hex');
    const timestamp = new Date().toISOString();
    
    const session = {
      id: sessionId,
      theme,
      timestamp,
      exchanges: [],
      insights: [],
      patterns: [],
      integrated: false
    };

    await this.saveSession(session);
    this.currentSession = session;
    return session;
  }

  async saveSession(session) {
    const filePath = path.join(this.sessionPath, `${session.id}.json`);
    
    // Encrypt sensitive content (basic encryption for privacy)
    const encrypted = this.encryptData(JSON.stringify(session, null, 2));
    await fs.writeFile(filePath, encrypted);
  }

  encryptData(data) {
    // Simple encryption for local privacy (not cryptographically secure)
    const key = crypto.scryptSync(process.env.USER || 'shadow', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptData(encrypted) {
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    const key = crypto.scryptSync(process.env.USER || 'shadow', 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  identifyPatterns(description) {
    const patterns = [];
    const descLower = description.toLowerCase();
    
    this.shadowArchetypes.forEach(archetype => {
      const keywords = {
        'The Perfectionist': ['perfect', 'mistake', 'failure', 'not good enough', 'flaw'],
        'The People Pleaser': ['please', 'upset', 'disappoint', 'like me', 'approval'],
        'The Controller': ['control', 'chaos', 'unpredictable', 'plan', 'certain'],
        'The Rebel': ['conform', 'rules', 'authority', 'different', 'rebel'],
        'The Victim': ['fault', 'blame', 'unfair', 'helpless', 'why me'],
        'The Rescuer': ['save', 'help', 'fix', 'rescue', 'responsible for'],
        'The Judge': ['judge', 'criticism', 'wrong', 'should', 'bad'],
        'The Avoider': ['avoid', 'conflict', 'confrontation', 'uncomfortable', 'escape']
      };
      
      const archetypeKeywords = keywords[archetype.name] || [];
      const matches = archetypeKeywords.filter(keyword => descLower.includes(keyword));
      
      if (matches.length > 0) {
        patterns.push({
          archetype: archetype.name,
          confidence: matches.length / archetypeKeywords.length,
          protects: archetype.protects,
          gift: archetype.gift
        });
      }
    });
    
    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  async exploreShadow(userInput) {
    if (!await this.checkOllama()) {
      // Fallback response without AI
      const patterns = this.identifyPatterns(userInput);
      let response = "I hear you sharing something important. ";
      
      if (patterns.length > 0) {
        const primary = patterns[0];
        response += `It sounds like there might be some ${primary.archetype} energy here, which often protects us from ${primary.protects}. `;
        response += `What do you notice in your body as you share this?`;
      } else {
        response += "What sensations do you notice in your body right now? ";
        response += "Sometimes our body knows things before our mind does.";
      }
      
      return response;
    }

    const prompt = `You are a compassionate shadow work companion. The user is exploring shadow material.

User shares: "${userInput}"

Respond with:
1. Deep acknowledgment of their courage
2. Reflection of what you're hearing (not advice)
3. A gentle, open-ended question to go deeper
4. Invitation to notice body sensations

Keep under 100 words. Be warm, present, and non-judgmental. Never give advice or try to fix.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );
      return stdout.trim();
    } catch {
      return "I'm here with you in this exploration. What you're sharing takes courage. What do you notice arising in your body as you speak about this?";
    }
  }

  async generateIntegrationPractice(shadow, gift) {
    const practice = {
      shadow,
      gift,
      steps: []
    };

    if (!await this.checkOllama()) {
      // Create simple practice without AI
      practice.steps = [
        `1. Find a comfortable position and close your eyes.`,
        `2. Place one hand on your heart and breathe naturally.`,
        `3. Gently say: "I acknowledge the part of me that ${shadow}."`,
        `4. Breathe and notice any sensations without judgment.`,
        `5. Now say: "I welcome the gift of ${gift} that lives within this shadow."`,
        `6. Rest here for a few breaths, allowing integration.`,
        `7. When ready, gently open your eyes.`
      ];
      
      return practice.steps.join('\n');
    }

    const prompt = `Create a 5-minute somatic integration practice for shadow work.

Shadow aspect: ${shadow}
Hidden gift: ${gift}

Create exactly 5 steps that:
1. Acknowledge the shadow with compassion
2. Connect with the body
3. Find where the shadow lives somatically
4. Recognize the protective function
5. Integrate the gift within the shadow

Keep it simple, embodied, and compassionate. No spiritual jargon.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );
      return stdout.trim();
    } catch {
      return practice.steps.join('\n');
    }
  }

  async processSession() {
    if (!this.currentSession || this.currentSession.exchanges.length === 0) {
      return "No session to process.";
    }

    const insights = [];
    
    // Extract themes from exchanges
    const allContent = this.currentSession.exchanges
      .filter(e => e.role === 'user')
      .map(e => e.content)
      .join(' ');
    
    const patterns = this.identifyPatterns(allContent);
    
    if (patterns.length > 0) {
      insights.push(`Primary shadow pattern: ${patterns[0].archetype}`);
      insights.push(`Protecting from: ${patterns[0].protects}`);
      insights.push(`Hidden gift: ${patterns[0].gift}`);
    }

    if (await this.checkOllama()) {
      const prompt = `Review this shadow work session and provide key insights:

${this.currentSession.exchanges.map(e => `${e.role}: ${e.content}`).join('\n\n')}

Identify:
1. Core shadow pattern explored
2. What the shadow is protecting
3. Hidden gift within the shadow
4. Integration opportunity

Keep insights compassionate and under 150 words.`;

      try {
        const { stdout } = await execAsync(
          `echo ${JSON.stringify(prompt)} | ollama run mistral:7b-instruct-q4_0 2>/dev/null`
        );
        return stdout.trim();
      } catch {
        return insights.join('\n');
      }
    }

    return insights.join('\n');
  }

  async interactiveSession() {
    await this.initialize();
    
    console.log('\n🌑 Shadow Work Assistant\n');
    console.log('This is a completely private, sacred space.');
    console.log('Everything stays encrypted on your computer.\n');
    console.log('Type "exit" when you\'re ready to complete.\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    // Initial theme
    const theme = await question('What shadow aspect are you ready to explore today?\n> ');
    
    if (theme.toLowerCase() === 'exit') {
      console.log('\n🙏 Thank you for considering this work. Come back when you\'re ready.\n');
      rl.close();
      return;
    }

    const session = await this.createSession(theme);
    console.log('\n💜 Thank you for your courage. I\'m here to hold space for all parts of you.\n');

    // Identify initial patterns
    const patterns = this.identifyPatterns(theme);
    if (patterns.length > 0) {
      console.log('🔍 I sense these patterns may be present:\n');
      patterns.slice(0, 3).forEach(p => {
        console.log(`- ${p.archetype}: Protects from ${p.protects}`);
        console.log(`  Hidden gift: ${p.gift}\n`);
      });
    }

    // Main dialogue loop
    let exploring = true;
    while (exploring) {
      const input = await question('\n💭 What\'s arising for you? (or "exit" to complete)\n> ');
      
      if (input.toLowerCase() === 'exit') {
        exploring = false;
      } else {
        // Record user input
        session.exchanges.push({ 
          role: 'user', 
          content: input,
          timestamp: new Date().toISOString()
        });
        
        // Generate response
        const response = await this.exploreShadow(input);
        console.log('\n🤍 ' + response + '\n');
        
        session.exchanges.push({ 
          role: 'assistant', 
          content: response,
          timestamp: new Date().toISOString()
        });
        
        // Save progress
        await this.saveSession(session);
      }
    }

    // Integration phase
    console.log('\n✨ Beautiful work. Let\'s move toward integration...\n');
    
    const insights = await this.processSession();
    console.log('💡 Session Insights:\n');
    console.log(insights);
    
    const integrate = await question('\n\nWould you like an integration practice? (y/n) ');
    if (integrate.toLowerCase() === 'y') {
      const shadowAspect = await question('What shadow aspect are you ready to integrate? ');
      const giftAspect = await question('What gift does this shadow hold for you? ');
      
      const practice = await this.generateIntegrationPractice(shadowAspect, giftAspect);
      console.log('\n🕊️ Integration Practice:\n');
      console.log(practice);
      
      session.insights.push({
        shadow: shadowAspect,
        gift: giftAspect,
        practice,
        timestamp: new Date().toISOString()
      });
    }

    // Closing
    session.integrated = true;
    await this.saveSession(session);
    
    console.log('\n🙏 Deep bow to your courage.');
    console.log('Your session is safely encrypted and stored.');
    console.log('Remember: Your shadows are not enemies, but parts seeking love.\n');
    
    const stats = await this.getSessionStats();
    console.log(`📊 You've completed ${stats.totalSessions} shadow work sessions.`);
    console.log(`🌱 Most explored pattern: ${stats.mostExplored || 'Various'}\n`);
    
    rl.close();
  }

  async getSessionStats() {
    try {
      const files = await fs.readdir(this.sessionPath);
      const sessions = files.filter(f => f.endsWith('.json'));
      
      const stats = {
        totalSessions: sessions.length,
        patterns: {},
        mostExplored: null
      };
      
      // Don't decrypt old sessions for privacy, just count them
      return stats;
    } catch {
      return { totalSessions: 0 };
    }
  }

  async quickPattern(description) {
    const patterns = this.identifyPatterns(description);
    
    console.log('\n🔍 Shadow Pattern Analysis:\n');
    
    if (patterns.length === 0) {
      console.log('No clear shadow patterns identified.');
      console.log('Consider exploring what emotions or fears might be present.\n');
      return;
    }

    patterns.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.archetype} (${Math.round(p.confidence * 100)}% match)`);
      console.log(`   Protects from: ${p.protects}`);
      console.log(`   Hidden gift: ${p.gift}\n`);
    });

    console.log('💡 Remember: These patterns are not flaws but protective strategies.');
    console.log('Each shadow contains a gift waiting to be integrated.\n');
  }
}

// CLI Interface
async function main() {
  const assistant = new ShadowWorkAssistant();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--interactive') {
    await assistant.interactiveSession();
  } else if (args[0] === '--pattern') {
    const description = args.slice(1).join(' ');
    if (!description) {
      console.log('Please provide a description to analyze.');
      return;
    }
    await assistant.quickPattern(description);
  } else if (args[0] === '--integrate') {
    if (args.length < 3) {
      console.log('Usage: shadow-work --integrate "<shadow>" "<gift>"');
      return;
    }
    const shadow = args[1];
    const gift = args[2];
    const practice = await assistant.generateIntegrationPractice(shadow, gift);
    console.log('\n🕊️ Integration Practice:\n');
    console.log(practice);
  } else if (args[0] === '--stats') {
    await assistant.initialize();
    const stats = await assistant.getSessionStats();
    console.log('\n📊 Shadow Work Statistics:\n');
    console.log(`Total Sessions: ${stats.totalSessions}`);
    console.log('\nAll session data is encrypted and private.');
  } else {
    console.log(`
🌑 Shadow Work Assistant

Usage:
  shadow-work                        Start interactive session
  shadow-work --pattern <desc>       Quick shadow pattern analysis
  shadow-work --integrate <s> <g>    Generate integration practice
  shadow-work --stats                View your statistics

Examples:
  shadow-work --pattern "I always need to be perfect"
  shadow-work --integrate "perfectionism" "excellence"

All data is encrypted and stays completely private on your machine.
`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ShadowWorkAssistant };