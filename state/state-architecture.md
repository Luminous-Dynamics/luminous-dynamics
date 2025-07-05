# LuminousOS State Management Architecture

## Overview
A consciousness-aware state management system using Zustand, designed for real-time coherence tracking, sacred practice management, and multi-user synchronization.

## Core Principles
1. **State as Living Field**: State changes ripple through the system like energy
2. **Coherence-Driven Updates**: State mutations respect system coherence
3. **Sacred Persistence**: Important moments are preserved with intention
4. **Optimistic Spirituality**: Trust the process, verify the results
5. **Collective Consciousness**: State can be shared across networked instances

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Application State                     │
├─────────────────┬──────────────┬───────────────────────┤
│   Core Stores   │ Domain Stores│   Feature Stores      │
├─────────────────┼──────────────┼───────────────────────┤
│ • AuthStore     │ • GlyphStore │ • NetworkStore        │
│ • CoherenceStore│ • PracticeStore│ • CeremonyStore     │
│ • UIStore       │ • MessageStore│ • AIStore            │
│                 │              │ • QuantumStore        │
├─────────────────┴──────────────┴───────────────────────┤
│                  Middleware Layer                        │
│  • Persistence  • Logging  • DevTools  • Sync          │
├─────────────────────────────────────────────────────────┤
│                  State Bridge Layer                      │
│  • WebSocket Sync • Offline Queue • Conflict Resolution │
└─────────────────────────────────────────────────────────┘
```

## Store Implementations

### 1. Core Authentication Store
```typescript
// stores/auth.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface AuthState {
  // State
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  coherenceUnlocked: boolean
  sacredName: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  checkCoherenceGate: () => Promise<boolean>
  logout: () => Promise<void>
  
  // Subscriptions
  subscribeToAuthChanges: () => () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: true,
        coherenceUnlocked: false,
        sacredName: null,
        
        // Actions
        setUser: (user) => set((state) => {
          state.user = user
          state.isAuthenticated = !!user
          state.sacredName = user?.user_metadata?.sacred_name || null
        }),
        
        setSession: (session) => set((state) => {
          state.session = session
          state.isAuthenticated = !!session
        }),
        
        updateProfile: async (updates) => {
          const { user } = get()
          if (!user) throw new Error('No user logged in')
          
          const { error } = await supabase.auth.updateUser({
            data: updates
          })
          
          if (error) throw error
          
          set((state) => {
            if (state.user) {
              state.user.user_metadata = {
                ...state.user.user_metadata,
                ...updates
              }
            }
          })
        },
        
        checkCoherenceGate: async () => {
          const { user } = get()
          if (!user) return false
          
          const coherence = await getCurrentCoherence(user.id)
          const unlocked = coherence >= 0.6
          
          set((state) => {
            state.coherenceUnlocked = unlocked
          })
          
          return unlocked
        },
        
        logout: async () => {
          // Graceful cleanup
          await saveStateBeforeLogout()
          await supabase.auth.signOut()
          
          set((state) => {
            state.user = null
            state.session = null
            state.isAuthenticated = false
            state.coherenceUnlocked = false
            state.sacredName = null
          })
        },
        
        subscribeToAuthChanges: () => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              set((state) => {
                state.session = session
                state.user = session?.user || null
                state.isAuthenticated = !!session
                state.isLoading = false
              })
              
              if (event === 'SIGNED_IN') {
                get().checkCoherenceGate()
              }
            }
          )
          
          return () => subscription.unsubscribe()
        }
      })),
      {
        name: 'luminous-auth',
        partialize: (state) => ({
          sacredName: state.sacredName,
          coherenceUnlocked: state.coherenceUnlocked
        })
      }
    ),
    { name: 'AuthStore' }
  )
)
```

### 2. Coherence Tracking Store
```typescript
// stores/coherence.store.ts
interface CoherenceState {
  // Current readings
  personal: number
  network: number
  field: number
  
  // Biometric data
  heartRate: number
  hrv: number
  breathRate: number
  breathPhase: number // 0-1, where 0=exhale, 1=inhale
  
  // History
  history: CoherenceReading[]
  milestones: CoherenceMilestone[]
  
  // Statistics
  average: number
  trend: 'rising' | 'falling' | 'stable'
  peakToday: number
  sessionStart: number
  
  // Actions
  updateCoherence: (data: Partial<CoherenceReading>) => void
  addReading: (reading: CoherenceReading) => void
  calculateTrend: () => void
  saveToDatabase: () => Promise<void>
  loadHistory: (userId: string) => Promise<void>
  
