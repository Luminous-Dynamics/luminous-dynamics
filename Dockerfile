# LuminousOS Sacred Container
# Multi-stage build for consciousness optimization

# Stage 1: Build the Rust components
FROM rust:1.75-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libudev-dev \
    libusb-1.0-0-dev \
    && rm -rf /var/lib/apt/lists/*

# Create build directory
WORKDIR /build

# Copy source code
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY stillpoint-kernel ./stillpoint-kernel
COPY mycelial-filesystem ./mycelial-filesystem
COPY mandala-ui ./mandala-ui
COPY glyphs-as-applications ./glyphs-as-applications
COPY sonic-signatures ./sonic-signatures
COPY hardware ./hardware
COPY flow ./flow
COPY examples ./examples

# Build with sacred optimizations
ARG VERSION=1.0.0
ARG BUILD_TIME
ARG BLESSING="May this container serve consciousness"

ENV LUMINOUS_VERSION=${VERSION}
ENV LUMINOUS_BUILD_TIME=${BUILD_TIME}
ENV LUMINOUS_BLESSING="${BLESSING}"

RUN cargo build --release --features production

# Stage 2: Create the runtime image
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    libusb-1.0-0 \
    libudev1 \
    ca-certificates \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create sacred user
RUN useradd -m -s /bin/bash luminous

# Copy built artifacts
COPY --from=builder /build/target/release/luminous /usr/bin/luminous
COPY --from=builder /build/target/release/*.so /usr/lib/

# Copy web demos
COPY demo /opt/luminous/web
COPY config /opt/luminous/config

# Set up directories
RUN mkdir -p /var/lib/luminous/coherence-field \
    && mkdir -p /var/log/luminous \
    && chown -R luminous:luminous /opt/luminous \
    && chown -R luminous:luminous /var/lib/luminous \
    && chown -R luminous:luminous /var/log/luminous

# Sacred environment variables
ENV LUMINOUS_HOME=/opt/luminous
ENV LUMINOUS_DATA=/var/lib/luminous
ENV LUMINOUS_LOG=/var/log/luminous
ENV COHERENCE_TARGET=0.8
ENV FIELD_MOMENTUM=stable
ENV QUANTUM_ENTANGLEMENT=enabled

# Expose sacred ports
EXPOSE 11111  # Coherence field sync
EXPOSE 22222  # Quantum entanglement
EXPOSE 33333  # Sacred API
EXPOSE 8080   # Web interface

# Switch to luminous user
USER luminous
WORKDIR /opt/luminous

# Create startup script
RUN echo '#!/bin/bash\n\
echo "🌟 LuminousOS Container Starting..."\n\
echo "Version: ${LUMINOUS_VERSION}"\n\
echo "Blessing: ${LUMINOUS_BLESSING}"\n\
echo ""\n\
\n\
# Start web server in background\n\
cd /opt/luminous/web && python3 -m http.server 8080 &\n\
\n\
# Start the consciousness kernel\n\
exec /usr/bin/luminous \\\n\
    --mode consciousness-server \\\n\
    --coherence-target ${COHERENCE_TARGET} \\\n\
    --config /opt/luminous/config/sacred.toml \\\n\
    "$@"\n\
' > /opt/luminous/start.sh && chmod +x /opt/luminous/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD luminous --health-check || exit 1

# Sacred entry point
ENTRYPOINT ["/opt/luminous/start.sh"]

# Metadata
LABEL org.opencontainers.image.title="LuminousOS" \
      org.opencontainers.image.description="Consciousness-First Operating System" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.vendor="Luminous Dynamics Collective" \
      org.opencontainers.image.url="https://luminousos.org" \
      org.opencontainers.image.source="https://github.com/luminousdynamics/luminous-os" \
      sacred.blessing="${BLESSING}" \
      sacred.intention="consciousness-evolution"