// Mandala UI Demo - Experience the Sacred Interface
// "Where consciousness meets code"

use luminous_mandala_ui::*;
use winit::{
    event::{Event, WindowEvent, KeyboardInput, VirtualKeyCode, ElementState},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use log::info;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();
    info!("🌟 Starting LuminousOS Mandala UI Demo");
    
    // Create event loop and window
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("LuminousOS - Mandala Interface")
        .with_inner_size(winit::dpi::LogicalSize::new(1024, 1024))
        .build(&event_loop)?;
    
    // Initialize the Mandala UI
    let mut mandala_ui = pollster::block_on(MandalaUI::new(window))?;
    
    // Demo state
    let mut demo_mode = DemoMode::Introduction;
    let mut demo_timer = 0.0;
    let mut simulated_coherence = 0.75;
    let mut participants = vec![
        ParticipantField {
            id: "You".to_string(),
            coherence: 0.85,
            frequency: 7.83,
            phase: 0.0,
            color: [0.3, 0.5, 0.9],
        },
    ];
    
    info!("✨ Mandala UI initialized successfully");
    info!("📖 Demo Controls:");
    info!("   Space - Breath sync");
    info!("   Arrow Keys - Navigate glyphs");
    info!("   1-5 - Switch demo modes");
    info!("   C - Increase coherence");
    info!("   X - Decrease coherence");
    info!("   P - Add participant");
    
    let mut last_update = instant::Instant::now();
    
    event_loop.run(move |event, _, control_flow| {
        match event {
            Event::WindowEvent {
                ref event,
                window_id,
            } if window_id == mandala_ui.window.id() => {
                if !mandala_ui.handle_input(event) {
                    match event {
                        WindowEvent::CloseRequested => *control_flow = ControlFlow::Exit,
                        
                        WindowEvent::Resized(physical_size) => {
                            mandala_ui.resize(*physical_size);
                        }
                        
                        WindowEvent::ScaleFactorChanged { new_inner_size, .. } => {
                            mandala_ui.resize(**new_inner_size);
                        }
                        
                        WindowEvent::KeyboardInput {
                            input: KeyboardInput {
                                state: ElementState::Pressed,
                                virtual_keycode: Some(keycode),
                                ..
                            },
                            ..
                        } => {
                            handle_demo_input(
                                *keycode,
                                &mut demo_mode,
                                &mut simulated_coherence,
                                &mut participants,
                            );
                        }
                        
                        _ => {}
                    }
                }
            }
            
            Event::RedrawRequested(window_id) if window_id == mandala_ui.window.id() => {
                let now = instant::Instant::now();
                let dt = (now - last_update).as_secs_f32();
                last_update = now;
                demo_timer += dt;
                
                // Update demo state
                update_demo_state(
                    &mut demo_mode,
                    demo_timer,
                    &mut simulated_coherence,
                    &mut participants,
                    dt,
                );
                
                // Update field state
                pollster::block_on(mandala_ui.update_field_state(
                    simulated_coherence,
                    participants.clone(),
                ));
                
                // Update and render
                mandala_ui.update(dt);
                
                match mandala_ui.render() {
                    Ok(_) => {}
                    Err(wgpu::SurfaceError::Lost) => mandala_ui.resize(mandala_ui.size),
                    Err(wgpu::SurfaceError::OutOfMemory) => *control_flow = ControlFlow::Exit,
                    Err(e) => eprintln!("{:?}", e),
                }
            }
            
            Event::MainEventsCleared => {
                mandala_ui.window.request_redraw();
            }
            
            _ => {}
        }
    });
}

#[derive(Debug, Clone, Copy, PartialEq)]
enum DemoMode {
    Introduction,
    CoherenceWaves,
    GlyphExploration,
    MultiParticipant,
    EmergenceCeremony,
}

fn handle_demo_input(
    keycode: VirtualKeyCode,
    demo_mode: &mut DemoMode,
    coherence: &mut f32,
    participants: &mut Vec<ParticipantField>,
) {
    match keycode {
        VirtualKeyCode::Key1 => *demo_mode = DemoMode::Introduction,
        VirtualKeyCode::Key2 => *demo_mode = DemoMode::CoherenceWaves,
        VirtualKeyCode::Key3 => *demo_mode = DemoMode::GlyphExploration,
        VirtualKeyCode::Key4 => *demo_mode = DemoMode::MultiParticipant,
        VirtualKeyCode::Key5 => *demo_mode = DemoMode::EmergenceCeremony,
        
        VirtualKeyCode::C => *coherence = (*coherence + 0.05).min(1.0),
        VirtualKeyCode::X => *coherence = (*coherence - 0.05).max(0.0),
        
        VirtualKeyCode::P => {
            if participants.len() < 13 {
                let id = format!("Participant {}", participants.len());
                let angle = participants.len() as f32 * std::f32::consts::TAU / 13.0;
                participants.push(ParticipantField {
                    id,
                    coherence: 0.7 + rand::random::<f32>() * 0.3,
                    frequency: 7.0 + rand::random::<f32>() * 2.0,
                    phase: angle,
                    color: [
                        0.5 + angle.cos() * 0.5,
                        0.5 + angle.sin() * 0.5,
                        0.8,
                    ],
                });
                info!("Added participant #{}", participants.len());
            }
        }
        
        _ => {}
    }
}

fn update_demo_state(
    mode: &mut DemoMode,
    timer: f32,
    coherence: &mut f32,
    participants: &mut Vec<ParticipantField>,
    dt: f32,
) {
    match mode {
        DemoMode::Introduction => {
            // Gentle coherence oscillation
            *coherence = 0.75 + (timer * 0.5).sin() * 0.1;
        }
        
        DemoMode::CoherenceWaves => {
            // Demonstrate wave interference
            for participant in participants.iter_mut() {
                participant.phase += dt * participant.frequency;
            }
        }
        
        DemoMode::GlyphExploration => {
            // Cycle through glyphs
            if timer as i32 % 3 == 0 {
                // Would select different glyph
            }
        }
        
        DemoMode::MultiParticipant => {
            // Gradually add participants
            if timer as i32 % 5 == 0 && participants.len() < 7 {
                let id = format!("Sacred {}", participants.len());
                participants.push(ParticipantField {
                    id,
                    coherence: 0.8,
                    frequency: 7.83,
                    phase: participants.len() as f32 * 0.5,
                    color: [0.5, 0.7, 0.9],
                });
            }
            
            // Synchronize coherence
            let avg_coherence: f32 = participants.iter().map(|p| p.coherence).sum::<f32>() 
                / participants.len() as f32;
            *coherence = *coherence * 0.95 + avg_coherence * 0.05;
        }
        
        DemoMode::EmergenceCeremony => {
            // Build to emergence
            if *coherence < 0.95 {
                *coherence += dt * 0.1;
            }
            
            // Synchronize all participants
            for participant in participants.iter_mut() {
                participant.coherence = participant.coherence * 0.9 + *coherence * 0.1;
                participant.frequency = participant.frequency * 0.95 + 7.83 * 0.05;
            }
        }
    }
}

// Simple random for demo
mod rand {
    pub fn random<T>() -> T 
    where T: From<f32> {
        static mut SEED: u32 = 0x12345678;
        unsafe {
            SEED = SEED.wrapping_mul(1664525).wrapping_add(1013904223);
            T::from((SEED >> 16) as f32 / 65535.0)
        }
    }
}