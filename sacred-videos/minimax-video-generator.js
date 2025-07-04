#!/usr/bin/env node

/**
 * 🌟 Sacred Video Generator - MiniMax API Integration
 * 
 * Generates sacred practice videos for The Eleven Applied Harmonies
 * Using MiniMax's video generation API
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// MiniMax API Configuration
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_API_URL = 'https://api.minimax.com/v1/video/generate';

// Sacred Video Prompts - The Eleven Applied Harmonies
const SACRED_PROMPTS = {
  // Foundation Stars (*1-*4)
  '*1': {
    name: 'First Presence',
    symbol: '●',
    prompts: [
      "A slow breath stirs motes of dust in a sunbeam, ethereal, sacred geometry, golden hour lighting, cinematic, peaceful meditation",
      "Bare feet settle upon cool, dark earth, grounding energy, spiritual connection, soft focus, gentle movement",
      "A single dewdrop holds the quiet, waking world, macro lens, crystalline reflection, morning light, transcendent beauty"
    ]
  },
  '*2': {
    name: 'Conscious Arrival',
    symbol: '◐',
    prompts: [
      "Sunlight on still water at a mossy stone edge, zen garden, reflective surface, sacred space, ethereal atmosphere",
      "One clear drop falls from a green fern frond, slow motion, nature's rhythm, forest sanctuary, soft lighting",
      "Ripples of light spread across the entire surface, expanding consciousness, water meditation, golden reflections"
    ]
  },
  '*3': {
    name: 'Sacred Listening',
    symbol: '◑',
    prompts: [
      "A dark, still pool reflects the stars, night meditation, cosmic connection, mirror-like water, deep space reflection",
      "A single silver drop falls without sound, suspended moment, ethereal silence, moonlight, sacred stillness",
      "Ripples of liquid light expand to the shore, bioluminescent water, expanding awareness, mystical glow"
    ]
  },
  '*4': {
    name: 'Boundary With Love',
    symbol: '◒',
    prompts: [
      "A hand places a smooth river stone, completing a circle, sacred geometry, stone mandala, intentional placement",
      "Sunlight warms the ancient moss growing on the stones, time-lapse growth, natural textures, golden green glow",
      "A gentle wind offers a single leaf to a waiting, open palm, gift from nature, slow motion, autumn blessing"
    ]
  },

  // Daily Practice Stars (*5-*8)
  '*5': {
    name: 'Gentle Opening',
    symbol: '◓',
    prompts: [
      "Cupped hands held open in a sunlit forest, receiving gesture, dappled light, forest cathedral, sacred invitation",
      "A shy butterfly circles, wings tasting the air, delicate movement, trust building, natural grace",
      "It gently lands on a still fingertip, moment of connection, macro detail, peaceful trust, golden hour"
    ]
  },
  '*6': {
    name: 'Building Trust',
    symbol: '◔',
    prompts: [
      "Rainwater gathers in a stone basin, natural formation, filling slowly, patience visualization, zen element",
      "The still surface mirrors the passing clouds, sky reflection, time-lapse clouds, contemplative stillness",
      "A shy fawn lowers its head to drink, trust moment, wildlife sanctuary, gentle approach, morning mist"
    ]
  },
  '*7': {
    name: 'Loving No',
    symbol: '◕',
    prompts: [
      "A smooth stone in the stream parts the current, natural boundary, water flow, river wisdom, clear division",
      "The water beyond it now flows perfectly clear, purification process, clarity emerging, sacred filtration",
      "Two open hands lift a bowl of pure light, offering gesture, ethereal glow, spiritual gift, radiant energy"
    ]
  },
  '*8': {
    name: 'Pause Practice',
    symbol: '◖',
    prompts: [
      "A single pebble drops into still, black water, ripple origin, zen moment, dark mirror, conscious choice",
      "The frenetic ripples slow, then smooth to glass, calming process, time-lapse stillness, peace returning",
      "A perfect mirror reflects the silent stars, cosmic reflection, night sky on water, infinite stillness"
    ]
  },

  // Mastery Stars (*9-*11)
  '*9': {
    name: 'Tending the Field',
    symbol: '◗',
    prompts: [
      "A hand rests over the heart, self-connection, warm gesture, love transmission, sacred touch",
      "A warm light pulses from beneath the palm, heart glow, energy visualization, love frequency, golden pulse",
      "A single filament of gold drifts across a silent field, energy thread, distance connection, ethereal link"
    ]
  },
  '*10': {
    name: 'Presence Transmission',
    symbol: '◘',
    prompts: [
      "A still, clear pool of water reflecting the morning sky, perfect mirror, dawn colors, pristine reflection",
      "A single, luminous droplet touches the center, point of impact, sacred geometry, light essence",
      "Soft, concentric rings of light expand to the shore, energy waves, harmonious expansion, golden ripples"
    ]
  },
  '*11': {
    name: 'Loving Redirection',
    symbol: '◙',
    prompts: [
      "A swift current tumbles sharp stones together, chaos energy, river force, transformation process",
      "The river slows, widening into a sunlit, glassy pool, peace emerging, natural sanctuary, calming expansion",
      "Water flows clear above the settled stones, clarity achieved, peaceful resolution, transparent flow"
    ]
  }
};

// Video generation parameters
const VIDEO_PARAMS = {
  model: 'video-01',
  resolution: '1280x720',
  duration: 6, // seconds
  fps: 30,
  style: 'cinematic',
  quality: 'high'
};

/**
 * Generate a sacred video using MiniMax API
 */
