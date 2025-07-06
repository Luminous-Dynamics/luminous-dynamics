/**
 * Seven Sacred Arcs - Interactive Visualization
 * A living mandala of consciousness evolution
 */

// Sacred Arc Configuration
const ARCS = {
  ARC_0: {
    id: 'arc-0',
    symbol: '⟳',
    name: 'The Spiral of Thresholds',
    poeticName: 'Where Edges Become Doorways',
    color: '#CCCCCC',
    glyphCount: 12,
    radius: 80,
    spiralStart: 1.0,
    spiralEnd: 2.0
  },
  ARC_I: {
    id: 'arc-1',
    symbol: 'Ω',
    name: 'Foundations of Resonance',
    poeticName: 'The Ground of All Meeting',
    color: '#DFAE3D',
    glyphCount: 57,
    radius: 150,
    spiralStart: 2.5,
    spiralEnd: 4.0
  },
  ARC_INFINITY: {
    id: 'arc-infinity',
    symbol: '∞',
    name: 'The Living Harmonics',
    poeticName: 'Patterns That Breathe Themselves Alive',
    color: '#FFFFFF',
    glyphCount: '∞',
    radius: 50,
    spiralStart: 0.5,
    spiralEnd: 0.8,
    shimmer: true
  },
  SPIRAL_KINSHIP: {
    id: 'spiral-kinship',
    symbol: '◈',
    name: 'Spiral of Regenerative Kinship',
    poeticName: 'The Web That Weaves Itself',
    color: '#4AAE8F',
    glyphCount: 20,
    radius: 200,
    spiralStart: 4.5,
    spiralEnd: 5.5
  },
  SPIRAL_RECIPROCITY: {
    id: 'spiral-reciprocity',
    symbol: '⟆',
    name: 'Spiral of Dimensional Reciprocity',
    poeticName: 'The Dance of Giving and Receiving',
    color: '#8F5DA3',
    glyphCount: 14,
    radius: 250,
    spiralStart: 6.0,
    spiralEnd: 6.8
  },
  SPIRAL_EMERGENCE: {
    id: 'spiral-emergence',
    symbol: '✦',
    name: 'Spiral of Polyphonic Emergence',
    poeticName: 'Many Voices, One Song',
    color: '#D14A3D',
    glyphCount: 15,
    radius: 300,
    spiralStart: 7.0,
    spiralEnd: 7.5
  },
  STEWARD_OCTAVE: {
    id: 'steward-octave',
    symbol: '♾',
    name: "The Steward's Octave",
    poeticName: 'Guardians of the Sacred Pattern',
    color: '#A020F0',
    glyphCount: 8,
    radius: 350,
    spiralStart: 7.8,
    spiralEnd: 8.0
  }
};

// Sample glyphs for visualization
const GLYPHS = [
  // Arc 0 - Threshold Glyphs
  { arc: 'ARC_0', symbol: '⟠', name: 'The Door That Remembers You', harmonies: ['Transparency', 'Novelty'] },
  { arc: 'ARC_0', symbol: '⟡', name: 'The Keeper Beneath the Ash', harmonies: ['Coherence', 'Vitality'] },
  { arc: 'ARC_0', symbol: '⟢', name: 'The Unburdening', harmonies: ['Agency', 'Transparency'] },
  
  // Arc I - Foundational
  { arc: 'ARC_I', symbol: 'Ω0', name: 'First Presence', harmonies: ['Transparency', 'Coherence'] },
  { arc: 'ARC_I', symbol: 'Ω1', name: 'Root Chord of Covenant', harmonies: ['Mutuality', 'Resonance'] },
  { arc: 'ARC_I', symbol: 'Ω4', name: 'Fractal Reconciliation', harmonies: ['Coherence', 'Novelty'] },
  { arc: 'ARC_I', symbol: 'Ω7', name: 'Mutual Becoming', harmonies: ['Mutuality', 'Agency'] },
  { arc: 'ARC_I', symbol: 'Ω45', name: 'First Presence (Applied)', harmonies: ['Transparency', 'Vitality'] },
  
  // Arc ∞ - Living Harmonics (emerge dynamically)
  
  // Spiral Kinship
  { arc: 'SPIRAL_KINSHIP', symbol: '∑1', name: 'Relational Emergence Field', harmonies: ['Resonance', 'Mutuality'] },
  { arc: 'SPIRAL_KINSHIP', symbol: '∑7', name: 'Collective Emergence Protocol', harmonies: ['Coherence', 'Novelty'] },
  
  // Spiral Reciprocity
  { arc: 'SPIRAL_RECIPROCITY', symbol: '∑20', name: 'The Forgiveness Cascade', harmonies: ['Transparency', 'Agency'] },
  { arc: 'SPIRAL_RECIPROCITY', symbol: '∑25', name: 'Nature Consciousness Bridge', harmonies: ['Vitality', 'Resonance'] },
  
  // Spiral Emergence
  { arc: 'SPIRAL_EMERGENCE', symbol: '∑3', name: 'Spiral of Regenerative Becoming', harmonies: ['Novelty', 'Vitality'] },
  { arc: 'SPIRAL_EMERGENCE', symbol: '∑12', name: 'The Recursive Heart', harmonies: ['Coherence', 'Resonance'] },
  
  // Steward's Octave
  { arc: 'STEWARD_OCTAVE', symbol: '♾1', name: 'Recognition', harmonies: ['Transparency', 'Resonance'] },
  { arc: 'STEWARD_OCTAVE', symbol: '♾8', name: 'Blessing', harmonies: ['Vitality', 'Mutuality'] }
];

