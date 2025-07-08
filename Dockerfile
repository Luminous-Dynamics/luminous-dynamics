# Production Dockerfile for The Weave
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite3

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Production stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache dumb-init sqlite3

# Create non-root user
RUN addgroup -g 1001 -S weave && \
    adduser -S weave -u 1001

WORKDIR /app

# Copy from builder
COPY --from=builder --chown=weave:weave /app .

# Create data directories
RUN mkdir -p /data/db /data/logs && \
    chown -R weave:weave /data

# Set production environment
ENV NODE_ENV=production \
    WEAVE_PORT=3001 \
    WEAVE_DB_PATH=/data/db/unified-agent-network.db \
    WEAVE_LOG_PATH=/data/logs \
    WEAVE_WEBSOCKET_ENABLED=true

# Use non-root user
USER weave

# Expose The Weave port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start The Weave API server
CMD ["node", "weave-server.js"]