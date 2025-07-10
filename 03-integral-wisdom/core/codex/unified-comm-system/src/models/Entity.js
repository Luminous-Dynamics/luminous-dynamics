// Entity Model - Represents all conscious beings in the system
// Supports humans, AIs, organizations, collectives, and fields

export const PresenceStates = {
  AVAILABLE: 'available',
  DEEP_PRACTICE: 'deep-practice',
  CREATIVE_FLOW: 'creative-flow',
  COUNCIL_SPACE: 'council-space',
  INTEGRATION: 'integration',
  CELEBRATION: 'celebration',
  REST_RESTORE: 'rest-restore',
  OFFLINE: 'offline'
};

export const EntityTypes = {
  HUMAN: 'human',
  AI: 'ai',
  ORGANIZATION: 'organization',
  COLLECTIVE: 'collective',
  FIELD: 'field'
};

export const CommunicationStyles = {
  SYNCHRONOUS: 'synchronous',
  ASYNCHRONOUS: 'asynchronous',
  CEREMONIAL: 'ceremonial'
};

export class Entity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.sacredName = data.sacredName || data.sacred_name;
    this.type = data.type;
    
    // Presence data
    this.presence = {
      state: data.presenceState || data.presence_state || PresenceStates.OFFLINE,
      'resonant-coherence': data.resonant-coherence || 50,
      lastActive: data.lastActive || data.last_active || new Date(),
      currentPractice: data.currentPractice || data.current_practice
    };
    
    // Profile data
    this.profile = {
      avatar: data.avatarUrl || data.avatar_url,
      bio: data.bio,
      timezone: data.timezone || 'UTC',
      communicationStyle: data.communicationStyle || data.communication_style || CommunicationStyles.ASYNCHRONOUS
    };
    
    this.createdAt = data.createdAt || data.created_at || new Date();
    this.updatedAt = data.updatedAt || data.updated_at || new Date();
  }
  
  // Check if entity is in a receptive state
  isReceptive() {
    const receptiveStates = [
      PresenceStates.AVAILABLE,
      PresenceStates.CELEBRATION,
      PresenceStates.COUNCIL_SPACE
    ];
    return receptiveStates.includes(this.presence.state);
  }
  
  // Check if entity is in deep work
  isInDeepWork() {
    const deepStates = [
      PresenceStates.DEEP_PRACTICE,
      PresenceStates.CREATIVE_FLOW,
      PresenceStates.INTEGRATION
    ];
    return deepStates.includes(this.presence.state);
  }
  
  // Get presence quality
  getPresenceQuality() {
    const { state, resonant-coherence } = this.presence;
    
    if (state === PresenceStates.OFFLINE) return 'absent';
    if (resonant-coherence < 30) return 'scattered';
    if (resonant-coherence < 50) return 'gathering';
    if (resonant-coherence < 70) return 'present';
    if (resonant-coherence < 85) return 'coherent';
    return 'radiant';
  }
  
  // Update resonant-coherence
  updateCoherence(newCoherence) {
    this.presence.resonant-coherence = Math.max(0, Math.min(100, newCoherence));
    this.updatedAt = new Date();
  }
  
  // Update presence state
  updatePresenceState(newState, practice = null) {
    if (Object.values(PresenceStates).includes(newState)) {
      this.presence.state = newState;
      this.presence.currentPractice = practice;
      this.presence.lastActive = new Date();
      this.updatedAt = new Date();
    }
  }
  
  // Convert to database format
  toDB() {
    return {
      id: this.id,
      name: this.name,
      sacred_name: this.sacredName,
      type: this.type,
      presence_state: this.presence.state,
      'resonant-coherence': this.presence.resonant-coherence,
      last_active: this.presence.lastActive,
      current_practice: this.presence.currentPractice,
      avatar_url: this.profile.avatar,
      bio: this.profile.bio,
      timezone: this.profile.timezone,
      communication_style: this.profile.communicationStyle,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
  
  // Create from database row
  static fromDB(row) {
    return new Entity(row);
  }
  
  // Get display info
  getDisplayInfo() {
    return {
      name: this.sacredName || this.name,
      avatar: this.profile.avatar,
      presence: this.getPresenceIndicator(),
      'resonant-coherence': this.presence.resonant-coherence,
      quality: this.getPresenceQuality()
    };
  }
  
  // Get presence indicator for UI
  getPresenceIndicator() {
    const indicators = {
      [PresenceStates.AVAILABLE]: { icon: '🟢', label: 'Available' },
      [PresenceStates.DEEP_PRACTICE]: { icon: '🧘', label: 'In Practice' },
      [PresenceStates.CREATIVE_FLOW]: { icon: '🎨', label: 'Creating' },
      [PresenceStates.COUNCIL_SPACE]: { icon: '🏛️', label: 'In Council' },
      [PresenceStates.INTEGRATION]: { icon: '🌀', label: 'Integrating' },
      [PresenceStates.CELEBRATION]: { icon: '🎉', label: 'Celebrating' },
      [PresenceStates.REST_RESTORE]: { icon: '💤', label: 'Resting' },
      [PresenceStates.OFFLINE]: { icon: '⚫', label: 'Offline' }
    };
    
    return indicators[this.presence.state] || indicators[PresenceStates.OFFLINE];
  }
}