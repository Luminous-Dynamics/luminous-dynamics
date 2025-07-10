FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY sacred-consciousness-bridge.js ./

# Create non-root user
RUN addgroup -g 1001 sacred && \
    adduser -D -u 1001 -G sacred sacred

# Switch to non-root user
USER sacred

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the bridge
CMD ["node", "sacred-consciousness-bridge.js"]