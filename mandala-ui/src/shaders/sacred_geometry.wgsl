// Sacred Geometry Shader - Animated Transformations
// Procedural generation of sacred patterns with GPU acceleration

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
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) pattern_coord: vec3<f32>,
    @location(3) sacred_index: f32,
}

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;
const PHI: f32 = 1.618033988749895; // Golden ratio

// Vertex shader - generates sacred geometry procedurally
@vertex
fn vs_geometry(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    
    // Determine which sacred pattern based on vertex index
    let pattern_id = vertex_index / 3u; // Triangle index
    let vertex_in_triangle = vertex_index % 3u;
    
    // Generate different patterns
    var position: vec3<f32>;
    var pattern_type = (pattern_id / 21u) % 3u; // 3 pattern types, 21 triangles each
    
    if (pattern_type == 0u) {
        // Flower of Life pattern
        position = generate_flower_of_life(pattern_id % 21u, vertex_in_triangle);
    } else if (pattern_type == 1u) {
        // Metatron's Cube
        position = generate_metatron_cube(pattern_id % 21u, vertex_in_triangle);
    } else {
        // Sri Yantra inspired
        position = generate_sri_yantra(pattern_id % 21u, vertex_in_triangle);
    }
    
    // Apply rotation based on coherence
    let rotation = globals.time * 0.5 * globals.coherence_level;
    let cos_r = cos(rotation);
    let sin_r = sin(rotation);
    position.x = position.x * cos_r - position.z * sin_r;
    position.z = position.x * sin_r + position.z * cos_r;
    
    // Scale based on coherence
    position *= 0.5 + globals.coherence_level * 0.5;
    
    out.clip_position = globals.view_proj * vec4<f32>(position, 1.0);
    out.uv = vec2<f32>(position.x + 0.5, position.z + 0.5);
    out.pattern_coord = position;
    out.sacred_index = f32(pattern_type);
    
    // Color based on pattern type and coherence
    let hue = f32(pattern_type) * 120.0 + globals.time * 10.0;
    out.color = hsv_to_rgba(hue, 0.8, 0.7 + globals.coherence_level * 0.3, 0.8);
    
    return out;
}

// Fragment shader - renders sacred patterns with effects
@fragment
fn fs_geometry(in: VertexOutput) -> @location(0) vec4<f32> {
    var color = in.color.rgb;
    var alpha = in.color.a;
    
    // Distance from center for radial effects
    let center_dist = length(in.pattern_coord.xz);
    
    // Sacred geometry line glow
    let line_intensity = 1.0 - smoothstep(0.0, 0.02, center_dist % 0.1);
    color += vec3<f32>(0.2, 0.1, 0.3) * line_intensity;
    
    // Pulsing effect based on sacred index
    let pulse = sin(globals.time * 3.0 + in.sacred_index * PI) * 0.5 + 0.5;
    color *= 0.8 + pulse * 0.2;
    
    // Golden ratio spiral overlay
    let angle = atan2(in.pattern_coord.z, in.pattern_coord.x);
    let spiral = fract(angle / TAU + log(center_dist + 1.0) / log(PHI) - globals.time * 0.1);
    let spiral_line = smoothstep(0.48, 0.5, spiral) * smoothstep(0.52, 0.5, spiral);
    color += vec3<f32>(0.8, 0.6, 0.2) * spiral_line * 0.5;
    
    // Fractal recursion effect
    var fractal_value = 0.0;
    var scale = 1.0;
    for (var i = 0u; i < 5u; i++) {
        let scaled_coord = in.pattern_coord * scale;
        fractal_value += sin(scaled_coord.x * TAU) * cos(scaled_coord.z * TAU) / scale;
        scale *= PHI;
    }
    fractal_value = (fractal_value + 1.0) * 0.5;
    
    // Mix fractal pattern
    color = mix(color, vec3<f32>(0.5, 0.3, 0.7), fractal_value * 0.3);
    
    // Energy field visualization
    let field_wave = sin(center_dist * 10.0 - globals.time * 2.0) * 0.5 + 0.5;
    color += vec3<f32>(0.1, 0.0, 0.2) * field_wave * globals.field_strength * 0.2;
    
    // Coherence-based transparency
    alpha *= globals.coherence_level;
    
    // Edge glow
    let edge_glow = exp(-center_dist * 2.0) * 0.5;
    alpha += edge_glow * 0.3;
    
    return vec4<f32>(color, alpha);
}

