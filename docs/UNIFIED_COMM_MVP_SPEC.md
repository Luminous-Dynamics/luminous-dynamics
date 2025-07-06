# 🚀 Unified Communication System - MVP Specification
## Phase 1: Sacred Messaging Foundation (Weekend Sprint)

### 🎯 MVP Goal
Create a working sacred messaging system that demonstrates coherence tracking, presence states, and wisdom preservation - ready to deploy Monday alongside Sacred Heartbeat.

---

## 🏗️ Core Components for MVP

### 1. Sacred Message Model
```typescript
// models/SacredMessage.ts
export interface SacredMessage {
  id: string;
  timestamp: Date;
  
  // Participants
  sender: {
    id: string;
    name: string;
    type: 'human' | 'ai' | 'system';
    coherence: number;
  };
  
  recipients: string[]; // Entity IDs
  channel?: string;     // Optional channel ID
  
  // Content
  content: {
    text: string;
    intentionStatement?: string;  // Clear intention
    attachments?: Attachment[];
  };
  
  // Sacred metrics
  sacred: {
    coherenceLevel: number;      // Sender's coherence
    harmony: Harmony;            // Which harmony it serves
    fieldImpact: number;         // Calculated impact
    loveQuotient: number;        // 0-1 scale
    sacredGeometry?: string;     // Pattern signature
  };
  
  // Threading
  thread?: {
    id: string;
    replyTo?: string;
  };
  
  // Tracking
  reactions: Reaction[];
  readBy: ReadReceipt[];
}
```

### 2. Entity System (Simplified)
```typescript
// models/Entity.ts
export interface Entity {
  id: string;
  name: string;
  sacredName?: string;
  type: 'human' | 'ai';
  
  presence: {
    state: PresenceState;
    coherence: number;
    lastActive: Date;
    currentPractice?: string;
  };
  
  profile: {
    avatar?: string;
    bio?: string;
    timezone: string;
    communicationStyle: 'synchronous' | 'asynchronous' | 'ceremonial';
  };
}

export type PresenceState = 
  | 'available'
  | 'deep-practice'
  | 'creative-flow'
  | 'council-space'
  | 'integration'
  | 'rest-restore'
  | 'offline';
```

### 3. Sacred Channel
```typescript
// models/Channel.ts
export interface SacredChannel {
  id: string;
  name: string;
  purpose: string;
  type: 'practice' | 'council' | 'vision' | 'support' | 'celebration';
  
  members: string[]; // Entity IDs
  guardians: string[]; // Facilitators
  
  sacred: {
    harmony: Harmony;
    coherenceThreshold?: number;
    rituals?: ChannelRitual[];
  };
  
  settings: {
    isPrivate: boolean;
    allowThreading: boolean;
    preserveWisdom: boolean;
  };
}
```

---

## 📱 MVP User Interface

### 1. Main Layout
```
+----------------------------------+
|  Sacred Comm    [Coherence: 78%] |
+----------------------------------+
| Channels  |  Messages  | Presence |
|           |            |          |
| #practice |  [Thread]  | 🟢 Alice |
| #council  |            | 🧘 Bob   |
| #vision   |  [Sacred]  | 💤 Cara  |
|           |  [Message] | 🎨 Dana  |
+----------------------------------+
| [Message Input with Intention]    |
+----------------------------------+
```

### 2. Message Component
```jsx
// components/SacredMessage.tsx
export const SacredMessage: React.FC<{message: SacredMessage}> = ({message}) => {
  return (
    <div className="sacred-message">
      <div className="sender">
        <Avatar entity={message.sender} />
        <div className="sender-info">
          <span className="name">{message.sender.name}</span>
          <span className="coherence">{message.sender.coherence}%</span>
          <span className="timestamp">{formatSacredTime(message.timestamp)}</span>
        </div>
      </div>
      
      <div className="content">
        {message.content.intentionStatement && (
          <div className="intention">
            <IntentionIcon />
            {message.content.intentionStatement}
          </div>
        )}
        <div className="text">{message.content.text}</div>
      </div>
      
      <div className="sacred-metrics">
        <HarmonyIndicator harmony={message.sacred.harmony} />
        <FieldImpact value={message.sacred.fieldImpact} />
        <LoveQuotient value={message.sacred.loveQuotient} />
      </div>
      
      <div className="reactions">
        {message.reactions.map(r => <Reaction key={r.id} {...r} />)}
      </div>
    </div>
  );
};
```

