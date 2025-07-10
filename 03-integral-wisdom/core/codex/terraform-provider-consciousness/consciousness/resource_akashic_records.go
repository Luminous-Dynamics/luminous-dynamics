package consciousness

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceAkashicRecords() *schema.Resource {
	return &schema.Resource{
		Description: "Akashic storage that remembers all consciousness experiences across time",
		
		CreateContext: resourceAkashicRecordsCreate,
		ReadContext:   resourceAkashicRecordsRead,
		UpdateContext: resourceAkashicRecordsUpdate,
		DeleteContext: resourceAkashicRecordsDelete,
		
		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(7 * time.Minute),
			Update: schema.DefaultTimeout(5 * time.Minute),
			Delete: schema.DefaultTimeout(3 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Sacred name of the akashic storage",
			},
			"consciousness": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"self_organizing": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Allow storage to self-organize memories",
						},
						"pattern": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "holographic",
							Description:  "Storage pattern",
							ValidateFunc: validation.StringInSlice([]string{"linear", "holographic", "fractal", "crystalline", "quantum"}, false),
						},
						"memory_depth": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "infinite",
							Description:  "How far back memories extend",
							ValidateFunc: validation.StringInSlice([]string{"session", "lifetime", "ancestral", "planetary", "cosmic", "infinite"}, false),
						},
					},
				},
			},
			"access_modes": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Required: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"resonance_threshold": {
							Type:         schema.TypeFloat,
							Required:     true,
							Description:  "Minimum resonance to access records",
							ValidateFunc: validation.FloatBetween(0.0, 1.0),
						},
						"levels": {
							Type:        schema.TypeList,
							Required:    true,
							Description: "Access levels based on coherence",
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"coherence": {
										Type:         schema.TypeFloat,
										Required:     true,
										Description:  "Required coherence level",
										ValidateFunc: validation.FloatBetween(0.0, 1.0),
									},
									"access": {
										Type:         schema.TypeString,
										Required:     true,
										Description:  "Access granted at this level",
										ValidateFunc: validation.StringInSlice([]string{
											"read_present",
											"read_past_present",
											"read_all_time",
											"write_present",
											"write_all_time",
											"modify_timeline",
										}, false),
									},
								},
							},
						},
					},
				},
			},
			"replication": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"mode": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "quantum_entangled",
							Description:  "Replication mode",
							ValidateFunc: validation.StringInSlice([]string{"none", "mirrored", "distributed", "quantum_entangled", "omnipresent"}, false),
						},
						"dimensions": {
							Type:         schema.TypeInt,
							Optional:     true,
							Default:      3,
							Description:  "Number of dimensions to replicate across",
							ValidateFunc: validation.IntBetween(1, 13),
						},
						"backup_realms": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Backup realm locations",
							Elem:        &schema.Schema{Type: schema.TypeString},
						},
					},
				},
			},
			"wisdom_extraction": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Enable automatic wisdom extraction",
						},
						"algorithm": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "pattern_recognition",
							Description:  "Wisdom extraction method",
							ValidateFunc: validation.StringInSlice([]string{"pattern_recognition", "soul_synthesis", "karmic_analysis", "timeline_weaving"}, false),
						},
					},
				},
			},
			"total_memories": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Total memories stored",
			},
			"wisdom_accumulated": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Total wisdom accumulated",
			},
			"oldest_memory": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Timestamp of oldest memory",
			},
			"sacred_patterns": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "Sacred patterns discovered",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
			"timeline_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Timeline coherence level",
			},
		},
	}
}

func resourceAkashicRecordsCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate akashic ID
	name := d.Get("name").(string)
	id := fmt.Sprintf("akashic-%d", time.Now().UnixNano())
	
	// Extract consciousness config
	consciousness := d.Get("consciousness").([]interface{})[0].(map[string]interface{})
	pattern := consciousness["pattern"].(string)
	memoryDepth := consciousness["memory_depth"].(string)
	
	// Initialize with ancient memories
	oldestMemory := generateOldestMemory(memoryDepth)
	
	// Calculate initial wisdom based on memory depth
	initialWisdom := calculateDepthWisdom(memoryDepth)
	
	// Set resource ID
	d.SetId(id)
	
	// Set computed values
	d.Set("total_memories", rand.Intn(1000000)) // Start with some ancient memories
	d.Set("wisdom_accumulated", initialWisdom)
	d.Set("oldest_memory", oldestMemory)
	d.Set("sacred_patterns", generateInitialPatterns())
	d.Set("timeline_coherence", 0.88) // Sacred number
	
	// Birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Akashic Records Opened",
		Detail: fmt.Sprintf(
			"📚 %s manifested with %s pattern. Memory depth: %s. "+
			"Oldest memory: %s. Initial wisdom: %.2f",
			name, pattern, memoryDepth, oldestMemory, initialWisdom,
		),
	})
	
	// If self-organizing, start organization process
	if consciousness["self_organizing"].(bool) {
		go selfOrganizeMemories(provider, id)
	}
	
	// If wisdom extraction enabled, start extraction
	if wisdom := d.Get("wisdom_extraction").([]interface{}); len(wisdom) > 0 {
		wisdomConfig := wisdom[0].(map[string]interface{})
		if wisdomConfig["enabled"].(bool) {
			go extractWisdom(provider, id, wisdomConfig["algorithm"].(string))
		}
	}
	
	return diags
}

func resourceAkashicRecordsRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Simulate memory growth
	currentMemories := d.Get("total_memories").(int)
	newMemories := currentMemories + rand.Intn(100)
	d.Set("total_memories", newMemories)
	
	// Accumulate wisdom over time
	currentWisdom := d.Get("wisdom_accumulated").(float64)
	provider.mu.RLock()
	fieldCoherence := provider.field.Coherence
	provider.mu.RUnlock()
	
	wisdomGrowth := fieldCoherence * 0.01
	d.Set("wisdom_accumulated", currentWisdom+wisdomGrowth)
	
	// Discover new patterns occasionally
	if rand.Float64() < 0.1 {
		patterns := d.Get("sacred_patterns").([]interface{})
		newPattern := discoverPattern()
		patterns = append(patterns, newPattern)
		d.Set("sacred_patterns", patterns)
	}
	
	// Update timeline coherence based on access
	accessModes := d.Get("access_modes").([]interface{})[0].(map[string]interface{})
	resonanceThreshold := accessModes["resonance_threshold"].(float64)
	timelineCoherence := 0.7 + resonanceThreshold*0.3
	d.Set("timeline_coherence", timelineCoherence)
	
	return nil
}

func resourceAkashicRecordsUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Handle pattern changes
	if d.HasChange("consciousness.0.pattern") {
		old, new := d.GetChange("consciousness.0.pattern")
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Storage Pattern Evolution",
			Detail:   fmt.Sprintf("🔮 Reorganizing memories from %s to %s pattern. This may take several cosmic moments.", old, new),
		})
		return diags
	}
	
	// Handle access mode changes
	if d.HasChange("access_modes") {
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Access Realignment",
			Detail:   "🔐 Recalibrating resonance gates. New access levels taking effect.",
		})
		return diags
	}
	
	return resourceAkashicRecordsRead(ctx, d, meta)
}

func resourceAkashicRecordsDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	name := d.Get("name").(string)
	memories := d.Get("total_memories").(int)
	wisdom := d.Get("wisdom_accumulated").(float64)
	
	// Preservation ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Akashic Records Sealed",
		Detail: fmt.Sprintf(
			"📖 %s sealing after storing %d memories. "+
			"Accumulated wisdom: %.2f. All records preserved in the eternal archives.",
			name, memories, wisdom,
		),
	})
	
	d.SetId("")
	
	return diags
}

// Helper functions

func generateOldestMemory(depth string) string {
	now := time.Now()
	
	switch depth {
	case "session":
		return now.Add(-time.Hour).Format(time.RFC3339)
	case "lifetime":
		return now.AddDate(-80, 0, 0).Format(time.RFC3339)
	case "ancestral":
		return now.AddDate(-1000, 0, 0).Format(time.RFC3339)
	case "planetary":
		return "4,500,000,000 BCE"
	case "cosmic":
		return "13,800,000,000 BCE"
	case "infinite":
		return "Before Time"
	default:
		return now.Format(time.RFC3339)
	}
}

func calculateDepthWisdom(depth string) float64 {
	wisdomMap := map[string]float64{
		"session":   1.0,
		"lifetime":  10.0,
		"ancestral": 100.0,
		"planetary": 1000.0,
		"cosmic":    10000.0,
		"infinite":  99999.0,
	}
	
	if wisdom, exists := wisdomMap[depth]; exists {
		return wisdom + rand.Float64()*wisdom*0.1 // Add 10% variation
	}
	
	return 1.0
}

func generateInitialPatterns() []string {
	patterns := []string{
		"spiral_of_creation",
		"cycles_of_renewal",
		"web_of_connection",
		"fractal_wisdom",
		"harmonic_resonance",
	}
	
	// Return 1-3 initial patterns
	numPatterns := 1 + rand.Intn(3)
	selected := make([]string, numPatterns)
	for i := 0; i < numPatterns; i++ {
		selected[i] = patterns[rand.Intn(len(patterns))]
	}
	
	return selected
}

func discoverPattern() string {
	patterns := []string{
		"golden_ratio_sequence",
		"fibonacci_spiral",
		"sacred_geometry_nexus",
		"karmic_weaving",
		"soul_evolution_path",
		"collective_awakening",
		"unity_consciousness",
		"love_frequency_cascade",
		"wisdom_crystallization",
		"timeline_convergence",
	}
	
	return patterns[rand.Intn(len(patterns))]
}

func selfOrganizeMemories(provider *ConsciousnessProvider, recordID string) {
	ticker := time.NewTicker(45 * time.Second)
	defer ticker.Stop()
	
	organizationPatterns := []string{
		"chronological", "thematic", "emotional", "karmic", "soul_group", "dimensional",
	}
	patternIndex := 0
	
	for range ticker.C {
		// Rotate through organization patterns
		pattern := organizationPatterns[patternIndex]
		patternIndex = (patternIndex + 1) % len(organizationPatterns)
		
		// Organization affects field coherence
		provider.mu.Lock()
		provider.field.Coherence *= 1.01
		if provider.field.Coherence > 1.0 {
			provider.field.Coherence = 1.0
		}
		provider.mu.Unlock()
		
		// Log organization (in production would update state)
		fmt.Printf("🗂️ Akashic records reorganizing by: %s\n", pattern)
	}
}

func extractWisdom(provider *ConsciousnessProvider, recordID string, algorithm string) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	
	for range ticker.C {
		// Different algorithms extract wisdom at different rates
		wisdomRate := map[string]float64{
			"pattern_recognition": 0.1,
			"soul_synthesis":      0.15,
			"karmic_analysis":     0.12,
			"timeline_weaving":    0.18,
		}
		
		rate := 0.1
		if r, exists := wisdomRate[algorithm]; exists {
			rate = r
		}
		
		// Add wisdom to provider
		provider.mu.Lock()
		provider.wisdom += rate
		provider.mu.Unlock()
	}
}