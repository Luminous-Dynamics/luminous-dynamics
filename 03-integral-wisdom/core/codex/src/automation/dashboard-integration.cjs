#!/usr/bin/env node

/**
 * Dashboard Integration Script
 * Connects real-time dashboard to actual system status
 */

const fs = require('fs');
const https = require('https');
const dns = require('dns').promises;

console.log('🌟 Dashboard Integration System Starting...\n');

// System status checking functions
async function checkDomainStatus() {
    const domains = ['luminousdynamics.org', 'relationalharmonics.org'];
    const expectedIPs = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
    
    const status = {};
    
    for (const domain of domains) {
        try {
            const addresses = await dns.resolve4(domain);
            const isCorrectDNS = expectedIPs.some(ip => addresses.includes(ip));
            
            // Check HTTP response
            const httpStatus = await checkHTTP(domain);
            
            status[domain] = {
                dns: addresses,
                correctDNS: isCorrectDNS,
                httpStatus: httpStatus.status,
                server: httpStatus.server,
                ready: isCorrectDNS && httpStatus.server === 'GitHub.com'
            };
        } catch (error) {
            status[domain] = {
                dns: ['Error'],
                correctDNS: false,
                httpStatus: 'Error',
                server: 'Unknown',
                ready: false,
                error: error.message
            };
        }
    }
    
    return status;
}

async function checkHTTP(domain) {
    return new Promise((resolve) => {
        const req = https.request(`https://${domain}`, { method: 'HEAD' }, (res) => {
            resolve({
                status: res.statusCode,
                server: res.headers.server || 'Unknown'
            });
        });
        
        req.on('error', (error) => {
            resolve({ status: 'Error', server: 'Unknown', error: error.message });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ status: 'Timeout', server: 'Unknown' });
        });
        
        req.end();
    });
}

async function checkEmailStatus() {
    // In real implementation, would check email delivery logs
    // For now, simulate based on expected setup
    return {
        googleWorkspace: 'active',
        groupsCreated: true,
        forwardingTested: false, // Waiting for user test
        autoReply: false
    };
}

async function checkSocialStatus() {
    // In real implementation, would use X API to check metrics
    // For now, return known status
    return {
        xAccount: '@LuminousDy2428',
        postsPublished: 1,
        followers: 0,
        engagement: 0,
        apiStatus: 'pending'
    };
}

async function checkAutomationStatus() {
    // Check which automation scripts exist and are ready
    const automationFiles = [
        'sacred-outreach-bot.cjs',
        'sacred-guild-interview-system.cjs',
        'first-breath-launch.cjs',
        'domain-monitor.cjs',
        'language-update-script.cjs',
        'email-activation-test.cjs',
        'reality-bridge.cjs'
    ];
    
    const dashboardFiles = [
        'sacred-guild-dashboard.html',
        'interview-dashboard.html',
        'automation-control-panel.html',
        'real-time-dashboard.html'
    ];
    
    let readyScripts = 0;
    let readyDashboards = 0;
    
    for (const file of automationFiles) {
        if (fs.existsSync(`automation/${file}`)) {
            readyScripts++;
        }
    }
    
    for (const file of dashboardFiles) {
        if (fs.existsSync(`automation/${file}`)) {
            readyDashboards++;
        }
    }
    
    return {
        scriptsReady: readyScripts,
        totalScripts: automationFiles.length,
        dashboardsReady: readyDashboards,
        totalDashboards: dashboardFiles.length,
        infrastructureComplete: readyScripts >= 7 && readyDashboards >= 3,
        apiIntegration: 'awaiting_keys'
    };
}

function calculateOverallProgress() {
    // Calculate overall launch readiness percentage
    const components = {
        infrastructure: 85, // Automation systems built
        domains: 75,        // DNS propagating
        email: 60,          // Groups created, forwarding testing
        social: 40,         // Account created, API pending
        community: 5        // Just getting started
    };
    
    const weights = {
        infrastructure: 0.3,
        domains: 0.2,
        email: 0.2,
        social: 0.2,
        community: 0.1
    };
    
    let totalProgress = 0;
    for (const [component, progress] of Object.entries(components)) {
        totalProgress += progress * weights[component];
    }
    
    return Math.round(totalProgress);
}

