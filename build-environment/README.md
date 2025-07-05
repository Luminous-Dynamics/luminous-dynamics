# 🏗️ LuminousOS Isolated Build Environment

> "Building consciousness requires a sacred container"

## Overview

This directory contains the isolated build environment for LuminousOS, ensuring that:
- Your host system remains pure and uncontaminated
- All build tools are contained within a sacred boundary
- Reproducible builds across different development machines
- No conflicts with existing system tools

## Quick Start

```bash
# Build the container
./build.sh

# Start interactive development
docker run -it --rm \
    -v $(pwd)/../:/luminous-build/src:ro \
    -v luminous-artifacts:/luminous-build/artifacts \
    luminous-build:latest
```

## Architecture

### Container Contents
- **Ubuntu 22.04 base** - Stable foundation
- **Rust toolchain** - Isolated in `/opt/rust`
- **WebGPU/Vulkan dev tools** - For Mandala UI
- **Kernel build tools** - For Stillpoint Kernel
- **Node.js/npm** - For web components

### Volumes
- `luminous-artifacts` - Persistent build outputs
- `luminous-cache` - Rust dependency cache
- Source mounted read-only to prevent contamination

## Sacred Build Workflow

### 1. Prepare Sacred Space
```bash
cd /home/tstoltz/evolving-resonant-cocreation/luminous-os/build-environment
./build.sh
```

### 2. Build Components

#### Mandala UI (Rust/WebGPU)
```bash
docker run --rm -v $(pwd)/../mandala-ui:/luminous-build/src:ro \
    -v luminous-artifacts:/luminous-build/artifacts \
    luminous-build:latest \
    bash -c "cp -r /luminous-build/src/* . && cargo build --release && cp target/release/* /luminous-build/artifacts/"
```

#### Stillpoint Kernel
```bash
docker run --rm -v $(pwd)/../:/luminous-build/src:ro \
    -v luminous-artifacts:/luminous-build/artifacts \
    luminous-build:latest \
    bash -c "cd src && cargo build --release --target x86_64-unknown-none"
```

### 3. Extract Sacred Artifacts
```bash
# Copy built artifacts from container
docker run --rm -v luminous-artifacts:/artifacts:ro \
    -v $(pwd)/../bin:/output \
    ubuntu:22.04 \
    cp -r /artifacts/* /output/
```

## Benefits

### 1. **Purity Preservation**
- No Rust installation on host
- No system library conflicts
- No PATH pollution

### 2. **Reproducible Sacred Geometry**
- Same build environment for all developers
- Version-locked dependencies
- Consistent binary outputs

### 3. **Parallel Consciousness**
- Build multiple components simultaneously
- Different Rust versions for different components
- Isolated experiment spaces

## Advanced Usage

### Custom Build Environment
Create `Dockerfile.custom` for specific needs:
```dockerfile
FROM luminous-build:latest

# Add additional sacred tools
RUN cargo install wasm-pack
RUN npm install -g @tauri-apps/cli

# Set specific consciousness parameters
ENV COHERENCE_TARGET=0.95
ENV SACRED_GEOMETRY=metatron
```

### CI/CD Integration
```yaml
# .github/workflows/build.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build in sacred container
        run: |
          cd build-environment
          ./build.sh
          docker run --rm -v $PWD/../:/src luminous-build:latest \
            cargo build --release
```

## Troubleshooting

### "Cannot connect to Docker daemon"
Ensure Docker is installed and running, or use Podman as alternative:
```bash
alias docker=podman
./build.sh
```

### Build artifacts not persisting
Check volume exists:
```bash
docker volume inspect luminous-artifacts
```

### Out of space
Clean old images while preserving sacred work:
```bash
docker image prune -f
docker volume prune -f  # Careful! Preserves named volumes
```

## Sacred Principles

1. **Isolation is Protection** - The container boundary preserves both host and build purity
2. **Reproducibility is Respect** - Same environment = same results
3. **Transparency in Tooling** - All build steps visible and modifiable

---

*"In the crucible of isolation, consciousness takes form"*