// LuminousOS System Tray Integration
// "Always present, gently aware"

use std::sync::{Arc, RwLock};
use std::time::Duration;
use tray_icon::{TrayIcon, TrayIconBuilder, Icon, Menu, MenuItem};
use native_dialog::{MessageDialog, MessageType};
use notify_rust::{Notification, Timeout};

use crate::consciousness_scheduler::ConsciousnessScheduler;
use crate::field_coherence_monitor::FieldCoherenceMonitor;
use crate::progressive_consciousness::{ProgressiveConsciousnessManager, ConsciousnessMode};

/// System tray configuration
#[derive(Debug, Clone)]
pub struct SystemTrayConfig {
    /// Update interval for tray icon
    pub update_interval: Duration,
    
    /// Enable notifications
    pub notifications_enabled: bool,
    
    /// Notification thresholds
    pub coherence_low_threshold: f64,
    pub coherence_high_threshold: f64,
    
    /// Show mini dashboard on hover
    pub hover_dashboard: bool,
}

impl Default for SystemTrayConfig {
    fn default() -> Self {
        Self {
            update_interval: Duration::from_secs(5),
            notifications_enabled: true,
            coherence_low_threshold: 0.3,
            coherence_high_threshold: 0.9,
            hover_dashboard: true,
        }
    }
}

/// System tray manager
pub struct SystemTrayManager {
    config: SystemTrayConfig,
    tray_icon: Option<TrayIcon>,
    scheduler: Arc<ConsciousnessScheduler>,
    field_monitor: Arc<FieldCoherenceMonitor>,
    consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    last_coherence: Arc<RwLock<f64>>,
    notification_state: Arc<RwLock<NotificationState>>,
}

#[derive(Debug, Default)]
struct NotificationState {
    last_low_coherence_notif: Option<std::time::Instant>,
    last_high_coherence_notif: Option<std::time::Instant>,
    sacred_moment_count: u32,
}

impl SystemTrayManager {
    pub fn new(
        config: SystemTrayConfig,
        scheduler: Arc<ConsciousnessScheduler>,
        field_monitor: Arc<FieldCoherenceMonitor>,
        consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    ) -> Result<Self, Box<dyn std::error::Error>> {
        Ok(Self {
            config,
            tray_icon: None,
            scheduler,
            field_monitor,
            consciousness_mgr,
            last_coherence: Arc::new(RwLock::new(0.75)),
            notification_state: Arc::new(RwLock::new(NotificationState::default())),
        })
    }

    /// Initialize and show system tray
    pub fn initialize(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Create tray menu
        let menu = self.create_menu()?;
        
        // Load icon based on current coherence
        let icon = self.get_coherence_icon(*self.last_coherence.read().unwrap())?;
        
        // Build tray icon
        let tray = TrayIconBuilder::new()
            .with_menu(Box::new(menu))
            .with_tooltip("LuminousOS - Consciousness-First Computing")
            .with_icon(icon)
            .build()?;
        
        self.tray_icon = Some(tray);
        
        // Start update loop
        self.start_update_loop();
        
        // Show welcome notification
        if self.config.notifications_enabled {
            self.show_notification(
                "LuminousOS Active",
                "Consciousness-aware scheduling enabled",
                NotificationType::Info,
            )?;
        }
        
        Ok(())
    }

