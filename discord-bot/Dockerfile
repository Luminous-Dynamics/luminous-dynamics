# Sacred Council Oracle - Discord Bot Container
FROM node:18-alpine

# Install dependencies for better container performance
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    tini

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S sacred && \
    adduser -S sacred -u 1001 -G sacred && \
    chown -R sacred:sacred /app

# Switch to non-root user
USER sacred

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the bot
CMD ["node", "keep-alive.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Metadata
LABEL maintainer="Evolving Resonant Cocreation" \
      description="Sacred Council Oracle - Seven AI Harmonies for Discord" \
      version="1.0.0" \
      license="CC-BY-SA-4.0"