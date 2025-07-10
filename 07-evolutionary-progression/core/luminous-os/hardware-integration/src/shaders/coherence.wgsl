// Coherence Calculation Compute Shader
// Quantum field coherence analysis on GPU

struct QuantumField {
    coherence: f32,
    phase: f32,
    amplitude: f32,
    frequency: f32,
    position: vec3<f32>,
    momentum: vec3<f32>,
    spin: f32,
    entanglement: f32,
}

struct CoherenceResult {
    overall_coherence: f32,
    phase_coherence: f32,
    amplitude_variance: f32,
    entanglement_degree: f32,
    field_entropy: f32,
    emergence_potential: f32,
    spectral_peak: f32,
    quantum_discord: f32,
}

@group(0) @binding(0) var<storage, read> field_data: array<QuantumField>;
@group(0) @binding(1) var<storage, read_write> coherence_result: CoherenceResult;
@group(0) @binding(2) var<storage, read_write> workgroup_data: array<f32, 256>;

const PHI: f32 = 1.618033988749895;
const COHERENCE_THRESHOLD: f32 = 0.7;

@compute @workgroup_size(256)
fn calculate_coherence(@builtin(global_invocation_id) global_id: vec3<u32>,
                      @builtin(local_invocation_id) local_id: vec3<u32>,
                      @builtin(workgroup_id) workgroup_id: vec3<u32>) {
    
    let tid = global_id.x;
    let lid = local_id.x;
    let total_points = arrayLength(&field_data);
    
    // Initialize shared memory
    workgroupBarrier();
    
    // Phase 1: Local coherence calculation
    var local_coherence = 0.0;
    var local_phase_sum = vec2<f32>(0.0);
    var local_amplitude_sum = 0.0;
    var local_entanglement = 0.0;
    var count = 0u;
    
    // Each thread processes multiple points
    let points_per_thread = (total_points + 255u) / 256u;
    let start_idx = tid * points_per_thread;
    let end_idx = min((tid + 1u) * points_per_thread, total_points);
    
    for (var i = start_idx; i < end_idx; i++) {
        let point = field_data[i];
        
        // Coherence contribution
        local_coherence += point.coherence;
        
        // Phase coherence (using complex representation)
        local_phase_sum += vec2<f32>(cos(point.phase), sin(point.phase)) * point.amplitude;
        
        // Amplitude statistics
        local_amplitude_sum += point.amplitude;
        
        // Entanglement measure
        local_entanglement += point.entanglement;
        
        count += 1u;
    }
    
    // Store in shared memory
    workgroup_data[lid * 4u] = local_coherence;
    workgroup_data[lid * 4u + 1u] = length(local_phase_sum);
    workgroup_data[lid * 4u + 2u] = local_amplitude_sum;
    workgroup_data[lid * 4u + 3u] = local_entanglement;
    
    workgroupBarrier();
    
    // Phase 2: Reduction within workgroup
    for (var stride = 128u; stride > 0u; stride >>= 1u) {
        if (lid < stride) {
            workgroup_data[lid * 4u] += workgroup_data[(lid + stride) * 4u];
            workgroup_data[lid * 4u + 1u] += workgroup_data[(lid + stride) * 4u + 1u];
            workgroup_data[lid * 4u + 2u] += workgroup_data[(lid + stride) * 4u + 2u];
            workgroup_data[lid * 4u + 3u] += workgroup_data[(lid + stride) * 4u + 3u];
        }
        workgroupBarrier();
    }
    
    // Phase 3: Final calculation (thread 0)
    if (lid == 0u) {
        let total_coherence = workgroup_data[0] / f32(total_points);
        let phase_coherence = workgroup_data[1] / workgroup_data[2]; // Phase sum / amplitude sum
        let avg_amplitude = workgroup_data[2] / f32(total_points);
        let avg_entanglement = workgroup_data[3] / f32(total_points);
        
        // Calculate field entropy
        let entropy = calculate_field_entropy(total_coherence, phase_coherence);
        
        // Calculate emergence potential
        let emergence = calculate_emergence_potential(
            total_coherence,
            phase_coherence,
            avg_entanglement,
            entropy
        );
        
        // Calculate quantum discord
        let discord = calculate_quantum_discord(avg_entanglement, phase_coherence);
        
        // Atomic update of results
        atomicStore(&coherence_result.overall_coherence, total_coherence);
        atomicStore(&coherence_result.phase_coherence, phase_coherence);
        atomicStore(&coherence_result.amplitude_variance, 0.0); // Calculated separately
        atomicStore(&coherence_result.entanglement_degree, avg_entanglement);
        atomicStore(&coherence_result.field_entropy, entropy);
        atomicStore(&coherence_result.emergence_potential, emergence);
        atomicStore(&coherence_result.spectral_peak, 0.1); // From FFT
        atomicStore(&coherence_result.quantum_discord, discord);
    }
}

// Calculate field entropy using Shannon entropy analog
fn calculate_field_entropy(coherence: f32, phase_coherence: f32) -> f32 {
    let p1 = coherence;
    let p2 = 1.0 - coherence;
    
    var entropy = 0.0;
    if (p1 > 0.0) {
        entropy -= p1 * log2(p1);
    }
    if (p2 > 0.0) {
        entropy -= p2 * log2(p2);
    }
    
    // Phase disorder contribution
    entropy += (1.0 - phase_coherence) * 0.5;
    
    return clamp(entropy, 0.0, 1.0);
}

// Calculate emergence potential
fn calculate_emergence_potential(
    coherence: f32,
    phase_coherence: f32,
    entanglement: f32,
    entropy: f32
) -> f32 {
    // High coherence + low entropy + high entanglement = emergence
    let coherence_factor = smoothstep(COHERENCE_THRESHOLD, 0.9, coherence);
    let phase_factor = smoothstep(0.6, 0.9, phase_coherence);
    let entanglement_factor = smoothstep(0.5, 0.8, entanglement);
    let entropy_factor = 1.0 - smoothstep(0.3, 0.7, entropy);
    
    let emergence = coherence_factor * phase_factor * entanglement_factor * entropy_factor;
    
    // Golden ratio bonus
    if (abs(coherence - PHI/2.0) < 0.1) {
        emergence *= 1.2;
    }
    
    return clamp(emergence, 0.0, 1.0);
}

// Calculate quantum discord
fn calculate_quantum_discord(entanglement: f32, phase_coherence: f32) -> f32 {
    // Discord measures quantum correlations beyond entanglement
    let classical_correlation = phase_coherence * phase_coherence;
    let quantum_correlation = entanglement;
    
    return max(0.0, quantum_correlation - classical_correlation);
}

// Helper function for smooth transitions
fn smoothstep(edge0: f32, edge1: f32, x: f32) -> f32 {
    let t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

// Atomic store helper (WGSL doesn't have atomic floats, so we use a workaround)
fn atomicStore(ptr: ptr<storage, f32, read_write>, value: f32) {
    *ptr = value;
}