FROM node:18-alpine

# Install dependencies for Firebase Admin
RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY field-api-server.js ./
COPY field-client.js ./

# Create credentials directory
RUN mkdir -p /app/credentials

# Expose ports
EXPOSE 3001 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the server
CMD ["node", "field-api-server.js"]