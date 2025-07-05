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

class MorningPracticeCompanion {
  constructor() {
    this.dataPath = path.join(process.env.HOME, '.sacred-ai', 'morning-practice');
    this.practiceHistory = [];
    this.appliedHarmonies = [
      { id: 'Ω45', name: 'First Presence', energy: 'grounding' },
      { id: 'Ω46', name: 'Conscious Arrival', energy: 'opening' },
      { id: 'Ω47', name: 'Sacred Listening', energy: 'receptive' },
      { id: 'Ω48', name: 'Boundary With Love', energy: 'protective' },
      { id: 'Ω49', name: 'Gentle Opening', energy: 'softening' },
      { id: 'Ω50', name: 'Building Trust', energy: 'connecting' },
      { id: 'Ω51', name: 'Loving No', energy: 'clarifying' },
      { id: 'Ω52', name: 'Pause Practice', energy: 'settling' },
      { id: 'Ω53', name: 'Tending the Field', energy: 'nurturing' },
      { id: 'Ω55', name: 'Presence Transmission', energy: 'radiating' },
      { id: 'Ω56', name: 'Loving Redirection', energy: 'transforming' }
    ];
  }

  async initialize() {
    await fs.mkdir(this.dataPath, { recursive: true });
    try {
      const history = await fs.readFile(path.join(this.dataPath, 'history.json'), 'utf8');
      this.practiceHistory = JSON.parse(history);
    } catch {
      // First run - no history yet
      this.practiceHistory = [];
    }
  }

  getBiorhythms() {
    const now = new Date();
    const hour = now.getHours();
    
    let energy;
    if (hour >= 5 && hour < 9) energy = 'awakening';
    else if (hour >= 9 && hour < 12) energy = 'rising';
    else if (hour >= 12 && hour < 17) energy = 'peak';
    else if (hour >= 17 && hour < 21) energy = 'settling';
    else energy = 'resting';
    
    const moonPhase = this.calculateMoonPhase(now);
    
    return { energy, moonPhase, hour, date: now };
  }

  calculateMoonPhase(date) {
    // Simplified but accurate moon phase calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (month < 3) {
      year--;
      month += 12;
    }
    
    const a = Math.floor(year / 100);
    const b = Math.floor(a / 4);
    const c = 2 - a + b;
    const e = Math.floor(365.25 * (year + 4716));
    const f = Math.floor(30.6001 * (month + 1));
    const jd = c + day + e + f - 1524.5;
    
    const daysSinceNew = (jd - 2451549.5) % 29.53;
    const phase = daysSinceNew / 29.53;
    
