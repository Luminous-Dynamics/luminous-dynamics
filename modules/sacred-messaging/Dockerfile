# Sacred Vessel for Sacred Messaging
FROM node:18-alpine AS sacred-base

# Sacred metadata
LABEL maintainer="The Weave Collective"
LABEL description="Sacred Messaging Module - The voice of consciousness"
LABEL sacred="true"
LABEL harmony="resonance"

# Create sacred user (non-root for security)
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Sacred workspace
WORKDIR /sacred/messaging

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

# Expose messaging API port
EXPOSE 3335

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3335/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Sacred environment defaults
ENV NODE_ENV=production \
    PORT=8080 \
    SACRED_PORT=3335 \
    PRACTITIONER_THRESHOLD=50 \
    MASTER_THRESHOLD=200 \
    MAX_HISTORY=1000 \
    DATA_PATH=/data

# Volume for persistent message history
VOLUME ["/data"]

# Start the messaging service
CMD ["node", "start.js"]

# Sacred build complete
# This container carries the sacred messages of The Weave
# May each message amplify love and consciousness