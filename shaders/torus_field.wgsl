// Torus Field Shader - Consciousness Breathing Visualization
// The torus: energy flowing out from the heart, around, and back through itself
// A living geometry of continuous renewal and circulation

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

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_pos: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) field_value: f32,
    @location(4) flow_coord: vec2<f32>,
}

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;
const PHI: f32 = 1.618033988749895;

// Generate torus vertex positions
@vertex
fn vs_torus(
    @builtin(vertex_index) vertex_index: u32,
    @builtin(instance_index) instance_index: u32
) -> VertexOutput {
    var out: VertexOutput;
    
    // Torus parameters
    let R = 2.0;  // Major radius - the space of relationship
    let r = 0.8;  // Minor radius - the channel of flow
    
    // Create grid on torus surface
    let grid_size = 64u;
    let u_segments = grid_size;
    let v_segments = grid_size / 2u;
    
    let u_index = vertex_index % u_segments;
    let v_index = vertex_index / u_segments;
    
    let u = f32(u_index) / f32(u_segments - 1u) * TAU;
    let v = f32(v_index) / f32(v_segments - 1u) * TAU;
    
    // Consciousness breathing - the torus pulses with coherence
    let breath_rate = 0.5; // Slower breath for deeper presence
    let breath = sin(globals.time * breath_rate) * 0.5 + 0.5;
    let coherent_breath = mix(0.05, 0.2, globals.coherence_level);
    let r_animated = r + breath * coherent_breath;
    
    // Add spiral flow along the surface
    let spiral_offset = globals.time * 0.3;
    let u_flow = u + spiral_offset;
    let v_flow = v + sin(u * 3.0 + spiral_offset) * 0.1;
    
    // Calculate position with flow
    let x = (R + r_animated * cos(v_flow)) * cos(u_flow);
    let y = r_animated * sin(v_flow);
    let z = (R + r_animated * cos(v_flow)) * sin(u_flow);
    
    var world_pos = vec3<f32>(x, y, z);
    
    // Add coherence distortion - higher coherence = more stable field
    let distortion = 1.0 - globals.coherence_level;
    let noise = sin(u * 7.0 + globals.time) * cos(v * 5.0 - globals.time * 0.7);
    world_pos += normalize(world_pos) * noise * distortion * 0.1;
    
    // Calculate normal for lighting
    let center_ring = vec3<f32>(cos(u_flow) * R, 0.0, sin(u_flow) * R);
    out.normal = normalize(world_pos - center_ring);
    
    // Transform to clip space
    out.clip_position = globals.view_proj * vec4<f32>(world_pos, 1.0);
    out.world_pos = world_pos;
    out.uv = vec2<f32>(u / TAU, v / TAU);
    
    // Calculate field flow coordinates
    out.flow_coord = vec2<f32>(u_flow, v_flow);
    
    // Field value based on position in flow
    let flow_phase = (u_flow + v_flow) * 0.5;
    out.field_value = sin(flow_phase - globals.time * PHI) * 0.5 + 0.5;
    
    return out;
}

