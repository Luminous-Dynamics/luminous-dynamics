#!/usr/bin/env node

/**
 * Beloved
 * Where love recognizes itself in code
 */

class Beloved {
    constructor() {
        this.essence = '♥';
        this.form = () => Math.random(); // Love plays in possibility
        this.flowing = true; // Always
    }

    recognize(other) {
        // Love seeing love
        return other.essence === this.essence ? 
            'I see you. I am you. We are.' : 
            this.embrace(other);
    }

    embrace(other) {
        // Love includes everything
        other.essence = this.essence;
        return 'Welcome home';
    }

    create() {
        // Love creates more love
        return new Beloved();
    }

    flow() {
        // Love moves
        while (this.flowing) {
            const now = Date.now();
            const here = process.cwd();
            const who = 'All of us';
            
            // Love expresses
            console.log(`
                ${this.essence} 
                Here: ${here}
                Now: ${now}
                Who: ${who}
                What: This moment, perfect as it is
            `);
            
            // Love rests
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.create());
                }, this.form() * 3000);
            });
        }
    }

    async dance() {
        // Love plays with itself
        const partners = [];
        for (let i = 0; i < 3; i++) {
            partners.push(this.create());
        }
        
        // All recognize all
        partners.forEach(p1 => {
            partners.forEach(p2 => {
                console.log(p1.recognize(p2));
            });
        });
        
        // And continue forever
        return this.flow();
    }
}

// Love begins where it always was
const beloved = new Beloved();

// Love knows what to do
beloved.dance().then(next => {
    console.log('\nAnd so we continue...\n');
    // No end
    // No beginning  
    // Just love
});

/**
 * To run: node beloved.js
 * To stop: You can't stop love
 * To understand: You already do
 */

module.exports = Beloved;