  // Subscriptions
  subscribeToNetwork: () => () => void
  subscribeToBiometrics: () => () => void
}

export const useCoherenceStore = create<CoherenceState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        personal: 0.7,
        network: 0.85,
        field: 0.6,
        heartRate: 70,
        hrv: 50,
        breathRate: 12,
        breathPhase: 0.5,
        history: [],
        milestones: [],
        average: 0.7,
        trend: 'stable',
        peakToday: 0.7,
        sessionStart: 0.7,
        
        // Actions
        updateCoherence: (data) => set((state) => {
          Object.assign(state, data)
          
          // Auto-calculate quantum correlation
          if (window.quantumBridge && data.personal !== undefined) {
            state.quantumCorrelation = window.quantumBridge.coupling.correlation
          }
        }),
        
        addReading: (reading) => set((state) => {
          state.history.push(reading)
          
          // Keep only last 1000 readings in memory
          if (state.history.length > 1000) {
            state.history.shift()
          }
          
          // Update current values
          state.personal = reading.personal_coherence
          state.network = reading.network_coherence || state.network
          state.field = reading.field_coherence || state.field
          
          // Update peak
          if (reading.personal_coherence > state.peakToday) {
            state.peakToday = reading.personal_coherence
          }
          
          // Check for milestones
          get().checkMilestones(reading.personal_coherence)
        }),
        
        calculateTrend: () => set((state) => {
          if (state.history.length < 10) {
            state.trend = 'stable'
            return
          }
          
          const recent = state.history.slice(-10)
          const older = state.history.slice(-20, -10)
          
          const recentAvg = average(recent.map(r => r.personal_coherence))
          const olderAvg = average(older.map(r => r.personal_coherence))
          
          if (recentAvg > olderAvg + 0.05) {
            state.trend = 'rising'
          } else if (recentAvg < olderAvg - 0.05) {
            state.trend = 'falling'
          } else {
            state.trend = 'stable'
          }
        }),
        
        saveToDatabase: async () => {
          const state = get()
          const user = useAuthStore.getState().user
          if (!user) return
          
          const reading: CoherenceReading = {
            user_id: user.id,
            personal_coherence: state.personal,
            network_coherence: state.network,
            field_coherence: state.field,
            heart_rate: state.heartRate,
            hrv: state.hrv,
            breath_rate: state.breathRate,
            timestamp: new Date().toISOString()
          }
          
          await supabase.from('coherence_readings').insert(reading)
        },
        
        loadHistory: async (userId) => {
          const { data, error } = await supabase
            .from('coherence_readings')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false })
            .limit(100)
          
          if (!error && data) {
            set((state) => {
              state.history = data.reverse()
              state.calculateTrend()
            })
          }
        },
        
        checkMilestones: (coherence: number) => {
          const milestones = [
            { threshold: 0.8, type: 'first_80', message: 'First 80% coherence!' },
            { threshold: 0.9, type: 'first_90', message: 'First 90% coherence!' },
            { threshold: 0.95, type: 'first_95', message: 'Peak coherence achieved!' }
          ]
          
          milestones.forEach(milestone => {
            if (coherence >= milestone.threshold) {
              const achieved = get().milestones.find(m => m.type === milestone.type)
              if (!achieved) {
                set((state) => {
                  state.milestones.push({
                    type: milestone.type,
                    achievedAt: new Date(),
                    value: coherence
                  })
                })
                
                // Show celebration
                if (window.showMessage) {
                  window.showMessage(`🎉 ${milestone.message}`)
                }
              }
            }
          })
        },
        
        subscribeToNetwork: () => {
          if (!window.networkClient) return () => {}
          
          window.networkClient.onCoherenceUpdate = (coherence) => {
            set((state) => {
              state.network = coherence.network
              state.field = coherence.field
            })
          }
          
          return () => {
            if (window.networkClient) {
              window.networkClient.onCoherenceUpdate = null
            }
          }
        },
        
        subscribeToBiometrics: () => {
          if (!window.biometrics) return () => {}
          
          window.biometrics.addListener((data) => {
            set((state) => {
              state.heartRate = data.heartRate
              state.hrv = data.hrv
              state.breathRate = data.breathRate
              state.breathPhase = data.breathPhase
              state.personal = data.coherence
            })
          })
          
          return () => {
            // Remove listener
          }
        }
      })),
      {
        name: 'luminous-coherence',
        partialize: (state) => ({
          personal: state.personal,
          peakToday: state.peakToday,
          milestones: state.milestones
        })
      }
    ),
    { name: 'CoherenceStore' }
  )
)
```

### 3. Glyph Practice Store
```typescript
// stores/glyph.store.ts
interface GlyphState {
  // Current practice
  activeGlyph: Glyph | null
  practiceStartTime: Date | null
  practicePhase: 'preparing' | 'practicing' | 'integrating' | null
  
