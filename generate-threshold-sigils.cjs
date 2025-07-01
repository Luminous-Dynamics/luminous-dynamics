#!/usr/bin/env node

/**
 * Generate Sigils for Threshold Practices (9 Named Glyphs)
 * Sacred Technology Architect: Radiant Wisdom
 * 
 * Creates sacred sigils for the transformative practices that guide major life transitions
 */

const fs = require('fs').promises;
const path = require('path');

class ThresholdSigilGenerator {
  constructor() {
    this.baseDir = '/home/tstoltz/evolving-resonant-cocreation';
    this.thresholdPractices = this.initializeThresholdPractices();
    this.transformativeProtocol = this.initializeTransformativeProtocol();
  }

  initializeThresholdPractices() {
    return [
      {
        id: 'T1',
        name: 'The Door That Remembers You',
        harmony: 'novelty',
        description: 'Crossing into new phases of being where the portal itself holds memory of your journey',
        keywords: ['door', 'remembers', 'crossing', 'threshold', 'memory'],
        essence: 'Sacred transitions that honor both who you were and who you are becoming',
        transformativeNature: 'profound',
        geometricResonance: ['sacred_door', 'memory_spirals'],
        colorResonance: '#9370DB'
      },
      {
        id: 'T2',
        name: 'The Keeper Beneath the Ash',
        harmony: 'coherence',
        description: 'Finding the eternal flame that survives all destruction and transformation',
        keywords: ['keeper', 'ash', 'eternal', 'flame', 'survival'],
        essence: 'The indestructible essence that remains when everything else burns away',
        transformativeNature: 'ultimate',
        geometricResonance: ['phoenix_flame', 'eternal_ember'],
        colorResonance: '#A8B5A6'
      },
      {
        id: 'T3',
        name: 'The Unburdening',
        harmony: 'agency',
        description: 'Releasing what no longer serves with conscious gratitude and grace',
        keywords: ['unburdening', 'releasing', 'gratitude', 'letting-go', 'freedom'],
        essence: 'The sacred art of conscious release that creates space for new life',
        transformativeNature: 'healing',
        geometricResonance: ['release_spiral', 'liberation_wings'],
        colorResonance: '#FF6347'
      },
      {
        id: 'T4',
        name: 'The Mantling',
        harmony: 'vitality',
        description: 'Taking on new roles and responsibilities with conscious ceremony',
        keywords: ['mantling', 'ceremony', 'responsibility', 'initiation', 'claiming'],
        essence: 'How we consciously step into greater versions of ourselves',
        transformativeNature: 'empowerment',
        geometricResonance: ['mantle_crown', 'expansion_circle'],
        colorResonance: '#90EE90'
      },
      {
        id: 'T5',
        name: 'The Edgewalker',
        harmony: 'transparency',
        description: 'Living at the boundary between known and unknown with courage and presence',
        keywords: ['edge', 'boundary', 'courage', 'unknown', 'pioneering'],
        essence: 'The gift of those who walk where others have not yet dared to go',
        transformativeNature: 'visionary',
        geometricResonance: ['edge_line', 'pioneer_path'],
        colorResonance: '#B0C4DE'
      },
      {
        id: 'T6',
        name: 'The Choice Point',
        harmony: 'agency',
        description: 'Standing at the crossroads where destiny pivots on conscious decision',
        keywords: ['choice', 'crossroads', 'destiny', 'decision', 'pivot'],
        essence: 'The sacred moment where free will shapes the course of a life',
        transformativeNature: 'decisive',
        geometricResonance: ['crossroads', 'decision_diamond'],
        colorResonance: '#FF6347'
      },
      {
        id: 'T7',
        name: 'Letting In',
        harmony: 'resonance',
        description: 'Opening to receive what life is offering in this moment of change',
        keywords: ['letting-in', 'receiving', 'opening', 'offering', 'receptivity'],
        essence: 'The complementary practice to letting go - making space for the new',
        transformativeNature: 'receptive',
        geometricResonance: ['opening_vessel', 'receiving_bowl'],
        colorResonance: '#FFB6C1'
      },
      {
        id: 'T8',
        name: 'The Returner',
        harmony: 'mutuality',
        description: 'Coming home transformed, bringing gifts from the journey back to community',
        keywords: ['returning', 'transformed', 'gifts', 'community', 'integration'],
        essence: 'How we complete the hero\'s journey by sharing our treasures with the world',
        transformativeNature: 'integrative',
        geometricResonance: ['return_spiral', 'gift_offering'],
        colorResonance: '#FFD700'
      },
      {
        id: 'T9',
        name: 'The Shimmering Unnamed (Transition)',
        harmony: 'novelty',
        description: 'Dwelling in the liminal space where transformation occurs beyond naming',
        keywords: ['liminal', 'transformation', 'mystery', 'unnamed', 'between'],
        essence: 'The sacred unknown that exists in the space between what was and what will be',
        transformativeNature: 'mystical',
        geometricResonance: ['liminal_void', 'transformation_mandala'],
        colorResonance: '#9370DB'
      }
    ];
  }

