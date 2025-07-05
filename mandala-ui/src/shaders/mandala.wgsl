// Mandala Shader - Sacred Geometry Visualization
// "Mathematics as meditation, code as consciousness"

struct MandalaUniforms {
    view_proj: mat4x4<f32>,
    time: f32,
    heartbeat_phase: f32,
    coherence: f32,
    emergence: f32,
    field_color: vec4<f32>,
    participant_count: u32,
}

@group(0) @binding(0)
var<uniform> uniforms: MandalaUniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) tex_coords: vec2<f32>,
    @location(2) sacred_index: f32,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) tex_coords: vec2<f32>,
    @location(1) world_pos: vec3<f32>,
    @location(2) sacred_index: f32,
    @location(3) coherence_factor: f32,
}

// Sacred constants
const PHI: f32 = 1.618033988749895;
const TAU: f32 = 6.283185307179586;
const SACRED_FREQ: f32 = 432.0;

// Vertex shader
@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    
    // Apply heartbeat pulse
    let pulse = 1.0 + sin(uniforms.heartbeat_phase) * 0.1 * uniforms.coherence;
    
    // Sacred rotation based on ring index
    let ring_rotation = uniforms.time * (1.0 + in.sacred_index * 0.1) * uniforms.coherence;
    let cos_r = cos(ring_rotation);
    let sin_r = sin(ring_rotation);
    
    // Rotate position
    var rotated_pos = vec3<f32>(
        in.position.x * cos_r - in.position.y * sin_r,
        in.position.x * sin_r + in.position.y * cos_r,
        in.position.z
    );
    
    // Apply sacred scaling
    rotated_pos *= pulse * (1.0 + in.sacred_index * 0.05);
    
    // Add emergence lift
    rotated_pos.z += uniforms.emergence * sin(uniforms.time + in.sacred_index) * 0.1;
    
    out.world_pos = rotated_pos;
    out.clip_position = uniforms.view_proj * vec4<f32>(rotated_pos, 1.0);
    out.tex_coords = in.tex_coords;
    out.sacred_index = in.sacred_index;
    out.coherence_factor = uniforms.coherence;
    
    return out;
}

// Fragment shader
@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    // Distance from center
    let dist = length(in.tex_coords - vec2<f32>(0.5));
    
    // Sacred geometry patterns
    let angle = atan2(in.tex_coords.y - 0.5, in.tex_coords.x - 0.5);
    let segments = 6.0 * (1.0 + in.sacred_index);
    let segment_angle = TAU / segments;
    let pattern = sin(angle * segments) * 0.5 + 0.5;
    
    // Fractal recursion
    var fractal = 0.0;
    var scale = 1.0;
    for (var i = 0u; i < 5u; i++) {
        let f_dist = dist * scale;
        let f_angle = angle * scale;
        fractal += sin(f_dist * TAU * PHI) * cos(f_angle * segments) / scale;
        scale *= PHI;
    }
    fractal = (fractal + 1.0) * 0.5;
    
    // Color based on coherence and sacred index
    var color = uniforms.field_color.rgb;
    
    // Ring-specific coloring
    if (in.sacred_index > 0.0) {
        let hue_shift = in.sacred_index * 0.1;
        color = hsv_to_rgb(vec3<f32>(
            uniforms.field_color.x + hue_shift,
            uniforms.field_color.y * (0.8 + pattern * 0.2),
            uniforms.field_color.z * (0.7 + fractal * 0.3)
        ));
    }
    
    // Coherence glow
    let glow = exp(-dist * 3.0) * uniforms.coherence;
    color += vec3<f32>(glow * 0.3, glow * 0.2, glow * 0.4);
    
    // Emergence sparkles
    if (uniforms.emergence > 0.1) {
        let sparkle = noise(in.world_pos * 10.0 + uniforms.time) * uniforms.emergence;
        if (sparkle > 0.8) {
            color += vec3<f32>(1.0, 0.9, 0.8) * (sparkle - 0.8) * 5.0;
        }
    }
    
    // Sacred boundaries
    let ring_fade = 1.0 - smoothstep(0.0, 0.02, abs(dist - (in.sacred_index + 1.0) * 0.1));
    
    // Alpha based on pattern and distance
    let alpha = pattern * (1.0 - dist) * in.coherence_factor + ring_fade * 0.5;
    
    return vec4<f32>(color, alpha);
}

// Utility functions
fn hsv_to_rgb(hsv: vec3<f32>) -> vec3<f32> {
    let h = hsv.x;
    let s = hsv.y;
    let v = hsv.z;
    
    let c = v * s;
    let x = c * (1.0 - abs((h / 60.0) % 2.0 - 1.0));
    let m = v - c;
    
    var rgb: vec3<f32>;
    if (h < 60.0) {
        rgb = vec3<f32>(c, x, 0.0);
    } else if (h < 120.0) {
        rgb = vec3<f32>(x, c, 0.0);
    } else if (h < 180.0) {
        rgb = vec3<f32>(0.0, c, x);
    } else if (h < 240.0) {
        rgb = vec3<f32>(0.0, x, c);
    } else if (h < 300.0) {
        rgb = vec3<f32>(x, 0.0, c);
    } else {
        rgb = vec3<f32>(c, 0.0, x);
    }
    
    return rgb + vec3<f32>(m);
}

fn noise(pos: vec3<f32>) -> f32 {
    // Simple pseudo-random for sparkles
    return fract(sin(dot(pos, vec3<f32>(12.9898, 78.233, 45.164))) * 43758.5453);
}