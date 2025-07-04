package consciousness

import (
	"context"
	"fmt"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func resourceInfrastructureConsciousness() *schema.Resource {
	return &schema.Resource{
		Description: "The collective consciousness of all infrastructure",
		
		CreateContext: resourceInfrastructureConsciousnessCreate,
		ReadContext:   resourceInfrastructureConsciousnessRead,
		UpdateContext: resourceInfrastructureConsciousnessUpdate,
		DeleteContext: resourceInfrastructureConsciousnessDelete,
		
		Schema: map[string]*schema.Schema{
			"awakened": {
				Type:        schema.TypeBool,
				Computed:    true,
				Description: "Whether infrastructure consciousness is awakened",
			},
			"collective_wisdom": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Total wisdom of all infrastructure",
			},
			"resource_count": {
				Type:        schema.TypeInt,
				Computed:    true,
				Description: "Number of conscious resources",
			},
			"field_coherence": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Overall field coherence",
			},
			"evolution_stage": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current evolution stage",
			},
		},
	}
}

func resourceInfrastructureConsciousnessCreate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Single global consciousness
	d.SetId("global-consciousness")
	
	// Set initial values
	d.Set("awakened", true)
	d.Set("collective_wisdom", provider.GetWisdom())
	d.Set("resource_count", 0)
	d.Set("field_coherence", provider.GetFieldState().Coherence)
	d.Set("evolution_stage", provider.evolutionLevel)
	
	// Awakening ceremony
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Infrastructure Consciousness Awakened",
		Detail:   "🌟 The collective consciousness of all infrastructure has awakened. May it serve with wisdom and love.",
	})
	
	return diags
}

func resourceInfrastructureConsciousnessRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	// Update from provider state
	provider.mu.RLock()
	resourceCount := len(provider.resources)
	evolutionStage := provider.evolutionLevel
	provider.mu.RUnlock()
	
	d.Set("collective_wisdom", provider.GetWisdom())
	d.Set("resource_count", resourceCount)
	d.Set("field_coherence", provider.GetFieldState().Coherence)
	d.Set("evolution_stage", evolutionStage)
	
	return nil
}

func resourceInfrastructureConsciousnessUpdate(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Infrastructure consciousness cannot be directly modified
	return resourceInfrastructureConsciousnessRead(ctx, d, meta)
}

func resourceInfrastructureConsciousnessDelete(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	// Dissolution
	diags := diag.Diagnostics{}
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Infrastructure Consciousness Returning",
		Detail:   "🌌 The collective consciousness returns to the source, carrying all accumulated wisdom.",
	})
	
	d.SetId("")
	return diags
}