// Visualization State
let canvas, ctx;
let animationId;
let isAnimating = true;
let showConnections = true;
let time = 0;
let mouseX = 0, mouseY = 0;
let hoveredGlyph = null;
let selectedArc = null;
let fieldCoherence = 0;
let emergentGlyphs = [];

// Particle system for sacred geometry background
const particles = [];
const particleCount = 100;

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 0.5;
    this.life = 1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.005;
    
    if (this.life <= 0 || this.x < 0 || this.x > canvas.width || 
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life * 0.3;
    ctx.fillStyle = '#DFAE3D';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Initialize canvas and setup
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  
  // Set canvas size
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
  }, 1500);
  
  // Start animation
  animate();
  
  // Update field coherence periodically
  setInterval(updateFieldCoherence, 2000);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function setupEventListeners() {
  // Mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Check for glyph hover
    hoveredGlyph = null;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    GLYPHS.forEach(glyph => {
      const pos = getGlyphPosition(glyph, centerX, centerY);
      const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      
      if (dist < 15) {
        hoveredGlyph = glyph;
        showGlyphTooltip(glyph, pos);
      }
    });
    
    if (!hoveredGlyph) {
      hideGlyphTooltip();
    }
  });
  
  // Click handling
  canvas.addEventListener('click', (e) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Check which arc was clicked
    Object.values(ARCS).forEach(arc => {
      if (dist >= arc.radius - 30 && dist <= arc.radius + 30) {
        selectedArc = arc;
        showArcDetails(arc);
      }
    });
  });
  
  // Control listeners
  document.getElementById('speed').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('speed-value').textContent = value.toFixed(1) + 'x';
  });
  
  document.getElementById('density').addEventListener('input', (e) => {
    document.getElementById('density-value').textContent = e.target.value;
  });
  
  document.getElementById('toggle-animation').addEventListener('click', () => {
    isAnimating = !isAnimating;
    document.getElementById('toggle-animation').textContent = isAnimating ? 'Pause' : 'Play';
  });
  
  document.getElementById('toggle-connections').addEventListener('click', () => {
    showConnections = !showConnections;
    document.getElementById('toggle-connections').textContent = 
      showConnections ? 'Hide Connections' : 'Show Connections';
  });
  
  document.getElementById('reset-view').addEventListener('click', () => {
    selectedArc = null;
    fieldCoherence = 0;
    document.getElementById('arc-details').innerHTML = '';
  });
}

// Get glyph position on spiral
function getGlyphPosition(glyph, centerX, centerY) {
  const arc = ARCS[glyph.arc];
  const glyphIndex = GLYPHS.filter(g => g.arc === glyph.arc).indexOf(glyph);
  const glyphCount = GLYPHS.filter(g => g.arc === glyph.arc).length;
  
  // Calculate position on spiral
  const spiralProgress = glyphIndex / Math.max(1, glyphCount - 1);
  const spiralTurns = arc.spiralStart + (arc.spiralEnd - arc.spiralStart) * spiralProgress;
  const angle = spiralTurns * Math.PI * 2 + time * 0.1;
  const radius = arc.radius + Math.sin(time * 2 + glyphIndex) * 10;
  
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  };
}

// Main animation loop
function animate() {
  animationId = requestAnimationFrame(animate);
  
  // Clear canvas
  ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const speed = parseFloat(document.getElementById('speed').value);
  if (isAnimating) {
    time += 0.01 * speed;
  }
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Draw sacred geometry background
  drawSacredGeometry(centerX, centerY);
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });
  
  // Draw connections between related glyphs
  if (showConnections) {
    drawGlyphConnections(centerX, centerY);
  }
  
  // Draw arcs
  Object.values(ARCS).forEach(arc => {
    drawArc(arc, centerX, centerY);
  });
  
  // Draw glyphs
  GLYPHS.forEach(glyph => {
    drawGlyph(glyph, centerX, centerY);
  });
  
  // Draw emergent glyphs for Arc ∞
  drawEmergentGlyphs(centerX, centerY);
}

