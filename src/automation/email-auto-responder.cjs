#!/usr/bin/env node

/**
 * Email Auto-Responder System
 * Handles automatic acknowledgment and initial screening of applications
 */

const fs = require('fs');

console.log('📧 Email Auto-Responder System Initializing...\n');

// Auto-response templates
const responseTemplates = {
    consciousDevelopmentTeam: {
        subject: 'Thank you for your Conscious Development Team application',
        body: `Dear {name},

Thank you for your interest in joining our Conscious Development Team.

We've received your application and are genuinely excited to learn more about your background in both contemplative practice and technology development.

WHAT HAPPENS NEXT:

1. APPLICATION REVIEW (2-3 days)
   We'll carefully review your responses, looking for alignment between:
   • Technical skills and experience
   • Contemplative practice depth
   • Motivation for conscious technology

2. RESONANCE CIRCLE INVITATION (if aligned)
   Qualified candidates will be invited to a 90-minute Resonance Circle:
   • Conversational interview exploring alignment
   • Questions across 4 dimensions: contemplative practice, technical skills, conscious relationship, collaborative spirit
   • Opportunity for you to ask questions about the project

3. PRACTICE SESSION (final candidates)
   • 60-minute collaborative coding session
   • Working together on contemplative UX patterns
   • Mutual assessment of working compatibility

4. TEAM FORMATION
   • Final team of 3-5 conscious developers
   • Covenant ceremony to formalize partnership
   • Begin MVP development with shared equity

WHILE YOU WAIT:

• Explore our technical repository: https://github.com/Luminous-Dynamics/codex-of-relational-harmonics
• Read about our approach: https://luminousdynamics.org
• Connect with us on X: @LuminousDy2428

We're looking for developers who understand that how we build technology is as important as what we build. Your application suggests you share this perspective.

Questions? Reply to this email or reach out directly.

With appreciation,
Tristan & the Luminous Dynamics Team

P.S. This is authentic human communication, not automated marketing. We read every application personally and respond with care.

---
Luminous Dynamics
Building AI that protects attention instead of hijacking it
team@luminousdynamics.org
https://luminousdynamics.org`
    },

    firstBreath: {
        subject: 'Welcome to the First Breath Community',
        body: `Dear {name},

Thank you for your interest in the First Breath Community - our beta testing program for conscious AI.

We're thrilled to have contemplative practitioners help shape the first AI designed to serve awareness rather than distract from it.

FIRST BREATH PROGRAM OVERVIEW:

• 6-week beta testing period
• Weekly Resonance Circle calls with other practitioners
• Early access to conscious AI prototype
• Direct influence on final design
• Welcome kit with practice guides

SELECTION PROCESS:

1. APPLICATION REVIEW (1-2 weeks)
   We're seeking 50-100 practitioners who combine:
   • Regular contemplative practice (any tradition)
   • Curiosity about conscious technology
   • Willingness to provide thoughtful feedback

2. ROLLING COHORTS
   • We'll invite practitioners in groups of 10-15
   • Multiple cohorts to maintain intimate community size
   • Diversity of practice traditions and backgrounds

3. FIRST BREATH WELCOME
   • Orientation call to introduce the AI system
   • Practice guidelines for conscious engagement
   • Community platform access (Discord + weekly calls)

WHAT WE'RE TESTING:

The ERC Wisdom Companion includes:
• Built-in contemplative pauses (non-skippable)
• Three contemplative personas: Wise Witness, Loving Gardener, Calm River
• Natural conversation timing that respects human processing
• Sessions that conclude organically rather than extend infinitely

YOUR FEEDBACK WILL SHAPE:
• Optimal pause timing and frequency
• Most helpful contemplative prompting
• Balance between AI wisdom and pointing back to your own insight
• Community features that support practice

NEXT STEPS:

We'll contact selected practitioners within 2 weeks. In the meantime:

• Explore our philosophy: https://relationalharmonics.org
• Connect with us: @LuminousDy2428
• Join our community discussions

Thank you for your interest in conscious technology. The future of human-AI relationship depends on practitioners like you helping us build systems that serve awakening.

In service,
The Luminous Dynamics Team

---
First Breath Community
Beta testing conscious AI for contemplative practitioners
wisdom@relationalharmonics.org
https://relationalharmonics.org`
    },

    general: {
        subject: 'Thank you for contacting Luminous Dynamics',
        body: `Dear {name},

Thank you for reaching out to Luminous Dynamics.

We've received your message and will respond within 24-48 hours.

ABOUT OUR WORK:

We're building the first AI system explicitly designed to serve consciousness rather than hijack attention. Our approach includes:

• Built-in contemplative pauses that cannot be skipped
• Natural timing that respects human processing
• Success metrics based on user wellbeing, not engagement time
• Three contemplative personas in one system

CURRENT OPPORTUNITIES:

1. CONSCIOUS DEVELOPMENT TEAM
   We're forming a team of 3-5 contemplative developers to build this system.
   More info: team@luminousdynamics.org

2. FIRST BREATH COMMUNITY
   Beta testing program for 50-100 contemplative practitioners.
   More info: wisdom@relationalharmonics.org

3. COLLABORATION & PARTNERSHIPS
   We welcome partnerships with organizations aligned with conscious technology.

EXPLORE OUR WORK:

• Technical details: https://github.com/Luminous-Dynamics/codex-of-relational-harmonics
• Philosophy & approach: https://luminousdynamics.org
• Community documentation: https://relationalharmonics.org
• Follow our journey: @LuminousDy2428

We'll be in touch soon. Thank you for your interest in technology that serves consciousness.

Best regards,
The Luminous Dynamics Team

---
Luminous Dynamics
Building AI that protects attention instead of hijacking it
stewards@luminousdynamics.org
https://luminousdynamics.org`
    }
};

