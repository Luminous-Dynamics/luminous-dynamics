/**
 * Sacred Sigil Generator
 * 
 * Creates sacred sigils for Applied Harmonies that carry the energetic
 * signature and visual essence of each practice. These are not mere
 * decorations but sacred geometric expressions of consciousness principles.
 */

const fs = require('fs').promises;
const path = require('path');

// Graceful canvas loading
let createCanvas, loadImage;
try {
    const canvas = require('canvas');
    createCanvas = canvas.createCanvas;
    loadImage = canvas.loadImage;
} catch (error) {
    console.warn('⚠️  Canvas module not available - sigil generation will create mock files');
    createCanvas = null;
    loadImage = null;
}

class SacredSigilGenerator {
    constructor() {
        this.sigilConfig = {
            // Standard sigil dimensions
            sizes: {
                small: { width: 64, height: 64 },    // For icons
                medium: { width: 128, height: 128 }, // For cards
                large: { width: 256, height: 256 },  // For detailed use
                vector: { width: 512, height: 512 }  // High resolution
            },
            
            // Sacred geometry parameters
            geometry: {
                goldenRatio: 1.618033988749,
                sacredAngles: [30, 36, 45, 60, 72, 90, 108, 120, 144, 180],
                fibonacci: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
                pentagram: Math.PI * 2 / 5, // 72 degrees
                hexagram: Math.PI / 3       // 60 degrees
            },
            
            // Color mappings for each harmony
            harmonySigils: {
                transparency: {
                    primaryColor: '#A8B5A6',
                    secondaryColor: '#C5D4C3',
                    symbol: '◇',
                    geometry: 'diamond',
                    description: 'Diamond of clarity - inner and outer alignment'
                },
                coherence: {
                    primaryColor: '#8A9E88',
                    secondaryColor: '#9FB29D', 
                    symbol: '○',
                    geometry: 'circle',
                    description: 'Perfect circle - wholeness and integration'
                },
                resonance: {
                    primaryColor: '#B3C5D7',
                    secondaryColor: '#9DB4C8',
                    symbol: '~',
                    geometry: 'wave',
                    description: 'Harmonic waves - sympathetic vibration'
                },
                agency: {
                    primaryColor: '#D4A574',
                    secondaryColor: '#C89A6A',
                    symbol: '△',
                    geometry: 'triangle',
                    description: 'Upward triangle - conscious choice and will'
                },
                vitality: {
                    primaryColor: '#E8A87C',
                    secondaryColor: '#DD9B6F',
                    symbol: '✦',
                    geometry: 'star',
                    description: 'Eight-pointed star - life force radiating'
                },
                mutuality: {
                    primaryColor: '#C4A5D4',
                    secondaryColor: '#B799C7',
                    symbol: '♡',
                    geometry: 'heart',
                    description: 'Heart vessel - giving and receiving love'
                },
                novelty: {
                    primaryColor: '#A8D4D4',
                    secondaryColor: '#9BC7C7',
                    symbol: '∞',
                    geometry: 'infinity',
                    description: 'Infinite spiral - endless creative potential'
                }
            },
            
            // Applied Harmony specific sigil data
            appliedHarmonySigils: {
                'Ω45': {
                    name: 'First Presence',
                    harmony: 'transparency',
                    sacredNumber: 45,
                    elements: ['center_dot', 'breathing_circle', 'grounding_lines'],
                    intention: 'Arrival in sacred presence'
                },
                'Ω46': {
                    name: 'Sacred Listening', 
                    harmony: 'resonance',
                    sacredNumber: 46,
                    elements: ['receiving_vessel', 'sound_waves', 'heart_center'],
                    intention: 'Deep receptive awareness'
                },
                'Ω47': {
                    name: 'Conscious Choice',
                    harmony: 'agency', 
                    sacredNumber: 47,
                    elements: ['decision_triangle', 'wisdom_paths', 'sovereign_center'],
                    intention: 'Empowered conscious decision'
                },
                'Ω48': {
                    name: 'Sacred Expression',
                    harmony: 'transparency',
                    sacredNumber: 48,
                    elements: ['truth_diamond', 'expression_rays', 'authentic_core'],
                    intention: 'Authentic truth speaking'
                },
                'Ω49': {
                    name: 'Heart Resonance',
                    harmony: 'resonance',
                    sacredNumber: 49,
                    elements: ['heart_mandala', 'empathy_bridges', 'feeling_field'],
                    intention: 'Empathic attunement to others'
                },
                'Ω50': {
                    name: 'Gentle Truth',
                    harmony: 'transparency',
                    sacredNumber: 50,
                    elements: ['compassion_embrace', 'truth_sword', 'love_shield'],
                    intention: 'Truth spoken with love'
                },
                'Ω51': {
                    name: 'Sacred Boundary',
                    harmony: 'agency',
                    sacredNumber: 51,
                    elements: ['protective_circle', 'loving_limits', 'self_care'],
                    intention: 'Loving limits that serve life'
                },
                'Ω52': {
                    name: 'Sacred Repair',
                    harmony: 'mutuality',
                    sacredNumber: 52,
                    elements: ['healing_spiral', 'connection_bridge', 'wholeness_return'],
                    intention: 'Healing relationship ruptures'
                },
                'Ω53': {
                    name: 'Field Coherence',
                    harmony: 'coherence',
                    sacredNumber: 53,
                    elements: ['unity_mandala', 'harmony_weave', 'collective_center'],
                    intention: 'Creating harmony in group spaces'
                },
                'Ω55': {
                    name: 'Sacred Conflict',
                    harmony: 'novelty',
                    sacredNumber: 55,
                    elements: ['creative_tension', 'growth_spiral', 'wisdom_emergence'],
                    intention: 'Transforming disagreement into growth'
                },
                'Ω56': {
                    name: 'Collective Wisdom',
                    harmony: 'coherence',
                    sacredNumber: 56,
                    elements: ['council_circle', 'shared_intelligence', 'group_mind'],
                    intention: 'Tapping into group intelligence'
                }
            }
        };
        
        this.outputDir = 'assets/sacred-sigils';
        this.ensureOutputDirectory();
    }

