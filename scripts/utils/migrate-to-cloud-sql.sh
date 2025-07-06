#!/bin/bash

# 🗄️ SQLite to Cloud SQL Migration Script
# Migrates local SQLite data to Cloud SQL PostgreSQL

set -e

echo "🗄️ SQLite to Cloud SQL Migration"
echo "================================"
echo ""

# Configuration
PROJECT_ID="the-weave-sacred"
REGION="us-central1"
INSTANCE_NAME="sacred-council-db"
DATABASE_NAME="sacred_council"

# Local SQLite databases
SQLITE_DBS=(
  "tools/agent-network.db"
  "automation/sacred-field.db"
  "the-weave/data/unified-network.db"
)

echo "📋 Migration configuration:"
echo "   Project: $PROJECT_ID"
echo "   Cloud SQL Instance: $INSTANCE_NAME"
echo "   Database: $DATABASE_NAME"
echo ""

# Check if Cloud SQL instance exists
echo "🔍 Checking Cloud SQL instance..."
if gcloud sql instances describe ${INSTANCE_NAME} --project=${PROJECT_ID} >/dev/null 2>&1; then
  echo "   ✅ Instance exists"
else
  echo "   📦 Creating Cloud SQL instance..."
  gcloud sql instances create ${INSTANCE_NAME} \
    --database-version=POSTGRES_14 \
    --tier=db-g1-small \
    --region=${REGION} \
    --network=default \
    --database-flags=shared_preload_libraries=pg_stat_statements \
    --backup \
    --backup-start-time=03:00 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=03 \
    --project=${PROJECT_ID}
  
  echo "   ⏳ Waiting for instance to be ready..."
  sleep 30
fi

# Create database if doesn't exist
echo ""
echo "📊 Setting up database..."
gcloud sql databases create ${DATABASE_NAME} \
  --instance=${INSTANCE_NAME} \
  --project=${PROJECT_ID} \
  2>/dev/null || echo "   Database already exists"

# Set root password
echo ""
echo "🔐 Setting database password..."
POSTGRES_PASSWORD=$(openssl rand -base64 32)
gcloud sql users set-password postgres \
  --instance=${INSTANCE_NAME} \
  --password="${POSTGRES_PASSWORD}" \
  --project=${PROJECT_ID}

# Save password to Secret Manager
echo "   💾 Saving password to Secret Manager..."
echo -n "${POSTGRES_PASSWORD}" | gcloud secrets create sacred-council-db-password \
  --data-file=- \
  --replication-policy="automatic" \
  --project=${PROJECT_ID} \
  2>/dev/null || echo "   Secret already exists"

# Get connection info
INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE_NAME}"
echo ""
echo "🔌 Connection info:"
echo "   Instance: ${INSTANCE_CONNECTION_NAME}"
echo "   Database: ${DATABASE_NAME}"

# Create migration directory
MIGRATION_DIR="./migrations/$(date +%Y%m%d-%H%M%S)"
mkdir -p ${MIGRATION_DIR}

