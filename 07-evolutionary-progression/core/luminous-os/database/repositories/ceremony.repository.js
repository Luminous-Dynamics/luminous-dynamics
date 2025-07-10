// Ceremony Repository - Group coherence ceremony management
import { getConnection } from '../connection.js';

export class CeremonyRepository {
  constructor() {
    this.connection = getConnection();
  }

  async createCeremony(hostId, ceremonyType, intention) {
    const db = this.connection.getDb();
    
    const [ceremony] = await db.create('group_ceremony', {
      ceremony_type: ceremonyType,
      host: hostId,
      created_at: new Date().toISOString(),
      phase: 'gathering',
      sacred_intention: intention,
      is_active: true,
      participant_count: 1 // Host is first participant
    });

    // Add host as first participant
    await this.joinCeremony(ceremony.id, hostId, 'host');

    return ceremony;
  }

  async joinCeremony(ceremonyId, userId, role = 'participant') {
    const db = this.connection.getDb();
    
    // Check if already participating
    const existing = await db.query(
      `SELECT * FROM ceremony_participant 
       WHERE ceremony = $ceremony 
       AND user = $user 
       AND left_at = NONE`,
      { ceremony: ceremonyId, user: userId }
    );

    if (existing[0]?.length) {
      return existing[0][0];
    }

    // Get current coherence
    const coherenceRepo = await import('./coherence.repository.js');
    const coherence = await new coherenceRepo.CoherenceRepository()
      .getCurrentCoherence(userId);

    // Create participant record
    const [participant] = await db.create('ceremony_participant', {
      ceremony: ceremonyId,
      user: userId,
      joined_at: new Date().toISOString(),
      role,
      starting_coherence: coherence
    });

    // Update participant count
    await db.query(
      `UPDATE group_ceremony:${ceremonyId} 
       SET participant_count = participant_count + 1`,
    );

    // Emit join event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ceremony-participant-joined', {
        detail: { ceremonyId, userId, role }
      }));
    }

    return participant;
  }

  async leaveCeremony(ceremonyId, userId) {
    const db = this.connection.getDb();
    
    // Find active participation
    const result = await db.query(
      `SELECT * FROM ceremony_participant 
       WHERE ceremony = $ceremony 
       AND user = $user 
       AND left_at = NONE`,
      { ceremony: ceremonyId, user: userId }
    );

    if (!result[0]?.length) {
      return null;
    }

    const participant = result[0][0];
    
    // Get current coherence
    const coherenceRepo = await import('./coherence.repository.js');
    const coherence = await new coherenceRepo.CoherenceRepository()
      .getCurrentCoherence(userId);

    // Update participant record
    const [updated] = await db.merge(`ceremony_participant:${participant.id}`, {
      left_at: new Date().toISOString(),
      ending_coherence: coherence,
      coherence_contribution: coherence - participant.starting_coherence
    });

    // Update participant count
    await db.query(
      `UPDATE group_ceremony:${ceremonyId} 
       SET participant_count = participant_count - 1`,
    );

    return updated;
  }

  async updateCeremonyPhase(ceremonyId, phase, targetCoherence = null) {
    const db = this.connection.getDb();
    
    const updates = { phase };
    if (targetCoherence !== null) {
      updates.target_coherence = targetCoherence;
    }

    if (phase === 'attunement') {
      updates.started_at = new Date().toISOString();
    } else if (phase === 'integration') {
      updates.completed_at = new Date().toISOString();
      updates.is_active = false;
    }

    const [updated] = await db.merge(`group_ceremony:${ceremonyId}`, updates);

    // Emit phase change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ceremony-phase-changed', {
        detail: { ceremonyId, phase }
      }));
    }

    return updated;
  }

  async recordPeakCoherence(ceremonyId, coherence) {
    const db = this.connection.getDb();
    
    // Only update if new peak
    const [ceremony] = await db.select(`group_ceremony:${ceremonyId}`);
    if (!ceremony.peak_coherence || coherence > ceremony.peak_coherence) {
      await db.merge(`group_ceremony:${ceremonyId}`, {
        peak_coherence: coherence
      });
    }
  }

  async getActiveCeremonies() {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT * FROM group_ceremony WHERE is_active = true ORDER BY created_at DESC'
    );
    
    return result[0] || [];
  }

  async getCeremonyById(id) {
    const db = this.connection.getDb();
    
    const [ceremony] = await db.select(`group_ceremony:${id}`);
    
    if (ceremony) {
      // Get participants
      const participants = await this.getCeremonyParticipants(id);
      ceremony.participants = participants;
      
      // Calculate field coherence
      ceremony.field_coherence = await this.calculateFieldCoherence(id);
    }
    
    return ceremony;
  }

  async getCeremonyParticipants(ceremonyId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT participant.*, user.sacred_name, user.coherence_baseline
       FROM ceremony_participant as participant
       JOIN user ON participant.user = user.id
       WHERE participant.ceremony = $ceremony 
       AND participant.left_at = NONE
       ORDER BY participant.joined_at`,
      { ceremony: ceremonyId }
    );
    
    return result[0] || [];
  }

  async calculateFieldCoherence(ceremonyId) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT fn::ceremony_field_coherence($ceremony) as coherence',
      { ceremony: ceremonyId }
    );
    
    return result[0]?.[0]?.coherence || 0.5;
  }

  async getUserCeremonyHistory(userId, limit = 20) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `SELECT ceremony.*, participant.*
       FROM ceremony_participant as participant
       JOIN group_ceremony as ceremony ON participant.ceremony = ceremony.id
       WHERE participant.user = $user
       ORDER BY participant.joined_at DESC
       LIMIT $limit`,
      { user: userId, limit }
    );
    
    return result[0] || [];
  }

  async getCeremonyStats(ceremonyId) {
    const db = this.connection.getDb();
    
    const result = await db.query(`
      LET $ceremony = group_ceremony:${ceremonyId};
      LET $participants = (
        SELECT * FROM ceremony_participant 
        WHERE ceremony = $ceremony
      );
      
      RETURN {
        total_participants: count($participants),
        active_participants: count(
          SELECT * FROM $participants WHERE left_at = NONE
        ),
        average_contribution: math::mean($participants.coherence_contribution),
        peak_coherence: $ceremony.peak_coherence,
        duration: IF $ceremony.completed_at THEN
          time::diff($ceremony.started_at, $ceremony.completed_at)
        ELSE
          time::diff($ceremony.created_at, time::now())
        END
      };
    `);
    
    return result[0]?.[0] || {
      total_participants: 0,
      active_participants: 0,
      average_contribution: 0,
      peak_coherence: 0,
      duration: 0
    };
  }

  async getRecommendedCeremonies(userId) {
    const db = this.connection.getDb();
    
    // Get user's coherence and recent practices
    const result = await db.query(`
      LET $coherence = fn::current_coherence($userId);
      LET $recent_ceremonies = (
        SELECT ceremony FROM ceremony_participant 
        WHERE user = $userId 
        AND joined_at > time::now() - 7d
      );
      
      SELECT * FROM group_ceremony 
      WHERE is_active = true
      AND id NOT IN $recent_ceremonies
      AND target_coherence <= $coherence + 0.1
      ORDER BY participant_count DESC
      LIMIT 3;
    `, { userId });
    
    return result[0] || [];
  }

  async createSacredCouncil(members, purpose) {
    const db = this.connection.getDb();
    
    const councilType = members.length === 2 ? 'dyad' : 
                       members.length === 3 ? 'triad' : 'circle';
    
    const [council] = await db.create('sacred_council', {
      council_type: councilType,
      purpose,
      formed_at: new Date().toISOString(),
      decisions: [],
      field_coherence: 0.5
    });

    // Create connections between all members
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        await db.create('network_connection', {
          from_user: members[i],
          to_user: members[j],
          connection_type: 'council',
          established_at: new Date().toISOString(),
          coherence_at_connection: 0.5
        });
      }
    }

    return council;
  }
}

export default CeremonyRepository;