    async ensureOutputDirectory() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            console.warn('Could not create sigil output directory:', error.message);
        }
    }

    // === MAIN SIGIL GENERATION ===

    async generateAppliedHarmonySigil(glyphId, size = 'medium') {
        const sigilData = this.sigilConfig.appliedHarmonySigils[glyphId];
        if (!sigilData) {
            throw new Error(`No sigil data found for ${glyphId}`);
        }

        if (!createCanvas) {
            return this.createMockSigil(glyphId, size);
        }

        const { width, height } = this.sigilConfig.sizes[size];
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Clear background
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, width, height);

        // Get harmony colors
        const harmony = this.sigilConfig.harmonySigils[sigilData.harmony];
        
        // Draw sacred background
        this.drawSacredBackground(ctx, width, height, harmony);
        
        // Draw sacred number integration
        this.drawSacredNumber(ctx, sigilData.sacredNumber, width, height, harmony);
        
        // Draw harmony geometry
        this.drawHarmonyGeometry(ctx, harmony, width, height);
        
        // Draw specific sigil elements
        this.drawSigilElements(ctx, sigilData.elements, width, height, harmony);
        
        // Draw sacred border
        this.drawSacredBorder(ctx, width, height, harmony);

        return canvas;
    }

    async generateHarmonySigil(harmonyName, size = 'medium') {
        const harmony = this.sigilConfig.harmonySigils[harmonyName];
        if (!harmony) {
            throw new Error(`No harmony data found for ${harmonyName}`);
        }

        if (!createCanvas) {
            return this.createMockSigil(harmonyName, size);
        }

        const { width, height } = this.sigilConfig.sizes[size];
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Clear background
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, width, height);

        // Draw pure harmony sigil
        this.drawPureHarmonySigil(ctx, harmony, width, height);

        return canvas;
    }

    // === SIGIL DRAWING METHODS ===

    drawSacredBackground(ctx, width, height, harmony) {
        // Subtle radial gradient background
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, this.hexToRgba(harmony.secondaryColor, 0.1));
        gradient.addColorStop(1, this.hexToRgba(harmony.primaryColor, 0.05));

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    drawSacredNumber(ctx, number, width, height, harmony) {
        // Sacred number integration using sacred geometry
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.15;

        // Draw number in sacred geometric context
        ctx.save();
        ctx.strokeStyle = this.hexToRgba(harmony.primaryColor, 0.3);
        ctx.lineWidth = 1;

        // Create geometric pattern based on number's sacred properties
        const points = this.getSacredPoints(number, centerX, centerY, radius);
        
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
        }
        ctx.stroke();

        ctx.restore();
    }

    getSacredPoints(number, centerX, centerY, radius) {
        // Generate sacred geometric points based on the number
        const points = [];
        const numPoints = number % 12 || 6; // Default to hexagon if divisible by 12
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push({ x, y });
        }
        
        return points;
    }

    drawHarmonyGeometry(ctx, harmony, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;

        ctx.save();
        ctx.strokeStyle = harmony.primaryColor;
        ctx.fillStyle = this.hexToRgba(harmony.primaryColor, 0.2);
        ctx.lineWidth = 3;

        switch (harmony.geometry) {
            case 'circle':
                this.drawSacredCircle(ctx, centerX, centerY, radius);
                break;
            case 'triangle':
                this.drawSacredTriangle(ctx, centerX, centerY, radius);
                break;
            case 'diamond':
                this.drawSacredDiamond(ctx, centerX, centerY, radius);
                break;
            case 'star':
                this.drawSacredStar(ctx, centerX, centerY, radius);
                break;
            case 'heart':
                this.drawSacredHeart(ctx, centerX, centerY, radius);
                break;
            case 'wave':
                this.drawSacredWave(ctx, centerX, centerY, radius);
                break;
            case 'infinity':
                this.drawSacredInfinity(ctx, centerX, centerY, radius);
                break;
            default:
                this.drawSacredCircle(ctx, centerX, centerY, radius);
        }

        ctx.restore();
    }

    drawSacredCircle(ctx, centerX, centerY, radius) {
        // Perfect circle representing wholeness
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner circles for depth
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSacredTriangle(ctx, centerX, centerY, radius) {
        // Upward pointing triangle for conscious will
        const height = radius * Math.sqrt(3) / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - height * 0.7);
        ctx.lineTo(centerX - radius * 0.6, centerY + height * 0.3);
        ctx.lineTo(centerX + radius * 0.6, centerY + height * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner triangle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - height * 0.4);
        ctx.lineTo(centerX - radius * 0.3, centerY + height * 0.1);
        ctx.lineTo(centerX + radius * 0.3, centerY + height * 0.1);
        ctx.closePath();
        ctx.stroke();
    }

    drawSacredDiamond(ctx, centerX, centerY, radius) {
        // Diamond for clarity and transparency
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX + radius * 0.7, centerY);
        ctx.lineTo(centerX, centerY + radius);
        ctx.lineTo(centerX - radius * 0.7, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner diamond
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius * 0.5);
        ctx.lineTo(centerX + radius * 0.35, centerY);
        ctx.lineTo(centerX, centerY + radius * 0.5);
        ctx.lineTo(centerX - radius * 0.35, centerY);
        ctx.closePath();
        ctx.stroke();
    }

    drawSacredStar(ctx, centerX, centerY, radius) {
        // Eight-pointed star for vitality
        const points = 8;
        const outerRadius = radius;
        const innerRadius = radius * 0.5;

        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawSacredHeart(ctx, centerX, centerY, radius) {
        // Heart shape for love and mutuality
        ctx.beginPath();
        
        // Heart curves
        const topRadius = radius * 0.4;
        ctx.arc(centerX - topRadius, centerY - topRadius * 0.5, topRadius, 0, Math.PI, false);
        ctx.arc(centerX + topRadius, centerY - topRadius * 0.5, topRadius, 0, Math.PI, false);
        
        // Heart point
        ctx.lineTo(centerX, centerY + radius * 0.7);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
    }

    drawSacredWave(ctx, centerX, centerY, radius) {
        // Harmonic wave for resonance
        ctx.beginPath();
        
        const amplitude = radius * 0.3;
        const frequency = 3;
        const startX = centerX - radius;
        const endX = centerX + radius;
        
        for (let x = startX; x <= endX; x += 2) {
            const relativeX = (x - startX) / (endX - startX);
            const y = centerY + amplitude * Math.sin(relativeX * frequency * Math.PI * 2);
            
            if (x === startX) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();

        // Second wave
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 2) {
            const relativeX = (x - startX) / (endX - startX);
            const y = centerY - amplitude * Math.sin(relativeX * frequency * Math.PI * 2);
            
            if (x === startX) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    drawSacredInfinity(ctx, centerX, centerY, radius) {
        // Infinity symbol for endless creativity
        const width = radius * 1.5;
        const height = radius * 0.8;
        
        ctx.beginPath();
        
        // Left loop
        ctx.arc(centerX - width * 0.25, centerY, height * 0.5, 0, Math.PI * 2, false);
        
        // Right loop
        ctx.moveTo(centerX + width * 0.75, centerY);
        ctx.arc(centerX + width * 0.25, centerY, height * 0.5, 0, Math.PI * 2, false);
        
        ctx.stroke();
    }

    drawSigilElements(ctx, elements, width, height, harmony) {
        // Draw specific elements for each Applied Harmony
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.strokeStyle = harmony.secondaryColor;
        ctx.lineWidth = 2;
        
        elements.forEach(element => {
            this.drawSigilElement(ctx, element, centerX, centerY, width, height, harmony);
        });
        
        ctx.restore();
    }

    drawSigilElement(ctx, elementType, centerX, centerY, width, height, harmony) {
        const radius = Math.min(width, height) * 0.4;
        
        switch (elementType) {
            case 'center_dot':
                ctx.beginPath();
                ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'breathing_circle':
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'grounding_lines':
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + radius * 0.5);
                ctx.lineTo(centerX, centerY + radius * 0.9);
                ctx.moveTo(centerX - 10, centerY + radius * 0.9);
                ctx.lineTo(centerX + 10, centerY + radius * 0.9);
                ctx.stroke();
                break;
                
            case 'receiving_vessel':
                ctx.beginPath();
                ctx.arc(centerX, centerY - radius * 0.2, radius * 0.6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
                
            case 'sound_waves':
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(centerX - radius * 0.7, centerY, radius * 0.2 * i, -Math.PI/4, Math.PI/4);
                    ctx.stroke();
                }
                break;
                
            // Add more element types as needed
            default:
                // Default to a small decorative element
                ctx.beginPath();
                ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    drawPureHarmonySigil(ctx, harmony, width, height) {
        // Draw a pure harmony sigil without Applied Harmony specific elements
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Background field
        this.drawSacredBackground(ctx, width, height, harmony);
        
        // Main geometry
        this.drawHarmonyGeometry(ctx, harmony, width, height);
        
        // Harmony symbol in center
        ctx.save();
        ctx.font = `${width * 0.2}px Arial`;
        ctx.fillStyle = harmony.primaryColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(harmony.symbol, centerX, centerY);
        ctx.restore();
        
        // Sacred border
        this.drawSacredBorder(ctx, width, height, harmony);
    }

    drawSacredBorder(ctx, width, height, harmony) {
        // Subtle border with sacred proportions
        ctx.save();
        ctx.strokeStyle = harmony.primaryColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        const margin = width * 0.05;
        ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
        
        ctx.restore();
    }

    // === UTILITY METHODS ===

    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    createMockSigil(id, size) {
        // Mock sigil for when canvas isn't available
        return {
            toBuffer: () => Buffer.from(`Sacred sigil for ${id} (${size})`, 'utf8'),
            width: this.sigilConfig.sizes[size].width,
            height: this.sigilConfig.sizes[size].height
        };
    }

    // === BATCH GENERATION ===

    async generateAllAppliedHarmonySigils(size = 'medium') {
        console.log(`🔮 Generating Applied Harmony sigils (${size} size)...\n`);
        
        let generated = 0;
        const glyphIds = Object.keys(this.sigilConfig.appliedHarmonySigils);
        
        for (const glyphId of glyphIds) {
            try {
                const canvas = await this.generateAppliedHarmonySigil(glyphId, size);
                const filename = `sigil-${glyphId.toLowerCase().replace('ω', 'omega')}-${size}.png`;
                const filepath = path.join(this.outputDir, filename);
                
                const buffer = canvas.toBuffer('image/png');
                await fs.writeFile(filepath, buffer);
                
                console.log(`✅ Generated ${filename}`);
                generated++;
                
            } catch (error) {
                console.error(`❌ Error generating sigil for ${glyphId}:`, error.message);
            }
        }
        
        console.log(`\n🎉 Generated ${generated} Applied Harmony sigils!`);
    }

    async generateAllHarmonySigils(size = 'medium') {
        console.log(`🌟 Generating Pure Harmony sigils (${size} size)...\n`);
        
        let generated = 0;
        const harmonies = Object.keys(this.sigilConfig.harmonySigils);
        
        for (const harmonyName of harmonies) {
            try {
                const canvas = await this.generateHarmonySigil(harmonyName, size);
                const filename = `harmony-sigil-${harmonyName}-${size}.png`;
                const filepath = path.join(this.outputDir, filename);
                
                const buffer = canvas.toBuffer('image/png');
                await fs.writeFile(filepath, buffer);
                
                console.log(`✅ Generated ${filename}`);
                generated++;
                
            } catch (error) {
                console.error(`❌ Error generating harmony sigil for ${harmonyName}:`, error.message);
            }
        }
        
        console.log(`\n🎉 Generated ${generated} Pure Harmony sigils!`);
    }

    async generateAllSizes() {
        console.log('🎨 Generating all sigil sizes...\n');
        
        const sizes = ['small', 'medium', 'large', 'vector'];
        
        for (const size of sizes) {
            console.log(`\n--- Generating ${size} sigils ---`);
            await this.generateAllAppliedHarmonySigils(size);
            await this.generateAllHarmonySigils(size);
        }
        
        console.log('\n✨ All sacred sigils generated successfully!');
    }

    async verifySigils() {
        console.log('🔍 Verifying generated sigils...\n');
        
        try {
            const files = await fs.readdir(this.outputDir);
            const sigilFiles = files.filter(file => file.endsWith('.png'));
            
            console.log(`Found ${sigilFiles.length} sacred sigils:`);
            
            const categories = {
                'Applied Harmony': [],
                'Pure Harmony': [],
                'Other': []
            };
            
            sigilFiles.forEach(file => {
                if (file.startsWith('sigil-omega')) {
                    categories['Applied Harmony'].push(file);
                } else if (file.startsWith('harmony-sigil')) {
                    categories['Pure Harmony'].push(file);
                } else {
                    categories['Other'].push(file);
                }
            });
            
            Object.entries(categories).forEach(([category, files]) => {
                if (files.length > 0) {
                    console.log(`\n${category} Sigils (${files.length}):`);
                    files.forEach(file => {
                        console.log(`  ✅ ${file}`);
                    });
                }
            });
            
            console.log('\n✨ All sigils verified successfully!');
            return true;
            
        } catch (error) {
            console.error('❌ Error verifying sigils:', error);
            return false;
        }
    }

    // === SACRED SIGIL MEANINGS ===

    getSigilMeaning(glyphId) {
        const sigilData = this.sigilConfig.appliedHarmonySigils[glyphId];
        if (!sigilData) return null;
        
        const harmony = this.sigilConfig.harmonySigils[sigilData.harmony];
        
        return {
            name: sigilData.name,
            harmony: sigilData.harmony,
            intention: sigilData.intention,
            elements: sigilData.elements,
            description: harmony.description,
            sacredNumber: sigilData.sacredNumber,
            colors: {
                primary: harmony.primaryColor,
                secondary: harmony.secondaryColor
            }
        };
    }

    generateSigilMeaningsGuide() {
        console.log('📖 Sacred Sigil Meanings Guide\n');
        console.log('Each sigil carries the energetic signature of its Applied Harmony:\n');
        
        Object.entries(this.sigilConfig.appliedHarmonySigils).forEach(([glyphId, data]) => {
            const meaning = this.getSigilMeaning(glyphId);
            
            console.log(`${glyphId}: ${meaning.name}`);
            console.log(`  Harmony: ${meaning.harmony}`);
            console.log(`  Intention: ${meaning.intention}`);
            console.log(`  Sacred Number: ${meaning.sacredNumber}`);
            console.log(`  Elements: ${meaning.elements.join(', ')}`);
            console.log(`  Colors: ${meaning.colors.primary} / ${meaning.colors.secondary}`);
            console.log('');
        });
    }
}

// CLI Interface
if (require.main === module) {
    const generator = new SacredSigilGenerator();
    const command = process.argv[2];
    const size = process.argv[3] || 'medium';
    
    switch (command) {
        case 'all':
            generator.generateAllSizes();
            break;
            
        case 'applied-harmonies':
            generator.generateAllAppliedHarmonySigils(size);
            break;
            
        case 'pure-harmonies':
            generator.generateAllHarmonySigils(size);
            break;
            
        case 'verify':
            generator.verifySigils();
            break;
            
        case 'meanings':
            generator.generateSigilMeaningsGuide();
            break;
            
        case 'single':
            const glyphId = process.argv[3];
            if (!glyphId) {
                console.error('Please specify a glyph ID (e.g., Ω45)');
                process.exit(1);
            }
            generator.generateAppliedHarmonySigil(glyphId, size || 'medium')
                .then(canvas => {
                    const filename = `sigil-${glyphId.toLowerCase().replace('ω', 'omega')}-${size || 'medium'}.png`;
                    const filepath = path.join(generator.outputDir, filename);
                    return fs.writeFile(filepath, canvas.toBuffer('image/png'));
                })
                .then(() => console.log(`✅ Generated sigil for ${glyphId}`))
                .catch(error => console.error(`❌ Error:`, error.message));
            break;
            
        default:
            console.log(`
Sacred Sigil Generator

Usage:
  node sacred-sigil-generator.cjs all                    # Generate all sigils in all sizes
  node sacred-sigil-generator.cjs applied-harmonies [size] # Generate Applied Harmony sigils
  node sacred-sigil-generator.cjs pure-harmonies [size]   # Generate Pure Harmony sigils
  node sacred-sigil-generator.cjs single <glyphId> [size] # Generate single sigil
  node sacred-sigil-generator.cjs verify                 # Verify generated sigils
  node sacred-sigil-generator.cjs meanings               # Show sigil meanings guide

Sizes: small (64x64), medium (128x128), large (256x256), vector (512x512)

Sacred geometry expressing consciousness principles. 🔮
            `);
    }
}

module.exports = SacredSigilGenerator;