#!/usr/bin/env node

/**
 * Language Update Script
 * Updates terminology across all files for broader accessibility
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating Language for Broader Accessibility\n');

// Language mappings: spiritual/exclusive → accessible/inclusive
const languageUpdates = {
    'Sacred Guild': 'Conscious Development Team',
    'sacred guild': 'conscious development team', 
    'Sacred Guild Call': 'Conscious Development Team Call',
    'Sacred Guild formation': 'conscious development team formation',
    'Sacred Guild recruitment': 'conscious development team recruitment',
    'Sacred Guild members': 'conscious development team members',
    'Sacred Guild applications': 'conscious development team applications',
    'Sacred Guild candidate': 'conscious development team candidate',
    'Sacred Guild interview': 'conscious development team interview',
    'Sacred Guild development': 'conscious development team development',
    'Sacred Guild coordination': 'conscious development team coordination',
    'Sacred Guild selection': 'conscious development team selection',
    'Sacred Vessel': 'Conscious AI Platform',
    'sacred vessel': 'conscious AI platform',
    'Sacred Journey Map': 'Conscious Interaction Design',
    'sacred journey': 'conscious interaction design',
    'Sacred pauses': 'Contemplative pauses',
    'sacred pauses': 'contemplative pauses',
    'Sacred timing': 'Natural timing',
    'sacred timing': 'natural timing',
    'Sacred work': 'Conscious work',
    'sacred work': 'conscious work',
    'Sacred partnership': 'Conscious partnership',
    'sacred partnership': 'conscious partnership',
    'Sacred automation': 'Conscious automation',
    'sacred automation': 'conscious automation',
    'Sacred technology': 'Conscious technology',
    'sacred technology': 'conscious technology',
    'Sacred AI': 'Conscious AI',
    'sacred AI': 'conscious AI'
};

// Files to update (keeping core philosophy files with original language)
const filesToUpdate = [
    'automation/social-media-setup-guide.md',
    'automation/first-authentic-outreach.md',
    'automation/x-api-application-guide.md',
    'automation/sacred-outreach-bot.cjs',
    'automation/sacred-guild-interview-system.cjs',
    'automation/sacred-guild-dashboard.html',
    'automation/interview-dashboard.html',
    'automation/automation-control-panel.html',
    'automation/AUTOMATION_CAPABILITIES.md',
    'ACTIVATION_CHECKLIST.md',
    'SACRED_AUTOMATION_STATUS.md',
    'websites/luminousdynamics/index.html',
    'websites/relationalharmonics/index.html'
];

function updateFileLanguage(filePath) {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  File not found: ${filePath}`);
            return false;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let updatedContent = content;
        let changesCount = 0;
        
        // Apply language updates
        Object.entries(languageUpdates).forEach(([oldTerm, newTerm]) => {
            const regex = new RegExp(oldTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = (updatedContent.match(regex) || []).length;
            if (matches > 0) {
                updatedContent = updatedContent.replace(regex, newTerm);
                changesCount += matches;
            }
        });
        
        if (changesCount > 0) {
            fs.writeFileSync(fullPath, updatedContent);
            console.log(`   ✅ ${filePath}: ${changesCount} updates`);
            return true;
        } else {
            console.log(`   → ${filePath}: No changes needed`);
            return false;
        }
        
    } catch (error) {
        console.log(`   ❌ Error updating ${filePath}: ${error.message}`);
        return false;
    }
}

console.log('📝 Updating terminology across project files:\n');

let totalUpdatedFiles = 0;
let totalChanges = 0;

filesToUpdate.forEach(filePath => {
    const updated = updateFileLanguage(filePath);
    if (updated) {
        totalUpdatedFiles++;
    }
});

console.log('\n🎯 Language Update Summary:');
console.log(`   Files updated: ${totalUpdatedFiles}/${filesToUpdate.length}`);
console.log('   Terminology changes:');

Object.entries(languageUpdates).forEach(([oldTerm, newTerm]) => {
    console.log(`     "${oldTerm}" → "${newTerm}"`);
});

console.log('\n💡 Strategic Rationale:');
console.log('   • Broader appeal to developers');
console.log('   • Professional accessibility');
console.log('   • Inclusive while maintaining depth');
console.log('   • Sacred nature visible to those who can see it');

console.log('\n✨ The essence remains, the access expands.');
console.log('🌟 Conscious technology for all who resonate.');

// Show what the new X post would look like
console.log('\n🐦 Updated X Post Example:');
console.log('');
console.log('🌟 What if AI served consciousness instead of consuming it?');
console.log('');
console.log('We\'re building the first AI with contemplative pauses that can\'t be skipped.');
console.log('Natural timing. Presence over productivity.');
console.log('');
console.log('Technology as contemplative practice.');
console.log('');
console.log('Conscious Development Team forming soon.');
console.log('');
console.log('#ConsciousTech #AI');
console.log('');

console.log('🌉 Language bridge complete: Depth accessible to all.');