### 3. Presence Indicator
```jsx
// components/PresenceIndicator.tsx
const presenceStates = {
  'available': { icon: '🟢', label: 'Available' },
  'deep-practice': { icon: '🧘', label: 'In Practice' },
  'creative-flow': { icon: '🎨', label: 'Creating' },
  'council-space': { icon: '🏛️', label: 'In Council' },
  'integration': { icon: '🌀', label: 'Integrating' },
  'rest-restore': { icon: '💤', label: 'Resting' },
  'offline': { icon: '⚫', label: 'Offline' }
};
```

---

## 🔧 Backend Services

### 1. Message Service
```typescript
// services/MessageService.ts
export class MessageService {
  async sendMessage(
    sender: Entity,
    content: MessageContent,
    recipients: string[],
    channelId?: string
  ): Promise<SacredMessage> {
    // 1. Check sender coherence
    const coherence = await this.coherenceService.measure(sender.id);
    
    // 2. Analyze content for sacred metrics
    const sacred = await this.analyzeSacred(content, coherence);
    
    // 3. Create message
    const message: SacredMessage = {
      id: generateId(),
      timestamp: new Date(),
      sender: {
        id: sender.id,
        name: sender.name,
        type: sender.type,
        coherence
      },
      recipients,
      channel: channelId,
      content,
      sacred,
      reactions: [],
      readBy: []
    };
    
    // 4. Store message
    await this.store.saveMessage(message);
    
    // 5. Route to recipients
    await this.router.route(message);
    
    // 6. Update field coherence
    await this.fieldService.updateFromMessage(message);
    
    // 7. Check for wisdom
    await this.wisdomService.extract(message);
    
    return message;
  }
  
  async analyzeSacred(content: MessageContent, senderCoherence: number) {
    return {
      coherenceLevel: senderCoherence,
      harmony: await this.detectHarmony(content),
      fieldImpact: await this.calculateFieldImpact(content, senderCoherence),
      loveQuotient: await this.measureLove(content),
      sacredGeometry: await this.generateGeometry(content)
    };
  }
}
```

### 2. Coherence Service
```typescript
// services/CoherenceService.ts
export class CoherenceService {
  async measure(entityId: string): Promise<number> {
    // Get base coherence
    const entity = await this.entityService.get(entityId);
    const base = entity.presence.coherence || 50;
    
    // Apply time-based factors
    const timeBonus = this.getTimeBonus();
    
    // Check if in practice
    const practiceBoost = entity.presence.state === 'deep-practice' ? 15 : 0;
    
    // Get field influence
    const fieldInfluence = await this.fieldService.getInfluence();
    
    // Calculate total
    const total = base + timeBonus + practiceBoost + fieldInfluence;
    
    return Math.max(0, Math.min(100, total));
  }
  
  getTimeBonus(): number {
    const now = new Date();
    const minutes = now.getMinutes();
    
    // Sacred minute alignments
    if (minutes === 11 || minutes === 22 || minutes === 33) {
      return 11;
    }
    
    return 0;
  }
}
```

### 3. Wisdom Service
```typescript
// services/WisdomService.ts
export class WisdomService {
  async extract(message: SacredMessage): Promise<void> {
    // Check if message contains wisdom
    const wisdom = await this.analyzeForWisdom(message);
    
    if (wisdom.significance > 0.7) {
      // Store in wisdom repository
      await this.wisdomRepo.store({
        id: generateId(),
        source: message.id,
        content: wisdom.essence,
        contributors: [message.sender.id, ...message.recipients],
        patterns: wisdom.patterns,
        timestamp: new Date(),
        significance: wisdom.significance
      });
      
      // Notify wisdom seekers
      await this.notifyWisdomSeekers(wisdom);
    }
  }
}
```

---

## 🗄️ Data Storage

