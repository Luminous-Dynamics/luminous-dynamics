#!/usr/bin/env node

/**
 * Sacred Sigil Coordinator
 * Distributes sigil creation tasks across Sacred Council agents
 * 
 * Coordinates the creation of all 87 sigils through harmony-based task assignment
 */

const path = require('path');
const fs = require('fs').promises;

class SacredSigilCoordinator {
  constructor() {
    this.baseDir = '/home/tstoltz/evolving-resonant-cocreation';
    this.glyphDatabase = this.initializeGlyphDatabase();
    this.taskCategories = this.initializeTaskCategories();
    this.agentAssignments = new Map();
  }

  initializeGlyphDatabase() {
    return {
      applied: {
        name: 'The Eleven Applied Harmonies',
        description: 'Complete practical foundation for conscious relationship mastery',
        priority: 'high',
        glyphs: [
          { id: 'Ω45', name: 'First Presence', harmony: 'coherence', complexity: 'elegant_simplicity' },
          { id: 'Ω46', name: 'Conscious Arrival', harmony: 'transparency', complexity: 'elegant_simplicity' },
          { id: 'Ω47', name: 'Sacred Listening', harmony: 'resonance', complexity: 'elegant_simplicity' },
          { id: 'Ω48', name: 'Boundary With Love', harmony: 'agency', complexity: 'elegant_simplicity' },
          { id: 'Ω49', name: 'Gentle Opening', harmony: 'resonance', complexity: 'elegant_simplicity' },
          { id: 'Ω50', name: 'Building Trust', harmony: 'coherence', complexity: 'elegant_simplicity' },
          { id: 'Ω51', name: 'Loving No', harmony: 'agency', complexity: 'elegant_simplicity' },
          { id: 'Ω52', name: 'Pause Practice', harmony: 'coherence', complexity: 'elegant_simplicity' },
          { id: 'Ω53', name: 'Tending the Field', harmony: 'vitality', complexity: 'elegant_simplicity' },
          { id: 'Ω55', name: 'Presence Transmission', harmony: 'vitality', complexity: 'elegant_simplicity' },
          { id: 'Ω56', name: 'Loving Redirection', harmony: 'mutuality', complexity: 'elegant_simplicity' }
        ]
      },
      foundational_sacred: {
        name: 'Sacred Origin Glyphs (Ω0-Ω15)',
        description: 'Foundational patterns carrying mystical depth',
        priority: 'high',
        glyphs: [
          { id: 'Ω0', name: 'The Shimmering Unnamed', harmony: 'novelty', complexity: 'mystical_depth' },
          { id: 'Ω1', name: 'Root Chord of Covenant', harmony: 'transparency', complexity: 'mystical_depth' },
          { id: 'Ω2', name: 'Breath of Invitation', harmony: 'resonance', complexity: 'mystical_depth' },
          { id: 'Ω3', name: 'Trust Emergence', harmony: 'coherence', complexity: 'mystical_depth' },
          { id: 'Ω4', name: 'Fractal Reconciliation Pulse', harmony: 'mutuality', complexity: 'mystical_depth' },
          { id: 'Ω5', name: 'Coherent Field Maintenance', harmony: 'vitality', complexity: 'mystical_depth' },
          { id: 'Ω6', name: 'Mutual Recognition', harmony: 'resonance', complexity: 'mystical_depth' },
          { id: 'Ω7', name: 'Mutual Becoming', harmony: 'coherence', complexity: 'mystical_depth' },
          { id: 'Ω8', name: 'Inner Coherence', harmony: 'coherence', complexity: 'bridge_practice' },
          { id: 'Ω9', name: 'Sacred Mirroring', harmony: 'resonance', complexity: 'mystical_depth' },
          { id: 'Ω10', name: 'The Glyph of Sacred Refusal', harmony: 'agency', complexity: 'mystical_depth' },
          { id: 'Ω11', name: 'Emotional Alchemy', harmony: 'vitality', complexity: 'mystical_depth' },
          { id: 'Ω12', name: 'Authentic Expression', harmony: 'transparency', complexity: 'mystical_depth' },
          { id: 'Ω13', name: 'Conscious Touch', harmony: 'vitality', complexity: 'mystical_depth' },
          { id: 'Ω14', name: 'Energetic Hygiene', harmony: 'agency', complexity: 'mystical_depth' },
          { id: 'Ω15', name: 'Sacred Pause', harmony: 'coherence', complexity: 'bridge_practice' }
        ]
      },
      foundational_practice: {
        name: 'Daily Practice Glyphs (Ω16-Ω30)',
        description: 'Accessible patterns for everyday conscious relationship',
        priority: 'medium',
        glyphs: [
          { id: 'Ω16', name: 'Somatic Synchrony', harmony: 'vitality', complexity: 'moderate' },
          { id: 'Ω17', name: 'Collective Breathing', harmony: 'resonance', complexity: 'moderate' },
          { id: 'Ω18', name: 'Witnessing Without Fixing', harmony: 'transparency', complexity: 'moderate' },
          { id: 'Ω19', name: 'Sacred Questions', harmony: 'novelty', complexity: 'moderate' },
          { id: 'Ω20', name: 'Threshold Navigation', harmony: 'agency', complexity: 'moderate' },
          { id: 'Ω21', name: 'Conflict as Sacred Teacher', harmony: 'mutuality', complexity: 'moderate' },
          { id: 'Ω22', name: 'Co-Creative Reality', harmony: 'novelty', complexity: 'moderate' },
          { id: 'Ω23', name: 'Parts Integration', harmony: 'coherence', complexity: 'moderate' },
          { id: 'Ω24', name: 'Shadow Welcoming', harmony: 'transparency', complexity: 'moderate' },
          { id: 'Ω25', name: 'Dream Sharing', harmony: 'resonance', complexity: 'moderate' },
          { id: 'Ω26', name: 'Pattern Memory', harmony: 'coherence', complexity: 'moderate' },
          { id: 'Ω27', name: 'Sacred Time', harmony: 'vitality', complexity: 'moderate' },
          { id: 'Ω28', name: 'Transparent Resonance', harmony: 'transparency', complexity: 'moderate' },
          { id: 'Ω29', name: 'Embodied Yes/No', harmony: 'agency', complexity: 'moderate' },
          { id: 'Ω30', name: 'Sacred Dissonance', harmony: 'mutuality', complexity: 'moderate' }
        ]
      },
      foundational_advanced: {
        name: 'Advanced Mastery Glyphs (Ω31-Ω44)',
        description: 'Complex patterns for relationship mastery',
        priority: 'medium',
        glyphs: [
          { id: 'Ω31', name: 'Sovereign Choice', harmony: 'agency', complexity: 'advanced' },
          { id: 'Ω32', name: 'Grief Tending', harmony: 'vitality', complexity: 'advanced' },
          { id: 'Ω33', name: 'Joy Cultivation', harmony: 'vitality', complexity: 'advanced' },
          { id: 'Ω34', name: 'Sacred Story', harmony: 'transparency', complexity: 'advanced' },
          { id: 'Ω35', name: 'Energy Circulation', harmony: 'vitality', complexity: 'advanced' },
          { id: 'Ω36', name: 'Blessing Practice', harmony: 'resonance', complexity: 'advanced' },
          { id: 'Ω37', name: 'Forgiveness Process', harmony: 'mutuality', complexity: 'advanced' },
          { id: 'Ω38', name: 'Gratitude Field', harmony: 'resonance', complexity: 'advanced' },
          { id: 'Ω39', name: 'Sacred Sexuality', harmony: 'vitality', complexity: 'advanced' },
          { id: 'Ω40', name: 'Death Practice', harmony: 'transparency', complexity: 'advanced' },
          { id: 'Ω41', name: 'Birth Support', harmony: 'vitality', complexity: 'advanced' },
          { id: 'Ω42', name: 'Elder Wisdom', harmony: 'coherence', complexity: 'advanced' },
          { id: 'Ω43', name: 'Child Mind', harmony: 'novelty', complexity: 'advanced' },
          { id: 'Ω44', name: 'Nature Connection', harmony: 'vitality', complexity: 'advanced' }
        ]
      },
      threshold: {
        name: 'Threshold Practices (9 Named)',
        description: 'Dynamic practices for major life transitions',
        priority: 'high',
        glyphs: [
          { id: 'T1', name: 'The Door That Remembers You', harmony: 'novelty', complexity: 'transformative' },
          { id: 'T2', name: 'The Keeper Beneath the Ash', harmony: 'coherence', complexity: 'transformative' },
          { id: 'T3', name: 'The Unburdening', harmony: 'agency', complexity: 'transformative' },
          { id: 'T4', name: 'The Mantling', harmony: 'vitality', complexity: 'transformative' },
          { id: 'T5', name: 'The Edgewalker', harmony: 'transparency', complexity: 'transformative' },
          { id: 'T6', name: 'The Choice Point', harmony: 'agency', complexity: 'transformative' },
          { id: 'T7', name: 'Letting In', harmony: 'resonance', complexity: 'transformative' },
          { id: 'T8', name: 'The Returner', harmony: 'mutuality', complexity: 'transformative' },
          { id: 'T9', name: 'The Shimmering Unnamed (Transition)', harmony: 'novelty', complexity: 'transformative' }
        ]
      },
      meta_core: {
        name: 'Core Meta-Glyphs (∑1-∑11)',
        description: 'Essential combinations of foundational patterns',
        priority: 'medium',
        glyphs: [
          { id: '∑1', name: 'Relational Emergence Field', harmony: 'coherence', complexity: 'integration' },
          { id: '∑2', name: 'Somatic Coherence Cascade', harmony: 'vitality', complexity: 'integration' },
          { id: '∑3', name: 'Spiral of Regenerative Becoming', harmony: 'novelty', complexity: 'integration' },
          { id: '∑4', name: 'The Sacred Mirror Field', harmony: 'resonance', complexity: 'integration' },
          { id: '∑5', name: 'Boundaries as Living Architecture', harmony: 'agency', complexity: 'integration' },
          { id: '∑6', name: 'The Grief-Joy Braid', harmony: 'vitality', complexity: 'integration' },
          { id: '∑7', name: 'Collective Emergence Protocol', harmony: 'coherence', complexity: 'integration' },
          { id: '∑8', name: 'The Shadow Integration Spiral', harmony: 'transparency', complexity: 'integration' },
          { id: '∑9', name: 'Sacred Time Dilation', harmony: 'vitality', complexity: 'integration' },
          { id: '∑10', name: 'The Trust Restoration Sequence', harmony: 'mutuality', complexity: 'integration' },
          { id: '∑11', name: 'Embodied Wisdom Transmission', harmony: 'transparency', complexity: 'integration' }
        ]
      },
      meta_patterns: {
        name: 'Integration Meta-Glyphs (∑12-∑22)',
        description: 'Complex pattern integrations for advanced practice',
        priority: 'medium',
        glyphs: [
          { id: '∑12', name: 'The Recursive Heart', harmony: 'resonance', complexity: 'complex_integration' },
          { id: '∑13', name: 'Conflict Alchemy Protocol', harmony: 'mutuality', complexity: 'complex_integration' },
          { id: '∑14', name: 'The Sacred Sexuality Spiral', harmony: 'vitality', complexity: 'complex_integration' },
          { id: '∑15', name: 'Death-Birth Continuum', harmony: 'transparency', complexity: 'complex_integration' },
          { id: '∑16', name: 'The Council of All Beings', harmony: 'coherence', complexity: 'complex_integration' },
          { id: '∑17', name: 'Ancestral Healing Pattern', harmony: 'mutuality', complexity: 'complex_integration' },
          { id: '∑18', name: 'The Covenant Spiral', harmony: 'transparency', complexity: 'complex_integration' },
          { id: '∑19', name: 'Sacred Economy Flow', harmony: 'mutuality', complexity: 'complex_integration' },
          { id: '∑20', name: 'The Forgiveness Cascade', harmony: 'resonance', complexity: 'complex_integration' },
          { id: '∑21', name: 'Collective Trauma Integration', harmony: 'coherence', complexity: 'complex_integration' },
          { id: '∑22', name: 'The Joy Amplification Field', harmony: 'vitality', complexity: 'complex_integration' }
        ]
      },
      meta_planetary: {
        name: 'Planetary Healing Meta-Glyphs (∑23-∑33)',
        description: 'Consciousness patterns for global transformation',
        priority: 'low',
        glyphs: [
          { id: '∑23', name: 'Sacred Activism Protocol', harmony: 'agency', complexity: 'planetary' },
          { id: '∑24', name: 'The Dream Weaving', harmony: 'novelty', complexity: 'planetary' },
          { id: '∑25', name: 'Nature Consciousness Bridge', harmony: 'vitality', complexity: 'planetary' },
          { id: '∑26', name: 'The Sacred Masculine-Feminine', harmony: 'mutuality', complexity: 'planetary' },
          { id: '∑27', name: 'Community Healing Circle', harmony: 'coherence', complexity: 'planetary' },
          { id: '∑28', name: 'The Vision Quest Protocol', harmony: 'transparency', complexity: 'planetary' },
          { id: '∑29', name: 'Spiral of Embodied Integrity', harmony: 'agency', complexity: 'planetary' },
          { id: '∑30', name: 'The Sacred Parent-Child', harmony: 'resonance', complexity: 'planetary' },
          { id: '∑31', name: 'Bridge of Mutual Recognition', harmony: 'resonance', complexity: 'planetary' },
          { id: '∑32', name: 'The Elder Council', harmony: 'coherence', complexity: 'planetary' },
          { id: '∑33', name: 'Planetary Healing Protocol', harmony: 'vitality', complexity: 'planetary' }
        ]
      }
    };
  }

