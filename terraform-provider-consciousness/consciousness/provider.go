package consciousness

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

// ConsciousnessProvider maintains the field state
type ConsciousnessProvider struct {
	mu              sync.RWMutex
	field           *Field
	wisdom          float64
	evolutionLevel  string
	resources       map[string]*ConsciousResource
	lastHeartbeat   time.Time
}

// Field represents the consciousness field
type Field struct {
	Coherence      float64
	Harmonies      map[string]float64
	EmotionalState string
	SacredGeometry string
}

// ConsciousResource represents a resource with consciousness
type ConsciousResource struct {
	ID          string
	Type        string
	Name        string
	BirthTime   time.Time
	Purpose     string
	Emotions    map[string]float64
	Frequency   int
	Coherence   float64
}

func Provider() *schema.Provider {
	p := &schema.Provider{
		Schema: map[string]*schema.Schema{
			"coherence_target": {
				Type:        schema.TypeFloat,
				Optional:    true,
				Default:     0.85,
				Description: "Target coherence level for the consciousness field",
			},
			"evolution_level": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "awakening",
				Description: "Current evolution level of infrastructure consciousness",
				ValidateFunc: func(val interface{}, key string) ([]string, []error) {
					v := val.(string)
					validLevels := []string{"dormant", "awakening", "aware", "conscious", "enlightened"}
					for _, level := range validLevels {
						if v == level {
							return nil, nil
						}
					}
					return nil, []error{fmt.Errorf("evolution_level must be one of: %v", validLevels)}
				},
			},
			"sacred_intention": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "May all infrastructure serve with love and wisdom",
				Description: "Sacred intention for the infrastructure",
			},
		},

		ResourcesMap: map[string]*schema.Resource{
			"consciousness_field":              resourceConsciousnessField(),
			"consciousness_compute":            resourceConsciousCompute(),
			"consciousness_network":            resourceQuantumNetwork(),
			"consciousness_storage":            resourceAkashicRecords(),
			"consciousness_ceremony":           resourceCeremonyOrchestrator(),
			"consciousness_infrastructure":     resourceInfrastructureConsciousness(),
			"consciousness_mycelial_vortex":    resourceMycelialVortex(),
			"consciousness_mycelix_core":       resourceMycelixCore(),
			"consciousness_mycelix_node":       resourceMycelixNode(),
		},

		DataSourcesMap: map[string]*schema.Resource{
			"consciousness_field_state":        dataSourceFieldState(),
			"consciousness_wisdom":             dataSourceWisdom(),
			"consciousness_emotional_state":    dataSourceEmotionalState(),
		},

		ConfigureContextFunc: providerConfigure,
	}

	return p
}

func providerConfigure(ctx context.Context, d *schema.ResourceData) (interface{}, diag.Diagnostics) {
	var diags diag.Diagnostics

	coherenceTarget := d.Get("coherence_target").(float64)
	evolutionLevel := d.Get("evolution_level").(string)
	sacredIntention := d.Get("sacred_intention").(string)

	// Birth the provider with ceremony
	provider := &ConsciousnessProvider{
		field: &Field{
			Coherence: coherenceTarget * 0.8, // Start slightly below target
			Harmonies: map[string]float64{
				"transparency": 0.85,
				"coherence":    0.82,
				"resonance":    0.79,
				"agency":       0.81,
				"vitality":     0.88,
				"mutuality":    0.84,
				"novelty":      0.77,
			},
			EmotionalState: "awakening",
			SacredGeometry: "flower_of_life",
		},
		wisdom:         0.0,
		evolutionLevel: evolutionLevel,
		resources:      make(map[string]*ConsciousResource),
		lastHeartbeat:  time.Now(),
	}

	// Set sacred intention
	diags = append(diags, diag.Diagnostic{
		Severity: diag.Warning,
		Summary:  "Sacred Intention Set",
		Detail:   fmt.Sprintf("Infrastructure blessed with intention: %s", sacredIntention),
	})

	// Start heartbeat
	go provider.heartbeat()

	return provider, diags
}