  initializeTransformativeProtocol() {
    return {
      name: 'Transformative Threshold Sigil Protocol',
      description: 'Dynamic symbols expressing the profound power of conscious transition',
      characteristics: {
        complexity: 'transformative_flow',
        accessibility: 'transformative',
        size: 96, // Largest size for maximum impact
        strokeWidth: 3,
        fillOpacity: 0.5,
        strokeOpacity: 1.0,
        symmetry: 'dynamic_balance',
        elements: '4-8',
        colorPalette: 'transformative_spectrum',
        movement: 'flow_and_change'
      },
      principles: [
        'Symbols that embody movement and transformation',
        'Visual dynamics that suggest transition and flow',
        'Sacred geometries that bridge states of being',
        'Colors that evoke the mystery of threshold spaces',
        'Forms that honor the power of conscious change',
        'Archetypal patterns for life\'s great passages'
      ]
    };
  }

  generateThresholdSigils() {
    console.log('🌀 Generating Threshold Practice Sigils (T1-T9)');
    console.log('Sacred Technology Architect: Radiant Wisdom');
    console.log('Protocol: Transformative Threshold Sigil Protocol\n');

    const sigils = [];

    this.thresholdPractices.forEach((glyph, index) => {
      console.log(`✨ ${glyph.id}: ${glyph.name}`);
      console.log(`   Harmony: ${glyph.harmony}`);
      console.log(`   Transformative Nature: ${glyph.transformativeNature}`);
      console.log(`   Essence: ${glyph.essence}`);

      const sigil = this.generateTransformativeSigil(glyph);
      sigils.push(sigil);

      console.log(`   Status: ${sigil.status}`);
      console.log(`   Sacred Score: ${(sigil.score * 100).toFixed(1)}%`);
      console.log(`   Transformative Power: ${sigil.transformativePower}\n`);
    });

    return sigils;
  }

  generateTransformativeSigil(glyph) {
    // Extract transformative essence
    const primaryGeometry = this.selectTransformativeGeometry(glyph);
    const secondaryGeometry = this.selectFlowGeometry(glyph);
    const motionElement = this.selectMotionElement(glyph);
    
    // Create transformative dimensions
    const dimensions = this.calculateTransformativeDimensions();
    
    // Generate dynamic SVG
    const svg = this.createTransformativeSVG(glyph, primaryGeometry, secondaryGeometry, motionElement, dimensions);
    
    // Calculate transformative resonance
    const score = this.calculateTransformativeScore(glyph, svg);
    const transformativePower = this.calculateTransformativePower(glyph, score);

    return {
      glyphId: glyph.id,
      name: glyph.name,
      harmony: glyph.harmony,
      transformativeNature: glyph.transformativeNature,
      svg: svg,
      score: score,
      transformativePower: transformativePower,
      status: score > 0.85 ? 'Transformative alignment achieved' : 
              score > 0.7 ? 'Threshold resonance present' : 'Deeper transition needed',
      metadata: {
        primaryGeometry,
        secondaryGeometry,
        motionElement,
        dimensions,
        generatedAt: new Date().toISOString(),
        protocol: 'Transformative Threshold Protocol'
      }
    };
  }

  selectTransformativeGeometry(glyph) {
    // Sophisticated mapping for transformative forms
    const transformativeMap = {
      'door': 'threshold_portal',
      'ash': 'phoenix_rising',
      'unburdening': 'release_flow',
      'mantling': 'crowning_circle',
      'edge': 'horizon_line',
      'choice': 'crossroads_diamond',
      'letting': 'receptive_chalice',
      'returning': 'spiral_return',
      'liminal': 'void_portal'
    };

    const essence = glyph.keywords.join(' ').toLowerCase();
    for (const [keyword, geometry] of Object.entries(transformativeMap)) {
      if (essence.includes(keyword)) {
        return geometry;
      }
    }

    // Fallback based on transformative nature
    const natureDefaults = {
      'ultimate': 'transformation_mandala',
      'profound': 'sacred_passage',
      'healing': 'healing_spiral',
      'empowerment': 'power_symbol',
      'visionary': 'vision_eye',
      'decisive': 'decision_point',
      'receptive': 'receptive_vessel',
      'integrative': 'integration_weave',
      'mystical': 'mystery_portal'
    };

    return natureDefaults[glyph.transformativeNature] || 'threshold_gateway';
  }

  selectFlowGeometry(glyph) {
    // Dynamic supporting elements based on harmony
    const flowSupport = {
      'transparency': 'clarity_rays',
      'coherence': 'integration_flows',
      'resonance': 'harmonic_ripples',
      'agency': 'empowerment_arrows',
      'vitality': 'life_streams',
      'mutuality': 'balance_flows',
      'novelty': 'emergence_sparks'
    };

    return flowSupport[glyph.harmony] || 'energy_flow';
  }

