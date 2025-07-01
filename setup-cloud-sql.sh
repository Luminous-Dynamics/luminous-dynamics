#!/bin/bash

# Cloud SQL Setup for Sacred Council Hub
# Migrate from SQLite to PostgreSQL for cloud scale

PROJECT_ID="sacred-council-hub"
REGION="us-central1"
INSTANCE_NAME="sacred-council-db"
DB_NAME="sacred_council"
DB_USER="sacred_user"

echo "🗄️ Setting up Cloud SQL for Sacred Council Hub"
echo "=============================================="

# Create Cloud SQL instance
echo "📦 Creating Cloud SQL PostgreSQL instance..."
gcloud sql instances create ${INSTANCE_NAME} \
    --database-version=POSTGRES_15 \
    --tier=db-g1-small \
    --region=${REGION} \
    --network=default \
    --database-flags=max_connections=100 \
    --backup \
    --backup-start-time=03:00

# Create database
echo "🏗️ Creating database..."
gcloud sql databases create ${DB_NAME} \
    --instance=${INSTANCE_NAME}

# Create user
echo "👤 Creating database user..."
gcloud sql users create ${DB_USER} \
    --instance=${INSTANCE_NAME} \
    --password=$(openssl rand -base64 32)

# Get connection details
echo "🔗 Getting connection details..."
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(connectionName)")
echo "Connection name: ${INSTANCE_CONNECTION_NAME}"

# Create secret for database URL
echo "🔐 Creating secret for database connection..."
DATABASE_URL="postgresql://${DB_USER}:PASSWORD@localhost:5432/${DB_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"
echo ${DATABASE_URL} | gcloud secrets create database-url --data-file=-

echo ""
echo "✅ Cloud SQL setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your application to use PostgreSQL instead of SQLite"
echo "2. Use Cloud SQL Proxy for local development"
echo "3. Configure Cloud Run/GKE to use the Cloud SQL instance"
echo ""
echo "🕊️ Database ready for sacred connections!"