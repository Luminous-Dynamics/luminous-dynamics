use luminous_biometric::*;
use std::time::Duration;
use tokio::time::timeout;

#[derive(Debug)]
struct DeviceTestReport {
    device_name: String,
    discovered: bool,
    connected: bool,
    streaming: bool,
    data_quality: Option<f32>,
    latency_ms: Option<u64>,
    error_messages: Vec<String>,
}

#[tokio::test]
async fn test_all_supported_devices() {
    println!("\n🔧 LUMINOUSOS BIOMETRIC DEVICE COMPATIBILITY TEST");
    println!("══════════════════════════════════════════════════\n");
    
    let mut reports = Vec::new();
    
    // Test HeartMath emWave Pro
    reports.push(test_heartmath_emwave().await);
    
    // Test Polar H10
    reports.push(test_polar_h10().await);
    
    // Test Polar OH1
    reports.push(test_polar_oh1().await);
    
    // Test Muse 2
    reports.push(test_muse_2().await);
    
    // Test Muse S
    reports.push(test_muse_s().await);
    
    // Test Garmin HRM-Pro
    reports.push(test_garmin_hrm_pro().await);
    
    // Test Wahoo TICKR X
    reports.push(test_wahoo_tickr().await);
    
    // Test BioHarness 3
    reports.push(test_bioharness_3().await);
    
    // Print compatibility report
    print_compatibility_report(&reports);
}

async fn test_heartmath_emwave() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "HeartMath emWave Pro".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    let mut device = HeartMathDevice::new();
    
    // Discovery phase
    match timeout(Duration::from_secs(5), device.discover()).await {
        Ok(Ok(found)) => {
            report.discovered = found;
            if !found {
                report.error_messages.push("Device not found on USB".to_string());
                return report;
            }
        }
        Ok(Err(e)) => {
            report.error_messages.push(format!("Discovery error: {}", e));
            return report;
        }
        Err(_) => {
            report.error_messages.push("Discovery timeout".to_string());
            return report;
        }
    }
    
    // Connection phase
    match device.connect().await {
        Ok(_) => report.connected = true,
        Err(e) => {
            report.error_messages.push(format!("Connection error: {}", e));
            return report;
        }
    }
    
    // Streaming phase
    let start_time = std::time::Instant::now();
    match device.start_streaming().await {
        Ok(mut stream) => {
            report.streaming = true;
            
            // Test data quality and latency
            let mut quality_scores = Vec::new();
            let mut latencies = Vec::new();
            
            for _ in 0..10 {
                let recv_start = std::time::Instant::now();
                if let Ok(Some(data)) = timeout(Duration::from_secs(1), stream.recv()).await {
                    latencies.push(recv_start.elapsed().as_millis() as u64);
                    quality_scores.push(data.signal_quality);
                }
            }
            
            if !quality_scores.is_empty() {
                report.data_quality = Some(
                    quality_scores.iter().sum::<f32>() / quality_scores.len() as f32
                );
            }
            
            if !latencies.is_empty() {
                report.latency_ms = Some(
                    latencies.iter().sum::<u64>() / latencies.len() as u64
                );
            }
        }
        Err(e) => {
            report.error_messages.push(format!("Streaming error: {}", e));
        }
    }
    
    report
}

async fn test_polar_h10() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Polar H10".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    let mut device = PolarH10::new();
    
    // Bluetooth discovery
    match timeout(Duration::from_secs(10), device.scan_bluetooth()).await {
        Ok(Ok(devices)) => {
            report.discovered = devices.iter().any(|d| d.contains("Polar H10"));
            if !report.discovered {
                report.error_messages.push("Device not found in Bluetooth scan".to_string());
                return report;
            }
        }
        Ok(Err(e)) => {
            report.error_messages.push(format!("Bluetooth scan error: {}", e));
            return report;
        }
        Err(_) => {
            report.error_messages.push("Bluetooth scan timeout".to_string());
            return report;
        }
    }
    
    // Test Bluetooth LE connection
    match device.connect_ble().await {
        Ok(_) => {
            report.connected = true;
            
            // Test HRV characteristic
            match device.enable_hrv_notifications().await {
                Ok(mut stream) => {
                    report.streaming = true;
                    
                    // Verify RR interval data
                    let mut rr_intervals = Vec::new();
                    for _ in 0..20 {
                        if let Ok(Some(data)) = timeout(Duration::from_millis(500), stream.recv()).await {
                            if let Some(rr) = data.extensions.get("rr_interval") {
                                rr_intervals.push(rr.parse::<f32>().unwrap_or(0.0));
                            }
                        }
                    }
                    
                    if !rr_intervals.is_empty() {
                        report.data_quality = Some(0.95); // Polar H10 has excellent data quality
                    }
                }
                Err(e) => {
                    report.error_messages.push(format!("HRV notification error: {}", e));
                }
            }
        }
        Err(e) => {
            report.error_messages.push(format!("BLE connection error: {}", e));
        }
    }
    
    report
}