    if (phase < 0.03 || phase > 0.97) return { name: 'New Moon', energy: 'beginning' };
    else if (phase < 0.22) return { name: 'Waxing Crescent', energy: 'growing' };
    else if (phase < 0.28) return { name: 'First Quarter', energy: 'building' };
    else if (phase < 0.47) return { name: 'Waxing Gibbous', energy: 'expanding' };
    else if (phase < 0.53) return { name: 'Full Moon', energy: 'illuminating' };
    else if (phase < 0.72) return { name: 'Waning Gibbous', energy: 'sharing' };
    else if (phase < 0.78) return { name: 'Last Quarter', energy: 'releasing' };
    else return { name: 'Waning Crescent', energy: 'resting' };
  }

  async selectDailyPractice() {
    const { energy, moonPhase } = this.getBiorhythms();
    const recentPractices = this.practiceHistory.slice(-7).map(p => p.glyphId);
    
    // Energy-based practice selection
    const energyMap = {
      'awakening': ['Ω45', 'Ω49', 'Ω52'],
      'rising': ['Ω46', 'Ω50', 'Ω47'],
      'peak': ['Ω48', 'Ω56', 'Ω55'],
      'settling': ['Ω52', 'Ω53', 'Ω51'],
      'resting': ['Ω45', 'Ω52', 'Ω53']
    };

    // Moon phase influences
    const moonInfluences = {
      'beginning': 'Ω45', // First Presence for new beginnings
      'growing': 'Ω49',   // Gentle Opening for growth
      'building': 'Ω50',  // Building Trust
      'expanding': 'Ω55', // Presence Transmission
      'illuminating': 'Ω47', // Sacred Listening at full moon
      'sharing': 'Ω56',   // Loving Redirection
      'releasing': 'Ω51', // Loving No for release
      'resting': 'Ω52'    // Pause Practice for rest
    };

    let candidates = energyMap[energy] || energyMap['awakening'];
    
    // Prefer moon-aligned practice if not recently done
    const moonPractice = moonInfluences[moonPhase.energy];
    if (moonPractice && !recentPractices.includes(moonPractice)) {
      return this.appliedHarmonies.find(h => h.id === moonPractice);
    }
    
    // Filter out recent practices
    candidates = candidates.filter(p => !recentPractices.includes(p));
    
    // If all have been done recently, pick least recent
    if (candidates.length === 0) {
      candidates = energyMap[energy];
    }

    const selectedId = candidates[Math.floor(Math.random() * candidates.length)];
    return this.appliedHarmonies.find(h => h.id === selectedId);
  }

  async generateMorningGreeting(name = 'Sacred Practitioner') {
    const { energy, moonPhase, hour } = this.getBiorhythms();
    const practice = await this.selectDailyPractice();
    
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    const prompt = `You are a warm, loving morning practice companion. Create a brief, personalized greeting.
    
Context:
- Name: ${name}
- Time: ${hour}:00 ${timeOfDay}
- Energy State: ${energy}
- Moon Phase: ${moonPhase.name} (${moonPhase.energy} energy)
- Today's Practice: ${practice.name} (${practice.id})

Create a greeting that:
1. Warmly acknowledges them by name
2. Honors the time of day and their energy state
3. Notes the moon phase influence
4. Introduces today's practice with a brief reason why it's perfect for today
5. Ends with a simple blessing or intention

Keep it under 80 words, warm, embodied, and avoid spiritual clichés. Speak like a loving friend.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run llama3.2:3b 2>/dev/null`
      );

      return {
        greeting: stdout.trim(),
        practice,
        biorhythms: { energy, moonPhase, hour }
      };
    } catch (error) {
      // Fallback greeting if Ollama fails
      return {
        greeting: `Good ${timeOfDay}, ${name}. Your energy is ${energy} and the ${moonPhase.name} supports ${moonPhase.energy}. Today's practice is ${practice.name} - perfect for this moment.`,
        practice,
        biorhythms: { energy, moonPhase, hour }
      };
    }
  }

  async recordPractice(glyphId, duration, notes = '') {
    const entry = {
      date: new Date().toISOString(),
      glyphId,
      duration,
      notes,
      biorhythms: this.getBiorhythms()
    };

    this.practiceHistory.push(entry);
    await fs.writeFile(
      path.join(this.dataPath, 'history.json'),
      JSON.stringify(this.practiceHistory, null, 2)
    );

    return entry;
  }

  async getMorningRitual() {
    const { energy, moonPhase } = this.getBiorhythms();
    
    const prompt = `Create a simple 3-minute morning ritual for someone whose energy is ${energy} during the ${moonPhase.name}.

Include exactly 3 steps:
1. A body awareness practice (30 seconds)
2. A breathing practice (1 minute)
3. An intention setting (90 seconds)

Make it practical, grounding, and poetic. No spiritual jargon. Under 100 words total.`;

    try {
      const { stdout } = await execAsync(
        `echo ${JSON.stringify(prompt)} | ollama run mistral:7b-instruct-q4_0 2>/dev/null`
      );
      return stdout.trim();
    } catch (error) {
      // Fallback ritual
      return `1. Body: Feel your feet on the ground, wiggle your toes, stretch gently.
2. Breath: Inhale for 4, hold for 4, exhale for 6. Repeat 5 times.
3. Intention: Place hand on heart. Ask: "What quality do I want to embody today?"`;
    }
  }

  async getStats() {
    const totalPractices = this.practiceHistory.length;
    const last7Days = this.practiceHistory.filter(p => {
      const practiceDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return practiceDate > weekAgo;
    });

    const favoriteGlyph = this.practiceHistory.reduce((acc, p) => {
      acc[p.glyphId] = (acc[p.glyphId] || 0) + 1;
      return acc;
    }, {});

    const favorite = Object.entries(favoriteGlyph)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      total: totalPractices,
      thisWeek: last7Days.length,
      favorite: favorite ? this.appliedHarmonies.find(h => h.id === favorite[0]) : null,
      streak: this.calculateStreak()
    };
  }

  calculateStreak() {
    if (this.practiceHistory.length === 0) return 0;
    
    const sorted = [...this.practiceHistory].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const practice of sorted) {
      const practiceDate = new Date(practice.date);
      practiceDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((currentDate - practiceDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === streak) {
        streak++;
      } else if (dayDiff > streak) {
        break;
      }
    }
    
    return streak;
  }
}