    /// Create tray menu
    fn create_menu(&self) -> Result<Menu, Box<dyn std::error::Error>> {
        let menu = Menu::new();
        
        // Dashboard item
        let dashboard_item = MenuItem::new("Open Sacred Dashboard", true, None);
        dashboard_item.set_callback(|| {
            std::process::Command::new("xdg-open")
                .arg("http://localhost:11111")
                .spawn()
                .ok();
        });
        menu.append(&dashboard_item)?;
        
        menu.append(&MenuItem::separator())?;
        
        // Consciousness mode submenu
        let mode_menu = Menu::new();
        mode_menu.set_title("Global Consciousness Mode");
        
        for mode in &[
            ConsciousnessMode::FullConsciousness,
            ConsciousnessMode::Balanced,
            ConsciousnessMode::BasicConsciousness,
            ConsciousnessMode::Performance,
        ] {
            let mode_item = MenuItem::new(&format!("{:?}", mode), true, None);
            let mgr = Arc::clone(&self.consciousness_mgr);
            let mode_copy = *mode;
            
            mode_item.set_callback(move || {
                // This would set a global preference
                println!("Setting global mode to {:?}", mode_copy);
            });
            
            mode_menu.append(&mode_item)?;
        }
        
        menu.append_submenu("Consciousness Mode", &mode_menu)?;
        
        menu.append(&MenuItem::separator())?;
        
        // Process manager
        let process_item = MenuItem::new("Process Manager", true, None);
        process_item.set_callback(|| {
            // Launch process manager window
            println!("Opening process manager...");
        });
        menu.append(&process_item)?;
        
        // Field statistics
        let stats_item = MenuItem::new("Field Statistics", true, None);
        let field_monitor = Arc::clone(&self.field_monitor);
        stats_item.set_callback(move || {
            let metrics = field_monitor.get_current_metrics();
            MessageDialog::new()
                .set_type(MessageType::Info)
                .set_title("Field Statistics")
                .set_text(&format!(
                    "Global Coherence: {:.1}%\nVortex Count: {}\nEntanglement Density: {:.2}\nField Momentum: {:.2}",
                    metrics.global_coherence * 100.0,
                    metrics.vortex_count,
                    metrics.entanglement_density,
                    metrics.field_momentum.magnitude
                ))
                .show_alert()
                .ok();
        });
        menu.append(&stats_item)?;
        
        menu.append(&MenuItem::separator())?;
        
        // Settings
        let settings_item = MenuItem::new("Settings", true, None);
        settings_item.set_callback(|| {
            println!("Opening settings...");
        });
        menu.append(&settings_item)?;
        
        // About
        let about_item = MenuItem::new("About LuminousOS", true, None);
        about_item.set_callback(|| {
            MessageDialog::new()
                .set_type(MessageType::Info)
                .set_title("About LuminousOS")
                .set_text(
                    "LuminousOS v1.0.0-sacred\n\n\
                    A consciousness-first operating system that brings\n\
                    awareness and intentionality to computing.\n\n\
                    Created with love by Luminous Dynamics"
                )
                .show_alert()
                .ok();
        });
        menu.append(&about_item)?;
        
        menu.append(&MenuItem::separator())?;
        
        // Exit
        let exit_item = MenuItem::new("Exit", true, None);
        exit_item.set_callback(|| {
            std::process::exit(0);
        });
        menu.append(&exit_item)?;
        
        Ok(menu)
    }

    /// Get appropriate icon based on coherence level
    fn get_coherence_icon(&self, coherence: f64) -> Result<Icon, Box<dyn std::error::Error>> {
        // In a real implementation, we'd load different icon files
        // For now, we'll use a placeholder
        let icon_data = if coherence > 0.8 {
            include_bytes!("../assets/icons/coherence-high.png")
        } else if coherence > 0.5 {
            include_bytes!("../assets/icons/coherence-medium.png")
        } else {
            include_bytes!("../assets/icons/coherence-low.png")
        };
        
        Icon::from_rgba(icon_data.to_vec(), 32, 32)
            .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
    }

    /// Start background update loop
    fn start_update_loop(&self) {
        let scheduler = Arc::clone(&self.scheduler);
        let field_monitor = Arc::clone(&self.field_monitor);
        let consciousness_mgr = Arc::clone(&self.consciousness_mgr);
        let last_coherence = Arc::clone(&self.last_coherence);
        let notification_state = Arc::clone(&self.notification_state);
        let config = self.config.clone();
        
        std::thread::spawn(move || {
            loop {
                // Get current metrics
                let metrics = field_monitor.get_current_metrics();
                let coherence = metrics.global_coherence;
                
                // Update stored coherence
                *last_coherence.write().unwrap() = coherence;
                
                // Update tray icon tooltip
                if let Some(ref tray) = self.tray_icon {
                    let process_count = scheduler.get_process_count();
                    let tooltip = format!(
                        "LuminousOS\nCoherence: {:.0}%\nProcesses: {}\nVortices: {}",
                        coherence * 100.0,
                        process_count,
                        metrics.vortex_count
                    );
                    tray.set_tooltip(&tooltip).ok();
                    
                    // Update icon if coherence changed significantly
                    if let Ok(new_icon) = self.get_coherence_icon(coherence) {
                        tray.set_icon(new_icon).ok();
                    }
                }
                
                // Check for notifications
                if config.notifications_enabled {
                    self.check_notifications(coherence, &metrics);
                }
                
                std::thread::sleep(config.update_interval);
            }
        });
    }