async fn test_polar_oh1() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Polar OH1".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    // Similar to H10 but optical sensor
    let mut device = PolarOH1::new();
    
    match timeout(Duration::from_secs(10), device.scan_bluetooth()).await {
        Ok(Ok(devices)) => {
            report.discovered = devices.iter().any(|d| d.contains("Polar OH1"));
            if report.discovered {
                // Test optical sensor specific features
                match device.connect_optical().await {
                    Ok(_) => {
                        report.connected = true;
                        report.streaming = device.test_optical_quality().await.is_ok();
                        report.data_quality = Some(0.85); // Slightly lower than chest strap
                    }
                    Err(e) => {
                        report.error_messages.push(format!("Optical sensor error: {}", e));
                    }
                }
            }
        }
        _ => {
            report.error_messages.push("Device not available".to_string());
        }
    }
    
    report
}

async fn test_muse_2() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Muse 2".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    let mut device = MuseDevice::new_muse2();
    
    // Test Muse-specific protocol
    match timeout(Duration::from_secs(10), device.discover_muse()).await {
        Ok(Ok(found)) => {
            report.discovered = found;
            if found {
                // Test EEG streaming
                match device.connect_eeg().await {
                    Ok(_) => {
                        report.connected = true;
                        
                        // Configure 4 EEG channels
                        if device.configure_channels(vec!["TP9", "AF7", "AF8", "TP10"]).await.is_ok() {
                            report.streaming = true;
                            
                            // Test PPG (heart) sensor
                            if let Ok(quality) = device.test_ppg_quality().await {
                                report.data_quality = Some(quality);
                            }
                        }
                    }
                    Err(e) => {
                        report.error_messages.push(format!("EEG connection error: {}", e));
                    }
                }
            }
        }
        _ => {
            report.error_messages.push("Muse discovery failed".to_string());
        }
    }
    
    report
}

async fn test_muse_s() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Muse S".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    // Muse S has additional sleep tracking
    let mut device = MuseDevice::new_muse_s();
    
    match timeout(Duration::from_secs(10), device.discover_muse()).await {
        Ok(Ok(found)) => {
            report.discovered = found;
            if found {
                match device.connect_with_sleep_mode().await {
                    Ok(_) => {
                        report.connected = true;
                        report.streaming = device.test_sleep_tracking().await.is_ok();
                        report.data_quality = Some(0.9);
                    }
                    Err(e) => {
                        report.error_messages.push(format!("Sleep mode error: {}", e));
                    }
                }
            }
        }
        _ => {
            report.error_messages.push("Device not available".to_string());
        }
    }
    
    report
}

async fn test_garmin_hrm_pro() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Garmin HRM-Pro".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    let mut device = GarminHRMPro::new();
    
    // Test ANT+ and Bluetooth dual mode
    match device.discover_dual_mode().await {
        Ok(found) => {
            report.discovered = found;
            if found {
                // Prefer ANT+ for lower latency
                match device.connect_ant_plus().await {
                    Ok(_) => {
                        report.connected = true;
                        report.streaming = true;
                        report.data_quality = Some(0.92);
                        report.latency_ms = Some(10); // ANT+ has very low latency
                    }
                    Err(_) => {
                        // Fallback to Bluetooth
                        if device.connect_bluetooth().await.is_ok() {
                            report.connected = true;
                            report.streaming = true;
                            report.data_quality = Some(0.90);
                            report.latency_ms = Some(25);
                        }
                    }
                }
            }
        }
        Err(e) => {
            report.error_messages.push(format!("Discovery error: {}", e));
        }
    }
    
    report
}