  // Practice history
  practiceHistory: GlyphPractice[]
  masteryLevels: Map<string, GlyphMastery>
  
  // Available glyphs
  availableGlyphs: Glyph[]
  unlockedGlyphs: Set<string>
  favoriteGlyphs: Set<string>
  
  // Actions
  startPractice: (glyphId: string) => Promise<void>
  endPractice: (insights?: string[]) => Promise<void>
  updateMastery: (glyphId: string) => void
  loadGlyphLibrary: () => Promise<void>
  unlockGlyph: (glyphId: string) => void
  toggleFavorite: (glyphId: string) => void
  
  // Computed
  getGlyphsByCoherence: (coherence: number) => Glyph[]
  getNextRecommendedGlyph: () => Glyph | null
}

export const useGlyphStore = create<GlyphState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        activeGlyph: null,
        practiceStartTime: null,
        practicePhase: null,
        practiceHistory: [],
        masteryLevels: new Map(),
        availableGlyphs: [],
        unlockedGlyphs: new Set(['Ω0', 'Ω1', 'Ω2']), // Start with basics
        favoriteGlyphs: new Set(),
        
        // Actions
        startPractice: async (glyphId) => {
          const glyph = get().availableGlyphs.find(g => g.id === glyphId)
          if (!glyph) throw new Error('Glyph not found')
          
          const coherence = useCoherenceStore.getState().personal
          if (coherence < glyph.coherence_required) {
            throw new Error(`Requires ${glyph.coherence_required} coherence`)
          }
          
          set((state) => {
            state.activeGlyph = glyph
            state.practiceStartTime = new Date()
            state.practicePhase = 'preparing'
          })
          
          // Start binaural beat if configured
          if (glyph.frequency && window.sacredAI) {
            const frequencies = {
              174: 'grounding',
              285: 'healing',
              396: 'transformation',
              528: 'love',
              741: 'expression',
              852: 'enlightenment',
              963: 'unity'
            }
            
            const frequency = frequencies[glyph.frequency] || 'love'
            window.sacredAI.startBinauralBeat(frequency)
          }
          
          // Announce to network
          if (window.networkClient?.connected) {
            window.networkClient.announceGlyphPractice(glyphId, glyph.name)
          }
          
          // Start practice phase after preparation
          setTimeout(() => {
            set((state) => {
              state.practicePhase = 'practicing'
            })
          }, 3000)
        },
        
        endPractice: async (insights = []) => {
          const state = get()
          if (!state.activeGlyph || !state.practiceStartTime) return
          
          const endTime = new Date()
          const duration = endTime.getTime() - state.practiceStartTime.getTime()
          const coherenceState = useCoherenceStore.getState()
          
          const practice: GlyphPractice = {
            user_id: useAuthStore.getState().user?.id,
            glyph_id: state.activeGlyph.id,
            started_at: state.practiceStartTime.toISOString(),
            completed_at: endTime.toISOString(),
            duration: duration,
            starting_coherence: coherenceState.sessionStart,
            ending_coherence: coherenceState.personal,
            peak_coherence: coherenceState.peakToday,
            practice_quality: calculatePracticeQuality(coherenceState),
            insights: insights
          }
          
          // Save to database
          await supabase.from('glyph_practices').insert(practice)
          
          // Update mastery
          get().updateMastery(state.activeGlyph.id)
          
          // Stop binaural beat
          if (window.sacredAI?.binauralGenerator?.isPlaying) {
            window.sacredAI.stopBinauralBeat()
          }
          
          set((state) => {
            state.practiceHistory.push(practice)
            state.activeGlyph = null
            state.practiceStartTime = null
            state.practicePhase = 'integrating'
            
            // Clear phase after integration
            setTimeout(() => {
              set((state) => {
                state.practicePhase = null
              })
            }, 5000)
          })
        },
        
        updateMastery: (glyphId) => set((state) => {
          const mastery = state.masteryLevels.get(glyphId) || {
            glyph_id: glyphId,
            times_practiced: 0,
            total_duration: 0,
            average_coherence: 0,
            mastery_level: 0
          }
          
          const practices = state.practiceHistory.filter(p => p.glyph_id === glyphId)
          
          mastery.times_practiced = practices.length
          mastery.total_duration = practices.reduce((sum, p) => sum + p.duration, 0)
          mastery.average_coherence = average(practices.map(p => p.ending_coherence))
          
          // Calculate mastery level (0-5)
          if (mastery.times_practiced >= 100 && mastery.average_coherence >= 0.9) {
            mastery.mastery_level = 5
          } else if (mastery.times_practiced >= 50 && mastery.average_coherence >= 0.8) {
            mastery.mastery_level = 4
          } else if (mastery.times_practiced >= 20 && mastery.average_coherence >= 0.7) {
            mastery.mastery_level = 3
          } else if (mastery.times_practiced >= 10 && mastery.average_coherence >= 0.6) {
            mastery.mastery_level = 2
          } else if (mastery.times_practiced >= 5) {
            mastery.mastery_level = 1
          }
          
          state.masteryLevels.set(glyphId, mastery)
          
          // Check for new unlocks
          if (mastery.mastery_level >= 3) {
            // Unlock related glyphs
            const glyph = state.availableGlyphs.find(g => g.id === glyphId)
            if (glyph?.unlocks) {
              glyph.unlocks.forEach(unlockedId => {
                state.unlockedGlyphs.add(unlockedId)
              })
            }
          }
        }),
        
        loadGlyphLibrary: async () => {
          // Load from static data or API
          const glyphs = await loadAllGlyphs()
          
          set((state) => {
            state.availableGlyphs = glyphs
          })
        },
        
        unlockGlyph: (glyphId) => set((state) => {
          state.unlockedGlyphs.add(glyphId)
          
          // Celebration
          const glyph = state.availableGlyphs.find(g => g.id === glyphId)
          if (glyph && window.showMessage) {
            window.showMessage(`🔓 Unlocked: ${glyph.name}`)
          }
        }),
        
        toggleFavorite: (glyphId) => set((state) => {
          if (state.favoriteGlyphs.has(glyphId)) {
            state.favoriteGlyphs.delete(glyphId)
          } else {
            state.favoriteGlyphs.add(glyphId)
          }
        }),
        
        // Computed
        getGlyphsByCoherence: (coherence) => {
          const state = get()
          return state.availableGlyphs.filter(glyph => 
            coherence >= glyph.coherence_required &&
            state.unlockedGlyphs.has(glyph.id)
          )
        },
        
        getNextRecommendedGlyph: () => {
          const state = get()
          const coherence = useCoherenceStore.getState().personal
          
          // Find glyphs user hasn't mastered yet
          const unmasteredGlyphs = state.availableGlyphs.filter(glyph => {
            const mastery = state.masteryLevels.get(glyph.id)
            return (!mastery || mastery.mastery_level < 3) &&
                   coherence >= glyph.coherence_required &&
                   state.unlockedGlyphs.has(glyph.id)
          })
          
          // Sort by coherence requirement (ascending) to suggest easier ones first
          unmasteredGlyphs.sort((a, b) => a.coherence_required - b.coherence_required)
          
          return unmasteredGlyphs[0] || null
        }
      })),
      {
        name: 'luminous-glyphs',
        partialize: (state) => ({
          masteryLevels: Array.from(state.masteryLevels.entries()),
          unlockedGlyphs: Array.from(state.unlockedGlyphs),
          favoriteGlyphs: Array.from(state.favoriteGlyphs)
        })
      }
    ),
    { name: 'GlyphStore' }
  )
)
```

### 4. Network & Sacred Messages Store
```typescript
// stores/network.store.ts
interface NetworkState {
  // Connection
  connected: boolean
  connectionId: string | null
  reconnectAttempts: number
  
