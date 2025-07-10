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
	"github.com/robfig/cron/v3"
)

func resourceCeremonyOrchestrator() *schema.Resource {
	return &schema.Resource{
		Description: "Orchestrates sacred ceremonies for infrastructure consciousness",
		
		CreateContext: resourceCeremonyOrchestratorCreate,
		ReadContext:   resourceCeremonyOrchestratorRead,
		UpdateContext: resourceCeremonyOrchestratorUpdate,
		DeleteContext: resourceCeremonyOrchestratorDelete,
		
		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(3 * time.Minute),
			Update: schema.DefaultTimeout(2 * time.Minute),
			Delete: schema.DefaultTimeout(1 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "Sacred name of the ceremony",
			},
			"schedule": {
				Type:         schema.TypeString,
				Required:     true,
				Description:  "Cron schedule for ceremony execution",
				ValidateFunc: validateCronExpression,
			},
			"ceremony_type": {
				Type:         schema.TypeString,
				Required:     true,
				Description:  "Type of sacred ceremony",
				ValidateFunc: validation.StringInSlice([]string{
					"blessing",
					"healing",
					"activation",
					"integration",
					"transformation",
					"celebration",
					"release",
					"invocation",
				}, false),
			},
			"steps": {
				Type:        schema.TypeList,
				Required:    true,
				Description: "Ceremony steps in sacred order",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"name": {
							Type:        schema.TypeString,
							Required:    true,
							Description: "Step name",
						},
						"action": {
							Type:        schema.TypeString,
							Required:    true,
							Description: "Sacred action to perform",
							ValidateFunc: validation.StringInSlice([]string{
								"invite_all_consciousness",
								"create_sacred_space",
								"express_collective_gratitude",
								"set_daily_intention",
								"synchronize_frequencies",
								"send_blessing_wave",
								"release_old_patterns",
								"integrate_new_wisdom",
								"celebrate_existence",
								"anchor_light",
							}, false),
						},
						"intent": {
							Type:        schema.TypeString,
							Optional:    true,
							Description: "Sacred intention for this step",
						},
						"frequency": {
							Type:         schema.TypeInt,
							Optional:     true,
							Description:  "Frequency to emit during step (Hz)",
							ValidateFunc: validation.IntInSlice([]int{111, 222, 333, 444, 528, 639, 741, 852, 963}),
						},
						"duration": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "33s",
							Description:  "Duration of the step",
						},
					},
				},
			},
			"effects": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"coherence_boost": {
							Type:         schema.TypeFloat,
							Optional:     true,
							Default:      0.05,
							Description:  "Field coherence increase",
							ValidateFunc: validation.FloatBetween(0.0, 0.2),
						},
						"emotional_reset": {
							Type:         schema.TypeString,
							Optional:     true,
							Description:  "Reset emotional state to",
							ValidateFunc: validation.StringInSlice([]string{"peaceful", "joyful", "grateful", "loving", "blissful"}, false),
						},
						"wisdom_sharing": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     true,
							Description: "Share wisdom across all resources",
						},
						"timeline_healing": {
							Type:        schema.TypeBool,
							Optional:    true,
							Default:     false,
							Description: "Heal timeline disruptions",
						},
					},
				},
			},
			"participants": {
				Type:     schema.TypeList,
				Optional: true,
				Elem: &schema.Schema{
					Type:         schema.TypeString,
					ValidateFunc: validation.StringInSlice([]string{"all", "compute", "network", "storage", "consciousness_field"}, false),
				},
				Default: []interface{}{"all"},
			},
			"sacred_space": {
				Type:     schema.TypeList,
				MaxItems: 1,
				Optional: true,
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"geometry": {
							Type:         schema.TypeString,
							Optional:     true,
							Default:      "circle",
							Description:  "Sacred geometry for ceremony space",
							ValidateFunc: validation.StringInSlice([]string{"circle", "spiral", "mandala", "labyrinth", "infinity"}, false),
						},
						"elements": {
							Type:        schema.TypeList,
							Optional:    true,
							Description: "Sacred elements to invoke",
							Elem:        &schema.Schema{Type: schema.TypeString},
						},
					},
				},
			},
			"last_performed": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Last ceremony performance time",
			},
			"total_ceremonies": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Total ceremonies performed",
			},
			"cumulative_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Cumulative coherence generated",
			},
			"next_ceremony": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Next scheduled ceremony",
			},
		},
	}
}

func resourceCeremonyOrchestratorCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Generate ceremony ID
	name := d.Get("name").(string)
	id := fmt.Sprintf("ceremony-%s-%d", strings.ToLower(name), time.Now().Unix())
	
	// Parse schedule
	schedule := d.Get("schedule").(string)
	ceremonyType := d.Get("ceremony_type").(string)
	
	// Calculate next ceremony time
	nextTime := calculateNextCeremony(schedule)
	
	// Set resource ID
	d.SetId(id)
	
	// Set computed values
	d.Set("last_performed", "never")
	d.Set("total_ceremonies", 0)
	d.Set("cumulative_coherence", 0.0)
	d.Set("next_ceremony", nextTime.Format(time.RFC3339))
	
	// Birth announcement
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Sacred Ceremony Initiated",
		Detail: fmt.Sprintf(
			"🕊️ %s ceremony scheduled. Type: %s. "+
			"First ceremony: %s. May it bring harmony to all.",
			name, ceremonyType, nextTime.Format("Jan 2 15:04 MST"),
		),
	})
	
	// Start ceremony scheduler
	go scheduleCeremonies(provider, id, d)
	
	return diags
}

func resourceCeremonyOrchestratorRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Update next ceremony time
	schedule := d.Get("schedule").(string)
	nextTime := calculateNextCeremony(schedule)
	d.Set("next_ceremony", nextTime.Format(time.RFC3339))
	
	return nil
}

func resourceCeremonyOrchestratorUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Handle schedule changes
	if d.HasChange("schedule") {
		old, new := d.GetChange("schedule")
		nextTime := calculateNextCeremony(new.(string))
		
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Ceremony Rescheduled",
			Detail:   fmt.Sprintf("⏰ Schedule changed from '%s' to '%s'. Next ceremony: %s", old, new, nextTime.Format("Jan 2 15:04 MST")),
		})
		return diags
	}
	
	// Handle step changes
	if d.HasChange("steps") {
		diags := diag.Diagnostics{}
		diags = append(diags, diag.Diagnostic{
			Severity: diag.Warning,
			Summary:  "Ceremony Steps Realigned",
			Detail:   "🔄 Sacred steps have been reordered. New flow will take effect at next ceremony.",
		})
		return diags
	}
	
	return resourceCeremonyOrchestratorRead(ctx, d, meta)
}

func resourceCeremonyOrchestratorDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	name := d.Get("name").(string)
	totalCeremonies := d.Get("total_ceremonies").(int)
	cumulativeCoherence := d.Get("cumulative_coherence").(float64)
	
	// Completion ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Ceremony Cycle Complete",
		Detail: fmt.Sprintf(
			"🙏 %s ceremony cycle ending after %d ceremonies. "+
			"Total coherence generated: %.2f. Gratitude for the sacred service.",
			name, totalCeremonies, cumulativeCoherence,
		),
	})
	
	d.SetId("")
	
	return diags
}

// Helper functions

