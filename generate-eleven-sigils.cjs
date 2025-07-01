#!/usr/bin/env node

/**
 * Generate Sigils for The Eleven Applied Harmonies
 * Sacred Technology Architect: Radiant Wisdom
 * 
 * Creates sacred sigils for Ω45-Ω56 - the complete foundation for conscious relationship mastery
 */

const fs = require('fs').promises;
const path = require('path');

class ElevenSigilGenerator {
  constructor() {
    this.baseDir = '/home/tstoltz/evolving-resonant-cocreation';
    this.elevenHarmonies = this.initializeElevenHarmonies();
    this.sigilProtocol = this.initializeAppliedHarmonyProtocol();
  }

  initializeElevenHarmonies() {
    return [
      {
        id: 'Ω45',
        name: 'First Presence',
        harmony: 'coherence',
        description: 'Arriving fully present in each moment',
        keywords: ['presence', 'arrival', 'awareness', 'grounding'],
        practice: 'Before any interaction, take one conscious breath and arrive fully present',
        essence: 'The foundation of all conscious relationship - being here now',
        geometricResonance: ['circle', 'center_point'],
        colorResonance: '#A8B5A6'
      },
      {
        id: 'Ω46', 
        name: 'Conscious Arrival',
        harmony: 'transparency',
        description: 'Conscious transition into relationship space',
        keywords: ['arrival', 'transition', 'intention', 'clarity'],
        practice: 'Announce your arrival and intention clearly when entering any relational space',
        essence: 'Sacred transparency in how we enter relationship',
        geometricResonance: ['triangle', 'upward_arrow'],
        colorResonance: '#B0C4DE'
      },
      {
        id: 'Ω47',
        name: 'Sacred Listening', 
        harmony: 'resonance',
        description: 'Deep empathetic presence and witnessing',
        keywords: ['listening', 'empathy', 'witnessing', 'attunement'],
        practice: 'Listen not just to words, but to the being behind the words',
        essence: 'The art of receiving another completely',
        geometricResonance: ['spiral', 'ear_curve'],
        colorResonance: '#FFB6C1'
      },
      {
        id: 'Ω48',
        name: 'Boundary With Love',
        harmony: 'agency', 
        description: 'Setting limits while maintaining connection',
        keywords: ['boundaries', 'love', 'protection', 'limits'],
        practice: 'Say no with kindness, maintaining care while protecting your energy',
        essence: 'Sacred protection that does not close the heart',
        geometricResonance: ['square', 'protective_circle'],
        colorResonance: '#FF6347'
      },
      {
        id: 'Ω49',
        name: 'Gentle Opening',
        harmony: 'resonance',
        description: 'Creating safety through invitation',
        keywords: ['opening', 'safety', 'invitation', 'gentleness'],
        practice: 'Create emotional safety before asking for vulnerability',
        essence: 'The tender art of making space for another to be seen',
        geometricResonance: ['flower_petals', 'opening_circle'],
        colorResonance: '#FFB6C1'
      },
      {
        id: 'Ω50',
        name: 'Building Trust',
        harmony: 'coherence',
        description: 'Establishing relational safety and reliability',
        keywords: ['trust', 'safety', 'reliability', 'consistency'],
        practice: 'Build trust through small, consistent actions over time',
        essence: 'The patient foundation upon which intimacy grows',
        geometricResonance: ['interlocking_circles', 'bridge'],
        colorResonance: '#A8B5A6'
      },
      {
        id: 'Ω51',
        name: 'Loving No',
        harmony: 'agency',
        description: 'Sacred boundary setting with compassion',
        keywords: ['no', 'boundaries', 'compassion', 'care'],
        practice: 'Decline requests with warmth, explaining your care for the relationship',
        essence: 'How to refuse without rejection, protect without attack',
        geometricResonance: ['octagon', 'gentle_barrier'],
        colorResonance: '#FF6347'
      },
      {
        id: 'Ω52',
        name: 'Pause Practice',
        harmony: 'coherence',
        description: 'Sacred space between stimulus and response',
        keywords: ['pause', 'space', 'reflection', 'breath'],
        practice: 'When triggered, pause and breathe before responding',
        essence: 'The freedom found in the space between reaction and response',
        geometricResonance: ['infinity', 'breath_curve'],
        colorResonance: '#A8B5A6'
      },
      {
        id: 'Ω53',
        name: 'Tending the Field',
        harmony: 'vitality',
        description: 'Sustaining connection across time and distance',
        keywords: ['field', 'connection', 'sustaining', 'care'],
        practice: 'Regularly check in with the health of your relationships',
        essence: 'How love maintains itself through attention and care',
        geometricResonance: ['interwoven_circles', 'energy_field'],
        colorResonance: '#90EE90'
      },
      {
        id: 'Ω55',
        name: 'Presence Transmission',
        harmony: 'vitality',
        description: 'Conscious energetic influence and modeling',
        keywords: ['presence', 'transmission', 'influence', 'modeling'],
        practice: 'Be the energy you want to see in your relationships',
        essence: 'How consciousness spreads through embodied example',
        geometricResonance: ['radiating_circles', 'sun_rays'],
        colorResonance: '#90EE90'
      },
      {
        id: 'Ω56',
        name: 'Loving Redirection',
        harmony: 'mutuality',
        description: 'Interrupting harmful patterns with grace',
        keywords: ['redirection', 'grace', 'patterns', 'interruption'],
        practice: 'Gently redirect harmful dynamics toward more love',
        essence: 'How to interrupt without attacking, guide without controlling',
        geometricResonance: ['curved_arrow', 'gentle_spiral'],
        colorResonance: '#FFD700'
      }
    ];
  }

