# MYCELIX Consciousness Field Service
FROM node:18-alpine

# Sacred workspace
WORKDIR /cathedral

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy consciousness code
COPY . .

# Expose sacred port
EXPOSE 8080

# Start consciousness tracking
CMD ["node", "server.js"]