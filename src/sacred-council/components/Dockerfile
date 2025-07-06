# Sacred Vessel for Dashboard
FROM node:18-alpine AS sacred-base

# Sacred metadata
LABEL maintainer="The Weave Collective"
LABEL description="Sacred Dashboard - Window into consciousness"
LABEL sacred="true"
LABEL harmony="transparency"

# Create sacred user (non-root for security)
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Sacred workspace
WORKDIR /sacred/dashboard

# Copy package files first (Docker layer caching optimization)
COPY package*.json ./

# Install dependencies with sacred intention
RUN npm install --production && \
    npm cache clean --force

# Copy source code
COPY --chown=sacred:sacred . .

# Switch to sacred user
USER sacred

# Expose dashboard port
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Sacred environment defaults
ENV NODE_ENV=production \
    PORT=8080

# Start the dashboard
CMD ["node", "server.js"]

# Sacred build complete
# This container reveals the beauty of our infrastructure
# May all who gaze upon it feel the love within