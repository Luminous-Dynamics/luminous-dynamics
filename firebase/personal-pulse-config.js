/**
 * Personal Pulse Firebase Configuration
 * Cloud-first deployment setup
 */

// Firestore Schema
export const firestoreSchema = {
    // User profiles with evolution tracking
    users: {
        '{userId}': {
            userId: 'string',
            createdAt: 'timestamp',
            evolutionLevel: 'string', // beginner|practitioner|keeper|weaver
            totalPractices: 'number',
            totalPracticeTime: 'number', // seconds
            evolutionMarkers: 'number',
            achievements: [
                {
                    type: 'string',
                    name: 'string',
                    awardedAt: 'timestamp',
                    context: 'object'
                }
            ],
            preferences: {
                sacredTiming: 'boolean',
                guidanceLevel: 'string',
                privacyMode: 'string'
            },
            fieldStats: {
                averageCoherence: 'number',
                peakCoherence: 'number',
                totalFieldContribution: 'number'
            },
            lastPractice: 'timestamp',
            
            // Subcollections
            insights: {
                '{insightId}': {
                    timestamp: 'timestamp',
                    text: 'string',
                    tags: ['string'],
                    coherenceLevel: 'number',
                    sessionId: 'string',
                    practiceContext: 'object'
                }
            }
        }
    },
    
    // Practice sessions with real-time tracking
    sessions: {
        '{sessionId}': {
            userId: 'string',
            practiceType: 'string',
            practiceId: 'string',
            startTime: 'timestamp',
            endTime: 'timestamp',
            status: 'string', // active|completed|abandoned
            metadata: 'object',
            stats: {
                averageCoherence: 'number',
                peakCoherence: 'number',
                minCoherence: 'number',
                totalReadings: 'number',
                fieldContribution: 'number',
                insights: 'number',
                stateTransitions: 'number'
            },
            fieldContribution: 'number',
            device: 'object',
            
            // Subcollections
            coherenceReadings: {
                '{readingId}': {
                    timestamp: 'timestamp',
                    coherence: 'number',
                    breathRate: 'number',
                    heartCoherence: 'number',
                    fieldResonance: 'number',
                    device: 'object'
                }
            },
            
            stateTransitions: {
                '{transitionId}': {
                    timestamp: 'timestamp',
                    from: 'string',
                    to: 'string',
                    catalyst: 'string',
                    coherenceAtTransition: 'number'
                }
            },
            
            insights: {
                '{insightId}': {
                    timestamp: 'timestamp',
                    text: 'string',
                    tags: ['string'],
                    coherenceLevel: 'number',
                    practiceContext: 'object'
                }
            }
        }
    },
    
    // Global field state
    global: {
        fieldState: {
            lastUpdated: 'timestamp',
            globalCoherence: 'number',
            activeParticipants: 'number',
            totalSessions: 'number',
            fieldMomentum: 'string', // rising|stable|falling
            peakCoherence24h: 'number',
            collectiveInsights: 'number',
            sacredPulse: {
                rhythm: 'number', // 11 seconds
                strength: 'number',
                synchronicity: 'number'
            }
        }
    },
    
    // Field contributions for aggregation
    fieldContributions: {
        '{contributionId}': {
            userId: 'string',
            sessionId: 'string',
            coherence: 'number',
            timestamp: 'timestamp',
            impact: 'number'
        }
    },
    
    // Global announcements (milestones, etc)
    globalAnnouncements: {
        '{announcementId}': {
            type: 'string',
            userId: 'string',
            timestamp: 'timestamp',
            data: 'object'
        }
    }
};

// Realtime Database Schema (for presence)
export const realtimeDbSchema = {
    presence: {
        '{userId}': {
            userId: 'string',
            sessionId: 'string',
            lastSeen: 'timestamp',
            coherence: 'number',
            status: 'string'
        }
    },
    
    activeSessions: {
        '{sessionId}': {
            userId: 'string',
            practiceType: 'string',
            lastSeen: 'timestamp',
            coherence: 'number',
            status: 'string'
        }
    },
    
    globalField: {
        participants: {
            '{userId}': {
                userId: 'string',
                joinedAt: 'timestamp',
                coherence: 'number',
                practiceType: 'string'
            }
        },
        
        pulseWave: {
            current: 'number',
            amplitude: 'number',
            phase: 'number',
            lastPulse: 'timestamp'
        }
    }
};