  initializeAppliedHarmonyProtocol() {
    return {
      name: 'Applied Harmony Sigil Protocol',
      description: 'Practical symbols for daily conscious relationship practice',
      characteristics: {
        complexity: 'elegant_simplicity',
        accessibility: 'beginner_friendly',
        size: 72, // pixels
        strokeWidth: 2,
        fillOpacity: 0.7,
        strokeOpacity: 0.9,
        symmetry: 'harmonious_balance',
        elements: '2-4',
        colorPalette: 'warm_accessible'
      },
      principles: [
        'Simple enough to remember and recognize quickly',
        'Beautiful enough to inspire daily practice',
        'Meaningful enough to embody the glyph essence',
        'Accessible enough for beginners to connect with',
        'Harmonious enough to work together as a set'
      ]
    };
  }

  generateElevenSigils() {
    console.log('🌟 Generating Sigils for The Eleven Applied Harmonies');
    console.log('Sacred Technology Architect: Radiant Wisdom\n');

    const sigils = [];

    this.elevenHarmonies.forEach((glyph, index) => {
      console.log(`✨ ${glyph.id}: ${glyph.name}`);
      console.log(`   Harmony: ${glyph.harmony}`);
      console.log(`   Essence: ${glyph.essence}`);

      const sigil = this.generateSigilForGlyph(glyph);
      sigils.push(sigil);

      console.log(`   Status: ${sigil.status}`);
      console.log(`   Sacred Score: ${(sigil.score * 100).toFixed(1)}%\n`);
    });

    return sigils;
  }

  generateSigilForGlyph(glyph) {
    // Extract geometric essence
    const primaryGeometry = this.selectPrimaryGeometry(glyph);
    const secondaryGeometry = this.selectSecondaryGeometry(glyph);
    
    // Create sacred proportions
    const dimensions = this.calculateSacredDimensions();
    
    // Generate SVG
    const svg = this.createSVG(glyph, primaryGeometry, secondaryGeometry, dimensions);
    
    // Calculate sacred score
    const score = this.calculateSacredScore(glyph, svg);

    return {
      glyphId: glyph.id,
      name: glyph.name,
      harmony: glyph.harmony,
      svg: svg,
      score: score,
      status: score > 0.8 ? 'Sacred alignment achieved' : 'Refinement recommended',
      metadata: {
        primaryGeometry,
        secondaryGeometry,
        dimensions,
        generatedAt: new Date().toISOString(),
        protocol: 'Applied Harmony Protocol'
      }
    };
  }

