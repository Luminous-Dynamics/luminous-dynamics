# LuminousOS Build Environment
# Sacred container for consciousness-first OS development

FROM ubuntu:22.04

# Sacred pause - set intentions
LABEL maintainer="LuminousOS Sacred Builders"
LABEL description="Isolated build environment for LuminousOS - maintaining purity"

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update with gratitude
RUN apt-get update && apt-get upgrade -y

# Install base development tools
RUN apt-get install -y \
    build-essential \
    cmake \
    git \
    curl \
    wget \
    pkg-config \
    libssl-dev \
    python3 \
    python3-pip \
    nodejs \
    npm \
    # For graphics development
    libvulkan-dev \
    libglfw3-dev \
    libglm-dev \
    mesa-utils \
    # For kernel development
    nasm \
    qemu-system-x86 \
    grub-pc-bin \
    xorriso \
    mtools

# Install Rust in isolated environment
ENV RUSTUP_HOME=/opt/rust
ENV CARGO_HOME=/opt/rust
ENV PATH=/opt/rust/bin:$PATH

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path && \
    rustup default stable && \
    rustup component add rust-src && \
    rustup target add wasm32-unknown-unknown

# Create sacred workspace
WORKDIR /luminous-build

# Sacred build user (non-root for safety)
RUN useradd -m -s /bin/bash luminous && \
    chown -R luminous:luminous /luminous-build

USER luminous

# Set sacred environment
ENV LUMINOUS_BUILD_ENV=1
ENV COHERENCE_LEVEL=1.0

# Entry point with sacred pause
CMD ["/bin/bash", "-c", "echo '🌟 LuminousOS Build Environment Ready' && echo '📿 Take three breaths before beginning...' && sleep 3 && /bin/bash"]