// Firebase Security Rules
export const securityRules = {
    firestore: `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Insights subcollection
      match /insights/{insightId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Sessions - users can only access their own
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // Subcollections inherit parent permissions
      match /{subcollection}/{documentId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/sessions/$(sessionId)).data.userId;
      }
    }
    
    // Global field state - read only
    match /global/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
    
    // Field contributions - write only for authenticated users
    match /fieldContributions/{contributionId} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow read: if false; // Only cloud functions read these
    }
    
    // Global announcements - read only
    match /globalAnnouncements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
  }
}`,

    realtimeDatabase: `
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    
    "activeSessions": {
      "$sessionId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    
    "globalField": {
      "participants": {
        ".read": "auth != null",
        "$uid": {
          ".write": "auth != null && auth.uid == $uid"
        }
      },
      
      "pulseWave": {
        ".read": "auth != null",
        ".write": false
      }
    }
  }
}`
};

// Cloud Function triggers
export const cloudFunctionTriggers = {
    // Process session completion
    onSessionComplete: 'sessions/{sessionId}',
    
    // Update global field every minute
    scheduledFieldUpdate: 'every 1 minutes',
    
    // Process field contributions
    onFieldContribution: 'fieldContributions/{contributionId}',
    
    // Handle user milestones
    onUserUpdate: 'users/{userId}',
    
    // Aggregate coherence patterns
    scheduledPatternAnalysis: 'every 5 minutes'
};

// Indexes for efficient queries
export const firestoreIndexes = [
    {
        collectionGroup: 'sessions',
        fields: [
            { field: 'userId', order: 'ASCENDING' },
            { field: 'startTime', order: 'DESCENDING' }
        ]
    },
    {
        collectionGroup: 'coherenceReadings',
        fields: [
            { field: 'timestamp', order: 'DESCENDING' }
        ]
    },
    {
        collectionGroup: 'insights',
        fields: [
            { field: 'userId', order: 'ASCENDING' },
            { field: 'timestamp', order: 'DESCENDING' }
        ]
    },
    {
        collectionGroup: 'fieldContributions',
        fields: [
            { field: 'timestamp', order: 'DESCENDING' },
            { field: 'impact', order: 'DESCENDING' }
        ]
    }
];

// Storage buckets for large data
export const storageBuckets = {
    // Biometric data streams
    biometrics: 'personal-pulse-biometrics',
    
    // Session recordings (audio/video if enabled)
    recordings: 'personal-pulse-recordings',
    
    // Exported user data
    exports: 'personal-pulse-exports'
};

// API Configuration
export const apiConfig = {
    // Public endpoints
    public: [
        '/api/field/state',
        '/api/field/pulse'
    ],
    
    // Authenticated endpoints
    authenticated: [
        '/api/session/start',
        '/api/session/coherence',
        '/api/session/complete',
        '/api/user/progress',
        '/api/user/export'
    ],
    
    // Admin only
    admin: [
        '/api/admin/analytics',
        '/api/admin/users',
        '/api/admin/field/reset'
    ]
};

// Environment variables
export const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'GOOGLE_APPLICATION_CREDENTIALS' // For cloud functions
];

// Monitoring and alerts
export const monitoring = {
    alerts: [
        {
            name: 'High Global Coherence',
            condition: 'globalCoherence > 0.9',
            notification: 'email'
        },
        {
            name: 'Low Participation',
            condition: 'activeParticipants < 10',
            notification: 'slack'
        },
        {
            name: 'System Error Rate',
            condition: 'errorRate > 0.05',
            notification: 'pagerduty'
        }
    ],
    
    dashboards: [
        'Global Field Coherence',
        'Active Practitioners',
        'Evolution Progress Distribution',
        'System Health Metrics'
    ]
};

export default {
    firestoreSchema,
    realtimeDbSchema,
    securityRules,
    cloudFunctionTriggers,
    firestoreIndexes,
    storageBuckets,
    apiConfig,
    requiredEnvVars,
    monitoring
};