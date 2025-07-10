-- LuminousOS SurrealDB Schema
-- Sacred data structures for consciousness-first computing

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD id ON user TYPE record;
DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value);
DEFINE FIELD username ON user TYPE string ASSERT string::len($value) >= 3;
DEFINE FIELD password_hash ON user TYPE string;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON user TYPE datetime;
DEFINE FIELD last_seen ON user TYPE datetime;
DEFINE FIELD is_active ON user TYPE bool DEFAULT true;
DEFINE FIELD sacred_name ON user TYPE string; -- Their chosen spiritual name
DEFINE FIELD coherence_baseline ON user TYPE float DEFAULT 0.5 ASSERT $value >= 0 AND $value <= 1;
DEFINE FIELD total_practice_time ON user TYPE duration DEFAULT 0s;
DEFINE FIELD avatar_url ON user TYPE string;
DEFINE FIELD timezone ON user TYPE string DEFAULT 'UTC';
DEFINE FIELD preferred_language ON user TYPE string DEFAULT 'en';

DEFINE INDEX idx_user_email ON user COLUMNS email UNIQUE;
DEFINE INDEX idx_user_username ON user COLUMNS username UNIQUE;

-- User Profile Extensions
DEFINE TABLE user_profile SCHEMAFULL;
DEFINE FIELD id ON user_profile TYPE record;
DEFINE FIELD user ON user_profile TYPE record(user);
DEFINE FIELD bio ON user_profile TYPE string;
DEFINE FIELD intention ON user_profile TYPE string; -- Current spiritual intention
DEFINE FIELD moon_birthday ON user_profile TYPE datetime; -- For biorhythm calculations
DEFINE FIELD meditation_style ON user_profile TYPE string;
DEFINE FIELD preferred_frequencies ON user_profile TYPE array;
DEFINE FIELD sacred_geometry_preference ON user_profile TYPE string DEFAULT 'flower_of_life';
DEFINE FIELD privacy_settings ON user_profile TYPE object DEFAULT {
    profile_visible: true,
    coherence_visible: true,
    practice_history_visible: false
};

-- ============================================
-- COHERENCE TRACKING
-- ============================================

DEFINE TABLE coherence_reading SCHEMAFULL;
DEFINE FIELD id ON coherence_reading TYPE record;
DEFINE FIELD user ON coherence_reading TYPE record(user);
DEFINE FIELD timestamp ON coherence_reading TYPE datetime DEFAULT time::now();
DEFINE FIELD personal_coherence ON coherence_reading TYPE float ASSERT $value >= 0 AND $value <= 1;
DEFINE FIELD network_coherence ON coherence_reading TYPE float ASSERT $value >= 0 AND $value <= 1;
DEFINE FIELD field_coherence ON coherence_reading TYPE float ASSERT $value >= 0 AND $value <= 1;
DEFINE FIELD heart_rate ON coherence_reading TYPE int;
DEFINE FIELD hrv ON coherence_reading TYPE float;
DEFINE FIELD breath_rate ON coherence_reading TYPE float;
DEFINE FIELD biometric_source ON coherence_reading TYPE string; -- 'bluetooth', 'camera', 'manual'
DEFINE FIELD quantum_correlation ON coherence_reading TYPE float;
DEFINE FIELD environmental_factors ON coherence_reading TYPE object; -- moon phase, time of day, etc

DEFINE INDEX idx_coherence_user_time ON coherence_reading COLUMNS user, timestamp;

-- Coherence Milestones
DEFINE TABLE coherence_milestone SCHEMAFULL;
DEFINE FIELD id ON coherence_milestone TYPE record;
DEFINE FIELD user ON coherence_milestone TYPE record(user);
DEFINE FIELD achieved_at ON coherence_milestone TYPE datetime DEFAULT time::now();
DEFINE FIELD milestone_type ON coherence_milestone TYPE string; -- 'first_80', 'sustained_90', etc
DEFINE FIELD coherence_value ON coherence_milestone TYPE float;
DEFINE FIELD celebration_shown ON coherence_milestone TYPE bool DEFAULT false;

-- ============================================
-- GLYPH SYSTEM
-- ============================================

