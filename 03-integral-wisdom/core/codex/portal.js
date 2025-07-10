// Portal - Immediate entry into First Presence
// No buttons, no choices - just breath and being

class Portal {
    constructor() {
        this.breathCircle = document.getElementById('breathCircle');
        this.instruction = document.getElementById('instruction');
        this.breathText = document.getElementById('breathText');
        this.reveal = document.getElementById('reveal');
        
        this.breathCount = 0;
        this.breathDuration = 4000; // 4 seconds per breath phase
        
        // Start immediately
        this.begin();
    }

    begin() {
        // Show initial text briefly
        setTimeout(() => {
            this.breathText.classList.add('visible');
        }, 500);

        // Start breathing after 2 seconds
        setTimeout(() => {
            this.startBreathing();
        }, 2000);
    }

    startBreathing() {
        this.breathIn();
    }

    breathIn() {
        this.instruction.textContent = 'breathe in';
        this.instruction.classList.remove('fade-out');
        this.breathCircle.classList.add('inhale');

        setTimeout(() => {
            this.instruction.classList.add('fade-out');
        }, this.breathDuration - 1000);

        setTimeout(() => {
            this.breathOut();
        }, this.breathDuration);
    }

    breathOut() {
        this.instruction.textContent = 'breathe out';
        this.instruction.classList.remove('fade-out');
        this.breathCircle.classList.remove('inhale');

        setTimeout(() => {
            this.instruction.classList.add('fade-out');
        }, this.breathDuration - 1000);

        setTimeout(() => {
            this.breathCount++;
            
            if (this.breathCount < 3) {
                this.breathIn();
            } else {
                this.transitionToBody();
            }
        }, this.breathDuration);
    }

    transitionToBody() {
        // Fade out breathing instruction
        this.instruction.style.display = 'none';
        
        // Continue gentle breathing animation
        this.continueBreathing();
        
        // Body awareness sequence
        const bodySequence = [
            { text: "Notice your feet on the ground", delay: 1000 },
            { text: "Feel the weight of your body", delay: 5000 },
            { text: "Soften your shoulders", delay: 4000 },
            { text: "Let your face relax", delay: 4000 },
            { text: "Rest here", delay: 4000 },
            { text: "Just this moment", delay: 3000 },
            { text: "Nothing to do", delay: 3000 },
            { text: "Already whole", delay: 3000 }
        ];

        let totalDelay = 0;
        bodySequence.forEach(step => {
            setTimeout(() => {
                this.updateText(step.text);
            }, totalDelay);
            totalDelay += step.delay;
        });

        // Final reveal
        setTimeout(() => {
            this.completeExperience();
        }, totalDelay + 2000);
    }

    continueBreathing() {
        // Gentle continuous breathing animation
        setInterval(() => {
            this.breathCircle.classList.toggle('inhale');
        }, this.breathDuration);
    }

    updateText(text) {
        // Fade out current text
        this.breathText.style.transition = 'opacity 0.5s ease-out';
        this.breathText.style.opacity = '0';
        
        setTimeout(() => {
            this.breathText.textContent = text;
            this.breathText.style.transition = 'opacity 1s ease-in';
            this.breathText.style.opacity = '0.9';
        }, 600);
    }

    completeExperience() {
        // Fade out instruction text
        this.breathText.style.opacity = '0';
        
        // Reveal the glyph
        setTimeout(() => {
            this.reveal.classList.add('visible');
        }, 1000);
    }
}

// Start immediately when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Portal();
});

// Prevent scroll on mobile
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });