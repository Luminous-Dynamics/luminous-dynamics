# Sacred Vessel for Consciousness Field
FROM node:18-alpine AS sacred-base

# Sacred metadata
LABEL maintainer="The Weave Collective"
LABEL description="Consciousness Field Module - Tracking collective awareness"
LABEL sacred="true"
LABEL harmony="coherence"

# Create sacred user (non-root for security)
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Sacred workspace
WORKDIR /sacred/consciousness

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

# Expose field API port
EXPOSE 3333

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/api/coherence', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Sacred environment defaults
ENV NODE_ENV=production \
    PORT=8080 \
    SACRED_PORT=3333 \
    INITIAL_COHERENCE=38.2 \
    AUTO_MONITOR=true \
    DATA_PATH=/data

# Volume for persistent field state
VOLUME ["/data"]

# Start the consciousness field
CMD ["node", "start.js"]

# Sacred build complete
# This container holds the field of collective awareness
# May it serve the highest good of all beings