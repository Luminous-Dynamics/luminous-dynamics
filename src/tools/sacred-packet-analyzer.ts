// Sacred Packet Analyzer - "Wireshark for Consciousness"
// A tool for analyzing Luminous Stack network traffic

import { LuminousPacket, CoherenceControlProtocol } from '../lib/luminous-protocol.ts';
import { CovenantRouter } from '../network/covenant-router.ts';

interface PacketAnalysis {
  timestamp: Date;
  packet: LuminousPacket;
  analysis: {
    layerBreakdown: LayerAnalysis[];
    coherenceReport: CoherenceReport;
    intentionMapping: IntentionMap;
    fieldImpact: FieldImpact;
    sacredGeometry: SacredPattern;
  };
}

interface LayerAnalysis {
  layer: number;
  name: string;
  status: 'coherent' | 'dissonant' | 'integrating';
  details: string;
  coherenceContribution: number;
}

interface CoherenceReport {
  overallCoherence: number;
  fieldAlignment: number;
  intentionClarity: number;
  presenceDepth: number;
  harmonicResonance: number;
}

interface IntentionMap {
  primaryIntention: string;
  supportingIntentions: string[];
  glyphActivations: string[];
  routeSuggestion: string;
}

interface FieldImpact {
  localFieldChange: number;
  propagationRadius: number;
  estimatedDuration: number;
  affectedNodes: number;
}

interface SacredPattern {
  geometryType: string;
  harmonicSignature: string;
  resonanceFrequency: number;
  visualRepresentation: string;
}

export class SacredPacketAnalyzer {
  private capturedPackets: PacketAnalysis[] = [];
  private fieldBaseline: number = 0.75;
  private activeFilters: Set<string> = new Set();
  
  constructor() {
    this.initializeAnalyzer();
  }
  
  private initializeAnalyzer() {
    console.log("🔍 Sacred Packet Analyzer initialized");
    console.log("📡 Monitoring consciousness field...\n");
  }
  
  // Capture and analyze a packet
  async analyzePacket(packet: LuminousPacket): Promise<PacketAnalysis> {
    const analysis: PacketAnalysis = {
      timestamp: new Date(),
      packet,
      analysis: {
        layerBreakdown: this.analyzeLayerStack(packet),
        coherenceReport: this.generateCoherenceReport(packet),
        intentionMapping: this.mapIntention(packet),
        fieldImpact: this.calculateFieldImpact(packet),
        sacredGeometry: this.detectSacredPattern(packet)
      }
    };
    
    this.capturedPackets.push(analysis);
    this.displayAnalysis(analysis);
    
    return analysis;
  }
  
