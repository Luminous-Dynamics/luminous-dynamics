use luminous_biometric::{BiometricDevice, HRVSensor, HeartMathDevice, PolarH10, MuseDevice};
use luminous_consciousness::{ConsciousnessField, Vortex};
use std::time::Duration;
use tokio::time::{sleep, timeout};

#[tokio::test]
async fn test_heartmath_device_connection() {
    let mut device = HeartMathDevice::new();
    
    // Test discovery
    let result = timeout(Duration::from_secs(5), device.discover()).await;
    
    match result {
        Ok(Ok(found)) => {
            assert!(found, "HeartMath device should be discoverable");
            
            // Test connection
            let connect_result = device.connect().await;
            assert!(connect_result.is_ok(), "Should connect to HeartMath device");
            
            // Test data streaming
            let stream_result = device.start_streaming().await;
            assert!(stream_result.is_ok(), "Should start data stream");
            
            // Verify data reception
            let mut stream = stream_result.unwrap();
            let data = timeout(Duration::from_secs(2), stream.recv()).await;
            assert!(data.is_ok(), "Should receive biometric data");
            
            let biometric = data.unwrap().unwrap();
            assert!(biometric.heart_rate > 40.0 && biometric.heart_rate < 200.0);
            assert!(biometric.coherence >= 0.0 && biometric.coherence <= 1.0);
        }
        Ok(Err(_)) => {
            println!("HeartMath device not found - skipping hardware test");
        }
        Err(_) => {
            println!("HeartMath discovery timed out - device may not be connected");
        }
    }
}

