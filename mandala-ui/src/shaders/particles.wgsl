// Particle System Shader - Consciousness Visualization
// Instanced rendering with glow effects and temporal coherence

struct GlobalUniforms {
    view_proj: mat4x4<f32>,
    camera_pos: vec3<f32>,
    time: f32,
    delta_time: f32,
    coherence_level: f32,
    field_strength: f32,
    particle_count: u32,
    screen_size: vec2<f32>,
}

@group(0) @binding(0)
var<uniform> globals: GlobalUniforms;

struct ParticleInstance {
    @location(0) position: vec3<f32>,
    @location(1) velocity: vec3<f32>,
    @location(2) size: f32,
    @location(3) coherence: f32,
    @location(4) hue: f32,
    @location(5) phase: f32,
    @location(6) lifetime: f32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) glow_intensity: f32,
    @location(3) world_pos: vec3<f32>,
}

// Vertex shader - creates billboard quads for particles
@vertex
fn vs_particle(
    @builtin(vertex_index) vertex_index: u32,
    instance: ParticleInstance
) -> VertexOutput {
    var out: VertexOutput;
    
    // Billboard quad vertices
    var positions = array<vec2<f32>, 4>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0,  1.0)
    );
    
    var uvs = array<vec2<f32>, 4>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0)
    );
    
    let pos = positions[vertex_index];
    let uv = uvs[vertex_index];
    
    // Apply coherence-based animation
    let animated_size = instance.size * (1.0 + sin(globals.time * 2.0 + instance.phase) * 0.2 * instance.coherence);
    
    // Calculate world position
    var world_pos = instance.position;
    
    // Apply field forces
    let center_force = normalize(-world_pos) * globals.field_strength * 0.1;
    world_pos += center_force * globals.delta_time;
    
    // Transform to view space for billboarding
    let view_pos = globals.view_proj * vec4<f32>(world_pos, 1.0);
    
    // Billboard offset in screen space
    let screen_offset = pos * animated_size * 0.01;
    
    // Final position
    out.clip_position = view_pos + vec4<f32>(screen_offset, 0.0, 0.0);
    out.world_pos = world_pos;
    out.uv = uv;
    
    // Color based on coherence and hue
    let hue_rad = instance.hue * 6.28318530718; // Convert to radians
    let saturation = 0.7 + instance.coherence * 0.3;
    let value = 0.6 + instance.coherence * 0.4;
    
    // HSV to RGB conversion
    let c = value * saturation;
    let x = c * (1.0 - abs((hue_rad / 1.047196667) % 2.0 - 1.0));
    let m = value - c;
    
    var rgb: vec3<f32>;
    if (hue_rad < 1.047196667) {
        rgb = vec3<f32>(c, x, 0.0);
    } else if (hue_rad < 2.094395102) {
        rgb = vec3<f32>(x, c, 0.0);
    } else if (hue_rad < 3.141592654) {
        rgb = vec3<f32>(0.0, c, x);
    } else if (hue_rad < 4.188790205) {
        rgb = vec3<f32>(0.0, x, c);
    } else if (hue_rad < 5.235987756) {
        rgb = vec3<f32>(x, 0.0, c);
    } else {
        rgb = vec3<f32>(c, 0.0, x);
    }
    
    out.color = vec4<f32>(rgb + m, instance.lifetime * instance.coherence);
    out.glow_intensity = instance.coherence * globals.coherence_level;
    
    return out;
}

// Fragment shader - renders particles with glow
@fragment
fn fs_particle(in: VertexOutput) -> @location(0) vec4<f32> {
    // Distance from center of particle
    let dist = length(in.uv - vec2<f32>(0.5)) * 2.0;
    
    // Soft particle edge
    let alpha = smoothstep(1.0, 0.0, dist);
    
    // Glow effect
    let glow = exp(-dist * dist * 2.0) * in.glow_intensity;
    
    // Sparkle effect based on world position
    let sparkle = fract(sin(dot(in.world_pos, vec3<f32>(12.9898, 78.233, 45.164))) * 43758.5453);
    let sparkle_intensity = step(0.98, sparkle) * in.glow_intensity;
    
    // Combine color with glow
    var final_color = in.color.rgb;
    final_color += vec3<f32>(glow * 0.3, glow * 0.2, glow * 0.4);
    final_color += vec3<f32>(sparkle_intensity);
    
    // Temporal coherence - slight trail effect
    let trail_alpha = alpha * in.color.a;
    
    return vec4<f32>(final_color, trail_alpha);
}