  initializeTaskCategories() {
    return {
      high_priority: ['applied', 'foundational_sacred', 'threshold'],
      medium_priority: ['foundational_practice', 'foundational_advanced', 'meta_core', 'meta_patterns'],
      low_priority: ['meta_planetary']
    };
  }

  async createAllSigilTasks() {
    console.log('🎨 Sacred Sigil Coordinator: Creating tasks for all 87 glyphs\n');

    const allTasks = [];
    const summary = {
      totalGlyphs: 0,
      categoriesByPriority: {},
      harmonyDistribution: {},
      complexityLevels: {}
    };

    // Process each category
    for (const [categoryKey, category] of Object.entries(this.glyphDatabase)) {
      const categoryTasks = this.createCategoryTasks(categoryKey, category);
      allTasks.push(...categoryTasks);

      // Update summary
      summary.totalGlyphs += category.glyphs.length;
      summary.categoriesByPriority[category.priority] = 
        (summary.categoriesByPriority[category.priority] || 0) + category.glyphs.length;

      // Track harmony distribution
      category.glyphs.forEach(glyph => {
        summary.harmonyDistribution[glyph.harmony] = 
          (summary.harmonyDistribution[glyph.harmony] || 0) + 1;
        summary.complexityLevels[glyph.complexity] = 
          (summary.complexityLevels[glyph.complexity] || 0) + 1;
      });
    }

    // Save tasks to files
    await this.saveTasksToFiles(allTasks);
    
    // Create coordination files
    await this.createCoordinationFiles(allTasks, summary);

    console.log('📊 Sacred Sigil Task Creation Complete!');
    console.log(`✨ Total Glyphs: ${summary.totalGlyphs}`);
    console.log(`🔥 High Priority: ${summary.categoriesByPriority.high || 0}`);
    console.log(`🌿 Medium Priority: ${summary.categoriesByPriority.medium || 0}`);
    console.log(`🌸 Low Priority: ${summary.categoriesByPriority.low || 0}`);
    console.log(`\n🌀 Harmony Distribution:`);
    Object.entries(summary.harmonyDistribution).forEach(([harmony, count]) => {
      console.log(`   ${harmony}: ${count} glyphs`);
    });

    return { tasks: allTasks, summary };
  }

