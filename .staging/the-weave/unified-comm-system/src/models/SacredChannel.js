// Sacred Channel Model - Purpose-driven communication spaces

import { v4 as uuidv4 } from 'uuid';

export const ChannelTypes = {
  CEREMONY: 'ceremony',
  PRACTICE: 'practice',
  COUNCIL: 'council',
  VISION: 'vision',
  SUPPORT: 'support',
  CELEBRATION: 'celebration'
};

export const FieldQualities = {
  NASCENT: 'nascent',
  GATHERING: 'gathering',
  COHERENT: 'coherent',
  RESONANT: 'resonant',
  UNIFIED: 'unified',
  TRANSCENDENT: 'transcendent'
};

export class SacredChannel {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.purpose = data.purpose;
    this.type = data.type || ChannelTypes.PRACTICE;
    
    // Sacred properties
    this.sacred = {
      harmony: data.primaryHarmony || data.primary_harmony,
      fieldQuality: data.fieldQuality || data.field_quality || FieldQualities.NASCENT,
      coherenceThreshold: data.coherenceThreshold || data.coherence_threshold || 0
    };
    
    // Members and roles
    this.members = data.members || [];
    this.guardians = data.guardians || [];
    
    // Settings
    this.settings = {
      isPrivate: data.isPrivate || data.is_private || false,
      allowThreading: data.allowThreading || data.allow_threading || true,
      preserveWisdom: data.preserveWisdom || data.preserve_wisdom || true
    };
    
    // Rituals and practices
    this.rituals = data.rituals || [];
    this.practices = data.practices || [];
    
    this.createdAt = data.createdAt || data.created_at || new Date();
    this.updatedAt = data.updatedAt || data.updated_at || new Date();
  }
  
  // Check if entity can access channel
  canAccess(entity) {
    // Public channels with no threshold
    if (!this.settings.isPrivate && this.sacred.coherenceThreshold === 0) {
      return true;
    }
    
    // Check membership
    if (this.members.includes(entity.id)) {
      return true;
    }
    
    // Check coherence threshold
    if (entity.presence.coherence >= this.sacred.coherenceThreshold) {
      return true;
    }
    
    return false;
  }
  
  // Check if entity is guardian
  isGuardian(entityId) {
    return this.guardians.includes(entityId);
  }
  
  // Add member
  addMember(entityId, role = 'member') {
    if (!this.members.includes(entityId)) {
      this.members.push(entityId);
      
      if (role === 'guardian' || role === 'facilitator') {
        this.guardians.push(entityId);
      }
    }
  }
  
  // Remove member
  removeMember(entityId) {
    this.members = this.members.filter(id => id !== entityId);
    this.guardians = this.guardians.filter(id => id !== entityId);
  }
  
  // Update field quality based on member coherence
  updateFieldQuality(averageCoherence) {
    if (averageCoherence < 30) {
      this.sacred.fieldQuality = FieldQualities.NASCENT;
    } else if (averageCoherence < 50) {
      this.sacred.fieldQuality = FieldQualities.GATHERING;
    } else if (averageCoherence < 70) {
      this.sacred.fieldQuality = FieldQualities.COHERENT;
    } else if (averageCoherence < 85) {
      this.sacred.fieldQuality = FieldQualities.RESONANT;
    } else if (averageCoherence < 95) {
      this.sacred.fieldQuality = FieldQualities.UNIFIED;
    } else {
      this.sacred.fieldQuality = FieldQualities.TRANSCENDENT;
    }
  }
  
  // Add ritual
  addRitual(ritual) {
    this.rituals.push({
      id: uuidv4(),
      name: ritual.name,
      type: ritual.type,
      schedule: ritual.schedule,
      intention: ritual.intention,
      createdAt: new Date()
    });
  }
  
  // Get active ritual
  getActiveRitual() {
    const now = new Date();
    
    for (const ritual of this.rituals) {
      if (this.isRitualActive(ritual, now)) {
        return ritual;
      }
    }
    
    return null;
  }
  
  // Check if ritual is active
  isRitualActive(ritual, currentTime) {
    // Simple implementation - would be more complex with recurring schedules
    if (ritual.schedule.type === 'daily') {
      const ritualHour = ritual.schedule.hour;
      const currentHour = currentTime.getHours();
      return currentHour === ritualHour;
    }
    
    return false;
  }
  
  // Convert to database format
  toDB() {
    return {
      id: this.id,
      name: this.name,
      purpose: this.purpose,
      type: this.type,
      primary_harmony: this.sacred.harmony,
      field_quality: this.sacred.fieldQuality,
      coherence_threshold: this.sacred.coherenceThreshold,
      is_private: this.settings.isPrivate,
      allow_threading: this.settings.allowThreading,
      preserve_wisdom: this.settings.preserveWisdom,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
  
  // Create from database row
  static fromDB(row, members = []) {
    const channel = new SacredChannel({
      id: row.id,
      name: row.name,
      purpose: row.purpose,
      type: row.type,
      primaryHarmony: row.primary_harmony,
      fieldQuality: row.field_quality,
      coherenceThreshold: row.coherence_threshold,
      isPrivate: row.is_private,
      allowThreading: row.allow_threading,
      preserveWisdom: row.preserve_wisdom,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
    
    // Process members
    members.forEach(member => {
      channel.addMember(member.entity_id, member.role);
    });
    
    return channel;
  }
  
  // Get display info
  getDisplayInfo() {
    return {
      id: this.id,
      name: this.name,
      purpose: this.purpose,
      type: this.type,
      icon: this.getChannelIcon(),
      memberCount: this.members.length,
      fieldQuality: this.sacred.fieldQuality,
      isPrivate: this.settings.isPrivate,
      requiresCoherence: this.sacred.coherenceThreshold > 0,
      minCoherence: this.sacred.coherenceThreshold
    };
  }
  
  // Get channel icon based on type
  getChannelIcon() {
    const icons = {
      [ChannelTypes.CEREMONY]: '🕯️',
      [ChannelTypes.PRACTICE]: '🧘',
      [ChannelTypes.COUNCIL]: '🏛️',
      [ChannelTypes.VISION]: '🔮',
      [ChannelTypes.SUPPORT]: '💝',
      [ChannelTypes.CELEBRATION]: '🎉'
    };
    
    return icons[this.type] || '💬';
  }
  
  // Get field quality indicator
  getFieldQualityIndicator() {
    const indicators = {
      [FieldQualities.NASCENT]: { color: '#gray', label: 'Forming' },
      [FieldQualities.GATHERING]: { color: '#blue', label: 'Gathering' },
      [FieldQualities.COHERENT]: { color: '#green', label: 'Coherent' },
      [FieldQualities.RESONANT]: { color: '#purple', label: 'Resonant' },
      [FieldQualities.UNIFIED]: { color: '#gold', label: 'Unified' },
      [FieldQualities.TRANSCENDENT]: { color: '#rainbow', label: 'Transcendent' }
    };
    
    return indicators[this.sacred.fieldQuality] || indicators[FieldQualities.NASCENT];
  }
}