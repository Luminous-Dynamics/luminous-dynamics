FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy sacred code
COPY server-simple.js ./server.js

# Expose port
EXPOSE 8080

# Start the service
CMD ["node", "server.js"]