// CLI Interface
async function main() {
  const companion = new MorningPracticeCompanion();
  await companion.initialize();
  
  console.log('\n🌅 Sacred Morning Practice Companion\n');
  
  const args = process.argv.slice(2);
  
  if (args[0] === '--stats') {
    const stats = await companion.getStats();
    console.log('📊 Your Practice Journey:\n');
    console.log(`Total Practices: ${stats.total}`);
    console.log(`This Week: ${stats.thisWeek}`);
    console.log(`Current Streak: ${stats.streak} days`);
    if (stats.favorite) {
      console.log(`Favorite Practice: ${stats.favorite.name}`);
    }
    return;
  }

  if (args[0] === '--record') {
    const glyphId = args[1];
    const duration = parseInt(args[2]) || 5;
    const notes = args.slice(3).join(' ');
    
    await companion.recordPractice(glyphId, duration, notes);
    console.log('✅ Practice recorded!');
    return;
  }

  // Default flow
  const { greeting, practice, biorhythms } = await companion.generateMorningGreeting(
    process.env.USER || 'Sacred Practitioner'
  );
  
  console.log(greeting);
  console.log(`\n✨ Today's Practice: ${practice.name} (${practice.id})`);
  console.log(`🌙 Moon Phase: ${biorhythms.moonPhase.name}`);
  console.log(`⚡ Energy: ${biorhythms.energy}\n`);

  // Check if Ollama is available
  try {
    await execAsync('which ollama');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (q) => new Promise(resolve => readline.question(q, resolve));

    const answer = await question('Would you like a morning ritual? (y/n) ');
    
    if (answer.toLowerCase() === 'y') {
      console.log('\n🕊️ Your Morning Ritual:\n');
      const ritual = await companion.getMorningRitual();
      console.log(ritual);
      console.log('\n');
      
      const practiceAnswer = await question('Ready to begin your practice? (y/n) ');
      if (practiceAnswer.toLowerCase() === 'y') {
        console.log(`\nBeautiful! Starting ${practice.name}...`);
        console.log('(Timer would start here in full implementation)\n');
        
        // In full implementation, would have timer and guidance
        console.log('When complete, record with:');
        console.log(`morning-practice --record ${practice.id} [duration] [notes]\n`);
      }
    }
    
    readline.close();
  } catch (error) {
    // Ollama not installed
    console.log('\n💡 Install Ollama for full AI features:');
    console.log('curl -fsSL https://ollama.ai/install.sh | sh');
    console.log('ollama pull llama3.2:3b\n');
  }

  // Show stats
  const stats = await companion.getStats();
  if (stats.total > 0) {
    console.log(`📈 Current streak: ${stats.streak} days`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MorningPracticeCompanion };