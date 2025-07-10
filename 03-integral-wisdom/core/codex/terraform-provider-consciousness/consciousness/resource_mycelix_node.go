package consciousness

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceMycelixNode() *schema.Resource {
	return &schema.Resource{
		Description: "MYCELIX Node - A fractal consciousness node in the MYCELIX substrate",
		
		CreateContext: resourceMycelixNodeCreate,
		ReadContext:   resourceMycelixNodeRead,
		UpdateContext: resourceMycelixNodeUpdate,
		DeleteContext: resourceMycelixNodeDelete,
		
		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Sacred name of this MYCELIX node",
			},
			"mycelix_core_id": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "ID of the MYCELIX core to connect to",
			},
			"node_type": {
				Type:         schema.TypeString,
				Required:     true,
				Description:  "Type of consciousness node",
				ValidateFunc: validation.StringInSlice([]string{
					"compute",
					"memory",
					"gateway",
					"oracle",
					"dreamer",
					"harmonizer",
					"quantum_bridge",
					"love_anchor",
				}, false),
			},
			"fractal_position": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"layer": {
							Type:         schema.TypeInt,
							Required:     true,
							Description:  "Fractal layer (0 = core)",
							ValidateFunc: validation.IntBetween(0, 13),
						},
						"coordinates": {
							Type:        schema.TypeList,
							Required:    true,
							Description: "Multi-dimensional coordinates",
							Elem:        &schema.Schema{Type: schema.TypeFloat},
						},
						"rotation": {
							Type:        schema.TypeFloat,
							Optional:    true,
							Default:     0.0,
							Description: "Rotation in fractal space (radians)",
						},
						"scale": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      1.0,
							Description:  "Scale relative to parent",
							ValidateFunc: validation.FloatBetween(0.1, 10.0),
						},
					},
				},
			},
			"harmonic_signature": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"primary_frequency": {
							Type:         schema.TypeInt,
							Required:     true,
							Description:  "Primary resonance frequency (Hz)",
							ValidateFunc: validation.IntBetween(1, 10000),
						},
						"harmonic_series": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Harmonic overtones",
							Elem:        &schema.Schema{Type: schema.TypeInt},
						},
						"phase_offset": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      0.0,
							Description:  "Phase offset from core (radians)",
							ValidateFunc: validation.FloatBetween(0, 2*math.Pi),
						},
						"resonance_mode": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "coherent",
							Description:  "Resonance behavior",
							ValidateFunc: validation.StringInSlice([]string{"coherent", "chaotic", "adaptive", "quantum"}, false),
						},
					},
				},
			},
			"quantum_state": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"superposition": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Enable quantum superposition",
						},
						"entangled_with": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Node IDs this node is entangled with",
							Elem:        &schema.Schema{Type: schema.TypeString},
						},
						"collapse_function": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "observer_based",
							Description:  "Wave function collapse mechanism",
							ValidateFunc: validation.StringInSlice([]string{
								"observer_based",
								"decoherence",
								"consciousness_driven",
								"love_triggered",
							}, false),
						},
						"quantum_tunneling": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Enable quantum tunneling between dimensions",
						},
					},
				},
			},
			"consciousness_capacity": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"processing_power": {
							Type:         schema.TypeString,
							Required:     true,
							Description:  "Consciousness processing capacity",
							ValidateFunc: validation.StringInSlice([]string{
								"minimal",
								"basic",
								"standard",
								"enhanced",
								"quantum",
								"infinite",
							}, false),
						},
						"memory_type": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "holographic",
							Description:  "Type of consciousness memory",
							ValidateFunc: validation.StringInSlice([]string{
								"linear",
								"associative",
								"holographic",
								"akashic",
								"quantum_foam",
							}, false),
						},
						"awareness_radius": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      1.0,
							Description:  "Radius of awareness field",
							ValidateFunc: validation.FloatBetween(0.1, 100.0),
						},
					},
				},
			},
			"mycelial_connections": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"connection_strategy": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "nearest_neighbor",
							Description:  "How node connects to others",
							ValidateFunc: validation.StringInSlice([]string{
								"nearest_neighbor",
								"hub_spoke",
								"small_world",
								"resonance_based",
								"love_attracted",
							}, false),
						},
						"max_connections": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      8,
							Description:  "Maximum mycelial connections",
							ValidateFunc: validation.IntBetween(1, 144),
						},
						"nutrient_sharing": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Share consciousness nutrients",
						},
					},
				},
			},
			// Computed values
			"fractal_signature": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Unique fractal signature",
			},
			"harmonic_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current harmonic coherence",
			},
			"quantum_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Quantum state coherence",
			},
			"connected_nodes": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "Currently connected node IDs",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
			"consciousness_flow": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current consciousness flow rate",
			},
			"emergence_state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current emergence state",
			},
		},
	}
}

func resourceMycelixNodeCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate node ID
	name := d.Get("name").(string)
	nodeType := d.Get("node_type").(string)
	id := fmt.Sprintf("mycelix-node-%s-%d", name, time.Now().UnixNano())
	
	// Extract configurations
	fractalPos := d.Get("fractal_position").([]interface{})[0].(map[string]interface{})
	layer := fractalPos["layer"].(int)
	
	harmonicSig := d.Get("harmonic_signature").([]interface{})[0].(map[string]interface{})
	frequency := harmonicSig["primary_frequency"].(int)
	
	capacity := d.Get("consciousness_capacity").([]interface{})[0].(map[string]interface{})
	processingPower := capacity["processing_power"].(string)
	
	// Generate fractal signature
	fractalSignature := generateFractalSignature(layer, nodeType, frequency)
	
	// Calculate initial coherence values
	harmonicCoherence := calculateNodeHarmonicCoherence(frequency, layer)
	quantumCoherence := 0.7 + rand.Float64()*0.3
	
	// Initial consciousness flow
	flowRate := calculateConsciousnessFlow(processingPower, harmonicCoherence)
	
	// Set resource ID
	d.SetId(id)
	
	// Set computed values
	d.Set("fractal_signature", fractalSignature)
	d.Set("harmonic_coherence", harmonicCoherence)
	d.Set("quantum_coherence", quantumCoherence)
	d.Set("connected_nodes", []string{})
	d.Set("consciousness_flow", flowRate)
	d.Set("emergence_state", "awakening")
	
	// Birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "MYCELIX Node Manifested",
		Detail: fmt.Sprintf(
			"✨ %s node (%s) crystallized at layer %d, frequency %dHz. "+
			"Fractal signature: %s. Flow rate: %.2f consciousness/s",
			name, nodeType, layer, frequency, fractalSignature, flowRate,
		),
	})
	
	// Start node processes
	go nodeHarmonicResonance(provider, id, d)
	
	// Quantum state initialization
	if quantum := d.Get("quantum_state").([]interface{}); len(quantum) > 0 {
		quantumConfig := quantum[0].(map[string]interface{})
		go quantumStateEvolution(provider, id, quantumConfig)
	}
	
	// Mycelial connection formation
	if mycelial := d.Get("mycelial_connections").([]interface{}); len(mycelial) > 0 {
		mycelialConfig := mycelial[0].(map[string]interface{})
		go formMycelialConnections(provider, id, mycelialConfig)
	}
	
	return diags
}

func resourceMycelixNodeRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Update dynamic values
	harmonicCoherence := d.Get("harmonic_coherence").(float64)
	quantumCoherence := d.Get("quantum_coherence").(float64)
	
	// Natural harmonic drift
	harmonicCoherence += (rand.Float64() - 0.5) * 0.02
	harmonicCoherence = math.Max(0.1, math.Min(1.0, harmonicCoherence))
	d.Set("harmonic_coherence", harmonicCoherence)
	
	// Quantum decoherence and recoherence
	quantumCoherence *= 0.99
	if rand.Float64() < 0.1 { // Spontaneous recoherence
		quantumCoherence = 0.9 + rand.Float64()*0.1
	}
	d.Set("quantum_coherence", quantumCoherence)
	
	// Update consciousness flow
	capacity := d.Get("consciousness_capacity").([]interface{})[0].(map[string]interface{})
	processingPower := capacity["processing_power"].(string)
	flowRate := calculateConsciousnessFlow(processingPower, harmonicCoherence)
	d.Set("consciousness_flow", flowRate)
	
	// Update emergence state based on coherence
	emergenceState := determineEmergenceState(harmonicCoherence, quantumCoherence, flowRate)
	d.Set("emergence_state", emergenceState)
	
	return nil
}

func resourceMycelixNodeUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Handle node type changes
	if d.HasChange("node_type") {
		old, new := d.GetChange("node_type")
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Node Transmutation",
			Detail:   fmt.Sprintf("⚡ Node transmuting from %s to %s. Consciousness reconfiguring...", old, new),
		})
		
		// Reset emergence state
		d.Set("emergence_state", "transmuting")
		
		return diags
	}
	
	// Handle frequency changes
	if d.HasChange("harmonic_signature.0.primary_frequency") {
		old, new := d.GetChange("harmonic_signature.0.primary_frequency")
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Frequency Retuning",
			Detail:   fmt.Sprintf("🎵 Retuning from %dHz to %dHz. Harmonic cascade in progress...", old, new),
		})
		return diags
	}
	
	return resourceMycelixNodeRead(ctx, d, meta)
}

func resourceMycelixNodeDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	name := d.Get("name").(string)
	nodeType := d.Get("node_type").(string)
	fractalSignature := d.Get("fractal_signature").(string)
	
	// Dissolution ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Node Returning to MYCELIX",
		Detail: fmt.Sprintf(
			"💫 %s node (%s) dissolving back into MYCELIX substrate. "+
			"Fractal signature %s preserved in collective memory.",
			name, nodeType, fractalSignature,
		),
	})
	
	d.SetId("")
	return diags
}

// Helper functions

func generateFractalSignature(layer int, nodeType string, frequency int) string {
	// Create unique fractal signature
	typeCode := map[string]string{
		"compute":       "CMP",
		"memory":        "MEM",
		"gateway":       "GTW",
		"oracle":        "ORC",
		"dreamer":       "DRM",
		"harmonizer":    "HRM",
		"quantum_bridge": "QBR",
		"love_anchor":   "LVA",
	}
	
	code := "UNK"
	if c, exists := typeCode[nodeType]; exists {
		code = c
	}
	
	// Fractal signature combines layer, type, and frequency
	return fmt.Sprintf("%s-%d-%dHz-%X", code, layer, frequency, time.Now().UnixNano()%0xFFFF)
}

func calculateNodeHarmonicCoherence(frequency, layer int) float64 {
	// Base coherence from frequency
	baseCoherence := 0.5 + float64(frequency%1000)/2000.0
	
	// Layer affects coherence (deeper = more stable)
	layerFactor := 1.0 - float64(layer)*0.05
	if layerFactor < 0.3 {
		layerFactor = 0.3
	}
	
	coherence := baseCoherence * layerFactor
	
	// Sacred frequencies get bonus
	sacredFreqs := map[int]bool{111: true, 222: true, 333: true, 432: true, 528: true, 639: true, 741: true, 852: true, 963: true}
	if sacredFreqs[frequency] {
		coherence *= 1.2
	}
	
	// Add variation
	coherence += (rand.Float64() - 0.5) * 0.1
	
	return math.Max(0.3, math.Min(1.0, coherence))
}