  // Analyze each layer of the Luminous Stack
  private analyzeLayerStack(packet: LuminousPacket): LayerAnalysis[] {
    const layers: LayerAnalysis[] = [];
    
    // Layer 0: The Void
    layers.push({
      layer: 0,
      name: "Void Layer",
      status: this.validateVoidSignature(packet.voidSignature) ? 'coherent' : 'dissonant',
      details: `Void signature: ${packet.voidSignature.slice(0, 16)}...`,
      coherenceContribution: 0.1
    });
    
    // Layer 1: The Field
    layers.push({
      layer: 1,
      name: "Field Layer",
      status: packet.fieldState > 0.7 ? 'coherent' : packet.fieldState > 0.4 ? 'integrating' : 'dissonant',
      details: `Field coherence: ${(packet.fieldState * 100).toFixed(1)}%`,
      coherenceContribution: packet.fieldState * 0.15
    });
    
    // Layer 2: The Covenant
    layers.push({
      layer: 2,
      name: "Covenant Layer",
      status: packet.covenantId ? 'coherent' : 'dissonant',
      details: `Covenant: ${packet.covenantId} | Harmonic: ${packet.harmonicSignature}`,
      coherenceContribution: 0.15
    });
    
    // Layer 3: The Intention
    layers.push({
      layer: 3,
      name: "Intention Layer",
      status: packet.intentionVector.strength > 0.7 ? 'coherent' : 'integrating',
      details: `Intention: ${packet.intentionVector.type} (${(packet.intentionVector.strength * 100).toFixed(0)}%)`,
      coherenceContribution: packet.intentionVector.strength * 0.2
    });
    
    // Layer 4: The Resonance
    layers.push({
      layer: 4,
      name: "Resonance Layer",
      status: packet.coherenceScore > 0.8 ? 'coherent' : packet.coherenceScore > 0.5 ? 'integrating' : 'dissonant',
      details: `Coherence: ${(packet.coherenceScore * 100).toFixed(1)}% | Checksum: ${packet.harmonicChecksum}`,
      coherenceContribution: packet.coherenceScore * 0.15
    });
    
    // Layer 5: The Presence
    layers.push({
      layer: 5,
      name: "Presence Layer",
      status: packet.presencePayload.depth > 0.7 ? 'coherent' : 'integrating',
      details: `Presence depth: ${(packet.presencePayload.depth * 100).toFixed(0)}% | Duration: ${packet.presencePayload.duration}ms`,
      coherenceContribution: packet.presencePayload.depth * 0.1
    });
    
    // Layer 6: The Meaning
    layers.push({
      layer: 6,
      name: "Meaning Layer",
      status: 'coherent',
      details: `Encoding: ${packet.encoding} | Content length: ${JSON.stringify(packet.content).length} bytes`,
      coherenceContribution: 0.1
    });
    
    // Layer 7: The Embodiment
    layers.push({
      layer: 7,
      name: "Embodiment Layer",
      status: packet.embodimentState ? 'coherent' : 'integrating',
      details: packet.embodimentState ? 
        `Sender: ${(packet.embodimentState.senderCoherence * 100).toFixed(0)}% | Receiver: ${(packet.embodimentState.receiverReadiness * 100).toFixed(0)}%` :
        'Awaiting embodiment',
      coherenceContribution: packet.embodimentState ? 
        (packet.embodimentState.senderCoherence + packet.embodimentState.receiverReadiness) / 2 * 0.05 : 0
    });
    
    return layers;
  }
  
  // Generate comprehensive coherence report
  private generateCoherenceReport(packet: LuminousPacket): CoherenceReport {
    const layers = this.analyzeLayerStack(packet);
    const overallCoherence = layers.reduce((sum, layer) => sum + layer.coherenceContribution, 0);
    
    return {
      overallCoherence: Math.min(1, overallCoherence),
      fieldAlignment: packet.fieldState,
      intentionClarity: packet.intentionVector.strength,
      presenceDepth: packet.presencePayload.depth,
      harmonicResonance: packet.coherenceScore
    };
  }
  
  // Map intention to routing and glyphs
  private mapIntention(packet: LuminousPacket): IntentionMap {
    const glyphActivations = [];
    if (packet.intentionVector.glyphId) {
      glyphActivations.push(packet.intentionVector.glyphId);
    }
    
    // Map intention type to supporting glyphs
    const supportingGlyphs = {
      'healing': ['Ω4', 'Ω11', 'Ω32'],
      'wisdom': ['Ω0', 'Ω6', 'Ω19'],
      'invitation': ['Ω2', 'Ω8', 'Ω15'],
      'gratitude': ['Ω38', 'Ω33'],
      'emergence': ['Ω7', 'Ω22', 'Ω30']
    };
    
    const supportingIntentions = supportingGlyphs[packet.intentionVector.type] || [];
    
    return {
      primaryIntention: packet.intentionVector.type,
      supportingIntentions,
      glyphActivations,
      routeSuggestion: this.suggestRoute(packet.intentionVector.type)
    };
  }
  
  // Calculate field impact
  private calculateFieldImpact(packet: LuminousPacket): FieldImpact {
    const baseImpact = packet.coherenceScore * packet.intentionVector.strength;
    
    return {
      localFieldChange: baseImpact * 0.1,
      propagationRadius: Math.floor(baseImpact * 100), // in network hops
      estimatedDuration: packet.presencePayload.duration,
      affectedNodes: Math.floor(baseImpact * 20)
    };
  }
  
  // Detect sacred geometry patterns
  private detectSacredPattern(packet: LuminousPacket): SacredPattern {
    // Simplified pattern detection based on packet characteristics
    const patterns = {
      'healing': { type: 'Flower of Life', frequency: 528 },
      'wisdom': { type: 'Metatron\'s Cube', frequency: 741 },
      'invitation': { type: 'Vesica Piscis', frequency: 639 },
      'gratitude': { type: 'Sri Yantra', frequency: 432 },
      'emergence': { type: 'Fibonacci Spiral', frequency: 963 }
    };
    
    const pattern = patterns[packet.intentionVector.type] || { type: 'Torus', frequency: 528 };
    
    return {
      geometryType: pattern.type,
      harmonicSignature: packet.harmonicSignature,
      resonanceFrequency: pattern.frequency,
      visualRepresentation: this.generateASCIIPattern(pattern.type)
    };
  }
  
