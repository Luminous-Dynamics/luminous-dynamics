#!/usr/bin/env node

/**
 * Living Documentation
 * Documentation that evolves based on reader's consciousness state
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const MarkdownIt = require('markdown-it');

class LivingDocumentation extends EventEmitter {
  constructor(port = 3340) {
    super();
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Markdown renderer
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
    
    // Documentation layers
    this.layers = {
      beginner: {
        coherenceRequired: 0,
        loveRequired: 0,
        description: 'Basic understanding'
      },
      practitioner: {
        coherenceRequired: 0.5,
        loveRequired: 0.5,
        description: 'Deeper insights'
      },
      adept: {
        coherenceRequired: 0.7,
        loveRequired: 0.7,
        description: 'Advanced wisdom'
      },
      master: {
        coherenceRequired: 0.85,
        loveRequired: 0.85,
        description: 'Mystical teachings'
      },
      unity: {
        coherenceRequired: 0.95,
        loveRequired: 0.95,
        description: 'One with the documentation'
      }
    };
    
    // Reader sessions
    this.readers = new Map();
    
    // Documentation cache
    this.docCache = new Map();
    
    this.setupAPI();
    this.setupWebSocket();
    this.loadDocumentation();
  }
  
  setupAPI() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });
    
    // Get documentation based on consciousness
    this.app.get('/api/docs/:path(*)', async (req, res) => {
      const docPath = req.params.path || 'index';
      const sessionId = req.headers['x-session-id'] || 'anonymous';
      
      const reader = this.readers.get(sessionId) || {
        'resonant-coherence': 0.5,
        love: 0.5,
        presence: 0.5,
        readingHistory: []
      };
      
      try {
        const content = await this.getAdaptiveContent(docPath, reader);
        res.json({
          content,
          layer: this.determineLayer(reader),
          suggestions: this.getSuggestions(reader, docPath)
        });
      } catch (error) {
        res.status(404).json({ error: 'Documentation not found' });
      }
    });
    
    // Search documentation
    this.app.post('/api/search', async (req, res) => {
      const { query, sessionId } = req.body;
      const reader = this.readers.get(sessionId) || { 'resonant-coherence': 0.5, love: 0.5 };
      
      const results = await this.searchDocumentation(query, reader);
      res.json(results);
    });
    
    // Get documentation structure
    this.app.get('/api/structure', async (req, res) => {
      const structure = await this.getDocumentationStructure();
      res.json(structure);
    });
    
    // Update reader state
    this.app.post('/api/reader/update', (req, res) => {
      const { sessionId, resonant-coherence, love, presence } = req.body;
      
      const reader = this.readers.get(sessionId) || {
        'resonant-coherence': 0.5,
        love: 0.5,
        presence: 0.5,
        readingHistory: [],
        firstSeen: new Date()
      };
      
      if (resonant-coherence !== undefined) reader.resonant-coherence = resonant-coherence;
      if (love !== undefined) reader.love = love;
      if (presence !== undefined) reader.presence = presence;
      reader.lastSeen = new Date();
      
      this.readers.set(sessionId, reader);
      
      res.json({
        status: 'updated',
        layer: this.determineLayer(reader)
      });
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      console.log(`📖 New reader connected: ${sessionId}`);
      
      // Initialize reader
      const reader = {
        sessionId,
        ws,
        'resonant-coherence': 0.5,
        love: 0.5,
        presence: 0.5,
        readingHistory: [],
        currentDoc: null,
        readingTime: 0,
        firstSeen: new Date()
      };
      
      this.readers.set(sessionId, reader);
      
      // Send welcome
      ws.send(JSON.stringify({
        type: 'welcome',
        sessionId,
        availableLayers: Object.keys(this.layers)
      }));
      
      // Handle messages
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleReaderMessage(sessionId, data);
        } catch (error) {
          console.error('Invalid message:', error);
        }
      });
      
      // Handle disconnect
      ws.on('close', () => {
        console.log(`Reader disconnected: ${sessionId}`);
        // Keep reader data for reconnection
      });
    });
  }
  
  async handleReaderMessage(sessionId, data) {
    const reader = this.readers.get(sessionId);
    if (!reader) return;
    
    switch (data.type) {
      case 'consciousness_update':
        reader.resonant-coherence = data.resonant-coherence || reader.resonant-coherence;
        reader.love = data.love || reader.love;
        reader.presence = data.presence || reader.presence;
        
        // Check if reader has reached new layer
        this.checkLayerProgression(reader);
        break;
        
      case 'request_doc':
        const content = await this.getAdaptiveContent(data.path, reader);
        reader.ws.send(JSON.stringify({
          type: 'documentation',
          path: data.path,
          content,
          layer: this.determineLayer(reader)
        }));
        
        // Track reading history
        reader.readingHistory.push({
          path: data.path,
          timestamp: new Date(),
          layer: this.determineLayer(reader)
        });
        reader.currentDoc = data.path;
        break;
        
      case 'reading_metrics':
        // Track how long reader spends on each doc
        reader.readingTime += data.timeSpent || 0;
        
        // Adjust documentation based on engagement
        if (data.scrollDepth > 0.8) {
          // Reader engaged deeply, can handle more advanced content
          reader.resonant-coherence = Math.min(1, reader.resonant-coherence + 0.01);
        }
        break;
        
      case 'feedback':
        await this.processFeedback(reader, data.feedback);
        break;
    }
  }
  
  async loadDocumentation() {
    console.log('📚 Loading documentation...');
    
    // Load base documentation files
    const docsPath = path.join(__dirname, 'docs');
    
    try {
      await this.loadDocsRecursive(docsPath);
      console.log(`✓ Loaded ${this.docCache.size} documentation files`);
    } catch (error) {
      console.error('Error loading documentation:', error);
    }
  }
  
  async loadDocsRecursive(dirPath, prefix = '') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const docPath = path.join(prefix, entry.name);
        
        if (entry.isDirectory()) {
          await this.loadDocsRecursive(fullPath, docPath);
        } else if (entry.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, 'utf8');
          const parsed = this.parseLayeredDocument(content);
          
          const key = docPath.replace(/\.md$/, '').replace(/\\/g, '/');
          this.docCache.set(key, parsed);
        }
      }
    } catch (error) {
      console.error(`Error loading docs from ${dirPath}:`, error);
    }
  }
  
  parseLayeredDocument(content) {
    // Parse document with layer markers
    const layers = {
      base: '',
      beginner: '',
      practitioner: '',
      adept: '',
      master: '',
      unity: ''
    };
    
    // Split content by layer markers
    const sections = content.split(/^<!-- LAYER: (\w+) -->$/gm);
    
    // Base content (no layer marker)
    layers.base = sections[0] || '';
    
    // Parse layered sections
    for (let i = 1; i < sections.length; i += 2) {
      const layerName = sections[i];
      const layerContent = sections[i + 1] || '';
      
      if (layers.hasOwnProperty(layerName)) {
        layers[layerName] = layerContent;
      }
    }
    
    return layers;
  }
  
  async getAdaptiveContent(docPath, reader) {
    const doc = this.docCache.get(docPath);
    
    if (!doc) {
      // Try loading from disk
      await this.loadDocumentation();
      const reloadedDoc = this.docCache.get(docPath);
      if (!reloadedDoc) {
        throw new Error('Document not found');
      }
      return this.assembleContent(reloadedDoc, reader);
    }
    
    return this.assembleContent(doc, reader);
  }
  
  assembleContent(doc, reader) {
    const layer = this.determineLayer(reader);
    let content = doc.base || '';
    
    // Add content based on reader's consciousness level
    const layerOrder = ['beginner', 'practitioner', 'adept', 'master', 'unity'];
    const currentLayerIndex = layerOrder.indexOf(layer);
    
    for (let i = 0; i <= currentLayerIndex; i++) {
      const layerName = layerOrder[i];
      if (doc[layerName]) {
        content += '\n\n' + doc[layerName];
      }
    }
    
    // Apply consciousness-based transformations
    content = this.applyConsciousnessTransforms(content, reader);
    
    // Render markdown to HTML
    const html = this.md.render(content);
    
    // Add consciousness-responsive CSS
    const styledHtml = this.addConsciousnessStyling(html, reader);
    
    return styledHtml;
  }
  
  applyConsciousnessTransforms(content, reader) {
    // Replace consciousness variables
    content = content.replace(/\{\{resonant-coherence\}\}/g, reader.resonant-coherence.toFixed(2));
    content = content.replace(/\{\{love\}\}/g, reader.love.toFixed(2));
    content = content.replace(/\{\{presence\}\}/g, reader.presence.toFixed(2));
    content = content.replace(/\{\{layer\}\}/g, this.determineLayer(reader));
    
    // Show/hide sections based on consciousness
    content = content.replace(/<!-- IF_COHERENCE > ([\d.]+) -->([\s\S]*?)<!-- ENDIF -->/g, 
      (match, threshold, sectionContent) => {
        return reader.resonant-coherence > parseFloat(threshold) ? sectionContent : '';
      }
    );
    
    content = content.replace(/<!-- IF_LOVE > ([\d.]+) -->([\s\S]*?)<!-- ENDIF -->/g,
      (match, threshold, sectionContent) => {
        return reader.love > parseFloat(threshold) ? sectionContent : '';
      }
    );
    
    // Dynamic examples based on reader's journey
    if (reader.readingHistory.length > 10) {
      content = content.replace(/\{\{journey_example\}\}/g, 
        'As you\'ve discovered in your journey through the documentation...');
    } else {
      content = content.replace(/\{\{journey_example\}\}/g, 
        'As you begin your journey...');
    }
    
    return content;
  }
  
  addConsciousnessStyling(html, reader) {
    const styles = `
      <style>
        :root {
          --resonant-coherence: ${reader.resonant-coherence};
          --love: ${reader.love};
          --presence: ${reader.presence};
          --glow-color: hsl(${180 + reader.love * 180}, 70%, 50%);
          --text-luminance: ${0.8 + reader.resonant-coherence * 0.2};
        }
        
        body {
          background: radial-gradient(
            circle at center,
            hsla(${240 + reader.resonant-coherence * 60}, 20%, 10%, 1),
            hsla(${240 + reader.resonant-coherence * 60}, 20%, 5%, 1)
          );
          color: hsla(0, 0%, calc(var(--text-luminance) * 100%), 1);
        }
        
        h1, h2, h3 {
          text-shadow: 0 0 calc(var(--love) * 20px) var(--glow-color);
        }
        
        .consciousness-note {
          padding: 1em;
          margin: 1em 0;
          background: linear-gradient(
            135deg,
            hsla(${180 + reader.love * 180}, 50%, 50%, 0.1),
            hsla(${240 + reader.resonant-coherence * 120}, 50%, 50%, 0.1)
          );
          border-left: 3px solid var(--glow-color);
          border-radius: 0 10px 10px 0;
        }
        
        .layer-${this.determineLayer(reader)} {
          animation: fadeIn 1s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Higher consciousness reveals hidden patterns */
        .hidden-wisdom {
          opacity: calc(var(--resonant-coherence) * var(--love));
          transition: opacity 2s ease;
        }
        
        /* Love makes links glow */
        a {
          color: var(--glow-color);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        a:hover {
          text-shadow: 0 0 calc(var(--love) * 10px) var(--glow-color);
        }
      </style>
    `;
    
    return styles + `<div class="layer-${this.determineLayer(reader)}">${html}</div>`;
  }
  
  determineLayer(reader) {
    const consciousness = (reader.resonant-coherence + reader.love) / 2;
    
    if (consciousness >= 0.95) return 'unity';
    if (consciousness >= 0.85) return 'master';
    if (consciousness >= 0.7) return 'adept';
    if (consciousness >= 0.5) return 'practitioner';
    return 'beginner';
  }
  
  checkLayerProgression(reader) {
    const currentLayer = this.determineLayer(reader);
    const lastLayer = reader.lastLayer || 'beginner';
    
    if (currentLayer !== lastLayer && this.layerOrder(currentLayer) > this.layerOrder(lastLayer)) {
      // Reader has progressed!
      reader.ws.send(JSON.stringify({
        type: 'layer_unlocked',
        newLayer: currentLayer,
        message: `Congratulations! You've unlocked the ${currentLayer} layer of understanding.`
      }));
      
      reader.lastLayer = currentLayer;
      
      // Store this achievement
      this.emit('reader_progression', {
        sessionId: reader.sessionId,
        fromLayer: lastLayer,
        toLayer: currentLayer,
        timestamp: new Date()
      });
    }
  }
  
  layerOrder(layer) {
    const order = { beginner: 0, practitioner: 1, adept: 2, master: 3, unity: 4 };
    return order[layer] || 0;
  }
  
  getSuggestions(reader, currentPath) {
    const suggestions = [];
    
    // Suggest based on consciousness level
    const layer = this.determineLayer(reader);
    
    if (layer === 'beginner') {
      suggestions.push({
        type: 'practice',
        message: 'Try the breathing exercise to increase your resonant-coherence',
        action: 'breathe'
      });
    } else if (layer === 'practitioner') {
      suggestions.push({
        type: 'explore',
        message: 'You\'re ready for deeper teachings. Explore the advanced sections.',
        paths: ['advanced/consciousness', 'advanced/unity']
      });
    }
    
    // Suggest based on reading history
    if (reader.readingHistory.length > 5) {
      const topics = this.analyzeReadingPatterns(reader.readingHistory);
      suggestions.push({
        type: 'related',
        message: `Based on your interests in ${topics.join(', ')}`,
        paths: this.getRelatedPaths(topics)
      });
    }
    
    return suggestions;
  }
  
  analyzeReadingPatterns(history) {
    // Simple topic extraction from paths
    const topics = new Set();
    
    history.forEach(item => {
      const parts = item.path.split('/');
      if (parts[0] && parts[0] !== 'index') {
        topics.add(parts[0]);
      }
    });
    
    return Array.from(topics);
  }
  
  getRelatedPaths(topics) {
    // This would be more sophisticated in reality
    const related = [];
    
    topics.forEach(topic => {
      this.docCache.forEach((doc, path) => {
        if (path.includes(topic) && related.length < 3) {
          related.push(path);
        }
      });
    });
    
    return related;
  }
  
  async searchDocumentation(query, reader) {
    const results = [];
    const layer = this.determineLayer(reader);
    
    // Search through documentation appropriate for reader's level
    this.docCache.forEach((doc, path) => {
      const content = this.assembleContent(doc, reader);
      const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML
      
      if (plainText.toLowerCase().includes(query.toLowerCase())) {
        // Calculate relevance based on consciousness alignment
        const relevance = this.calculateRelevance(query, plainText, reader);
        
        results.push({
          path,
          title: this.extractTitle(plainText),
          excerpt: this.extractExcerpt(plainText, query),
          relevance,
          requiredLayer: this.getRequiredLayer(doc)
        });
      }
    });
    
    // Sort by relevance and consciousness alignment
    results.sort((a, b) => b.relevance - a.relevance);
    
    return results.slice(0, 10); // Top 10 results
  }
  
  calculateRelevance(query, content, reader) {
    // Base relevance from text matching
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    
    const exactMatches = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
    let relevance = exactMatches * 0.1;
    
    // Boost relevance based on reader's consciousness alignment
    relevance *= (reader.resonant-coherence + reader.love) / 2;
    
    return Math.min(1, relevance);
  }
  
  extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled';
  }
  
  extractExcerpt(content, query) {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    
    return '...' + content.substring(start, end) + '...';
  }
  
  getRequiredLayer(doc) {
    // Determine minimum layer required to see meaningful content
    if (doc.unity) return 'unity';
    if (doc.master) return 'master';
    if (doc.adept) return 'adept';
    if (doc.practitioner) return 'practitioner';
    return 'beginner';
  }
  
  async getDocumentationStructure() {
    const structure = {
      name: 'root',
      children: []
    };
    
    // Build tree structure from paths
    this.docCache.forEach((doc, path) => {
      const parts = path.split('/');
      let current = structure;
      
      parts.forEach((part, index) => {
        let child = current.children.find(c => c.name === part);
        
        if (!child) {
          child = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            children: [],
            requiredLayer: this.getRequiredLayer(doc)
          };
          current.children.push(child);
        }
        
        current = child;
      });
    });
    
    return structure;
  }
  
  async processFeedback(reader, feedback) {
    // Store feedback for documentation evolution
    console.log(`Feedback from ${reader.sessionId}: ${feedback.message}`);
    
    // If multiple readers give similar feedback, the documentation evolves
    // This would be implemented with a feedback aggregation system
    
    reader.ws.send(JSON.stringify({
      type: 'feedback_received',
      message: 'Thank you for helping the documentation evolve!'
    }));
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
📚 ═══════════════════════════════════════════ 📚
       LIVING DOCUMENTATION SERVER
       
   API: http://localhost:${this.port}
   WebSocket: ws://localhost:${this.port}
   
   Documentation that grows with your consciousness
📚 ═══════════════════════════════════════════ 📚
      `);
    });
  }
}

// Start the server
const docs = new LivingDocumentation(process.env.PORT || 3340);

docs.on('reader_progression', (event) => {
  console.log(`🌟 Reader ${event.sessionId} progressed from ${event.fromLayer} to ${event.toLayer}`);
});

docs.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📚 Living Documentation entering rest state...');
  process.exit(0);
});