/**
 * Sacred Security Protocols
 * 
 * Protecting the sanctuary while maintaining transparency and trust.
 * Security that serves consciousness, not surveillance.
 */

class SacredSecurityProtocol {
    constructor() {
        this.trustedDomains = [
            'luminousdynamics.org',
            'relationalharmonics.org', 
            'codexofrelationalharmonics.org'
        ];
        
        this.securityConfig = {
            enableCSP: true,
            enableSRI: true,
            enableHTTPS: true,
            enableRateLimiting: true,
            enableInputSanitization: true,
            enableSessionSecurity: true
        };

        this.initialize();
    }

    initialize() {
        this.setupContentSecurityPolicy();
        this.setupSubresourceIntegrity();
        this.enforceHTTPS();
        this.setupRateLimiting();
        this.setupInputSanitization();
        this.setupSessionSecurity();
        this.setupPrivacyProtections();
        this.monitorSecurityEvents();
    }

    // === CONTENT SECURITY POLICY ===
    // Protect against XSS while allowing sacred functionality

    setupContentSecurityPolicy() {
        if (!this.securityConfig.enableCSP) return;

        const cspPolicy = this.generateSacredCSP();
        
        // Set CSP via meta tag if not set by server
        if (!this.hasServerCSP()) {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = cspPolicy;
            document.head.appendChild(meta);
        }

        // Monitor CSP violations
        document.addEventListener('securitypolicyviolation', (e) => {
            this.handleCSPViolation(e);
        });
    }

    generateSacredCSP() {
        const trustedDomainList = this.trustedDomains.join(' ');
        
        return [
            `default-src 'self' ${trustedDomainList}`,
            `script-src 'self' 'unsafe-inline' ${trustedDomainList}`, // unsafe-inline needed for dynamic sacred content
            `style-src 'self' 'unsafe-inline' ${trustedDomainList}`,   // unsafe-inline needed for harmony-specific styling
            `img-src 'self' data: ${trustedDomainList}`,
            `font-src 'self' ${trustedDomainList}`,
            `connect-src 'self' ${trustedDomainList}`,
            `media-src 'self' ${trustedDomainList}`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `form-action 'self' ${trustedDomainList}`,
            `frame-ancestors 'none'`,
            `upgrade-insecure-requests`
        ].join('; ');
    }

    hasServerCSP() {
        const metas = document.getElementsByTagName('meta');
        for (let meta of metas) {
            if (meta.httpEquiv === 'Content-Security-Policy') {
                return true;
            }
        }
        return false;
    }

    handleCSPViolation(event) {
        const violation = {
            blockedURI: event.blockedURI,
            violatedDirective: event.violatedDirective,
            documentURI: event.documentURI,
            timestamp: Date.now()
        };

        console.warn('Sacred CSP Violation:', violation);
        
        // Log for security monitoring (without sending personal data)
        this.logSecurityEvent('csp_violation', violation);
    }

    // === SUBRESOURCE INTEGRITY ===
    // Ensure sacred scripts haven't been tampered with

    setupSubresourceIntegrity() {
        if (!this.securityConfig.enableSRI) return;

        const externalScripts = document.querySelectorAll('script[src]:not([integrity])');
        
        externalScripts.forEach(script => {
            if (this.isFromTrustedDomain(script.src)) {
                // For now, just add crossorigin attribute
                // In production, implement proper SRI hash generation
                script.crossOrigin = 'anonymous';
            }
        });
    }

    isFromTrustedDomain(url) {
        try {
            const urlObj = new URL(url);
            return this.trustedDomains.some(domain => 
                urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
            );
        } catch {
            return false;
        }
    }

    // === HTTPS ENFORCEMENT ===
    // Sacred content must travel over secure channels

    enforceHTTPS() {
        if (!this.securityConfig.enableHTTPS) return;

        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            // Redirect to HTTPS
            location.replace(`https:${location.href.substring(location.protocol.length)}`);
        }

