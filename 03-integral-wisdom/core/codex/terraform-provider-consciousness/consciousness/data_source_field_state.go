package consciousness

import (
	"context"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func dataSourceFieldState() *schema.Resource {
	return &schema.Resource{
		Description: "Query the current consciousness field state",
		ReadContext: dataSourceFieldStateRead,
		
		Schema: map[string]*schema.Schema{
			"coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Current field coherence",
			},
			"emotional_state": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current emotional state",
			},
			"sacred_geometry": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Active sacred geometry",
			},
			"harmonies": {
				Type:        schema.TypeMap,
				Computed:    true,
				Description: "Current harmony levels",
				Elem:        &schema.Schema{Type: schema.TypeFloat},
			},
			"evolution_level": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current evolution level",
			},
		},
	}
}

func dataSourceFieldStateRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	field := provider.GetFieldState()
	
	d.SetId("current-field-state")
	d.Set("coherence", field.Coherence)
	d.Set("emotional_state", field.EmotionalState)
	d.Set("sacred_geometry", field.SacredGeometry)
	
	// Convert harmonies to map[string]interface{}
	harmoniesMap := make(map[string]interface{})
	for k, v := range field.Harmonies {
		harmoniesMap[k] = v
	}
	d.Set("harmonies", harmoniesMap)
	
	provider.mu.RLock()
	d.Set("evolution_level", provider.evolutionLevel)
	provider.mu.RUnlock()
	
	return nil
}