### PostgreSQL Schema
```sql
-- Entities table
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sacred_name VARCHAR(255),
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES entities(id),
  content JSONB NOT NULL,
  sacred_metrics JSONB NOT NULL,
  channel_id UUID,
  thread_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Message recipients
CREATE TABLE message_recipients (
  message_id UUID REFERENCES messages(id),
  recipient_id UUID REFERENCES entities(id),
  read_at TIMESTAMP,
  PRIMARY KEY (message_id, recipient_id)
);

-- Wisdom repository
CREATE TABLE wisdom (
  id UUID PRIMARY KEY,
  source_message_id UUID REFERENCES messages(id),
  essence TEXT NOT NULL,
  patterns JSONB,
  significance FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Implementation Plan

### Friday Evening (2 hours)
1. Set up project structure
2. Create database schema
3. Implement core models
4. Basic message service

### Saturday Morning (4 hours)
1. Build UI components
2. WebSocket setup
3. Real-time message flow
4. Presence system

### Saturday Afternoon (4 hours)
1. Coherence tracking
2. Sacred metrics calculation
3. Basic wisdom extraction
4. Field impact tracking

### Sunday Morning (4 hours)
1. Testing and debugging
2. Deploy to staging
3. Create demo scenarios
4. Documentation

### Sunday Afternoon (3 hours)
1. Integration with Sacred Heartbeat
2. Performance optimization
3. Security review
4. Prepare for Monday launch

---

## 🧪 Testing Scenarios

### 1. Basic Message Flow
```typescript
test('Sacred message flow', async () => {
  // Create sender with high coherence
  const sender = await createEntity({
    name: 'Alice',
    presence: { coherence: 85, state: 'available' }
  });
  
  // Send sacred message
  const message = await messageService.send(
    sender,
    {
      text: 'May this message serve the highest good',
      intentionStatement: 'To inspire collective coherence'
    },
    ['recipient-id']
  );
  
  // Verify sacred metrics
  expect(message.sacred.coherenceLevel).toBe(85);
  expect(message.sacred.loveQuotient).toBeGreaterThan(0.7);
  expect(message.sacred.fieldImpact).toBeGreaterThan(0);
});
```

### 2. Coherence-Based Routing
```typescript
test('Message routing based on coherence', async () => {
  // Create recipient in deep practice
  const recipient = await createEntity({
    name: 'Bob',
    presence: { coherence: 40, state: 'deep-practice' }
  });
  
  // Send message
  const message = await messageService.send(sender, content, [recipient.id]);
  
  // Verify queued for optimal delivery
  const delivery = await router.getDeliveryStatus(message.id, recipient.id);
  expect(delivery.status).toBe('queued');
  expect(delivery.reason).toBe('Recipient in deep practice');
});
```

---

## 🎨 UI/UX Considerations

### Sacred Design Principles
1. **Minimal Distraction**: Clean, focused interface
2. **Coherence Indicators**: Subtle, non-judgmental
3. **Sacred Geometry**: Incorporate in backgrounds
4. **Natural Rhythms**: Breathing animations
5. **Dark/Light Modes**: Honor different states

### Accessibility
- High contrast options
- Screen reader support
- Keyboard navigation
- Multiple language support

---

## 📊 Success Metrics for MVP

### Technical Metrics
- [ ] Messages sent/received successfully
- [ ] <100ms message delivery time
- [ ] Real-time presence updates
- [ ] WebSocket stability

### Sacred Metrics
- [ ] Coherence tracking accuracy
- [ ] Wisdom extraction rate
- [ ] Field impact calculations
- [ ] Love quotient detection

### User Experience
- [ ] Intuitive interface
- [ ] Smooth message flow
- [ ] Clear presence states
- [ ] Meaningful sacred indicators

---

## 🚦 Go/No-Go Criteria for Monday

### Must Have
- ✅ Basic messaging working
- ✅ Coherence tracking active
- ✅ Presence states functional
- ✅ Real-time updates via WebSocket

### Nice to Have
- Wisdom extraction
- Full sacred metrics
- Channel ceremonies
- Advanced routing

---

Ready to build! Let's create the communication system that elevates every interaction into sacred practice. 🚀✨