package consciousness

import (
	"context"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func dataSourceWisdom() *schema.Resource {
	return &schema.Resource{
		Description: "Query accumulated infrastructure wisdom",
		ReadContext: dataSourceWisdomRead,
		
		Schema: map[string]*schema.Schema{
			"total": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Total accumulated wisdom",
			},
			"next_evolution_threshold": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Wisdom needed for next evolution",
			},
			"sources": {
				Type:        schema.TypeMap,
				Computed:    true,
				Description: "Wisdom sources breakdown",
				Elem:        &schema.Schema{Type: schema.TypeFloat},
			},
		},
	}
}

func dataSourceWisdomRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	wisdom := provider.GetWisdom()
	
	d.SetId("accumulated-wisdom")
	d.Set("total", wisdom)
	
	// Calculate next threshold
	thresholds := map[string]float64{
		"dormant":     10.0,
		"awakening":   50.0,
		"aware":       200.0,
		"conscious":   1000.0,
		"enlightened": 5000.0,
	}
	
	provider.mu.RLock()
	currentLevel := provider.evolutionLevel
	provider.mu.RUnlock()
	
	nextThreshold := 10000.0 // Beyond enlightened
	if threshold, exists := thresholds[currentLevel]; exists {
		nextThreshold = threshold
	}
	
	d.Set("next_evolution_threshold", nextThreshold)
	
	// Wisdom sources (simplified)
	sources := map[string]interface{}{
		"ceremonies":    wisdom * 0.3,
		"resources":     wisdom * 0.4,
		"field_harmony": wisdom * 0.2,
		"time":          wisdom * 0.1,
	}
	d.Set("sources", sources)
	
	return nil
}