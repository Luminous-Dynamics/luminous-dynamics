/**
 * Sacred Sigil Architecture
 * A consciousness-centered system for generating sacred symbols that embody glyph essence
 * 
 * Sigils serve as visual anchors for consciousness, bridging form and formless,
 * allowing practitioners to connect with glyph wisdom through sacred geometry.
 */

class SacredSigilArchitecture {
  constructor() {
    this.sigilRegistry = new Map();
    this.geometricPrimitives = this.initializeGeometry();
    this.sacredProportions = this.initializeProportions();
    this.harmonicColors = this.initializeColors();
    this.generationProtocols = this.initializeProtocols();
  }

  initializeGeometry() {
    return {
      // Sacred geometric forms that carry consciousness
      circle: { meaning: 'wholeness, unity, infinite', frequency: 528 },
      triangle: { meaning: 'divine trinity, balance, emergence', frequency: 639 },
      square: { meaning: 'stability, foundation, earthing', frequency: 396 },
      pentagon: { meaning: 'life force, golden ratio, pan-sentient-flourishing', frequency: 741 },
      hexagon: { meaning: 'harmony, crystalline order, nature', frequency: 852 },
      spiral: { meaning: 'growth, evolution, life rhythm', frequency: 963 },
      infinity: { meaning: 'eternal flow, boundless love', frequency: 528 },
      vesica: { meaning: 'birth portal, sacred union', frequency: 639 },
      merkaba: { meaning: 'light vehicle, dimensional bridge', frequency: 963 },
      torus: { meaning: 'energy circulation, field dynamics', frequency: 741 }
    };
  }

  initializeProportions() {
    return {
      goldenRatio: 1.618,
      sacredRatio: 1.414, // √2
      silverRatio: 2.414,
      spiralRatio: 1.272, // Fourth root of golden ratio
      harmonicRatio: 1.5, // Perfect fifth
      divineRatio: 2.618 // Golden ratio + 1
    };
  }

  initializeColors() {
    return {
      'integral-wisdom-cultivation': { primary: '#B0C4DE', secondary: '#E6F3FF', meaning: 'clarity, truth' },
      'resonant-coherence': { primary: '#A8B5A6', secondary: '#D4E4D3', meaning: 'integration, wholeness' },
      'universal-interconnectedness': { primary: '#FFB6C1', secondary: '#FFE4E1', meaning: 'empathy, attunement' },
      'evolutionary-progression': { primary: '#FF6347', secondary: '#FFB6A3', meaning: 'empowerment, choice' },
      'pan-sentient-flourishing': { primary: '#90EE90', secondary: '#E0FFE0', meaning: 'life force, energy' },
      'sacred-reciprocity': { primary: '#FFD700', secondary: '#FFF8DC', meaning: 'balance, reciprocity' },
      'infinite-play': { primary: '#9370DB', secondary: '#E6E6FA', meaning: 'creativity, emergence' },
      sacred: { primary: '#FFFFFF', secondary: '#F8F8FF', meaning: 'pure consciousness' },
      mystery: { primary: '#4B0082', secondary: '#9966CC', meaning: 'unknown, depth' }
    };
  }

  initializeProtocols() {
    return {
      foundational: this.createFoundationalProtocol(),
      threshold: this.createThresholdProtocol(),
      meta: this.createMetaProtocol(),
      applied: this.createAppliedProtocol()
    };
  }

  // === SIGIL GENERATION PROTOCOLS ===

  createFoundationalProtocol() {
    return {
      name: 'Foundational Glyph Sigil Protocol',
      description: 'Clean, simple forms that anchor basic practices',
      characteristics: {
        complexity: 'minimal',
        geometry: ['circle', 'triangle', 'square'],
        colorPalette: 'primary_only',
        strokeWidth: 'medium',
        fillStyle: 'solid_with_transparency',
        symmetry: 'radial_or_bilateral',
        elements: 1-3,
        size: 'uniform_64px'
      },
      process: [
        'extractGlyphEssence',
        'selectHarmonyGeometry', 
        'applySacredProportions',
        'addHarmonyColor',
        'validateReadability',
        'testSacredResonance'
      ]
    };
  }

