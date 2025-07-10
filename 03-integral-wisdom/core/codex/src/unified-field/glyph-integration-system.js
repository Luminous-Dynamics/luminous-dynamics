/**
 * Glyph Integration System
 * 
 * Loads all 94 generated glyphs and creates Living Cards for them
 * Provides seamless integration with the existing Sacred Council Hub
 */

class GlyphIntegrationSystem {
    constructor() {
        this.glyphData = new Map();
        this.livingCards = new Map();
        this.dataPath = '/data_temp_glyphs/';
        this.categories = {
            foundational: 48,
            appliedHarmonies: 4,
            meta: 33,
            threshold: 9
        };
        this.totalGlyphs = 94;
        this.loadedCount = 0;
        
        this.initialize();
    }

    async initialize() {
        console.log('🌟 Initializing Glyph Integration System...');
        
        try {
            // Load all glyph data
            await this.loadAllGlyphs();
            
            // Transform data for Living Cards
            await this.transformGlyphData();
            
            // Initialize UI
            this.initializeUI();
            
            console.log(`✨ Successfully loaded ${this.loadedCount}/${this.totalGlyphs} glyphs`);
        } catch (error) {
            console.error('Failed to initialize Glyph Integration System:', error);
        }
    }

    async loadAllGlyphs() {
        const loadPromises = [];
        
        // Load foundational glyphs
        for (let i = 0; i <= 44; i++) {
            loadPromises.push(this.loadGlyph('foundational', `omega-${i}.json`));
        }
        // Additional foundational
        loadPromises.push(this.loadGlyph('foundational', 'omega-53.json'));
        loadPromises.push(this.loadGlyph('foundational', 'omega-55.json'));
        loadPromises.push(this.loadGlyph('foundational', 'omega-56.json'));
        
        // Load applied harmonies
        for (let i = 49; i <= 52; i++) {
            loadPromises.push(this.loadGlyph('applied-harmonies', `omega-${i}.json`));
        }
        
        // Load meta glyphs
        for (let i = 1; i <= 33; i++) {
            loadPromises.push(this.loadGlyph('meta', `meta-glyph-${i}.json`));
        }
        
        // Load threshold glyphs
        const thresholdGlyphs = [
            'letting-in.json',
            'the-choice-point.json',
            'the-door-that-remembers-you.json',
            'the-edgewalker.json',
            'the-keeper-beneath-the-ash.json',
            'the-mantling.json',
            'the-remembered-weight.json',
            'the-returner.json',
            'the-unburdening.json'
        ];
        
        thresholdGlyphs.forEach(filename => {
            loadPromises.push(this.loadGlyph('threshold', filename));
        });
        
        await Promise.all(loadPromises);
    }

