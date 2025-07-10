// Glyph Ring Shader - Sacred Pattern Visualization
// "Each glyph a doorway to transformation"

struct GlyphUniforms {
    view_proj: mat4x4<f32>,
    time: f32,
    selected_glyph: i32,
    hover_glyph: i32,
    total_glyphs: u32,
    ring_rotation: f32,
    coherence: f32,
}

@group(0) @binding(0)
var<uniform> uniforms: GlyphUniforms;

@group(0) @binding(1)
var glyph_texture: texture_2d<f32>;

@group(0) @binding(2)
var glyph_sampler: sampler;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) glyph_id: u32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) glyph_id: u32,
    @location(2) world_pos: vec3<f32>,
    @location(3) glow_factor: f32,
    @location(4) pulse_factor: f32,
}

const PHI: f32 = 1.618033988749895;
const TAU: f32 = 6.283185307179586;

@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    
    // Apply ring rotation
    let cos_r = cos(uniforms.ring_rotation);
    let sin_r = sin(uniforms.ring_rotation);
    var rotated_pos = vec3<f32>(
        in.position.x * cos_r - in.position.y * sin_r,
        in.position.x * sin_r + in.position.y * cos_r,
        in.position.z
    );
    
    // Calculate glow and pulse factors
    let is_selected = i32(in.glyph_id) == uniforms.selected_glyph;
    let is_hovered = i32(in.glyph_id) == uniforms.hover_glyph;
    
    out.glow_factor = 0.0;
    out.pulse_factor = 0.0;
    
    if (is_selected) {
        out.glow_factor = 1.0;
        out.pulse_factor = sin(uniforms.time * 3.0) * 0.5 + 0.5;
        
        // Scale up selected glyph
        rotated_pos *= 1.2 + out.pulse_factor * 0.1;
        
        // Bring forward
        rotated_pos.z += 0.1;
    } else if (is_hovered) {
        out.glow_factor = 0.5;
        out.pulse_factor = sin(uniforms.time * 5.0) * 0.3 + 0.7;
        
        // Slightly scale hovered
        rotated_pos *= 1.1;
    }
    
    // Add coherence-based animation
    let glyph_angle = f32(in.glyph_id) * TAU / f32(uniforms.total_glyphs);
    let coherence_wave = sin(glyph_angle * 3.0 + uniforms.time) * uniforms.coherence * 0.05;
    rotated_pos.z += coherence_wave;
    
    out.world_pos = rotated_pos;
    out.clip_position = uniforms.view_proj * vec4<f32>(rotated_pos, 1.0);
    out.uv = in.uv;
    out.glyph_id = in.glyph_id;
    
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Calculate texture coordinates for atlas
    let glyphs_per_row = 16u;
    let glyph_row = in.glyph_id / glyphs_per_row;
    let glyph_col = in.glyph_id % glyphs_per_row;
    
    let atlas_uv = vec2<f32>(
        (f32(glyph_col) + in.uv.x) / f32(glyphs_per_row),
        (f32(glyph_row) + in.uv.y) / f32(glyphs_per_row)
    );
    
    // Sample glyph texture
    var glyph_color = textureSample(glyph_texture, glyph_sampler, atlas_uv);
    
    // Apply category-based coloring
    let category = get_glyph_category(in.glyph_id);
    var base_color = vec3<f32>(1.0);
    
    if (category == 0u) { // Foundational
        base_color = vec3<f32>(0.3, 0.5, 0.9);
    } else if (category == 1u) { // Applied
        base_color = vec3<f32>(0.5, 0.8, 0.4);
    } else if (category == 2u) { // Threshold
        base_color = vec3<f32>(0.9, 0.4, 0.4);
    } else { // Meta
        base_color = vec3<f32>(0.8, 0.3, 0.8);
    }
    
    // Mix with glyph texture
    var final_color = mix(base_color, glyph_color.rgb, 0.7);
    
    // Add glow effect
    if (in.glow_factor > 0.0) {
        let glow_color = vec3<f32>(0.9, 0.95, 1.0);
        final_color = mix(final_color, glow_color, in.glow_factor * 0.5);
        
        // Add outer glow
        let edge_dist = max(abs(in.uv.x - 0.5), abs(in.uv.y - 0.5)) * 2.0;
        let outer_glow = exp(-edge_dist * 2.0) * in.glow_factor;
        final_color += glow_color * outer_glow * 0.3;
    }
    
    // Sacred geometry overlay
    let center_dist = length(in.uv - vec2<f32>(0.5));
    let sacred_pattern = sin(center_dist * TAU * PHI) * 0.5 + 0.5;
    final_color *= 0.8 + sacred_pattern * 0.2;
    
    // Coherence shimmer
    let shimmer = sin(uniforms.time * 2.0 + f32(in.glyph_id) * 0.5) * uniforms.coherence * 0.1;
    final_color += vec3<f32>(shimmer);
    
    // Alpha calculation
    var alpha = glyph_color.a;
    
    // Fade edges
    let edge_fade = 1.0 - smoothstep(0.4, 0.5, center_dist);
    alpha *= edge_fade;
    
    // Pulse alpha for selected
    if (in.glow_factor > 0.9) {
        alpha = mix(alpha, 1.0, in.pulse_factor * 0.3);
    }
    
    return vec4<f32>(final_color, alpha * 0.9);
}

fn get_glyph_category(glyph_id: u32) -> u32 {
    if (glyph_id < 45u) {
        return 0u; // Foundational
    } else if (glyph_id < 57u) {
        return 1u; // Applied
    } else if (glyph_id < 66u) {
        return 2u; // Threshold
    } else {
        return 3u; // Meta
    }
}