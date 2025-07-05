// Biometric Initialization - Heart coherence at boot
// "The heart awakens before the mind"

#![no_std]

use x86_64::instructions::port::{Port, PortReadOnly};
use core::hint::spin_loop;

/// Supported biometric device types
#[derive(Debug, Clone, Copy)]
pub enum BiometricDevice {
    HeartMath,
    Muse,
    EmotivEpoc,
    Generic,
}

/// HRV sensor detection results
pub struct HRVSensor {
    pub device_type: BiometricDevice,
    pub port_base: u16,
    pub current_heart_rate: f32,
    pub coherence_score: f32,
}

/// Probe for HRV/biometric sensors
pub fn probe_hrv_sensors() -> bool {
    // Check USB HID devices
    if probe_usb_hrv() {
        return true;
    }
    
    // Check serial ports for HRV devices
    if probe_serial_hrv() {
        return true;
    }
    
    // Check for Bluetooth LE devices
    if probe_bluetooth_hrv() {
        return true;
    }
    
    false
}

/// Initialize biometric subsystem
pub fn initialize_biometric_system() -> Option<HRVSensor> {
    // Try to detect and initialize various HRV sensors
    
    // HeartMath emWave
    if let Some(sensor) = init_heartmath_sensor() {
        return Some(sensor);
    }
    
    // Muse headband
    if let Some(sensor) = init_muse_sensor() {
        return Some(sensor);
    }
    
    // Generic HRV over serial
    if let Some(sensor) = init_generic_serial_hrv() {
        return Some(sensor);
    }
    
    None
}

/// Get current coherence reading
pub fn read_coherence(sensor: &HRVSensor) -> f32 {
    match sensor.device_type {
        BiometricDevice::HeartMath => read_heartmath_coherence(sensor.port_base),
        BiometricDevice::Muse => read_muse_coherence(sensor.port_base),
        _ => calculate_generic_coherence(sensor.current_heart_rate),
    }
}

/// Probe USB for HRV devices
fn probe_usb_hrv() -> bool {
    // Check UHCI/EHCI/xHCI controllers
    // This is simplified - real implementation would enumerate USB devices
    
    unsafe {
        // Check for UHCI controller (legacy USB 1.1)
        let mut cmd_port = Port::<u16>::new(0xC000); // Common UHCI base
        let cmd = cmd_port.read();
        
        if cmd != 0xFFFF {
            // Controller exists, would enumerate devices here
            return false; // For now, assume no HRV device
        }
    }
    
    false
}

/// Probe serial ports for HRV devices
fn probe_serial_hrv() -> bool {
    const SERIAL_PORTS: [u16; 4] = [0x3F8, 0x2F8, 0x3E8, 0x2E8]; // COM1-4
    
    for &port_base in &SERIAL_PORTS {
        if probe_serial_port(port_base) {
            // Try to detect HRV protocol
            if detect_hrv_protocol(port_base) {
                return true;
            }
        }
    }
    
    false
}

/// Probe Bluetooth for HRV devices
fn probe_bluetooth_hrv() -> bool {
    // This would require Bluetooth stack initialization
    // For boot environment, we skip this
    false
}

/// Initialize HeartMath sensor
fn init_heartmath_sensor() -> Option<HRVSensor> {
    // HeartMath typically uses USB HID
    // For demo, simulate detection
    None
}

/// Initialize Muse sensor
fn init_muse_sensor() -> Option<HRVSensor> {
    // Muse uses Bluetooth LE
    // For boot environment, not available
    None
}

/// Initialize generic serial HRV
fn init_generic_serial_hrv() -> Option<HRVSensor> {
    const SERIAL_BASE: u16 = 0x3F8; // COM1
    
    // Initialize serial port
    init_serial_port(SERIAL_BASE, 9600);
    
    // Send initialization command
    send_serial_string(SERIAL_BASE, "HRV:INIT\r\n");
    
    // Wait for response
    wait_ms(100);
    
    // Check for valid response
    if let Some(response) = read_serial_line(SERIAL_BASE) {
        if response.starts_with("HRV:OK") {
            return Some(HRVSensor {
                device_type: BiometricDevice::Generic,
                port_base: SERIAL_BASE,
                current_heart_rate: 70.0,
                coherence_score: 0.5,
            });
        }
    }
    
    None
}

/// Probe if serial port exists
fn probe_serial_port(port_base: u16) -> bool {
    unsafe {
        // Check Line Status Register
        let mut lsr_port = PortReadOnly::<u8>::new(port_base + 5);
        let lsr = lsr_port.read();
        
        // If all bits set, probably no device
        lsr != 0xFF
    }
}

/// Initialize serial port
fn init_serial_port(port_base: u16, baud_rate: u32) {
    unsafe {
        // Disable interrupts
        let mut ier_port = Port::<u8>::new(port_base + 1);
        ier_port.write(0x00);
        
        // Enable DLAB
        let mut lcr_port = Port::<u8>::new(port_base + 3);
        lcr_port.write(0x80);
        
        // Set baud rate
        let divisor = 115200 / baud_rate;
        let mut dll_port = Port::<u8>::new(port_base);
        let mut dlm_port = Port::<u8>::new(port_base + 1);
        dll_port.write((divisor & 0xFF) as u8);
        dlm_port.write((divisor >> 8) as u8);
        
        // 8 bits, no parity, one stop bit
        lcr_port.write(0x03);
        
        // Enable FIFO
        let mut fcr_port = Port::<u8>::new(port_base + 2);
        fcr_port.write(0xC7);
        
        // Enable DTR/RTS
        let mut mcr_port = Port::<u8>::new(port_base + 4);
        mcr_port.write(0x03);
    }
}

