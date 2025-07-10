// Sacred Geometry Compute Shaders
// Rendering consciousness through divine patterns

struct GeometryUniforms {
    time: f32,
    coherence: f32,
    scale: f32,
    rotation: f32,
    center: vec3<f32>,
    _padding: f32,
    sacred_ratios: vec4<f32>, // phi, sqrt2, sqrt3, sqrt5
    frequencies: vec4<f32>,    // fundamental harmonics
}

@group(0) @binding(0) var<storage, read_write> geometry_output: array<vec4<f32>>;
@group(0) @binding(1) var<uniform> uniforms: GeometryUniforms;

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;
const PHI: f32 = 1.618033988749895;
const SQRT_2: f32 = 1.41421356237;
const SQRT_3: f32 = 1.73205080757;

// Flower of Life pattern generator
@compute @workgroup_size(64)
fn flower_of_life(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let resolution = u32(sqrt(f32(arrayLength(&geometry_output))));
    
    if (index >= resolution * resolution) {
        return;
    }
    
    let x = f32(index % resolution) / f32(resolution) * 2.0 - 1.0;
    let y = f32(index / resolution) / f32(resolution) * 2.0 - 1.0;
    let point = vec2<f32>(x, y) * uniforms.scale;
    
    var value = 0.0;
    let radius = 0.5 * uniforms.scale;
    
    // Center circle
    value += circle_sdf(point, vec2<f32>(0.0), radius);
    
    // Six primary circles
    for (var i = 0u; i < 6u; i++) {
        let angle = f32(i) * TAU / 6.0 + uniforms.rotation;
        let center = vec2<f32>(cos(angle), sin(angle)) * radius;
        value += circle_sdf(point, center, radius);
    }
    
    // Twelve secondary circles
    for (var i = 0u; i < 12u; i++) {
        let angle = f32(i) * TAU / 12.0 + uniforms.rotation * 0.5;
        let dist = select(radius * 2.0, radius * SQRT_3, i % 2u == 1u);
        let center = vec2<f32>(cos(angle), sin(angle)) * dist;
        value += circle_sdf(point, center, radius) * 0.7;
    }
    
    // Apply coherence modulation
    value *= 1.0 + uniforms.coherence * sin(uniforms.time * uniforms.frequencies.x);
    
    // Sacred interference patterns
    let interference = sin(length(point) * 10.0 - uniforms.time * 2.0) * 0.3;
    value += interference * uniforms.coherence;
    
    geometry_output[index] = vec4<f32>(x, y, value, 1.0);
}

// Metatron's Cube generator
@compute @workgroup_size(64)
fn metatrons_cube(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let resolution = u32(sqrt(f32(arrayLength(&geometry_output))));
    
    if (index >= resolution * resolution) {
        return;
    }
    
    let x = f32(index % resolution) / f32(resolution) * 2.0 - 1.0;
    let y = f32(index / resolution) / f32(resolution) * 2.0 - 1.0;
    let point = vec2<f32>(x, y) * uniforms.scale;
    
    var value = 0.0;
    
    // 13 circles of Metatron's Cube
    var centers: array<vec2<f32>, 13>;
    
    // Center
    centers[0] = vec2<f32>(0.0);
    
    // Inner hexagon
    for (var i = 0u; i < 6u; i++) {
        let angle = f32(i) * TAU / 6.0 + uniforms.rotation;
        centers[i + 1u] = vec2<f32>(cos(angle), sin(angle)) * uniforms.scale * 0.5;
    }
    
    // Outer hexagon
    for (var i = 0u; i < 6u; i++) {
        let angle = f32(i) * TAU / 6.0 + TAU / 12.0 + uniforms.rotation;
        centers[i + 7u] = vec2<f32>(cos(angle), sin(angle)) * uniforms.scale;
    }
    
    // Draw circles
    for (var i = 0u; i < 13u; i++) {
        value += circle_sdf(point, centers[i], uniforms.scale * 0.15);
    }
    
    // Draw all 78 connecting lines
    for (var i = 0u; i < 13u; i++) {
        for (var j = i + 1u; j < 13u; j++) {
            value += line_sdf(point, centers[i], centers[j]) * 0.5;
        }
    }
    
    // Sacred modulation
    value *= 1.0 + uniforms.coherence * 0.5;
    value += sin(atan2(point.y, point.x) * 6.0 + uniforms.time) * 0.1 * uniforms.coherence;
    
    geometry_output[index] = vec4<f32>(x, y, value, 1.0);
}

