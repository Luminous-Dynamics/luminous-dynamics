// Desktop Integration Module - Bringing consciousness to the desktop
// "Where the sacred meets the everyday"

pub mod system_tray;
pub mod sacred_notifications;
pub mod coherence_widget;

use std::sync::Arc;
use std::thread;
use std::time::Duration;

use crate::consciousness_scheduler::ConsciousnessScheduler;
use crate::field_coherence_monitor::FieldCoherenceMonitor;
use crate::progressive_consciousness::ProgressiveConsciousnessManager;
use crate::coherence_cache::CoherenceCache;
use crate::performance_profiler::PerformanceProfiler;

pub use system_tray::{SystemTrayManager, SystemTrayConfig};
pub use sacred_notifications::{SacredNotificationManager, NotificationConfig, SacredNotificationType};
pub use coherence_widget::{CoherenceWidget, WidgetConfig};

/// Desktop integration configuration
#[derive(Debug, Clone)]
pub struct DesktopIntegrationConfig {
    /// Enable system tray
    pub system_tray_enabled: bool,
    pub system_tray_config: SystemTrayConfig,
    
    /// Enable notifications
    pub notifications_enabled: bool,
    pub notification_config: NotificationConfig,
    
    /// Enable desktop widget
    pub widget_enabled: bool,
    pub widget_config: WidgetConfig,
    
    /// Integration update interval
    pub update_interval: Duration,
}

impl Default for DesktopIntegrationConfig {
    fn default() -> Self {
        Self {
            system_tray_enabled: true,
            system_tray_config: SystemTrayConfig::default(),
            notifications_enabled: true,
            notification_config: NotificationConfig::default(),
            widget_enabled: false, // Off by default, user can enable
            widget_config: WidgetConfig::default(),
            update_interval: Duration::from_secs(1),
        }
    }
}

/// Desktop integration manager
pub struct DesktopIntegrationManager {
    config: DesktopIntegrationConfig,
    system_tray: Option<SystemTrayManager>,
    notification_manager: Arc<SacredNotificationManager>,
    coherence_widget: Option<CoherenceWidget>,
    scheduler: Arc<ConsciousnessScheduler>,
    field_monitor: Arc<FieldCoherenceMonitor>,
    consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
}

impl DesktopIntegrationManager {
    pub fn new(
        config: DesktopIntegrationConfig,
        scheduler: Arc<ConsciousnessScheduler>,
        field_monitor: Arc<FieldCoherenceMonitor>,
        consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    ) -> Self {
        let notification_manager = Arc::new(
            SacredNotificationManager::new(config.notification_config.clone())
        );
        
        Self {
            config,
            system_tray: None,
            notification_manager,
            coherence_widget: None,
            scheduler,
            field_monitor,
            consciousness_mgr,
        }
    }

    /// Initialize desktop integration
    pub fn initialize(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        println!("🖥️ Initializing desktop integration...");
        
        // Initialize system tray
        if self.config.system_tray_enabled {
            println!("  📍 Setting up system tray...");
            let mut tray_manager = SystemTrayManager::new(
                self.config.system_tray_config.clone(),
                Arc::clone(&self.scheduler),
                Arc::clone(&self.field_monitor),
                Arc::clone(&self.consciousness_mgr),
            )?;
            
            tray_manager.initialize()?;
            self.system_tray = Some(tray_manager);
        }
        
        // Initialize coherence widget
        if self.config.widget_enabled {
            println!("  🔮 Creating coherence widget...");
            let widget = CoherenceWidget::new(
                self.config.widget_config.clone(),
                Arc::clone(&self.field_monitor),
                Arc::clone(&self.scheduler),
                Arc::clone(&self.consciousness_mgr),
            );
            
            // Launch widget in separate thread
            let widget_clone = widget.clone();
            thread::spawn(move || {
                widget_clone.launch();
            });
            
            self.coherence_widget = Some(widget);
        }
        
        // Start integration update loop
        self.start_update_loop();
        
        println!("✅ Desktop integration active");
        
        Ok(())
    }