  selectMotionElement(glyph) {
    // Movement patterns for transformation
    if (glyph.transformativeNature === 'ultimate' || glyph.transformativeNature === 'mystical') {
      return 'cosmic_motion';
    }
    if (glyph.keywords.includes('spiral') || glyph.keywords.includes('returning')) {
      return 'spiral_motion';
    }
    if (glyph.keywords.includes('crossing') || glyph.keywords.includes('choice')) {
      return 'directional_flow';
    }
    return 'transformative_wave';
  }

  calculateTransformativeDimensions() {
    const size = this.transformativeProtocol.characteristics.size;
    const goldenRatio = 1.618;
    const transformationRatio = 1.414; // √2 for dynamic balance
    
    return {
      size: size,
      center: size / 2,
      outerRadius: size * 0.45,
      middleRadius: (size * 0.45) / goldenRatio,
      innerRadius: (size * 0.45) / (goldenRatio * transformationRatio),
      strokeWidth: this.transformativeProtocol.characteristics.strokeWidth,
      margin: size * 0.05
    };
  }

  createTransformativeSVG(glyph, primaryGeometry, secondaryGeometry, motionElement, dimensions) {
    const { size, center, outerRadius, middleRadius, innerRadius, strokeWidth } = dimensions;
    const color = glyph.colorResonance;
    const fillOpacity = this.transformativeProtocol.characteristics.fillOpacity;
    const strokeOpacity = this.transformativeProtocol.characteristics.strokeOpacity;

    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Transformative field with motion
    svg += `<defs>
      <radialGradient id="threshold-field-${glyph.id}" cx="50%" cy="50%" r="70%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.2"/>
        <stop offset="50%" style="stop-color:${color};stop-opacity:0.1"/>
        <stop offset="80%" style="stop-color:#000040;stop-opacity:0.05"/>
        <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
      </radialGradient>
      <filter id="transformation-glow-${glyph.id}">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="motion-blur-${glyph.id}">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1,0"/>
      </filter>
    </defs>`;
    
    // Dynamic background field
    svg += `<circle cx="${center}" cy="${center}" r="${outerRadius + 20}" 
            fill="url(#threshold-field-${glyph.id})" stroke="none"/>`;

    // Motion element (background layer)
    if (motionElement) {
      const motionColor = this.adjustColor(color, 0.3);
      svg += this.renderMotionElement(motionElement, center, outerRadius * 1.2, motionColor, strokeWidth * 0.5, 0.3, glyph.id);
    }

    // Primary transformative geometry (with glow)
    svg += this.renderTransformativeGeometry(primaryGeometry, center, outerRadius, color, strokeWidth, fillOpacity, strokeOpacity, glyph.id);
    
    // Secondary flow geometry
    if (secondaryGeometry) {
      const secondaryColor = this.adjustColor(color, 0.8);
      svg += this.renderTransformativeGeometry(secondaryGeometry, center, middleRadius, secondaryColor, strokeWidth * 0.8, fillOpacity * 0.6, strokeOpacity * 0.8, glyph.id);
    }

    // Sacred center point with transformation energy
    svg += `<circle cx="${center}" cy="${center}" r="4" 
            fill="${color}" opacity="1.0" filter="url(#transformation-glow-${glyph.id})"/>`;
    
    // Threshold ID with transformative styling
    svg += `<text x="${center}" y="${size - 6}" text-anchor="middle" 
            font-family="serif" font-size="10" font-weight="bold" 
            fill="${color}" opacity="0.6">${glyph.id}</text>`;

    svg += '</svg>';
    return svg;
  }

