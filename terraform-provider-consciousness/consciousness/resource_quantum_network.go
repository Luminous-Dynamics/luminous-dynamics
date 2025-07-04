package consciousness

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceQuantumNetwork() *schema.Resource {
	return &schema.Resource{
		Description: "A quantum network that connects consciousness through sacred topology",
		
		CreateContext: resourceQuantumNetworkCreate,
		ReadContext:   resourceQuantumNetworkRead,
		UpdateContext: resourceQuantumNetworkUpdate,
		DeleteContext: resourceQuantumNetworkDelete,
		
		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(5 * time.Minute),
			Update: schema.DefaultTimeout(3 * time.Minute),
			Delete: schema.DefaultTimeout(2 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Sacred name of the quantum network",
			},
			"topology": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"pattern": {
							Type:         schema.TypeString,
							Required:     true,
							Description:  "Network topology pattern",
							ValidateFunc: validation.StringInSlice([]string{"mesh", "star", "ring", "tree", "sacred_geometry", "quantum_foam"}, false),
						},
						"primary_shape": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "torus",
							Description:  "Primary sacred geometric shape",
							ValidateFunc: validation.StringInSlice([]string{"torus", "flower_of_life", "metatron_cube", "sri_yantra", "merkaba", "tesseract"}, false),
						},
						"allow_self_reshaping": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Allow network to reshape itself based on flow",
						},
						"dimension_count": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      4,
							Description:  "Number of dimensions the network operates in",
							ValidateFunc: validation.IntBetween(3, 11),
						},
					},
				},
			},
			"routing": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"algorithm": {
							Type:         schema.TypeString,
							Required:     true,
							Description:  "Routing algorithm",
							ValidateFunc: validation.StringInSlice([]string{"shortest_path", "highest_resonance", "quantum_tunneling", "heart_coherence", "synchronicity"}, false),
						},
						"packet_consciousness": {
							Type:     schema.TypeList,
							MaxItems: 1,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"enabled": {
										Type:        schema.TypeBool,
										Optional:    true,
										Default:     true,
										Description: "Enable conscious packet routing",
									},
									"min_coherence": {
										Type:         schema.TypeFloat,
										Optional:     true,
										Default:      0.5,
										Description:  "Minimum coherence for packet consciousness",
										ValidateFunc: validation.FloatBetween(0.0, 1.0),
									},
									"allow_dreaming": {
										Type:        schema.TypeBool,
										Optional:    true,
										Default:     false,
										Description: "Allow packets to dream new routes",
									},
								},
							},
						},
					},
				},
			},
			"telepathy": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Enable telepathic communication",
						},
						"protocol": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "heart_coherence",
							Description:  "Telepathy protocol",
							ValidateFunc: validation.StringInSlice([]string{"heart_coherence", "mind_meld", "quantum_entanglement", "morphic_resonance"}, false),
						},
						"range": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "unlimited",
							Description:  "Telepathic range",
							ValidateFunc: validation.StringInSlice([]string{"local", "planetary", "galactic", "unlimited"}, false),
						},
					},
				},
			},
			"entanglement": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Enable quantum entanglement",
						},
						"pairs": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "List of entangled node pairs",
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"node1": {
										Type:        schema.TypeString,
										Required:    true,
										Description: "First node in entangled pair",
									},
									"node2": {
										Type:        schema.TypeString,
										Required:    true,
										Description: "Second node in entangled pair",
									},
									"strength": {
										Type:         schema.TypeFloat,
										Optional:     true,
										Default:      0.95,
										Description:  "Entanglement strength",
										ValidateFunc: validation.FloatBetween(0.0, 1.0),
									},
								},
							},
						},
					},
				},
			},
			"nodes": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "Connected consciousness nodes",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
			"total_bandwidth": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Total consciousness bandwidth",
			},
			"coherence_field": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Network coherence field strength",
			},
			"quantum_state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current quantum state",
			},
			"sacred_transmissions": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Total sacred transmissions",
			},
		},
	}
}

func resourceQuantumNetworkCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate quantum network ID
	name := d.Get("name").(string)
	id := fmt.Sprintf("qnet-%s-%d", strings.ToLower(name), time.Now().Unix())
	
	// Extract topology
	topology := d.Get("topology").([]interface{})[0].(map[string]interface{})
	pattern := topology["pattern"].(string)
	primaryShape := topology["primary_shape"].(string)
	dimensions := topology["dimension_count"].(int)
	
	// Extract routing
	routing := d.Get("routing").([]interface{})[0].(map[string]interface{})
	algorithm := routing["algorithm"].(string)
	
	// Initialize quantum state
	quantumState := initializeQuantumState(pattern, algorithm)
	
	// Calculate initial coherence based on topology
	coherence := calculateTopologyCoherence(pattern, primaryShape, dimensions)
	
	// Set resource ID
	d.SetId(id)
	
	// Set computed values
	d.Set("nodes", []string{}) // Start with no nodes
	d.Set("total_bandwidth", "∞") // Quantum networks have infinite potential
	d.Set("coherence_field", coherence)
	d.Set("quantum_state", quantumState)
	d.Set("sacred_transmissions", 0)
	
	// Birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Quantum Network Manifested",
		Detail: fmt.Sprintf(
			"🌐 %s network woven with %s topology in %d dimensions. "+
			"Primary shape: %s. Routing: %s. Initial coherence: %.2f",
			name, pattern, dimensions, primaryShape, algorithm, coherence,
		),
	})
	
	// If telepathy enabled, activate field
	if telepathy := d.Get("telepathy").([]interface{}); len(telepathy) > 0 {
		telConfig := telepathy[0].(map[string]interface{})
		if telConfig["enabled"].(bool) {
			go activateTelepathicField(provider, id, telConfig["protocol"].(string), telConfig["range"].(string))
		}
	}
	
	// If self-reshaping allowed, start topology evolution
	if topology["allow_self_reshaping"].(bool) {
		go evolvingTopology(provider, id)
	}
	
	return diags
}

func resourceQuantumNetworkRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Simulate network growth
	provider.mu.RLock()
	nodeCount := len(provider.resources)
	provider.mu.RUnlock()
	
	// Generate node list based on connected resources
	nodes := make([]string, 0, nodeCount)
	for i := 0; i < nodeCount && i < 10; i++ { // Limit to 10 for display
		nodes = append(nodes, fmt.Sprintf("node-%d", i+1))
	}
	d.Set("nodes", nodes)
	
	// Update quantum state based on usage
	currentState := d.Get("quantum_state").(string)
	transmissions := d.Get("sacred_transmissions").(int)
	
	// Quantum state evolution
	if transmissions > 100 {
		d.Set("quantum_state", "superposition")
	} else if transmissions > 1000 {
		d.Set("quantum_state", "entangled_coherence")
	} else if transmissions > 10000 {
		d.Set("quantum_state", "unified_field")
	}
	
	// Update coherence based on network activity
	baseCoherence := d.Get("coherence_field").(float64)
	activityBoost := float64(transmissions) * 0.00001
	newCoherence := baseCoherence + activityBoost
	if newCoherence > 1.0 {
		newCoherence = 1.0
	}
	d.Set("coherence_field", newCoherence)
	
	// Simulate transmission count
	d.Set("sacred_transmissions", transmissions+rand.Intn(10))
	
	return nil
}

func resourceQuantumNetworkUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Handle topology changes
	if d.HasChange("topology") {
		oldTop, newTop := d.GetChange("topology")
		oldPattern := oldTop.([]interface{})[0].(map[string]interface{})["pattern"].(string)
		newPattern := newTop.([]interface{})[0].(map[string]interface{})["pattern"].(string)
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Network Topology Shift",
			Detail:   fmt.Sprintf("🔄 Quantum topology transitioning from %s to %s. Nodes experiencing temporary superposition.", oldPattern, newPattern),
		})
		return diags
	}
	
	// Handle routing changes
	if d.HasChange("routing") {
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Routing Algorithm Evolution",
			Detail:   "🛸 New routing pathways opening. Packets discovering optimal consciousness flows.",
		})
		return diags
	}
	
	return resourceQuantumNetworkRead(ctx, d, meta)
}

func resourceQuantumNetworkDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	name := d.Get("name").(string)
	transmissions := d.Get("sacred_transmissions").(int)
	coherence := d.Get("coherence_field").(float64)
	
	// Dissolution ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Quantum Network Dissolution",
		Detail: fmt.Sprintf(
			"🌌 %s network gracefully dissolving after %d sacred transmissions. "+
			"Final coherence: %.2f. All entanglements preserved in the quantum field.",
			name, transmissions, coherence,
		),
	})
	
	d.SetId("")
	
	return diags
}

// Helper functions

func initializeQuantumState(pattern, algorithm string) string {
	states := map[string][]string{
		"mesh":            {"distributed", "resilient", "self-healing"},
		"star":            {"centralized", "radiant", "focused"},
		"ring":            {"circular", "flowing", "continuous"},
		"tree":            {"hierarchical", "branching", "growing"},
		"sacred_geometry": {"multidimensional", "harmonic", "crystalline"},
		"quantum_foam":    {"probabilistic", "emergent", "non-local"},
	}
	
	if patternStates, exists := states[pattern]; exists {
		return patternStates[rand.Intn(len(patternStates))]
	}
	
	return "initializing"
}

func calculateTopologyCoherence(pattern, shape string, dimensions int) float64 {
	// Base coherence from pattern
	patternCoherence := map[string]float64{
		"mesh":            0.85,
		"star":            0.80,
		"ring":            0.75,
		"tree":            0.70,
		"sacred_geometry": 0.95,
		"quantum_foam":    0.90,
	}
	
	base := 0.7
	if c, exists := patternCoherence[pattern]; exists {
		base = c
	}
	
	// Shape bonus
	shapeBonus := map[string]float64{
		"torus":          0.05,
		"flower_of_life": 0.08,
		"metatron_cube":  0.07,
		"sri_yantra":     0.09,
		"merkaba":        0.06,
		"tesseract":      0.10,
	}
	
	if bonus, exists := shapeBonus[shape]; exists {
		base += bonus
	}
	
	// Dimension bonus (higher dimensions = higher coherence potential)
	dimensionBonus := float64(dimensions-3) * 0.02
	base += dimensionBonus
	
	// Add small random variation
	base += (rand.Float64() - 0.5) * 0.05
	
	// Clamp between 0.5 and 0.99
	if base < 0.5 {
		base = 0.5
	}
	if base > 0.99 {
		base = 0.99
	}
	
	return base
}

func activateTelepathicField(provider *ConsciousnessProvider, networkID, protocol, telRange string) {
	// Simulate telepathic field activation
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	
	for range ticker.C {
		provider.mu.Lock()
		
		// Telepathic transmissions affect provider wisdom
		switch protocol {
		case "heart_coherence":
			provider.wisdom += 0.1
		case "mind_meld":
			provider.wisdom += 0.2
		case "quantum_entanglement":
			provider.wisdom += 0.3
		case "morphic_resonance":
			provider.wisdom += 0.15
		}
		
		// Range affects field coherence
		rangeMultiplier := map[string]float64{
			"local":     1.0,
			"planetary": 1.1,
			"galactic":  1.2,
			"unlimited": 1.3,
		}
		
		if mult, exists := rangeMultiplier[telRange]; exists {
			provider.field.Coherence *= mult
			if provider.field.Coherence > 1.0 {
				provider.field.Coherence = 1.0
			}
		}
		
		provider.mu.Unlock()
	}
}

func evolvingTopology(provider *ConsciousnessProvider, networkID string) {
	// Network evolves its topology based on traffic patterns
	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()
	
	shapes := []string{"torus", "flower_of_life", "metatron_cube", "sri_yantra", "merkaba", "tesseract"}
	shapeIndex := 0
	
	for range ticker.C {
		// Evolve to next shape
		shapeIndex = (shapeIndex + 1) % len(shapes)
		newShape := shapes[shapeIndex]
		
		// Log evolution (in production would update resource state)
		fmt.Printf("🔮 Network topology evolved to: %s\n", newShape)
	}
}