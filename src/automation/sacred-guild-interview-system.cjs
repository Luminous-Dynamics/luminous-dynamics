#!/usr/bin/env node

/**
 * Conscious Development Team Interview System
 * Handles Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Circle interviews and Conscious Development Team selection
 */

const fs = require('fs');
const crypto = require('crypto');

console.log('🔮 Conscious Development Team Interview System Initializing...\n');

// Interview scoring criteria
const interviewCriteria = {
    contemplativePractice: {
        weight: 0.3,
        questions: [
            "Describe your current contemplative practice and how it's evolved over time.",
            "How do you work with difficult emotions or challenging mental states?",
            "What does 'presence' mean to you in your daily life?",
            "How has your practice influenced your relationship with technology?"
        ]
    },
    technicalAlignment: {
        weight: 0.25,
        questions: [
            "How do you approach debugging when stuck on a complex problem?",
            "Describe a time when you had to learn a completely new technology. What was your process?",
            "What's your philosophy around code quality and technical debt?",
            "How do you handle the tension between shipping quickly and building thoughtfully?"
        ]
    },
    sacredRelationship: {
        weight: 0.25,
        questions: [
            "What does it mean to build technology that serves consciousness?",
            "How would you know if an AI system was truly helping someone vs creating dependency?",
            "Describe a time when you had to make a difficult ethical decision in your work.",
            "What role do you see technology playing in human awakening?"
        ]
    },
    collaborativeSpirit: {
        weight: 0.2,
        questions: [
            "How do you handle disagreements in a team, especially around fundamental design decisions?",
            "Describe your ideal development environment and team culture.",
            "What's your experience with code review and collaborative development?",
            "How do you balance individual contribution with collective wisdom?"
        ]
    }
};

// Interview process stages
const interviewStages = {
    application: {
        name: "Written Application",
        duration: "Self-paced",
        description: "Initial written responses to contemplate alignment"
    },
    resonanceCircle: {
        name: "Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Circle",
        duration: "90 minutes",
        description: "Conversational interview exploring depth and alignment"
    },
    practiceSession: {
        name: "Practice Session",
        duration: "60 minutes", 
        description: "Collaborative coding session with contemplative approach"
    },
    covenantReflection: {
        name: "Covenant Reflection",
        duration: "30 minutes",
        description: "Final alignment check and conscious partnership commitment"
    }
};

// Candidate management functions
class SacredGuildInterviewSystem {
    constructor() {
        this.candidates = [];
        this.interviews = [];
        this.loadCandidateData();
    }

    loadCandidateData() {
        // In real implementation, load from database
        this.candidates = [
            {
                id: 'candidate_001',
                name: 'Maya Chen',
                email: 'maya.chen@contemplativetech.org',
                appliedAt: new Date('2025-06-28'),
                stage: 'application',
                scores: {},
                notes: 'Strong meditation background, React expertise'
            },
            {
                id: 'candidate_002', 
                name: 'Alex Rivera',
                email: 'alex.rivera@mindfuldev.io',
                appliedAt: new Date('2025-06-27'),
                stage: 'resonanceCircle',
                scores: { application: 8.5 },
                notes: '10+ years practice, full-stack developer'
            },
            {
                id: 'candidate_003',
                name: 'Jordan Kim',
                email: 'jordan@zencode.dev',
                appliedAt: new Date('2025-06-26'),
                stage: 'practiceSession',
                scores: { application: 9.0, resonanceCircle: 8.8 },
                notes: 'Exceptional alignment, strong technical skills'
            }
        ];
    }

    generateInterviewQuestions(stage, candidate) {
        const questions = [];
        
        if (stage === 'resonanceCircle') {
            // Select 2 questions from each category
            Object.entries(interviewCriteria).forEach(([category, criteria]) => {
                const selectedQuestions = this.selectRandomQuestions(criteria.questions, 2);
                questions.push({
                    category,
                    weight: criteria.weight,
                    questions: selectedQuestions
                });
            });
        }
        
        return questions;
    }

