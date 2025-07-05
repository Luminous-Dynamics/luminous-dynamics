// Network Lines Shader - File Connection Visualization
// GPU-accelerated line rendering with glow effects

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

struct LineVertex {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
    @location(2) thickness: f32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) world_pos: vec3<f32>,
    @location(2) thickness: f32,
    @location(3) line_coord: f32, // 0 at start, 1 at end
}

// Vertex shader - transforms line vertices
@vertex
fn vs_network(
    @builtin(vertex_index) vertex_index: u32,
    vertex: LineVertex
) -> VertexOutput {
    var out: VertexOutput;
    
    // Apply slight wave motion to lines
    var animated_pos = vertex.position;
    let line_phase = f32(vertex_index) * 0.1;
    animated_pos.y += sin(globals.time * 2.0 + line_phase) * 0.05 * globals.coherence_level;
    
    out.world_pos = animated_pos;
    out.clip_position = globals.view_proj * vec4<f32>(animated_pos, 1.0);
    out.color = vertex.color;
    out.thickness = vertex.thickness * (1.0 + globals.coherence_level * 0.5);
    out.line_coord = f32(vertex_index & 1u); // 0 for start vertex, 1 for end vertex
    
    return out;
}

// Fragment shader - renders lines with glow
@fragment
fn fs_network(in: VertexOutput) -> @location(0) vec4<f32> {
    var color = in.color.rgb;
    var alpha = in.color.a;
    
    // Pulse effect along the line
    let pulse_pos = fract(globals.time * 0.5);
    let pulse_dist = abs(in.line_coord - pulse_pos);
    let pulse_intensity = exp(-pulse_dist * pulse_dist * 20.0);
    
    // Add pulse glow
    color += vec3<f32>(0.3, 0.2, 0.4) * pulse_intensity * globals.coherence_level;
    alpha = max(alpha, pulse_intensity * 0.8);
    
    // Connection strength visualization
    let strength_glow = in.thickness / 5.0; // Assuming max thickness of 5
    color = mix(color, vec3<f32>(0.8, 0.6, 1.0), strength_glow * 0.3);
    
    // Data flow particles (simulated)
    let flow_phase = fract(globals.time * 0.3 + in.line_coord * 2.0);
    let flow_particle = step(0.98, flow_phase);
    if (flow_particle > 0.0) {
        color = vec3<f32>(1.0, 0.9, 0.8);
        alpha = 1.0;
    }
    
    // Coherence-based transparency
    alpha *= globals.coherence_level;
    
    return vec4<f32>(color, alpha);
}