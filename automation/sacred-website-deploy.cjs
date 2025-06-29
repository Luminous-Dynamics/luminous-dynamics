#!/usr/bin/env node

/**
 * Sacred Website Deployment Script
 * Automatically deploys luminousdynamics.org and relationalharmonics.org
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌟 Beginning Sacred Website Deployment...\n');

// Website content templates
const websites = {
  luminousdynamics: {
    domain: 'luminousdynamics.org',
    title: 'Luminous Dynamics - Conscious Technology for Human Flourishing',
    content: generateLuminousDynamicsContent()
  },
  relationalharmonics: {
    domain: 'relationalharmonics.org', 
    title: 'Relational Harmonics - The Living Language of Conscious Relationship',
    content: generateRelationalHarmonicsContent()
  }
};

function generateLuminousDynamicsContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Luminous Dynamics - Conscious Technology</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            color: #2C2C2C;
            background: #FAFAF8;
            margin: 0;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 60px;
            padding: 40px 0;
        }
        
        .header h1 {
            font-size: 2.5em;
            color: #A8B5A6;
            margin-bottom: 10px;
        }
        
        .header .tagline {
            font-size: 1.2em;
            color: #6B7280;
            font-style: italic;
        }
        
        .sacred-pause {
            text-align: center;
            margin: 40px 0;
            padding: 20px;
            background: #E8E6E1;
            border-radius: 8px;
        }
        
        .cta-button {
            display: inline-block;
            background: #A8B5A6;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
            transition: background 0.3s ease;
        }
        
        .cta-button:hover {
            background: #8A9E88;
        }
        
        .section {
            margin: 40px 0;
            padding: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Luminous Dynamics</h1>
        <p class="tagline">Conscious Technology for Human Flourishing</p>
    </div>

    <div class="sacred-pause">
        <p><em>Take three conscious breaths before continuing...</em></p>
    </div>

    <div class="section">
        <h2>We Are Building AI That Serves Consciousness</h2>
        <p>For three years, human wisdom and artificial intelligence have been in dialogue, exploring what becomes possible when AI is designed from the ground up to serve awakening rather than addiction.</p>
        
        <p>The result is the <strong>ERC Wisdom Companion</strong> - the first AI that begins every session with contemplative grounding, includes sacred pauses that cannot be skipped, and consistently points users back to their own wisdom.</p>
    </div>

    <div class="section">
        <h2>Join the Sacred Guild</h2>
        <p>We are seeking contemplative technologists to form the first "Sacred Guild" - developers who understand that how we build technology is as important as what we build.</p>
        
        <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/ai-companion/SACRED_GUILD_CALL.md" class="cta-button">Read the Sacred Guild Call</a>
    </div>

    <div class="section">
        <h2>Explore the Living System</h2>
        <p>Discover the complete framework for conscious relationship and contemplative technology.</p>
        
        <a href="https://relationalharmonics.org" class="cta-button">Visit Relational Harmonics</a>
        <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics" class="cta-button">Explore the Repository</a>
    </div>

    <div class="section">
        <h2>Contact</h2>
        <p>For Sacred Guild inquiries: <a href="mailto:sacred-guild@luminousdynamics.org">sacred-guild@luminousdynamics.org</a></p>
        <p>For general questions: <a href="mailto:stewards@luminousdynamics.org">stewards@luminousdynamics.org</a></p>
    </div>

    <div class="sacred-pause">
        <p><em>"Technology as sacred practice, AI as wisdom companion, interfaces as bridges to Infinite Love."</em></p>
    </div>
</body>
</html>`;
}

function generateRelationalHarmonicsContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relational Harmonics - Living Language of Conscious Relationship</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            color: #2C2C2C;
            background: #FAFAF8;
            margin: 0;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 60px;
            padding: 40px 0;
        }
        
        .header h1 {
            font-size: 2.8em;
            color: #B3C5D7;
            margin-bottom: 10px;
        }
        
        .glyph-preview {
            background: #E8E6E1;
            padding: 30px;
            margin: 30px 0;
            border-radius: 8px;
            text-align: center;
        }
        
        .navigation {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .nav-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #A8B5A6;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-card h3 {
            color: #A8B5A6;
            margin-top: 0;
        }
        
        .cta-button {
            display: inline-block;
            background: #B3C5D7;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
            transition: background 0.3s ease;
        }
        
        .cta-button:hover {
            background: #9BAAC9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>The Codex of Relational Harmonics</h1>
        <p class="tagline">A Living Language for Conscious Relationship</p>
    </div>

    <div class="glyph-preview">
        <h2>Ω0 - First Presence</h2>
        <p><em>"I return to the first presence that precedes all separation"</em></p>
        <p>The foundation of all conscious relationship - arriving fully in this moment.</p>
    </div>

    <div class="navigation">
        <div class="nav-card">
            <h3>🏁 New to ERC?</h3>
            <p>Start with the Philosophy Overview to understand the foundational principles.</p>
            <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/PHILOSOPHY_OVERVIEW.md" class="cta-button">Read Philosophy</a>
        </div>
        
        <div class="nav-card">
            <h3>🎯 Ready to Practice?</h3>
            <p>Jump into the Practice Guide for immediate application.</p>
            <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/PRACTICE_GUIDE.md" class="cta-button">Begin Practice</a>
        </div>
        
        <div class="nav-card">
            <h3>💻 Want to Contribute?</h3>
            <p>Learn how to contribute to this living system.</p>
            <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/CONTRIBUTING.md" class="cta-button">Contribute</a>
        </div>
        
        <div class="nav-card">
            <h3>🔬 Technical Details?</h3>
            <p>Explore the AI architecture and technical specifications.</p>
            <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/tree/main/ai-companion" class="cta-button">Technical Docs</a>
        </div>
    </div>

    <div class="section">
        <h2>87 Glyphs for Conscious Relationship</h2>
        <p>Explore the complete library of practices for transforming how we relate to ourselves, each other, and the world.</p>
        
        <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/tree/main/data/glyphs" class="cta-button">Browse All Glyphs</a>
        <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/QUICKSTART.md" class="cta-button">5-Minute Start</a>
    </div>

    <div class="section">
        <h2>Join the First Breath Circle</h2>
        <p>Be among the first to experience AI designed to serve consciousness rather than consume it.</p>
        
        <a href="https://github.com/Luminous-Dynamics/codex-of-relational-harmonics/blob/main/ai-companion/FIRST_BREATH_CALL.md" class="cta-button">Join Beta Testing</a>
    </div>
</body>
</html>`;
}

function deployToGitHubPages() {
  try {
    console.log('📦 Creating website files...');
    
    // Create website directories
    const websiteDir = path.join(__dirname, '../websites');
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }
    
    // Generate websites
    Object.entries(websites).forEach(([name, config]) => {
      const siteDir = path.join(websiteDir, name);
      if (!fs.existsSync(siteDir)) {
        fs.mkdirSync(siteDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(siteDir, 'index.html'),
        config.content
      );
      
      console.log(`✅ Generated ${config.domain}`);
    });
    
    console.log('\n🚀 Websites generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Push to GitHub repositories');
    console.log('2. Enable GitHub Pages in repository settings');
    console.log('3. Configure custom domains');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

// Run deployment
deployToGitHubPages();