-- Static glyph definitions (imported from JSON)
DEFINE TABLE glyph SCHEMAFULL;
DEFINE FIELD id ON glyph TYPE string; -- 'Ω0', 'Ω1', etc
DEFINE FIELD name ON glyph TYPE string;
DEFINE FIELD category ON glyph TYPE string; -- 'foundational', 'threshold', 'meta'
DEFINE FIELD description ON glyph TYPE string;
DEFINE FIELD long_description ON glyph TYPE string;
DEFINE FIELD coherence_required ON glyph TYPE float DEFAULT 0.5;
DEFINE FIELD practice_steps ON glyph TYPE array;
DEFINE FIELD group_variation ON glyph TYPE string;
DEFINE FIELD harmonies ON glyph TYPE array; -- Which of 7 harmonies it serves
DEFINE FIELD prerequisites ON glyph TYPE array; -- Other glyphs needed first
DEFINE FIELD sacred_geometry ON glyph TYPE string; -- Associated pattern
DEFINE FIELD frequency ON glyph TYPE int; -- Associated Hz

DEFINE INDEX idx_glyph_id ON glyph COLUMNS id UNIQUE;

-- User's glyph practice history
DEFINE TABLE glyph_practice SCHEMAFULL;
DEFINE FIELD id ON glyph_practice TYPE record;
DEFINE FIELD user ON glyph_practice TYPE record(user);
DEFINE FIELD glyph ON glyph_practice TYPE string; -- References glyph.id
DEFINE FIELD started_at ON glyph_practice TYPE datetime DEFAULT time::now();
DEFINE FIELD completed_at ON glyph_practice TYPE datetime;
DEFINE FIELD duration ON glyph_practice TYPE duration;
DEFINE FIELD starting_coherence ON glyph_practice TYPE float;
DEFINE FIELD ending_coherence ON glyph_practice TYPE float;
DEFINE FIELD peak_coherence ON glyph_practice TYPE float;
DEFINE FIELD practice_quality ON glyph_practice TYPE float; -- 0-1 score
DEFINE FIELD insights ON glyph_practice TYPE array;
DEFINE FIELD binaural_frequency ON glyph_practice TYPE string;
DEFINE FIELD group_session ON glyph_practice TYPE record(group_ceremony);

DEFINE INDEX idx_practice_user_time ON glyph_practice COLUMNS user, started_at;

-- Glyph mastery tracking
DEFINE TABLE glyph_mastery SCHEMAFULL;
DEFINE FIELD id ON glyph_mastery TYPE record;
DEFINE FIELD user ON glyph_mastery TYPE record(user);
DEFINE FIELD glyph ON glyph_mastery TYPE string;
DEFINE FIELD first_practiced ON glyph_mastery TYPE datetime;
DEFINE FIELD times_practiced ON glyph_mastery TYPE int DEFAULT 0;
DEFINE FIELD total_duration ON glyph_mastery TYPE duration DEFAULT 0s;
DEFINE FIELD average_coherence ON glyph_mastery TYPE float;
DEFINE FIELD mastery_level ON glyph_mastery TYPE int DEFAULT 0; -- 0-5
DEFINE FIELD unlocked_variations ON glyph_mastery TYPE array;

DEFINE INDEX idx_mastery_user_glyph ON glyph_mastery COLUMNS user, glyph UNIQUE;

-- ============================================
-- NETWORK & SACRED MESSAGES
-- ============================================

DEFINE TABLE network_connection SCHEMAFULL;
DEFINE FIELD id ON network_connection TYPE record;
DEFINE FIELD from_user ON network_connection TYPE record(user);
DEFINE FIELD to_user ON network_connection TYPE record(user);
DEFINE FIELD connection_type ON network_connection TYPE string; -- 'resonance', 'council', 'ceremony'
DEFINE FIELD established_at ON network_connection TYPE datetime DEFAULT time::now();
DEFINE FIELD coherence_at_connection ON network_connection TYPE float;
DEFINE FIELD shared_practices ON network_connection TYPE int DEFAULT 0;
DEFINE FIELD resonance_score ON network_connection TYPE float DEFAULT 0.5;

DEFINE TABLE sacred_message SCHEMAFULL;
DEFINE FIELD id ON sacred_message TYPE record;
DEFINE FIELD from_user ON sacred_message TYPE record(user);
DEFINE FIELD to_user ON sacred_message TYPE record(user); -- NULL for broadcasts
DEFINE FIELD message_type ON sacred_message TYPE string; -- 'gratitude', 'healing', 'invitation', etc
DEFINE FIELD content ON sacred_message TYPE string;
DEFINE FIELD sent_at ON sacred_message TYPE datetime DEFAULT time::now();
DEFINE FIELD received_at ON sacred_message TYPE datetime;
DEFINE FIELD read_at ON sacred_message TYPE datetime;
DEFINE FIELD field_impact ON sacred_message TYPE float; -- How much it affected coherence
DEFINE FIELD blessing ON sacred_message TYPE string; -- Auto-generated blessing

