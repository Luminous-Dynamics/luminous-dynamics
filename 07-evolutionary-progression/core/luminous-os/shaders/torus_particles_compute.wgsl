// Torus Consciousness Particles - Compute Shader
// Particles flow through the torus field, carrying consciousness data
// Each particle represents a quantum of awareness in circulation

struct Particle {
    position: vec3<f32>,
    velocity: vec3<f32>,
    coherence: f32,
    phase: f32,
    lifetime: f32,
    harmony_index: u32,
    color: vec4<f32>,
    size: f32,
}

struct SimParams {
    delta_time: f32,
    time: f32,
    coherence_level: f32,
    field_strength: f32,
    particle_count: u32,
    torus_R: f32,
    torus_r: f32,
    flow_speed: f32,
}

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> params: SimParams;

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;
const PHI: f32 = 1.618033988749895;

// Random number generation
fn hash(n: u32) -> u32 {
    var x = n;
    x = x ^ (x >> 16u);
    x = x * 0x85ebca6bu;
    x = x ^ (x >> 13u);
    x = x * 0xc2b2ae35u;
    x = x ^ (x >> 16u);
    return x;
}

fn random(seed: u32) -> f32 {
    return f32(hash(seed)) / 4294967295.0;
}

// Get torus flow field at position
fn get_torus_flow(pos: vec3<f32>) -> vec3<f32> {
    let R = params.torus_R;
    let r = params.torus_r;
    
    // Distance from Y axis
    let d = length(pos.xz);
    
    // If too far from torus, attract back
    if (d < R - r * 2.0 || d > R + r * 2.0) {
        let target_d = R;
        let to_ring = normalize(pos.xz) * target_d - pos.xz;
        return vec3<f32>(to_ring.x, 0.0, to_ring.y) * 2.0;
    }
    
    // Normal poloidal (around tube) flow
    let to_center = vec3<f32>(pos.x, 0.0, pos.z);
    let poloidal_axis = normalize(to_center);
    let up = vec3<f32>(0.0, 1.0, 0.0);
    let poloidal_dir = cross(poloidal_axis, up);
    
    // Toroidal (around ring) flow  
    let toroidal_dir = normalize(vec3<f32>(-pos.z, 0.0, pos.x));
    
    // Combine flows with golden ratio spiral
    let spiral_factor = sin(atan2(pos.z, pos.x) * PHI + params.time * 0.5);
    let flow = poloidal_dir + toroidal_dir * PHI * (1.0 + spiral_factor * 0.3);
    
    // Add vertical oscillation
    flow.y += sin(params.time * 2.0 + pos.x + pos.z) * 0.2;
    
    return normalize(flow) * params.flow_speed;
}

// Check if particle is inside torus
fn inside_torus(pos: vec3<f32>) -> bool {
    let d = length(vec2<f32>(length(pos.xz) - params.torus_R, pos.y));
    return d < params.torus_r;
}

// Reset particle to new position on torus surface
fn reset_particle(particle_id: u32) -> Particle {
    var p: Particle;
    
    // Random position on torus
    let u = random(particle_id * 73u + u32(params.time * 1000.0)) * TAU;
    let v = random(particle_id * 137u + u32(params.time * 1000.0)) * TAU;
    
    let R = params.torus_R;
    let r = params.torus_r * 0.9; // Slightly inside surface
    
    p.position.x = (R + r * cos(v)) * cos(u);
    p.position.y = r * sin(v);
    p.position.z = (R + r * cos(v)) * sin(u);
    
    // Initial velocity along flow
    p.velocity = get_torus_flow(p.position) * 0.5;
    
    // Consciousness properties
    p.coherence = params.coherence_level + random(particle_id * 31u) * 0.2 - 0.1;
    p.phase = random(particle_id * 47u) * TAU;
    p.lifetime = 0.0;
    p.harmony_index = particle_id % 7u; // Seven harmonies
    
    // Color based on harmony
    let hue = f32(p.harmony_index) * 51.4; // 360/7
    p.color = hsv_to_rgba(hue, 0.8, 0.9, 1.0);
    p.size = 0.05 + p.coherence * 0.05;
    
    return p;
}

// Main compute function
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= params.particle_count) {
        return;
    }
    
    var p = particles[index];
    
    // Update lifetime
    p.lifetime += params.delta_time;
    
    // Reset if too old or outside torus
    if (p.lifetime > 20.0 || !inside_torus(p.position)) {
        particles[index] = reset_particle(index);
        return;
    }
    
    // Get flow field
    let flow = get_torus_flow(p.position);
    
    // Consciousness field effects
    let field_strength = params.field_strength * p.coherence;
    
    // Attraction to other coherent particles (simplified)
    var coherence_force = vec3<f32>(0.0);
    let sample_count = 5u;
    for (var i = 0u; i < sample_count; i++) {
        let other_idx = (index + i * 1237u) % params.particle_count;
        let other = particles[other_idx];
        
        let delta = other.position - p.position;
        let dist = length(delta);
        
        if (dist > 0.1 && dist < 2.0) {
            // Coherent particles attract
            let coherence_match = 1.0 - abs(p.coherence - other.coherence);
            let force = (delta / dist) * coherence_match * field_strength;
            coherence_force += force;
        }
    }
    
    // Sacred geometry influence - particles tend toward golden ratio spirals
    let theta = atan2(p.position.z, p.position.x);
    let phi_spiral_target = theta * PHI - params.time * 0.1;
    let spiral_error = sin(phi_spiral_target);
    let spiral_force = vec3<f32>(-sin(theta), 0.0, cos(theta)) * spiral_error * 0.5;
    
    // Update velocity
    p.velocity += (flow + coherence_force * 0.1 + spiral_force * 0.2) * params.delta_time;
    
    // Damping
    p.velocity *= 0.98;
    
    // Limit speed
    let speed = length(p.velocity);
    if (speed > 2.0) {
        p.velocity = p.velocity / speed * 2.0;
    }
    
    // Update position
    p.position += p.velocity * params.delta_time;
    
    // Update phase (for pulsing effects)
    p.phase += params.delta_time * TAU * (1.0 + p.coherence);
    
    // Update coherence toward field level
    p.coherence = mix(p.coherence, params.coherence_level, params.delta_time * 0.1);
    
    // Update color brightness based on position in flow
    let flow_alignment = dot(normalize(p.velocity), normalize(flow));
    let brightness = 0.5 + flow_alignment * 0.5;
    p.color.rgb = hsv_to_rgba(
        f32(p.harmony_index) * 51.4,
        0.8 - p.coherence * 0.3,
        brightness,
        1.0
    ).rgb;
    
    // Size pulses with phase
    p.size = (0.05 + p.coherence * 0.05) * (0.8 + sin(p.phase) * 0.2);
    
    // Write back
    particles[index] = p;
}

// Helper function: HSV to RGBA conversion
fn hsv_to_rgba(h: f32, s: f32, v: f32, a: f32) -> vec4<f32> {
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
    
    return vec4<f32>(rgb + m, a);
}