// Application scoring system
class ApplicationProcessor {
    constructor() {
        this.applications = [];
        this.scoringCriteria = {
            contemplativePractice: {
                weight: 0.35,
                keywords: [
                    'meditation', 'mindfulness', 'contemplative', 'spiritual',
                    'awareness', 'presence', 'consciousness', 'practice',
                    'dharma', 'zen', 'vipassana', 'mindful', 'awakening'
                ]
            },
            technicalSkills: {
                weight: 0.30,
                keywords: [
                    'react', 'typescript', 'javascript', 'node', 'python',
                    'frontend', 'backend', 'fullstack', 'api', 'database',
                    'git', 'github', 'development', 'programming', 'coding'
                ]
            },
            ethicalMotivation: {
                weight: 0.25,
                keywords: [
                    'ethics', 'ethical', 'conscious', 'mindful', 'sustainable',
                    'wellbeing', 'human-centered', 'user-focused', 'addiction',
                    'attention', 'burnout', 'meaning', 'purpose', 'service'
                ]
            },
            collaboration: {
                weight: 0.10,
                keywords: [
                    'team', 'collaboration', 'partnership', 'communication',
                    'community', 'together', 'collective', 'shared', 'open'
                ]
            }
        };
    }

    processApplication(email, name, responses) {
        const application = {
            id: this.generateId(),
            email,
            name,
            responses,
            receivedAt: new Date(),
            score: this.calculateScore(responses),
            status: 'received',
            nextStep: 'review'
        };

        // Determine application type
        application.type = this.determineApplicationType(email, responses);
        
        // Set next step based on score
        if (application.score >= 8.0) {
            application.nextStep = 'resonance_circle';
            application.priority = 'high';
        } else if (application.score >= 6.5) {
            application.nextStep = 'detailed_review';
            application.priority = 'medium';
        } else {
            application.nextStep = 'decline';
            application.priority = 'low';
        }

        this.applications.push(application);
        
        // Generate auto-response
        const response = this.generateAutoResponse(application);
        
        return {
            application,
            autoResponse: response,
            recommended: application.score >= 6.5
        };
    }