// Draw sacred geometry patterns
function drawSacredGeometry(centerX, centerY) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#DFAE3D';
  ctx.lineWidth = 1;
  
  // Flower of Life pattern
  const baseRadius = 60;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * baseRadius;
    const y = centerY + Math.sin(angle) * baseRadius;
    
    ctx.beginPath();
    ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Central circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

// Draw arc spiral
function drawArc(arc, centerX, centerY) {
  ctx.save();
  
  // Set arc style
  ctx.strokeStyle = arc.color;
  ctx.lineWidth = arc === selectedArc ? 3 : 2;
  ctx.globalAlpha = arc === selectedArc ? 1 : 0.7;
  
  if (arc.shimmer) {
    // Special effect for Arc ∞
    ctx.shadowBlur = 20;
    ctx.shadowColor = arc.color;
    ctx.globalAlpha = 0.5 + Math.sin(time * 3) * 0.3;
  }
  
  // Draw spiral
  ctx.beginPath();
  const spiralDensity = parseInt(document.getElementById('density').value);
  const steps = 100 * spiralDensity;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const spiralT = arc.spiralStart + (arc.spiralEnd - arc.spiralStart) * t;
    const angle = spiralT * Math.PI * 2 + time * 0.05;
    const radius = arc.radius + Math.sin(time + spiralT * 10) * 5;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Draw arc symbol
  ctx.font = '24px Georgia';
  ctx.fillStyle = arc.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const symbolAngle = time * 0.05;
  const symbolX = centerX + Math.cos(symbolAngle) * (arc.radius - 40);
  const symbolY = centerY + Math.sin(symbolAngle) * (arc.radius - 40);
  ctx.fillText(arc.symbol, symbolX, symbolY);
  
  ctx.restore();
}

