pub mod virtual_hardware;
pub mod consciousness_sim;
pub mod ui;
pub mod scenarios;

use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct SimulatorConfig {
    pub mode: SimulatorMode,
    pub scenario: Option<String>,
    pub virtual_hrv: bool,
    pub coherence_baseline: f32,
}

#[derive(Debug, Clone)]
pub enum SimulatorMode {
    Gui,    // Full graphical interface
    Tui,    // Terminal UI
    Demo,   // Automated demonstration
}

pub struct Simulator {
    config: SimulatorConfig,
    virtual_hardware: virtual_hardware::VirtualHardware,
    consciousness_field: Arc<Mutex<consciousness_sim::ConsciousnessField>>,
}

impl Simulator {
    pub fn new(config: SimulatorConfig) -> Self {
        let virtual_hardware = virtual_hardware::VirtualHardware::new(
            config.virtual_hrv,
            config.coherence_baseline,
        );
        
        let consciousness_field = Arc::new(Mutex::new(
            consciousness_sim::ConsciousnessField::new()
        ));
        
        Self {
            config,
            virtual_hardware,
            consciousness_field,
        }
    }
    
    pub async fn run(&mut self) -> Result<(), Box<dyn Error>> {
        match self.config.mode {
            SimulatorMode::Gui => self.run_gui().await,
            SimulatorMode::Tui => self.run_tui().await,
            SimulatorMode::Demo => self.run_demo().await,
        }
    }
    
    #[cfg(feature = "gui")]
    async fn run_gui(&mut self) -> Result<(), Box<dyn Error>> {
        ui::gui::run_gui_simulator(self).await
    }
    
    #[cfg(feature = "tui")]
    async fn run_tui(&mut self) -> Result<(), Box<dyn Error>> {
        ui::tui::run_tui_simulator(self).await
    }
    
    async fn run_demo(&mut self) -> Result<(), Box<dyn Error>> {
        scenarios::demo::run_demo_sequence(self).await
    }
}

impl SimulatorConfig {
    pub fn from_args(args: &[String]) -> Result<Self, Box<dyn Error>> {
        let mut config = Self::default();
        
        let mut i = 1;
        while i < args.len() {
            match args[i].as_str() {
                "--gui" => config.mode = SimulatorMode::Gui,
                "--tui" => config.mode = SimulatorMode::Tui,
                "--demo" => config.mode = SimulatorMode::Demo,
                "--scenario" => {
                    i += 1;
                    config.scenario = Some(args[i].clone());
                }
                "--no-hrv" => config.virtual_hrv = false,
                "--coherence" => {
                    i += 1;
                    config.coherence_baseline = args[i].parse()?;
                }
                _ => {}
            }
            i += 1;
        }
        
        Ok(config)
    }
}

impl Default for SimulatorConfig {
    fn default() -> Self {
        Self {
            mode: SimulatorMode::Gui,
            scenario: None,
            virtual_hrv: true,
            coherence_baseline: 0.5,
        }
    }
}