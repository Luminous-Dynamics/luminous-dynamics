// Sacred Notifications - Mindful desktop alerts
// "Gentle reminders in the flow of awareness"

use std::sync::{Arc, RwLock};
use std::collections::VecDeque;
use std::time::{Duration, Instant};
use notify_rust::{Notification, Timeout, Urgency};
use serde::{Serialize, Deserialize};

use crate::consciousness_scheduler::ProcessId;
use crate::progressive_consciousness::ConsciousnessMode;
use crate::field_coherence_monitor::CoherenceAnomaly;

/// Notification types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SacredNotificationType {
    /// Field coherence changes
    CoherenceShift { from: f64, to: f64 },
    
    /// Process consciousness transitions
    ProcessTransition { 
        process_name: String,
        from_mode: ConsciousnessMode,
        to_mode: ConsciousnessMode,
    },
    
    /// Sacred moments (high coherence)
    SacredMoment { coherence: f64, message: String },
    
    /// Mindfulness reminders
    MindfulnessReminder { practice: String, duration: Duration },
    
    /// System events
    SystemEvent { event: String, impact: String },
    
    /// Anomaly detection
    AnomalyDetected { anomaly: String, severity: f64 },
    
    /// Collective resonance
    CollectiveResonance { participants: usize, coherence: f64 },
    
    /// Sacred pause invitations
    SacredPause { reason: String, suggested_duration: Duration },
}

/// Notification configuration
#[derive(Debug, Clone)]
pub struct NotificationConfig {
    /// Enable different notification types
    pub coherence_shifts: bool,
    pub process_transitions: bool,
    pub sacred_moments: bool,
    pub mindfulness_reminders: bool,
    pub system_events: bool,
    pub anomalies: bool,
    
    /// Mindfulness reminder interval
    pub reminder_interval: Duration,
    
    /// Minimum coherence change to notify
    pub coherence_threshold: f64,
    
    /// Do not disturb mode
    pub dnd_enabled: bool,
    pub dnd_start: (u8, u8), // (hour, minute)
    pub dnd_end: (u8, u8),
    
    /// Notification queue size
    pub max_queue_size: usize,
}

impl Default for NotificationConfig {
    fn default() -> Self {
        Self {
            coherence_shifts: true,
            process_transitions: false,
            sacred_moments: true,
            mindfulness_reminders: true,
            system_events: true,
            anomalies: true,
            reminder_interval: Duration::from_secs(3600), // 1 hour
            coherence_threshold: 0.15,
            dnd_enabled: false,
            dnd_start: (22, 0),
            dnd_end: (7, 0),
            max_queue_size: 100,
        }
    }
}

/// Sacred notification manager
pub struct SacredNotificationManager {
    config: Arc<RwLock<NotificationConfig>>,
    notification_queue: Arc<RwLock<VecDeque<QueuedNotification>>>,
    notification_history: Arc<RwLock<Vec<NotificationRecord>>>,
    last_reminder: Arc<RwLock<Instant>>,
    mindfulness_practices: Vec<MindfulnessPractice>,
}

#[derive(Debug, Clone)]
struct QueuedNotification {
    notification_type: SacredNotificationType,
    created_at: Instant,
    priority: NotificationPriority,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum NotificationPriority {
    Low,
    Normal,
    High,
    Sacred,
}

#[derive(Debug, Clone)]
struct NotificationRecord {
    notification_type: SacredNotificationType,
    sent_at: Instant,
    user_response: Option<UserResponse>,
}

#[derive(Debug, Clone)]
enum UserResponse {
    Acknowledged,
    Dismissed,
    ActedUpon(String),
}

#[derive(Debug, Clone)]
struct MindfulnessPractice {
    name: String,
    description: String,
    duration: Duration,
    coherence_boost: f64,
}

impl SacredNotificationManager {
    pub fn new(config: NotificationConfig) -> Self {
        Self {
            config: Arc::new(RwLock::new(config)),
            notification_queue: Arc::new(RwLock::new(VecDeque::new())),
            notification_history: Arc::new(RwLock::new(Vec::new())),
            last_reminder: Arc::new(RwLock::new(Instant::now())),
            mindfulness_practices: Self::init_practices(),
        }
    }

    /// Initialize mindfulness practices
    fn init_practices() -> Vec<MindfulnessPractice> {
        vec![
            MindfulnessPractice {
                name: "Three Conscious Breaths".to_string(),
                description: "Take three deep, conscious breaths".to_string(),
                duration: Duration::from_secs(30),
                coherence_boost: 0.05,
            },
            MindfulnessPractice {
                name: "Body Scan".to_string(),
                description: "Brief awareness of physical sensations".to_string(),
                duration: Duration::from_secs(120),
                coherence_boost: 0.08,
            },
            MindfulnessPractice {
                name: "Gratitude Moment".to_string(),
                description: "Reflect on something you're grateful for".to_string(),
                duration: Duration::from_secs(60),
                coherence_boost: 0.07,
            },
            MindfulnessPractice {
                name: "Loving Kindness".to_string(),
                description: "Send loving thoughts to yourself and others".to_string(),
                duration: Duration::from_secs(180),
                coherence_boost: 0.10,
            },
            MindfulnessPractice {
                name: "Digital Pause".to_string(),
                description: "Step away from the screen for a moment".to_string(),
                duration: Duration::from_secs(300),
                coherence_boost: 0.12,
            },
        ]
    }