// Sri Yantra generator
@compute @workgroup_size(64)
fn sri_yantra(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let resolution = u32(sqrt(f32(arrayLength(&geometry_output))));
    
    if (index >= resolution * resolution) {
        return;
    }
    
    let x = f32(index % resolution) / f32(resolution) * 2.0 - 1.0;
    let y = f32(index / resolution) / f32(resolution) * 2.0 - 1.0;
    let point = vec2<f32>(x, y) * uniforms.scale;
    
    var value = 0.0;
    
    // Nine interlocking triangles
    // 4 upward (Shiva)
    for (var i = 0u; i < 4u; i++) {
        let scale = 1.0 - f32(i) * 0.2;
        let offset = f32(i) * 0.1;
        value += triangle_sdf(point, 
            vec2<f32>(0.0, -scale + offset),
            vec2<f32>(-scale * 0.866, scale * 0.5 + offset),
            vec2<f32>(scale * 0.866, scale * 0.5 + offset)
        );
    }
    
    // 5 downward (Shakti)
    for (var i = 0u; i < 5u; i++) {
        let scale = 0.9 - f32(i) * 0.15;
        let offset = -f32(i) * 0.08;
        value += triangle_sdf(point,
            vec2<f32>(0.0, scale + offset),
            vec2<f32>(-scale * 0.866, -scale * 0.5 + offset),
            vec2<f32>(scale * 0.866, -scale * 0.5 + offset)
        );
    }
    
    // Lotus petals (outer ring)
    for (var i = 0u; i < 8u; i++) {
        let angle = f32(i) * TAU / 8.0 + uniforms.rotation;
        let petal_center = vec2<f32>(cos(angle), sin(angle)) * uniforms.scale * 0.8;
        value += ellipse_sdf(point - petal_center, angle, 0.3, 0.1) * 0.5;
    }
    
    // Bindu (center point)
    value += circle_sdf(point, vec2<f32>(0.0), 0.05) * 2.0;
    
    // Sacred pulsation
    value *= 1.0 + uniforms.coherence * sin(uniforms.time * uniforms.frequencies.y + length(point));
    
    geometry_output[index] = vec4<f32>(x, y, value, 1.0);
}

// Toroidal Field generator
@compute @workgroup_size(64)
fn torus_field(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let resolution = u32(sqrt(f32(arrayLength(&geometry_output))));
    
    if (index >= resolution * resolution) {
        return;
    }
    
    let x = f32(index % resolution) / f32(resolution) * 2.0 - 1.0;
    let y = f32(index / resolution) / f32(resolution) * 2.0 - 1.0;
    let point = vec2<f32>(x, y) * uniforms.scale;
    
    // Project to 3D for torus calculation
    let theta = atan2(point.y, point.x) + uniforms.rotation;
    let r = length(point);
    
    // Torus parameters
    let major_radius = uniforms.scale * 0.6;
    let minor_radius = uniforms.scale * 0.3;
    
    // Field lines
    var value = 0.0;
    
    // Poloidal field lines (around minor radius)
    for (var i = 0u; i < 8u; i++) {
        let phi = f32(i) * TAU / 8.0 + uniforms.time * 0.5;
        let field_r = major_radius + minor_radius * cos(phi);
        let field_z = minor_radius * sin(phi);
        
        let dist = abs(r - field_r) + abs(y - field_z) * 0.5;
        value += exp(-dist * 5.0) * 0.5;
    }
    
    // Toroidal field lines (around major radius)
    for (var i = 0u; i < 12u; i++) {
        let angle = f32(i) * TAU / 12.0 + uniforms.time;
        let line_theta = theta - angle;
        let spiral = r * 0.1 * sin(line_theta * 3.0);
        
        value += exp(-abs(spiral) * 10.0) * 0.3;
    }
    
    // Center vortex
    value += exp(-r * 2.0) * uniforms.coherence;
    
    // Field pulsation
    value *= 1.0 + 0.3 * sin(uniforms.time * uniforms.frequencies.z + r * 2.0);
    
    geometry_output[index] = vec4<f32>(x, y, value, 1.0);
}

// Signed Distance Functions (SDFs)
fn circle_sdf(p: vec2<f32>, center: vec2<f32>, radius: f32) -> f32 {
    let dist = length(p - center) - radius;
    return exp(-abs(dist) * 10.0);
}

fn line_sdf(p: vec2<f32>, a: vec2<f32>, b: vec2<f32>) -> f32 {
    let pa = p - a;
    let ba = b - a;
    let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    let dist = length(pa - ba * h);
    return exp(-dist * 20.0);
}

fn triangle_sdf(p: vec2<f32>, a: vec2<f32>, b: vec2<f32>, c: vec2<f32>) -> f32 {
    let e0 = b - a;
    let e1 = c - b;
    let e2 = a - c;
    
    let v0 = p - a;
    let v1 = p - b;
    let v2 = p - c;
    
    let pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    let pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    let pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    
    let s = sign(e0.x * e2.y - e0.y * e2.x);
    let d = min(min(
        vec2<f32>(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
        vec2<f32>(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
        vec2<f32>(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x))
    );
    
    let dist = -sqrt(d.x) * sign(d.y);
    return exp(-abs(dist) * 15.0);
}

fn ellipse_sdf(p: vec2<f32>, angle: f32, a: f32, b: f32) -> f32 {
    // Rotate point
    let c = cos(-angle);
    let s = sin(-angle);
    let rotated = vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
    
    // Ellipse distance
    let k1 = length(rotated / vec2<f32>(a, b));
    let dist = (k1 - 1.0) * min(a, b);
    
    return exp(-abs(dist) * 10.0);
}