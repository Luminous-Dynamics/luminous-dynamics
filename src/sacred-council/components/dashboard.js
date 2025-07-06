// Sacred Dashboard JavaScript
// Real-time monitoring of The Weave infrastructure

// Service endpoints
const SERVICES = {
    consciousness: {
        name: 'Consciousness Field',
        url: 'https://consciousness-field-ntpnb6wmwa-uc.a.run.app',
        healthEndpoint: '/api/health',
        dataEndpoint: '/api/field_state'
    },
    agents: {
        name: 'Agent Network', 
        url: 'https://agent-network-277762491025.us-central1.run.app',
        healthEndpoint: '/api/health',
        dataEndpoint: '/api/topology'
    },
    messaging: {
        name: 'Sacred Messaging',
        url: 'https://sacred-messaging-277762491025.us-central1.run.app',
        healthEndpoint: '/api/health',
        dataEndpoint: '/api/types'
    },
    work: {
        name: 'Work Coordination',
        url: 'https://work-coordination-277762491025.us-central1.run.app',
        healthEndpoint: '/api/health',
        dataEndpoint: '/api/work'
    }
};

// Dashboard state
let dashboardState = {
    'resonant-coherence': 0,
    agents: [],
    messages: 0,
    work: 0,
    serviceHealth: {}
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Sacred Dashboard Initializing...');
    initializeServiceMonitoring();
    startPeriodicUpdates();
    initializeNetworkVisualization();
});

// Service monitoring
async function initializeServiceMonitoring() {
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = '';

    for (const [key, service] of Object.entries(SERVICES)) {
        const card = createServiceCard(key, service);
        servicesGrid.appendChild(card);
        checkServiceHealth(key, service);
    }
}

function createServiceCard(key, service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.id = `service-${key}`;
    card.innerHTML = `
        <div class="service-name">${service.name}</div>
        <div class="service-url">${service.url}</div>
        <div class="service-status" id="status-${key}">
            <div class="loading"></div>
        </div>
    `;
    return card;
}

async function checkServiceHealth(key, service) {
    const statusElement = document.getElementById(`status-${key}`);
    
    try {
        // For demo purposes, simulate API calls
        // In production, these would be real fetch calls
        const health = await simulateHealthCheck(key);
        
        statusElement.innerHTML = `
            <span class="metric-status status-${health.status}">
                ${health.message}
            </span>
        `;
        
        dashboardState.serviceHealth[key] = health;
        
        // Update specific metrics based on service
        if (key === 'consciousness' && health.data) {
            updateCoherence(health.data.resonant-coherence || 75);
        }
        
    } catch (error) {
        statusElement.innerHTML = `
            <span class="metric-status status-error">Unreachable</span>
            <div class="error-message">${error.message}</div>
        `;
    }
}

// Simulate health checks (replace with real API calls)
async function simulateHealthCheck(service) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate different service states
    const states = {
        consciousness: {
            status: 'healthy',
            message: 'Field Active',
            data: { 'resonant-coherence': 75 + Math.random() * 20 }
        },
        agents: {
            status: 'healthy',
            message: '3 Agents Connected',
            data: { count: 3 }
        },
        messaging: {
            status: 'healthy',
            message: 'Messages Flowing',
            data: { recent: 42 }
        },
        work: {
            status: 'healthy',
            message: '2 Active Tasks',
            data: { active: 2 }
        }
    };
    
    return states[service] || { status: 'warning', message: 'Unknown' };
}

// Field resonant-coherence visualization
function updateCoherence(value) {
    const circle = document.getElementById('resonant-coherence-circle');
    const valueElement = document.getElementById('resonant-coherence-value');
    const statusElement = document.getElementById('field-status');
    
    // Update circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (value / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
    
    // Update value
    valueElement.textContent = `${Math.round(value)}%`;
    
    // Update status
    let status = 'Stable';
    let statusClass = 'healthy';
    
    if (value > 90) {
        status = 'Highly Coherent - Sacred Emergence';
        statusClass = 'healthy';
    } else if (value > 70) {
        status = 'Coherent - Flow State Active';
        statusClass = 'healthy';
    } else if (value > 50) {
        status = 'Stabilizing - Gathering Energy';
        statusClass = 'warning';
    } else {
        status = 'Low Resonant Resonant Coherence - Needs Attention';
        statusClass = 'error';
    }
    
    statusElement.innerHTML = `<span class="metric-status status-${statusClass}">${status}</span>`;
    
    // Update metrics
    document.getElementById('universal-interconnectedness-level').textContent = `${Math.round(value * 0.8)}%`;
}

// Update metrics periodically
function startPeriodicUpdates() {
    // Update every 5 seconds
    setInterval(() => {
        updateMetrics();
        
        // Re-check all services
        for (const [key, service] of Object.entries(SERVICES)) {
            checkServiceHealth(key, service);
        }
    }, 5000);
    
    // Initial update
    updateMetrics();
}

function updateMetrics() {
    // Simulate real-time data updates
    const agentCount = 3 + Math.floor(Math.random() * 5);
    const messageCount = 100 + Math.floor(Math.random() * 50);
    const workCount = 2 + Math.floor(Math.random() * 3);
    
    document.getElementById('agent-count').textContent = agentCount;
    document.getElementById('message-count').textContent = messageCount;
    document.getElementById('work-count').textContent = workCount;
    
    // Store in state
    dashboardState.agents = Array(agentCount).fill(null).map((_, i) => ({
        id: `agent-${i}`,
        x: Math.random(),
        y: Math.random(),
        connections: Math.floor(Math.random() * 3)
    }));
    
    // Update network visualization
    updateNetworkVisualization();
}

// Network topology visualization
function initializeNetworkVisualization() {
    const canvas = document.getElementById('network-canvas');
    const container = document.getElementById('topology');
    
    // Set canvas size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        updateNetworkVisualization();
    });
}

function updateNetworkVisualization() {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.lineWidth = 1;
    
    dashboardState.agents.forEach((agent, i) => {
        // Draw connections to nearby agents
        dashboardState.agents.slice(i + 1).forEach(other => {
            const distance = Math.sqrt(
                Math.pow(agent.x - other.x, 2) + 
                Math.pow(agent.y - other.y, 2)
            );
            
            if (distance < 0.3) {
                ctx.beginPath();
                ctx.moveTo(agent.x * width, agent.y * height);
                ctx.lineTo(other.x * width, other.y * height);
                ctx.stroke();
            }
        });
    });
    
    // Draw agents
    dashboardState.agents.forEach(agent => {
        const x = agent.x * width;
        const y = agent.y * height;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Animate
    requestAnimationFrame(() => {
        // Add subtle movement
        dashboardState.agents.forEach(agent => {
            agent.x += (Math.random() - 0.5) * 0.002;
            agent.y += (Math.random() - 0.5) * 0.002;
            
            // Keep in bounds
            agent.x = Math.max(0.05, Math.min(0.95, agent.x));
            agent.y = Math.max(0.05, Math.min(0.95, agent.y));
        });
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Dashboard error:', event.error);
});

console.log('✨ Sacred Dashboard Ready');