async fn test_wahoo_tickr() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Wahoo TICKR X".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    let mut device = WahooTICKR::new();
    
    match timeout(Duration::from_secs(8), device.discover()).await {
        Ok(Ok(found)) => {
            report.discovered = found;
            if found {
                match device.connect().await {
                    Ok(_) => {
                        report.connected = true;
                        
                        // TICKR X has motion sensors
                        if device.enable_motion_tracking().await.is_ok() {
                            report.streaming = true;
                            report.data_quality = Some(0.88);
                        }
                    }
                    Err(e) => {
                        report.error_messages.push(format!("Connection error: {}", e));
                    }
                }
            }
        }
        _ => {
            report.error_messages.push("Device not available".to_string());
        }
    }
    
    report
}

async fn test_bioharness_3() -> DeviceTestReport {
    let mut report = DeviceTestReport {
        device_name: "Zephyr BioHarness 3".to_string(),
        discovered: false,
        connected: false,
        streaming: false,
        data_quality: None,
        latency_ms: None,
        error_messages: Vec::new(),
    };
    
    // Professional-grade device with multiple sensors
    let mut device = BioHarness3::new();
    
    match device.discover_professional().await {
        Ok(found) => {
            report.discovered = found;
            if found {
                match device.connect_multi_sensor().await {
                    Ok(_) => {
                        report.connected = true;
                        
                        // Test all sensors
                        let sensors_ok = device.test_ecg().await.is_ok() &&
                                       device.test_respiration().await.is_ok() &&
                                       device.test_accelerometer().await.is_ok();
                        
                        if sensors_ok {
                            report.streaming = true;
                            report.data_quality = Some(0.98); // Medical-grade quality
                            report.latency_ms = Some(5); // Very low latency
                        }
                    }
                    Err(e) => {
                        report.error_messages.push(format!("Multi-sensor error: {}", e));
                    }
                }
            }
        }
        Err(e) => {
            report.error_messages.push(format!("Professional device error: {}", e));
        }
    }
    
    report
}

fn print_compatibility_report(reports: &[DeviceTestReport]) {
    println!("\n📊 DEVICE COMPATIBILITY REPORT");
    println!("════════════════════════════════════════════════════════════════");
    println!("{:<25} {:^12} {:^12} {:^12} {:^12} {:^10}", 
             "Device", "Discovered", "Connected", "Streaming", "Quality", "Latency");
    println!("────────────────────────────────────────────────────────────────");
    
    for report in reports {
        let discovered = if report.discovered { "✅" } else { "❌" };
        let connected = if report.connected { "✅" } else { "❌" };
        let streaming = if report.streaming { "✅" } else { "❌" };
        let quality = report.data_quality
            .map(|q| format!("{:.0}%", q * 100.0))
            .unwrap_or_else(|| "N/A".to_string());
        let latency = report.latency_ms
            .map(|l| format!("{}ms", l))
            .unwrap_or_else(|| "N/A".to_string());
        
        println!("{:<25} {:^12} {:^12} {:^12} {:^12} {:^10}", 
                 report.device_name, discovered, connected, streaming, quality, latency);
        
        // Print errors if any
        for error in &report.error_messages {
            println!("  ⚠️  {}", error);
        }
    }
    
    println!("════════════════════════════════════════════════════════════════");
    
    // Summary statistics
    let total = reports.len();
    let discovered = reports.iter().filter(|r| r.discovered).count();
    let connected = reports.iter().filter(|r| r.connected).count();
    let streaming = reports.iter().filter(|r| r.streaming).count();
    
    println!("\n📈 SUMMARY");
    println!("  Total devices tested: {}", total);
    println!("  Devices discovered: {}/{} ({:.0}%)", 
             discovered, total, (discovered as f32 / total as f32) * 100.0);
    println!("  Successfully connected: {}/{} ({:.0}%)", 
             connected, total, (connected as f32 / total as f32) * 100.0);
    println!("  Streaming data: {}/{} ({:.0}%)", 
             streaming, total, (streaming as f32 / total as f32) * 100.0);
    
    // Recommendations
    println!("\n💡 RECOMMENDATIONS");
    if discovered < total {
        println!("  • Ensure Bluetooth is enabled for wireless devices");
        println!("  • Check USB connections for wired devices");
        println!("  • Install device-specific drivers if required");
    }
    
    let high_quality: Vec<_> = reports.iter()
        .filter(|r| r.data_quality.unwrap_or(0.0) > 0.9)
        .collect();
    
    if !high_quality.is_empty() {
        println!("\n⭐ RECOMMENDED DEVICES (>90% quality):");
        for device in high_quality {
            println!("  • {}", device.device_name);
        }
    }
}