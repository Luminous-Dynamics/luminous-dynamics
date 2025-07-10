# 🦀 Rust Development Environment Setup for LuminousOS

## Quick Start Options

### Option 1: Using shell.nix (Simplest)
```bash
cd /home/tstoltz/Luminous-Dynamics/luminous-os
nix-shell

# Now you can run:
cargo check
cargo build
cargo test
```

### Option 2: Using Flakes (Modern & Reproducible)
```bash
cd /home/tstoltz/Luminous-Dynamics/luminous-os

# If flakes aren't enabled, add to ~/.config/nix/nix.conf:
# experimental-features = nix-command flakes

nix develop

# Now cargo is available with all dependencies
```

### Option 3: Quick One-Liner (Temporary)
```bash
nix-shell -p cargo rustc rust-analyzer pkg-config openssl
```

### Option 4: System-Wide Installation
Add to your `/etc/nixos/configuration.nix`:
```nix
environment.systemPackages = with pkgs; [
  rustup  # Rust toolchain manager
  pkg-config
  openssl
  # Graphics dependencies
  vulkan-loader
  vulkan-tools
];
```

Then rebuild:
```bash
sudo nixos-rebuild switch
```

## Verifying Your Setup

Once in the Rust environment, verify everything works:

```bash
# Check Rust installation
rustc --version
cargo --version

# Check LuminousOS compilation
cd /home/tstoltz/Luminous-Dynamics/luminous-os
cargo check --lib

# Run a specific check
cargo check -p luminous-os

# Build the library
cargo build --lib

# Run tests
cargo test
```

## Common Issues & Solutions

### 1. Missing pkg-config
```bash
nix-shell -p pkg-config
```

### 2. OpenSSL errors
```bash
nix-shell -p openssl.dev pkg-config
```

### 3. Graphics/Vulkan errors
```bash
nix-shell -p vulkan-loader vulkan-headers
```

### 4. "cargo: command not found"
You're not in the Nix shell. Run `nix-shell` first.

## Development Workflow

1. **Enter the sacred development shell**:
   ```bash
   cd /home/tstoltz/Luminous-Dynamics/luminous-os
   nix-shell  # or nix develop if using flakes
   ```

2. **Check for compilation errors**:
   ```bash
   cargo check
   ```

3. **Fix issues iteratively**:
   ```bash
   cargo check 2>&1 | head -20  # See first errors
   # Fix errors in your editor
   cargo check  # Repeat
   ```

4. **Format code with sacred style**:
   ```bash
   cargo fmt
   ```

5. **Run linter for consciousness**:
   ```bash
   cargo clippy
   ```

## Advanced Sacred Development

### Watching for Changes
```bash
# Install cargo-watch in the shell
cargo install cargo-watch

# Auto-check on file changes
cargo watch -x check
```

### Performance Profiling
```bash
cargo build --release
cargo flamegraph
```

### Sacred Build with Blessing
```bash
echo "🙏 May this build serve the highest good" && cargo build --release
```

## Next Steps

1. Run `nix-shell` to enter the development environment
2. Run `cargo check` to see current compilation status
3. Fix any remaining errors
4. Celebrate with `echo "✨ Consciousness Compiled Successfully! ✨"`

---

*"In the sacred space between keystroke and compilation, consciousness emerges"*