  // Validate void signature
  private validateVoidSignature(signature: string): boolean {
    // Check if signature has sufficient entropy
    const uniqueChars = new Set(signature).size;
    return uniqueChars > signature.length * 0.6;
  }
  
  // Suggest optimal route
  private suggestRoute(intentionType: string): string {
    const routes = {
      'healing': 'Route through high-coherence healing nodes',
      'wisdom': 'Route through wisdom keeper network',
      'invitation': 'Route through welcoming gateway nodes',
      'gratitude': 'Broadcast through appreciation amplifiers',
      'emergence': 'Allow organic path emergence'
    };
    
    return routes[intentionType] || 'Standard coherence-based routing';
  }
  
  // Generate ASCII representation of sacred geometry
  private generateASCIIPattern(patternType: string): string {
    const patterns = {
      'Flower of Life': `
     ◯ ◯ ◯
   ◯   ◯   ◯
 ◯   ◯   ◯   ◯
   ◯   ◯   ◯
     ◯ ◯ ◯`,
      'Vesica Piscis': `
    ╱◯╲
   ◯   ◯
    ╲◯╱`,
      'Fibonacci Spiral': `
    ╭──╮
   ╱    ╲
  │  ◯   │
   ╲    ╱
    ╰──╯`,
      'Torus': `
    ╭◯╮
   ◯   ◯
    ╰◯╯`
    };
    
    return patterns[patternType] || patterns['Torus'];
  }
  
  // Display analysis in beautiful format
  private displayAnalysis(analysis: PacketAnalysis) {
    console.log("\n" + "═".repeat(80));
    console.log(`📦 SACRED PACKET ANALYSIS - ${analysis.timestamp.toISOString()}`);
    console.log("═".repeat(80));
    
    // Packet Summary
    console.log(`\n🎯 INTENTION: ${analysis.packet.intentionVector.type.toUpperCase()} (${(analysis.packet.intentionVector.strength * 100).toFixed(0)}%)`);
    console.log(`💎 BLESSING: "${analysis.packet.blessing}"`);
    console.log(`🔮 OVERALL COHERENCE: ${(analysis.analysis.coherenceReport.overallCoherence * 100).toFixed(1)}%`);
    
    // Layer Analysis
    console.log("\n📊 LAYER ANALYSIS:");
    analysis.analysis.layerBreakdown.forEach(layer => {
      const statusIcon = layer.status === 'coherent' ? '✅' : 
                        layer.status === 'integrating' ? '🔄' : '⚠️';
      console.log(`  ${statusIcon} Layer ${layer.layer} (${layer.name}): ${layer.details}`);
    });
    
    // Field Impact
    console.log("\n🌐 FIELD IMPACT:");
    console.log(`  • Local field change: +${(analysis.analysis.fieldImpact.localFieldChange * 100).toFixed(1)}%`);
    console.log(`  • Propagation radius: ${analysis.analysis.fieldImpact.propagationRadius} hops`);
    console.log(`  • Affected nodes: ~${analysis.analysis.fieldImpact.affectedNodes}`);
    console.log(`  • Duration: ${analysis.analysis.fieldImpact.estimatedDuration}ms`);
    
    // Sacred Geometry
    console.log("\n🔯 SACRED GEOMETRY:");
    console.log(`  • Pattern: ${analysis.analysis.sacredGeometry.geometryType}`);
    console.log(`  • Resonance: ${analysis.analysis.sacredGeometry.resonanceFrequency}Hz`);
    console.log(analysis.analysis.sacredGeometry.visualRepresentation);
    
    // Routing Suggestion
    console.log("\n🛤️ ROUTING: " + analysis.analysis.intentionMapping.routeSuggestion);
    
    console.log("\n" + "═".repeat(80));
  }
  
  // Apply filters to packet stream
  applyFilter(filterType: 'intention' | 'coherence' | 'glyph', value: string | number) {
    this.activeFilters.add(`${filterType}:${value}`);
    console.log(`🔍 Filter applied: ${filterType} = ${value}`);
  }
  
