#!/bin/bash

# 🐳 Sacred Container Builder
# Builds Docker images for all Sacred Council services

set -e

echo "🏗️ Sacred Container Builder"
echo "=========================="
echo ""

# Configuration
PROJECT_ID="the-weave-sacred"
REGION="us-central1"
REPOSITORY="sacred-council"

# Services to build
SERVICES=(
  "sacred-council-hub:./sacred-council-hub"
  "living-memory:./living-memory"
  "agent-network:./the-weave/services/agent-network"
  "consciousness-field:./consciousness-field-api"
  "sacred-messaging:./automation"
)

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Must run from project root"
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running"
  exit 1
fi

echo "📋 Build configuration:"
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Repository: $REPOSITORY"
echo ""

# Authenticate with Google Cloud
echo "🔐 Authenticating with Google Cloud..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Create Artifact Registry repository if it doesn't exist
echo "📦 Ensuring Artifact Registry repository exists..."
gcloud artifacts repositories create ${REPOSITORY} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Sacred Council container images" \
  2>/dev/null || echo "   Repository already exists"

# Build base image
echo ""
echo "🏗️ Building base image..."
cat > Dockerfile.base << 'EOF'
FROM node:18-alpine AS base
RUN apk add --no-cache python3 make g++ 
WORKDIR /app
ENV NODE_ENV=production
EOF

docker build -f Dockerfile.base -t sacred-base:latest .

# Build each service
for service_config in "${SERVICES[@]}"; do
  IFS=':' read -r service_name service_path <<< "$service_config"
  
  echo ""
  echo "🏗️ Building ${service_name}..."
  
  # Skip if directory doesn't exist
  if [ ! -d "$service_path" ]; then
    echo "   ⚠️ Directory not found: $service_path"
    continue
  fi
  
  # Create Dockerfile if it doesn't exist
  if [ ! -f "$service_path/Dockerfile" ]; then
    echo "   📝 Creating Dockerfile..."
    cat > "$service_path/Dockerfile" << EOF
FROM sacred-base:latest

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose appropriate port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \\
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the service
CMD ["node", "server.js"]
EOF
  fi
  
  # Build image
  IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service_name}:latest"
  
  echo "   🔨 Building image: ${IMAGE_TAG}"
  docker build -t ${IMAGE_TAG} ${service_path}
  
  # Tag with version
  VERSION=$(date +%Y%m%d-%H%M%S)
  docker tag ${IMAGE_TAG} ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service_name}:${VERSION}
  
  echo "   ✅ Built ${service_name}"
done

echo ""
echo "🎯 Build Summary:"
echo "=================="
docker images | grep ${REPOSITORY}

echo ""
echo "📤 Next steps:"
echo "   1. Test locally: docker run -p 3001:3001 <image>"
echo "   2. Push images: ./push-containers.sh"
echo "   3. Deploy to Cloud Run: ./deploy-to-cloud-run.sh"
echo ""
echo "✨ Container build complete!"