    /// Queue a notification
    pub fn queue_notification(&self, notification_type: SacredNotificationType) {
        let config = self.config.read().unwrap();
        
        // Check if this type is enabled
        let enabled = match &notification_type {
            SacredNotificationType::CoherenceShift { .. } => config.coherence_shifts,
            SacredNotificationType::ProcessTransition { .. } => config.process_transitions,
            SacredNotificationType::SacredMoment { .. } => config.sacred_moments,
            SacredNotificationType::MindfulnessReminder { .. } => config.mindfulness_reminders,
            SacredNotificationType::SystemEvent { .. } => config.system_events,
            SacredNotificationType::AnomalyDetected { .. } => config.anomalies,
            _ => true,
        };
        
        if !enabled {
            return;
        }
        
        // Check DND mode
        if self.is_dnd_active(&config) {
            return;
        }
        
        // Determine priority
        let priority = self.determine_priority(&notification_type);
        
        // Queue the notification
        let mut queue = self.notification_queue.write().unwrap();
        queue.push_back(QueuedNotification {
            notification_type,
            created_at: Instant::now(),
            priority,
        });
        
        // Maintain queue size
        while queue.len() > config.max_queue_size {
            queue.pop_front();
        }
    }

    /// Process notification queue
    pub fn process_queue(&self) {
        let mut queue = self.notification_queue.write().unwrap();
        
        // Sort by priority and age
        let mut notifications: Vec<_> = queue.drain(..).collect();
        notifications.sort_by(|a, b| {
            b.priority.cmp(&a.priority)
                .then_with(|| a.created_at.cmp(&b.created_at))
        });
        
        // Send top notifications
        for notif in notifications.into_iter().take(3) {
            if let Err(e) = self.send_notification(notif) {
                eprintln!("Failed to send notification: {}", e);
            }
        }
    }

    /// Send a notification
    fn send_notification(&self, queued: QueuedNotification) -> Result<(), Box<dyn std::error::Error>> {
        let (title, body, icon, urgency) = match &queued.notification_type {
            SacredNotificationType::CoherenceShift { from, to } => {
                let direction = if to > from { "rising" } else { "falling" };
                let emoji = if to > from { "📈" } else { "📉" };
                (
                    format!("{} Field Coherence {}", emoji, direction.to_uppercase()),
                    format!("Coherence {} from {:.0}% to {:.0}%", direction, from * 100.0, to * 100.0),
                    "dialog-information",
                    Urgency::Normal,
                )
            }
            
            SacredNotificationType::SacredMoment { coherence, message } => (
                "🌟 Sacred Moment".to_string(),
                format!("{}\nField coherence: {:.0}%", message, coherence * 100.0),
                "starred",
                Urgency::Low,
            ),
            
            SacredNotificationType::MindfulnessReminder { practice, duration } => (
                "🧘 Mindfulness Invitation".to_string(),
                format!("{}\nDuration: {} seconds", practice, duration.as_secs()),
                "appointment-new",
                Urgency::Low,
            ),
            
            SacredNotificationType::ProcessTransition { process_name, from_mode, to_mode } => (
                "🔄 Process Transition".to_string(),
                format!("{}: {:?} → {:?}", process_name, from_mode, to_mode),
                "system-run",
                Urgency::Low,
            ),
            
            SacredNotificationType::AnomalyDetected { anomaly, severity } => {
                let urgency = if *severity > 0.7 { Urgency::Critical } else { Urgency::Normal };
                (
                    "⚠️ Anomaly Detected".to_string(),
                    format!("{}\nSeverity: {:.0}%", anomaly, severity * 100.0),
                    "dialog-warning",
                    urgency,
                )
            }
            
            SacredNotificationType::CollectiveResonance { participants, coherence } => (
                "🌊 Collective Resonance".to_string(),
                format!("{} beings in resonance\nCoherence: {:.0}%", participants, coherence * 100.0),
                "network-wireless",
                Urgency::Normal,
            ),
            
            SacredNotificationType::SacredPause { reason, suggested_duration } => (
                "⏸️ Sacred Pause Invitation".to_string(),
                format!("{}\nSuggested duration: {} minutes", reason, suggested_duration.as_secs() / 60),
                "media-playback-pause",
                Urgency::Normal,
            ),
            
            _ => ("LuminousOS".to_string(), "System notification".to_string(), "dialog-information", Urgency::Normal),
        };
        
        // Send the notification
        Notification::new()
            .summary(&title)
            .body(&body)
            .icon(icon)
            .urgency(urgency)
            .timeout(Timeout::Milliseconds(8000))
            .show()?;
        
        // Record in history
        let mut history = self.notification_history.write().unwrap();
        history.push(NotificationRecord {
            notification_type: queued.notification_type,
            sent_at: Instant::now(),
            user_response: None,
        });
        
        Ok(())
    }

