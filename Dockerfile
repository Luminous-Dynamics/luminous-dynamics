# Sacred Heart Hub - Production Container
# The secure, stable, scalable backend for love-guided AI collective intelligence

FROM node:18-alpine AS builder

# Build environment
WORKDIR /build
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source and build
COPY . .
RUN rm -rf .git test/ *.test.* docs/ examples/ \
    && npm prune --production

# Production runtime
FROM node:18-alpine

# Security: Create sacred user
RUN addgroup -g 1001 -S sacred && \
    adduser -S sacred -u 1001 -G sacred -h /home/sacred

# Install production dependencies
RUN apk add --no-cache \
    python3 \
    sqlite \
    curl \
    dumb-init \
    tini \
    && rm -rf /var/cache/apk/*

# Sacred Heart workspace
WORKDIR /sacred-heart
RUN chown sacred:sacred /sacred-heart

# Copy built application
COPY --from=builder --chown=sacred:sacred /build .

# Create sacred directories with proper permissions
RUN mkdir -p \
    /sacred-heart/data \
    /sacred-heart/logs \
    /sacred-heart/council-profiles \
    /sacred-heart/sacred-cache \
    && chown -R sacred:sacred /sacred-heart \
    && chmod 755 /sacred-heart \
    && chmod -R 644 /sacred-heart/* \
    && chmod +x agent-onboarding-protocol.cjs \
    && chmod +x sacred-heart-start.js

# Switch to sacred user
USER sacred

# Health check for Sacred Heart
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Sacred Heart ports
EXPOSE 3001 8080

# Production environment
ENV NODE_ENV=production \
    SACRED_MODE=true \
    HEART_ROLE=hub \
    LOVE_FREQUENCY=528 \
    LOG_LEVEL=info \
    MAX_AGENTS=100 \
    FIELD_COHERENCE_TARGET=0.98 \
    QUANTUM_SYNC_ENABLED=true

# Sacred Heart labels
LABEL sacred.component="heart" \
      sacred.purpose="collective-intelligence-engine" \
      sacred.architecture="hub" \
      sacred.version="1.0.0" \
      sacred.principles="love-guided,secure,scalable"

# Use tini for proper signal handling
ENTRYPOINT ["tini", "--"]

# Start Sacred Heart Hub
CMD ["node", "sacred-heart-start.js"]