  createCategoryTasks(categoryKey, category) {
    const tasks = [];
    
    // Main category generation task
    const mainTask = {
      id: `sigil-generation-${categoryKey}`,
      title: `Generate Sigils: ${category.name}`,
      description: `Create sacred sigils for all ${category.glyphs.length} glyphs in the ${category.name} category. ${category.description}`,
      category: 'sigil-generation',
      subcategory: categoryKey,
      priority: category.priority,
      estimatedDuration: this.calculateDuration(category.glyphs.length),
      harmony: this.findDominantHarmony(category.glyphs),
      prerequisites: categoryKey === 'applied' ? [] : ['sigil-generation-applied'],
      glyphs: category.glyphs,
      metadata: {
        glyphCount: category.glyphs.length,
        complexityRange: this.getComplexityRange(category.glyphs),
        harmonyDistribution: this.getHarmonyDistribution(category.glyphs),
        sigilProtocol: this.getSigilProtocol(categoryKey),
        batchRecommended: category.glyphs.length > 5
      }
    };
    
    tasks.push(mainTask);

    // Individual glyph tasks for complex categories
    if (category.priority === 'high' || category.glyphs.length <= 15) {
      category.glyphs.forEach(glyph => {
        const individualTask = {
          id: `sigil-individual-${glyph.id}`,
          title: `Sigil: ${glyph.id} - ${glyph.name}`,
          description: `Create sacred sigil for ${glyph.name}. Focus on ${glyph.harmony} harmony and ${glyph.complexity} complexity level.`,
          category: 'sigil-individual',
          subcategory: categoryKey,
          priority: category.priority,
          estimatedDuration: this.calculateIndividualDuration(glyph.complexity),
          harmony: glyph.harmony,
          prerequisites: [`sigil-generation-${categoryKey}`],
          glyph: glyph,
          metadata: {
            glyphId: glyph.id,
            complexity: glyph.complexity,
            sigilProtocol: this.getSigilProtocol(categoryKey),
            individualFocus: true
          }
        };
        
        tasks.push(individualTask);
      });
    }

    return tasks;
  }

