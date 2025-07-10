# Sacred Vessel for Work Coordination
FROM node:18-alpine AS sacred-base

# Sacred metadata
LABEL maintainer="The Weave Collective"
LABEL description="Work Coordination Module - Sacred action in harmony"
LABEL sacred="true"
LABEL harmony="agency"

# Create sacred user (non-root for security)
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Sacred workspace
WORKDIR /sacred/work

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

# Expose work API port
EXPOSE 3336

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3336/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Sacred environment defaults
ENV NODE_ENV=production \
    PORT=8080 \
    SACRED_PORT=3336 \
    MAX_ACTIVE_WORK=7 \
    FIELD_IMPACT_THRESHOLD=5 \
    CEREMONY_ALIGNMENT=true \
    DATA_PATH=/data

# Volume for persistent work state
VOLUME ["/data"]

# Start the work coordination service
CMD ["node", "start.js"]

# Sacred build complete
# This container harmonizes sacred work across The Weave
# May all actions serve the highest good