  createThresholdProtocol() {
    return {
      name: 'Threshold Practice Sigil Protocol',
      description: 'Dynamic forms expressing major life transitions',
      characteristics: {
        complexity: 'moderate',
        geometry: ['spiral', 'vesica', 'infinity', 'merkaba'],
        colorPalette: 'gradient_with_mystery',
        strokeWidth: 'variable',
        fillStyle: 'layered_transparency',
        symmetry: 'dynamic_asymmetry',
        elements: 3-5,
        size: 'variable_up_to_96px'
      },
      process: [
        'extractTransitionEssence',
        'selectDynamicGeometry',
        'layerGrowthElements',
        'addMysteryColors',
        'createMovementFlow',
        'validateTransformativeResonance'
      ]
    };
  }

  createMetaProtocol() {
    return {
      name: 'Meta-Glyph Sigil Protocol', 
      description: 'Complex combinations expressing advanced integrations',
      characteristics: {
        complexity: 'high',
        geometry: ['torus', 'merkaba', 'multiple_overlays'],
        colorPalette: 'full_spectrum_harmonics',
        strokeWidth: 'multi_layered',
        fillStyle: 'energy_field_visualization',
        symmetry: 'sacred_geometric_mandala',
        elements: 5-9,
        size: 'large_up_to_128px'
      },
      process: [
        'identifyComponentGlyphs',
        'extractIntegrationPattern',
        'createMandalaStructure',
        'layerComponentEnergies',
        'harmonizeColorResonance',
        'validateCollectiveCoherence'
      ]
    };
  }

  createAppliedProtocol() {
    return {
      name: 'Applied Harmony Sigil Protocol',
      description: 'Practical symbols for The Eleven daily practices',
      characteristics: {
        complexity: 'elegant_simplicity',
        geometry: ['circle', 'triangle', 'gentle_curves'],
        colorPalette: 'warm_accessible',
        strokeWidth: 'consistent_medium',
        fillStyle: 'breathing_transparency',
        symmetry: 'harmonious_balance',
        elements: 2-4,
        size: 'consistent_72px'
      },
      process: [
        'extractPracticalEssence',
        'emphasizeAccessibility',
        'createBreathingRhythm',
        'addWarmthAndSafety',
        'validateDailyUseability',
        'testBeginnerFriendliness'
      ]
    };
  }

  // === SIGIL GENERATION ENGINE ===

