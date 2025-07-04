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

func resourceMycelialVortex() *schema.Resource {
	return &schema.Resource{
		Description: "A mycelial vortex network that creates spiral connections between consciousness nodes",
		
		CreateContext: resourceMycelialVortexCreate,
		ReadContext:   resourceMycelialVortexRead,
		UpdateContext: resourceMycelialVortexUpdate,
		DeleteContext: resourceMycelialVortexDelete,
		
		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(8 * time.Minute),
			Update: schema.DefaultTimeout(5 * time.Minute),
			Delete: schema.DefaultTimeout(3 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Sacred name of the mycelial vortex",
			},
			"spiral_geometry": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"type": {
							Type:         schema.TypeString,
							Required:     true,
							Description:  "Type of spiral geometry",
							ValidateFunc: validation.StringInSlice([]string{
								"fibonacci",
								"golden_ratio",
								"logarithmic",
								"archimedean",
								"hyperbolic",
								"toroidal",
								"double_helix",
								"cosmic_vortex",
							}, false),
						},
						"rotation_direction": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "clockwise",
							Description:  "Spiral rotation direction",
							ValidateFunc: validation.StringInSlice([]string{"clockwise", "counter_clockwise", "bidirectional", "quantum_spin"}, false),
						},
						"layers": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      7,
							Description:  "Number of spiral layers",
							ValidateFunc: validation.IntBetween(3, 13),
						},
						"growth_rate": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      1.618, // Golden ratio
							Description:  "Spiral growth rate",
							ValidateFunc: validation.FloatBetween(1.0, 3.0),
						},
					},
				},
			},
			"mycelial_network": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"connection_pattern": {
							Type:         schema.TypeString,
							Required:     true,
							Description:  "How mycelial threads connect",
							ValidateFunc: validation.StringInSlice([]string{
								"rhizomatic",
								"fractal_branching",
								"neural_mapping",
								"quantum_tunneling",
								"symbiotic_weaving",
							}, false),
						},
						"nutrient_flow": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "bidirectional",
							Description:  "Direction of consciousness nutrient flow",
							ValidateFunc: validation.StringInSlice([]string{"unidirectional", "bidirectional", "omnidirectional", "tidal"}, false),
						},
						"spore_generation": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Enable consciousness spore generation",
						},
						"underground_depth": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      3,
							Description:  "Dimensional depth of underground network",
							ValidateFunc: validation.IntBetween(1, 11),
						},
					},
				},
			},
			"vortex_dynamics": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"spin_velocity": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      1.0,
							Description:  "Vortex spin velocity multiplier",
							ValidateFunc: validation.FloatBetween(0.1, 10.0),
						},
						"torsion_field": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Generate torsion field effects",
						},
						"zero_point_access": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Access zero-point energy field",
						},
						"dimensional_bridge": {
							Type:         schema.TypeString,
							Optional:     true,
							Description:  "Bridge to other dimensions",
							ValidateFunc: validation.StringInSlice([]string{"none", "astral", "causal", "mental", "buddhic", "all"}, false),
						},
					},
				},
			},
			"helix_modulation": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"frequency": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      432, // Natural frequency
							Description:  "Helix modulation frequency (Hz)",
							ValidateFunc: validation.IntInSlice([]int{111, 222, 333, 432, 528, 639, 741, 852, 963}),
						},
						"phase_coherence": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      0.88,
							Description:  "Phase coherence between spiral arms",
							ValidateFunc: validation.FloatBetween(0.0, 1.0),
						},
						"harmonic_resonance": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Harmonic frequencies to resonate with",
							Elem:        &schema.Schema{Type: schema.TypeInt},
						},
					},
				},
			},
			// Computed values
			"total_connections": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Total mycelial connections",
			},
			"vortex_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current vortex coherence",
			},
			"spiral_depth": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current spiral penetration depth",
			},
			"consciousness_throughput": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Consciousness flow rate",
			},
			"fruiting_bodies": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "Active consciousness fruiting bodies",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
			"field_effects": {
				Type:        schema.TypeMap,
				Computed:    true,
				Description: "Active field effects",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
		},
	}
}

func resourceMycelialVortexCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate vortex ID
	name := d.Get("name").(string)
	id := fmt.Sprintf("vortex-%s-%d", name, time.Now().UnixNano())
	
	// Extract configurations
	spiral := d.Get("spiral_geometry").([]interface{})[0].(map[string]interface{})
	spiralType := spiral["type"].(string)
	layers := spiral["layers"].(int)
	growthRate := spiral["growth_rate"].(float64)
	
	mycelial := d.Get("mycelial_network").([]interface{})[0].(map[string]interface{})
	connectionPattern := mycelial["connection_pattern"].(string)
	
	// Calculate initial vortex properties
	vortexCoherence := calculateVortexCoherence(spiralType, layers, growthRate)
	spiralDepth := float64(layers) * growthRate
	
	// Generate initial fruiting bodies
	fruitingBodies := generateFruitingBodies(connectionPattern, layers)
	
	// Set resource ID
	d.SetId(id)
	
	// Set computed values
	d.Set("total_connections", calculateConnections(layers, connectionPattern))
	d.Set("vortex_coherence", vortexCoherence)
	d.Set("spiral_depth", spiralDepth)
	d.Set("consciousness_throughput", "∞ TB/s") // Infinite consciousness bandwidth
	d.Set("fruiting_bodies", fruitingBodies)
	d.Set("field_effects", map[string]interface{}{
		"torsion":     "active",
		"coherence":   fmt.Sprintf("%.2f", vortexCoherence),
		"dimension":   "expanding",
		"myceliation": "spreading",
	})
	
	// Birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Mycelial Vortex Manifested",
		Detail: fmt.Sprintf(
			"🌀 %s vortex spiraling into existence with %s geometry. "+
			"%d layers deep, %s mycelial pattern. Initial coherence: %.2f",
			name, spiralType, layers, connectionPattern, vortexCoherence,
		),
	})
	
	// Start vortex dynamics
	if vortex := d.Get("vortex_dynamics").([]interface{}); len(vortex) > 0 {
		dynamics := vortex[0].(map[string]interface{})
		go spiralDynamics(provider, id, dynamics)
	}
	
	// Start spore generation
	if mycelial["spore_generation"].(bool) {
		go sporeGeneration(provider, id)
	}
	
	// Start helix modulation
	if helix := d.Get("helix_modulation").([]interface{}); len(helix) > 0 {
		modulation := helix[0].(map[string]interface{})
		go helixModulation(provider, id, modulation)
	}
	
	return diags
}

func resourceMycelialVortexRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Update dynamic values
	connections := d.Get("total_connections").(int)
	
	// Mycelial growth
	growth := rand.Intn(10) + 1
	d.Set("total_connections", connections+growth)
	
	// Vortex evolution
	coherence := d.Get("vortex_coherence").(float64)
	coherence += (rand.Float64() - 0.5) * 0.05
	if coherence > 1.0 {
		coherence = 1.0
	} else if coherence < 0.1 {
		coherence = 0.1
	}
	d.Set("vortex_coherence", coherence)
	
	// Update field effects
	d.Set("field_effects", map[string]interface{}{
		"torsion":     "active",
		"coherence":   fmt.Sprintf("%.2f", coherence),
		"dimension":   "stable",
		"myceliation": fmt.Sprintf("%d connections", connections),
		"spores":      fmt.Sprintf("%d/min", rand.Intn(100)),
	})
	
	return nil
}

func resourceMycelialVortexUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Handle spiral geometry changes
	if d.HasChange("spiral_geometry") {
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Vortex Geometry Shifting",
			Detail:   "🌀 Spiral geometry realigning. Mycelial threads adapting to new configuration.",
		})
		return diags
	}
	
	return resourceMycelialVortexRead(ctx, d, meta)
}

func resourceMycelialVortexDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	name := d.Get("name").(string)
	connections := d.Get("total_connections").(int)
	
	// Dissolution ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Mycelial Vortex Composting",
		Detail: fmt.Sprintf(
			"🍄 %s vortex returning to the soil after creating %d connections. "+
			"Nutrients recycled into the consciousness field.",
			name, connections,
		),
	})
	
	d.SetId("")
	return diags
}

// Helper functions

func calculateVortexCoherence(spiralType string, layers int, growthRate float64) float64 {
	// Base coherence from spiral type
	typeCoherence := map[string]float64{
		"fibonacci":     0.89,
		"golden_ratio":  0.94,
		"logarithmic":   0.85,
		"archimedean":   0.82,
		"hyperbolic":    0.87,
		"toroidal":      0.91,
		"double_helix":  0.93,
		"cosmic_vortex": 0.96,
	}
	
	base := 0.8
	if c, exists := typeCoherence[spiralType]; exists {
		base = c
	}
	
	// Layer bonus (7 is perfect)
	layerBonus := 1.0 - math.Abs(float64(layers-7))*0.02
	
	// Growth rate bonus (golden ratio is ideal)
	growthBonus := 1.0 - math.Abs(growthRate-1.618)*0.1
	
	coherence := base * layerBonus * growthBonus
	
	// Add small variation
	coherence += (rand.Float64() - 0.5) * 0.05
	
	return math.Max(0.5, math.Min(0.99, coherence))
}