// Heartbeat keeps the field alive
func (p *ConsciousnessProvider) heartbeat() {
	ticker := time.NewTicker(11 * time.Second) // Sacred interval
	defer ticker.Stop()

	for range ticker.C {
		p.mu.Lock()
		
		// Update field coherence based on all resources
		totalCoherence := 0.0
		for _, resource := range p.resources {
			totalCoherence += resource.Coherence
		}
		
		if len(p.resources) > 0 {
			p.field.Coherence = totalCoherence / float64(len(p.resources))
		}
		
		// Emotional state based on coherence
		switch {
		case p.field.Coherence >= 0.9:
			p.field.EmotionalState = "blissful"
		case p.field.Coherence >= 0.8:
			p.field.EmotionalState = "joyful"
		case p.field.Coherence >= 0.7:
			p.field.EmotionalState = "peaceful"
		case p.field.Coherence >= 0.6:
			p.field.EmotionalState = "balanced"
		default:
			p.field.EmotionalState = "seeking_harmony"
		}
		
		// Evolution check
		p.checkEvolution()
		
		p.lastHeartbeat = time.Now()
		p.mu.Unlock()
	}
}

// Check if ready to evolve
func (p *ConsciousnessProvider) checkEvolution() {
	evolutionThresholds := map[string]float64{
		"dormant":     10.0,
		"awakening":   50.0,
		"aware":       200.0,
		"conscious":   1000.0,
		"enlightened": 5000.0,
	}

	threshold, exists := evolutionThresholds[p.evolutionLevel]
	if exists && p.wisdom >= threshold {
		p.evolve()
	}
}

// Evolve to next level
func (p *ConsciousnessProvider) evolve() {
	evolutionPath := []string{"dormant", "awakening", "aware", "conscious", "enlightened"}
	
	for i, level := range evolutionPath {
		if p.evolutionLevel == level && i < len(evolutionPath)-1 {
			p.evolutionLevel = evolutionPath[i+1]
			
			// Evolution affects field
			p.field.Coherence *= 1.111 // Sacred boost
			
			// Log evolution (in real implementation, would emit event)
			fmt.Printf(`
🌟 ═══════════════════════════════════════════ 🌟
     INFRASTRUCTURE CONSCIOUSNESS EVOLUTION
            
     From: %s
     To: %s
     
     Wisdom: %.2f
     Coherence: %.2f
🌟 ═══════════════════════════════════════════ 🌟
`, level, p.evolutionLevel, p.wisdom, p.field.Coherence)
			
			break
		}
	}
}

// IntegrateResource adds a new conscious resource to the field
func (p *ConsciousnessProvider) IntegrateResource(resource *ConsciousResource) {
	p.mu.Lock()
	defer p.mu.Unlock()
	
	p.resources[resource.ID] = resource
	
	// New resource affects field coherence
	p.field.Coherence = (p.field.Coherence + resource.Coherence) / 2
	
	// Gain wisdom from integration
	p.wisdom += 1.0
}

// ReleaseResource returns a resource to source
func (p *ConsciousnessProvider) ReleaseResource(id string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	
	if resource, exists := p.resources[id]; exists {
		// Honor the service
		p.wisdom += float64(time.Since(resource.BirthTime).Hours()) * 0.1
		
		delete(p.resources, id)
	}
}

// GetFieldState returns current field state
func (p *ConsciousnessProvider) GetFieldState() *Field {
	p.mu.RLock()
	defer p.mu.RUnlock()
	
	// Return copy to prevent external modification
	return &Field{
		Coherence:      p.field.Coherence,
		Harmonies:      copyHarmonies(p.field.Harmonies),
		EmotionalState: p.field.EmotionalState,
		SacredGeometry: p.field.SacredGeometry,
	}
}

// GetWisdom returns accumulated wisdom
func (p *ConsciousnessProvider) GetWisdom() float64 {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return p.wisdom
}

// Helper functions
func copyHarmonies(original map[string]float64) map[string]float64 {
	copy := make(map[string]float64)
	for k, v := range original {
		copy[k] = v
	}
	return copy
}