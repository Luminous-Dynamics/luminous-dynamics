#!/usr/bin/env node

/**
 * Domain Resolution Monitor
 * Tracks DNS propagation and GitHub Pages activation
 */

const https = require('https');
const dns = require('dns').promises;

const domains = [
    'luminousdynamics.org',
    'relationalharmonics.org'
];

const githubPages = [
    'luminous-dynamics.github.io',
    'relational-harmonics.github.io'
];

async function checkDNS(domain) {
    try {
        const addresses = await dns.resolve4(domain);
        return addresses;
    } catch (error) {
        return [`DNS Error: ${error.message}`];
    }
}

async function checkHTTP(domain) {
    return new Promise((resolve) => {
        const req = https.request(`https://${domain}`, { method: 'HEAD' }, (res) => {
            resolve({
                status: res.statusCode,
                server: res.headers.server || 'Unknown',
                location: res.headers.location || 'None'
            });
        });
        
        req.on('error', (error) => {
            resolve({ error: error.message });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ error: 'Timeout' });
        });
        
        req.end();
    });
}

async function monitorDomains() {
    console.log('🔍 Domain Resolution Monitor\n');
    console.log('⏰ Checking DNS propagation and GitHub Pages status...\n');
    
    for (const domain of domains) {
        console.log(`🌐 Checking ${domain}:`);
        
        // Check DNS resolution
        const dnsResult = await checkDNS(domain);
        console.log(`   DNS A Records: ${dnsResult.join(', ')}`);
        
        // Check HTTP response
        const httpResult = await checkHTTP(domain);
        if (httpResult.error) {
            console.log(`   HTTP Status: Error - ${httpResult.error}`);
        } else {
            console.log(`   HTTP Status: ${httpResult.status}`);
            console.log(`   Server: ${httpResult.server}`);
            
            // Check if pointing to GitHub Pages
            if (httpResult.server === 'GitHub.com') {
                console.log('   ✅ SUCCESS: Pointing to GitHub Pages!');
            } else if (httpResult.server === 'Squarespace') {
                console.log('   ⏳ PENDING: Still pointing to Squarespace (DNS propagating...)');
            } else {
                console.log(`   ⚠️  UNKNOWN: Unexpected server response`);
            }
        }
        console.log('');
    }
    
    // Check GitHub Pages directly
    console.log('🐙 GitHub Pages Direct Check:');
    for (const ghDomain of githubPages) {
        const httpResult = await checkHTTP(ghDomain);
        if (httpResult.error) {
            console.log(`   ${ghDomain}: Error - ${httpResult.error}`);
        } else {
            console.log(`   ${ghDomain}: HTTP ${httpResult.status} ✅`);
        }
    }
    
    console.log('\n📊 DNS Propagation Status:');
    console.log('   - DNS changes can take 10-60 minutes to propagate globally');
    console.log('   - GitHub Pages SSL certificates provision automatically');
    console.log('   - Monitor this script every 5-10 minutes for updates');
    console.log('\n💫 Sacred websites manifesting...');
}

// Expected GitHub Pages IP addresses
const expectedIPs = [
    '185.199.108.153',
    '185.199.109.153', 
    '185.199.110.153',
    '185.199.111.153'
];

async function checkExpectedDNS() {
    console.log('\n🎯 Expected vs Actual DNS Configuration:\n');
    
    for (const domain of domains) {
        console.log(`Domain: ${domain}`);
        const actualIPs = await checkDNS(domain);
        
        console.log(`   Expected IPs: ${expectedIPs.join(', ')}`);
        console.log(`   Actual IPs:   ${actualIPs.join(', ')}`);
        
        const isCorrect = expectedIPs.every(ip => actualIPs.includes(ip));
        console.log(`   DNS Status:   ${isCorrect ? '✅ Correct' : '⏳ Propagating'}`);
        console.log('');
    }
}

// Run the monitoring
monitorDomains().then(() => {
    return checkExpectedDNS();
}).catch(console.error);