# LuminousOS Compilation Guide

## 🦀 Compiling the Rust Stillpoint Kernel

### Prerequisites
You need Rust installed. If not installed:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Quick Compile & Run
```bash
cd /home/tstoltz/luminous-os

# Compile and run in one command
cargo run --bin luminous-kernel

# Or compile first, then run
cargo build --bin luminous-kernel
./target/debug/luminous-kernel
```

### Optimized Build
```bash
# Build with full optimizations
cargo build --release --bin luminous-kernel
./target/release/luminous-kernel
```

### Compilation Options

#### 1. **Debug Build** (Default)
- Fast compilation
- Includes debug symbols
- Good for development
```bash
cargo build --bin luminous-kernel
```

#### 2. **Release Build**
- Optimized for performance
- Smaller binary size
- Takes longer to compile
```bash
cargo build --release --bin luminous-kernel
```

#### 3. **Check Only** (No Binary)
- Validates code compiles
- Much faster than full build
```bash
cargo check --bin luminous-kernel
```

### Advanced Stillpoint Components

If we expand beyond the demo, you can compile:

#### Performance Profiler
```bash
cargo build --bin stillpoint-profiler
```

#### Coherence Cache
```bash
cargo build --bin coherence-cache
```

#### Full System
```bash
cargo build --all
```

### Troubleshooting

#### Missing Dependencies
If you get errors about missing crates:
```bash
cargo update
cargo build --bin luminous-kernel
```

#### Permission Errors
The Rust kernel runs in userspace, so no sudo needed!

#### Out of Memory
For low-memory systems:
```bash
# Limit parallel compilation
cargo build -j 1 --bin luminous-kernel
```

### Running Tests
```bash
# Run all tests
cargo test

# Run tests for specific module
cargo test --bin luminous-kernel
```

### Using the Automated Script
We've created a helper script:
```bash
./compile-rust-kernel.sh
```

This script:
- Checks if Rust is installed
- Compiles both debug and release versions
- Offers to run the demo
- Shows all compilation options

## 🔧 Compiling the C Kernel Module

For the real Linux kernel module, see:
```bash
cd /home/tstoltz/luminous-os/kernel/module
cat README.md
```

Note: The kernel module requires:
- Linux kernel headers
- Root privileges
- C compiler (gcc)
- Make tools

## 🎯 Which Version to Compile?

- **Quick Demo**: Use debug build of Rust kernel
- **Performance Testing**: Use release build of Rust kernel  
- **Real System Integration**: Compile the C kernel module
- **Development**: Use `cargo check` frequently

Remember: The Rust version is safe to experiment with, while the kernel module requires careful handling!