/// Send string over serial
fn send_serial_string(port_base: u16, s: &str) {
    for byte in s.bytes() {
        send_serial_byte(port_base, byte);
    }
}

/// Send single byte over serial
fn send_serial_byte(port_base: u16, byte: u8) {
    unsafe {
        let mut lsr_port = PortReadOnly::<u8>::new(port_base + 5);
        let mut data_port = Port::<u8>::new(port_base);
        
        // Wait for transmit ready
        while (lsr_port.read() & 0x20) == 0 {
            spin_loop();
        }
        
        data_port.write(byte);
    }
}

/// Read line from serial
fn read_serial_line(port_base: u16) -> Option<&'static str> {
    static mut BUFFER: [u8; 64] = [0; 64];
    let mut index = 0;
    
    unsafe {
        let mut lsr_port = PortReadOnly::<u8>::new(port_base + 5);
        let mut data_port = PortReadOnly::<u8>::new(port_base);
        
        loop {
            // Check if data available
            if (lsr_port.read() & 0x01) != 0 {
                let byte = data_port.read();
                
                if byte == b'\n' || index >= 63 {
                    BUFFER[index] = 0;
                    return core::str::from_utf8(&BUFFER[..index]).ok();
                }
                
                if byte != b'\r' {
                    BUFFER[index] = byte;
                    index += 1;
                }
            }
            
            // Timeout check would go here
        }
    }
}

/// Detect HRV protocol on serial port
fn detect_hrv_protocol(port_base: u16) -> bool {
    // Send query command
    send_serial_string(port_base, "ID?\r\n");
    wait_ms(50);
    
    if let Some(response) = read_serial_line(port_base) {
        // Check for known HRV device responses
        response.contains("HRV") || response.contains("HEART") || response.contains("BIO")
    } else {
        false
    }
}

/// Read HeartMath coherence
fn read_heartmath_coherence(port_base: u16) -> f32 {
    // HeartMath coherence calculation
    // Would read IBI data and calculate coherence
    0.75 // Demo value
}

/// Read Muse coherence
fn read_muse_coherence(port_base: u16) -> f32 {
    // Muse uses EEG for meditation scores
    0.65 // Demo value
}

/// Calculate generic coherence from heart rate
fn calculate_generic_coherence(heart_rate: f32) -> f32 {
    // Simple coherence based on HRV
    // Real implementation would use IBI intervals
    let baseline = 70.0;
    let variance = (heart_rate - baseline).abs();
    
    if variance < 5.0 {
        0.8 // High coherence
    } else if variance < 10.0 {
        0.6 // Medium coherence
    } else {
        0.4 // Low coherence
    }
}

/// Simple delay function
fn wait_ms(ms: u32) {
    // Rough approximation using spin loops
    for _ in 0..ms {
        for _ in 0..50000 {
            spin_loop();
        }
    }
}

/// Heart rate variability calculator
pub struct HRVCalculator {
    ibi_buffer: [u16; 64], // Inter-beat intervals
    buffer_index: usize,
    last_beat_time: u64,
}

impl HRVCalculator {
    pub fn new() -> Self {
        Self {
            ibi_buffer: [0; 64],
            buffer_index: 0,
            last_beat_time: 0,
        }
    }
    
    /// Record heartbeat
    pub fn record_beat(&mut self, timestamp: u64) {
        if self.last_beat_time > 0 {
            let ibi = (timestamp - self.last_beat_time) as u16;
            self.ibi_buffer[self.buffer_index] = ibi;
            self.buffer_index = (self.buffer_index + 1) % 64;
        }
        self.last_beat_time = timestamp;
    }
    
    /// Calculate RMSSD (Root Mean Square of Successive Differences)
    pub fn calculate_rmssd(&self) -> f32 {
        let mut sum_squares = 0.0;
        let mut count = 0;
        
        for i in 1..64 {
            let prev = self.ibi_buffer[(self.buffer_index + i - 1) % 64];
            let curr = self.ibi_buffer[(self.buffer_index + i) % 64];
            
            if prev > 0 && curr > 0 {
                let diff = (curr as f32 - prev as f32).abs();
                sum_squares += diff * diff;
                count += 1;
            }
        }
        
        if count > 0 {
            libm::sqrtf(sum_squares / count as f32)
        } else {
            0.0
        }
    }
    
    /// Calculate coherence score
    pub fn calculate_coherence(&self) -> f32 {
        let rmssd = self.calculate_rmssd();
        
        // Coherence peaks around 0.1 Hz oscillation
        // This is simplified - real calculation would use FFT
        if rmssd > 20.0 && rmssd < 50.0 {
            0.9 // High coherence
        } else if rmssd > 10.0 && rmssd < 70.0 {
            0.7 // Good coherence
        } else {
            0.5 // Baseline
        }
    }
}