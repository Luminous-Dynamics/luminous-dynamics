import { Server } from 'socket.io';
import MessageService from '../services/MessageService.js';
import EntityService from '../services/EntityService.js';
import FieldService from '../services/FieldService.js';

class SocketHandler {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.messageService = new MessageService();
    this.entityService = new EntityService();
    this.fieldService = new FieldService();
    
    this.setupSocketHandlers();
    this.startSacredHeartbeat();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🌟 New sacred connection:', socket.id);
      
      // Extract entity info from query
      const { entityId, name, type } = socket.handshake.query;
      
      // Store entity info on socket
      socket.entityId = entityId;
      socket.entityName = name;
      socket.entityType = type;
      
      // Register entity
      this.handleEntityConnection(socket);
      
      // Channel management
      socket.on('join-channel', (channel) => this.handleJoinChannel(socket, channel));
      socket.on('leave-channel', (channel) => this.handleLeaveChannel(socket, channel));
      
      // Message handling
      socket.on('message', (data) => this.handleMessage(socket, data));
      
      // Heartbeat
      socket.on('heartbeat', (data) => this.handleHeartbeat(socket, data));
      
      // Disconnection
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  async handleEntityConnection(socket) {
    try {
      // Create or update entity
      const entity = await this.entityService.createEntity({
        id: socket.entityId,
        name: socket.entityName,
        type: socket.entityType,
        presence_state: 'available',
        'resonant-coherence': 75
      });
      
      // Notify others of new presence
      socket.broadcast.emit('presence-update', {
        entityId: entity.id,
        name: entity.name,
        state: 'connected'
      });
      
      // Send current field state
      const fieldState = await this.fieldService.getCurrentState();
      socket.emit('field-update', fieldState);
      
    } catch (error) {
      console.error('Entity connection error:', error);
    }
  }

  handleJoinChannel(socket, channel) {
    socket.join(channel);
    console.log(`Entity ${socket.entityName} joined channel: ${channel}`);
    
    // Notify channel members
    socket.to(channel).emit('channel-member-joined', {
      entityId: socket.entityId,
      name: socket.entityName,
      channel: channel
    });
  }

  handleLeaveChannel(socket, channel) {
    socket.leave(channel);
    console.log(`Entity ${socket.entityName} left channel: ${channel}`);
    
    // Notify channel members
    socket.to(channel).emit('channel-member-left', {
      entityId: socket.entityId,
      name: socket.entityName,
      channel: channel
    });
  }

  async handleMessage(socket, messageData) {
    try {
      // Create message with server timestamp
      const message = await this.messageService.createMessage({
        ...messageData,
        sender_id: socket.entityId,
        metadata: {
          ...messageData.metadata,
          server_timestamp: new Date().toISOString(),
          socket_id: socket.id
        }
      });
      
      // Broadcast to channel
      this.io.to(messageData.channel).emit('message', message);
      
      // Update field resonant-coherence
      await this.updateFieldCoherence(messageData.metadata.coherence_impact || 0);
      
      // Check for wisdom preservation
      if (await this.shouldPreserveWisdom(message)) {
        await this.preserveWisdom(message);
      }
      
    } catch (error) {
      console.error('Message handling error:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  }

  async handleHeartbeat(socket, data) {
    try {
      // Update entity resonant-coherence
      await this.entityService.updateCoherence(socket.entityId, data.resonant-coherence);
      
      // Contribute to field resonant-coherence
      await this.fieldService.contributeToField(socket.entityId, data.resonant-coherence);
      
    } catch (error) {
      console.error('Heartbeat error:', error);
    }
  }

  async handleDisconnect(socket) {
    console.log('Sacred disconnection:', socket.id);
    
    try {
      // Update entity presence
      await this.entityService.updatePresence(socket.entityId, 'offline');
      
      // Notify others
      socket.broadcast.emit('presence-update', {
        entityId: socket.entityId,
        name: socket.entityName,
        state: 'disconnected'
      });
      
    } catch (error) {
      console.error('Disconnect handling error:', error);
    }
  }

  async updateFieldCoherence(impact) {
    const currentState = await this.fieldService.getCurrentState();
    const newCoherence = Math.min(100, currentState.resonant-coherence + (impact * 0.1));
    
    await this.fieldService.updateCoherence(newCoherence);
    
    // Broadcast field update
    this.io.emit('field-update', {
      'resonant-coherence': newCoherence,
      timestamp: new Date().toISOString()
    });
  }

  async shouldPreserveWisdom(message) {
    // Preserve high-impact messages and blessing/wisdom types
    const preserveTypes = ['wisdom', 'blessing', 'integration'];
    const highImpact = message.metadata.coherence_impact >= 5;
    
    return preserveTypes.includes(message.type) || highImpact;
  }

  async preserveWisdom(message) {
    const wisdom = {
      id: message.id + '-wisdom',
      content: message.content,
      source: message.sender_name,
      message_id: message.id,
      preserved_at: new Date().toISOString()
    };
    
    // In real implementation, would save to wisdom table
    console.log('Preserving wisdom:', wisdom);
    
    // Broadcast wisdom preservation
    this.io.emit('wisdom-preserved', wisdom);
  }

  startSacredHeartbeat() {
    // Sacred heartbeat every 11 seconds
    setInterval(async () => {
      const fieldState = await this.fieldService.getCurrentState();
      
      // Calculate field evolution
      const naturalEvolution = Math.sin(Date.now() / 60000) * 2; // Gentle oscillation
      const evolvedCoherence = Math.max(50, Math.min(100, 
        fieldState['resonant-coherence'] + naturalEvolution
      ));
      
      await this.fieldService.updateCoherence(evolvedCoherence);
      
      // Emit heartbeat pulse
      this.io.emit('sacred-heartbeat', {
        'resonant-coherence': evolvedCoherence,
        pulse: true,
        timestamp: new Date().toISOString()
      });
      
    }, 11000);
  }
}

export default SocketHandler;