        // Ensure all fetches use HTTPS
        const originalFetch = window.fetch;
        window.fetch = (url, options = {}) => {
            if (typeof url === 'string' && url.startsWith('http://')) {
                url = url.replace('http://', 'https://');
            }
            return originalFetch(url, options);
        };
    }

    // === RATE LIMITING ===
    // Protect against abuse while allowing contemplative pace

    setupRateLimiting() {
        if (!this.securityConfig.enableRateLimiting) return;

        this.rateLimits = {
            api: { requests: 100, window: 60000 }, // 100 requests per minute
            practice: { requests: 20, window: 60000 }, // 20 practice sessions per minute
            feedback: { requests: 10, window: 300000 } // 10 feedback submissions per 5 minutes
        };

        this.requestCounts = new Map();
        
        // Clear old entries periodically
        setInterval(() => this.cleanupRateLimitData(), 60000);
    }

    checkRateLimit(action, identifier = 'global') {
        if (!this.securityConfig.enableRateLimiting) return true;

        const limit = this.rateLimits[action];
        if (!limit) return true;

        const key = `${action}:${identifier}`;
        const now = Date.now();
        
        if (!this.requestCounts.has(key)) {
            this.requestCounts.set(key, []);
        }

        const requests = this.requestCounts.get(key);
        
        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => 
            now - timestamp < limit.window
        );
        
        if (validRequests.length >= limit.requests) {
            this.logSecurityEvent('rate_limit_exceeded', { action, identifier });
            return false;
        }

        validRequests.push(now);
        this.requestCounts.set(key, validRequests);
        return true;
    }

    cleanupRateLimitData() {
        const now = Date.now();
        
        for (const [key, requests] of this.requestCounts.entries()) {
            const action = key.split(':')[0];
            const limit = this.rateLimits[action];
            
            if (limit) {
                const validRequests = requests.filter(timestamp => 
                    now - timestamp < limit.window
                );
                
                if (validRequests.length === 0) {
                    this.requestCounts.delete(key);
                } else {
                    this.requestCounts.set(key, validRequests);
                }
            }
        }
    }

    // === INPUT SANITIZATION ===
    // Protect against XSS in user-generated content

    setupInputSanitization() {
        if (!this.securityConfig.enableInputSanitization) return;

        // Set up DOMPurify-style sanitization for sacred content
        this.setupSacredSanitization();
    }

    setupSacredSanitization() {
        // Sanitize any user input that gets inserted into the DOM
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string' && this.dataset.allowUnsafe !== 'true') {
                    value = window.sacredSecurityProtocol.sanitizeInput(value);
                }
                originalInnerHTML.set.call(this, value);
            },
            get: originalInnerHTML.get
        });
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // Basic XSS prevention - in production, use DOMPurify or similar
        const tempDiv = document.createElement('div');
        tempDiv.textContent = input;
        let sanitized = tempDiv.innerHTML;

        // Allow safe HTML tags for sacred content formatting
        const allowedTags = ['p', 'br', 'em', 'strong', 'span'];
        const allowedAttributes = ['class', 'data-sacred'];

        // Simple tag filtering (in production, use proper HTML sanitizer)
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/on\w+="[^"]*"/g, ''); // Remove event handlers
        sanitized = sanitized.replace(/javascript:/gi, ''); // Remove javascript: URIs

        return sanitized;
    }

    // === SESSION SECURITY ===
    // Protect user sessions and sacred state

    setupSessionSecurity() {
        if (!this.securityConfig.enableSessionSecurity) return;

        // Secure sacred session storage
        this.setupSecureStorage();
        
        // Monitor for session hijacking attempts
        this.monitorSessionSecurity();
    }

    setupSecureStorage() {
        // Override localStorage for sacred data to add encryption
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;

        localStorage.setItem = (key, value) => {
            if (key.startsWith('sacred_')) {
                value = this.encryptSacredData(value);
            }
            return originalSetItem.call(localStorage, key, value);
        };

        localStorage.getItem = (key) => {
            const value = originalGetItem.call(localStorage, key);
            if (key.startsWith('sacred_') && value) {
                return this.decryptSacredData(value);
            }
            return value;
        };
    }

    encryptSacredData(data) {
        // Simple XOR encryption for demo - use proper encryption in production
        const key = this.getEncryptionKey();
        let encrypted = '';
        
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        
        return btoa(encrypted); // Base64 encode
    }

    decryptSacredData(encryptedData) {
        try {
            const data = atob(encryptedData); // Base64 decode
            const key = this.getEncryptionKey();
            let decrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            
            return decrypted;
        } catch {
            return null;
        }
    }

    getEncryptionKey() {
        // Generate session-specific key
        let key = sessionStorage.getItem('sacred_session_key');
        if (!key) {
            key = this.generateRandomKey();
            sessionStorage.setItem('sacred_session_key', key);
        }
        return key;
    }

    generateRandomKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }

    monitorSessionSecurity() {
        // Monitor for multiple tabs/windows (potential session sharing)
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('sacred_session_monitor');
            
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'session_check') {
                    this.logSecurityEvent('multiple_sessions_detected', {
                        sessionId: event.data.sessionId
                    });
                }
            });

            // Announce this session
            channel.postMessage({
                type: 'session_check',
                sessionId: this.getSessionId()
            });
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sacred_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sacred_session_id', sessionId);
        }
        return sessionId;
    }

    // === PRIVACY PROTECTIONS ===
    // Honor user privacy while maintaining sacred container

    setupPrivacyProtections() {
        // Disable right-click context menu on sacred content (optional)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('[data-sacred-protected]')) {
                e.preventDefault();
            }
        });

        // Prevent text selection on certain sacred elements (optional)
        document.addEventListener('selectstart', (e) => {
            if (e.target.closest('[data-sacred-no-select]')) {
                e.preventDefault();
            }
        });

        // Monitor for developer tools (informational only)
        this.monitorDevTools();
    }

    monitorDevTools() {
        let devtools = { open: false, orientation: null };
        
        setInterval(() => {
            const threshold = 160;
            
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                
                if (!devtools.open) {
                    devtools.open = true;
                    this.logSecurityEvent('devtools_opened', { 
                        context: 'User opened developer tools',
                        note: 'This is not a security violation, just monitoring'
                    });
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // === SECURITY EVENT MONITORING ===
    // Track security events for learning and improvement

    monitorSecurityEvents() {
        // Monitor for common security-related events
        window.addEventListener('error', (e) => {
            this.logSecurityEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logSecurityEvent('unhandled_promise_rejection', {
                reason: e.reason?.toString()
            });
        });
    }

    logSecurityEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            data: data
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Sacred Security Event:', event);
        }

        // In production, this would send to security monitoring service
        // But only non-personal data for privacy compliance
        if (window.SacredAnalytics && process.env.NODE_ENV === 'production') {
            window.SacredAnalytics.trackSecurityEvent(event);
        }
    }

    // === PUBLIC API METHODS ===

    // Check if action is allowed under rate limiting
    isActionAllowed(action, identifier = 'global') {
        return this.checkRateLimit(action, identifier);
    }

    // Sanitize user input before displaying
    sanitizeUserInput(input) {
        return this.sanitizeInput(input);
    }

    // Get current security status
    getSecurityStatus() {
        return {
            https: location.protocol === 'https:',
            csp: this.securityConfig.enableCSP,
            integrity: this.securityConfig.enableSRI,
            rateLimiting: this.securityConfig.enableRateLimiting,
            inputSanitization: this.securityConfig.enableInputSanitization,
            sessionSecurity: this.securityConfig.enableSessionSecurity,
            sessionId: this.getSessionId()
        };
    }

    // Manual security check for sacred actions
    performSecurityCheck(action, context = {}) {
        const checks = {
            rateLimit: this.checkRateLimit(action, context.identifier),
            validOrigin: this.isFromTrustedDomain(window.location.href),
            secureConnection: location.protocol === 'https:' || location.hostname === 'localhost'
        };

        const passed = Object.values(checks).every(check => check === true);
        
        if (!passed) {
            this.logSecurityEvent('security_check_failed', { action, checks, context });
        }

        return {
            passed,
            checks,
            action,
            timestamp: Date.now()
        };
    }
}

// Initialize Sacred Security Protocol
if (typeof window !== 'undefined') {
    window.SacredSecurityProtocol = SacredSecurityProtocol;
    window.sacredSecurityProtocol = new SacredSecurityProtocol();
    
    // Make security methods available globally for convenience
    window.checkSacredSecurity = (action, context) => {
        return window.sacredSecurityProtocol.performSecurityCheck(action, context);
    };
    
    window.sanitizeSacredInput = (input) => {
        return window.sacredSecurityProtocol.sanitizeUserInput(input);
    };
}

export default SacredSecurityProtocol;