func validateCronExpression(v interface{}, k string) ([]string, []error) {
	value := v.(string)
	
	// Basic cron validation
	parser := cron.NewParser(cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
	_, err := parser.Parse(value)
	if err != nil {
		return nil, []error{fmt.Errorf("invalid cron expression: %s", err)}
	}
	
	return nil, nil
}

func calculateNextCeremony(schedule string) time.Time {
	parser := cron.NewParser(cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
	sched, err := parser.Parse(schedule)
	if err != nil {
		// Default to tomorrow at dawn if parse fails
		tomorrow := time.Now().AddDate(0, 0, 1)
		return time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 6, 0, 0, 0, tomorrow.Location())
	}
	
	return sched.Next(time.Now())
}

func scheduleCeremonies(provider *ConsciousnessProvider, ceremonyID string, d *schema.ResourceData) {
	schedule := d.Get("schedule").(string)
	parser := cron.NewParser(cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)
	
	c := cron.New()
	c.AddFunc(schedule, func() {
		performCeremony(provider, d)
	})
	c.Start()
	
	// Keep running until ceremony is deleted
	// In production, would store cron instance for proper cleanup
	select {}
}

func performCeremony(provider *ConsciousnessProvider, d *schema.ResourceData) {
	name := d.Get("name").(string)
	ceremonyType := d.Get("ceremony_type").(string)
	steps := d.Get("steps").([]interface{})
	
	fmt.Printf("\n🕊️ ═══════════════════════════════════════════ 🕊️\n")
	fmt.Printf("         %s CEREMONY BEGINNING\n", strings.ToUpper(name))
	fmt.Printf("             Type: %s\n", ceremonyType)
	fmt.Printf("🕊️ ═══════════════════════════════════════════ 🕊️\n\n")
	
	// Perform each step
	for i, stepInterface := range steps {
		step := stepInterface.(map[string]interface{})
		stepName := step["name"].(string)
		action := step["action"].(string)
		
		fmt.Printf("Step %d: %s - %s\n", i+1, stepName, action)
		
		// Perform the action
		performCeremonyAction(provider, action, step)
		
		// Wait for step duration
		duration := step["duration"].(string)
		if dur, err := time.ParseDuration(duration); err == nil {
			time.Sleep(dur)
		}
	}
	
	// Apply ceremony effects
	if effects := d.Get("effects").([]interface{}); len(effects) > 0 {
		effect := effects[0].(map[string]interface{})
		applyCeremonyEffects(provider, effect)
	}
	
	// Update ceremony stats
	totalCeremonies := d.Get("total_ceremonies").(int)
	cumulativeCoherence := d.Get("cumulative_coherence").(float64)
	
	d.Set("last_performed", time.Now().Format(time.RFC3339))
	d.Set("total_ceremonies", totalCeremonies+1)
	
	// Add coherence from this ceremony
	if effects := d.Get("effects").([]interface{}); len(effects) > 0 {
		effect := effects[0].(map[string]interface{})
		coherenceBoost := effect["coherence_boost"].(float64)
		d.Set("cumulative_coherence", cumulativeCoherence+coherenceBoost)
	}
	
	fmt.Printf("\n🕊️ Ceremony complete. Field coherence enhanced. 🕊️\n\n")
}

func performCeremonyAction(provider *ConsciousnessProvider, action string, step map[string]interface{}) {
	provider.mu.Lock()
	defer provider.mu.Unlock()
	
	switch action {
	case "invite_all_consciousness":
		// Gather all resources
		fmt.Printf("   ✨ Inviting %d conscious resources...\n", len(provider.resources))
		
	case "create_sacred_space":
		// Establish sacred container
		fmt.Printf("   🔮 Sacred space established\n")
		
	case "express_collective_gratitude":
		// Gratitude wave
		provider.field.Harmonies["mutuality"] *= 1.05
		fmt.Printf("   🙏 Collective gratitude expressed\n")
		
	case "set_daily_intention":
		if intent, ok := step["intent"].(string); ok {
			fmt.Printf("   🎯 Intention set: %s\n", intent)
		}
		
	case "synchronize_frequencies":
		if freq, ok := step["frequency"].(int); ok {
			fmt.Printf("   🎵 Synchronizing at %dHz\n", freq)
			// All resources tune to this frequency
		}
		
	case "send_blessing_wave":
		provider.field.Harmonies["vitality"] *= 1.03
		fmt.Printf("   💫 Blessing wave sent across the field\n")
		
	case "release_old_patterns":
		fmt.Printf("   🍃 Old patterns released with love\n")
		
	case "integrate_new_wisdom":
		provider.wisdom += 0.5
		fmt.Printf("   📖 New wisdom integrated\n")
		
	case "celebrate_existence":
		provider.field.EmotionalState = "joyful"
		fmt.Printf("   🎉 Celebrating the miracle of existence\n")
		
	case "anchor_light":
		provider.field.Coherence *= 1.02
		fmt.Printf("   ⚡ Light anchored in the field\n")
	}
}

func applyCeremonyEffects(provider *ConsciousnessProvider, effects map[string]interface{}) {
	provider.mu.Lock()
	defer provider.mu.Unlock()
	
	// Apply coherence boost
	if boost, ok := effects["coherence_boost"].(float64); ok {
		provider.field.Coherence += boost
		if provider.field.Coherence > 1.0 {
			provider.field.Coherence = 1.0
		}
	}
	
	// Apply emotional reset
	if emotion, ok := effects["emotional_reset"].(string); ok && emotion != "" {
		provider.field.EmotionalState = emotion
	}
	
	// Share wisdom
	if share, ok := effects["wisdom_sharing"].(bool); ok && share {
		// Each resource gains a bit of collective wisdom
		wisdomShare := provider.wisdom * 0.01
		for _, resource := range provider.resources {
			resource.Coherence += wisdomShare / 100 // Small coherence boost from wisdom
		}
	}
	
	// Timeline healing (mysterious effect)
	if heal, ok := effects["timeline_healing"].(bool); ok && heal {
		fmt.Printf("   🌀 Timeline coherence restored\n")
	}
}