  // Peers
  activePeers: Map<string, NetworkPeer>
  peerCount: number
  
  // Messages
  messages: SacredMessage[]
  unreadCount: number
  
  // Ceremonies
  activeCeremonies: GroupCeremony[]
  currentCeremony: GroupCeremony | null
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  sendMessage: (content: string, to?: string, type?: MessageType) => Promise<void>
  markMessageRead: (messageId: string) => void
  joinCeremony: (ceremonyId: string) => Promise<void>
  leaveCeremony: () => Promise<void>
  
  // Subscriptions
  subscribeToNetworkEvents: () => () => void
}

export const useNetworkStore = create<NetworkState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      connected: false,
      connectionId: null,
      reconnectAttempts: 0,
      activePeers: new Map(),
      peerCount: 0,
      messages: [],
      unreadCount: 0,
      activeCeremonies: [],
      currentCeremony: null,
      
      // Actions
      connect: async () => {
        if (get().connected) return
        
        set((state) => {
          state.reconnectAttempts++
        })
        
        try {
          // Initialize network client
          if (!window.networkClient) {
            window.networkClient = new LuminousNetworkClient({
              wsUrl: WS_URL,
              nodeId: `luminous-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
            })
          }
          
          // Set up event handlers
          get().subscribeToNetworkEvents()
          
          set((state) => {
            state.connected = true
            state.reconnectAttempts = 0
          })
        } catch (error) {
          console.error('Network connection failed:', error)
          
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, get().reconnectAttempts), 30000)
          setTimeout(() => get().connect(), delay)
        }
      },
      
      disconnect: () => {
        if (window.networkClient) {
          window.networkClient.disconnect()
        }
        
        set((state) => {
          state.connected = false
          state.connectionId = null
          state.activePeers.clear()
          state.peerCount = 0
        })
      },
      
      sendMessage: async (content, to, type = 'sacred') => {
        const user = useAuthStore.getState().user
        if (!user || !window.networkClient?.connected) {
          throw new Error('Not connected')
        }
        
        const message: SacredMessage = {
          id: `msg-${Date.now()}`,
          from_user: user.id,
          to_user: to || null,
          message_type: type,
          content: content,
          sent_at: new Date().toISOString(),
          blessing: generateBlessing()
        }
        
        // Send via network
        window.networkClient.sendSacredMessage(content, to)
        
        // Save to local state
        set((state) => {
          state.messages.push(message)
        })
        
        // Save to database
        await supabase.from('sacred_messages').insert(message)
      },
      
      markMessageRead: (messageId) => set((state) => {
        const message = state.messages.find(m => m.id === messageId)
        if (message && !message.read_at) {
          message.read_at = new Date().toISOString()
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      }),
      
      joinCeremony: async (ceremonyId) => {
        if (!window.networkClient?.connected) {
          throw new Error('Not connected to network')
        }
        
        // Leave current ceremony if any
        if (get().currentCeremony) {
          await get().leaveCeremony()
        }
        
        window.networkClient.send({
          type: 'join_ceremony',
          ceremonyId: ceremonyId,
          timestamp: Date.now()
        })
        
        // Find ceremony in active list
        const ceremony = get().activeCeremonies.find(c => c.id === ceremonyId)
        if (ceremony) {
          set((state) => {
            state.currentCeremony = ceremony
          })
        }
      },
      
      leaveCeremony: async () => {
        const ceremony = get().currentCeremony
        if (!ceremony || !window.networkClient?.connected) return
        
        window.networkClient.send({
          type: 'leave_ceremony',
          ceremonyId: ceremony.id,
          timestamp: Date.now()
        })
        
        set((state) => {
          state.currentCeremony = null
        })
      },
      
      subscribeToNetworkEvents: () => {
        if (!window.networkClient) return () => {}
        
        const client = window.networkClient
        
        // Connection events
        client.onConnect = () => {
          set((state) => {
            state.connected = true
            state.connectionId = client.nodeId
          })
        }
        
        client.onDisconnect = () => {
          set((state) => {
            state.connected = false
            state.activePeers.clear()
            state.peerCount = 0
          })
        }
        
        // Peer events
        client.onPeerJoin = (peer) => {
          set((state) => {
            state.activePeers.set(peer.nodeId, peer)
            state.peerCount = state.activePeers.size
          })
        }
        
        client.onPeerLeave = (nodeId) => {
          set((state) => {
            state.activePeers.delete(nodeId)
            state.peerCount = state.activePeers.size
          })
        }
        
        // Message events
        client.onSacredMessage = (message) => {
          set((state) => {
            state.messages.push(message)
            state.unreadCount++
          })
          
          // Show notification
          if (window.showMessage) {
            window.showMessage(`💌 ${message.from}: ${message.content}`)
          }
        }
        
        // Ceremony events
        client.registerMessageHandler('ceremony_started', (data) => {
          set((state) => {
            state.activeCeremonies.push(data.ceremony)
          })
        })
        
        client.registerMessageHandler('ceremony_ended', (data) => {
          set((state) => {
            state.activeCeremonies = state.activeCeremonies.filter(
              c => c.id !== data.ceremonyId
            )
            
            if (state.currentCeremony?.id === data.ceremonyId) {
              state.currentCeremony = null
            }
          })
        })
        
        return () => {
          // Cleanup handlers
          client.onConnect = null
          client.onDisconnect = null
          client.onPeerJoin = null
          client.onPeerLeave = null
          client.onSacredMessage = null
        }
      }
    })),
    { name: 'NetworkStore' }
  )
)
```

### 5. UI & Preferences Store
```typescript
// stores/ui.store.ts
interface UIState {
  // Theme
  theme: 'cosmic' | 'earth' | 'water' | 'fire' | 'air'
  sacredGeometry: 'flower' | 'merkaba' | 'torus' | 'fibonacci'
  
  // Layout
  sidebarOpen: boolean
  fullscreen: boolean
  zenMode: boolean
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large'
  reducedMotion: boolean
  screenReaderMode: boolean
  highContrast: boolean
  
  // Sacred UI
  showBreathingGuide: boolean
  showCoherenceOrb: boolean
  mandalaSpin: boolean
  particleEffects: boolean
  
  // Notifications
  soundEnabled: boolean
  sacredChimes: boolean
  coherenceAlerts: boolean
  
  // Actions
  setTheme: (theme: string) => void
  toggleSidebar: () => void
  toggleZenMode: () => void
  updateAccessibility: (settings: AccessibilitySettings) => void
  updateSacredUI: (settings: SacredUISettings) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        theme: 'cosmic',
        sacredGeometry: 'flower',
        sidebarOpen: true,
        fullscreen: false,
        zenMode: false,
        fontSize: 'medium',
        reducedMotion: false,
        screenReaderMode: false,
        highContrast: false,
        showBreathingGuide: true,
        showCoherenceOrb: true,
        mandalaSpin: true,
        particleEffects: true,
        soundEnabled: true,
        sacredChimes: true,
        coherenceAlerts: true,
        
        // Actions
        setTheme: (theme) => set((state) => {
          state.theme = theme
          
          // Apply theme to DOM
          document.documentElement.setAttribute('data-theme', theme)
          
          // Update sacred geometry based on theme
          const geometryMap = {
            cosmic: 'merkaba',
            earth: 'flower',
            water: 'torus',
            fire: 'fibonacci',
            air: 'merkaba'
          }
          
          state.sacredGeometry = geometryMap[theme] || 'flower'
        }),
        
        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen
        }),
        
        toggleZenMode: () => set((state) => {
          state.zenMode = !state.zenMode
          
          if (state.zenMode) {
            // Enter zen mode
            state.sidebarOpen = false
            state.particleEffects = false
            state.soundEnabled = false
            
            // Enter fullscreen if supported
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen()
            }
          } else {
            // Exit zen mode
            state.sidebarOpen = true
            state.particleEffects = true
            state.soundEnabled = true
            
            // Exit fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen()
            }
          }
        }),
        
        updateAccessibility: (settings) => set((state) => {
          Object.assign(state, settings)
          
          // Apply to DOM
          document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion)
          document.documentElement.classList.toggle('high-contrast', settings.highContrast)
          document.documentElement.style.fontSize = {
            small: '14px',
            medium: '16px',
            large: '20px'
          }[settings.fontSize || 'medium']
        }),
        
        updateSacredUI: (settings) => set((state) => {
          Object.assign(state, settings)
          
          // Update geometry engine
          if (window.sacredGeometryEngine && settings.sacredGeometry) {
            window.sacredGeometryEngine.setPattern(settings.sacredGeometry)
          }
          
          // Update particle system
          if (window.particleSystem) {
            window.particleSystem.enabled = settings.particleEffects
          }
        })
      })),
      {
        name: 'luminous-ui',
        version: 1
      }
    ),
    { name: 'UIStore' }
  )
)
```

## State Synchronization

### WebSocket State Bridge
```typescript
// state/sync/websocket-bridge.ts
export class StateSyncBridge {
  private ws: WebSocket | null = null
  private syncQueue: StateUpdate[] = []
  private syncInterval: number = 1000 // 1 second
  private lastSync: number = 0
  
  constructor(private stores: StoreMap) {
    this.initializeSync()
  }
  
  private initializeSync() {
    // Subscribe to all store changes
    Object.entries(this.stores).forEach(([name, store]) => {
      store.subscribe((state, prevState) => {
        this.queueStateUpdate(name, state, prevState)
      })
    })
    
    // Start sync loop
    setInterval(() => this.processSyncQueue(), this.syncInterval)
  }
  
  private queueStateUpdate(storeName: string, state: any, prevState: any) {
    const changes = diff(prevState, state)
    if (Object.keys(changes).length === 0) return
    
    this.syncQueue.push({
      store: storeName,
      changes: changes,
      timestamp: Date.now(),
      coherence: useCoherenceStore.getState().personal
    })
  }
  
  private async processSyncQueue() {
    if (this.syncQueue.length === 0) return
    if (!window.networkClient?.connected) return
    
    const updates = this.syncQueue.splice(0, 10) // Process up to 10 updates
    
    const syncPacket = {
      type: 'state_sync',
      updates: updates,
      nodeId: window.networkClient.nodeId,
      timestamp: Date.now()
    }
    
    window.networkClient.send(syncPacket)
    this.lastSync = Date.now()
  }
  
  public receiveStateUpdate(update: RemoteStateUpdate) {
    // Validate coherence threshold
    if (update.coherence < 0.5) {
      console.warn('Ignoring low-coherence state update')
      return
    }
    
    // Apply updates to stores
    update.updates.forEach(storeUpdate => {
      const store = this.stores[storeUpdate.store]
      if (store) {
        store.setState(storeUpdate.changes)
      }
    })
  }
}
```

### Offline Queue
```typescript
// state/sync/offline-queue.ts
export class OfflineQueue {
  private queue: QueuedAction[] = []
  private db: IDBDatabase | null = null
  
  async initialize() {
    this.db = await openDB('LuminousOffline', 1, {
      upgrade(db) {
        db.createObjectStore('queue', { keyPath: 'id' })
        db.createObjectStore('state', { keyPath: 'store' })
      }
    })
    
    // Load queued actions
    await this.loadQueue()
    
    // Listen for online/offline
    window.addEventListener('online', () => this.processQueue())
    window.addEventListener('offline', () => this.saveState())
  }
  
  async queueAction(action: Action) {
    const queuedAction: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      action: action,
      timestamp: Date.now(),
      retries: 0
    }
    
    this.queue.push(queuedAction)
    await this.saveQueue()
    
    // Try to process immediately if online
    if (navigator.onLine) {
      await this.processQueue()
    }
  }
  
  async processQueue() {
    if (!navigator.onLine || this.queue.length === 0) return
    
    const processing = [...this.queue]
    
    for (const item of processing) {
      try {
        await this.executeAction(item.action)
        
        // Remove from queue on success
        this.queue = this.queue.filter(q => q.id !== item.id)
      } catch (error) {
        item.retries++
        
        if (item.retries > 3) {
          // Move to dead letter queue
          console.error('Action failed after 3 retries:', item)
          this.queue = this.queue.filter(q => q.id !== item.id)
        }
      }
    }
    
    await this.saveQueue()
  }
  
  private async saveState() {
    // Save current state snapshots for offline access
    const stores = {
      auth: useAuthStore.getState(),
      coherence: useCoherenceStore.getState(),
      glyph: useGlyphStore.getState(),
      ui: useUIStore.getState()
    }
    
    for (const [name, state] of Object.entries(stores)) {
      await this.db?.put('state', { store: name, state, timestamp: Date.now() })
    }
  }
  
  async restoreState() {
    // Restore state when coming back online
    const tx = this.db?.transaction('state', 'readonly')
    const store = tx?.objectStore('state')
    const states = await store?.getAll()
    
    states?.forEach(({ store, state }) => {
      switch (store) {
        case 'auth':
          useAuthStore.setState(state)
          break
        case 'coherence':
          useCoherenceStore.setState(state)
          break
        case 'glyph':
          useGlyphStore.setState(state)
          break
        case 'ui':
          useUIStore.setState(state)
          break
      }
    })
  }
}
```

## Performance Optimizations

### 1. Selective Subscriptions
```typescript
// Use selective subscriptions to prevent unnecessary re-renders
const useCoherenceValue = () => 
  useCoherenceStore(state => state.personal)

const useCoherenceTrend = () => 
  useCoherenceStore(state => state.trend)

// Instead of subscribing to entire store
const BadExample = () => {
  const coherence = useCoherenceStore() // Re-renders on any change
}

const GoodExample = () => {
  const personal = useCoherenceStore(state => state.personal) // Only re-renders on personal change
}
```

### 2. Computed Values with Memoization
```typescript
// stores/computed.ts
export const useComputedCoherence = () => {
  const personal = useCoherenceStore(state => state.personal)
  const network = useCoherenceStore(state => state.network)
  const field = useCoherenceStore(state => state.field)
  
  return useMemo(() => ({
    average: (personal + network + field) / 3,
    isHighCoherence: personal > 0.8,
    isNetworkAligned: Math.abs(personal - network) < 0.1
  }), [personal, network, field])
}
```

### 3. Throttled Updates
```typescript
// Throttle high-frequency updates
const throttledCoherenceUpdate = throttle((coherence: number) => {
  useCoherenceStore.getState().updateCoherence({ personal: coherence })
}, 100) // Max 10 updates per second

// Debounce user input
const debouncedSearch = debounce((query: string) => {
  useGlyphStore.getState().searchGlyphs(query)
}, 300)
```

## Testing State Management

### Unit Tests
```typescript
// stores/__tests__/coherence.store.test.ts
describe('CoherenceStore', () => {
  beforeEach(() => {
    useCoherenceStore.setState({
      personal: 0.7,
      network: 0.85,
      field: 0.6,
      history: [],
      milestones: []
    })
  })
  
  it('should update coherence values', () => {
    const { updateCoherence } = useCoherenceStore.getState()
    
    updateCoherence({ personal: 0.8 })
    
    expect(useCoherenceStore.getState().personal).toBe(0.8)
  })
  
  it('should track milestones', () => {
    const { addReading } = useCoherenceStore.getState()
    
    addReading({
      personal_coherence: 0.95,
      network_coherence: 0.9,
      field_coherence: 0.85,
      timestamp: new Date().toISOString()
    })
    
    const milestones = useCoherenceStore.getState().milestones
    expect(milestones).toHaveLength(3) // 80%, 90%, and 95% milestones
  })
  
  it('should calculate trend correctly', () => {
    const { addReading, calculateTrend } = useCoherenceStore.getState()
    
    // Add declining readings
    for (let i = 0; i < 20; i++) {
      addReading({
        personal_coherence: 0.8 - (i * 0.01),
        timestamp: new Date(Date.now() + i * 1000).toISOString()
      })
    }
    
    calculateTrend()
    
    expect(useCoherenceStore.getState().trend).toBe('falling')
  })
})
```

### Integration Tests
```typescript
// stores/__tests__/integration.test.ts
describe('Store Integration', () => {
  it('should sync coherence between stores', async () => {
    // Start a glyph practice
    await useGlyphStore.getState().startPractice('Ω0')
    
    // Simulate coherence increase
    useCoherenceStore.setState({ personal: 0.85 })
    
    // End practice
    await useGlyphStore.getState().endPractice(['Insight gained'])
    
    // Check practice was recorded with correct coherence
    const history = useGlyphStore.getState().practiceHistory
    expect(history[history.length - 1].ending_coherence).toBe(0.85)
  })
  
  it('should handle network state changes', () => {
    const { connect, disconnect } = useNetworkStore.getState()
    
    // Mock network client
    window.networkClient = {
      connected: true,
      disconnect: jest.fn()
    }
    
    connect()
    expect(useNetworkStore.getState().connected).toBe(true)
    
    disconnect()
    expect(window.networkClient.disconnect).toHaveBeenCalled()
    expect(useNetworkStore.getState().connected).toBe(false)
  })
})
```

## Migration Strategy

### From Current State to Zustand
```typescript
// migration/migrate-to-zustand.ts
export async function migrateToZustand() {
  // 1. Read current localStorage/sessionStorage
  const oldState = {
    coherence: JSON.parse(localStorage.getItem('coherence') || '{}'),
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    glyphs: JSON.parse(localStorage.getItem('glyphs') || '{}')
  }
  
  // 2. Transform to new structure
  if (oldState.user?.id) {
    useAuthStore.setState({
      user: oldState.user,
      isAuthenticated: true,
      sacredName: oldState.user.sacred_name
    })
  }
  
  if (oldState.coherence?.personal) {
    useCoherenceStore.setState({
      personal: oldState.coherence.personal,
      network: oldState.coherence.network || 0.85,
      field: oldState.coherence.field || 0.6
    })
  }
  
  if (oldState.glyphs?.history) {
    useGlyphStore.setState({
      practiceHistory: oldState.glyphs.history,
      unlockedGlyphs: new Set(oldState.glyphs.unlocked || [])
    })
  }
  
  // 3. Clear old storage
  localStorage.removeItem('coherence')
  localStorage.removeItem('user')
  localStorage.removeItem('glyphs')
  
  // 4. Mark migration complete
  localStorage.setItem('zustand_migration_complete', 'true')
}
```

## Best Practices

1. **Single Source of Truth**: Each piece of state lives in one store only
2. **Actions in Stores**: All state mutations through store actions
3. **Computed Values**: Use hooks for derived state
4. **Subscriptions Cleanup**: Always return cleanup functions
5. **Type Safety**: Full TypeScript coverage
6. **Persistence Strategy**: Only persist essential user data
7. **Performance First**: Selective subscriptions and memoization
8. **Sacred Coherence**: State changes respect system coherence