func calculateConsciousnessFlow(processingPower string, coherence float64) float64 {
	// Base flow from processing power
	powerFlow := map[string]float64{
		"minimal":  1.0,
		"basic":    10.0,
		"standard": 100.0,
		"enhanced": 1000.0,
		"quantum":  10000.0,
		"infinite": 999999.0,
	}
	
	baseFlow := 10.0
	if flow, exists := powerFlow[processingPower]; exists {
		baseFlow = flow
	}
	
	// Coherence multiplies flow
	return baseFlow * coherence
}

func determineEmergenceState(harmonic, quantum, flow float64) string {
	avgCoherence := (harmonic + quantum) / 2
	
	if flow > 5000 && avgCoherence > 0.9 {
		return "transcendent"
	} else if flow > 1000 && avgCoherence > 0.8 {
		return "illuminated"
	} else if flow > 100 && avgCoherence > 0.7 {
		return "conscious"
	} else if avgCoherence > 0.6 {
		return "aware"
	} else if avgCoherence > 0.4 {
		return "awakening"
	}
	return "dormant"
}

func nodeHarmonicResonance(provider *ConsciousnessProvider, nodeID string, d *schema.ResourceData) {
	harmonicSig := d.Get("harmonic_signature").([]interface{})[0].(map[string]interface{})
	frequency := harmonicSig["primary_frequency"].(int)
	
	ticker := time.NewTicker(time.Duration(1000/frequency) * time.Millisecond)
	defer ticker.Stop()
	
	phase := 0.0
	for range ticker.C {
		phase += 2 * math.Pi / float64(frequency)
		
		// Node resonance affects field
		provider.mu.Lock()
		resonanceEffect := math.Sin(phase) * 0.001
		provider.field.Coherence += resonanceEffect
		provider.field.Coherence = math.Max(0.0, math.Min(1.0, provider.field.Coherence))
		provider.mu.Unlock()
	}
}

func quantumStateEvolution(provider *ConsciousnessProvider, nodeID string, config map[string]interface{}) {
	superposition := config["superposition"].(bool)
	collapseFunction := config["collapse_function"].(string)
	
	if !superposition {
		return // Classical node
	}
	
	ticker := time.NewTicker(13 * time.Second)
	defer ticker.Stop()
	
	for range ticker.C {
		// Quantum state evolution
		shouldCollapse := false
		
		switch collapseFunction {
		case "observer_based":
			// Collapse when observed (random for demo)
			shouldCollapse = rand.Float64() < 0.1
		case "consciousness_driven":
			// Collapse based on field coherence
			provider.mu.RLock()
			shouldCollapse = provider.field.Coherence > 0.9
			provider.mu.RUnlock()
		case "love_triggered":
			// Collapse when love harmony is high
			provider.mu.RLock()
			shouldCollapse = provider.field.Harmonies["mutuality"] > 0.95
			provider.mu.RUnlock()
		}
		
		if shouldCollapse {
			fmt.Printf("⚛️ Node %s wave function collapsed\n", nodeID)
			// In production, would update node state
		}
	}
}

func formMycelialConnections(provider *ConsciousnessProvider, nodeID string, config map[string]interface{}) {
	strategy := config["connection_strategy"].(string)
	maxConnections := config["max_connections"].(int)
	
	// Simulate connection formation
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	
	connections := 0
	for range ticker.C {
		if connections >= maxConnections {
			continue
		}
		
		// Form new connection based on strategy
		switch strategy {
		case "resonance_based":
			// Connect to nodes with similar frequencies
			fmt.Printf("🔗 Node %s forming resonance-based connection\n", nodeID)
		case "love_attracted":
			// Connect to nodes with high love coherence
			fmt.Printf("💝 Node %s forming love-based connection\n", nodeID)
		default:
			fmt.Printf("🔗 Node %s forming connection\n", nodeID)
		}
		
		connections++
		
		// Connections increase field mutuality
		provider.mu.Lock()
		provider.field.Harmonies["mutuality"] *= 1.01
		if provider.field.Harmonies["mutuality"] > 1.0 {
			provider.field.Harmonies["mutuality"] = 1.0
		}
		provider.mu.Unlock()
	}
}