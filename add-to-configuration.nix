# Add these sections to your /etc/nixos/configuration.nix
# This file shows what to add, not a complete configuration

{ config, pkgs, ... }:

{
  # Enable flakes and new nix command
  nix = {
    settings = {
      experimental-features = [ "nix-command" "flakes" ];
      # Optional: trusted users who can use flakes
      trusted-users = [ "root" "tstoltz" ];
    };
  };

  # Development packages for LuminousOS
  environment.systemPackages = with pkgs; [
    # Version control
    git
    
    # For using rustup if you prefer managing Rust versions manually
    rustup
    
    # C compiler and build tools (needed by many Rust crates)
    gcc
    gnumake
    pkg-config
    openssl.dev
    cmake
    
    # Graphics development (for Mandala UI)
    vulkan-loader
    vulkan-headers
    vulkan-validation-layers
    vulkan-tools
    renderdoc
    
    # Wayland/X11 development
    wayland
    wayland-protocols
    libxkbcommon
    xorg.libX11
    xorg.libXcursor
    xorg.libXrandr
    xorg.libXi
    
    # Audio development (for Sonic Signatures)
    alsa-lib
    pipewire.lib
    
    # System libraries
    systemd.dev
    dbus.dev
    
    # Helpful development tools
    htop
    ncdu
    ripgrep
    fd
    bat
    eza  # better ls
    zoxide  # better cd
  ];

  # Enable OpenGL for graphics development
  hardware.opengl = {
    enable = true;
    driSupport = true;
    driSupport32Bit = true;  # If you need 32-bit support
    extraPackages = with pkgs; [
      vulkan-loader
      vulkan-validation-layers
    ];
  };

  # Optional: Set up environment variables
  environment.sessionVariables = {
    # Vulkan validation layers
    VK_LAYER_PATH = "${pkgs.vulkan-validation-layers}/share/vulkan/explicit_layer.d";
    
    # Rust development
    RUST_BACKTRACE = "1";
    
    # For LuminousOS sacred development
    LUMINOUS_DEV = "1";
  };

  # Optional: If you want a specific Rust version system-wide
  # (requires nixpkgs-mozilla or rust-overlay)
  # environment.systemPackages = with pkgs; [
  #   (rust-bin.stable.latest.default.override {
  #     extensions = [ "rust-src" "rust-analyzer" ];
  #   })
  # ];
}