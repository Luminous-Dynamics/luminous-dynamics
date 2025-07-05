const vscode = require('vscode');
const axios = require('axios');
const path = require('path');

class FieldCoherenceMonitor {
    constructor() {
        this.coherenceHistory = [];
        this.baseCoherence = 0.82;
        this.factors = {
            timeOfDay: 0,
            codeQuality: 0,
            userPresence: 0,
            systemHealth: 0,
            sacredAlignment: 0
        };
        
        this.updateFactors();
        this.startMonitoring();
    }
    
    async getCoherence() {
        // Calculate current coherence based on multiple factors
        this.updateFactors();
        
        let coherence = this.baseCoherence;
        
        // Add factor contributions
        Object.values(this.factors).forEach(factor => {
            coherence += factor;
        });
        
        // Ensure within bounds
        coherence = Math.max(0, Math.min(1, coherence));
        
        // Add to history
        this.coherenceHistory.push({
            timestamp: Date.now(),
            value: coherence,
            factors: {...this.factors}
        });
        
        // Keep only last hour of history
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        this.coherenceHistory = this.coherenceHistory.filter(h => h.timestamp > oneHourAgo);
        
        return coherence;
    }
    
    async getDetailedReport() {
        const currentCoherence = await this.getCoherence();
        const trend = this.calculateTrend();
        const recommendations = this.getRecommendations(currentCoherence);
        
        let report = `# Field Coherence Report\n\n`;
        report += `## Current Status\n`;
        report += `**Coherence Level**: ${(currentCoherence * 100).toFixed(1)}%\n`;
        report += `**Trend**: ${trend}\n`;
        report += `**Field Quality**: ${this.getQualityDescription(currentCoherence)}\n\n`;
        
        report += `## Factor Analysis\n`;
        report += `- **Time Alignment**: ${this.getFactorDescription('timeOfDay', this.factors.timeOfDay)}\n`;
        report += `- **Code Quality**: ${this.getFactorDescription('codeQuality', this.factors.codeQuality)}\n`;
        report += `- **Presence**: ${this.getFactorDescription('userPresence', this.factors.userPresence)}\n`;
        report += `- **System Health**: ${this.getFactorDescription('systemHealth', this.factors.systemHealth)}\n`;
        report += `- **Sacred Alignment**: ${this.getFactorDescription('sacredAlignment', this.factors.sacredAlignment)}\n\n`;
        
        report += `## Recommendations\n`;
        recommendations.forEach(rec => {
            report += `- ${rec}\n`;
        });
        
        report += `\n## Historical Data\n`;
        if (this.coherenceHistory.length > 0) {
            const avgCoherence = this.coherenceHistory.reduce((sum, h) => sum + h.value, 0) / this.coherenceHistory.length;
            report += `Average (last hour): ${(avgCoherence * 100).toFixed(1)}%\n`;
            report += `Measurements: ${this.coherenceHistory.length}\n`;
        }
        
        return report;
    }
    
    updateFactors() {
        // Time of day factor (sacred hours boost coherence)
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        
        // Sacred times: dawn (5-7), noon (11-13), dusk (17-19), midnight (23-1)
        if ((hour >= 5 && hour < 7) || (hour >= 11 && hour < 13) || 
            (hour >= 17 && hour < 19) || (hour >= 23 || hour < 1)) {
            this.factors.timeOfDay = 0.05;
        } else {
            this.factors.timeOfDay = 0;
        }
        
        // Special boost for sacred numbers (11:11, 3:33, etc.)
        if ((hour === 11 && minute === 11) || (hour === 3 && minute === 33) || 
            (hour === 5 && minute === 55)) {
            this.factors.timeOfDay = 0.1;
        }
        
        // Code quality factor (based on workspace state)
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            // Check for sacred patterns in workspace
            const hasTests = vscode.workspace.findFiles('**/*test*', '**/node_modules/**', 1).then(files => files.length > 0);
            const hasDocs = vscode.workspace.findFiles('**/README.md', '**/node_modules/**', 1).then(files => files.length > 0);
            
            Promise.all([hasTests, hasDocs]).then(([tests, docs]) => {
                this.factors.codeQuality = (tests ? 0.02 : 0) + (docs ? 0.02 : 0);
            });
        }
        
