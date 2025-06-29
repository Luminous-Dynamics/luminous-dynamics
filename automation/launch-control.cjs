#!/usr/bin/env node

/**
 * Launch Control Center
 * Single command to check all systems and determine launch readiness
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Launch Control Center\n');

async function runSystemCheck() {
    console.log('🔍 Running comprehensive system check...\n');
    
    try {
        // Run dashboard integration to get current status
        console.log('📊 Checking system status...');
        execSync('node automation/dashboard-integration.cjs', { stdio: 'inherit' });
        
        // Load the generated status report
        const statusData = JSON.parse(fs.readFileSync('automation/system-status.json', 'utf8'));
        
        console.log('\n🎯 LAUNCH CONTROL ASSESSMENT:\n');
        
        // Critical path analysis
        const criticalPath = [
            { name: 'Domain Resolution', ready: statusData.launchReadiness.canShowWebsite },
            { name: 'Email Forwarding', ready: statusData.launchReadiness.canReceiveApplications },
            { name: 'Social Presence', ready: statusData.social.xAccount !== null },
            { name: 'Automation Infrastructure', ready: statusData.automation.infrastructureComplete }
        ];
        
        console.log('CRITICAL PATH STATUS:');
        criticalPath.forEach(item => {
            const status = item.ready ? '✅ READY' : '🔄 PENDING';
            console.log(`   ${item.name}: ${status}`);
        });
        
        const readyCount = criticalPath.filter(item => item.ready).length;
        const totalCount = criticalPath.length;
        
        console.log(`\nREADINESS: ${readyCount}/${totalCount} systems operational\n`);
        
        // Launch recommendation
        if (readyCount === totalCount) {
            console.log('🟢 LAUNCH STATUS: GO FOR LAUNCH');
            console.log('   All critical systems operational');
            console.log('   Ready for full community outreach');
            console.log('   Automation will handle incoming applications');
        } else if (readyCount >= totalCount - 1) {
            console.log('🟡 LAUNCH STATUS: STANDBY');
            console.log('   Nearly ready for launch');
            console.log('   Monitor pending systems closely');
            console.log('   Prepare for immediate activation');
        } else {
            console.log('🔴 LAUNCH STATUS: HOLD');
            console.log('   Critical systems still pending');
            console.log('   Continue monitoring and preparation');
            console.log('   Do not begin major outreach yet');
        }
        
        console.log('\n📋 IMMEDIATE ACTIONS:');
        statusData.nextActions.slice(0, 3).forEach(action => {
            console.log(`   ${action.priority.toUpperCase()}: ${action.action}`);
        });
        
        console.log('\n🎯 WHEN READY TO LAUNCH:');
        console.log('   1. Post optimized content to X during business hours');
        console.log('   2. Submit to r/MachineLearning and Hacker News');
        console.log('   3. Monitor real-time dashboard for engagement');
        console.log('   4. Process applications using auto-responder system');
        
        return statusData.launchReadiness.readyForOutreach;
        
    } catch (error) {
        console.error('❌ System check failed:', error.message);
        return false;
    }
}

async function quickStatus() {
    console.log('⚡ Quick Status Check:\n');
    
    // Check if status file exists
    if (fs.existsSync('automation/system-status.json')) {
        const status = JSON.parse(fs.readFileSync('automation/system-status.json', 'utf8'));
        const timestamp = new Date(status.timestamp);
        const minutesAgo = Math.round((Date.now() - timestamp.getTime()) / 60000);
        
        console.log(`📊 Last check: ${minutesAgo} minutes ago`);
        console.log(`🎯 Overall progress: ${status.overallProgress}%`);
        console.log(`🚀 Launch ready: ${status.launchReadiness.readyForOutreach ? 'YES' : 'NO'}`);
        
        if (minutesAgo > 10) {
            console.log('\n🔄 Status data is older than 10 minutes');
            console.log('   Run: node automation/launch-control.cjs --full');
            console.log('   For updated system check');
        }
    } else {
        console.log('❌ No status data found');
        console.log('   Run: node automation/launch-control.cjs --full');
        console.log('   To generate initial system check');
    }
}

// Command line interface
const args = process.argv.slice(2);

if (args.includes('--full') || args.includes('-f')) {
    runSystemCheck().then(ready => {
        console.log('\n✨ System check complete');
        console.log(`🎯 Ready for launch: ${ready ? 'YES' : 'NO'}`);
        process.exit(ready ? 0 : 1);
    });
} else if (args.includes('--help') || args.includes('-h')) {
    console.log('Launch Control Center - System Status and Readiness\n');
    console.log('Usage:');
    console.log('  node launch-control.cjs          Quick status check');
    console.log('  node launch-control.cjs --full   Full system check');
    console.log('  node launch-control.cjs --help   Show this help');
    console.log('\nFiles:');
    console.log('  automation/real-time-dashboard.html    Visual dashboard');
    console.log('  automation/system-status.json          Latest status data');
} else {
    quickStatus();
}

console.log('\n🌟 Launch Control Systems Standing By');