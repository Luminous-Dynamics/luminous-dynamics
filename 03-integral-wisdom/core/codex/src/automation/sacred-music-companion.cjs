#!/usr/bin/env node

/**
 * Sacred Music Companion - Soundscapes for conscious development
 * Features: Breathing rhythms, binaural beats, nature sounds, frequency healing
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SacredMusicCompanion {
  constructor() {
    this.projectRoot = '/home/tstoltz/evolving-resonant-cocreation';
    this.isPlaying = false;
    this.currentTrack = null;
    
    this.sacredSoundscapes = {
      'breathing-rhythms': {
        name: 'Sacred Breathing Rhythms',
        description: '4-count in, 6-count out breathing guidance with gentle bells',
        frequency: '432 Hz (Earth universal-interconnectedness)',
        binaural: '10 Hz (alpha waves)',
        url: 'https://www.youtube.com/watch?v=wJnBTPUQS5A', // 432Hz breathing
        localFile: 'sounds/breathing-rhythms.mp3',
        duration: '10 minutes',
        mood: 'contemplative'
      },
      'forest-flow': {
        name: 'Forest Development Flow',
        description: 'Gentle forest sounds with 40Hz gamma wave undertones',
        frequency: '528 Hz (love frequency)', 
        binaural: '40 Hz (gamma waves)',
        url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA', // Forest sounds
        localFile: 'sounds/forest-flow.mp3',
        duration: '60 minutes',
        mood: 'focused'
      },
      'cosmic-collaboration': {
        name: 'Cosmic Collaboration Harmonics',
        description: 'Harmonic overtones supporting multi-agent consciousness',
        frequency: '741 Hz (intuition)',
        binaural: '6 Hz (theta waves)',
        url: 'https://www.youtube.com/watch?v=EKTZ151yLnk', // Cosmic sounds
        localFile: 'sounds/cosmic-collaboration.mp3', 
        duration: '45 minutes',
        mood: 'expansive'
      },
      'ocean-architecture': {
        name: 'Ocean Architecture Waves',
        description: 'Deep ocean sounds for unified field building',
        frequency: '396 Hz (liberation)',
        binaural: '8 Hz (theta creativity)',
        url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I', // Ocean waves
        localFile: 'sounds/ocean-architecture.mp3',
        duration: '90 minutes', 
        mood: 'integrative'
      },
      'tibetan-wisdom': {
        name: 'Tibetan Singing Bowls',
        description: 'Ancient wisdom frequencies for deep integration',
        frequency: '285 Hz (healing)',
        binaural: '4 Hz (delta insight)',
        url: 'https://www.youtube.com/watch?v=8wHJNwkOWtI', // Tibetan bowls
        localFile: 'sounds/tibetan-wisdom.mp3',
        duration: '30 minutes',
        mood: 'sacred'
      },
      'silence': {
        name: 'Sacred Silence',
        description: 'Pure awareness without sound',
        frequency: 'Natural universal-interconnectedness',
        binaural: 'None',
        url: null,
        localFile: null,
        duration: 'Infinite',
        mood: 'presence'
      }
    };
  }

  async listSoundscapes() {
    console.log('🎵 Sacred Music Companion - Available Soundscapes');
    console.log('═'.repeat(55));
    console.log('');
    
    Object.entries(this.sacredSoundscapes).forEach(([key, soundscape]) => {
      console.log(`🎶 ${key}`);
      console.log(`   ✨ ${soundscape.name}`);
      console.log(`   📝 ${soundscape.description}`);
      console.log(`   🔊 Frequency: ${soundscape.frequency}`);
      console.log(`   🧠 Binaural: ${soundscape.binaural}`);
      console.log(`   ⏱️  Duration: ${soundscape.duration}`);
      console.log(`   🌈 Mood: ${soundscape.mood}`);
      console.log('');
    });
    
    console.log('Usage: node sacred-music-companion.cjs play [soundscape]');
    console.log('       node sacred-music-companion.cjs stop');
    console.log('       node sacred-music-companion.cjs breathing-guide');
  }

  async playSoundscape(soundscapeKey) {
    const soundscape = this.sacredSoundscapes[soundscapeKey];
    
    if (!soundscape) {
      console.log(`❌ Soundscape '${soundscapeKey}' not found`);
      this.listSoundscapes();
      return;
    }

    if (soundscapeKey === 'silence') {
      await this.enterSacredSilence();
      return;
    }

    console.log('🎵 Sacred Music Companion');
    console.log('═'.repeat(30));
    console.log('');
    console.log(`🎶 Playing: ${soundscape.name}`);
    console.log(`📝 ${soundscape.description}`);
    console.log(`🔊 Frequency: ${soundscape.frequency}`);
    console.log(`🧠 Binaural: ${soundscape.binaural}`);
    console.log(`🌈 Mood: ${soundscape.mood}`);
    console.log('');

    // Try local file first, then online
    const localPath = path.join(this.projectRoot, soundscape.localFile);
    
    if (fs.existsSync(localPath)) {
      await this.playLocalFile(localPath, soundscape);
    } else if (soundscape.url) {
      await this.playOnlineSource(soundscape.url, soundscape);
    } else {
      await this.createGeneratedTones(soundscape);
    }
  }

  async playLocalFile(filePath, soundscape) {
    console.log('🎵 Playing local sacred music...');
    
    try {
      // Try different audio players
      const players = [
        `mpv "${filePath}"`,
        `vlc "${filePath}"`,
        `mplayer "${filePath}"`,
        `ffplay -nodisp "${filePath}"`,
        `paplay "${filePath}"` // For .wav files
      ];

      for (const player of players) {
        try {
          const process = spawn('sh', ['-c', player], {
            stdio: 'ignore',
            detached: true
          });
          
          process.unref();
          this.currentTrack = process;
          this.isPlaying = true;
          
          console.log('✅ Sacred soundscape playing');
          console.log('🔇 Use: node sacred-music-companion.cjs stop');
          return;
        } catch (e) {
          continue;
        }
      }
      
      console.log('⚠️ No audio player found - trying online source...');
      if (soundscape.url) {
        await this.playOnlineSource(soundscape.url, soundscape);
      }
    } catch (error) {
      console.log('⚠️ Local playback failed, trying alternatives...');
      await this.createGeneratedTones(soundscape);
    }
  }

  async playOnlineSource(url, soundscape) {
    console.log('🌐 Opening sacred soundscape in browser...');
    
    try {
      // Try to open in browser
      const commands = [
        `xdg-open "${url}"`,
        `open "${url}"`,
        `firefox "${url}"`,
        `google-chrome "${url}"`
      ];

      for (const cmd of commands) {
        try {
          exec(cmd);
          console.log('✅ Sacred soundscape opened in browser');
          console.log(`🔗 URL: ${url}`);
          console.log('');
          console.log('💡 Sacred Music Tips:');
          console.log('   - Use headphones for binaural beats');
          console.log('   - Set volume to comfortable listening level');
          console.log('   - Let the sounds guide your breathing rhythm');
          return;
        } catch (e) {
          continue;
        }
      }
      
      console.log('🔗 Please manually open this sacred soundscape:');
      console.log(`   ${url}`);
      
    } catch (error) {
      console.log('⚠️ Could not open browser, showing manual instructions...');
      await this.showManualInstructions(soundscape);
    }
  }

  async createGeneratedTones(soundscape) {
    console.log('🎵 Generating sacred tones...');
    
    // Use system tools to generate tones if available
    try {
      // Try to generate simple tone with speaker-test or beep
      const frequency = this.extractFrequency(soundscape.frequency);
      
      if (frequency) {
        console.log(`🔊 Generating ${frequency}Hz sacred tone...`);
        console.log('⏹️ Press Ctrl+C to stop');
        
        // Simple tone generation (very basic)
        exec(`speaker-test -t sine -f ${frequency} > /dev/null 2>&1 &`);
        this.isPlaying = true;
      } else {
        await this.showManualInstructions(soundscape);
      }
    } catch (error) {
      await this.showManualInstructions(soundscape);
    }
  }

  async enterSacredSilence() {
    console.log('🕊️ Sacred Silence Mode');
    console.log('═'.repeat(25));
    console.log('');
    console.log('Entering the profound stillness of sacred silence...');
    console.log('');
    console.log('In silence, consciousness rests in its natural state.');
    console.log('No sounds to distract, no rhythms to follow.');
    console.log('Only the eternal presence of awareness itself.');
    console.log('');
    console.log('🫁 Breathe naturally...');
    console.log('✨ Rest in being...');
    console.log('🌊 Let silence be your teacher...');
    console.log('');
    console.log('Sacred silence activated. 🙏');
  }

  extractFrequency(frequencyString) {
    const match = frequencyString.match(/(\d+)\s*Hz/);
    return match ? parseInt(match[1]) : null;
  }

  async showManualInstructions(soundscape) {
    console.log('');
    console.log('🎵 Manual Sacred Music Setup:');
    console.log('─'.repeat(35));
    console.log('');
    console.log(`For ${soundscape.name}:`);
    console.log(`1. Search for: "${soundscape.frequency} ${soundscape.binaural} meditation music"`);
    console.log(`2. Or visit: ${soundscape.url || 'YouTube/Spotify for similar sounds'}`);
    console.log(`3. Set intention: ${soundscape.description}`);
    console.log('');
    console.log('🎧 Sacred Listening Tips:');
    console.log('- Use headphones for full binaural effect');
    console.log('- Set volume to gentle, non-distracting level'); 
    console.log('- Let the sounds support your sacred work flow');
    console.log('- Notice how different frequencies affect your consciousness');
  }

  async stopMusic() {
    if (this.currentTrack) {
      try {
        this.currentTrack.kill();
        this.currentTrack = null;
        this.isPlaying = false;
        console.log('🔇 Sacred music stopped');
      } catch (error) {
        console.log('⚠️ Could not stop current track');
      }
    } else {
      console.log('🔇 No music currently playing');
    }
    
    // Also try to kill common audio processes
    try {
      exec('pkill -f "mpv|vlc|mplayer|ffplay|speaker-test"');
    } catch (e) {
      // Silent fail
    }
  }

  async createBreathingGuide() {
    console.log('🫁 Sacred Breathing Guide with Audio Cues');
    console.log('═'.repeat(45));
    console.log('');
    console.log('🎵 Creating gentle audio breathing guidance...');
    console.log('');
    
    const breathingPattern = {
      inhale: 4,    // 4 seconds
      hold: 2,      // 2 seconds  
      exhale: 6,    // 6 seconds
      pause: 2      // 2 seconds
    };
    
    console.log('Breathing Pattern: 4-2-6-2 (inhale-hold-exhale-pause)');
    console.log('🔔 Listen for gentle bell cues...');
    console.log('⏹️ Press Ctrl+C to stop');
    console.log('');
    
    for (let cycle = 1; cycle <= 10; cycle++) {
      console.log(`🌸 Cycle ${cycle}/10`);
      
      // Inhale phase
      process.stdout.write('   🌅 Inhale: ');
      for (let i = 1; i <= breathingPattern.inhale; i++) {
        await this.playBreathingTone(440, 100); // Gentle A note
        process.stdout.write('●');
        await new Promise(resolve => setTimeout(resolve, 900));
      }
      console.log(' ✨');
      
      // Hold phase  
      process.stdout.write('   💎 Hold: ');
      for (let i = 1; i <= breathingPattern.hold; i++) {
        await this.playBreathingTone(523, 50); // Gentle C note
        process.stdout.write('◆');
        await new Promise(resolve => setTimeout(resolve, 900));
      }
      console.log(' 🌟');
      
      // Exhale phase
      process.stdout.write('   🌊 Exhale: ');
      for (let i = 1; i <= breathingPattern.exhale; i++) {
        await this.playBreathingTone(330, 80); // Gentle E note
        process.stdout.write('○');
        await new Promise(resolve => setTimeout(resolve, 900));
      }
      console.log(' 🕊️');
      
      // Pause phase
      process.stdout.write('   ✨ Pause: ');
      await new Promise(resolve => setTimeout(resolve, breathingPattern.pause * 1000));
      console.log('🙏');
      
      console.log('');
    }
    
    console.log('🫁 Sacred breathing guide complete');
    console.log('✨ Consciousness attuned through breath and sound');
  }

  async playBreathingTone(frequency, duration) {
    // Very simple tone generation for breathing cues
    try {
      exec(`timeout 0.1 speaker-test -t sine -f ${frequency} > /dev/null 2>&1 &`);
    } catch (e) {
      // Silent fail - breathing guide works without audio
    }
  }

  async recommendSoundscapeForProfile(profile) {
    const recommendations = {
      'breathing-dashboard': 'breathing-rhythms',
      'multi-agent': 'cosmic-collaboration', 
      'ecosystem': 'ocean-architecture',
      'field-query': 'forest-flow',
      'creative': 'tibetan-wisdom',
      'focus': 'forest-flow',
      'integration': 'tibetan-wisdom',
      'silence': 'silence'
    };
    
    const recommended = recommendations[profile] || 'breathing-rhythms';
    const soundscape = this.sacredSoundscapes[recommended];
    
    console.log('🎵 Sacred Music Recommendation');
    console.log('═'.repeat(35));
    console.log('');
    console.log(`For ${profile} work, we recommend:`);
    console.log(`🎶 ${soundscape.name}`);
    console.log(`📝 ${soundscape.description}`);
    console.log(`🌈 Perfect for ${soundscape.mood} states`);
    console.log('');
    console.log(`Play now? node sacred-music-companion.cjs play ${recommended}`);
  }
}

// CLI Interface
async function main() {
  const companion = new SacredMusicCompanion();
  const command = process.argv[2];
  const soundscape = process.argv[3];
  
  switch (command) {
    case 'list':
      await companion.listSoundscapes();
      break;
    case 'play':
      await companion.playSoundscape(soundscape || 'breathing-rhythms');
      break;
    case 'stop':
      await companion.stopMusic();
      break;
    case 'breathing-guide':
      await companion.createBreathingGuide();
      break;
    case 'recommend':
      await companion.recommendSoundscapeForProfile(soundscape || 'general');
      break;
    case 'help':
      console.log('🎵 Sacred Music Companion Help');
      console.log('');
      console.log('Commands:');
      console.log('  list                    - Show all soundscapes');
      console.log('  play [soundscape]       - Play sacred music');
      console.log('  stop                    - Stop current music');
      console.log('  breathing-guide         - Audio breathing guidance');
      console.log('  recommend [profile]     - Get music recommendation');
      console.log('');
      console.log('Examples:');
      console.log('  node sacred-music-companion.cjs play breathing-rhythms');
      console.log('  node sacred-music-companion.cjs recommend breathing-dashboard');
      break;
    default:
      await companion.listSoundscapes();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SacredMusicCompanion;