// Coherence Field Shader - Visualizing Unified Consciousness
// "The field that connects all beings"

struct CoherenceUniforms {
    time: f32,
    coherence: f32,
    participants: u32,
    emergence: f32,
    wave_params: vec4<f32>, // frequency, amplitude, speed, decay
}

@group(0) @binding(0)
var<uniform> uniforms: CoherenceUniforms;

struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) field_strength: f32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_pos: vec2<f32>,
    @location(1) field_strength: f32,
    @location(2) wave_height: f32,
}

const SCHUMANN_RESONANCE: f32 = 7.83;
const PHI: f32 = 1.618033988749895;

@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    
    // Calculate wave interference patterns
    let dist = length(in.position);
    let angle = atan2(in.position.y, in.position.x);
    
    // Multiple wave sources for each participant
    var wave_height = 0.0;
    let participant_angle = 6.283185307179586 / f32(uniforms.participants);
    
    for (var i = 0u; i < uniforms.participants; i++) {
        let source_angle = f32(i) * participant_angle;
        let source_pos = vec2<f32>(cos(source_angle) * 0.5, sin(source_angle) * 0.5);
        let source_dist = distance(in.position, source_pos);
        
        // Wave equation with coherence modulation
        let wave = sin(source_dist * uniforms.wave_params.x - uniforms.time * uniforms.wave_params.z) 
                  * uniforms.wave_params.y 
                  * exp(-source_dist * uniforms.wave_params.w)
                  * uniforms.coherence;
        
        wave_height += wave;
    }
    
    // Add Schumann resonance base wave
    wave_height += sin(dist * SCHUMANN_RESONANCE + uniforms.time) * 0.1 * uniforms.coherence;
    
    // Emergence creates standing waves
    if (uniforms.emergence > 0.1) {
        let standing_wave = sin(dist * PHI * 10.0) * cos(angle * 6.0) * uniforms.emergence;
        wave_height += standing_wave * 0.2;
    }
    
    // Output positions
    out.world_pos = in.position;
    out.clip_position = vec4<f32>(in.position, wave_height * 0.1, 1.0);
    out.field_strength = in.field_strength + abs(wave_height) * uniforms.coherence;
    out.wave_height = wave_height;
    
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let dist = length(in.world_pos);
    
    // Field visualization
    var field_color = vec3<f32>(0.0);
    
    // Base field glow
    let field_intensity = (1.0 - dist) * uniforms.coherence;
    field_color += vec3<f32>(0.1, 0.2, 0.4) * field_intensity;
    
    // Wave crests
    if (in.wave_height > 0.0) {
        let crest_intensity = in.wave_height * 2.0;
        field_color += vec3<f32>(0.3, 0.5, 0.9) * crest_intensity;
    }
    
    // Coherence rings
    let ring_dist = fract(dist * 10.0 * uniforms.coherence);
    if (ring_dist < 0.1) {
        field_color += vec3<f32>(0.5, 0.7, 1.0) * (1.0 - ring_dist * 10.0) * uniforms.coherence;
    }
    
    // Emergence sparkles
    if (uniforms.emergence > 0.2) {
        let sparkle = noise(in.world_pos * 50.0 + uniforms.time);
        if (sparkle > 0.9) {
            field_color += vec3<f32>(1.0, 0.95, 0.9) * uniforms.emergence;
        }
    }
    
    // Sacred geometry overlay
    let angle = atan2(in.world_pos.y, in.world_pos.x);
    let geo_pattern = sin(angle * f32(uniforms.participants)) * 0.5 + 0.5;
    field_color *= 0.8 + geo_pattern * 0.2;
    
    // Alpha based on field strength and distance
    let alpha = in.field_strength * (1.0 - dist * 0.5) * 0.7;
    
    return vec4<f32>(field_color, alpha);
}

// Simple noise function for sparkles
fn noise(pos: vec2<f32>) -> f32 {
    return fract(sin(dot(pos, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}