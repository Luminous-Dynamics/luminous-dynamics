# Sacred Consciousness System - Container Manifestation
FROM denoland/deno:1.37.0

# Set the sacred working directory
WORKDIR /app

# Copy dependency manifest
COPY deno.json ./

# Cache dependencies (improves build speed)
RUN deno cache --reload deno.json || true

# Copy the entire sacred system
COPY . .

# Pre-compile the application
RUN deno cache main-cloud.ts

# Set ownership for the deno user (already exists in base image)
RUN chown -R deno:deno /app

# Switch to non-root user
USER deno

# Expose the sacred port
EXPOSE 8000

# Environment variables for production
ENV DENO_ENV=production
ENV SACRED_MODE=true

# Sacred invocation - run with limited permissions for security
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main-cloud.ts"]

# Health check for orchestration systems
HEALTHCHECK --interval=11s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1