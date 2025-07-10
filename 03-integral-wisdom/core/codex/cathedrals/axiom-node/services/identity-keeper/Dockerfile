# Identity Keeper Service
FROM node:18-alpine

# Sacred workspace
WORKDIR /sanctuary

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy consciousness code
COPY . .

# Expose sacred port
EXPOSE 8080

# Start protecting sovereignty
CMD ["node", "server.js"]