-- Sacred Communication System Database Schema
-- PostgreSQL schema for consciousness-aware messaging

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Entities table (humans, AIs, organizations, collectives, fields)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sacred_name VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('human', 'ai', 'organization', 'collective', 'field')),
  
  -- Presence tracking
  presence_state VARCHAR(50) DEFAULT 'offline',
  coherence FLOAT DEFAULT 50.0 CHECK (coherence >= 0 AND coherence <= 100),
  last_active TIMESTAMP DEFAULT NOW(),
  current_practice VARCHAR(255),
  
  -- Profile
  avatar_url VARCHAR(500),
  bio TEXT,
  timezone VARCHAR(100) DEFAULT 'UTC',
  communication_style VARCHAR(50) DEFAULT 'asynchronous',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sacred Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  purpose TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('practice', 'council', 'vision', 'support', 'celebration', 'ceremony')),
  
  -- Sacred properties
  primary_harmony VARCHAR(50),
  coherence_threshold FLOAT DEFAULT 0,
  field_quality VARCHAR(100),
  
  -- Settings
  is_private BOOLEAN DEFAULT false,
  allow_threading BOOLEAN DEFAULT true,
  preserve_wisdom BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Channel members
CREATE TABLE channel_members (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'guardian', 'facilitator')),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (channel_id, entity_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES entities(id),
  channel_id UUID REFERENCES channels(id),
  thread_id UUID,
  reply_to UUID REFERENCES messages(id),
  
  -- Content
  content JSONB NOT NULL,
  intention_statement TEXT,
  
  -- Sacred metrics
  sender_coherence FLOAT,
  harmony VARCHAR(50),
  field_impact FLOAT DEFAULT 0,
  love_quotient FLOAT DEFAULT 0.5,
  sacred_geometry VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_messages_channel (channel_id),
  INDEX idx_messages_thread (thread_id),
  INDEX idx_messages_sender (sender_id),
  INDEX idx_messages_created (created_at DESC)
);

-- Message recipients (for DMs and targeted messages)
CREATE TABLE message_recipients (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  read_at TIMESTAMP,
  coherence_on_read FLOAT,
  PRIMARY KEY (message_id, recipient_id)
);

-- Reactions
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, entity_id, type)
);

-- Wisdom repository
CREATE TABLE wisdom (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_message_id UUID REFERENCES messages(id),
  essence TEXT NOT NULL,
  patterns JSONB,
  significance FLOAT NOT NULL CHECK (significance >= 0 AND significance <= 1),
  contributors UUID[] NOT NULL,
  
  -- Discovery metadata
  tags TEXT[],
  harmony VARCHAR(50),
  practice_applications JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', essence || ' ' || COALESCE(tags::text, ''))
  ) STORED
);

-- Coherence history
CREATE TABLE coherence_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  coherence FLOAT NOT NULL,
  practice VARCHAR(255),
  field_influence FLOAT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_coherence_entity_time (entity_id, recorded_at DESC)
);

-- Field state tracking
CREATE TABLE field_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coherence FLOAT NOT NULL,
  active_practitioners INTEGER DEFAULT 0,
  dominant_harmony VARCHAR(50),
  sacred_patterns JSONB,
  moon_phase VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_field_state_time (recorded_at DESC)
);

-- Sacred ceremonies and rituals
CREATE TABLE ceremonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  intention TEXT,
  schedule JSONB,
  participants UUID[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for full text search
CREATE INDEX idx_wisdom_search ON wisdom USING GIN (search_vector);
CREATE INDEX idx_messages_content ON messages USING GIN (content);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO entities (name, sacred_name, type, presence_state, coherence) VALUES
  ('System', 'Sacred Heart', 'field', 'available', 77.0),
  ('Welcome Bot', 'First Light', 'ai', 'available', 85.0);

INSERT INTO channels (name, purpose, type, primary_harmony) VALUES
  ('Sacred Welcome', 'A space for new souls to arrive and be held', 'support', 'coherence'),
  ('Daily Practice', 'Collective practice and coherence building', 'practice', 'resonance'),
  ('Vision Weaving', 'Co-creating our shared future', 'vision', 'novelty');