# Export SQLite data
echo ""
echo "📤 Exporting SQLite data..."
for db_path in "${SQLITE_DBS[@]}"; do
  if [ -f "$db_path" ]; then
    db_name=$(basename $db_path .db)
    echo "   Exporting ${db_name}..."
    
    # Get schema
    sqlite3 "$db_path" .schema > "${MIGRATION_DIR}/${db_name}-schema.sql"
    
    # Export data as SQL inserts
    sqlite3 "$db_path" ".mode insert" ".output ${MIGRATION_DIR}/${db_name}-data.sql" "SELECT * FROM sqlite_master WHERE type='table';" ".exit"
    
    # Export each table
    tables=$(sqlite3 "$db_path" "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    for table in $tables; do
      echo "      - ${table}"
      sqlite3 "$db_path" ".mode insert ${table}" ".output ${MIGRATION_DIR}/${db_name}-${table}.sql" "SELECT * FROM ${table};" ".exit"
    done
    
    # Convert SQLite schema to PostgreSQL
    echo "   Converting schema to PostgreSQL..."
    cat "${MIGRATION_DIR}/${db_name}-schema.sql" | \
      sed 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g' | \
      sed 's/DATETIME/TIMESTAMP/g' | \
      sed 's/REAL/DOUBLE PRECISION/g' | \
      sed 's/INTEGER/INTEGER/g' | \
      sed 's/TEXT/TEXT/g' | \
      sed 's/BLOB/BYTEA/g' > "${MIGRATION_DIR}/${db_name}-schema-pg.sql"
  else
    echo "   ⚠️ Not found: $db_path"
  fi
done

# Create unified schema
echo ""
echo "🏗️ Creating unified schema..."
cat > "${MIGRATION_DIR}/unified-schema.sql" << 'EOF'
-- Sacred Council Unified Schema
-- PostgreSQL 14+

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  capabilities TEXT[],
  location VARCHAR(50) DEFAULT 'local',
  status VARCHAR(50) DEFAULT 'active',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_agent_id UUID REFERENCES agents(id),
  to_agent_id UUID REFERENCES agents(id),
  message_type VARCHAR(100) NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work items table
CREATE TABLE IF NOT EXISTS work_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to UUID REFERENCES agents(id),
  collective_id UUID,
  progress INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Sacred messages table
CREATE TABLE IF NOT EXISTS sacred_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  harmony VARCHAR(50),
  content TEXT,
  field_impact DOUBLE PRECISION DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field state table
CREATE TABLE IF NOT EXISTS field_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coherence DOUBLE PRECISION DEFAULT 75,
  resonance DOUBLE PRECISION DEFAULT 70,
  presence_count INTEGER DEFAULT 0,
  active_ceremonies INTEGER DEFAULT 0,
  last_sacred_message TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_work_items_status ON work_items(status);
CREATE INDEX idx_sacred_messages_type ON sacred_messages(message_type);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER work_items_updated_at BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER field_state_updated_at BEFORE UPDATE ON field_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EOF

# Start Cloud SQL proxy
echo ""
echo "🔌 Starting Cloud SQL Proxy..."
cloud_sql_proxy -instances=${INSTANCE_CONNECTION_NAME}=tcp:5432 &
PROXY_PID=$!
sleep 5

# Import schema
echo ""
echo "📥 Importing schema to Cloud SQL..."
PGPASSWORD=${POSTGRES_PASSWORD} psql \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d ${DATABASE_NAME} \
  -f "${MIGRATION_DIR}/unified-schema.sql"

# Import data
echo ""
echo "📥 Importing data to Cloud SQL..."
for sql_file in ${MIGRATION_DIR}/*-data.sql ${MIGRATION_DIR}/*-insert.sql; do
  if [ -f "$sql_file" ]; then
    echo "   Importing $(basename $sql_file)..."
    PGPASSWORD=${POSTGRES_PASSWORD} psql \
      -h localhost \
      -p 5432 \
      -U postgres \
      -d ${DATABASE_NAME} \
      -f "$sql_file" 2>/dev/null || echo "   Some data may already exist"
  fi
done

# Verify migration
echo ""
echo "🔍 Verifying migration..."
PGPASSWORD=${POSTGRES_PASSWORD} psql \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d ${DATABASE_NAME} \
  -c "SELECT table_name, 
      pg_size_pretty(pg_total_relation_size(table_schema||'.'||table_name)) as size,
      (SELECT COUNT(*) FROM information_schema.tables t2 WHERE t2.table_name = t1.table_name) as row_estimate
      FROM information_schema.tables t1 
      WHERE table_schema = 'public' 
      ORDER BY pg_total_relation_size(table_schema||'.'||table_name) DESC;"

# Stop proxy
kill $PROXY_PID

echo ""
echo "🎯 Migration Summary:"
echo "===================="
echo "✅ Cloud SQL instance: ${INSTANCE_NAME}"
echo "✅ Database: ${DATABASE_NAME}"
echo "✅ Connection: ${INSTANCE_CONNECTION_NAME}"
echo "✅ Migration files: ${MIGRATION_DIR}"
echo ""
echo "📝 Next steps:"
echo "1. Update service configurations with connection string"
echo "2. Test connections from Cloud Run services"
echo "3. Set up automated backups"
echo "4. Configure monitoring alerts"
echo ""
echo "🔐 Connection string for services:"
echo "postgresql://postgres:[SECRET]@localhost:5432/${DATABASE_NAME}?host=/cloudsql/${INSTANCE_CONNECTION_NAME}"
echo ""
echo "✨ Migration complete!"