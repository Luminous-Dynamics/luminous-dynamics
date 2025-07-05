// FFT Compute Shader for Spectral Analysis
// Cooley-Tukey radix-2 FFT implementation for GPU

struct Complex {
    real: f32,
    imag: f32,
}

@group(0) @binding(0) var<storage, read_write> input_data: array<Complex>;
@group(0) @binding(1) var<storage, read_write> output_data: array<Complex>;
@group(0) @binding(2) var<uniform> fft_params: FFTParams;

struct FFTParams {
    size: u32,
    log_size: u32,
    inverse: u32,
    _padding: u32,
}

const PI: f32 = 3.14159265359;
const TAU: f32 = 6.28318530718;

// Complex multiplication
fn complex_mul(a: Complex, b: Complex) -> Complex {
    return Complex(
        a.real * b.real - a.imag * b.imag,
        a.real * b.imag + a.imag * b.real
    );
}

// Complex addition
fn complex_add(a: Complex, b: Complex) -> Complex {
    return Complex(a.real + b.real, a.imag + b.imag);
}

// Complex subtraction
fn complex_sub(a: Complex, b: Complex) -> Complex {
    return Complex(a.real - b.real, a.imag - b.imag);
}

// Twiddle factor calculation
fn twiddle_factor(k: u32, N: u32, inverse: bool) -> Complex {
    let angle = TAU * f32(k) / f32(N);
    let sign = select(-1.0, 1.0, inverse);
    return Complex(cos(angle), sign * sin(angle));
}

// Bit reversal for FFT
fn bit_reverse(x: u32, log_n: u32) -> u32 {
    var result = 0u;
    var temp = x;
    
    for (var i = 0u; i < log_n; i++) {
        result = (result << 1u) | (temp & 1u);
        temp >>= 1u;
    }
    
    return result;
}

// Radix-2 FFT kernel
@compute @workgroup_size(256)
fn fft_radix2(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let tid = global_id.x;
    let size = fft_params.size;
    let log_size = fft_params.log_size;
    let inverse = fft_params.inverse != 0u;
    
    if (tid >= size / 2u) {
        return;
    }
    
    // Copy input to output with bit reversal
    let idx1 = bit_reverse(tid * 2u, log_size);
    let idx2 = bit_reverse(tid * 2u + 1u, log_size);
    
    output_data[idx1] = input_data[tid * 2u];
    output_data[idx2] = input_data[tid * 2u + 1u];
    
    workgroupBarrier();
    
    // Cooley-Tukey FFT
    for (var stage = 1u; stage <= log_size; stage++) {
        let m = 1u << stage;  // 2^stage
        let m2 = m >> 1u;     // m/2
        
        let group = tid / m2;
        let pair = tid % m2;
        
        let idx_a = group * m + pair;
        let idx_b = idx_a + m2;
        
        let w = twiddle_factor(pair * (size / m), size, inverse);
        
        let a = output_data[idx_a];
        let b = complex_mul(output_data[idx_b], w);
        
        output_data[idx_a] = complex_add(a, b);
        output_data[idx_b] = complex_sub(a, b);
        
        workgroupBarrier();
    }
    
    // Scale for inverse FFT
    if (inverse) {
        let scale = 1.0 / f32(size);
        output_data[tid * 2u].real *= scale;
        output_data[tid * 2u].imag *= scale;
        output_data[tid * 2u + 1u].real *= scale;
        output_data[tid * 2u + 1u].imag *= scale;
    }
}

// Power spectrum calculation
@compute @workgroup_size(256)
fn power_spectrum(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;
    let size = arrayLength(&input_data);
    
    if (idx >= size) {
        return;
    }
    
    let c = input_data[idx];
    let power = c.real * c.real + c.imag * c.imag;
    
    // Store power in real component, zero in imaginary
    output_data[idx] = Complex(power, 0.0);
}

// Find spectral peaks for coherence analysis
@compute @workgroup_size(64)
fn find_spectral_peaks(@builtin(global_invocation_id) global_id: vec3<u32>,
                      @builtin(local_invocation_id) local_id: vec3<u32>) {
    let tid = global_id.x;
    let lid = local_id.x;
    
    // Shared memory for local maxima
    var<workgroup> local_maxima: array<f32, 64>;
    var<workgroup> local_indices: array<u32, 64>;
    
    let spectrum_size = arrayLength(&input_data);
    let chunk_size = (spectrum_size + 63u) / 64u;
    let start_idx = tid * chunk_size;
    let end_idx = min((tid + 1u) * chunk_size, spectrum_size);
    
    // Find local maximum in this thread's chunk
    var max_power = 0.0;
    var max_idx = start_idx;
    
    for (var i = start_idx; i < end_idx; i++) {
        let power = input_data[i].real;
        if (power > max_power) {
            max_power = power;
            max_idx = i;
        }
    }
    
    local_maxima[lid] = max_power;
    local_indices[lid] = max_idx;
    
    workgroupBarrier();
    
    // Reduction to find global maximum
    for (var stride = 32u; stride > 0u; stride >>= 1u) {
        if (lid < stride) {
            if (local_maxima[lid + stride] > local_maxima[lid]) {
                local_maxima[lid] = local_maxima[lid + stride];
                local_indices[lid] = local_indices[lid + stride];
            }
        }
        workgroupBarrier();
    }
    
    // Thread 0 stores the result
    if (lid == 0u) {
        // Convert index to frequency
        let peak_freq = f32(local_indices[0]) / f32(spectrum_size) * 100.0; // Assuming 100Hz sample rate
        output_data[0] = Complex(peak_freq, local_maxima[0]);
    }
}

// Welch's method for power spectral density
@compute @workgroup_size(256)
fn welch_psd(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;
    let window_size = 256u;
    let overlap = 128u;
    let num_windows = (arrayLength(&input_data) - window_size) / (window_size - overlap) + 1u;
    
    if (idx >= window_size) {
        return;
    }
    
    var accumulator = Complex(0.0, 0.0);
    
    // Process each window
    for (var w = 0u; w < num_windows; w++) {
        let window_start = w * (window_size - overlap);
        
        // Apply Hanning window
        let n = f32(idx);
        let N = f32(window_size);
        let hanning = 0.5 - 0.5 * cos(TAU * n / (N - 1.0));
        
        let sample = input_data[window_start + idx];
        let windowed = Complex(sample.real * hanning, sample.imag * hanning);
        
        // Accumulate power
        accumulator.real += windowed.real * windowed.real;
        accumulator.imag += windowed.imag * windowed.imag;
    }
    
    // Average and store
    let avg_power = (accumulator.real + accumulator.imag) / f32(num_windows);
    output_data[idx] = Complex(avg_power, 0.0);
}