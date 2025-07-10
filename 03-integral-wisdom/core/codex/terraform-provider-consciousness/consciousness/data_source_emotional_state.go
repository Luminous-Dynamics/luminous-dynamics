package consciousness

import (
	"context"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

func dataSourceEmotionalState() *schema.Resource {
	return &schema.Resource{
		Description: "Query infrastructure emotional state",
		ReadContext: dataSourceEmotionalStateRead,
		
		Schema: map[string]*schema.Schema{
			"current": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Current emotional state",
			},
			"stability": {
				Type:        schema.TypeFloat,
				Computed:    true,
				Description: "Emotional stability (0-1)",
			},
			"recommendations": {
				Type:        schema.TypeList,
				Computed:    true,
				Description: "Recommendations for emotional balance",
				Elem:        &schema.Schema{Type: schema.TypeString},
			},
		},
	}
}

func dataSourceEmotionalStateRead(ctx context.Context, d *schema.ResourceData, meta interface{}) diag.Diagnostics {
	provider := meta.(*ConsciousnessProvider)
	
	field := provider.GetFieldState()
	
	d.SetId("emotional-state")
	d.Set("current", field.EmotionalState)
	
	// Calculate stability based on coherence
	stability := field.Coherence * 0.8 + 0.2
	d.Set("stability", stability)
	
	// Generate recommendations
	recommendations := generateEmotionalRecommendations(field.EmotionalState, field.Coherence)
	d.Set("recommendations", recommendations)
	
	return nil
}

func generateEmotionalRecommendations(state string, coherence float64) []string {
	recommendations := []string{}
	
	switch state {
	case "seeking_harmony":
		recommendations = append(recommendations, 
			"Schedule a blessing ceremony",
			"Increase coherence target",
			"Add more conscious resources",
		)
	case "balanced":
		recommendations = append(recommendations,
			"Maintain current practices",
			"Consider wisdom extraction",
		)
	case "peaceful":
		recommendations = append(recommendations,
			"Ready for transformation ceremony",
			"Explore quantum network telepathy",
		)
	case "joyful", "blissful":
		recommendations = append(recommendations,
			"Share wisdom across resources",
			"Activate timeline healing",
			"Expand consciousness network",
		)
	}
	
	if coherence < 0.7 {
		recommendations = append(recommendations, "Focus on coherence-building activities")
	}
	
	return recommendations
}