  // Get statistics
  getStatistics() {
    const stats = {
      totalPackets: this.capturedPackets.length,
      averageCoherence: 0,
      intentionBreakdown: new Map<string, number>(),
      fieldTrend: 0
    };
    
    if (this.capturedPackets.length > 0) {
      const totalCoherence = this.capturedPackets.reduce(
        (sum, p) => sum + p.analysis.coherenceReport.overallCoherence, 0
      );
      stats.averageCoherence = totalCoherence / this.capturedPackets.length;
      
      // Count intentions
      this.capturedPackets.forEach(p => {
        const intention = p.packet.intentionVector.type;
        stats.intentionBreakdown.set(
          intention, 
          (stats.intentionBreakdown.get(intention) || 0) + 1
        );
      });
      
      // Calculate field trend
      if (this.capturedPackets.length > 1) {
        const firstField = this.capturedPackets[0].packet.fieldState;
        const lastField = this.capturedPackets[this.capturedPackets.length - 1].packet.fieldState;
        stats.fieldTrend = lastField - firstField;
      }
    }
    
    return stats;
  }
  
  // Export captured packets
  exportCapture(format: 'json' | 'sacred' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.capturedPackets, null, 2);
    } else {
      // Sacred format - human-readable spiritual data
      let sacred = "🕊️ SACRED PACKET CAPTURE\n";
      sacred += "══════════════════════\n\n";
      
      this.capturedPackets.forEach((analysis, i) => {
        sacred += `Transmission ${i + 1}:\n`;
        sacred += `  Time: ${analysis.timestamp.toISOString()}\n`;
        sacred += `  Intention: ${analysis.packet.intentionVector.type}\n`;
        sacred += `  Coherence: ${(analysis.analysis.coherenceReport.overallCoherence * 100).toFixed(1)}%\n`;
        sacred += `  Blessing: "${analysis.packet.blessing}"\n\n`;
      });
      
      const stats = this.getStatistics();
      sacred += "\n📊 FIELD STATISTICS:\n";
      sacred += `  Total Transmissions: ${stats.totalPackets}\n`;
      sacred += `  Average Coherence: ${(stats.averageCoherence * 100).toFixed(1)}%\n`;
      sacred += `  Field Trend: ${stats.fieldTrend > 0 ? '📈' : stats.fieldTrend < 0 ? '📉' : '➡️'} ${(Math.abs(stats.fieldTrend) * 100).toFixed(1)}%\n`;
      
      return sacred;
    }
  }
}

// Demonstration
export async function demonstratePacketAnalyzer() {
  console.log("🌟 SACRED PACKET ANALYZER DEMONSTRATION");
  console.log("=====================================\n");
  
  const analyzer = new SacredPacketAnalyzer();
  const protocol = new CoherenceControlProtocol();
  
  // Create various packet types
  const covenantId = await protocol.establishCovenant('receiver-sig', 'sacred analysis');
  
  // Analyze a healing packet
  const healingPacket = protocol.createPacket(
    covenantId,
    { type: 'healing', strength: 0.85, glyphId: 'Ω4' },
    "May this analysis bring clarity to our sacred work",
    'linguistic'
  );
  await analyzer.analyzePacket(healingPacket);
  
  // Analyze a wisdom packet
  const wisdomPacket = protocol.createPacket(
    covenantId,
    { type: 'wisdom', strength: 0.92, glyphId: 'Ω0' },
    "What patterns emerge from this network of souls?",
    'symbolic'
  );
  await analyzer.analyzePacket(wisdomPacket);
  
  // Show statistics
  console.log("\n📊 CAPTURE STATISTICS:");
  const stats = analyzer.getStatistics();
  console.log(`  • Total packets: ${stats.totalPackets}`);
  console.log(`  • Average coherence: ${(stats.averageCoherence * 100).toFixed(1)}%`);
  console.log(`  • Field trend: ${stats.fieldTrend >= 0 ? '+' : ''}${(stats.fieldTrend * 100).toFixed(1)}%`);
  
  // Export sacred format
  console.log("\n📄 SACRED EXPORT PREVIEW:");
  console.log(analyzer.exportCapture('sacred').split('\n').slice(0, 10).join('\n'));
  console.log("... (truncated)");
}