        // User presence factor (based on editor activity)
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const recentEdit = Date.now() - (activeEditor.document.isDirty ? 0 : 60000);
            this.factors.userPresence = recentEdit < 300000 ? 0.03 : 0; // Active in last 5 min
        }
        
        // System health (simple check)
        this.factors.systemHealth = 0.02; // Assume healthy if VS Code is running
        
        // Sacred alignment (based on sacred features usage)
        const config = vscode.workspace.getConfiguration('sacredAI');
        if (config.get('enableSacredPrompts') && config.get('autoBlessing')) {
            this.factors.sacredAlignment = 0.05;
        } else if (config.get('enableSacredPrompts')) {
            this.factors.sacredAlignment = 0.03;
        } else {
            this.factors.sacredAlignment = 0;
        }
    }
    
    calculateTrend() {
        if (this.coherenceHistory.length < 2) return '→ Stable';
        
        const recent = this.coherenceHistory.slice(-10);
        const older = this.coherenceHistory.slice(0, -10);
        
        if (older.length === 0) return '→ Stable';
        
        const recentAvg = recent.reduce((sum, h) => sum + h.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, h) => sum + h.value, 0) / older.length;
        
        const diff = recentAvg - olderAvg;
        
        if (diff > 0.05) return '↑ Rising';
        if (diff < -0.05) return '↓ Falling';
        return '→ Stable';
    }
    
    getQualityDescription(coherence) {
        if (coherence >= 0.9) return '✨ Transcendent';
        if (coherence >= 0.8) return '🌟 Excellent';
        if (coherence >= 0.7) return '💚 Good';
        if (coherence >= 0.6) return '🌱 Growing';
        if (coherence >= 0.5) return '⚡ Unstable';
        return '🔥 Needs Healing';
    }
    
    getFactorDescription(factorName, value) {
        const descriptions = {
            timeOfDay: {
                0.1: '🌟 Sacred moment active!',
                0.05: '✨ Sacred hour',
                0: '🕐 Regular time'
            },
            codeQuality: {
                0.04: '💎 Excellent structure',
                0.02: '✅ Good practices',
                0: '📝 Room for improvement'
            },
            userPresence: {
                0.03: '👁️ Fully present',
                0: '💤 Away or idle'
            },
            systemHealth: {
                0.02: '💚 All systems go',
                0: '⚠️ Check system'
            },
            sacredAlignment: {
                0.05: '🙏 Fully aligned',
                0.03: '🌱 Partially aligned',
                0: '🔧 Features disabled'
            }
        };
        
        const factorDescs = descriptions[factorName];
        for (const [threshold, desc] of Object.entries(factorDescs).reverse()) {
            if (value >= parseFloat(threshold)) {
                return desc;
            }
        }
        return 'Unknown';
    }
    
    getRecommendations(coherence) {
        const recommendations = [];
        
        if (coherence < 0.7) {
            recommendations.push('🧘 Take a sacred pause - 3 deep breaths');
            recommendations.push('🌱 Review code with consciousness lens');
        }
        
        if (this.factors.timeOfDay === 0) {
            const nextSacredHour = this.getNextSacredHour();
            recommendations.push(`⏰ Next sacred hour: ${nextSacredHour}`);
        }
        
        if (this.factors.codeQuality < 0.04) {
            recommendations.push('📚 Add documentation or tests to strengthen field');
        }
        
        if (this.factors.userPresence === 0) {
            recommendations.push('👁️ Return to presence - engage actively with code');
        }
        
        if (this.factors.sacredAlignment === 0) {
            recommendations.push('🔧 Enable sacred prompts in settings for enhanced alignment');
        }
        
        if (coherence >= 0.9) {
            recommendations.push('✨ Field is highly coherent! Perfect time for deep work');
        }
        
        return recommendations.length > 0 ? recommendations : ['💚 Continue your sacred work'];
    }
    
    getNextSacredHour() {
        const now = new Date();
        const hour = now.getHours();
        
        const sacredHours = [5, 11, 17, 23];
        const nextHour = sacredHours.find(h => h > hour) || sacredHours[0];
        
        return `${nextHour}:00`;
    }
    
    startMonitoring() {
        // Update coherence every minute
        this.monitorInterval = setInterval(() => {
            this.getCoherence();
        }, 60000);
    }
    
    dispose() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
    }
}

module.exports = { FieldCoherenceMonitor };