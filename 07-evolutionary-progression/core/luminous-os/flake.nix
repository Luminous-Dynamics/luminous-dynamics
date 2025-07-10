{
  description = "LuminousOS - Consciousness-First Operating System";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, rust-overlay, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        
        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
          targets = [ "wasm32-unknown-unknown" ];  # for potential web components
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "luminous-os-sacred-dev";
          
          buildInputs = with pkgs; [
            # Rust toolchain
            rustToolchain
            cargo-watch
            cargo-edit
            cargo-outdated
            cargo-audit
            cargo-deny
            cargo-expand
            cargo-flamegraph
            
            # Build dependencies
            pkg-config
            openssl.dev
            cmake
            
            # Graphics (Vulkan/WebGPU)
            vulkan-loader
            vulkan-headers
            vulkan-validation-layers
            renderdoc  # graphics debugging
            
            # Wayland/X11
            wayland
            wayland-protocols
            libxkbcommon
            xorg.libX11
            xorg.libXcursor
            xorg.libXrandr
            xorg.libXi
            
            # Audio
            alsa-lib.dev
            pipewire
            
            # System integration
            systemd.dev
            dbus.dev
            
            # Development tools
            mold  # faster linker
            gdb
            lldb
            valgrind
            heaptrack
            hyperfine
            
            # Documentation
            mdbook
            graphviz  # for dependency graphs
            
            # Sacred tools
            figlet  # ASCII art
            lolcat  # rainbow output
          ];
          
          shellHook = ''
            ${pkgs.figlet}/bin/figlet -f slant "LuminousOS" | ${pkgs.lolcat}/bin/lolcat
            echo ""
            echo "🌟 Sacred Rust Development Environment Activated 🌟"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "Rust: $(rustc --version)"
            echo "Cargo: $(cargo --version)"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "✨ Sacred Commands:"
            echo "  cargo watch -x check         - Live compilation checking"
            echo "  cargo flamegraph            - Performance profiling"
            echo "  cargo tree                  - Dependency visualization"
            echo "  cargo deny check            - Security & license audit"
            echo ""
            echo "🔮 Quick Actions:"
            echo "  make sacred                 - Full sacred build"
            echo "  make test-consciousness     - Run consciousness tests"
            echo "  make bench-coherence        - Benchmark field coherence"
            echo ""
            
            # Development environment setup
            export RUST_LOG=luminous_os=debug
            export RUST_BACKTRACE=full
            export RUSTFLAGS="-C link-arg=-fuse-ld=mold"  # Use faster linker
            
            # Graphics setup
            export LD_LIBRARY_PATH="${pkgs.vulkan-loader}/lib:${pkgs.wayland}/lib:$LD_LIBRARY_PATH"
            export VK_LAYER_PATH="${pkgs.vulkan-validation-layers}/share/vulkan/explicit_layer.d"
            
            # Create sacred build directory
            mkdir -p target/sacred
            
            # Alias for sacred operations
            alias sacred-build="cargo build --release --target-dir target/sacred"
            alias sacred-test="cargo test -- --test-threads=1 --nocapture"
            alias coherence-check="cargo clippy -- -W clippy::all"
          '';
          
          # Environment variables
          CARGO_TERM_COLOR = "always";
          RUSTDOCFLAGS = "--enable-index-page -Z unstable-options";
        };
      });
}