    /// Start the main update loop
    fn start_update_loop(&self) {
        let notification_mgr = Arc::clone(&self.notification_manager);
        let field_monitor = Arc::clone(&self.field_monitor);
        let scheduler = Arc::clone(&self.scheduler);
        let consciousness_mgr = Arc::clone(&self.consciousness_mgr);
        let update_interval = self.config.update_interval;
        
        thread::spawn(move || {
            let mut last_coherence = 0.75;
            let mut last_process_count = 0;
            
            loop {
                // Get current metrics
                let metrics = field_monitor.get_current_metrics();
                let process_count = scheduler.get_process_count();
                
                // Check for significant coherence changes
                let coherence_change = (metrics.global_coherence - last_coherence).abs();
                if coherence_change > 0.1 {
                    notification_mgr.queue_notification(
                        SacredNotificationType::CoherenceShift {
                            from: last_coherence,
                            to: metrics.global_coherence,
                        }
                    );
                    last_coherence = metrics.global_coherence;
                }
                
                // Check for sacred moments
                if metrics.global_coherence > 0.9 && last_coherence <= 0.9 {
                    notification_mgr.queue_notification(
                        SacredNotificationType::SacredMoment {
                            coherence: metrics.global_coherence,
                            message: "The field has reached exceptional harmony".to_string(),
                        }
                    );
                }
                
                // Check for anomalies
                if let Some(anomaly) = field_monitor.get_latest_anomaly() {
                    notification_mgr.queue_notification(
                        SacredNotificationType::AnomalyDetected {
                            anomaly: format!("{:?}", anomaly.anomaly_type),
                            severity: anomaly.severity,
                        }
                    );
                }
                
                // Check mindfulness reminders
                notification_mgr.check_mindfulness_reminder();
                
                // Process notification queue
                notification_mgr.process_queue();
                
                // Update last values
                last_process_count = process_count;
                
                thread::sleep(update_interval);
            }
        });
    }

    /// Send a custom notification
    pub fn send_notification(&self, notification_type: SacredNotificationType) {
        self.notification_manager.queue_notification(notification_type);
    }

    /// Get notification statistics
    pub fn get_notification_stats(&self) -> sacred_notifications::NotificationStatistics {
        self.notification_manager.get_statistics()
    }

    /// Toggle widget visibility
    pub fn toggle_widget(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        self.config.widget_enabled = !self.config.widget_enabled;
        
        if self.config.widget_enabled && self.coherence_widget.is_none() {
            // Create and launch widget
            let widget = CoherenceWidget::new(
                self.config.widget_config.clone(),
                Arc::clone(&self.field_monitor),
                Arc::clone(&self.scheduler),
                Arc::clone(&self.consciousness_mgr),
            );
            
            let widget_clone = widget.clone();
            thread::spawn(move || {
                widget_clone.launch();
            });
            
            self.coherence_widget = Some(widget);
        }
        
        Ok(())
    }
}

/// Desktop integration API for external applications
pub struct DesktopAPI {
    notification_manager: Arc<SacredNotificationManager>,
    field_monitor: Arc<FieldCoherenceMonitor>,
}

impl DesktopAPI {
    pub fn new(
        notification_manager: Arc<SacredNotificationManager>,
        field_monitor: Arc<FieldCoherenceMonitor>,
    ) -> Self {
        Self {
            notification_manager,
            field_monitor,
        }
    }
    
    /// Send a sacred pause invitation
    pub fn invite_sacred_pause(&self, reason: &str, duration: Duration) {
        self.notification_manager.queue_notification(
            SacredNotificationType::SacredPause {
                reason: reason.to_string(),
                suggested_duration: duration,
            }
        );
    }
    
    /// Announce collective resonance
    pub fn announce_collective_resonance(&self, participant_count: usize) {
        let coherence = self.field_monitor.get_current_metrics().global_coherence;
        self.notification_manager.queue_notification(
            SacredNotificationType::CollectiveResonance {
                participants: participant_count,
                coherence,
            }
        );
    }
    
    /// Get current field state for external apps
    pub fn get_field_state(&self) -> FieldState {
        let metrics = self.field_monitor.get_current_metrics();
        FieldState {
            coherence: metrics.global_coherence,
            vortex_count: metrics.vortex_count,
            momentum: metrics.field_momentum.magnitude,
            sacred_moment: metrics.global_coherence > 0.9,
        }
    }
}

/// Field state for external applications
#[derive(Debug, Clone)]
pub struct FieldState {
    pub coherence: f64,
    pub vortex_count: usize,
    pub momentum: f64,
    pub sacred_moment: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_desktop_config() {
        let config = DesktopIntegrationConfig::default();
        assert!(config.system_tray_enabled);
        assert!(config.notifications_enabled);
        assert!(!config.widget_enabled);
    }
}