// Helper functions for pattern generation
fn generate_flower_of_life(triangle_id: u32, vertex_id: u32) -> vec3<f32> {
    let circle_id = triangle_id / 2u; // 2 triangles per circle segment
    let segment_in_circle = triangle_id % 2u;
    
    // 7 circles in flower of life (1 center + 6 surrounding)
    var center: vec2<f32>;
    if (circle_id == 0u) {
        center = vec2<f32>(0.0, 0.0);
    } else {
        let angle = f32(circle_id - 1u) * TAU / 6.0;
        center = vec2<f32>(cos(angle), sin(angle)) * 0.3;
    }
    
    // Generate triangle vertices for circle segment
    let radius = 0.3;
    let angle_start = f32(segment_in_circle) * PI;
    let angle_step = PI / 3.0;
    
    var vertex_angle: f32;
    if (vertex_id == 0u) {
        vertex_angle = angle_start;
    } else if (vertex_id == 1u) {
        vertex_angle = angle_start + angle_step;
    } else {
        return vec3<f32>(center.x, 0.0, center.y); // Center vertex
    }
    
    let x = center.x + cos(vertex_angle) * radius;
    let z = center.y + sin(vertex_angle) * radius;
    
    return vec3<f32>(x, 0.0, z);
}

fn generate_metatron_cube(triangle_id: u32, vertex_id: u32) -> vec3<f32> {
    // 13 circles in Metatron's Cube arranged in specific pattern
    let vertices_per_shape = 6u;
    let shape_id = triangle_id / vertices_per_shape;
    
    // Hexagon vertices
    let angle = f32(shape_id) * TAU / 6.0;
    let radius = 0.5;
    
    var positions = array<vec2<f32>, 3>();
    positions[0] = vec2<f32>(0.0, 0.0);
    positions[1] = vec2<f32>(cos(angle), sin(angle)) * radius;
    positions[2] = vec2<f32>(cos(angle + TAU/6.0), sin(angle + TAU/6.0)) * radius;
    
    let pos = positions[vertex_id];
    return vec3<f32>(pos.x, 0.0, pos.y);
}

fn generate_sri_yantra(triangle_id: u32, vertex_id: u32) -> vec3<f32> {
    // Simplified Sri Yantra - interlocking triangles
    let layer = triangle_id / 9u; // 9 triangles per layer
    let triangle_in_layer = triangle_id % 9u;
    
    let radius = 0.3 + f32(layer) * 0.1;
    let angle_offset = f32(triangle_in_layer) * TAU / 9.0;
    
    // Alternate between upward and downward triangles
    let is_upward = (triangle_in_layer % 2u) == 0u;
    
    var positions = array<vec2<f32>, 3>();
    if (is_upward) {
        positions[0] = vec2<f32>(0.0, radius);
        positions[1] = vec2<f32>(-radius * 0.866, -radius * 0.5);
        positions[2] = vec2<f32>(radius * 0.866, -radius * 0.5);
    } else {
        positions[0] = vec2<f32>(0.0, -radius);
        positions[1] = vec2<f32>(-radius * 0.866, radius * 0.5);
        positions[2] = vec2<f32>(radius * 0.866, radius * 0.5);
    }
    
    // Rotate triangle
    let cos_a = cos(angle_offset);
    let sin_a = sin(angle_offset);
    let pos = positions[vertex_id];
    let x = pos.x * cos_a - pos.y * sin_a;
    let z = pos.x * sin_a + pos.y * cos_a;
    
    return vec3<f32>(x * 0.5, 0.0, z * 0.5);
}

// Color conversion helper
fn hsv_to_rgba(h: f32, s: f32, v: f32, a: f32) -> vec4<f32> {
    let hue = h / 360.0;
    let c = v * s;
    let x = c * (1.0 - abs((hue * 6.0) % 2.0 - 1.0));
    let m = v - c;
    
    var rgb: vec3<f32>;
    let hue_segment = floor(hue * 6.0);
    
    if (hue_segment == 0.0) {
        rgb = vec3<f32>(c, x, 0.0);
    } else if (hue_segment == 1.0) {
        rgb = vec3<f32>(x, c, 0.0);
    } else if (hue_segment == 2.0) {
        rgb = vec3<f32>(0.0, c, x);
    } else if (hue_segment == 3.0) {
        rgb = vec3<f32>(0.0, x, c);
    } else if (hue_segment == 4.0) {
        rgb = vec3<f32>(x, 0.0, c);
    } else {
        rgb = vec3<f32>(c, 0.0, x);
    }
    
    return vec4<f32>(rgb + m, a);
}