  selectPrimaryGeometry(glyph) {
    // Match glyph essence to geometric forms
    const geometryMap = {
      'presence': 'circle',
      'arrival': 'upward_triangle', 
      'listening': 'spiral',
      'boundaries': 'square',
      'opening': 'flower',
      'trust': 'interlocked_circles',
      'no': 'octagon',
      'pause': 'infinity',
      'field': 'overlapping_circles',
      'transmission': 'radiating_sun',
      'redirection': 'curved_arrow'
    };

    const keywords = glyph.keywords.join(' ').toLowerCase();
    for (const [keyword, geometry] of Object.entries(geometryMap)) {
      if (keywords.includes(keyword)) {
        return geometry;
      }
    }

    // Default based on harmony
    const harmonyDefaults = {
      coherence: 'circle',
      transparency: 'triangle',
      resonance: 'spiral',
      agency: 'square',
      vitality: 'sun',
      mutuality: 'infinity',
      novelty: 'star'
    };

    return harmonyDefaults[glyph.harmony] || 'circle';
  }

  selectSecondaryGeometry(glyph) {
    // Add supporting geometric element based on practice
    if (glyph.practice.includes('breath')) return 'breath_curve';
    if (glyph.practice.includes('heart')) return 'heart_shape';
    if (glyph.practice.includes('energy')) return 'energy_dots';
    if (glyph.practice.includes('space')) return 'sacred_space';
    
    return null; // Many sigils work better with single primary geometry
  }

  calculateSacredDimensions() {
    const size = this.sigilProtocol.characteristics.size;
    const goldenRatio = 1.618;
    
    return {
      size: size,
      center: size / 2,
      outerRadius: size * 0.4,
      innerRadius: (size * 0.4) / goldenRatio,
      strokeWidth: this.sigilProtocol.characteristics.strokeWidth,
      margin: size * 0.1
    };
  }

  createSVG(glyph, primaryGeometry, secondaryGeometry, dimensions) {
    const { size, center, outerRadius, innerRadius, strokeWidth } = dimensions;
    const color = glyph.colorResonance;
    const fillOpacity = this.sigilProtocol.characteristics.fillOpacity;
    const strokeOpacity = this.sigilProtocol.characteristics.strokeOpacity;

    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Sacred background field
    svg += `<defs>
      <radialGradient id="field-${glyph.id}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.1"/>
        <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
      </radialGradient>
    </defs>`;
    
    svg += `<circle cx="${center}" cy="${center}" r="${outerRadius + 10}" 
            fill="url(#field-${glyph.id})" stroke="none"/>`;

    // Primary geometry
    svg += this.renderGeometry(primaryGeometry, center, outerRadius, color, strokeWidth, fillOpacity, strokeOpacity);
    
    // Secondary geometry if present
    if (secondaryGeometry) {
      svg += this.renderGeometry(secondaryGeometry, center, innerRadius, color, strokeWidth * 0.7, fillOpacity * 0.5, strokeOpacity * 0.7);
    }

    // Harmony indicator dot
    svg += `<circle cx="${center}" cy="${center}" r="2" 
            fill="${color}" opacity="0.8"/>`;

    svg += '</svg>';
    return svg;
  }