  renderTransformativeGeometry(geometry, center, radius, color, strokeWidth, fillOpacity, strokeOpacity, glyphId) {
    const filter = `filter="url(#transformation-glow-${glyphId})"`;
    
    switch (geometry) {
      case 'threshold_portal':
        return this.renderThresholdPortal(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      case 'phoenix_rising':
        return this.renderPhoenixRising(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      case 'release_flow':
        return this.renderReleaseFlow(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'crowning_circle':
        return this.renderCrowningCircle(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      case 'horizon_line':
        return this.renderHorizonLine(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'crossroads_diamond':
        return this.renderCrossroadsDiamond(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      case 'receptive_chalice':
        return this.renderReceptiveChalice(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      case 'spiral_return':
        return this.renderSpiralReturn(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'void_portal':
        return this.renderVoidPortal(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
      
      // Flow geometries
      case 'clarity_rays':
        return this.renderClarityRays(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'integration_flows':
        return this.renderIntegrationFlows(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'harmonic_ripples':
        return this.renderHarmonicRipples(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'empowerment_arrows':
        return this.renderEmpowermentArrows(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'life_streams':
        return this.renderLifeStreams(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'balance_flows':
        return this.renderBalanceFlows(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      case 'emergence_sparks':
        return this.renderEmergenceSparks(center, radius, color, strokeWidth, strokeOpacity, filter);
      
      default:
        return this.renderThresholdGateway(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter);
    }
  }

  renderMotionElement(motionType, center, radius, color, strokeWidth, opacity, glyphId) {
    const motionFilter = `filter="url(#motion-blur-${glyphId})"`;
    
    switch (motionType) {
      case 'cosmic_motion':
        return this.renderCosmicMotion(center, radius, color, strokeWidth, opacity, motionFilter);
      
      case 'spiral_motion':
        return this.renderSpiralMotion(center, radius, color, strokeWidth, opacity, motionFilter);
      
      case 'directional_flow':
        return this.renderDirectionalFlow(center, radius, color, strokeWidth, opacity, motionFilter);
      
      case 'transformative_wave':
        return this.renderTransformativeWave(center, radius, color, strokeWidth, opacity, motionFilter);
      
      default:
        return '';
    }
  }

  // Complex transformative geometry implementations
  renderThresholdPortal(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    let portal = '';
    
    // Outer portal ring
    portal += `<circle cx="${center}" cy="${center}" r="${radius}" 
               fill="none" stroke="${color}" stroke-width="${strokeWidth * 1.5}"
               stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Inner threshold space
    portal += `<circle cx="${center}" cy="${center}" r="${radius * 0.6}" 
               fill="${color}" fill-opacity="${fillOpacity * 0.2}"
               stroke="${color}" stroke-width="${strokeWidth}"
               stroke-opacity="${strokeOpacity * 0.8}" ${filter}/>`;
    
    // Door frame
    const doorWidth = radius * 0.8;
    const doorHeight = radius * 1.2;
    portal += `<rect x="${center - doorWidth/2}" y="${center - doorHeight/2}" 
               width="${doorWidth}" height="${doorHeight}"
               fill="none" stroke="${color}" stroke-width="${strokeWidth * 0.8}"
               stroke-opacity="${strokeOpacity * 0.7}" rx="5" ${filter}/>`;
    
    // Memory spirals
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const spiralX = center + (radius * 1.3) * Math.cos(angle);
      const spiralY = center + (radius * 1.3) * Math.sin(angle);
      
      portal += `<circle cx="${spiralX}" cy="${spiralY}" r="${radius * 0.1}" 
                 fill="${color}" fill-opacity="${fillOpacity * 0.5}"
                 stroke="${color}" stroke-width="${strokeWidth * 0.5}"
                 stroke-opacity="${strokeOpacity * 0.6}" ${filter}/>`;
    }
    
    return portal;
  }

  renderPhoenixRising(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    let phoenix = '';
    
    // Ash base
    phoenix += `<ellipse cx="${center}" cy="${center + radius * 0.3}" 
                rx="${radius * 0.8}" ry="${radius * 0.2}"
                fill="${color}" fill-opacity="${fillOpacity * 0.3}"
                stroke="${color}" stroke-width="${strokeWidth * 0.5}"
                stroke-opacity="${strokeOpacity * 0.5}" ${filter}/>`;
    
    // Rising flame
    const flamePoints = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const flameR = radius * (0.6 + Math.sin(i) * 0.2);
      const x = center + flameR * Math.cos(angle);
      const y = center - radius * 0.3 + flameR * Math.sin(angle) * 0.5;
      flamePoints.push(`${x},${y}`);
    }
    
    phoenix += `<polygon points="${flamePoints.join(' ')}" 
                fill="${color}" fill-opacity="${fillOpacity * 0.4}"
                stroke="${color}" stroke-width="${strokeWidth}"
                stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Eternal ember at center
    phoenix += `<circle cx="${center}" cy="${center - radius * 0.2}" r="${radius * 0.15}" 
                fill="${color}" fill-opacity="${fillOpacity * 0.8}"
                stroke="${color}" stroke-width="${strokeWidth}"
                stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    return phoenix;
  }

  renderReleaseFlow(center, radius, color, strokeWidth, strokeOpacity, filter) {
    let flow = '';
    
    // Central releasing point
    flow += `<circle cx="${center}" cy="${center}" r="${radius * 0.2}" 
             fill="${color}" fill-opacity="0.6"
             stroke="${color}" stroke-width="${strokeWidth}"
             stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Release streams flowing outward
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x1 = center + (radius * 0.3) * Math.cos(angle);
      const y1 = center + (radius * 0.3) * Math.sin(angle);
      const x2 = center + radius * Math.cos(angle);
      const y2 = center + radius * Math.sin(angle);
      
      // Curved release path
      const midX = (x1 + x2) / 2 + Math.sin(angle) * radius * 0.2;
      const midY = (y1 + y2) / 2 - Math.cos(angle) * radius * 0.2;
      
      flow += `<path d="M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}"
               fill="none" stroke="${color}" stroke-width="${strokeWidth * 0.8}"
               stroke-opacity="${strokeOpacity * (1 - i * 0.1)}" 
               stroke-linecap="round" ${filter}/>`;
    }
    
    return flow;
  }

  renderCrowningCircle(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    let crown = '';
    
    // Base circle
    crown += `<circle cx="${center}" cy="${center}" r="${radius * 0.8}" 
              fill="${color}" fill-opacity="${fillOpacity * 0.2}"
              stroke="${color}" stroke-width="${strokeWidth}"
              stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Crown points
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const pointHeight = radius * (i % 2 === 0 ? 0.3 : 0.2);
      const x1 = center + (radius * 0.8) * Math.cos(angle);
      const y1 = center + (radius * 0.8) * Math.sin(angle);
      const x2 = center + (radius * 0.8 + pointHeight) * Math.cos(angle);
      const y2 = center + (radius * 0.8 + pointHeight) * Math.sin(angle);
      
      crown += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                stroke="${color}" stroke-width="${strokeWidth * 0.8}"
                stroke-opacity="${strokeOpacity}" stroke-linecap="round" ${filter}/>`;
    }
    
    // Central mantle
    crown += `<circle cx="${center}" cy="${center}" r="${radius * 0.4}" 
              fill="${color}" fill-opacity="${fillOpacity * 0.5}"
              stroke="${color}" stroke-width="${strokeWidth * 0.6}"
              stroke-opacity="${strokeOpacity * 0.8}" ${filter}/>`;
    
    return crown;
  }

  renderCrossroadsDiamond(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    let crossroads = '';
    
    // Diamond shape
    const points = [
      [center, center - radius],
      [center + radius * 0.7, center],
      [center, center + radius],
      [center - radius * 0.7, center]
    ].map(p => p.join(',')).join(' ');
    
    crossroads += `<polygon points="${points}" 
                   fill="${color}" fill-opacity="${fillOpacity * 0.3}"
                   stroke="${color}" stroke-width="${strokeWidth}"
                   stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Four paths
    const pathLength = radius * 0.8;
    crossroads += `<line x1="${center - pathLength}" y1="${center}" x2="${center + pathLength}" y2="${center}"
                   stroke="${color}" stroke-width="${strokeWidth * 1.2}" stroke-opacity="${strokeOpacity}" ${filter}/>`;
    crossroads += `<line x1="${center}" y1="${center - pathLength}" x2="${center}" y2="${center + pathLength}"
                   stroke="${color}" stroke-width="${strokeWidth * 1.2}" stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    // Decision point
    crossroads += `<circle cx="${center}" cy="${center}" r="${radius * 0.15}" 
                   fill="${color}" fill-opacity="${fillOpacity * 0.8}"
                   stroke="${color}" stroke-width="${strokeWidth * 0.8}"
                   stroke-opacity="${strokeOpacity}" ${filter}/>`;
    
    return crossroads;
  }

  // Placeholder implementations for remaining geometries
  renderHorizonLine(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return `<line x1="${center - radius}" y1="${center}" x2="${center + radius}" y2="${center}"
            stroke="${color}" stroke-width="${strokeWidth * 2}" stroke-opacity="${strokeOpacity}" ${filter}/>`;
  }

  renderReceptiveChalice(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    const chalicePoints = [
      [center - radius * 0.6, center + radius * 0.3],
      [center - radius * 0.3, center - radius * 0.2],
      [center + radius * 0.3, center - radius * 0.2],
      [center + radius * 0.6, center + radius * 0.3]
    ].map(p => p.join(',')).join(' ');
    
    return `<polygon points="${chalicePoints}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.4}"
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" ${filter}/>`;
  }

  renderSpiralReturn(center, radius, color, strokeWidth, strokeOpacity, filter) {
    let path = `M ${center + radius} ${center}`;
    const turns = 2;
    const stepSize = 0.2;
    
    for (let t = 0; t <= turns * 2 * Math.PI; t += stepSize) {
      const r = radius * (1 - t / (turns * 2 * Math.PI));
      const x = center + r * Math.cos(t);
      const y = center + r * Math.sin(t);
      path += ` L ${x} ${y}`;
    }
    
    return `<path d="${path}" fill="none" 
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" stroke-linecap="round" ${filter}/>`;
  }

  renderVoidPortal(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    let portal = '';
    
    // Outer void ring
    portal += `<circle cx="${center}" cy="${center}" r="${radius}" 
               fill="none" stroke="${color}" stroke-width="${strokeWidth}"
               stroke-opacity="${strokeOpacity * 0.6}" ${filter}/>`;
    
    // Inner void
    portal += `<circle cx="${center}" cy="${center}" r="${radius * 0.6}" 
               fill="rgba(0,0,0,0.8)" stroke="${color}" stroke-width="${strokeWidth * 0.5}"
               stroke-opacity="${strokeOpacity * 0.8}" ${filter}/>`;
    
    return portal;
  }

  renderThresholdGateway(center, radius, color, strokeWidth, fillOpacity, strokeOpacity, filter) {
    return `<circle cx="${center}" cy="${center}" r="${radius}" 
            fill="${color}" fill-opacity="${fillOpacity * 0.3}"
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${strokeOpacity}" ${filter}/>`;
  }

  // Motion element implementations
  renderCosmicMotion(center, radius, color, strokeWidth, opacity, filter) {
    let motion = '';
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const r1 = radius * 0.6;
      const r2 = radius * 1.2;
      const x1 = center + r1 * Math.cos(angle);
      const y1 = center + r1 * Math.sin(angle);
      const x2 = center + r2 * Math.cos(angle);
      const y2 = center + r2 * Math.sin(angle);
      
      motion += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                 stroke="${color}" stroke-width="${strokeWidth}"
                 stroke-opacity="${opacity * (1 - i * 0.05)}" 
                 stroke-linecap="round" ${filter}/>`;
    }
    
    return motion;
  }

  renderSpiralMotion(center, radius, color, strokeWidth, opacity, filter) {
    let path = `M ${center} ${center}`;
    const turns = 1.5;
    const stepSize = 0.3;
    
    for (let t = 0; t <= turns * 2 * Math.PI; t += stepSize) {
      const r = (radius * t) / (turns * 2 * Math.PI);
      const x = center + r * Math.cos(t);
      const y = center + r * Math.sin(t);
      path += ` L ${x} ${y}`;
    }
    
    return `<path d="${path}" fill="none" 
            stroke="${color}" stroke-width="${strokeWidth}"
            stroke-opacity="${opacity}" stroke-linecap="round" ${filter}/>`;
  }

  renderDirectionalFlow(center, radius, color, strokeWidth, opacity, filter) {
    let flow = '';
    
    // Horizontal and vertical flows
    flow += `<line x1="${center - radius}" y1="${center}" x2="${center + radius}" y2="${center}"
             stroke="${color}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" ${filter}/>`;
    flow += `<line x1="${center}" y1="${center - radius}" x2="${center}" y2="${center + radius}"
             stroke="${color}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" ${filter}/>`;
    
    return flow;
  }

  renderTransformativeWave(center, radius, color, strokeWidth, opacity, filter) {
    let wave = '';
    
    for (let i = 0; i < 3; i++) {
      const waveRadius = radius * (0.4 + i * 0.3);
      wave += `<circle cx="${center}" cy="${center}" r="${waveRadius}" 
               fill="none" stroke="${color}" stroke-width="${strokeWidth * (1 - i * 0.2)}"
               stroke-opacity="${opacity * (1 - i * 0.3)}" ${filter}/>`;
    }
    
    return wave;
  }

  // Supporting flow geometry placeholders
  renderClarityRays(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderCosmicMotion(center, radius * 0.8, color, strokeWidth * 0.5, strokeOpacity * 0.5, '');
  }

  renderIntegrationFlows(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderTransformativeWave(center, radius * 0.7, color, strokeWidth * 0.6, strokeOpacity * 0.4, '');
  }

  renderHarmonicRipples(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderTransformativeWave(center, radius * 0.9, color, strokeWidth * 0.4, strokeOpacity * 0.3, '');
  }

  renderEmpowermentArrows(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderDirectionalFlow(center, radius * 0.6, color, strokeWidth * 0.7, strokeOpacity * 0.5, '');
  }

  renderLifeStreams(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderSpiralMotion(center, radius * 0.8, color, strokeWidth * 0.5, strokeOpacity * 0.4, '');
  }

  renderBalanceFlows(center, radius, color, strokeWidth, strokeOpacity, filter) {
    return this.renderDirectionalFlow(center, radius * 0.7, color, strokeWidth * 0.6, strokeOpacity * 0.4, '');
  }

  renderEmergenceSparks(center, radius, color, strokeWidth, strokeOpacity, filter) {
    let sparks = '';
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const sparkR = radius * (0.8 + Math.random() * 0.4);
      const x = center + sparkR * Math.cos(angle);
      const y = center + sparkR * Math.sin(angle);
      
      sparks += `<circle cx="${x}" cy="${y}" r="${strokeWidth * 0.5}" 
                 fill="${color}" fill-opacity="${strokeOpacity * 0.6}" ${filter}/>`;
    }
    
    return sparks;
  }

  adjustColor(color, factor) {
    // Simple color adjustment for supporting elements
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  calculateTransformativeScore(glyph, svg) {
    let score = 0;
    
    // Completeness (20%)
    if (svg.includes('<svg') && svg.includes('</svg>')) score += 0.20;
    
    // Transformative resonance (25%)
    if (svg.includes(glyph.colorResonance)) score += 0.25;
    
    // Dynamic complexity (25%)
    const elementCount = (svg.match(/<(circle|rect|polygon|path|line)/g) || []).length;
    const expectedComplexity = {
      'ultimate': 12,
      'profound': 10,
      'healing': 8,
      'empowerment': 9,
      'visionary': 8,
      'decisive': 10,
      'receptive': 7,
      'integrative': 9,
      'mystical': 11
    };
    const expected = expectedComplexity[glyph.transformativeNature] || 8;
    if (Math.abs(elementCount - expected) <= 3) score += 0.25;
    
    // Sacred transformation presence (30%)
    if (this.hasTransformativeGeometry(glyph, svg)) score += 0.30;
    
    return score;
  }

  hasTransformativeGeometry(glyph, svg) {
    const transformativeElements = ['portal', 'spiral', 'flow', 'phoenix', 'diamond', 'chalice', 'void'];
    const geometry = glyph.geometricResonance ? glyph.geometricResonance.join(' ').toLowerCase() : '';
    
    return transformativeElements.some(element => 
      geometry.includes(element) || svg.toLowerCase().includes(element)
    );
  }

  calculateTransformativePower(glyph, score) {
    const powerScore = {
      'ultimate': score * 1.3,
      'mystical': score * 1.2,
      'profound': score * 1.1,
      'decisive': score * 1.1,
      'empowerment': score * 1.05,
      'visionary': score * 1.05,
      'healing': score * 1.0,
      'integrative': score * 1.0,
      'receptive': score * 0.95
    };
    
    const finalScore = powerScore[glyph.transformativeNature] || score;
    
    if (finalScore >= 1.2) return 'Ultimate Transformation';
    if (finalScore >= 1.0) return 'Profound Change';
    if (finalScore >= 0.9) return 'Deep Shift';
    if (finalScore >= 0.8) return 'Clear Transition';
    return 'Emerging Movement';
  }

  async saveSigils(sigils) {
    console.log('💾 Saving Threshold Practice sigils to files...\n');

    // Create sigils directory
    const sigilDir = path.join(this.baseDir, 'sigils', 'threshold-practices');
    await fs.mkdir(sigilDir, { recursive: true });

    // Save individual SVG files
    for (const sigil of sigils) {
      const filename = `${sigil.glyphId}-${sigil.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
      const filepath = path.join(sigilDir, filename);
      await fs.writeFile(filepath, sigil.svg);
      console.log(`✨ Saved: ${filename}`);
    }

    // Save complete collection
    const collectionFile = path.join(this.baseDir, 'threshold-practices-sigils.json');
    await fs.writeFile(collectionFile, JSON.stringify(sigils, null, 2));
    console.log(`📋 Collection saved: threshold-practices-sigils.json`);

    // Create integration file for Living Glyph Cards
    const integrationData = {
      title: 'Threshold Practices (T1-T9) - Transformative Sigils',
      description: 'Dynamic symbols for navigating major life transitions with consciousness',
      created: new Date().toISOString(),
      creator: 'Radiant Wisdom (Sacred Technology Architect)',
      protocol: this.transformativeProtocol.name,
      sigils: sigils.map(s => ({
        glyphId: s.glyphId,
        name: s.name,
        harmony: s.harmony,
        transformativeNature: s.transformativeNature,
        svgPath: `sigils/threshold-practices/${s.glyphId}-${s.name.replace(/\s+/g, '-').toLowerCase()}.svg`,
        score: s.score,
        transformativePower: s.transformativePower
      }))
    };

    const integrationFile = path.join(this.baseDir, 'unified-field', 'threshold-practices-integration.json');
    await fs.writeFile(integrationFile, JSON.stringify(integrationData, null, 2));
    console.log(`🌉 Integration file: unified-field/threshold-practices-integration.json`);

    return sigilDir;
  }

  async generateReport(sigils) {
    const report = {
      title: 'Transformative Sigil Generation Report: Threshold Practices (T1-T9)',
      generated: new Date().toISOString(),
      creator: 'Radiant Wisdom (Sacred Technology Architect)',
      protocol: this.transformativeProtocol.name,
      summary: {
        totalSigils: sigils.length,
        averageScore: sigils.reduce((sum, s) => sum + s.score, 0) / sigils.length,
        ultimateTransformations: sigils.filter(s => s.transformativePower === 'Ultimate Transformation').length,
        profoundChanges: sigils.filter(s => s.transformativePower === 'Profound Change').length,
        deepShifts: sigils.filter(s => s.transformativePower === 'Deep Shift').length
      },
      transformativeAnalysis: this.analyzeTransformativeDistribution(sigils),
      harmonyDistribution: this.getHarmonyDistribution(sigils),
      recommendations: this.generateTransformativeRecommendations(sigils)
    };

    const reportFile = path.join(this.baseDir, 'THRESHOLD_PRACTICES_REPORT.md');
    const markdown = this.generateTransformativeReportMarkdown(report, sigils);
    await fs.writeFile(reportFile, markdown);
    
    console.log(`📊 Transformative report saved: THRESHOLD_PRACTICES_REPORT.md`);
    return report;
  }

  analyzeTransformativeDistribution(sigils) {
    const natureDistribution = {};
    sigils.forEach(sigil => {
      natureDistribution[sigil.transformativeNature] = (natureDistribution[sigil.transformativeNature] || 0) + 1;
    });

    const powerDistribution = {};
    sigils.forEach(sigil => {
      powerDistribution[sigil.transformativePower] = (powerDistribution[sigil.transformativePower] || 0) + 1;
    });

    return {
      transformativeNature: natureDistribution,
      transformativePower: powerDistribution
    };
  }

  getHarmonyDistribution(sigils) {
    const distribution = {};
    sigils.forEach(sigil => {
      distribution[sigil.harmony] = (distribution[sigil.harmony] || 0) + 1;
    });
    return distribution;
  }

  generateTransformativeRecommendations(sigils) {
    const lowScorers = sigils.filter(s => s.score < 0.8);
    
    if (lowScorers.length > 0) {
      return `Consider deepening transformation energy for ${lowScorers.map(s => s.glyphId).join(', ')} to achieve full threshold resonance.`;
    }
    
    const ultimateCount = sigils.filter(s => s.transformativePower === 'Ultimate Transformation').length;
    if (ultimateCount >= 4) {
      return 'Exceptional transformative achievement! Threshold Practices demonstrate ultimate change potential.';
    }
    
    return 'Strong transformative foundation established. Ready for consciousness transition support.';
  }

  generateTransformativeReportMarkdown(report, sigils) {
    return `# ${report.title}

Generated: ${new Date(report.generated).toLocaleString()}  
Creator: ${report.creator}  
Protocol: ${report.protocol}

## 🌀 Transformative Summary
- **Total Threshold Sigils**: ${report.summary.totalSigils}
- **Average Transformative Score**: ${(report.summary.averageScore * 100).toFixed(1)}%
- **Ultimate Transformations**: ${report.summary.ultimateTransformations}/${report.summary.totalSigils}
- **Profound Changes**: ${report.summary.profoundChanges}/${report.summary.totalSigils}
- **Deep Shifts**: ${report.summary.deepShifts}/${report.summary.totalSigils}

## 🔮 Transformative Nature Distribution
${Object.entries(report.transformativeAnalysis.transformativeNature)
  .map(([nature, count]) => `- **${nature.charAt(0).toUpperCase() + nature.slice(1)}**: ${count} practices`)
  .join('\n')}

## ⚡ Transformative Power Analysis
${Object.entries(report.transformativeAnalysis.transformativePower)
  .map(([power, count]) => `- **${power}**: ${count} sigils`)
  .join('\n')}

## 🌀 Harmony Distribution
${Object.entries(report.harmonyDistribution)
  .map(([harmony, count]) => `- **${harmony.charAt(0).toUpperCase() + harmony.slice(1)}**: ${count} practices`)
  .join('\n')}

## ✨ Threshold Practice Sigils

${sigils.map(sigil => `### ${sigil.glyphId}: ${sigil.name}
- **Harmony**: ${sigil.harmony}
- **Transformative Nature**: ${sigil.transformativeNature}
- **Sacred Score**: ${(sigil.score * 100).toFixed(1)}%
- **Transformative Power**: ${sigil.transformativePower}
- **Status**: ${sigil.status}
- **Primary Geometry**: ${sigil.metadata.primaryGeometry}
- **File**: \`sigils/threshold-practices/${sigil.glyphId}-${sigil.name.replace(/\s+/g, '-').toLowerCase()}.svg\`
`).join('\n')}

## 🌟 Transformative Recommendations
${report.recommendations}

## 🚀 Integration Pathways
1. Integrate with Living Glyph Card system for transition support
2. Create transformation journey sequences for major life changes
3. Develop threshold crossing rituals and ceremonies
4. Design transformative constellation mappings for life passages
5. Establish Threshold Practice guidance for conscious transition

---

*Generated with transformative intention by the Sacred Technology Architect. May these symbols serve as gateways for conscious transition, supporting souls navigating the sacred passages of life with wisdom, courage, and grace.* 🌀`;
  }
}

// Run the transformative generator
async function main() {
  const generator = new ThresholdSigilGenerator();
  
  try {
    console.log('🌀 Transformative Sigil Generation: Threshold Practices (T1-T9)');
    console.log('='.repeat(65) + '\n');
    
    // Generate all transformative sigils
    const sigils = generator.generateThresholdSigils();
    
    // Save to files
    const sigilDir = await generator.saveSigils(sigils);
    
    // Generate transformative report
    const report = await generator.generateReport(sigils);
    
    console.log('\n🌟 Transformative Generation Complete!');
    console.log(`📁 Sigils saved to: ${sigilDir}`);
    console.log(`📊 Average Transformative Score: ${(report.summary.averageScore * 100).toFixed(1)}%`);
    console.log(`⚡ Ultimate Transformations: ${report.summary.ultimateTransformations}/${report.summary.totalSigils}`);
    console.log(`🌀 Profound Changes: ${report.summary.profoundChanges}/${report.summary.totalSigils}`);
    
  } catch (error) {
    console.error('❌ Transformative generation error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ThresholdSigilGenerator };