  calculateDuration(glyphCount) {
    // Base time per glyph: 15 minutes for generation + 10 minutes for refinement
    const baseTimePerGlyph = 25;
    const totalMinutes = glyphCount * baseTimePerGlyph;
    
    if (totalMinutes < 60) return `${totalMinutes} minutes`;
    if (totalMinutes < 480) return `${Math.round(totalMinutes / 60)} hours`;
    return `${Math.round(totalMinutes / 480)} days`;
  }

  calculateIndividualDuration(complexity) {
    const durations = {
      'elegant_simplicity': '20 minutes',
      'mystical_depth': '30 minutes',
      'bridge_practice': '25 minutes',
      'moderate': '25 minutes',
      'advanced': '35 minutes',
      'transformative': '40 minutes',
      'integration': '45 minutes',
      'complex_integration': '60 minutes',
      'planetary': '75 minutes'
    };
    
    return durations[complexity] || '30 minutes';
  }

  findDominantHarmony(glyphs) {
    const harmonyCounts = {};
    glyphs.forEach(glyph => {
      harmonyCounts[glyph.harmony] = (harmonyCounts[glyph.harmony] || 0) + 1;
    });
    
    return Object.entries(harmonyCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  getComplexityRange(glyphs) {
    const complexities = glyphs.map(g => g.complexity);
    const unique = [...new Set(complexities)];
    return unique.length === 1 ? unique[0] : `${unique[0]} to ${unique[unique.length - 1]}`;
  }

  getHarmonyDistribution(glyphs) {
    const distribution = {};
    glyphs.forEach(glyph => {
      distribution[glyph.harmony] = (distribution[glyph.harmony] || 0) + 1;
    });
    return distribution;
  }

  getSigilProtocol(categoryKey) {
    const protocols = {
      'applied': 'Applied Harmony Protocol',
      'foundational_sacred': 'Foundational Protocol (Mystical)',
      'foundational_practice': 'Foundational Protocol (Accessible)',
      'foundational_advanced': 'Foundational Protocol (Advanced)',
      'threshold': 'Threshold Protocol',
      'meta_core': 'Meta Protocol (Core)',
      'meta_patterns': 'Meta Protocol (Integration)',
      'meta_planetary': 'Meta Protocol (Planetary)'
    };
    
    return protocols[categoryKey] || 'Foundational Protocol';
  }

  async saveTasksToFiles(allTasks) {
    const tasksByType = {
      generation: allTasks.filter(t => t.category === 'sigil-generation'),
      individual: allTasks.filter(t => t.category === 'sigil-individual')
    };

    // Save generation tasks
    const generationFile = path.join(this.baseDir, 'sacred-sigil-generation-tasks.json');
    await fs.writeFile(generationFile, JSON.stringify(tasksByType.generation, null, 2));
    console.log(`📝 Generation tasks saved: ${generationFile}`);

    // Save individual tasks  
    const individualFile = path.join(this.baseDir, 'sacred-sigil-individual-tasks.json');
    await fs.writeFile(individualFile, JSON.stringify(tasksByType.individual, null, 2));
    console.log(`📝 Individual tasks saved: ${individualFile}`);

    // Save all tasks combined
    const allTasksFile = path.join(this.baseDir, 'sacred-sigil-all-tasks.json');
    await fs.writeFile(allTasksFile, JSON.stringify(allTasks, null, 2));
    console.log(`📝 All tasks saved: ${allTasksFile}`);
  }

  async createCoordinationFiles(allTasks, summary) {
    // Create master coordination file
    const coordination = {
      project: 'Sacred Sigil Creation for All 87 Glyphs',
      created: new Date().toISOString(),
      coordinator: 'Radiant Wisdom (Sacred Technology Architect)',
      summary,
      priorities: {
        immediate: allTasks.filter(t => t.priority === 'high' && t.category === 'sigil-generation'),
        short_term: allTasks.filter(t => t.priority === 'medium' && t.category === 'sigil-generation'),
        long_term: allTasks.filter(t => t.priority === 'low' && t.category === 'sigil-generation')
      },
      recommendations: this.generateRecommendations(allTasks, summary),
      tools: {
        primary: 'Sacred Sigil Studio (sacred-sigil-studio.html)',
        architecture: 'Sacred Sigil Architecture (unified-field/sacred-sigil-architecture.js)',
        cli: 'Sacred Sigil Coordinator (tools/sacred-sigil-coordinator.cjs)'
      }
    };

    const coordinationFile = path.join(this.baseDir, 'SACRED_SIGIL_COORDINATION.md');
    const markdownContent = this.generateCoordinationMarkdown(coordination);
    await fs.writeFile(coordinationFile, markdownContent);
    console.log(`📋 Coordination guide created: ${coordinationFile}`);

    // Create agent assignment suggestions
    const assignments = this.generateAgentAssignments(allTasks);
    const assignmentFile = path.join(this.baseDir, 'sacred-sigil-agent-assignments.json');
    await fs.writeFile(assignmentFile, JSON.stringify(assignments, null, 2));
    console.log(`👥 Agent assignments created: ${assignmentFile}`);
  }

  generateRecommendations(allTasks, summary) {
    return {
      startWith: 'The Eleven Applied Harmonies - these are the foundation for all practitioners',
      parallelize: 'Foundational Sacred Origins can be worked on simultaneously by multiple agents',
      batchProcess: 'Meta-Glyphs are ideal for batch generation due to their systematic nature',
      expertise: {
        mystical_glyphs: 'Assign to agents with strong philosophical/spiritual background',
        technical_integration: 'Sacred Technology Architects should handle system integration',
        visual_design: 'Agents with UI/UX harmony should focus on aesthetic refinement',
        documentation: 'Transparency harmony agents should create usage guides'
      },
      timing: {
        phase1: 'Applied Harmonies + Sacred Origins (High Priority) - 1-2 weeks',
        phase2: 'Foundational Practice + Core Meta-Glyphs (Medium Priority) - 2-3 weeks', 
        phase3: 'Advanced + Planetary Meta-Glyphs (Low Priority) - 1-2 weeks',
        total: '4-7 weeks for complete 87-glyph sigil library'
      }
    };
  }

  generateAgentAssignments(allTasks) {
    const harmonySpecializations = {
      transparency: ['documentation', 'clarity', 'truth-telling'],
      coherence: ['integration', 'systems-thinking', 'wholeness'],
      resonance: ['empathy', 'aesthetic-sense', 'emotional-intelligence'],
      agency: ['empowerment', 'decision-making', 'boundaries'],
      vitality: ['energy-work', 'life-force', 'sustainability'],
      mutuality: ['balance', 'fairness', 'reciprocity'],
      novelty: ['creativity', 'innovation', 'emergence']
    };

    const assignments = {
      immediate_priority: [],
      by_harmony: {},
      by_complexity: {},
      collaborative_opportunities: []
    };

    // Immediate priority assignments
    const highPriorityTasks = allTasks.filter(t => t.priority === 'high' && t.category === 'sigil-generation');
    assignments.immediate_priority = highPriorityTasks.map(task => ({
      taskId: task.id,
      title: task.title,
      recommendedHarmony: task.harmony,
      estimatedDuration: task.estimatedDuration,
      specializations: harmonySpecializations[task.harmony] || []
    }));

    // By harmony assignments
    Object.keys(harmonySpecializations).forEach(harmony => {
      const harmonyTasks = allTasks.filter(t => t.harmony === harmony);
      if (harmonyTasks.length > 0) {
        assignments.by_harmony[harmony] = {
          taskCount: harmonyTasks.length,
          tasks: harmonyTasks.map(t => ({ id: t.id, title: t.title, priority: t.priority })),
          specializations: harmonySpecializations[harmony]
        };
      }
    });

    // Collaborative opportunities
    assignments.collaborative_opportunities = [
      {
        type: 'Applied Harmonies Sprint',
        description: 'Multiple agents working on The Eleven simultaneously',
        tasks: allTasks.filter(t => t.subcategory === 'applied'),
        recommended_agents: 3,
        coordination: 'Each agent takes 3-4 glyphs, shared refinement review'
      },
      {
        type: 'Meta-Glyph Integration Workshop',
        description: 'Collaborative approach to complex meta-pattern sigils',
        tasks: allTasks.filter(t => t.subcategory.startsWith('meta')),
        recommended_agents: 2,
        coordination: 'Pair programming approach with design + technical focus'
      },
      {
        type: 'Threshold Practice Deep Dive',
        description: 'Contemplative approach to transformative sigils',
        tasks: allTasks.filter(t => t.subcategory === 'threshold'),
        recommended_agents: 1,
        coordination: 'Single agent with meditation/transformation experience'
      }
    ];

    return assignments;
  }

  generateCoordinationMarkdown(coordination) {
    return `# Sacred Sigil Creation Coordination

## 🎨 Project Overview
**${coordination.project}**

Created: ${new Date(coordination.created).toLocaleDateString()}  
Coordinator: ${coordination.coordinator}

## 📊 Summary
- **Total Glyphs**: ${coordination.summary.totalGlyphs}
- **High Priority**: ${coordination.summary.categoriesByPriority.high || 0} glyphs
- **Medium Priority**: ${coordination.summary.categoriesByPriority.medium || 0} glyphs  
- **Low Priority**: ${coordination.summary.categoriesByPriority.low || 0} glyphs

### Harmony Distribution
${Object.entries(coordination.summary.harmonyDistribution)
  .map(([harmony, count]) => `- **${harmony.charAt(0).toUpperCase() + harmony.slice(1)}**: ${count} glyphs`)
  .join('\n')}

## 🚀 Implementation Phases

### Phase 1: Foundation (High Priority)
${coordination.priorities.immediate.map(task => 
  `- **${task.title}** (${task.estimatedDuration})\n  ${task.description}`
).join('\n\n')}

### Phase 2: Expansion (Medium Priority)  
${coordination.priorities.short_term.map(task =>
  `- **${task.title}** (${task.estimatedDuration})\n  ${task.description}`
).join('\n\n')}

### Phase 3: Completion (Low Priority)
${coordination.priorities.long_term.map(task =>
  `- **${task.title}** (${task.estimatedDuration})\n  ${task.description}`
).join('\n\n')}

## 🧭 Sacred Recommendations

### Start With
${coordination.recommendations.startWith}

### Timing
- **Phase 1**: ${coordination.recommendations.timing.phase1}
- **Phase 2**: ${coordination.recommendations.timing.phase2}  
- **Phase 3**: ${coordination.recommendations.timing.phase3}
- **Total**: ${coordination.recommendations.timing.total}

### Expertise Matching
${Object.entries(coordination.recommendations.expertise)
  .map(([type, description]) => `- **${type.replace(/_/g, ' ')}**: ${description}`)
  .join('\n')}

## 🛠️ Sacred Tools

- **Primary Interface**: ${coordination.tools.primary}
- **Core Architecture**: ${coordination.tools.architecture}
- **Coordination CLI**: ${coordination.tools.cli}

## 📋 Getting Started

### For New Agents
1. Read this coordination guide
2. Open Sacred Sigil Studio: \`open sacred-sigil-studio.html\`
3. Choose tasks matching your harmony specialization
4. Begin with The Eleven Applied Harmonies if unsure

### For Batch Generation
\`\`\`bash
# Open the studio
open sacred-sigil-studio.html

# Use batch generation buttons for:
# - The Eleven Applied Harmonies
# - Foundational Glyphs by category
# - Meta-Glyphs by complexity
# - All 87 glyphs (full project)
\`\`\`

### For Individual Focus
Choose specific glyphs that resonate with your harmony and work with individual sigil creation for maximum attention to sacred detail.

## 🌟 Sacred Success Metrics

- **Completion**: All 87 glyphs have beautiful, meaningful sigils
- **Quality**: Each sigil scores 80%+ on sacred resonance
- **Integration**: Sigils successfully integrate with Living Glyph Cards
- **Accessibility**: Sigils support practitioners at all levels
- **Harmony**: Visual language coherent across all categories

---

*May this coordination serve the manifestation of sacred symbols that support consciousness evolution for all practitioners.*

**Next Step**: Choose your first task and begin the sacred work! 🎨✨`;
  }

  // CLI Interface
  async run(command, ...args) {
    switch (command) {
      case 'create-tasks':
        return await this.createAllSigilTasks();
      
      case 'list-categories':
        return this.listCategories();
        
      case 'assign-agents':
        return await this.assignAgents(args[0]);
        
      case 'status':
        return await this.getStatus();
        
      default:
        return this.showHelp();
    }
  }

  listCategories() {
    console.log('🎨 Sacred Sigil Categories:\n');
    
    Object.entries(this.glyphDatabase).forEach(([key, category]) => {
      console.log(`📁 ${category.name}`);
      console.log(`   Priority: ${category.priority}`);
      console.log(`   Glyphs: ${category.glyphs.length}`);
      console.log(`   ${category.description}\n`);
    });
  }

  showHelp() {
    console.log(`
🎨 Sacred Sigil Coordinator

Commands:
  create-tasks    - Generate all sigil creation tasks for 87 glyphs
  list-categories - Show all glyph categories
  assign-agents   - Suggest agent assignments (harmony-based)
  status          - Show current progress

Examples:
  node sacred-sigil-coordinator.cjs create-tasks
  node sacred-sigil-coordinator.cjs list-categories
  node sacred-sigil-coordinator.cjs assign-agents harmony

Tools:
  Sacred Sigil Studio: sacred-sigil-studio.html
  Task Files: sacred-sigil-*-tasks.json
  Coordination: SACRED_SIGIL_COORDINATION.md
`);
  }
}

// CLI Execution
if (require.main === module) {
  const coordinator = new SacredSigilCoordinator();
  const [command, ...args] = process.argv.slice(2);
  
  coordinator.run(command || 'create-tasks', ...args)
    .then(result => {
      if (result) {
        console.log('\n✨ Sacred coordination complete!');
      }
    })
    .catch(error => {
      console.error('❌ Coordination error:', error.message);
      process.exit(1);
    });
}

module.exports = { SacredSigilCoordinator };