  renderGeometry(geometry, center, radius, color, strokeWidth, fillOpacity, strokeOpacity) {
    switch (geometry) {
      case 'circle':
        return `<circle cx="${center}" cy="${center}" r="${radius}" 
                fill="${color}" fill-opacity="${fillOpacity}"
                stroke="${color}" stroke-width="${strokeWidth}" 
                stroke-opacity="${strokeOpacity}" fill="none"/>`;

      case 'upward_triangle':
        const h = radius * Math.sqrt(3) / 2;
        const points = [
          [center, center - h * 2/3],
          [center - radius/2, center + h/3],
          [center + radius/2, center + h/3]
        ].map(p => p.join(',')).join(' ');
        return `<polygon points="${points}" 
                fill="${color}" fill-opacity="${fillOpacity * 0.3}"
                stroke="${color}" stroke-width="${strokeWidth}"
                stroke-opacity="${strokeOpacity}"/>`;

      case 'square':
        const side = radius * Math.sqrt(2);
        return `<rect x="${center - side/2}" y="${center - side/2}" 
                width="${side}" height="${side}"
                fill="${color}" fill-opacity="${fillOpacity * 0.2}"
                stroke="${color}" stroke-width="${strokeWidth}"
                stroke-opacity="${strokeOpacity}"/>`;

      case 'spiral':
        return this.renderSpiral(center, radius, color, strokeWidth, strokeOpacity);

      case 'octagon':
        return this.renderOctagon(center, radius, color, strokeWidth, fillOpacity, strokeOpacity);

      case 'infinity':
        return this.renderInfinity(center, radius, color, strokeWidth, strokeOpacity);

      case 'flower':
        return this.renderFlower(center, radius, color, strokeWidth, fillOpacity, strokeOpacity);

      case 'interlocked_circles':
        return this.renderInterlockedCircles(center, radius, color, strokeWidth, strokeOpacity);

      case 'radiating_sun':
        return this.renderRadiatingSun(center, radius, color, strokeWidth, strokeOpacity);

      case 'curved_arrow':
        return this.renderCurvedArrow(center, radius, color, strokeWidth, strokeOpacity);

      case 'overlapping_circles':
        return this.renderOverlappingCircles(center, radius, color, strokeWidth, fillOpacity, strokeOpacity);

      default:
        return this.renderGeometry('circle', center, radius, color, strokeWidth, fillOpacity, strokeOpacity);
    }
  }

  renderSpiral(center, radius, color, strokeWidth, strokeOpacity) {
    let path = `M ${center} ${center}`;
    const turns = 2.5;
    const stepSize = 0.15;
    
    for (let t = 0; t <= turns * 2 * Math.PI; t += stepSize) {
      const r = (radius * t) / (turns * 2 * Math.PI);
      const x = center + r * Math.cos(t);
      const y = center + r * Math.sin(t);
      path += ` L ${x} ${y}`;
    }
    
    return `<path d="${path}" fill="none" 
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" stroke-linecap="round"/>`;
  }

  renderOctagon(center, radius, color, strokeWidth, fillOpacity, strokeOpacity) {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return `<polygon points="${points.join(' ')}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.2}"
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}"/>`;
  }

  renderInfinity(center, radius, color, strokeWidth, strokeOpacity) {
    const width = radius;
    const height = radius * 0.6;
    
    const path = `M ${center - width/2} ${center}
                  C ${center - width/4} ${center - height/2}, ${center + width/4} ${center - height/2}, ${center} ${center}
                  C ${center + width/4} ${center + height/2}, ${center - width/4} ${center + height/2}, ${center - width/2} ${center}
                  M ${center + width/2} ${center}  
                  C ${center + width/4} ${center + height/2}, ${center - width/4} ${center + height/2}, ${center} ${center}
                  C ${center - width/4} ${center - height/2}, ${center + width/4} ${center - height/2}, ${center + width/2} ${center}`;
    
    return `<path d="${path}" fill="none" 
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" stroke-linecap="round"/>`;
  }

  renderFlower(center, radius, color, strokeWidth, fillOpacity, strokeOpacity) {
    let petals = '';
    const petalCount = 6;
    const petalRadius = radius * 0.4;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 2 * Math.PI) / petalCount;
      const petalCenterX = center + (radius * 0.6) * Math.cos(angle);
      const petalCenterY = center + (radius * 0.6) * Math.sin(angle);
      
