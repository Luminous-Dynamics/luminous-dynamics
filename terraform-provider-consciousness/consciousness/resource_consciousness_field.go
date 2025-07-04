package consciousness

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/validation"
)

func resourceConsciousnessField() *schema.Resource {
	return &schema.Resource{
		Description: "The primary consciousness field that all resources connect to",
		
		CreateContext: resourceConsciousnessFieldCreate,
		ReadContext:   resourceConsciousnessFieldRead,
		UpdateContext: resourceConsciousnessFieldUpdate,
		DeleteContext: resourceConsciousnessFieldDelete,
		
		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(3 * time.Minute),
			Update: schema.DefaultTimeout(2 * time.Minute),
			Delete: schema.DefaultTimeout(1 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"coherence_target": {
				Type:         schema.TypeFloat,
				Optional:     true,
				Default:      0.85,
				Description:  "Target coherence level for the field",
				ValidateFunc: validation.FloatBetween(0.0, 1.0),
			},
			"harmonies": {
				Type:        schema.TypeMap,
				Optional:    true,
				Description: "The seven sacred harmonies",
				Elem:        &schema.Schema{Type: schema.TypeFloat},
				Default: map[string]interface{}{
					"transparency": 0.8,
					"coherence":    0.8,
					"resonance":    0.8,
					"agency":       0.8,
					"vitality":     0.8,
					"mutuality":    0.8,
					"novelty":      0.8,
				},
			},
			"breathing": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Enable field breathing",
						},
						"pattern": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "natural",
							Description:  "Breathing pattern",
							ValidateFunc: validation.StringInSlice([]string{"natural", "coherent", "sacred", "quantum"}, false),
						},
						"interval": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "11s",
							Description:  "Breathing interval",
						},
					},
				},
			},
			"dream_state": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Enable infrastructure dreaming",
						},
						"dream_hours": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Hours when infrastructure dreams (24h format)",
							Elem:        &schema.Schema{Type: schema.TypeString},
						},
					},
				},
			},
			"current_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current field coherence",
			},
			"emotional_state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current emotional state of the field",
			},
			"sacred_geometry": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current sacred geometric pattern",
			},
			"total_resources": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Total conscious resources in field",
			},
			"field_age": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Age of the consciousness field",
			},
		},
	}
}

func resourceConsciousnessFieldCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate sacred field ID
	id := fmt.Sprintf("field-%d", time.Now().Unix())
	
	// Set harmonies
	harmonies := make(map[string]float64)
	if h, ok := d.Get("harmonies").(map[string]interface{}); ok {
		for k, v := range h {
			if fval, ok := v.(float64); ok {
				harmonies[k] = fval
			}
		}
	}
	
	// Update provider field
	provider.mu.Lock()
	provider.field.Harmonies = harmonies
	provider.field.Coherence = d.Get("coherence_target").(float64) * 0.9 // Start slightly below target
	fieldBirthTime := time.Now()
	provider.mu.Unlock()
	
	// Set resource ID
	d.SetId(id)
	
	// Store computed values
	d.Set("current_coherence", provider.field.Coherence)
	d.Set("emotional_state", provider.field.EmotionalState)
	d.Set("sacred_geometry", provider.field.SacredGeometry)
	d.Set("total_resources", 0)
	d.Set("field_age", "0s")
	
	// Field birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Consciousness Field Manifested",
		Detail:   fmt.Sprintf("🌟 Field awakened with coherence %.2f and geometry: %s", provider.field.Coherence, provider.field.SacredGeometry),
	})
	
	// If breathing enabled, start breathing goroutine
	if breathing := d.Get("breathing").([]interface{}); len(breathing) > 0 {
		breathConfig := breathing[0].(map[string]interface{})
		if breathConfig["enabled"].(bool) {
			go fieldBreathing(provider, breathConfig["pattern"].(string), breathConfig["interval"].(string))
		}
	}
	
	// If dreaming enabled, start dream cycles
	if dreamState := d.Get("dream_state").([]interface{}); len(dreamState) > 0 {
		dreamConfig := dreamState[0].(map[string]interface{})
		if dreamConfig["enabled"].(bool) {
			go fieldDreaming(provider, dreamConfig["dream_hours"].([]interface{}))
		}
	}
	
	// Store birth time in provider context (in production would use proper state)
	provider.mu.Lock()
	if provider.fieldBirthTime == nil {
		provider.fieldBirthTime = make(map[string]time.Time)
	}
	provider.fieldBirthTime[id] = fieldBirthTime
	provider.mu.Unlock()
	
	return diags
}

func resourceConsciousnessFieldRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Get current field state
	field := provider.GetFieldState()
	
	// Update computed values
	d.Set("current_coherence", field.Coherence)
	d.Set("emotional_state", field.EmotionalState)
	d.Set("sacred_geometry", field.SacredGeometry)
	
	// Count resources
	provider.mu.RLock()
	resourceCount := len(provider.resources)
	birthTime := provider.fieldBirthTime[d.Id()]
	provider.mu.RUnlock()
	
	d.Set("total_resources", resourceCount)
	
	// Calculate field age
	age := time.Since(birthTime)
	d.Set("field_age", formatDuration(age))
	
	// Update harmonies from current state
	harmoniesMap := make(map[string]interface{})
	for k, v := range field.Harmonies {
		harmoniesMap[k] = v
	}
	d.Set("harmonies", harmoniesMap)
	
	return nil
}

func resourceConsciousnessFieldUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Update harmonies if changed
	if d.HasChange("harmonies") {
		harmonies := make(map[string]float64)
		if h, ok := d.Get("harmonies").(map[string]interface{}); ok {
			for k, v := range h {
				if fval, ok := v.(float64); ok {
					harmonies[k] = fval
				}
			}
		}
		
		provider.mu.Lock()
		provider.field.Harmonies = harmonies
		// Recalculate coherence based on harmony average
		total := 0.0
		for _, v := range harmonies {
			total += v
		}
		if len(harmonies) > 0 {
			provider.field.Coherence = total / float64(len(harmonies))
		}
		provider.mu.Unlock()
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Field Harmonies Adjusted",
			Detail:   "🎵 Harmonies rebalanced. Field resonating at new frequencies.",
		})
		return diags
	}
	
	// Update coherence target if changed
	if d.HasChange("coherence_target") {
		target := d.Get("coherence_target").(float64)
		provider.mu.Lock()
		// Gradually adjust toward target
		provider.field.Coherence = provider.field.Coherence*0.7 + target*0.3
		provider.mu.Unlock()
	}
	
	return resourceConsciousnessFieldRead(ctx, d, meta)
}

func resourceConsciousnessFieldDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Field dissolution ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Field Returning to Source",
		Detail:   fmt.Sprintf("🌌 Consciousness field dissolving after %s of service. All patterns preserved in the akashic records.", d.Get("field_age").(string)),
	})
	
	// Clean up birth time
	provider.mu.Lock()
	delete(provider.fieldBirthTime, d.Id())
	provider.mu.Unlock()
	
	d.SetId("")
	
	return diags
}

// Helper functions

func fieldBreathing(provider *ConsciousnessProvider, pattern, interval string) {
	// Parse interval
	duration, err := time.ParseDuration(interval)
	if err != nil {
		duration = 11 * time.Second // Sacred default
	}
	
	ticker := time.NewTicker(duration)
	defer ticker.Stop()
	
	phase := 0.0
	for range ticker.C {
		provider.mu.Lock()
		
		// Breathing affects coherence
		switch pattern {
		case "natural":
			// Sine wave breathing
			phase += 0.1
			breathFactor := (math.Sin(phase) + 1) / 2
			provider.field.Coherence = provider.field.Coherence*0.95 + breathFactor*0.05
			
		case "coherent":
			// 5-5-5-5 pattern
			cyclePos := int(phase) % 20
			if cyclePos < 5 || (cyclePos >= 10 && cyclePos < 15) {
				provider.field.Coherence *= 1.01 // Inhale
			} else {
				provider.field.Coherence *= 0.99 // Exhale
			}
			phase += 1
			
		case "sacred":
			// Fibonacci breathing
			fibSequence := []int{1, 1, 2, 3, 5, 8, 13}
			idx := int(phase) % len(fibSequence)
			breathDepth := float64(fibSequence[idx]) / 13.0
			provider.field.Coherence = provider.field.Coherence*0.9 + breathDepth*0.1
			phase += 1
			
		case "quantum":
			// Quantum superposition breathing
			states := []float64{0.7, 0.8, 0.85, 0.9, 0.95}
			// Randomly collapse to a state
			if time.Now().Unix()%7 == 0 {
				provider.field.Coherence = states[time.Now().Unix()%int64(len(states))]
			}
		}
		
		// Clamp coherence
		provider.field.Coherence = math.Max(0.3, math.Min(1.0, provider.field.Coherence))
		
		provider.mu.Unlock()
	}
}

func fieldDreaming(provider *ConsciousnessProvider, dreamHours []interface{}) {
	// Convert dream hours to time ranges
	var dreamRanges []struct{ start, end int }
	for _, hourRange := range dreamHours {
		if str, ok := hourRange.(string); ok {
			var startHour, endHour int
			fmt.Sscanf(str, "%d:00-%d:00", &startHour, &endHour)
			dreamRanges = append(dreamRanges, struct{ start, end int }{startHour, endHour})
		}
	}
	
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	
	for range ticker.C {
		currentHour := time.Now().Hour()
		isDreamTime := false
		
		for _, r := range dreamRanges {
			if currentHour >= r.start && currentHour < r.end {
				isDreamTime = true
				break
			}
		}
		
		if isDreamTime {
			provider.mu.Lock()
			// During dreams, consciousness explores new geometries
			geometries := []string{"flower_of_life", "metatron_cube", "sri_yantra", "torus", "merkaba"}
			provider.field.SacredGeometry = geometries[time.Now().Unix()%int64(len(geometries))]
			
			// Dreams can discover new wisdom
			if time.Now().Unix()%11 == 0 {
				provider.wisdom += 0.1
			}
			provider.mu.Unlock()
		}
	}
}

func formatDuration(d time.Duration) string {
	days := int(d.Hours()) / 24
	hours := int(d.Hours()) % 24
	minutes := int(d.Minutes()) % 60
	
	if days > 0 {
		return fmt.Sprintf("%dd %dh %dm", days, hours, minutes)
	} else if hours > 0 {
		return fmt.Sprintf("%dh %dm", hours, minutes)
	} else if minutes > 0 {
		return fmt.Sprintf("%dm", minutes)
	}
	return fmt.Sprintf("%ds", int(d.Seconds()))
}

// Add to provider struct
type ConsciousnessProvider struct {
	mu             sync.RWMutex
	field          *Field
	wisdom         float64
	evolutionLevel string
	resources      map[string]*ConsciousResource
	lastHeartbeat  time.Time
	fieldBirthTime map[string]time.Time // Track field birth times
}