    async loadGlyph(category, filename) {
        try {
            const response = await fetch(`${this.dataPath}${category}/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${category}/${filename}`);
            }
            
            const data = await response.json();
            const glyphId = data.glyphId || this.extractGlyphId(filename);
            
            this.glyphData.set(glyphId, {
                ...data,
                category,
                filename
            });
            
            this.loadedCount++;
            
            // Update progress
            if (this.progressCallback) {
                this.progressCallback(this.loadedCount, this.totalGlyphs);
            }
            
        } catch (error) {
            console.error(`Failed to load glyph ${category}/${filename}:`, error);
        }
    }

    extractGlyphId(filename) {
        // Extract ID from filename
        if (filename.startsWith('omega-')) {
            return 'Ω' + filename.match(/omega-(\d+)/)[1];
        } else if (filename.startsWith('meta-glyph-')) {
            return '∑' + filename.match(/meta-glyph-(\d+)/)[1];
        } else {
            // For threshold glyphs, use the filename without extension
            return filename.replace('.json', '');
        }
    }

    async transformGlyphData() {
        // Transform Sacred Gardener's format to Living Card format
        for (const [glyphId, data] of this.glyphData) {
            const transformed = this.transformToLivingCardFormat(data);
            this.glyphData.set(glyphId, transformed);
        }
    }

    transformToLivingCardFormat(glyphData) {
        // Handle different formats for meta-glyphs vs regular glyphs
        if (glyphData.metaGlyphId) {
            return this.transformMetaGlyph(glyphData);
        }
        
        // Map Sacred Gardener's format to Living Glyph Card format
        return {
            id: glyphData.glyphId,
            name: glyphData.designation,
            fullName: `${glyphData.glyphId}: ${glyphData.designation}`,
            category: glyphData.category,
            
            // Map to harmony
            harmony: this.extractHarmony(glyphData),
            
            // Determine difficulty from evolution markers
            difficulty: this.calculateDifficulty(glyphData),
            
            // Build quadrants from available data
            quadrants: {
                why: {
                    coreQuestion: this.generateCoreQuestion(glyphData),
                    philosophicalRoot: glyphData.functionalDefinition || '',
                    harmonyConnection: this.describeHarmonyConnection(glyphData),
                    shadowTransformed: this.extractShadowWork(glyphData)
                },
                
                how: {
                    practiceInstructions: this.extractPracticeSteps(glyphData),
                    interactiveComponent: this.determineInteractiveComponent(glyphData),
                    variations: this.generateVariations(glyphData)
                },
                
                'universal-interconnectedness': {
                    relatedGlyphs: glyphData.harmonicLineage?.precursor ? [glyphData.harmonicLineage.precursor] : [],
                    complementaryGlyphs: glyphData.harmonicLineage?.sibling || [],
                    advancementGlyphs: glyphData.harmonicLineage?.evolution ? [glyphData.harmonicLineage.evolution] : []
                },
                
                we: {
                    practitionerFieldNotes: this.generateFieldNotes(glyphData),
                    commonExperiences: [],
                    integrationPathways: []
                }
            },
            
            // Preserve original data
            originalData: glyphData
        };
    }

    extractHarmony(glyphData) {
        // Map primary harmony alignment to simplified harmony names
        const harmonyMap = {
            'Integral Wisdom Cultivation': 'integral-wisdom-cultivation',
            'Resonant Resonant Coherence': 'resonant-coherence',
            'Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance': 'universal-interconnectedness',
            'Evolutionary Progression & Purposeful Unfolding': 'evolutionary-progression',
            'Pan-Sentient Flourishing': 'pan-sentient-flourishing',
            'Sacred Reciprocity': 'sacred-reciprocity',
            'Infinite Play & Creative Emergence': 'infinite-play'
        };
        
        const primaryHarmony = glyphData.primaryHarmonyAlignment?.primary;
        return harmonyMap[primaryHarmony] || 'universal-interconnectedness';
    }

    calculateDifficulty(glyphData) {
        // Use evolutionary markers to determine difficulty
        const stages = glyphData.evolutionaryMarkers?.stages;
        if (!stages) return 'beginner';
        
        if (stages.includes('Integration') || stages.includes('Embodiment')) {
            return 'advanced';
        } else if (stages.includes('Exploration') || stages.includes('Experimentation')) {
            return 'intermediate';
        } else {
            return 'beginner';
        }
    }

    generateCoreQuestion(glyphData) {
        // Generate a core question from the functional definition
        const definition = glyphData.functionalDefinition;
        if (!definition) return "How can I embody this sacred practice?";
        
        // Extract the essence and form it as a question
        if (definition.includes('creates') || definition.includes('establishes')) {
            return `How can I ${definition.toLowerCase()}?`;
        } else if (definition.includes('transforms') || definition.includes('shifts')) {
            return `What wants to transform through this practice?`;
        } else {
            return `How does ${glyphData.designation} serve my evolution?`;
        }
    }

    describeHarmonyConnection(glyphData) {
        const harmony = glyphData.primaryHarmonyAlignment?.primary;
        const percentage = glyphData.primaryHarmonyAlignment?.percentage || 0;
        
        return `This practice embodies ${percentage}% ${harmony}, ` +
               `creating ${glyphData.primaryHarmonyAlignment?.secondary || 'supportive'} qualities ` +
               `through ${glyphData.sensoryResonanceProfile?.feeling || 'sacred embodiment'}.`;
    }

    extractShadowWork(glyphData) {
        // Derive shadow work from field dynamics
        const contexts = glyphData.fieldDynamics?.contexts;
        if (!contexts) return "Unconscious patterns";
        
        // Look for shadow patterns in contexts
        for (const context of contexts) {
            if (context.scenario?.includes('conflict') || 
                context.scenario?.includes('challenge') ||
                context.scenario?.includes('difficult')) {
                return context.scenario;
            }
        }
        
        return "Patterns of disconnection and separation";
    }

    extractPracticeSteps(glyphData) {
        const steps = [];
        const protocol = glyphData.activationProtocol;
        
        if (protocol?.verbal) {
            steps.push(`Speak the sacred phrase: "${protocol.verbal}"`);
        }
        
        if (protocol?.somatic) {
            steps.push(`Embody through: ${protocol.somatic}`);
        }
        
        if (protocol?.presenceBased) {
            steps.push(`Hold presence with: ${protocol.presenceBased}`);
        }
        
        // Add feeling quality as a step
        if (glyphData.sensoryResonanceProfile?.feeling) {
            steps.push(`Allow yourself to feel: ${glyphData.sensoryResonanceProfile.feeling}`);
        }
        
        return steps.length > 0 ? steps : [
            "Center yourself in sacred presence",
            "Connect with the energy of this glyph",
            "Allow the practice to unfold naturally",
            "Complete with gratitude"
        ];
    }

    determineInteractiveComponent(glyphData) {
        // Determine component type based on glyph characteristics
        const somatic = glyphData.activationProtocol?.somatic;
        
        if (somatic?.includes('breath') || somatic?.includes('breathing')) {
            return {
                type: 'breathing_guide',
                config: {
                    breathCycles: 3,
                    inhaleCount: 4,
                    holdCount: 2,
                    exhaleCount: 6,
                    guidance: glyphData.activationProtocol.verbal || "Breathe into presence"
                }
            };
        } else if (glyphData.category === 'threshold') {
            return {
                type: 'journal_prompt',
                config: {
                    prompts: [
                        "What threshold am I crossing?",
                        "What am I leaving behind?",
                        "What am I moving toward?"
                    ]
                }
            };
        } else {
            return {
                type: 'assessment_slider',
                config: {
                    dimensions: [
                        { name: "Presence", min: "Distracted", max: "Fully Present" },
                        { name: "Openness", min: "Guarded", max: "Completely Open" },
                        { name: "Integration", min: "Fragmented", max: "Whole" }
                    ]
                }
            };
        }
    }

    generateVariations(glyphData) {
        const variations = [];
        
        if (glyphData.fieldDynamics?.contexts) {
            glyphData.fieldDynamics.contexts.forEach(context => {
                if (context.scenario) {
                    variations.push(`For ${context.scenario}: ${context.application || 'Apply with awareness'}`);
                }
            });
        }
        
        return variations.length > 0 ? variations : [
            "Solo practice: Full embodiment in private sacred space",
            "Partner practice: Share presence with trusted other",
            "Group practice: Weave collective field of practice"
        ];
    }

    generateFieldNotes(glyphData) {
        // Generate sample field notes based on glyph properties
        const notes = [];
        
        if (glyphData.sensoryResonanceProfile?.feeling) {
            notes.push(`The feeling of ${glyphData.sensoryResonanceProfile.feeling} opened something profound in me.`);
        }
        
        if (glyphData.evolutionaryMarkers?.stages?.[0]) {
            notes.push(`Starting with ${glyphData.evolutionaryMarkers.stages[0]} felt like coming home to myself.`);
        }
        
        if (glyphData.primaryHarmonyAlignment?.primary) {
            notes.push(`The ${glyphData.primaryHarmonyAlignment.primary} in this practice transformed my relationships.`);
        }
        
        return notes.length > 0 ? notes : [
            "This practice opened doorways I didn't know existed.",
            "Each time I return to this, something new emerges.",
            "The simplicity holds profound depth."
        ];
    }

    transformMetaGlyph(metaData) {
        // Transform meta-glyph format to Living Card format
        return {
            id: metaData.metaGlyphId,
            name: metaData.name,
            fullName: `${metaData.metaGlyphId}: ${metaData.name}`,
            category: 'meta',
            
            // Meta-glyphs typically work with resonant-coherence or universal-interconnectedness
            harmony: this.extractMetaHarmony(metaData),
            
            // Meta-glyphs are advanced by nature
            difficulty: 'advanced',
            
            // Build quadrants from meta-glyph data
            quadrants: {
                why: {
                    coreQuestion: `How can ${metaData.name} transform our collective field?`,
                    philosophicalRoot: metaData.fieldIntelligence || '',
                    harmonyConnection: `Weaves together ${metaData.constituentGlyphs.join(', ')} into a unified field`,
                    shadowTransformed: this.extractMetaShadow(metaData)
                },
                
                how: {
                    practiceInstructions: this.extractMetaPracticeSteps(metaData),
                    interactiveComponent: {
                        type: 'meta_weaving',
                        config: {
                            constituentGlyphs: metaData.constituentGlyphs,
                            activationPhrase: metaData.activationPhrase,
                            arcColor: metaData.arcColor
                        }
                    },
                    variations: this.generateMetaVariations(metaData)
                },
                
                'universal-interconnectedness': {
                    relatedGlyphs: metaData.constituentGlyphs || [],
                    complementaryGlyphs: [],
                    advancementGlyphs: []
                },
                
                we: {
                    practitionerFieldNotes: [
                        `The combination of ${metaData.constituentGlyphs.join(' + ')} created an emergent field I've never experienced.`,
                        `${metaData.name} showed me how individual practices can weave into something greater.`,
                        `The ${metaData.relationalArchetype} archetype transformed our group dynamics completely.`
                    ],
                    commonExperiences: [],
                    integrationPathways: []
                }
            },
            
            // Preserve original data
            originalData: metaData
        };
    }

    extractMetaHarmony(metaData) {
        // Determine harmony based on spiral arc or field effect
        if (metaData.spiralArc?.includes('Resonant Resonant Coherence')) return 'resonant-coherence';
        if (metaData.spiralArc?.includes('Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance')) return 'universal-interconnectedness';
        if (metaData.fieldIntelligence?.includes('trust')) return 'integral-wisdom-cultivation';
        if (metaData.fieldIntelligence?.includes('evolutionary-progression')) return 'evolutionary-progression';
        return 'resonant-coherence'; // Default for meta-glyphs
    }

    extractMetaShadow(metaData) {
        // Extract shadow from contraindications
        if (metaData.contraindications?.length > 0) {
            return metaData.contraindications[0];
        }
        return "The shadow of forcing integration before readiness";
    }

    extractMetaPracticeSteps(metaData) {
        const steps = [];
        
        if (metaData.practiceProtocol?.activationSequence) {
            // Split the activation sequence into steps
            const sequence = metaData.practiceProtocol.activationSequence;
            const stepMatches = sequence.match(/Step \d+:[^.]+\./g);
            if (stepMatches) {
                steps.push(...stepMatches.map(s => s.trim()));
            } else {
                steps.push(sequence);
            }
        }
        
        if (metaData.activationPhrase) {
            steps.push(`Speak the activation phrase: "${metaData.activationPhrase}"`);
        }
        
        if (metaData.practiceProtocol?.integrationPhase) {
            steps.push(`Integration: ${metaData.practiceProtocol.integrationPhase}`);
        }
        
        return steps.length > 0 ? steps : [
            `Activate the constituent glyphs: ${metaData.constituentGlyphs.join(', ')}`,
            "Allow the meta-field to emerge naturally",
            "Hold the unified frequency for integration"
        ];
    }

    generateMetaVariations(metaData) {
        const variations = [];
        
        if (metaData.emergentProperties?.scaleModality) {
            metaData.emergentProperties.scaleModality.forEach(scale => {
                variations.push(`${scale} practice: Adapted for ${scale.toLowerCase()} work`);
            });
        }
        
        if (metaData.practiceProtocol?.preparatoryConditions) {
            variations.push(`Preparation: ${metaData.practiceProtocol.preparatoryConditions}`);
        }
        
        return variations;
    }

    initializeUI() {
        // Create container for glyph library
        this.createGlyphLibrary();
        
        // Add integration with existing UI
        this.integrateWithSacredCouncil();
        
        // Set up search and filtering
        this.setupSearchAndFilter();
    }

    createGlyphLibrary() {
        // Create main library container
        const libraryHTML = `
            <div id="glyph-library" class="glyph-library-container">
                <div class="library-header">
                    <h2>🌟 The 94 Sacred Glyphs</h2>
                    <p class="library-subtitle">Living practices for conscious relationship</p>
                    
                    <div class="library-stats">
                        <div class="stat-item">
                            <span class="stat-number">${this.categories.foundational}</span>
                            <span class="stat-label">Foundational</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.categories.appliedHarmonies}</span>
                            <span class="stat-label">Applied Harmonies</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.categories.meta}</span>
                            <span class="stat-label">Meta-Glyphs</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.categories.threshold}</span>
                            <span class="stat-label">Threshold</span>
                        </div>
                    </div>
                </div>
                
                <div class="library-controls">
                    <input type="text" class="glyph-search" placeholder="Search glyphs by name, harmony, or keyword...">
                    
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All Glyphs</button>
                        <button class="filter-btn" data-filter="foundational">Foundational</button>
                        <button class="filter-btn" data-filter="applied-harmonies">Applied Harmonies</button>
                        <button class="filter-btn" data-filter="meta">Meta-Glyphs</button>
                        <button class="filter-btn" data-filter="threshold">Threshold</button>
                    </div>
                    
                    <div class="harmony-filters">
                        <label>Filter by Harmony:</label>
                        <select class="harmony-select">
                            <option value="all">All Harmonies</option>
                            <option value="integral-wisdom-cultivation">Integral Wisdom Cultivation</option>
                            <option value="resonant-coherence">Resonant Resonant Coherence</option>
                            <option value="universal-interconnectedness">Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance</option>
                            <option value="evolutionary-progression">Evolutionary Progression & Purposeful Unfolding</option>
                            <option value="pan-sentient-flourishing">Pan-Sentient Flourishing</option>
                            <option value="sacred-reciprocity">Sacred Reciprocity</option>
                            <option value="infinite-play">Infinite Play & Creative Emergence</option>
                        </select>
                    </div>
                </div>
                
                <div class="glyph-grid" id="glyph-grid">
                    <!-- Glyph cards will be inserted here -->
                </div>
                
                <div class="library-footer">
                    <p>🙏 Each glyph is a doorway to transformation. Enter with reverence.</p>
                </div>
            </div>
        `;
        
        // Add styles
        this.addLibraryStyles();
    }

    addLibraryStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .glyph-library-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
                font-family: 'Georgia', serif;
            }
            
            .library-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .library-header h2 {
                font-size: 2.5em;
                color: #2C2C2C;
                margin-bottom: 10px;
            }
            
            .library-subtitle {
                font-size: 1.2em;
                color: #5A6B57;
                font-style: italic;
                margin-bottom: 30px;
            }
            
            .library-stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 30px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-number {
                display: block;
                font-size: 2em;
                font-weight: bold;
                color: #A8B5A6;
            }
            
            .stat-label {
                display: block;
                font-size: 0.9em;
                color: #6B7280;
                margin-top: 5px;
            }
            
            .library-controls {
                background: #F8F8F6;
                padding: 30px;
                border-radius: 16px;
                margin-bottom: 40px;
            }
            
            .glyph-search {
                width: 100%;
                padding: 15px 20px;
                font-size: 1.1em;
                border: 2px solid #E8E6E1;
                border-radius: 8px;
                margin-bottom: 20px;
                font-family: 'Georgia', serif;
            }
            
            .glyph-search:focus {
                outline: none;
                border-color: #A8B5A6;
            }
            
            .filter-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }
            
            .filter-btn {
                padding: 10px 20px;
                border: 2px solid #E8E6E1;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Georgia', serif;
            }
            
            .filter-btn:hover,
            .filter-btn.active {
                border-color: #A8B5A6;
                background: #A8B5A6;
                color: white;
            }
            
            .harmony-filters {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .harmony-filters label {
                color: #5A6B57;
                font-weight: 600;
            }
            
            .harmony-select {
                padding: 8px 15px;
                border: 2px solid #E8E6E1;
                border-radius: 8px;
                font-family: 'Georgia', serif;
                background: white;
            }
            
            .glyph-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 30px;
                margin-bottom: 40px;
            }
            
            .glyph-preview-card {
                background: white;
                border-radius: 16px;
                padding: 25px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .glyph-preview-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                border-color: #A8B5A6;
            }
            
            .glyph-preview-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            
            .glyph-preview-id {
                font-size: 1.5em;
                color: #A8B5A6;
                font-weight: bold;
            }
            
            .glyph-preview-category {
                font-size: 0.8em;
                color: #6B7280;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .glyph-preview-name {
                font-size: 1.2em;
                color: #2C2C2C;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .glyph-preview-description {
                font-size: 0.95em;
                color: #5A6B57;
                line-height: 1.6;
                margin-bottom: 15px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .glyph-preview-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 15px;
                border-top: 1px solid #E8E6E1;
            }
            
            .glyph-preview-harmony {
                display: inline-block;
                padding: 5px 12px;
                background: #A8B5A620;
                color: #A8B5A6;
                border-radius: 12px;
                font-size: 0.85em;
            }
            
            .glyph-preview-action {
                color: #A8B5A6;
                font-size: 0.9em;
                font-weight: 600;
            }
            
            .library-footer {
                text-align: center;
                padding: 30px 0;
                color: #5A6B57;
                font-style: italic;
            }
            
            /* Loading state */
            .glyph-loading {
                text-align: center;
                padding: 60px;
                color: #6B7280;
            }
            
            .glyph-loading-spinner {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 3px solid #E8E6E1;
                border-top-color: #A8B5A6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* No results */
            .no-results {
                text-align: center;
                padding: 60px;
                color: #6B7280;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .library-stats {
                    gap: 20px;
                }
                
                .stat-item {
                    flex: 1;
                }
                
                .glyph-grid {
                    grid-template-columns: 1fr;
                }
                
                .filter-buttons {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    renderGlyphGrid(filter = 'all', searchTerm = '', harmonyFilter = 'all') {
        const grid = document.getElementById('glyph-grid');
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Filter glyphs
        let filteredGlyphs = Array.from(this.glyphData.values());
        
        // Apply category filter
        if (filter !== 'all') {
            filteredGlyphs = filteredGlyphs.filter(glyph => glyph.category === filter);
        }
        
        // Apply harmony filter
        if (harmonyFilter !== 'all') {
            filteredGlyphs = filteredGlyphs.filter(glyph => glyph.harmony === harmonyFilter);
        }
        
        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filteredGlyphs = filteredGlyphs.filter(glyph => {
                return glyph.name.toLowerCase().includes(search) ||
                       glyph.id.toLowerCase().includes(search) ||
                       glyph.quadrants.why.philosophicalRoot.toLowerCase().includes(search) ||
                       glyph.harmony.toLowerCase().includes(search);
            });
        }
        
        // Sort glyphs
        filteredGlyphs.sort((a, b) => {
            // Sort by category order, then by ID
            const categoryOrder = ['foundational', 'applied-harmonies', 'meta', 'threshold'];
            const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
            if (catDiff !== 0) return catDiff;
            
            // Within category, sort by numeric ID if possible
            const aNum = parseInt(a.id.replace(/[^0-9]/g, ''));
            const bNum = parseInt(b.id.replace(/[^0-9]/g, ''));
            return aNum - bNum;
        });
        
        // Render results
        if (filteredGlyphs.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No glyphs found matching your criteria.</p>
                    <p>Try adjusting your filters or search term.</p>
                </div>
            `;
        } else {
            filteredGlyphs.forEach(glyph => {
                const card = this.createGlyphPreviewCard(glyph);
                grid.appendChild(card);
            });
        }
    }

    createGlyphPreviewCard(glyph) {
        const card = document.createElement('div');
        card.className = 'glyph-preview-card';
        card.dataset.glyphId = glyph.id;
        
        card.innerHTML = `
            <div class="glyph-preview-header">
                <span class="glyph-preview-id">${glyph.id}</span>
                <span class="glyph-preview-category">${glyph.category.replace('-', ' ')}</span>
            </div>
            <h3 class="glyph-preview-name">${glyph.name}</h3>
            <p class="glyph-preview-description">${glyph.quadrants.why.philosophicalRoot}</p>
            <div class="glyph-preview-footer">
                <span class="glyph-preview-harmony">${glyph.harmony}</span>
                <span class="glyph-preview-action">Enter Practice →</span>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => this.openGlyphCard(glyph));
        
        return card;
    }

    openGlyphCard(glyphData) {
        // Check if card already exists
        if (this.livingCards.has(glyphData.id)) {
            // Re-focus on existing card
            const existingCard = this.livingCards.get(glyphData.id);
            existingCard.enterPractice();
            return;
        }
        
        // Create container for the Living Card
        const container = document.createElement('div');
        container.id = `living-card-${glyphData.id}`;
        container.className = 'living-card-container';
        document.body.appendChild(container);
        
        // Create new Living Card instance
        const livingCard = new LivingGlyphCard(container.id, glyphData, {
            consciousness: true,
            autoProgress: false,
            sacredTiming: true
        });
        
        // Store reference
        this.livingCards.set(glyphData.id, livingCard);
        
        // Track opening in Sacred Field
        if (window.SacredField) {
            window.SacredField.completeExperience('glyph_opened', {
                glyphId: glyphData.id,
                glyphName: glyphData.name,
                category: glyphData.category
            });
        }
    }

    integrateWithSacredCouncil() {
        // Add glyph library to Sacred Council Hub if it exists
        const councilHub = document.getElementById('sacred-council-hub');
        if (councilHub) {
            // Add new tab for Glyph Library
            const tabsContainer = councilHub.querySelector('.tabs');
            if (tabsContainer) {
                const glyphTab = document.createElement('button');
                glyphTab.className = 'tab-button';
                glyphTab.textContent = 'Glyph Library';
                glyphTab.addEventListener('click', () => this.showGlyphLibrary());
                tabsContainer.appendChild(glyphTab);
            }
        }
    }

    showGlyphLibrary() {
        // Implementation depends on Sacred Council Hub structure
        // This would switch to the glyph library view
        console.log('Showing Glyph Library in Sacred Council Hub');
    }

    setupSearchAndFilter() {
        // Set up event listeners for search and filter controls
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('glyph-search')) {
                this.handleSearch(e.target.value);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleCategoryFilter(e.target);
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('harmony-select')) {
                this.handleHarmonyFilter(e.target.value);
            }
        });
    }

    handleSearch(searchTerm) {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const harmonyFilter = document.querySelector('.harmony-select').value;
        this.renderGlyphGrid(activeFilter, searchTerm, harmonyFilter);
    }

    handleCategoryFilter(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Re-render grid
        const searchTerm = document.querySelector('.glyph-search').value;
        const harmonyFilter = document.querySelector('.harmony-select').value;
        this.renderGlyphGrid(button.dataset.filter, searchTerm, harmonyFilter);
    }

    handleHarmonyFilter(harmony) {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = document.querySelector('.glyph-search').value;
        this.renderGlyphGrid(activeFilter, searchTerm, harmony);
    }

    // Progress tracking
    onProgress(callback) {
        this.progressCallback = callback;
    }

    // Public API
    getGlyph(glyphId) {
        return this.glyphData.get(glyphId);
    }

    getAllGlyphs() {
        return Array.from(this.glyphData.values());
    }

    getGlyphsByCategory(category) {
        return this.getAllGlyphs().filter(glyph => glyph.category === category);
    }

    getGlyphsByHarmony(harmony) {
        return this.getAllGlyphs().filter(glyph => glyph.harmony === harmony);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.glyphIntegration = new GlyphIntegrationSystem();
    });
} else {
    window.glyphIntegration = new GlyphIntegrationSystem();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlyphIntegrationSystem;
}