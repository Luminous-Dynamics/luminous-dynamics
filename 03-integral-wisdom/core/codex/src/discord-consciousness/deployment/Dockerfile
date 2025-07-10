# Sacred Discord Bot - Production Dockerfile
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Final stage
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache cairo pango

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create data directory
RUN mkdir -p /data

# Create non-root user
RUN addgroup -g 1001 -S sacred && \
    adduser -S -u 1001 -G sacred sacred

# Change ownership
RUN chown -R sacred:sacred /app /data

# Switch to non-root user
USER sacred

# Expose ports
EXPOSE 8080 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node health-check.js || exit 1

# Start the bot
CMD ["node", "index.js"]