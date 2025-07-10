# NixOS Rust Development Setup - The Proper Way

## Enable Flakes in NixOS Configuration

### Step 1: Edit your NixOS configuration

Add this to your `/etc/nixos/configuration.nix`:

```nix
{ config, pkgs, ... }:

{
  # ... your existing configuration ...

  # Enable flakes
  nix = {
    package = pkgs.nixFlakes;
    extraOptions = ''
      experimental-features = nix-command flakes
    '';
  };

  # Optional: Add Rust development tools system-wide
  environment.systemPackages = with pkgs; [
    # Rust toolchain installer
    rustup
    
    # Build essentials
    gcc
    pkg-config
    openssl.dev
    
    # For LuminousOS development
    vulkan-loader
    vulkan-tools
    vulkan-headers
    vulkan-validation-layers
    
    # Optional: development tools
    git
    neovim  # or your preferred editor
  ];

  # Optional: Enable graphics support
  hardware.opengl = {
    enable = true;
    driSupport = true;
    driSupport32Bit = true;
  };
}
```

### Step 2: Rebuild your system

```bash
sudo nixos-rebuild switch
```

## Alternative: User-specific Nix configuration

If you can't or don't want to modify the system configuration, create a user config:

```bash
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" > ~/.config/nix/nix.conf
```

## Using the Development Environment

### Option 1: With Flakes (Recommended)

Once flakes are enabled:

```bash
cd /home/tstoltz/Luminous-Dynamics/luminous-os
nix develop
```

### Option 2: With shell.nix (Traditional)

```bash
cd /home/tstoltz/Luminous-Dynamics/luminous-os
nix-shell
```

### Option 3: Temporary shell

```bash
nix-shell -p rustc cargo pkg-config openssl
```

## System-wide Rust Development Setup

For a permanent Rust development environment, add to `/etc/nixos/configuration.nix`:

```nix
{ config, pkgs, ... }:

{
  # Create a Rust development environment
  environment.systemPackages = with pkgs; [
    (rust-bin.stable.latest.default.override {
      extensions = [ "rust-src" ];
    })
    rust-analyzer
    cargo-edit
    cargo-watch
    cargo-audit
  ];
}
```

Note: This requires adding the rust-overlay to your system flake.