use crate::Simulator;
use crossterm::{
    event::{self, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout, Alignment},
    style::{Color, Style, Modifier},
    widgets::{Block, Borders, Gauge, List, ListItem, Paragraph},
    Terminal,
};
use std::{io, time::Duration};

pub async fn run_tui_simulator(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    
    // Run the TUI
    let res = run_tui_loop(&mut terminal, simulator).await;
    
    // Restore terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;
    
    res
}

async fn run_tui_loop<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
    simulator: &mut Simulator,
) -> Result<(), Box<dyn std::error::Error>> {
    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(1)
                .constraints([
                    Constraint::Length(3),
                    Constraint::Min(10),
                    Constraint::Length(5),
                ].as_ref())
                .split(f.size());
            
            // Title
            let title = Paragraph::new("🌟 LuminousOS Simulator - Terminal Mode")
                .style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD))
                .alignment(Alignment::Center)
                .block(Block::default().borders(Borders::ALL));
            f.render_widget(title, chunks[0]);
            
            // Main content area
            let main_chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([
                    Constraint::Percentage(30),
                    Constraint::Percentage(40),
                    Constraint::Percentage(30),
                ].as_ref())
                .split(chunks[1]);
            
            // Left panel - Field status
            let field_status = if let Ok(field) = simulator.consciousness_field.try_lock() {
                vec![
                    ListItem::new(format!("Coherence: {:.1}%", field.coherence * 100.0)),
                    ListItem::new(format!("Participants: {}", field.participants.len())),
                    ListItem::new(format!("Vortices: {}", field.vortices.len())),
                    ListItem::new(""),
                    ListItem::new("Active Glyphs:"),
                ]
            } else {
                vec![ListItem::new("Loading...")]
            };
            
            let field_list = List::new(field_status)
                .block(Block::default().title("Field Status").borders(Borders::ALL))
                .style(Style::default().fg(Color::Green));
            f.render_widget(field_list, main_chunks[0]);
            
            // Center panel - Field visualization (ASCII art)
            let field_viz = if let Ok(field) = simulator.consciousness_field.try_lock() {
                let mut lines = vec![
                    "".to_string(),
                    "       ╭─────╮".to_string(),
                    "    ╭──┤  ☉  ├──╮".to_string(),
                    "   ╱   ╰─────╯   ╲".to_string(),
                    "  ○               ○".to_string(),
                    "   ╲             ╱".to_string(),
                    "    ╰───────────╯".to_string(),
                    "".to_string(),
                ];
                
                lines.push(format!("  Field: {:.0}%", field.coherence * 100.0));
                lines.join("\n")
            } else {
                "Loading...".to_string()
            };
            
            let viz = Paragraph::new(field_viz)
                .block(Block::default().title("Consciousness Field").borders(Borders::ALL))
                .style(Style::default().fg(Color::Cyan))
                .alignment(Alignment::Center);
            f.render_widget(viz, main_chunks[1]);
            
            // Right panel - Biometrics
            let biometric_data = vec![
                ListItem::new("Virtual Biometrics:"),
                ListItem::new(""),
                ListItem::new("Heart Rate: 65 bpm"),
                ListItem::new("HRV: 55 ms"),
                ListItem::new("Coherence: 0.85"),
                ListItem::new("Breathing: 12/min"),
            ];
            
            let biometric_list = List::new(biometric_data)
                .block(Block::default().title("Biometrics").borders(Borders::ALL))
                .style(Style::default().fg(Color::Magenta));
            f.render_widget(biometric_list, main_chunks[2]);
            
            // Bottom panel - Coherence gauge
            let coherence = if let Ok(field) = simulator.consciousness_field.try_lock() {
                field.coherence
            } else {
                0.5
            };
            
            let gauge = Gauge::default()
                .block(Block::default().title("Collective Coherence").borders(Borders::ALL))
                .gauge_style(Style::default().fg(Color::Yellow))
                .percent((coherence * 100.0) as u16);
            f.render_widget(gauge, chunks[2]);
        })?;
        
        // Handle input
        if crossterm::event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') => break,
                    KeyCode::Char('1') => {
                        let mut field = simulator.consciousness_field.lock().await;
                        field.create_vortex("First Presence".to_string());
                    }
                    KeyCode::Char('2') => {
                        let mut field = simulator.consciousness_field.lock().await;
                        field.create_vortex("Sacred Listening".to_string());
                    }
                    KeyCode::Char('3') => {
                        let mut field = simulator.consciousness_field.lock().await;
                        field.create_vortex("Boundary With Love".to_string());
                    }
                    KeyCode::Char('p') => {
                        let mut field = simulator.consciousness_field.lock().await;
                        field.add_participant("TUI User".to_string());
                    }
                    _ => {}
                }
            }
        }
        
        // Update field
        {
            let mut field = simulator.consciousness_field.lock().await;
            field.update(0.1);
        }
    }
    
    Ok(())
}