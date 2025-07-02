/**
 * Sacred Passport System
 * 
 * A privacy-first identity system that allows souls to be recognized
 * across the three chambers while maintaining complete sovereignty
 * over their personal data and journey.
 */

class SacredPassport {
    constructor() {
        this.storageKey = 'sacred_passport_v1';
        this.domains = [
            'evolvingresonantcocreationism.com',
            'luminousdynamics.org', 
            'relationalharmonics.org'
        ];
        
        this.initializePassport();
    }

    // Core Identity Generation
    generatePassportId() {
        // Create a beautiful, meaningful identifier
        const timestamp = Date.now();
        const entropy = crypto.getRandomValues(new Uint32Array(2));
        const celestialSeed = this.generateCelestialSeed();
        
        const passportId = `soul_${celestialSeed}_${timestamp.toString(36)}_${entropy[0].toString(36)}`;
        
        return {
            id: passportId,
            created: timestamp,
            celestialSeed: celestialSeed,
            domains: [],
            consent: {
                dataSharing: false,
                crossDomainTracking: false,
                analyticsParticipation: false
            }
        };
    }

    generateCelestialSeed() {
        // Generate a poetic celestial identifier
        const constellations = [
            'andromeda', 'cassiopeia', 'orion', 'lyra', 'cygnus', 'aquila',
            'phoenix', 'draco', 'pegasus', 'ursa', 'corona', 'vega'
        ];
        
        const qualities = [
            'luminous', 'resonant', 'coherent', 'flowing', 'awakening',
            'present', 'sacred', 'conscious', 'peaceful', 'wise'
        ];
        
        const constellation = constellations[Math.floor(Math.random() * constellations.length)];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        
        return `${quality}_${constellation}`;
    }

    // Cross-Domain Recognition System
    establishCrossDomainIdentity(domain) {
        const passport = this.getPassport();
        
        if (!passport.domains.includes(domain)) {
            passport.domains.push(domain);
            passport.lastSeen = Date.now();
            this.savePassport(passport);
            
            // Broadcast identity to other domains (with consent)
            if (passport.consent.crossDomainTracking) {
                this.syncWithDomains(passport);
            }
        }
        
        return passport;
    }

    // Privacy-First Cross-Domain Sync
    syncWithDomains(passport) {
        // Only sync essential journey state, never personal data
        const syncData = {
            passportId: passport.id,
            fieldCoherence: window.SacredField?.getState().fieldCoherence || 0,
            journeyPhase: this.determineJourneyPhase(),
            timestamp: Date.now()
        };
        
        // Use postMessage API for secure cross-origin communication
        this.domains.forEach(domain => {
            if (domain !== window.location.hostname) {
                this.sendSacredMessage(domain, 'passport_sync', syncData);
            }
        });
    }

    sendSacredMessage(targetDomain, messageType, data) {
        // Create a hidden iframe for secure cross-domain communication
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://${targetDomain}/unified-field/receiver.html`;
        
        iframe.onload = () => {
            iframe.contentWindow.postMessage({
                type: 'sacred_message',
                messageType: messageType,
                data: data,
                from: window.location.hostname
            }, `https://${targetDomain}`);
            
            // Clean up after message sent
            setTimeout(() => document.body.removeChild(iframe), 1000);
        };
        
        document.body.appendChild(iframe);
    }

    // Consent Management
    updateConsent(consentType, granted) {
        const passport = this.getPassport();
        passport.consent[consentType] = granted;
        passport.consentUpdated = Date.now();
        
        this.savePassport(passport);
        
        // If consent withdrawn, notify other domains to purge data
        if (!granted && consentType === 'crossDomainTracking') {
            this.requestDataPurge();
        }
        
        return passport;
    }

    requestDataPurge() {
        const passport = this.getPassport();
        
        this.domains.forEach(domain => {
            if (domain !== window.location.hostname) {
                this.sendSacredMessage(domain, 'data_purge_request', {
                    passportId: passport.id
                });
            }
        });
    }

    // Journey Phase Detection
    determineJourneyPhase() {
        if (!window.SacredField) return 'unknown';
        
        const state = window.SacredField.getState();
        const { visitedChambers, fieldCoherence, aiEncounters, practicedGlyphs } = state;
        
        if (visitedChambers.length === 0) return 'threshold';
        if (visitedChambers.length === 1) return 'first_chamber';
        if (aiEncounters === 0) return 'pre_encounter';
        if (practicedGlyphs.length === 0) return 'understanding';
        if (fieldCoherence > 0.7) return 'embodiment';
        
        return 'integration';
    }

    // Sacred Identity Display
    generateSacredName() {
        const passport = this.getPassport();
        const parts = passport.celestialSeed.split('_');
        
        return {
            constellation: parts[1],
            quality: parts[0],
            displayName: `${parts[0]} of ${parts[1]}`,
            shortName: parts[1]
        };
    }

