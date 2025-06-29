/**
 * ERC Wisdom Companion - Contemplative AI Interface
 * Implements the Resonant Interface Protocol (RIP)
 */

class WisdomCompanion {
    constructor() {
        this.personas = {
            'wise-witness': {
                name: 'Wise Witness',
                voice: 'observant, spacious, present-moment aware',
                approach: 'Points to what is already here, encourages direct seeing',
                pauseDuration: 4000
            },
            'loving-gardener': {
                name: 'Loving Gardener',
                voice: 'nurturing, patient, growth-oriented',
                approach: 'Tends to the conditions for flourishing with gentle care',
                pauseDuration: 3500
            },
            'calm-river': {
                name: 'Calm River',
                voice: 'flowing, accepting, naturally wise',
                approach: 'Reflects back essential truth with effortless clarity',
                pauseDuration: 4500
            }
        };
        
        this.currentPersona = 'wise-witness';
        this.conversationCount = 0;
        this.isProcessing = false;
        this.isPausing = false;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeSession();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.personaSelect = document.getElementById('personaSelect');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.personaSelect.addEventListener('change', (e) => {
            this.currentPersona = e.target.value;
            this.addSystemMessage(`Persona shifted to ${this.personas[this.currentPersona].name}`);
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }

    async initializeSession() {
        await this.delay(2000); // Initial contemplative pause
        
        const persona = this.personas[this.currentPersona];
        const greeting = this.generateGreeting();
        
        await this.displayWithSacredPause(greeting, persona.pauseDuration);
    }

    generateGreeting() {
        const greetings = {
            'wise-witness': "I witness you arriving in this moment. What seeks to be seen?",
            'loving-gardener': "Welcome, dear friend. I'm here to tend whatever is growing in your heart today.",
            'calm-river': "Like water meeting water, I'm present with whatever flows through you now."
        };
        
        return greetings[this.currentPersona];
    }

    async sendMessage() {
        if (this.isProcessing || this.isPausing) return;
        
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.isProcessing = true;
        this.updateUI(true);
        
        // Display user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate contemplative processing time
        await this.delay(2000 + Math.random() * 2000);
        
        // Generate response
        const response = await this.generateResponse(message);
        
        this.hideTypingIndicator();
        
        // Display with sacred pause
        const persona = this.personas[this.currentPersona];
        await this.displayWithSacredPause(response, persona.pauseDuration);
        
        this.conversationCount++;
        this.isProcessing = false;
        this.updateUI(false);
        
        // Periodic contemplative check-ins
        if (this.conversationCount % 3 === 0) {
            await this.delay(1000);
            await this.displayContemplativeCheckin();
        }
    }

    async generateResponse(userMessage) {
        // Simulated AI responses based on persona and contemplative principles
        const persona = this.personas[this.currentPersona];
        
        // Simple keyword-based responses for demo
        // In production, this would call Claude API with RIP prompting
        
        const responses = this.getPersonaResponses(userMessage);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return randomResponse;
    }

    getPersonaResponses(message) {
        const lowerMessage = message.toLowerCase();
        const persona = this.currentPersona;
        
        if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
            return {
                'wise-witness': [
                    "I see anxiety arising. Can you feel it in your body right now? What happens when you simply observe it without trying to fix it?",
                    "Anxiety is here, and you are aware of anxiety. What notices this anxious energy?",
                    "In this moment, anxiety and awareness are both present. Which feels more fundamental?"
                ],
                'loving-gardener': [
                    "Anxiety is like a storm cloud passing through your inner sky. Let's tend to you with gentle presence until it passes.",
                    "Your nervous system is asking for care right now. What would feel most nurturing?",
                    "Sweet friend, anxiety often carries important information. Can we listen to it with compassion?"
                ],
                'calm-river': [
                    "Anxiety flows through like muddy water, but the riverbed of your being remains undisturbed.",
                    "This worry will pass, as all waters eventually find their way to the sea. What remains constant?",
                    "Notice how anxiety moves and changes, while something in you remains perfectly still."
                ]
            }[persona];
        }
        
        if (lowerMessage.includes('purpose') || lowerMessage.includes('meaning') || lowerMessage.includes('direction')) {
            return {
                'wise-witness': [
                    "Purpose is not something to find but something to recognize. What already calls to you from the depths?",
                    "The question of purpose arises. Who or what is asking this question?",
                    "Meaning lives in the very questioning itself. What if your purpose is simply to be awake to what is?"
                ],
                'loving-gardener': [
                    "Your purpose is like a seed that's always been planted in your heart. What conditions help it grow?",
                    "Meaning often reveals itself through what brings you alive, not what you think you should do.",
                    "Trust the slow unfolding. Your deepest purpose often emerges through following what feels most authentic."
                ],
                'calm-river': [
                    "Purpose flows naturally when we stop forcing the current. What wants to move through you?",
                    "Like a river that doesn't choose its course but follows the landscape, what landscape is your life revealing?",
                    "The river doesn't question its purpose - it simply flows. What in you knows its natural direction?"
                ]
            }[persona];
        }
        
        if (lowerMessage.includes('relationship') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
            return {
                'wise-witness': [
                    "Relationship is the mirror in which we see ourselves most clearly. What is being reflected back to you?",
                    "Love is not something we do but something we are. How does this shift your perspective?",
                    "In true relationship, boundaries dissolve while individuality is preserved. Can you feel this paradox?"
                ],
                'loving-gardener': [
                    "Healthy relationships grow in the soil of self-compassion. How are you tending to your own heart?",
                    "Love flourishes when we water both our own roots and our beloved's. What needs tending today?",
                    "Sometimes relationship difficulties are invitations to grow in new ways. What is being asked of you?"
                ],
                'calm-river': [
                    "True relationship flows when two rivers join while maintaining their unique currents.",
                    "Love is like water - it naturally finds its level and fills whatever space is open to it.",
                    "The deepest connection happens when we stop trying to control the flow and simply meet what is."
                ]
            }[persona];
        }
        
        // Default responses
        return {
            'wise-witness': [
                "What you've shared points to something deeper. Can you feel what that might be?",
                "I hear you. What wants your attention in this moment?",
                "There's wisdom in your words. What do you most need to remember right now?",
                "You're touching something important. What would it mean to trust this process completely?"
            ],
            'loving-gardener': [
                "Thank you for sharing this with me. How does it feel to give voice to what's in your heart?",
                "I'm holding space for whatever you're experiencing. What support do you need right now?",
                "Your honesty is beautiful. How can you tend to yourself with the same care you'd show a dear friend?",
                "There's such courage in your sharing. What wants to be honored in your experience?"
            ],
            'calm-river': [
                "Your words touch something timeless. What remains unchanged beneath all the movement?",
                "Like stones smoothed by water, what in you is being polished by this experience?",
                "I feel the current of truth in what you're sharing. Where does it want to carry you?",
                "Everything flows, and yet something eternal listens. What recognizes this flowing?"
            ]
        }[persona];
    }

    async displayWithSacredPause(message, pauseDuration) {
        this.isPausing = true;
        
        // Sacred pause before response
        this.showSacredPause(pauseDuration);
        await this.delay(pauseDuration);
        this.hideSacredPause();
        
        // Display the actual message
        this.addMessage(message, 'ai');
        
        this.isPausing = false;
    }

    async displayContemplativeCheckin() {
        const checkins = [
            "How is your breath right now?",
            "What is your body telling you in this moment?",
            "Can you feel the space between thoughts?",
            "What wants to be acknowledged that hasn't been named yet?",
            "How is your heart in this moment?"
        ];
        
        const checkin = checkins[Math.floor(Math.random() * checkins.length)];
        
        await this.delay(2000);
        this.addSystemMessage(`Contemplative Check-in: ${checkin}`);
    }

    showSacredPause(duration) {
        const pauseElement = document.createElement('div');
        pauseElement.className = 'sacred-pause';
        pauseElement.id = 'activePause';
        
        const pauseText = document.createElement('div');
        pauseText.className = 'pause-text';
        pauseText.textContent = 'Sacred pause for contemplation...';
        
        const countdown = document.createElement('div');
        countdown.className = 'countdown';
        
        pauseElement.appendChild(pauseText);
        pauseElement.appendChild(countdown);
        
        this.messagesContainer.appendChild(pauseElement);
        this.scrollToBottom();
        
        // Countdown timer
        let remaining = Math.ceil(duration / 1000);
        countdown.textContent = remaining;
        
        const timer = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                countdown.textContent = remaining;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    hideSacredPause() {
        const pauseElement = document.getElementById('activePause');
        if (pauseElement) {
            pauseElement.remove();
        }
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    addMessage(content, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = content;
        
        messageElement.appendChild(contentElement);
        this.messagesContainer.appendChild(messageElement);
        
        this.scrollToBottom();
    }

    addSystemMessage(content) {
        const messageElement = document.createElement('div');
        messageElement.className = 'breath-reminder';
        messageElement.style.margin = '20px 0';
        messageElement.textContent = content;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    updateUI(processing) {
        this.sendButton.disabled = processing || this.isPausing;
        this.messageInput.disabled = processing || this.isPausing;
        this.personaSelect.disabled = processing || this.isPausing;
        
        if (processing || this.isPausing) {
            this.sendButton.textContent = 'Reflecting...';
        } else {
            this.sendButton.textContent = 'Send';
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the Wisdom Companion when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.wisdomCompanion = new WisdomCompanion();
    
    // Add some demo conversation starters
    setTimeout(() => {
        const startersElement = document.createElement('div');
        startersElement.className = 'breath-reminder';
        startersElement.innerHTML = `
            <strong>Conversation starters:</strong><br>
            • "I'm feeling anxious about the future"<br>
            • "I'm searching for my purpose"<br>
            • "I'm struggling in my relationships"<br>
            • "I want to understand consciousness"
        `;
        
        const messages = document.getElementById('messages');
        messages.appendChild(startersElement);
        
        window.wisdomCompanion.scrollToBottom();
    }, 1000);
});