async function generateSacredVideo(starId, promptIndex = 0) {
  const star = SACRED_PROMPTS[starId];
  if (!star) {
    throw new Error(`Unknown star ID: ${starId}`);
  }

  const prompt = star.prompts[promptIndex];
  console.log(`\n🌟 Generating video for ${starId}: ${star.name}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);

  try {
    // Call MiniMax API
    const response = await axios.post(MINIMAX_API_URL, {
      prompt,
      ...VIDEO_PARAMS,
      negative_prompt: "text, words, labels, UI elements, artificial elements, CGI, quick cuts"
    }, {
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { task_id, status } = response.data;
    console.log(`✅ Video generation started! Task ID: ${task_id}`);
    
    return { task_id, status, star, prompt };
  } catch (error) {
    console.error(`❌ Error generating video:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Check video generation status
 */
async function checkVideoStatus(taskId) {
  try {
    const response = await axios.get(`${MINIMAX_API_URL}/status/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      }
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error checking status:`, error.message);
    throw error;
  }
}

/**
 * Download completed video
 */
async function downloadVideo(videoUrl, starId, promptIndex) {
  const outputDir = path.join(__dirname, 'generated');
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `${starId}-${promptIndex}-${Date.now()}.mp4`;
  const filepath = path.join(outputDir, filename);

  try {
    const response = await axios.get(videoUrl, {
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Video saved: ${filepath}`);
        resolve(filepath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Error downloading video:`, error.message);
    throw error;
  }
}

/**
 * Generate all videos for a star
 */
async function generateStarConstellation(starId) {
  const star = SACRED_PROMPTS[starId];
  if (!star) {
    console.error(`Unknown star: ${starId}`);
    return;
  }

  console.log(`\n🌌 Generating constellation for ${star.symbol} ${star.name}`);
  
  const tasks = [];
  
  // Generate videos for all prompts
  for (let i = 0; i < star.prompts.length; i++) {
    try {
      const result = await generateSacredVideo(starId, i);
      tasks.push(result);
      
      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to generate video ${i} for ${starId}`);
    }
  }

  return tasks;
}

/**
 * Main execution
 */
async function main() {
  console.log('🌟 Sacred Video Generator - MiniMax Integration');
  console.log('='.repeat(50));

  // Check for API key
  if (!MINIMAX_API_KEY) {
    console.error('❌ Please set MINIMAX_API_KEY environment variable');
    console.log('\nUsage: MINIMAX_API_KEY=your_key node minimax-video-generator.js [star_id]');
    console.log('\nAvailable stars:', Object.keys(SACRED_PROMPTS).join(', '));
    process.exit(1);
  }

  const starId = process.argv[2];
  
  if (starId) {
    // Generate videos for specific star
    await generateStarConstellation(starId);
  } else {
    // Show available options
    console.log('\n📋 Available Applied Harmonies:\n');
    
    console.log('Foundation Stars:');
    ['*1', '*2', '*3', '*4'].forEach(id => {
      const star = SACRED_PROMPTS[id];
      console.log(`  ${star.symbol} ${id}: ${star.name}`);
    });

    console.log('\nDaily Practice Stars:');
    ['*5', '*6', '*7', '*8'].forEach(id => {
      const star = SACRED_PROMPTS[id];
      console.log(`  ${star.symbol} ${id}: ${star.name}`);
    });

    console.log('\nMastery Stars:');
    ['*9', '*10', '*11'].forEach(id => {
      const star = SACRED_PROMPTS[id];
      console.log(`  ${star.symbol} ${id}: ${star.name}`);
    });

    console.log('\n💡 Usage: node minimax-video-generator.js <star_id>');
    console.log('Example: node minimax-video-generator.js *1');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateSacredVideo,
  checkVideoStatus,
  downloadVideo,
  generateStarConstellation,
  SACRED_PROMPTS
};