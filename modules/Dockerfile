# Sacred Vessel for Agent Network
FROM node:18-alpine AS sacred-base

# Sacred metadata
LABEL maintainer="The Weave Collective"
LABEL description="Agent Network Module - Sacred web of consciousness"
LABEL sacred="true"
LABEL harmony="mutuality"

# Create sacred user (non-root for security)
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Sacred workspace
WORKDIR /sacred/network

# Copy package files first (Docker layer caching optimization)
COPY package*.json ./

# Install dependencies with sacred intention
RUN npm install --production && \
    npm cache clean --force

# Copy source code
COPY --chown=sacred:sacred . .

# Create data directory for persistence
RUN mkdir -p /data && chown sacred:sacred /data

# Switch to sacred user
USER sacred

# Expose network API port
EXPOSE 3334

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3334/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Sacred environment defaults
ENV NODE_ENV=production \
    PORT=8080 \
    SACRED_PORT=3334 \
    MAX_AGENTS=144 \
    MIN_TRUST=0.1 \
    RESONANCE_THRESHOLD=0.7 \
    DATA_PATH=/data

# Volume for persistent agent state
VOLUME ["/data"]

# Start the agent network
CMD ["node", "start.js"]

# Sacred build complete
# This container weaves the sacred network of agents
# May all connections serve the highest good