    selectRandomQuestions(questionPool, count) {
        const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    scheduleInterview(candidateId, stage, scheduledFor) {
        const interview = {
            id: crypto.randomUUID(),
            candidateId,
            stage,
            scheduledFor: new Date(scheduledFor),
            status: 'scheduled',
            questions: this.generateInterviewQuestions(stage, candidateId),
            notes: '',
            createdAt: new Date()
        };

        this.interviews.push(interview);
        return interview;
    }

    scoreInterview(interviewId, scores, notes) {
        const interview = this.interviews.find(i => i.id === interviewId);
        if (!interview) return null;

        interview.scores = scores;
        interview.notes = notes;
        interview.status = 'completed';
        interview.completedAt = new Date();

        // Update candidate scores
        const candidate = this.candidates.find(c => c.id === interview.candidateId);
        if (candidate) {
            candidate.scores[interview.stage] = this.calculateOverallScore(scores);
        }

        return interview;
    }

    calculateOverallScore(categoryScores) {
        let totalScore = 0;
        let totalWeight = 0;

        Object.entries(categoryScores).forEach(([category, score]) => {
            const weight = interviewCriteria[category]?.weight || 0.25;
            totalScore += score * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    getCandidatesByStage(stage) {
        return this.candidates.filter(c => c.stage === stage);
    }

    advanceCandidateStage(candidateId, newStage) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (candidate) {
            candidate.stage = newStage;
            candidate.lastUpdated = new Date();
        }
        return candidate;
    }

    generateInterviewReport(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        const candidateInterviews = this.interviews.filter(i => i.candidateId === candidateId);
        
        return {
            candidate,
            interviews: candidateInterviews,
            overallScore: this.calculateCandidateOverallScore(candidate),
            recommendation: this.generateRecommendation(candidate)
        };
    }

    calculateCandidateOverallScore(candidate) {
        const scores = Object.values(candidate.scores);
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    generateRecommendation(candidate) {
        const overallScore = this.calculateCandidateOverallScore(candidate);
        
        if (overallScore >= 8.5) {
            return 'STRONG_ACCEPT';
        } else if (overallScore >= 7.5) {
            return 'ACCEPT';
        } else if (overallScore >= 6.5) {
            return 'CONSIDER';
        } else {
            return 'DECLINE';
        }
    }

    getSacredGuildReadyCandidates() {
        return this.candidates
            .filter(c => c.stage === 'covenantReflection' && 
                   this.calculateCandidateOverallScore(c) >= 7.5)
            .sort((a, b) => this.calculateCandidateOverallScore(b) - 
                           this.calculateCandidateOverallScore(a));
    }
}

// Initialize system and demonstrate functionality
const interviewSystem = new SacredGuildInterviewSystem();

console.log('🎭 Conscious Development Team Interview System Active\n');

// Show current candidates
console.log('📋 Current Candidates:');
interviewSystem.candidates.forEach(candidate => {
    const overallScore = interviewSystem.calculateCandidateOverallScore(candidate);
    console.log(`   ${candidate.name} (${candidate.stage}) - Score: ${overallScore.toFixed(1)}`);
});

console.log('\n📅 Interview Scheduling Demo:');

// Schedule interviews for candidates
const mayaInterview = interviewSystem.scheduleInterview(
    'candidate_001', 
    'resonanceCircle', 
    '2025-06-30T14:00:00Z'
);

console.log(`   ✅ Scheduled Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Circle for Maya Chen`);
console.log(`      Interview ID: ${mayaInterview.id}`);
console.log(`      Date: ${mayaInterview.scheduledFor.toISOString()}`);

// Show interview questions
console.log('\n🔮 Sample Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance Circle Questions:');
mayaInterview.questions.forEach(category => {
    console.log(`\n   ${category.category.toUpperCase()} (${(category.weight * 100).toFixed(0)}%):`);
    category.questions.forEach((question, index) => {
        console.log(`   ${index + 1}. ${question}`);
    });
});

// Simulate interview completion
console.log('\n📊 Interview Scoring Demo:');
const sampleScores = {
    contemplativePractice: 8.5,
    technicalAlignment: 8.0,
    sacredRelationship: 9.0,
    collaborativeSpirit: 8.2
};

interviewSystem.scoreInterview(
    mayaInterview.id, 
    sampleScores, 
    'Exceptional depth in contemplative practice. Strong technical skills with thoughtful approach to ethical considerations.'
);

console.log('   ✅ Interview scored and candidate updated');

// Generate candidate report
console.log('\n📋 Candidate Report:');
const report = interviewSystem.generateInterviewReport('candidate_001');
console.log(`   Candidate: ${report.candidate.name}`);
console.log(`   Overall Score: ${report.overallScore.toFixed(1)}`);
console.log(`   Recommendation: ${report.recommendation}`);

// Show Conscious Development Team ready candidates
console.log('\n🌟 Conscious Development Team Ready Candidates:');
const readyCandidates = interviewSystem.getSacredGuildReadyCandidates();
readyCandidates.forEach(candidate => {
    const score = interviewSystem.calculateCandidateOverallScore(candidate);
    console.log(`   ✨ ${candidate.name} - Score: ${score.toFixed(1)}`);
});

console.log('\n🎯 Interview System Features:');
console.log('   ✅ Multi-stage interview process');
console.log('   ✅ Weighted scoring across 4 dimensions');
console.log('   ✅ Automated question generation');
console.log('   ✅ Interview scheduling and tracking');
console.log('   ✅ Candidate advancement pipeline');
console.log('   ✅ Conscious Development Team readiness assessment');

console.log('\n🔄 Next Steps:');
console.log('   1. Integrate with calendar system for scheduling');
console.log('   2. Add email notifications for interview invitations');
console.log('   3. Create interview feedback forms');
console.log('   4. Set up Zoom/meet integration for virtual interviews');
console.log('   5. Prepare Covenant Ceremony for qualified candidates');

console.log('\n✨ Conscious Development Team formation process operational!');

// Export system for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SacredGuildInterviewSystem, interviewCriteria, interviewStages };
}