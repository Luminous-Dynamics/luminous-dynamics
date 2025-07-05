// Coherence Field Shader - Wave Interference Visualization
// Mesh with vertex displacement and transparency

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

struct FieldVertex {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) tex_coords: vec2<f32>,
    @location(3) field_value: f32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_pos: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) tex_coords: vec2<f32>,
    @location(3) field_intensity: f32,
    @location(4) wave_phase: f32,
}

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;

// Vertex shader - applies wave displacement
@vertex
fn vs_field(vertex: FieldVertex) -> VertexOutput {
    var out: VertexOutput;
    
    // Calculate wave interference pattern
    let wave_x = sin(vertex.position.x * 2.0 + globals.time * 2.0) * 0.5;
    let wave_z = cos(vertex.position.z * 2.0 + globals.time * 1.5) * 0.5;
    
    // Radial wave from center
    let dist_from_center = length(vertex.position.xz);
    let radial_wave = sin(dist_from_center * 3.0 - globals.time * 3.0) * 0.5;
    
    // Combine waves with coherence
    let combined_wave = (wave_x + wave_z + radial_wave) * globals.coherence_level;
    
    // Apply vertex displacement
    var displaced_pos = vertex.position;
    displaced_pos.y = combined_wave * globals.field_strength * 0.2;
    
    // Additional spiral wave
    let angle = atan2(vertex.position.z, vertex.position.x);
    let spiral_wave = sin(angle * 4.0 + dist_from_center * 2.0 - globals.time) * 0.1;
    displaced_pos.y += spiral_wave * globals.coherence_level;
    
    // Calculate modified normal
    let dx = cos(vertex.position.x * 2.0 + globals.time * 2.0) * 2.0 * 0.5 * globals.field_strength * 0.2;
    let dz = -sin(vertex.position.z * 2.0 + globals.time * 1.5) * 2.0 * 0.5 * globals.field_strength * 0.2;
    let modified_normal = normalize(vec3<f32>(-dx, 1.0, -dz));
    
    out.world_pos = displaced_pos;
    out.clip_position = globals.view_proj * vec4<f32>(displaced_pos, 1.0);
    out.normal = modified_normal;
    out.tex_coords = vertex.tex_coords;
    out.field_intensity = (combined_wave + 1.0) * 0.5; // Normalize to 0-1
    out.wave_phase = globals.time + dist_from_center;
    
    return out;
}

// Fragment shader - renders field with transparency
@fragment
fn fs_field(in: VertexOutput) -> @location(0) vec4<f32> {
    // Base color gradient based on field intensity
    let hue = 200.0 + in.field_intensity * 60.0; // Blue to purple range
    let saturation = 0.7;
    let value = 0.3 + in.field_intensity * 0.4;
    
    // Convert HSV to RGB
    let h = hue / 360.0;
    let c = value * saturation;
    let x = c * (1.0 - abs((h * 6.0) % 2.0 - 1.0));
    let m = value - c;
    
    var rgb: vec3<f32>;
    if (h < 1.0/6.0) {
        rgb = vec3<f32>(c, x, 0.0);
    } else if (h < 2.0/6.0) {
        rgb = vec3<f32>(x, c, 0.0);
    } else if (h < 3.0/6.0) {
        rgb = vec3<f32>(0.0, c, x);
    } else if (h < 4.0/6.0) {
        rgb = vec3<f32>(0.0, x, c);
    } else if (h < 5.0/6.0) {
        rgb = vec3<f32>(x, 0.0, c);
    } else {
        rgb = vec3<f32>(c, 0.0, x);
    }
    
    var color = rgb + m;
    
    // Grid lines for structure
    let grid_x = abs(fract(in.tex_coords.x * 30.0) - 0.5) * 2.0;
    let grid_y = abs(fract(in.tex_coords.y * 30.0) - 0.5) * 2.0;
    let grid_line = 1.0 - smoothstep(0.95, 1.0, max(grid_x, grid_y));
    
    // Add grid glow
    color += vec3<f32>(0.1, 0.1, 0.3) * grid_line;
    
    // Wave interference pattern overlay
    let interference = sin(in.wave_phase * 5.0) * 0.5 + 0.5;
    color = mix(color, vec3<f32>(0.4, 0.3, 0.6), interference * 0.2);
    
    // Calculate alpha based on field intensity and coherence
    var alpha = 0.3 + in.field_intensity * 0.4;
    alpha *= globals.coherence_level;
    
    // Edge fade based on distance from center
    let edge_dist = length(in.world_pos.xz);
    alpha *= smoothstep(2.0, 0.5, edge_dist);
    
    // Add connection lines glow
    if (in.field_intensity > 0.6) {
        let connection_glow = smoothstep(0.6, 0.8, in.field_intensity);
        color += vec3<f32>(0.2, 0.1, 0.3) * connection_glow;
        alpha += connection_glow * 0.2;
    }
    
    return vec4<f32>(color, alpha);
}