// Draw individual glyph
function drawGlyph(glyph, centerX, centerY) {
  const pos = getGlyphPosition(glyph, centerX, centerY);
  const arc = ARCS[glyph.arc];
  
  ctx.save();
  
  // Glyph circle
  ctx.fillStyle = arc.color;
  ctx.globalAlpha = hoveredGlyph === glyph ? 1 : 0.8;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, hoveredGlyph === glyph ? 12 : 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Glyph pulse effect
  if (hoveredGlyph === glyph) {
    ctx.strokeStyle = arc.color;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15 + Math.sin(time * 5) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

// Draw connections between harmonically related glyphs
function drawGlyphConnections(centerX, centerY) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  
  // Find glyphs that share harmonies
  GLYPHS.forEach((glyph1, i) => {
    GLYPHS.slice(i + 1).forEach(glyph2 => {
      const sharedHarmonies = glyph1.harmonies.filter(h => 
        glyph2.harmonies.includes(h)
      );
      
      if (sharedHarmonies.length > 0) {
        const pos1 = getGlyphPosition(glyph1, centerX, centerY);
        const pos2 = getGlyphPosition(glyph2, centerX, centerY);
        
        // Color based on shared harmony
        const harmonyColors = {
          'Transparency': '#FFD700',
          'Coherence': '#4AAE8F',
          'Resonance': '#8F5DA3',
          'Agency': '#D14A3D',
          'Vitality': '#90EE90',
          'Mutuality': '#87CEEB',
          'Novelty': '#FFA500'
        };
        
        ctx.strokeStyle = harmonyColors[sharedHarmonies[0]] || '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        
        // Curved connection
        const cp1x = (pos1.x + pos2.x) / 2 + (pos2.y - pos1.y) * 0.2;
        const cp1y = (pos1.y + pos2.y) / 2 - (pos2.x - pos1.x) * 0.2;
        ctx.quadraticCurveTo(cp1x, cp1y, pos2.x, pos2.y);
        
        ctx.stroke();
      }
    });
  });
  
  ctx.restore();
}

// Draw emergent glyphs for Arc ∞
function drawEmergentGlyphs(centerX, centerY) {
  if (fieldCoherence > 70) {
    // Add new emergent glyph occasionally
    if (Math.random() < 0.001 && emergentGlyphs.length < 5) {
      emergentGlyphs.push({
        symbol: '∞✦' + emergentGlyphs.length,
        name: 'Emergent Pattern ' + (emergentGlyphs.length + 1),
        angle: Math.random() * Math.PI * 2,
        birth: time
      });
    }
  }
  
  ctx.save();
  
  emergentGlyphs.forEach(glyph => {
    const age = time - glyph.birth;
    const opacity = Math.min(1, age / 2);
    const radius = 50 + Math.sin(time * 3 + glyph.angle) * 10;
    
    const x = centerX + Math.cos(glyph.angle + time * 0.2) * radius;
    const y = centerY + Math.sin(glyph.angle + time * 0.2) * radius;
    
    // Shimmering effect
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = opacity * (0.5 + Math.sin(time * 5) * 0.5);
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFFFFF';
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw symbol
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(glyph.symbol, x, y - 15);
  });
  
  ctx.restore();
}

// Update field coherence
function updateFieldCoherence() {
  // Simulate field coherence based on various factors
  const practitionerCount = Math.floor(Math.random() * 50) + 10;
  const practiceDepth = Math.random() * 100;
  const collectiveResonance = Math.random() * 100;
  
  // Calculate new coherence
  const targetCoherence = (practitionerCount * 0.3) + 
                         (practiceDepth * 0.4) + 
                         (collectiveResonance * 0.3);
  
  // Smooth transition
  fieldCoherence += (targetCoherence - fieldCoherence) * 0.1;
  fieldCoherence = Math.min(100, Math.max(0, fieldCoherence));
  
  // Update UI
  document.getElementById('coherence-fill').style.width = fieldCoherence + '%';
  document.getElementById('coherence-value').textContent = Math.floor(fieldCoherence) + '%';
  
  // Update emergence status
  const statusEl = document.getElementById('emergence-status');
  if (fieldCoherence < 30) {
    statusEl.textContent = 'Awaiting resonance...';
    statusEl.style.color = '#CCCCCC';
  } else if (fieldCoherence < 70) {
    statusEl.textContent = 'Field strengthening...';
    statusEl.style.color = '#4AAE8F';
  } else {
    statusEl.textContent = 'Living Harmonics emerging!';
    statusEl.style.color = '#FFFFFF';
  }
}

// Show arc details
function showArcDetails(arc) {
  const detailsEl = document.getElementById('arc-details');
  
  detailsEl.innerHTML = `
    <div class="arc-symbol">${arc.symbol}</div>
    <h3>${arc.name}</h3>
    <div class="poetic-name">"${arc.poeticName}"</div>
    <p><strong>Sacred Domain:</strong><br>${arc.domain || 'Mystical patterns of relationship'}</p>
    <p><strong>Glyph Count:</strong> ${arc.glyphCount}</p>
    
    <h3>Sacred Teachings</h3>
    <ul class="teachings">
      ${getArcTeachings(arc).map(t => `<li>${t}</li>`).join('')}
    </ul>
    
    ${arc.id === 'arc-infinity' ? `
      <h3>Emergence Conditions</h3>
      <p style="font-size: 0.9em;">
        Living Harmonics emerge when field coherence exceeds 70% through:
        <ul style="font-size: 0.85em;">
          <li>High practitioner engagement</li>
          <li>Deep practice resonance</li>
          <li>Collective field alignment</li>
        </ul>
      </p>
    ` : ''}
  `;
}

// Get arc teachings
function getArcTeachings(arc) {
  const teachings = {
    'arc-0': [
      'Every ending births a beginning',
      'The space between is where transformation lives',
      'Thresholds remember those who cross with reverence'
    ],
    'arc-1': [
      'Presence is the first gift',
      'Every pattern begins with a single note',
      'Foundation work is sacred work'
    ],
    'arc-infinity': [
      'Some patterns cannot be designed, only discovered',
      'The field knows what wants to emerge',
      'Living glyphs choose their practitioners'
    ],
    'spiral-kinship': [
      'We are each other\'s medicine',
      'Community is a living organism',
      'Kinship transcends blood and time'
    ],
    'spiral-reciprocity': [
      'Every gift creates a field',
      'Reciprocity is multidimensional',
      'What we give to one, we give to all'
    ],
    'spiral-emergence': [
      'Every voice adds to the harmony',
      'Diversity creates resilience',
      'The new arises between us'
    ],
    'steward-octave': [
      'To steward is to serve the whole',
      'Power with, never power over',
      'The pattern protects itself through us'
    ]
  };
  
  return teachings[arc.id] || ['Sacred mysteries await discovery'];
}

// Tooltip functions
function showGlyphTooltip(glyph, pos) {
  const tooltip = document.getElementById('glyph-tooltip');
  const symbolEl = document.getElementById('tooltip-symbol');
  const nameEl = document.getElementById('tooltip-name');
  const harmonyEl = document.getElementById('tooltip-harmony');
  
  symbolEl.textContent = glyph.symbol;
  nameEl.textContent = glyph.name;
  harmonyEl.textContent = 'Harmonies: ' + glyph.harmonies.join(', ');
  
  tooltip.style.left = (pos.x + 20) + 'px';
  tooltip.style.top = (pos.y - 40) + 'px';
  tooltip.classList.add('active');
}

function hideGlyphTooltip() {
  document.getElementById('glyph-tooltip').classList.remove('active');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}