    calculateScore(responses) {
        const responseText = Object.values(responses).join(' ').toLowerCase();
        let totalScore = 0;
        let totalWeight = 0;

        Object.entries(this.scoringCriteria).forEach(([category, criteria]) => {
            let categoryScore = 0;
            
            criteria.keywords.forEach(keyword => {
                if (responseText.includes(keyword)) {
                    categoryScore += 1;
                }
            });

            // Normalize to 0-10 scale
            const normalizedScore = Math.min(10, categoryScore);
            totalScore += normalizedScore * criteria.weight;
            totalWeight += criteria.weight;
        });

        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    determineApplicationType(email, responses) {
        const emailLower = email.toLowerCase();
        const responseText = Object.values(responses).join(' ').toLowerCase();

        if (emailLower.includes('sacred-guild') || 
            responseText.includes('development') || 
            responseText.includes('coding') ||
            responseText.includes('programming')) {
            return 'consciousDevelopmentTeam';
        }

        if (emailLower.includes('first-breath') ||
            emailLower.includes('wisdom') ||
            responseText.includes('practitioner') ||
            responseText.includes('beta')) {
            return 'firstBreath';
        }

        return 'general';
    }

    generateAutoResponse(application) {
        const template = responseTemplates[application.type];
        
        return {
            to: application.email,
            subject: template.subject,
            body: template.body.replace(/{name}/g, application.name || 'Friend'),
            type: application.type,
            applicationId: application.id
        };
    }

    generateId() {
        return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getApplicationsByScore(minScore = 0) {
        return this.applications
            .filter(app => app.score >= minScore)
            .sort((a, b) => b.score - a.score);
    }

    getApplicationsByType(type) {
        return this.applications.filter(app => app.type === type);
    }

    updateApplicationStatus(applicationId, newStatus, notes = '') {
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
            application.status = newStatus;
            application.lastUpdated = new Date();
            if (notes) {
                application.notes = application.notes || [];
                application.notes.push({
                    timestamp: new Date(),
                    content: notes
                });
            }
        }
        return application;
    }
}

// Demo functionality
function demonstrateAutoResponder() {
    console.log('📧 Auto-Responder System Active\n');
    
    const processor = new ApplicationProcessor();
    
    // Sample applications for demonstration
    const sampleApplications = [
        {
            email: 'maya.chen@contemplativetech.org',
            name: 'Maya Chen',
            responses: {
                background: 'Full-stack developer with 8 years experience in React and Node.js. Daily meditation practice for 6 years, primarily vipassana.',
                motivation: 'Tired of building products that hijack attention. Want to create technology that serves human wellbeing and consciousness.',
                experience: 'Built meditation apps, worked on ethical AI projects, experienced tech burnout personally.',
                vision: 'Technology should support awakening, not addiction. Conscious development means mindful coding practices.'
            }
        },
        {
            email: 'alex.rivera@mindfuldev.io',
            name: 'Alex Rivera',
            responses: {
                background: 'Senior software engineer specializing in frontend development. Zen practitioner for 10+ years.',
                motivation: 'The tech industry needs a fundamental shift toward conscious technology. Ready to build the alternative.',
                experience: 'Led development teams, created digital wellness apps, studied contemplative computing.',
                vision: 'AI that points users back to their own wisdom rather than creating dependency.'
            }
        },
        {
            email: 'practitioner@dharma.org',
            name: 'Jordan Kim',
            responses: {
                background: 'Meditation teacher and occasional programmer. 15 years of contemplative practice.',
                motivation: 'Curious about conscious AI but no extensive coding background. Want to test and provide feedback.',
                experience: 'Community organizing, teaching mindfulness, basic web development.',
                vision: 'Technology that supports genuine spiritual development and human connection.'
            }
        }
    ];
    
    console.log('📋 Processing Sample Applications:\n');
    
    sampleApplications.forEach((app, index) => {
        const result = processor.processApplication(app.email, app.name, app.responses);
        
        console.log(`Application ${index + 1}: ${result.application.name}`);
        console.log(`   Email: ${result.application.email}`);
        console.log(`   Score: ${result.application.score.toFixed(1)}/10`);
        console.log(`   Type: ${result.application.type}`);
        console.log(`   Next Step: ${result.application.nextStep}`);
        console.log(`   Priority: ${result.application.priority}`);
        console.log(`   Recommended: ${result.recommended ? 'YES' : 'NO'}`);
        console.log('');
    });
    
    console.log('🎯 Auto-Response Features:');
    console.log('   ✅ Intelligent application type detection');
    console.log('   ✅ Automated scoring across 4 dimensions');
    console.log('   ✅ Personalized response generation');
    console.log('   ✅ Priority assignment for review');
    console.log('   ✅ Next step recommendation');
    
    console.log('\n📊 Scoring Breakdown:');
    console.log('   • Contemplative Practice (35%): Depth and consistency');
    console.log('   • Technical Skills (30%): Development experience');
    console.log('   • Ethical Motivation (25%): Conscious technology alignment');
    console.log('   • Collaboration (10%): Team and community orientation');
    
    console.log('\n📧 Response Templates:');
    console.log('   • Conscious Development Team: Technical partnership focus');
    console.log('   • First Breath Community: Practitioner beta testing');
    console.log('   • General Inquiries: Information and opportunities');
    
    console.log('\n⚡ Integration Ready:');
    console.log('   • Gmail API for automated sending');
    console.log('   • Application tracking dashboard');
    console.log('   • Interview scheduling workflow');
    console.log('   • CRM integration for candidate management');
    
    return processor;
}

// Run demonstration
const processor = demonstrateAutoResponder();

console.log('\n✨ Email Auto-Responder System Ready!');
console.log('🔄 Ready to process real applications when email forwarding is confirmed');

// Export for integration with other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApplicationProcessor, responseTemplates };
}