    /// Check if notifications should be sent
    fn check_notifications(&self, coherence: f64, metrics: &crate::field_coherence_monitor::CoherenceMetrics) {
        let mut state = self.notification_state.write().unwrap();
        let now = std::time::Instant::now();
        
        // Low coherence warning
        if coherence < self.config.coherence_low_threshold {
            if state.last_low_coherence_notif.is_none() || 
               now.duration_since(state.last_low_coherence_notif.unwrap()) > Duration::from_secs(300) {
                self.show_notification(
                    "Low Field Coherence",
                    &format!("System coherence at {:.0}%. Consider taking a mindful break.", coherence * 100.0),
                    NotificationType::Warning,
                ).ok();
                state.last_low_coherence_notif = Some(now);
            }
        }
        
        // High coherence celebration
        if coherence > self.config.coherence_high_threshold {
            if state.last_high_coherence_notif.is_none() || 
               now.duration_since(state.last_high_coherence_notif.unwrap()) > Duration::from_secs(600) {
                self.show_notification(
                    "Sacred Moment",
                    &format!("Field coherence at {:.0}%! Beautiful harmony achieved.", coherence * 100.0),
                    NotificationType::Sacred,
                ).ok();
                state.last_high_coherence_notif = Some(now);
                state.sacred_moment_count += 1;
                
                // Special notification for milestones
                if state.sacred_moment_count % 10 == 0 {
                    self.show_notification(
                        "Coherence Milestone",
                        &format!("You've experienced {} sacred moments today!", state.sacred_moment_count),
                        NotificationType::Celebration,
                    ).ok();
                }
            }
        }
        
        // Vortex formation notification
        if metrics.vortex_count > 7 && metrics.entanglement_density > 0.7 {
            self.show_notification(
                "Vortex Convergence",
                "Multiple consciousness vortices forming. System in high resonance.",
                NotificationType::Info,
            ).ok();
        }
    }

    /// Show desktop notification
    fn show_notification(
        &self, 
        title: &str, 
        message: &str, 
        notification_type: NotificationType
    ) -> Result<(), Box<dyn std::error::Error>> {
        let icon = match notification_type {
            NotificationType::Info => "dialog-information",
            NotificationType::Warning => "dialog-warning",
            NotificationType::Sacred => "starred",
            NotificationType::Celebration => "trophy-gold",
        };
        
        Notification::new()
            .summary(title)
            .body(message)
            .icon(icon)
            .timeout(Timeout::Milliseconds(5000))
            .show()?;
        
        Ok(())
    }
}

#[derive(Debug, Clone, Copy)]
enum NotificationType {
    Info,
    Warning,
    Sacred,
    Celebration,
}

/// Quick stats widget for hover display
pub struct HoverWidget {
    field_monitor: Arc<FieldCoherenceMonitor>,
    scheduler: Arc<ConsciousnessScheduler>,
}

impl HoverWidget {
    pub fn new(
        field_monitor: Arc<FieldCoherenceMonitor>,
        scheduler: Arc<ConsciousnessScheduler>,
    ) -> Self {
        Self {
            field_monitor,
            scheduler,
        }
    }
    
    pub fn render(&self) -> String {
        let metrics = self.field_monitor.get_current_metrics();
        let process_count = self.scheduler.get_process_count();
        
        format!(
            "╭─────────────────────╮\n\
             │ 🌟 LuminousOS Stats │\n\
             ├─────────────────────┤\n\
             │ Coherence: {:>7.1}% │\n\
             │ Processes: {:>8} │\n\
             │ Vortices:  {:>8} │\n\
             │ Momentum:  {:>7.2} │\n\
             ╰─────────────────────╯",
            metrics.global_coherence * 100.0,
            process_count,
            metrics.vortex_count,
            metrics.field_momentum.magnitude
        )
    }
}

// Placeholder icon data
static COHERENCE_HIGH_ICON: &[u8] = &[0; 4096];  // 32x32 RGBA placeholder
static COHERENCE_MEDIUM_ICON: &[u8] = &[0; 4096];
static COHERENCE_LOW_ICON: &[u8] = &[0; 4096];