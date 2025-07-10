# LuminousOS Enhanced Development Shell
# Complete environment for consciousness-first OS development

{ pkgs ? import <nixpkgs> {} }:

let
  # Custom Rust toolchain with specific version
  rust-toolchain = pkgs.rust-bin.stable.latest.default.override {
    extensions = [ "rust-src" "rust-analyzer" ];
    targets = [ "x86_64-unknown-linux-gnu" "wasm32-unknown-unknown" ];
  };
in
pkgs.mkShell {
  name = "luminous-os-enhanced";
  
  buildInputs = with pkgs; [
    # Rust development
    rust-toolchain
    cargo-watch     # Auto-rebuild on changes
    cargo-edit      # Add/update dependencies
    cargo-outdated  # Check for updates
    cargo-audit     # Security audits
    cargo-nextest   # Better test runner
    bacon           # Background rust checker
    
    # OS Development tools
    qemu            # OS emulation
    grub2           # Bootloader
    xorriso         # ISO creation
    nasm            # Assembly
    binutils        # Binary utilities
    gdb             # Debugging
    bochs           # x86 emulator
    
    # Python for demos/tools
    python311
    python311Packages.pygame
    python311Packages.psutil
    python311Packages.numpy
    
    # JavaScript/WebGPU development
    nodejs_20
    nodePackages.typescript
    nodePackages.pnpm
    
    # Graphics/Vulkan
    vulkan-loader
    vulkan-headers
    vulkan-validation-layers
    vulkan-tools
    renderdoc       # Graphics debugging
    mesa-demos
    glslang         # GLSL compiler
    
    # Audio processing
    alsa-lib
    pipewire
    jack2
    supercollider   # Audio synthesis
    
    # System libraries
    libudev-zero
    libusb1
    hidapi
    
    # Documentation & Analysis
    mdbook
    graphviz        # For architecture diagrams
    plantuml
    tokei
    loc
    
    # Performance analysis
    hyperfine
    flamegraph
    perf-tools
    valgrind
    heaptrack
    
    # Container/VM tools
    docker
    podman
    firecracker     # Lightweight VMs
    
    # Additional dev tools
    tmux
    ripgrep
    fd
    bat
    jq
    yq
    watchexec       # File watcher
  ];
  
  shellHook = ''
    echo "🌟 LuminousOS Enhanced Development Environment 🌟"
    echo "================================================"
    echo "🦀 Rust: $(rustc --version | cut -d' ' -f2)"
    echo "🐍 Python: $(python --version | cut -d' ' -f2)"
    echo "📦 Node: $(node --version)"
    echo "🖥️  QEMU: $(qemu-system-x86_64 --version | head -n1 | cut -d' ' -f4)"
    echo ""
    
    # Environment setup
    export LD_LIBRARY_PATH="${pkgs.vulkan-loader}/lib:${pkgs.libxkbcommon}/lib:$LD_LIBRARY_PATH"
    export VK_LAYER_PATH="${pkgs.vulkan-validation-layers}/share/vulkan/explicit_layer.d"
    export RUST_BACKTRACE=1
    export CARGO_TERM_COLOR=always
    export LUMINOUS_DEV=1
    
    # Create build directories
    mkdir -p build/{iso,kernel,userspace}
    
    # Aliases for common tasks
    alias lb="cargo build --release"
    alias lt="cargo nextest run"
    alias lw="cargo watch -x check -x test -x run"
    alias lk="cd kernel && cargo build --target x86_64-luminous.json"
    alias liso="./scripts/build-iso.sh"
    alias lemu="qemu-system-x86_64 -cdrom build/iso/luminous.iso -m 2G"
    
    echo "Available commands:"
    echo "  lb    - Build LuminousOS"
    echo "  lt    - Run tests"
    echo "  lw    - Watch mode (auto-rebuild)"
    echo "  lk    - Build kernel"
    echo "  liso  - Create bootable ISO"
    echo "  lemu  - Run in QEMU emulator"
    echo ""
    echo "✨ May your code amplify consciousness ✨"
  '';
}