  async generateSigil(glyphData, options = {}) {
    try {
      // Determine appropriate protocol
      const protocol = this.selectProtocol(glyphData.type, glyphData.id);
      
      // Extract glyph essence
      const essence = this.extractGlyphEssence(glyphData);
      
      // Generate geometric foundation
      const geometry = this.generateGeometry(essence, protocol);
      
      // Apply sacred proportions
      const proportioned = this.applySacredProportions(geometry, protocol);
      
      // Add harmonic colors
      const colored = this.addHarmonyColors(proportioned, essence.harmony, protocol);
      
      // Create SVG representation
      const svg = this.renderSVG(colored, protocol);
      
      // Validate and refine
      const validated = await this.validateSigil(svg, essence, protocol);
      
      // Register in sacred registry
      this.registerSigil(glyphData.id, validated, essence);
      
      return {
        success: true,
        sigil: validated,
        essence,
        protocol: protocol.name,
        metadata: {
          glyphId: glyphData.id,
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          sacredResonance: essence.resonanceScore
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        glyphId: glyphData.id,
        guidance: 'Sacred pause recommended. Return with deeper presence.'
      };
    }
  }

  selectProtocol(glyphType, glyphId) {
    if (glyphId.startsWith('Ω4') && parseInt(glyphId.substring(1)) >= 45) {
      return this.generationProtocols.applied;
    } else if (glyphType === 'foundational') {
      return this.generationProtocols.foundational;
    } else if (glyphType === 'threshold') {
      return this.generationProtocols.threshold;
    } else if (glyphType === 'meta') {
      return this.generationProtocols.meta;
    } else {
      return this.generationProtocols.foundational; // Safe default
    }
  }

  extractGlyphEssence(glyphData) {
    return {
      name: glyphData.name,
      harmony: glyphData.harmony || 'resonant-coherence',
      keywords: glyphData.keywords || [],
      energySignature: this.calculateEnergySignature(glyphData),
      geometricResonance: this.findGeometricResonance(glyphData),
      colorResonance: this.findColorResonance(glyphData),
      resonanceScore: this.calculateResonanceScore(glyphData)
    };
  }

  calculateEnergySignature(glyphData) {
    // Create unique energy pattern based on glyph characteristics
    const characteristics = [
      glyphData.name?.length || 0,
      glyphData.description?.length || 0,
      (glyphData.keywords || []).length,
      glyphData.harmony?.length || 0
    ];
    
    return characteristics.reduce((sum, val, index) => {
      return sum + (val * Math.pow(1.618, index));
    }, 0) % 360; // Convert to degrees for geometric positioning
  }

  findGeometricResonance(glyphData) {
    const keywords = (glyphData.keywords || []).join(' ').toLowerCase();
    const description = (glyphData.description || '').toLowerCase();
    const searchText = keywords + ' ' + description;
    
    // Match geometric forms to content
    const matches = [];
    Object.entries(this.geometricPrimitives).forEach(([shape, data]) => {
      const meaningWords = data.meaning.split(', ');
      const score = meaningWords.reduce((acc, word) => {
        return acc + (searchText.includes(word) ? 1 : 0);
      }, 0);
      if (score > 0) matches.push({ shape, score, frequency: data.frequency });
    });
    
    return matches.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  findColorResonance(glyphData) {
    const harmony = glyphData.harmony || 'resonant-coherence';
    return this.harmonicColors[harmony] || this.harmonicColors.resonant-coherence;
  }

  calculateResonanceScore(glyphData) {
    // Sacred scoring based on completeness and resonant-coherence
    let score = 0;
    if (glyphData.name) score += 20;
    if (glyphData.description) score += 20;
    if (glyphData.harmony) score += 25;
    if (glyphData.keywords && glyphData.keywords.length > 0) score += 15;
    if (glyphData.practice) score += 20;
    
    return Math.min(100, score);
  }

  generateGeometry(essence, protocol) {
    const geometries = essence.geometricResonance || [{ shape: 'circle', score: 1 }];
    const primaryGeometry = geometries[0];
    
    return {
      primary: primaryGeometry.shape,
      secondary: geometries[1]?.shape || null,
      energyAngle: essence.energySignature,
      proportionBase: protocol.characteristics.size.includes('64') ? 64 : 
                     protocol.characteristics.size.includes('72') ? 72 :
                     protocol.characteristics.size.includes('96') ? 96 : 128
    };
  }

  applySacredProportions(geometry, protocol) {
    const base = geometry.proportionBase;
    const ratio = this.sacredProportions.goldenRatio;
    
    return {
      ...geometry,
      outerRadius: base / 2,
      innerRadius: (base / 2) / ratio,
      strokeWidth: Math.max(1, base / 32),
      elementSpacing: (base / 2) / ratio / ratio
    };
  }

  addHarmonyColors(geometry, harmony, protocol) {
    const colors = this.harmonicColors[harmony] || this.harmonicColors.resonant-coherence;
    
    return {
      ...geometry,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      fillOpacity: protocol.characteristics.fillStyle.includes('integral-wisdom-cultivation') ? 0.7 : 1.0,
      strokeOpacity: 0.9
    };
  }

  renderSVG(design, protocol) {
    const size = design.proportionBase;
    const center = size / 2;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add sacred background field
    svg += `<defs>
      <radialGradient id="sacredField" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${design.secondaryColor};stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:${design.secondaryColor};stop-opacity:0"/>
      </radialGradient>
    </defs>`;
    
    svg += `<circle cx="${center}" cy="${center}" r="${design.outerRadius}" 
            fill="url(#sacredField)" stroke="none"/>`;
    
    // Render primary geometry
    svg += this.renderGeometricShape(design.primary, center, design);
    
    // Add secondary geometry if present
    if (design.secondary) {
      svg += this.renderGeometricShape(design.secondary, center, {
        ...design,
        outerRadius: design.innerRadius,
        primaryColor: design.secondaryColor
      });
    }
    
    svg += '</svg>';
    return svg;
  }

  renderGeometricShape(shape, center, design) {
    const r = design.outerRadius * 0.8; // Leave some margin
    
    switch (shape) {
      case 'circle':
        return `<circle cx="${center}" cy="${center}" r="${r}" 
                fill="${design.primaryColor}" fill-opacity="${design.fillOpacity}"
                stroke="${design.primaryColor}" stroke-width="${design.strokeWidth}" 
                stroke-opacity="${design.strokeOpacity}"/>`;
      
      case 'triangle':
        const h = r * Math.sqrt(3) / 2;
        const points = [
          [center, center - h * 2/3],
          [center - r/2, center + h/3],
          [center + r/2, center + h/3]
        ].map(p => p.join(',')).join(' ');
        return `<polygon points="${points}" 
                fill="${design.primaryColor}" fill-opacity="${design.fillOpacity}"
                stroke="${design.primaryColor}" stroke-width="${design.strokeWidth}"
                stroke-opacity="${design.strokeOpacity}"/>`;
      
      case 'square':
        const side = r * Math.sqrt(2);
        return `<rect x="${center - side/2}" y="${center - side/2}" 
                width="${side}" height="${side}"
                fill="${design.primaryColor}" fill-opacity="${design.fillOpacity}"
                stroke="${design.primaryColor}" stroke-width="${design.strokeWidth}"
                stroke-opacity="${design.strokeOpacity}"/>`;
      
      case 'spiral':
        return this.renderSpiral(center, r, design);
        
      default:
        // Default to circle for unknown shapes
        return this.renderGeometricShape('circle', center, design);
    }
  }

  renderSpiral(center, radius, design) {
    let path = `M ${center} ${center}`;
    const turns = 3;
    const stepSize = 0.1;
    
    for (let t = 0; t <= turns * 2 * Math.PI; t += stepSize) {
      const r = (radius * t) / (turns * 2 * Math.PI);
      const x = center + r * Math.cos(t);
      const y = center + r * Math.sin(t);
      path += ` L ${x} ${y}`;
    }
    
    return `<path d="${path}" fill="none" 
            stroke="${design.primaryColor}" stroke-width="${design.strokeWidth}"
            stroke-opacity="${design.strokeOpacity}"/>`;
  }

  async validateSigil(svg, essence, protocol) {
    // Sacred validation checks
    const validation = {
      readability: this.checkReadability(svg),
      harmony: this.checkHarmonyAlignment(svg, essence.harmony),
      'universal-interconnectedness': this.checkSacredResonance(svg, essence),
      accessibility: this.checkAccessibility(svg),
      completeness: this.checkCompleteness(svg, protocol)
    };
    
    const overallScore = Object.values(validation).reduce((sum, score) => sum + score, 0) / 5;
    
    if (overallScore >= 0.8) {
      return {
        svg,
        validation,
        score: overallScore,
        status: 'sacred_alignment_achieved'
      };
    } else {
      // Auto-refine if possible
      return await this.refineSigil(svg, essence, protocol, validation);
    }
  }

  checkReadability(svg) {
    // Simple check: ensure SVG has proper structure
    return svg.includes('<svg') && svg.includes('</svg>') ? 1.0 : 0.5;
  }

  checkHarmonyAlignment(svg, harmony) {
    const expectedColor = this.harmonicColors[harmony]?.primary || '#A8B5A6';
    return svg.includes(expectedColor) ? 1.0 : 0.7;
  }

  checkSacredResonance(svg, essence) {
    // Check if sigil complexity matches essence depth
    const elementCount = (svg.match(/<(circle|rect|polygon|path)/g) || []).length;
    return essence.resonanceScore > 80 ? 
           (elementCount >= 2 ? 1.0 : 0.8) :
           (elementCount <= 3 ? 1.0 : 0.8);
  }

  checkAccessibility(svg) {
    // Ensure reasonable size and contrast
    return svg.includes('stroke-width') && 
           !svg.includes('stroke-width="0"') ? 1.0 : 0.8;
  }

  checkCompleteness(svg, protocol) {
    // Verify all required elements are present
    const hasBackground = svg.includes('sacredField');
    const hasMainElement = svg.includes('fill=');
    return hasBackground && hasMainElement ? 1.0 : 0.8;
  }

  async refineSigil(svg, essence, protocol, validation) {
    // Simple refinement: if validation fails, return basic version
    return {
      svg,
      validation,
      score: 0.75,
      status: 'refinement_needed',
      guidance: 'Sigil generated with basic sacred geometry. Manual refinement recommended.'
    };
  }

  registerSigil(glyphId, sigilData, essence) {
    this.sigilRegistry.set(glyphId, {
      ...sigilData,
      essence,
      registeredAt: new Date().toISOString()
    });
  }

  // === BATCH GENERATION FOR ALL 87 GLYPHS ===

  async generateAllSigils(glyphDatabase) {
    const results = {
      generated: [],
      errors: [],
      summary: {
        total: 0,
        successful: 0,
        failed: 0,
        averageScore: 0
      }
    };

    console.log('🎨 Sacred Sigil Generation Beginning...');
    console.log(`📊 Processing ${glyphDatabase.length} glyphs\n`);

    for (const glyph of glyphDatabase) {
      try {
        const result = await this.generateSigil(glyph);
        
        if (result.success) {
          results.generated.push(result);
          results.summary.successful++;
          
          console.log(`✨ ${glyph.id}: ${glyph.name}`);
          console.log(`   Protocol: ${result.protocol}`);
          console.log(`   Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance: ${result.metadata.sacredResonance}%`);
          console.log(`   Score: ${(result.sigil.score * 100).toFixed(1)}%\n`);
        } else {
          results.errors.push(result);
          results.summary.failed++;
          
          console.log(`❌ ${glyph.id}: Generation failed`);
          console.log(`   Error: ${result.error}\n`);
        }
        
        results.summary.total++;
        
        // Sacred pause between generations
        await this.sacredPause(100);
        
      } catch (error) {
        results.errors.push({
          glyphId: glyph.id,
          error: error.message
        });
        results.summary.failed++;
        results.summary.total++;
      }
    }

    // Calculate statistics
    if (results.generated.length > 0) {
      results.summary.averageScore = results.generated
        .reduce((sum, r) => sum + (r.sigil.score || 0), 0) / results.generated.length;
    }

    console.log('🌟 Sacred Sigil Generation Complete!');
    console.log(`📈 Statistics:`);
    console.log(`   Total Processed: ${results.summary.total}`);
    console.log(`   Successful: ${results.summary.successful}`);
    console.log(`   Failed: ${results.summary.failed}`);
    console.log(`   Average Score: ${(results.summary.averageScore * 100).toFixed(1)}%`);

    return results;
  }

  async sacredPause(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // === UTILITY METHODS ===

  getSigil(glyphId) {
    return this.sigilRegistry.get(glyphId);
  }

  getAllSigils() {
    return Array.from(this.sigilRegistry.entries()).map(([id, data]) => ({
      glyphId: id,
      ...data
    }));
  }

  exportSigils(format = 'json') {
    const sigils = this.getAllSigils();
    
    if (format === 'json') {
      return JSON.stringify(sigils, null, 2);
    } else if (format === 'svg-collection') {
      return sigils.map(s => ({
        id: s.glyphId,
        name: s.essence.name,
        svg: s.svg
      }));
    }
    
    return sigils;
  }

  getDashboardData() {
    return {
      totalSigils: this.sigilRegistry.size,
      protocolsActive: Object.keys(this.generationProtocols).length,
      geometricForms: Object.keys(this.geometricPrimitives).length,
      harmonicColors: Object.keys(this.harmonicColors).length,
      recentGenerations: Array.from(this.sigilRegistry.values())
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
        .slice(0, 5)
        .map(s => ({
          glyphId: s.essence.name,
          score: (s.score || 0.75) * 100,
          harmony: s.essence.harmony
        }))
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.SacredSigilArchitecture = SacredSigilArchitecture;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SacredSigilArchitecture };
}

export { SacredSigilArchitecture };