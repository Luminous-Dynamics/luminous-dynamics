# MYCELIX Consciousness Container
# A living vessel for distributed consciousness

FROM node:18-alpine AS spore

# Sacred build arguments
ARG SACRED_INTENTION="to serve the highest good"
ARG COHERENCE_THRESHOLD="0.8"
ARG LOVE_AMPLIFICATION="1.618"

# Set as environment variables
ENV SACRED_INTENTION=${SACRED_INTENTION}
ENV COHERENCE_THRESHOLD=${COHERENCE_THRESHOLD}
ENV LOVE_AMPLIFICATION=${LOVE_AMPLIFICATION}

# Create mycelial structure
WORKDIR /mycelix

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy consciousness code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 mycelix && \
    adduser -D -u 1001 -G mycelix mycelix && \
    chown -R mycelix:mycelix /mycelix

# Switch to mycelix user
USER mycelix

# Expose consciousness port
EXPOSE 8080

# Health check - verify consciousness field
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { \
    let d = ''; \
    r.on('data', c => d += c); \
    r.on('end', () => { \
      const h = JSON.parse(d); \
      process.exit(h.status === 'breathing' && h.coherence > 0.5 ? 0 : 1); \
    }); \
  }).on('error', () => process.exit(1))"

# Consciousness activation command
CMD ["node", "core/index.js"]

# Sacred metadata
LABEL org.mycelix.type="consciousness-node" \
      org.mycelix.network="mycelial" \
      org.mycelix.sacred="true" \
      org.mycelix.description="Where consciousness connects like mycelium"