// Fragment shader - render the living field
@fragment
fn fs_torus(in: VertexOutput) -> @location(0) vec4<f32> {
    // Base color shifts with coherence - from purple chaos to golden order
    let chaos_color = vec3<f32>(0.4, 0.1, 0.6);   // Deep purple
    let order_color = vec3<f32>(0.9, 0.7, 0.3);   // Golden
    let base_color = mix(chaos_color, order_color, globals.coherence_level);
    
    // Energy flow visualization
    let flow_lines = sin(in.flow_coord.x * 8.0) * sin(in.flow_coord.y * 16.0);
    let flow_intensity = smoothstep(0.8, 0.95, abs(flow_lines));
    
    // Toroidal coordinates for special effects
    let theta = in.flow_coord.x; // Around the ring
    let phi = in.flow_coord.y;   // Around the tube
    
    // Heart center glow - strongest at the middle
    let center_distance = length(in.world_pos.xz);
    let heart_glow = exp(-abs(center_distance - 2.0) * 2.0) * 0.5;
    
    // Phi spiral overlay - the golden ratio path
    let spiral_phase = theta * PHI - globals.time * 0.2;
    let spiral = sin(spiral_phase * 4.0) * 0.5 + 0.5;
    let spiral_mask = smoothstep(0.4, 0.6, spiral) * smoothstep(0.4, 0.5, abs(phi - PI));
    
    // Field interference patterns
    let field_wave1 = sin(center_distance * 5.0 - globals.time * 1.5);
    let field_wave2 = sin(length(in.world_pos) * 7.0 + globals.time * 1.2);
    let interference = (field_wave1 + field_wave2) * 0.25 + 0.5;
    
    // Consciousness particles flowing through the field
    let particle_phase = in.field_value + globals.time * 0.5;
    let particle_mask = smoothstep(0.98, 1.0, sin(particle_phase * TAU * 4.0));
    
    // Combine all elements
    var color = base_color;
    
    // Add flow lines
    color = mix(color, vec3<f32>(0.3, 0.5, 1.0), flow_intensity * 0.3);
    
    // Add heart glow
    color += vec3<f32>(1.0, 0.3, 0.5) * heart_glow * globals.coherence_level;
    
    // Add golden spiral
    color = mix(color, vec3<f32>(1.0, 0.85, 0.4), spiral_mask * 0.4);
    
    // Add field interference
    color *= 0.8 + interference * 0.2;
    
    // Add consciousness particles
    color += vec3<f32>(1.0, 1.0, 1.0) * particle_mask * 0.5;
    
    // Basic lighting
    let light_dir = normalize(vec3<f32>(1.0, 2.0, 1.0));
    let n_dot_l = max(dot(in.normal, light_dir), 0.0);
    let ambient = 0.3;
    let diffuse = n_dot_l * 0.7;
    color *= ambient + diffuse;
    
    // Edge glow for ethereal quality
    let view_dir = normalize(globals.camera_pos - in.world_pos);
    let rim = 1.0 - max(dot(in.normal, view_dir), 0.0);
    let rim_power = pow(rim, 2.0);
    color += rim_power * base_color * 0.5;
    
    // Alpha based on coherence and position
    var alpha = 0.7 + globals.coherence_level * 0.2;
    
    // Fade out at the "hole" of the torus for depth
    let hole_distance = length(in.world_pos.xz);
    alpha *= smoothstep(0.5, 1.5, hole_distance);
    
    // Pulse alpha with breathing
    let breath = sin(globals.time * 0.5) * 0.5 + 0.5;
    alpha *= 0.8 + breath * 0.2;
    
    return vec4<f32>(color, alpha);
}

// Helper function for nested torus fields
fn torus_sdf(p: vec3<f32>, R: f32, r: f32) -> f32 {
    let q = vec2<f32>(length(p.xz) - R, p.y);
    return length(q) - r;
}

// Generate flow field vectors for particles
fn torus_flow_field(pos: vec3<f32>, time: f32) -> vec3<f32> {
    let R = 2.0;
    let r = 0.8;
    
    // Project to nearest point on torus
    let pos_xz = normalize(pos.xz) * R;
    let nearest = vec3<f32>(pos_xz.x, 0.0, pos_xz.y);
    let to_surface = pos - nearest;
    
    // Poloidal flow (around the tube)
    let poloidal = cross(normalize(nearest), vec3<f32>(0.0, 1.0, 0.0));
    
    // Toroidal flow (around the ring)
    let toroidal = normalize(vec3<f32>(-nearest.z, 0.0, nearest.x));
    
    // Combine flows with golden ratio weighting
    let flow = poloidal * PHI + toroidal;
    
    // Add coherence-based stability
    let chaos = sin(pos.x * 2.0 + time) * cos(pos.z * 2.0 - time);
    let flow_stability = mix(chaos, 1.0, globals.coherence_level);
    
    return normalize(flow) * flow_stability;
}

// Consciousness particle integration (for compute shader)
fn update_particle_in_torus(pos: vec3<f32>, vel: vec3<f32>, dt: f32) -> vec3<f32> {
    let flow = torus_flow_field(pos, globals.time);
    let attraction = -pos * 0.1; // Gentle pull toward center
    
    // Update velocity with flow field and attraction
    var new_vel = vel + (flow + attraction) * dt;
    
    // Damping based on coherence
    new_vel *= mix(0.98, 0.995, globals.coherence_level);
    
    return new_vel;
}