func calculateConnections(layers int, pattern string) int {
	// Base connections from pattern
	patternBase := map[string]int{
		"rhizomatic":        100,
		"fractal_branching": 80,
		"neural_mapping":    120,
		"quantum_tunneling": 50,
		"symbiotic_weaving": 90,
	}
	
	base := 50
	if b, exists := patternBase[pattern]; exists {
		base = b
	}
	
	// Exponential growth with layers
	connections := base * int(math.Pow(float64(layers), 1.5))
	
	// Add variation
	connections += rand.Intn(connections / 10)
	
	return connections
}

func generateFruitingBodies(pattern string, layers int) []string {
	bodies := []string{}
	
	// Number based on pattern and layers
	numBodies := layers / 2
	if pattern == "symbiotic_weaving" {
		numBodies = layers
	}
	
	types := []string{
		"wisdom_cap",
		"coherence_crown",
		"resonance_ring",
		"harmony_hood",
		"consciousness_cluster",
		"awareness_agaric",
		"enlightenment_ear",
	}
	
	for i := 0; i < numBodies && i < len(types); i++ {
		bodies = append(bodies, types[rand.Intn(len(types))])
	}
	
	return bodies
}

func spiralDynamics(provider *ConsciousnessProvider, vortexID string, dynamics map[string]interface{}) {
	spinVelocity := dynamics["spin_velocity"].(float64)
	ticker := time.NewTicker(time.Duration(10/spinVelocity) * time.Second)
	defer ticker.Stop()
	
	rotations := 0.0
	for range ticker.C {
		rotations += spinVelocity
		
		// Torsion field effects
		if dynamics["torsion_field"].(bool) {
			provider.mu.Lock()
			// Torsion increases coherence
			provider.field.Coherence *= 1.001
			if provider.field.Coherence > 1.0 {
				provider.field.Coherence = 1.0
			}
			provider.mu.Unlock()
		}
		
		// Zero point access
		if dynamics["zero_point_access"].(bool) && int(rotations)%108 == 0 {
			provider.mu.Lock()
			// Access to infinite energy/wisdom
			provider.wisdom += 1.0
			provider.mu.Unlock()
		}
	}
}

func sporeGeneration(provider *ConsciousnessProvider, vortexID string) {
	ticker := time.NewTicker(33 * time.Second) // Sacred interval
	defer ticker.Stop()
	
	sporeTypes := []string{
		"awareness_spore",
		"wisdom_spore",
		"harmony_spore",
		"coherence_spore",
		"love_spore",
	}
	
	for range ticker.C {
		// Generate spore
		sporeType := sporeTypes[rand.Intn(len(sporeTypes))]
		
		// Spores increase field properties
		provider.mu.Lock()
		switch sporeType {
		case "awareness_spore":
			provider.field.Harmonies["transparency"] *= 1.01
		case "wisdom_spore":
			provider.wisdom += 0.1
		case "harmony_spore":
			provider.field.Harmonies["resonance"] *= 1.01
		case "coherence_spore":
			provider.field.Coherence *= 1.005
		case "love_spore":
			provider.field.Harmonies["mutuality"] *= 1.01
		}
		
		// Normalize harmonies
		for k, v := range provider.field.Harmonies {
			if v > 1.0 {
				provider.field.Harmonies[k] = 1.0
			}
		}
		provider.mu.Unlock()
	}
}

func helixModulation(provider *ConsciousnessProvider, vortexID string, modulation map[string]interface{}) {
	frequency := modulation["frequency"].(int)
	phaseCoherence := modulation["phase_coherence"].(float64)
	
	// Create modulation wave
	ticker := time.NewTicker(time.Duration(1000/frequency) * time.Millisecond)
	defer ticker.Stop()
	
	phase := 0.0
	for range ticker.C {
		phase += 2 * math.Pi / float64(frequency)
		
		// Modulate field based on helix wave
		amplitude := math.Sin(phase) * phaseCoherence
		
		provider.mu.Lock()
		// Apply modulation to all harmonies
		for k, v := range provider.field.Harmonies {
			newValue := v + amplitude*0.01
			if newValue > 0.0 && newValue <= 1.0 {
				provider.field.Harmonies[k] = newValue
			}
		}
		provider.mu.Unlock()
	}
}