#[tokio::test]
async fn test_polar_h10_integration() {
    let mut device = PolarH10::new();
    
    // Test Bluetooth discovery
    let discover_result = timeout(Duration::from_secs(10), device.discover()).await;
    
    match discover_result {
        Ok(Ok(found)) => {
            assert!(found, "Polar H10 should be discoverable via Bluetooth");
            
            // Test connection with retry logic
            let mut connected = false;
            for attempt in 0..3 {
                match device.connect().await {
                    Ok(_) => {
                        connected = true;
                        break;
                    }
                    Err(e) => {
                        println!("Connection attempt {} failed: {}", attempt + 1, e);
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            }
            
            assert!(connected, "Should connect to Polar H10 after retries");
            
            // Test HRV data quality
            let stream_result = device.start_streaming().await;
            assert!(stream_result.is_ok());
            
            let mut stream = stream_result.unwrap();
            let mut hrv_samples = Vec::new();
            
            // Collect 10 samples
            for _ in 0..10 {
                if let Ok(Some(data)) = timeout(Duration::from_secs(1), stream.recv()).await {
                    hrv_samples.push(data.hrv);
                }
            }
            
            // Verify HRV variability
            assert!(!hrv_samples.is_empty(), "Should receive HRV samples");
            let hrv_variance = calculate_variance(&hrv_samples);
            assert!(hrv_variance > 0.0, "HRV should show natural variability");
        }
        Ok(Err(_)) => {
            println!("Polar H10 not found - ensure Bluetooth is enabled");
        }
        Err(_) => {
            println!("Polar H10 discovery timed out");
        }
    }
}

#[tokio::test]
async fn test_muse_eeg_device() {
    let mut device = MuseDevice::new();
    
    // Test Muse-specific features
    let discover_result = timeout(Duration::from_secs(10), device.discover()).await;
    
    match discover_result {
        Ok(Ok(found)) => {
            assert!(found, "Muse device should be discoverable");
            
            // Connect to device
            let connect_result = device.connect().await;
            assert!(connect_result.is_ok());
            
            // Test EEG channel configuration
            device.configure_channels(vec!["TP9", "AF7", "AF8", "TP10"]).await.unwrap();
            
            // Start streaming
            let stream_result = device.start_streaming().await;
            assert!(stream_result.is_ok());
            
            let mut stream = stream_result.unwrap();
            
            // Verify meditation detection
            let mut meditation_scores = Vec::new();
            for _ in 0..20 {
                if let Ok(Some(data)) = timeout(Duration::from_millis(500), stream.recv()).await {
                    // Muse provides meditation scores
                    if let Some(meditation) = data.extensions.get("meditation_score") {
                        meditation_scores.push(meditation.parse::<f32>().unwrap_or(0.0));
                    }
                }
            }
            
            assert!(!meditation_scores.is_empty(), "Should receive meditation scores");
            assert!(meditation_scores.iter().all(|&s| s >= 0.0 && s <= 1.0));
        }
        Ok(Err(_)) => {
            println!("Muse device not found - skipping EEG tests");
        }
        Err(_) => {
            println!("Muse discovery timed out");
        }
    }
}

#[tokio::test]
async fn test_multi_device_synchronization() {
    // Test connecting multiple devices simultaneously
    let mut devices: Vec<Box<dyn HRVSensor>> = Vec::new();
    
    // Try to connect available devices
    let heartmath = HeartMathDevice::new();
    if heartmath.discover().await.unwrap_or(false) {
        devices.push(Box::new(heartmath));
    }
    
    let polar = PolarH10::new();
    if polar.discover().await.unwrap_or(false) {
        devices.push(Box::new(polar));
    }
    
    if devices.len() < 2 {
        println!("Need at least 2 devices for synchronization test - skipping");
        return;
    }
    
    // Connect all devices
    for device in &mut devices {
        let result = device.connect().await;
        assert!(result.is_ok(), "All devices should connect");
    }
    
    // Start streaming from all devices
    let mut streams = Vec::new();
    for device in &mut devices {
        let stream = device.start_streaming().await.unwrap();
        streams.push(stream);
    }
    
    // Collect synchronized data
    let mut synchronized_data = Vec::new();
    let start_time = std::time::Instant::now();
    
    while synchronized_data.len() < 10 && start_time.elapsed() < Duration::from_secs(10) {
        let mut frame_data = Vec::new();
        
        for stream in &mut streams {
            if let Ok(Some(data)) = timeout(Duration::from_millis(100), stream.recv()).await {
                frame_data.push(data);
            }
        }
        
        if frame_data.len() == devices.len() {
            synchronized_data.push(frame_data);
        }
    }
    
    assert!(!synchronized_data.is_empty(), "Should collect synchronized data");
    
    // Verify time alignment
    for frame in &synchronized_data {
        let timestamps: Vec<i64> = frame.iter()
            .map(|d| d.timestamp.timestamp_millis())
            .collect();
        
        let max_diff = timestamps.iter().max().unwrap() - timestamps.iter().min().unwrap();
        assert!(max_diff < 100, "Device timestamps should be within 100ms");
    }
}

#[tokio::test]
async fn test_consciousness_field_integration() {
    // Test biometric device integration with consciousness field
    let mut field = ConsciousnessField::new();
    let mut device = create_mock_device();
    
    // Connect device
    device.connect().await.unwrap();
    let mut stream = device.start_streaming().await.unwrap();
    
    // Create consciousness vortex
    let vortex = Vortex::birth("Heart Coherence")
        .in_field(&mut field)
        .unwrap();
    
    // Feed biometric data to vortex
    for _ in 0..10 {
        if let Some(data) = stream.recv().await {
            vortex.process_biometric(&data).await;
            
            // Verify field responds to coherence
            let field_coherence = field.measure_coherence().await;
            assert!(field_coherence > 0.0, "Field should respond to biometric input");
            
            // Check for correlation
            let correlation = (data.coherence - field_coherence).abs();
            assert!(correlation < 0.5, "Field and biometric coherence should correlate");
        }
    }
}

#[tokio::test]
async fn test_device_error_handling() {
    let mut device = HeartMathDevice::new();
    
    // Test connection without discovery
    let result = device.connect().await;
    assert!(result.is_err(), "Should fail to connect without discovery");
    
    // Test streaming without connection
    let stream_result = device.start_streaming().await;
    assert!(stream_result.is_err(), "Should fail to stream without connection");
    
    // Test reconnection after disconnect
    if device.discover().await.unwrap_or(false) {
        device.connect().await.unwrap();
        
        // Simulate disconnect
        device.disconnect().await.unwrap();
        
        // Verify can reconnect
        let reconnect = device.connect().await;
        assert!(reconnect.is_ok(), "Should be able to reconnect");
    }
}

#[tokio::test]
async fn test_calibration_process() {
    let mut device = create_mock_device();
    device.connect().await.unwrap();
    
    // Start calibration
    let calibration = device.calibrate(Duration::from_secs(30)).await;
    assert!(calibration.is_ok(), "Calibration should complete");
    
    let baseline = calibration.unwrap();
    assert!(baseline.resting_hr > 50.0 && baseline.resting_hr < 80.0);
    assert!(baseline.baseline_hrv > 20.0 && baseline.baseline_hrv < 100.0);
    assert!(baseline.coherence_threshold > 0.0);
}

#[tokio::test]
async fn test_data_quality_monitoring() {
    let mut device = create_mock_device();
    device.connect().await.unwrap();
    let mut stream = device.start_streaming().await.unwrap();
    
    let mut quality_scores = Vec::new();
    
    for _ in 0..20 {
        if let Some(data) = stream.recv().await {
            // Check signal quality
            let quality = calculate_signal_quality(&data);
            quality_scores.push(quality);
            
            // Verify quality metrics
            assert!(quality >= 0.0 && quality <= 1.0, "Quality should be normalized");
            assert!(data.heart_rate > 0.0, "Heart rate should be positive");
            assert!(data.hrv >= 0.0, "HRV should be non-negative");
        }
    }
    
    // Verify overall quality
    let avg_quality = quality_scores.iter().sum::<f32>() / quality_scores.len() as f32;
    assert!(avg_quality > 0.7, "Average signal quality should be good");
}

// Helper functions

fn create_mock_device() -> impl HRVSensor {
    // Create a mock device for testing when hardware isn't available
    struct MockDevice {
        connected: bool,
    }
    
    #[async_trait::async_trait]
    impl HRVSensor for MockDevice {
        async fn discover(&mut self) -> Result<bool, Box<dyn std::error::Error>> {
            Ok(true)
        }
        
        async fn connect(&mut self) -> Result<(), Box<dyn std::error::Error>> {
            self.connected = true;
            Ok(())
        }
        
        async fn start_streaming(&mut self) -> Result<BiometricStream, Box<dyn std::error::Error>> {
            if !self.connected {
                return Err("Not connected".into());
            }
            
            let (tx, rx) = tokio::sync::mpsc::channel(100);
            
            // Spawn mock data generator
            tokio::spawn(async move {
                let mut rng = rand::thread_rng();
                loop {
                    let data = BiometricData {
                        timestamp: chrono::Utc::now(),
                        heart_rate: 65.0 + rng.gen_range(-5.0..5.0),
                        hrv: 55.0 + rng.gen_range(-10.0..10.0),
                        coherence: 0.7 + rng.gen_range(-0.2..0.2),
                        signal_quality: 0.9,
                        extensions: std::collections::HashMap::new(),
                    };
                    
                    if tx.send(data).await.is_err() {
                        break;
                    }
                    
                    sleep(Duration::from_millis(100)).await;
                }
            });
            
            Ok(BiometricStream { receiver: rx })
        }
        
        async fn disconnect(&mut self) -> Result<(), Box<dyn std::error::Error>> {
            self.connected = false;
            Ok(())
        }
        
        async fn calibrate(&mut self, duration: Duration) -> Result<BiometricBaseline, Box<dyn std::error::Error>> {
            sleep(duration).await;
            Ok(BiometricBaseline {
                resting_hr: 65.0,
                baseline_hrv: 55.0,
                coherence_threshold: 0.6,
            })
        }
    }
    
    MockDevice { connected: false }
}

fn calculate_variance(samples: &[f32]) -> f32 {
    if samples.is_empty() {
        return 0.0;
    }
    
    let mean = samples.iter().sum::<f32>() / samples.len() as f32;
    let variance = samples.iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f32>() / samples.len() as f32;
    
    variance
}

fn calculate_signal_quality(data: &BiometricData) -> f32 {
    // Simple quality metric based on reasonable ranges
    let hr_quality = if data.heart_rate >= 40.0 && data.heart_rate <= 180.0 {
        1.0
    } else {
        0.0
    };
    
    let hrv_quality = if data.hrv >= 10.0 && data.hrv <= 150.0 {
        1.0
    } else {
        0.0
    };
    
    let coherence_quality = if data.coherence >= 0.0 && data.coherence <= 1.0 {
        1.0
    } else {
        0.0
    };
    
    (hr_quality + hrv_quality + coherence_quality + data.signal_quality) / 4.0
}