DEFINE INDEX idx_message_recipient ON sacred_message COLUMNS to_user, sent_at;

-- ============================================
-- GROUP CEREMONIES & COUNCILS
-- ============================================

DEFINE TABLE group_ceremony SCHEMAFULL;
DEFINE FIELD id ON group_ceremony TYPE record;
DEFINE FIELD ceremony_type ON group_ceremony TYPE string; -- 'heart_sync', 'breath_wave', etc
DEFINE FIELD host ON group_ceremony TYPE record(user);
DEFINE FIELD created_at ON group_ceremony TYPE datetime DEFAULT time::now();
DEFINE FIELD started_at ON group_ceremony TYPE datetime;
DEFINE FIELD completed_at ON group_ceremony TYPE datetime;
DEFINE FIELD phase ON group_ceremony TYPE string DEFAULT 'gathering';
DEFINE FIELD target_coherence ON group_ceremony TYPE float DEFAULT 0.8;
DEFINE FIELD peak_coherence ON group_ceremony TYPE float;
DEFINE FIELD participant_count ON group_ceremony TYPE int DEFAULT 0;
DEFINE FIELD is_active ON group_ceremony TYPE bool DEFAULT true;
DEFINE FIELD sacred_intention ON group_ceremony TYPE string;

DEFINE TABLE ceremony_participant SCHEMAFULL;
DEFINE FIELD id ON ceremony_participant TYPE record;
DEFINE FIELD ceremony ON ceremony_participant TYPE record(group_ceremony);
DEFINE FIELD user ON ceremony_participant TYPE record(user);
DEFINE FIELD joined_at ON ceremony_participant TYPE datetime DEFAULT time::now();
DEFINE FIELD left_at ON ceremony_participant TYPE datetime;
DEFINE FIELD role ON ceremony_participant TYPE string DEFAULT 'participant'; -- 'host', 'guardian', 'participant'
DEFINE FIELD starting_coherence ON ceremony_participant TYPE float;
DEFINE FIELD ending_coherence ON ceremony_participant TYPE float;
DEFINE FIELD coherence_contribution ON ceremony_participant TYPE float;

DEFINE INDEX idx_ceremony_active ON ceremony_participant COLUMNS ceremony, left_at;

-- Sacred Council for multi-agent coordination
DEFINE TABLE sacred_council SCHEMAFULL;
DEFINE FIELD id ON sacred_council TYPE record;
DEFINE FIELD council_type ON sacred_council TYPE string; -- 'dyad', 'triad', 'circle'
DEFINE FIELD purpose ON sacred_council TYPE string;
DEFINE FIELD formed_at ON sacred_council TYPE datetime DEFAULT time::now();
DEFINE FIELD dissolved_at ON sacred_council TYPE datetime;
DEFINE FIELD decisions ON sacred_council TYPE array;
DEFINE FIELD collective_wisdom ON sacred_council TYPE string;
DEFINE FIELD field_coherence ON sacred_council TYPE float;

-- ============================================
-- AI INTERACTIONS & SHADOW WORK
-- ============================================

DEFINE TABLE ai_interaction SCHEMAFULL;
DEFINE FIELD id ON ai_interaction TYPE record;
DEFINE FIELD user ON ai_interaction TYPE record(user);
DEFINE FIELD ai_tool ON ai_interaction TYPE string; -- 'morning_practice', 'shadow_work', etc
DEFINE FIELD timestamp ON ai_interaction TYPE datetime DEFAULT time::now();
DEFINE FIELD user_state ON ai_interaction TYPE object; -- Coherence, mood, etc at time
DEFINE FIELD ai_guidance ON ai_interaction TYPE string;
DEFINE FIELD user_response ON ai_interaction TYPE string;
DEFINE FIELD effectiveness_rating ON ai_interaction TYPE float;
DEFINE FIELD insights_generated ON ai_interaction TYPE array;