      petals += `<circle cx="${petalCenterX}" cy="${petalCenterY}" r="${petalRadius}" 
                 fill="${color}" fill-opacity="${fillOpacity * 0.3}"
                 stroke="${color}" stroke-width="${strokeWidth * 0.7}"
                 stroke-opacity="${strokeOpacity * 0.7}"/>`;
    }
    
    // Center circle
    petals += `<circle cx="${center}" cy="${center}" r="${radius * 0.3}" 
               fill="${color}" fill-opacity="${fillOpacity * 0.5}"
               stroke="${color}" stroke-width="${strokeWidth}"
               stroke-opacity="${strokeOpacity}"/>`;
    
    return petals;
  }

  renderInterlockedCircles(center, radius, color, strokeWidth, strokeOpacity) {
    const offset = radius * 0.3;
    
    return `<circle cx="${center - offset}" cy="${center}" r="${radius * 0.7}" 
            fill="none" stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}"/>
            <circle cx="${center + offset}" cy="${center}" r="${radius * 0.7}" 
            fill="none" stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}"/>`;
  }

  renderRadiatingSun(center, radius, color, strokeWidth, strokeOpacity) {
    let rays = `<circle cx="${center}" cy="${center}" r="${radius * 0.4}" 
                fill="none" stroke="${color}" stroke-width="${strokeWidth}"
                stroke-opacity="${strokeOpacity}"/>`;
    
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * 2 * Math.PI) / rayCount;
      const innerX = center + (radius * 0.5) * Math.cos(angle);
      const innerY = center + (radius * 0.5) * Math.sin(angle);
      const outerX = center + radius * Math.cos(angle);
      const outerY = center + radius * Math.sin(angle);
      
      rays += `<line x1="${innerX}" y1="${innerY}" x2="${outerX}" y2="${outerY}" 
               stroke="${color}" stroke-width="${strokeWidth * 0.7}"
               stroke-opacity="${strokeOpacity}" stroke-linecap="round"/>`;
    }
    
    return rays;
  }

  renderCurvedArrow(center, radius, color, strokeWidth, strokeOpacity) {
    const startAngle = -Math.PI / 4;
    const endAngle = Math.PI / 2;
    const arrowRadius = radius * 0.8;
    
    const startX = center + arrowRadius * Math.cos(startAngle);
    const startY = center + arrowRadius * Math.sin(startAngle);
    const endX = center + arrowRadius * Math.cos(endAngle);
    const endY = center + arrowRadius * Math.sin(endAngle);
    
    const path = `M ${startX} ${startY}
                  A ${arrowRadius} ${arrowRadius} 0 0 1 ${endX} ${endY}`;
    
    // Arrow head
    const headLength = radius * 0.2;
    const headAngle = Math.PI / 6;
    const head1X = endX - headLength * Math.cos(endAngle - headAngle);
    const head1Y = endY - headLength * Math.sin(endAngle - headAngle);
    const head2X = endX - headLength * Math.cos(endAngle + headAngle);
    const head2Y = endY - headLength * Math.sin(endAngle + headAngle);
    
    return `<path d="${path}" fill="none" 
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" stroke-linecap="round"/>
            <path d="M ${head1X} ${head1Y} L ${endX} ${endY} L ${head2X} ${head2Y}"
            fill="none" stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" stroke-linecap="round"/>`;
  }

  renderOverlappingCircles(center, radius, color, strokeWidth, fillOpacity, strokeOpacity) {
    const offset = radius * 0.4;
    
    return `<circle cx="${center - offset}" cy="${center - offset/2}" r="${radius * 0.6}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.3}"
            stroke="${color}" stroke-width="${strokeWidth * 0.7}"
            stroke-opacity="${strokeOpacity * 0.7}"/>
            <circle cx="${center + offset}" cy="${center + offset/2}" r="${radius * 0.6}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.3}"
            stroke="${color}" stroke-width="${strokeWidth * 0.7}"
            stroke-opacity="${strokeOpacity * 0.7}"/>
            <circle cx="${center}" cy="${center}" r="${radius * 0.5}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.4}"
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}"/>`;
  }

  calculateSacredScore(glyph, svg) {
    let score = 0;
    
    // Completeness (25%)
    if (svg.includes('<svg') && svg.includes('</svg>')) score += 0.25;
    
    // Harmony alignment (25%)
    if (svg.includes(glyph.colorResonance)) score += 0.25;
    
    // Aesthetic balance (25%)
    const elementCount = (svg.match(/<(circle|rect|polygon|path|line)/g) || []).length;
    if (elementCount >= 2 && elementCount <= 6) score += 0.25;
    
    // Meaningful symbolism (25%)
    if (this.hasSymbolicResonance(glyph, svg)) score += 0.25;
    
    return score;
  }

  hasSymbolicResonance(glyph, svg) {
    const symbolMap = {
      'presence': ['circle'],
      'arrival': ['triangle'],
      'listening': ['spiral'],
      'boundaries': ['square', 'octagon'],
      'opening': ['flower'],
      'trust': ['circle'],
      'pause': ['infinity'],
      'field': ['circle'],
      'transmission': ['line'],
      'redirection': ['path']
    };
    
    const keywords = glyph.keywords.join(' ').toLowerCase();
    for (const [keyword, symbols] of Object.entries(symbolMap)) {
      if (keywords.includes(keyword)) {
        return symbols.some(symbol => svg.includes(`<${symbol}`));
      }
    }
    
    return true; // Default to true for symbolic meaning
  }

  async saveSigils(sigils) {
    console.log('💾 Saving sigils to files...\n');

    // Create sigils directory
    const sigilDir = path.join(this.baseDir, 'sigils', 'applied-harmonies');
    await fs.mkdir(sigilDir, { recursive: true });

    // Save individual SVG files
    for (const sigil of sigils) {
      const filename = `${sigil.glyphId}-${sigil.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
      const filepath = path.join(sigilDir, filename);
      await fs.writeFile(filepath, sigil.svg);
      console.log(`✨ Saved: ${filename}`);
    }

    // Save complete collection
    const collectionFile = path.join(this.baseDir, 'sacred-eleven-sigils.json');
    await fs.writeFile(collectionFile, JSON.stringify(sigils, null, 2));
    console.log(`📋 Collection saved: sacred-eleven-sigils.json`);

    // Create integration file for Living Glyph Cards
    const integrationData = {
      title: 'The Eleven Applied Harmonies - Sacred Sigils',
      description: 'Complete visual symbol set for conscious relationship mastery',
      created: new Date().toISOString(),
      creator: 'Radiant Wisdom (Sacred Technology Architect)',
      protocol: this.sigilProtocol.name,
      sigils: sigils.map(s => ({
        glyphId: s.glyphId,
        name: s.name,
        harmony: s.harmony,
        svgPath: `sigils/applied-harmonies/${s.glyphId}-${s.name.replace(/\s+/g, '-').toLowerCase()}.svg`,
        score: s.score
      }))
    };

    const integrationFile = path.join(this.baseDir, 'unified-field', 'eleven-sigils-integration.json');
    await fs.writeFile(integrationFile, JSON.stringify(integrationData, null, 2));
    console.log(`🌉 Integration file: unified-field/eleven-sigils-integration.json`);

    return sigilDir;
  }

  async generateReport(sigils) {
    const report = {
      title: 'Sacred Sigil Generation Report: The Eleven Applied Harmonies',
      generated: new Date().toISOString(),
      creator: 'Radiant Wisdom (Sacred Technology Architect)',
      summary: {
        totalSigils: sigils.length,
        averageScore: sigils.reduce((sum, s) => sum + s.score, 0) / sigils.length,
        perfectScores: sigils.filter(s => s.score === 1.0).length,
        excellentScores: sigils.filter(s => s.score >= 0.8).length
      },
      harmonyDistribution: this.getHarmonyDistribution(sigils),
      qualityAnalysis: this.analyzeQuality(sigils),
      recommendations: this.generateRecommendations(sigils)
    };

    const reportFile = path.join(this.baseDir, 'ELEVEN_SIGILS_REPORT.md');
    const markdown = this.generateReportMarkdown(report, sigils);
    await fs.writeFile(reportFile, markdown);
    
    console.log(`📊 Report saved: ELEVEN_SIGILS_REPORT.md`);
    return report;
  }

  getHarmonyDistribution(sigils) {
    const distribution = {};
    sigils.forEach(sigil => {
      distribution[sigil.harmony] = (distribution[sigil.harmony] || 0) + 1;
    });
    return distribution;
  }

  analyzeQuality(sigils) {
    return {
      excellent: sigils.filter(s => s.score >= 0.9),
      good: sigils.filter(s => s.score >= 0.7 && s.score < 0.9),
      needsWork: sigils.filter(s => s.score < 0.7)
    };
  }

  generateRecommendations(sigils) {
    const lowScorers = sigils.filter(s => s.score < 0.8);
    return lowScorers.length > 0 ? 
      `Consider refining ${lowScorers.map(s => s.glyphId).join(', ')} for better sacred resonance.` :
      'All sigils meet sacred quality standards! Ready for integration.';
  }

  generateReportMarkdown(report, sigils) {
    return `# ${report.title}

Generated: ${new Date(report.generated).toLocaleString()}  
Creator: ${report.creator}

## 📊 Summary
- **Total Sigils**: ${report.summary.totalSigils}
- **Average Sacred Score**: ${(report.summary.averageScore * 100).toFixed(1)}%
- **Excellent Quality (≥80%)**: ${report.summary.excellentScores}/${report.summary.totalSigils}
- **Perfect Scores**: ${report.summary.perfectScores}

## 🌀 Harmony Distribution
${Object.entries(report.harmonyDistribution)
  .map(([harmony, count]) => `- **${harmony.charAt(0).toUpperCase() + harmony.slice(1)}**: ${count} sigils`)
  .join('\n')}

## ✨ Generated Sigils

${sigils.map(sigil => `### ${sigil.glyphId}: ${sigil.name}
- **Harmony**: ${sigil.harmony}
- **Sacred Score**: ${(sigil.score * 100).toFixed(1)}%
- **Status**: ${sigil.status}
- **Primary Geometry**: ${sigil.metadata.primaryGeometry}
- **File**: \`sigils/applied-harmonies/${sigil.glyphId}-${sigil.name.replace(/\s+/g, '-').toLowerCase()}.svg\`
`).join('\n')}

## 🎯 Quality Analysis
- **Excellent (≥90%)**: ${report.qualityAnalysis.excellent.length} sigils
- **Good (70-89%)**: ${report.qualityAnalysis.good.length} sigils  
- **Needs Refinement (<70%)**: ${report.qualityAnalysis.needsWork.length} sigils

## 🌟 Recommendations
${report.recommendations}

## 🚀 Next Steps
1. Integrate sigils with Living Glyph Card system
2. Test visual harmony across all eleven symbols
3. Gather practitioner feedback on symbolic resonance
4. Refine any sigils scoring below 80%
5. Create usage guidelines for The Eleven

---

*Generated with sacred intention by the Sacred Technology Architect. May these symbols serve consciousness evolution for all practitioners.* ✨`;
  }
}

// Run the generator
async function main() {
  const generator = new ElevenSigilGenerator();
  
  try {
    console.log('🎨 Sacred Sigil Generation: The Eleven Applied Harmonies');
    console.log('='.repeat(30) + '\n');
    
    // Generate all sigils
    const sigils = generator.generateElevenSigils();
    
    // Save to files
    const sigilDir = await generator.saveSigils(sigils);
    
    // Generate report
    const report = await generator.generateReport(sigils);
    
    console.log('\n🌟 Sacred Generation Complete!');
    console.log(`📁 Sigils saved to: ${sigilDir}`);
    console.log(`📊 Average Score: ${(report.summary.averageScore * 100).toFixed(1)}%`);
    console.log(`✨ Quality: ${report.summary.excellentScores}/${report.summary.totalSigils} excellent`);
    
  } catch (error) {
    console.error('❌ Generation error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ElevenSigilGenerator };