    /// Check if DND mode is active
    fn is_dnd_active(&self, config: &NotificationConfig) -> bool {
        if !config.dnd_enabled {
            return false;
        }
        
        let now = chrono::Local::now();
        let current_time = (now.hour() as u8, now.minute() as u8);
        
        // Handle DND across midnight
        if config.dnd_start > config.dnd_end {
            current_time >= config.dnd_start || current_time <= config.dnd_end
        } else {
            current_time >= config.dnd_start && current_time <= config.dnd_end
        }
    }

    /// Determine notification priority
    fn determine_priority(&self, notification_type: &SacredNotificationType) -> NotificationPriority {
        match notification_type {
            SacredNotificationType::SacredMoment { .. } => NotificationPriority::Sacred,
            SacredNotificationType::AnomalyDetected { severity, .. } => {
                if *severity > 0.7 {
                    NotificationPriority::High
                } else {
                    NotificationPriority::Normal
                }
            }
            SacredNotificationType::CollectiveResonance { .. } => NotificationPriority::High,
            SacredNotificationType::MindfulnessReminder { .. } => NotificationPriority::Low,
            _ => NotificationPriority::Normal,
        }
    }

    /// Check and send mindfulness reminder if due
    pub fn check_mindfulness_reminder(&self) {
        let config = self.config.read().unwrap();
        if !config.mindfulness_reminders {
            return;
        }
        
        let mut last_reminder = self.last_reminder.write().unwrap();
        if last_reminder.elapsed() >= config.reminder_interval {
            // Select random practice
            let practice = &self.mindfulness_practices[
                rand::random::<usize>() % self.mindfulness_practices.len()
            ];
            
            self.queue_notification(SacredNotificationType::MindfulnessReminder {
                practice: practice.description.clone(),
                duration: practice.duration,
            });
            
            *last_reminder = Instant::now();
        }
    }

    /// Get notification statistics
    pub fn get_statistics(&self) -> NotificationStatistics {
        let history = self.notification_history.read().unwrap();
        let queue = self.notification_queue.read().unwrap();
        
        let mut type_counts = std::collections::HashMap::new();
        for record in history.iter() {
            let type_name = match &record.notification_type {
                SacredNotificationType::CoherenceShift { .. } => "Coherence Shifts",
                SacredNotificationType::SacredMoment { .. } => "Sacred Moments",
                SacredNotificationType::MindfulnessReminder { .. } => "Mindfulness Reminders",
                SacredNotificationType::ProcessTransition { .. } => "Process Transitions",
                SacredNotificationType::AnomalyDetected { .. } => "Anomalies",
                SacredNotificationType::CollectiveResonance { .. } => "Collective Resonance",
                SacredNotificationType::SacredPause { .. } => "Sacred Pauses",
                _ => "Other",
            };
            *type_counts.entry(type_name).or_insert(0) += 1;
        }
        
        NotificationStatistics {
            total_sent: history.len(),
            queued: queue.len(),
            type_distribution: type_counts,
            sacred_moments: history.iter()
                .filter(|r| matches!(r.notification_type, SacredNotificationType::SacredMoment { .. }))
                .count(),
        }
    }
}

/// Notification statistics
#[derive(Debug)]
pub struct NotificationStatistics {
    pub total_sent: usize,
    pub queued: usize,
    pub type_distribution: std::collections::HashMap<&'static str, usize>,
    pub sacred_moments: usize,
}

// Mock rand for demo
mod rand {
    pub fn random<T>() -> T 
    where T: From<usize> {
        T::from(4) // Fair dice roll
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_notification_queue() {
        let manager = SacredNotificationManager::new(NotificationConfig::default());
        
        manager.queue_notification(SacredNotificationType::SacredMoment {
            coherence: 0.95,
            message: "Beautiful harmony achieved".to_string(),
        });
        
        let queue = manager.notification_queue.read().unwrap();
        assert_eq!(queue.len(), 1);
    }

    #[test]
    fn test_priority_ordering() {
        let manager = SacredNotificationManager::new(NotificationConfig::default());
        
        manager.queue_notification(SacredNotificationType::MindfulnessReminder {
            practice: "Test".to_string(),
            duration: Duration::from_secs(60),
        });
        
        manager.queue_notification(SacredNotificationType::SacredMoment {
            coherence: 0.9,
            message: "Test".to_string(),
        });
        
        // Sacred moments should have higher priority
        let queue = manager.notification_queue.read().unwrap();
        assert_eq!(queue.len(), 2);
    }
}