DEFINE TABLE shadow_work_session SCHEMAFULL;
DEFINE FIELD id ON shadow_work_session TYPE record;
DEFINE FIELD user ON shadow_work_session TYPE record(user);
DEFINE FIELD started_at ON shadow_work_session TYPE datetime DEFAULT time::now();
DEFINE FIELD completed_at ON shadow_work_session TYPE datetime;
DEFINE FIELD shadow_pattern ON shadow_work_session TYPE string; -- 'resistance', 'ceiling', etc
DEFINE FIELD trigger_event ON shadow_work_session TYPE string;
DEFINE FIELD practices_used ON shadow_work_session TYPE array;
DEFINE FIELD breakthrough ON shadow_work_session TYPE bool DEFAULT false;
DEFINE FIELD integration_notes ON shadow_work_session TYPE string;
DEFINE FIELD coherence_shift ON shadow_work_session TYPE float; -- Change in coherence

-- ============================================
-- QUANTUM EXPERIMENTS
-- ============================================

DEFINE TABLE quantum_experiment SCHEMAFULL;
DEFINE FIELD id ON quantum_experiment TYPE record;
DEFINE FIELD user ON quantum_experiment TYPE record(user);
DEFINE FIELD experiment_type ON quantum_experiment TYPE string; -- 'correlation', 'choice', 'meditation'
DEFINE FIELD timestamp ON quantum_experiment TYPE datetime DEFAULT time::now();
DEFINE FIELD quantum_data ON quantum_experiment TYPE array; -- Raw quantum numbers
DEFINE FIELD coherence_at_time ON quantum_experiment TYPE float;
DEFINE FIELD correlation_score ON quantum_experiment TYPE float;
DEFINE FIELD significance ON quantum_experiment TYPE float;
DEFINE FIELD notes ON quantum_experiment TYPE string;

-- ============================================
-- SYSTEM EVENTS & ANALYTICS
-- ============================================

DEFINE TABLE system_event SCHEMAFULL;
DEFINE FIELD id ON system_event TYPE record;
DEFINE FIELD event_type ON system_event TYPE string;
DEFINE FIELD user ON system_event TYPE record(user);
DEFINE FIELD timestamp ON system_event TYPE datetime DEFAULT time::now();
DEFINE FIELD details ON system_event TYPE object;
DEFINE FIELD ip_address ON system_event TYPE string;
DEFINE FIELD user_agent ON system_event TYPE string;
DEFINE FIELD session_id ON system_event TYPE string;

DEFINE INDEX idx_event_user_time ON system_event COLUMNS user, timestamp;

-- ============================================
-- PERMISSIONS & ACCESS CONTROL
-- ============================================

-- Users can only read/write their own data
DEFINE SCOPE user_scope SESSION 24h SIGNUP (
    CREATE user SET 
        email = $email,
        username = $username,
        password_hash = crypto::argon2::generate($password)
) SIGNIN (
    SELECT * FROM user WHERE email = $email 
    AND crypto::argon2::compare(password_hash, $password)
);

-- Define permissions for user scope
DEFINE TABLE user PERMISSIONS
    FOR select, update WHERE id = $auth.id,
    FOR create, delete NONE;

DEFINE TABLE coherence_reading PERMISSIONS
    FOR select WHERE user = $auth.id,
    FOR create WHERE user = $auth.id,
    FOR update, delete NONE;

DEFINE TABLE glyph_practice PERMISSIONS
    FOR select WHERE user = $auth.id,
    FOR create WHERE user = $auth.id,
    FOR update WHERE user = $auth.id AND completed_at = NONE,
    FOR delete NONE;

-- ============================================
-- FUNCTIONS & COMPUTED FIELDS
-- ============================================

-- Calculate user's current coherence (average of last 5 minutes)
DEFINE FUNCTION fn::current_coherence($user: record) {
    LET $recent = SELECT personal_coherence FROM coherence_reading 
        WHERE user = $user 
        AND timestamp > time::now() - 5m
        ORDER BY timestamp DESC;
    
    RETURN math::mean($recent.personal_coherence) OR 0.5;
};

-- Get user's glyph recommendations based on coherence and history
DEFINE FUNCTION fn::recommend_glyphs($user: record) {
    LET $coherence = fn::current_coherence($user);
    LET $practiced = SELECT glyph FROM glyph_mastery WHERE user = $user;
    
    RETURN SELECT * FROM glyph 
        WHERE coherence_required <= $coherence
        AND id NOT IN $practiced.glyph
        ORDER BY coherence_required DESC
        LIMIT 3;
};

-- Calculate field coherence for a ceremony
DEFINE FUNCTION fn::ceremony_field_coherence($ceremony: record) {
    LET $participants = SELECT ending_coherence FROM ceremony_participant 
        WHERE ceremony = $ceremony 
        AND left_at = NONE;
    
    RETURN math::mean($participants.ending_coherence) OR 0;
};