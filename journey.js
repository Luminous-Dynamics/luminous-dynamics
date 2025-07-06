// Journey through sacred practices
class JourneyOfPresence {
    constructor() {
        this.practices = {
            'first-presence': {
                name: 'First Presence',
                symbol: 'Ω0',
                duration: 60000,
                steps: [
                    { text: 'breathe in', delay: 0 },
                    { text: 'breathe out', delay: 4000 },
                    { text: 'breathe in', delay: 8000 },
                    { text: 'breathe out', delay: 12000 },
                    { text: 'notice', delay: 16000 },
                    { text: 'you are here', delay: 20000 },
                    { text: 'nowhere else to be', delay: 26000 },
                    { text: 'just this breath', delay: 34000 },
                    { text: 'just this moment', delay: 42000 },
                    { text: 'welcome', delay: 50000 },
                    { text: 'First Presence • Ω0 • The Shimmering Unnamed', delay: 56000, final: true }
                ]
            },
            'sacred-listening': {
                name: 'Sacred Listening',
                symbol: 'Ω4',
                duration: 60000,
                steps: [
                    { text: 'listen', delay: 0 },
                    { text: 'what do you hear?', delay: 4000 },
                    { text: 'beyond the sounds', delay: 10000 },
                    { text: 'listen deeper', delay: 16000 },
                    { text: 'hear the silence', delay: 22000 },
                    { text: 'between sounds', delay: 28000 },
                    { text: 'hear your heartbeat', delay: 34000 },
                    { text: 'hear your breath', delay: 40000 },
                    { text: 'everything speaks', delay: 46000 },
                    { text: 'when we truly listen', delay: 52000 },
                    { text: 'Sacred Listening • Ω4 • The Pulse of Repair', delay: 56000, final: true }
                ]
            },
            'sacred-pause': {
                name: 'The Sacred Pause',
                symbol: 'Ω15',
                duration: 60000,
                steps: [
                    { text: 'feel this moment', delay: 0 },
                    { text: 'before you respond', delay: 6000 },
                    { text: 'pause', delay: 12000 },
                    { text: '', delay: 16000 }, // actual pause
                    { text: 'in the space between', delay: 24000 },
                    { text: 'stimulus and response', delay: 30000 },
                    { text: 'lives your freedom', delay: 36000 },
                    { text: 'pause', delay: 42000 },
                    { text: '', delay: 46000 }, // another pause
                    { text: 'this sacred space', delay: 52000 },
                    { text: 'The Sacred Pause • Ω15 • The Space Between', delay: 56000, final: true }
                ]
            },
            'remembered-weight': {
                name: 'The Remembered Weight',
                symbol: '⟡',
                duration: 60000,
                steps: [
                    { text: 'place your hand on your heart', delay: 0 },
                    { text: 'feel what you carry', delay: 6000 },
                    { text: 'some weight is not yours alone', delay: 12000 },
                    { text: 'it belongs to those before', delay: 18000 },
                    { text: 'let it be heavy for a moment', delay: 24000 },
                    { text: 'now let it teach you', delay: 32000 },
                    { text: 'this weight has wisdom', delay: 38000 },
                    { text: 'it knows how to transform', delay: 44000 },
                    { text: 'into strength', delay: 50000 },
                    { text: 'The Remembered Weight • ⟡ • Ancestral Healing', delay: 56000, final: true }
                ]
            }
        };
        
        this.currentPractice = null;
        this.completedPractices = new Set();
        this.practiceTimers = [];
        
        this.init();
    }
    
    init() {
        // Load completed practices from localStorage
        const saved = localStorage.getItem('journey-completed');
        if (saved) {
            this.completedPractices = new Set(JSON.parse(saved));
        }
        
        // Set up portal clicks
        document.querySelectorAll('.portal').forEach(portal => {
            portal.addEventListener('click', () => this.handlePortalClick(portal));
        });
        
        // Update portal states
        this.updatePortalStates();
        
        // Show current practice name on hover
        document.querySelectorAll('.portal').forEach(portal => {
            portal.addEventListener('mouseenter', () => {
                const practiceId = portal.dataset.practice;
                if (!portal.classList.contains('locked')) {
                    document.querySelector('.current-practice').textContent = 
                        this.practices[practiceId].name;
                }
            });
            
            portal.addEventListener('mouseleave', () => {
                document.querySelector('.current-practice').textContent = '';
            });
        });
    }
    
    handlePortalClick(portal) {
        if (portal.classList.contains('locked')) return;
        
        const practiceId = portal.dataset.practice;
        this.startPractice(practiceId);
    }
    
    startPractice(practiceId) {
        const practice = this.practices[practiceId];
        if (!practice) return;
        
        this.currentPractice = practiceId;
        
        // Show practice container
        const container = document.getElementById(practiceId);
        container.classList.add('active');
        
        // Clear any existing timers
        this.clearTimers();
        
        // Run through the practice steps
        const textElement = container.querySelector('.practice-text');
        
        practice.steps.forEach(step => {
            const timer = setTimeout(() => {
                textElement.style.animation = 'none';
                void textElement.offsetWidth; // Trigger reflow
                textElement.style.animation = 'fade-in 2s ease forwards';
                textElement.textContent = step.text;
                
                if (step.final) {
                    this.completePractice(practiceId);
                }
            }, step.delay);
            
            this.practiceTimers.push(timer);
        });
        
        // Auto-close after duration
        const closeTimer = setTimeout(() => {
            this.closePractice();
        }, practice.duration);
        
        this.practiceTimers.push(closeTimer);
    }
    
    completePractice(practiceId) {
        this.completedPractices.add(practiceId);
        localStorage.setItem('journey-completed', 
            JSON.stringify([...this.completedPractices]));
        
        // Show completion message
        const message = document.querySelector('.completion-message');
        message.textContent = 'Practice completed. Touch to continue...';
        message.classList.add('show');
        
        // Add click to close
        const container = document.getElementById(practiceId);
        container.addEventListener('click', () => this.closePractice(), { once: true });
    }
    
    closePractice() {
        // Hide all practice containers
        document.querySelectorAll('.practice-container').forEach(container => {
            container.classList.remove('active');
        });
        
        // Hide completion message
        const message = document.querySelector('.completion-message');
        message.classList.remove('show');
        
        // Clear timers
        this.clearTimers();
        
        // Update portal states
        this.updatePortalStates();
        
        this.currentPractice = null;
    }
    
    clearTimers() {
        this.practiceTimers.forEach(timer => clearTimeout(timer));
        this.practiceTimers = [];
    }
    
    updatePortalStates() {
        const portals = document.querySelectorAll('.portal');
        const practiceOrder = ['first-presence', 'sacred-listening', 'sacred-pause', 'remembered-weight'];
        
        portals.forEach((portal, index) => {
            const practiceId = portal.dataset.practice;
            
            // Remove all states
            portal.classList.remove('active', 'completed', 'locked');
            
            if (this.completedPractices.has(practiceId)) {
                portal.classList.add('completed');
            } else if (index === 0 || this.completedPractices.has(practiceOrder[index - 1])) {
                // First portal or previous completed
                portal.classList.add('active');
            } else {
                portal.classList.add('locked');
            }
        });
    }
}

// Initialize journey when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JourneyOfPresence();
});

// Prevent scroll on mobile
document.addEventListener('touchmove', (e) => {
    if (document.querySelector('.practice-container.active')) {
        e.preventDefault();
    }
}, { passive: false });