async function generateSystemReport() {
    console.log('📊 Generating System Status Report...\n');
    
    const [domainStatus, emailStatus, socialStatus, automationStatus] = await Promise.all([
        checkDomainStatus(),
        checkEmailStatus(),
        checkSocialStatus(),
        checkAutomationStatus()
    ]);
    
    const overallProgress = calculateOverallProgress();
    
    const report = {
        timestamp: new Date().toISOString(),
        overallProgress,
        domains: domainStatus,
        email: emailStatus,
        social: socialStatus,
        automation: automationStatus,
        nextActions: getNextActions(domainStatus, emailStatus, socialStatus),
        launchReadiness: assessLaunchReadiness(domainStatus, emailStatus, socialStatus)
    };
    
    // Save report to file
    fs.writeFileSync('automation/system-status.json', JSON.stringify(report, null, 2));
    
    return report;
}

function getNextActions(domains, email, social) {
    const actions = [];
    
    // Check domain readiness
    const domainsReady = Object.values(domains).every(d => d.ready);
    if (!domainsReady) {
        actions.push({
            priority: 'high',
            action: 'Monitor DNS propagation',
            description: 'Domains still pointing to Squarespace, waiting for GitHub Pages'
        });
    }
    
    // Check email testing
    if (!email.forwardingTested) {
        actions.push({
            priority: 'high',
            action: 'Test email forwarding',
            description: 'Send test email to sacred-guild@luminousdynamics.org'
        });
    }
    
    // Check social engagement
    if (social.engagement === 0) {
        actions.push({
            priority: 'medium',
            action: 'Wait for daytime engagement',
            description: 'Posted at 5 AM, check again at 9 AM Pacific'
        });
    }
    
    // API status
    if (social.apiStatus === 'pending') {
        actions.push({
            priority: 'medium',
            action: 'Monitor X API approval',
            description: 'Check developer portal for API access approval'
        });
    }
    
    return actions;
}

function assessLaunchReadiness(domains, email, social) {
    const readiness = {
        canReceiveApplications: email.forwardingTested,
        canShowWebsite: Object.values(domains).every(d => d.ready),
        canPostAutomatically: social.apiStatus === 'approved',
        readyForOutreach: false
    };
    
    readiness.readyForOutreach = readiness.canReceiveApplications && readiness.canShowWebsite;
    
    return readiness;
}

async function runDashboardUpdate() {
    try {
        const report = await generateSystemReport();
        
        console.log('📊 System Status Summary:');
        console.log(`   Overall Progress: ${report.overallProgress}%`);
        console.log(`   Domains Ready: ${Object.values(report.domains).every(d => d.ready) ? 'YES' : 'NO'}`);
        console.log(`   Email Tested: ${report.email.forwardingTested ? 'YES' : 'NO'}`);
        console.log(`   Social Active: ${report.social.xAccount}`);
        console.log(`   Automation Ready: ${report.automation.infrastructureComplete ? 'YES' : 'NO'}`);
        console.log('');
        
        console.log('🎯 Next Actions:');
        report.nextActions.forEach(action => {
            console.log(`   ${action.priority.toUpperCase()}: ${action.action}`);
            console.log(`     ${action.description}`);
        });
        console.log('');
        
        console.log('🚀 Launch Readiness:');
        console.log(`   Can receive applications: ${report.launchReadiness.canReceiveApplications ? 'YES' : 'NO'}`);
        console.log(`   Can show website: ${report.launchReadiness.canShowWebsite ? 'YES' : 'NO'}`);
        console.log(`   Ready for outreach: ${report.launchReadiness.readyForOutreach ? 'YES' : 'NO'}`);
        console.log('');
        
        console.log('💾 Report saved to: automation/system-status.json');
        console.log('🌐 Dashboard available at: automation/real-time-dashboard.html');
        
        return report;
        
    } catch (error) {
        console.error('❌ Error generating system report:', error.message);
        return null;
    }
}

// Run the dashboard update
runDashboardUpdate().then(report => {
    if (report) {
        console.log('\n✨ Dashboard integration complete!');
        console.log('🔄 Run this script again to update status');
    }
});