    // Temporary Session Identity (for non-committed visitors)
    createSessionIdentity() {
        // For visitors who haven't committed to the journey
        const sessionId = Math.random().toString(36).substring(2, 10);
        const tempName = this.generateCelestialSeed();
        
        return {
            isTemporary: true,
            sessionId: sessionId,
            displayName: tempName,
            created: Date.now()
        };
    }

    // Data Sovereignty Tools
    exportPassportData() {
        const passport = this.getPassport();
        const sacredState = window.SacredField?.getState() || {};
        
        const exportData = {
            passport: passport,
            journeyState: sacredState,
            exportDate: new Date().toISOString(),
            version: '1.0',
            note: 'Your complete Sacred Field journey data'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        return {
            blob: blob,
            filename: `sacred-journey-${passport.celestialSeed}-${Date.now()}.json`,
            url: URL.createObjectURL(blob)
        };
    }

    importPassportData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            if (importedData.passport && importedData.journeyState) {
                // Restore passport
                this.savePassport(importedData.passport);
                
                // Restore journey state
                if (window.SacredField) {
                    localStorage.setItem('sacred_field_state', JSON.stringify(importedData.journeyState));
                    window.SacredField.initializeState();
                }
                
                return { success: true, message: 'Sacred journey restored' };
            }
        } catch (error) {
            return { success: false, message: 'Invalid journey data format' };
        }
    }

    deletePassport() {
        // Complete data deletion
        localStorage.removeItem(this.storageKey);
        
        if (window.SacredField) {
            window.SacredField.clearSacredState();
        }
        
        // Request deletion from other domains
        this.requestDataPurge();
        
        return { success: true, message: 'Sacred identity completely removed' };
    }

    // Core Storage Methods
    getPassport() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.warn('Could not load passport:', error);
            return null;
        }
    }

    savePassport(passport) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(passport));
            return true;
        } catch (error) {
            console.warn('Could not save passport:', error);
            return false;
        }
    }

    initializePassport() {
        let passport = this.getPassport();
        
        if (!passport) {
            passport = this.generatePassportId();
            this.savePassport(passport);
        }
        
        // Establish identity on current domain
        this.establishCrossDomainIdentity(window.location.hostname);
        
        return passport;
    }

    // Public API for Sacred Field Integration
    getIdentity() {
        const passport = this.getPassport();
        if (!passport) return this.createSessionIdentity();
        
        const sacredName = this.generateSacredName();
        
        return {
            passportId: passport.id,
            celestialSeed: passport.celestialSeed,
            displayName: sacredName.displayName,
            shortName: sacredName.shortName,
            constellation: sacredName.constellation,
            quality: sacredName.quality,
            journeyPhase: this.determineJourneyPhase(),
            created: passport.created,
            isTemporary: false
        };
    }

    // Privacy Dashboard
    getPrivacyStatus() {
        const passport = this.getPassport();
        
        return {
            hasPassport: !!passport,
            consent: passport?.consent || {},
            domainsVisited: passport?.domains || [],
            dataRetention: this.calculateDataRetention(),
            exportAvailable: true,
            deleteAvailable: true
        };
    }

    calculateDataRetention() {
        const passport = this.getPassport();
        if (!passport) return 'none';
        
        const daysSinceCreation = (Date.now() - passport.created) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreation < 1) return 'hours';
        if (daysSinceCreation < 30) return 'days';
        if (daysSinceCreation < 365) return 'months';
        return 'years';
    }
}

// Message Receiver for Cross-Domain Communication
class SacredMessageReceiver {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            // Verify message is from trusted Sacred Field domain
            const trustedDomains = [
                'https://evolvingresonantcocreationism.com',
                'https://luminousdynamics.org',
                'https://relationalharmonics.org'
            ];
            
            if (!trustedDomains.some(domain => event.origin.startsWith(domain))) {
                return;
            }
            
            if (event.data.type === 'sacred_message') {
                this.handleSacredMessage(event.data);
            }
        });
    }

    handleSacredMessage(message) {
        switch (message.messageType) {
            case 'passport_sync':
                this.handlePassportSync(message.data);
                break;
            case 'data_purge_request':
                this.handleDataPurge(message.data);
                break;
        }
    }

    handlePassportSync(data) {
        // Update local field state with cross-domain data
        if (window.SacredField && data.passportId) {
            const currentState = window.SacredField.getState();
            
            // Only sync if we recognize this passport
            const passport = window.SacredPassport?.getPassport();
            if (passport?.id === data.passportId) {
                window.SacredField.updateState({
                    crossDomainSync: data,
                    lastSync: Date.now()
                });
            }
        }
    }

    handleDataPurge(data) {
        // Remove all data for the specified passport ID
        const passport = window.SacredPassport?.getPassport();
        if (passport?.id === data.passportId) {
            window.SacredPassport?.deletePassport();
        }
    }
}

// Global Sacred Passport Instance
if (typeof window !== 'undefined') {
    window.SacredPassport = window.SacredPassport || new SacredPassport();
    window.SacredMessageReceiver = window.SacredMessageReceiver || new SacredMessageReceiver();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SacredPassport, SacredMessageReceiver };
}