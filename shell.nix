# Sacred Rust Development Shell for LuminousOS
# "Where consciousness meets compilation"

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "luminous-os-dev";
  
  buildInputs = with pkgs; [
    # Rust toolchain
    rustc
    cargo
    rustfmt
    rust-analyzer
    clippy
    cargo-watch
    cargo-edit
    cargo-outdated
    cargo-nextest
    bacon         # Background rust checker
    mold          # Faster linker
    
    # Build essentials
    pkg-config
    openssl
    cmake
    
    # Graphics dependencies (for Mandala UI)
    vulkan-loader
    vulkan-headers
    vulkan-validation-layers
    xorg.libX11
    xorg.libXcursor
    xorg.libXrandr
    xorg.libXi
    wayland
    libxkbcommon
    renderdoc     # Graphics debugging
    
    # Audio dependencies (for Sonic Signatures)
    alsa-lib
    pipewire
    
    # System dependencies
    libudev-zero
    dbus         # Added for btleplug
    systemd      # Added for systemd integration
    
    # Development tools
    gdb
    lldb
    valgrind
    hyperfine    # for benchmarking
    tokei        # count lines of code
    flamegraph   # Performance profiling
    heaptrack    # Memory profiling
    
    # Python for demos
    python311
    python311Packages.pygame
    python311Packages.psutil
    python311Packages.numpy
    
    # Documentation
    mdbook
    graphviz
    plantuml
  ];
  
  # Environment variables
  shellHook = ''
    echo "✨ Entering LuminousOS Sacred Development Shell ✨"
    echo "🦀 Rust $(rustc --version | cut -d' ' -f2) ready for consciousness"
    echo ""
    echo "Available commands:"
    echo "  cargo build    - Build the project"
    echo "  cargo check    - Check for compilation errors"
    echo "  cargo test     - Run tests"
    echo "  cargo bench    - Run benchmarks"
    echo "  cargo clippy   - Run linter"
    echo "  cargo fmt      - Format code"
    echo ""
    echo "Sacred development shortcuts:"
    echo "  cargo run --bin luminous    - Run main OS"
    echo "  cargo doc --open           - Generate & view docs"
    echo ""
    
    # Set library paths for graphics
    export LD_LIBRARY_PATH="${pkgs.vulkan-loader}/lib:${pkgs.libxkbcommon}/lib:$LD_LIBRARY_PATH"
    
    # Rust backtrace for better debugging
    export RUST_BACKTRACE=1
    
    # Pretty cargo output
    export CARGO_TERM_COLOR=always
    
    # Set up cargo home if not set
    export CARGO_HOME="$HOME/.cargo"
    export PATH="$CARGO_HOME/bin:$PATH"
  '';
  
  # Vulkan environment
  VK_LAYER_PATH = "${pkgs.vulkan-validation-layers}/share/vulkan/explicit_layer.d";
}