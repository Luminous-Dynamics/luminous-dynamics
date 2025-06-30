/**
 * Sacred Image Generator
 * 
 * Automated generation of visual elements for Applied Harmonies
 * Creates consistent, beautiful imagery that serves consciousness
 * rather than consuming attention.
 */

const fs = require('fs').promises;
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

class SacredImageGenerator {
    constructor() {
        this.imageConfig = {
            // Standard sizes for different use cases
            sizes: {
                glyphCard: { width: 400, height: 500 },
                harmonyBadge: { width: 120, height: 40 },
                practiceIcon: { width: 64, height: 64 },
                socialShare: { width: 1200, height: 630 },
                favicon: { width: 32, height: 32 }
            },
            
            // Sacred color palette
            colors: {
                // Primary harmony colors
                transparency: '#A8B5A6',
                coherence: '#8A9E88', 
                resonance: '#B3C5D7',
                agency: '#D4A574',
                vitality: '#E8A87C',
                mutuality: '#C4A5D4',
                novelty: '#A8D4D4',
                
                // Supporting colors
                sacred: '#A8B5A6',
                wisdom: '#6B8268',
                love: '#B3C5D7',
                light: '#F8F6F3',
                depth: '#2C2C2C',
                
                // Gradients
                gradients: {
                    sacred: ['#A8B5A6', '#8A9E88'],
                    wisdom: ['#6B8268', '#5A6B57'],
                    light: ['#F8F6F3', '#E8E6E1'],
                    harmony: ['#A8B5A6', '#B3C5D7']
                }
            },
            
            // Typography settings
            fonts: {
                primary: 'Georgia, serif',
                secondary: 'Inter, sans-serif',
                sizes: {
                    title: 24,
                    subtitle: 18,
                    body: 14,
                    caption: 12
                }
            },
            
            // Sacred symbols and patterns
            symbols: {
                infinity: '∞',
                circle: '○',
                dot: '●',
                wave: '~',
                star: '✦',
                heart: '♡',
                diamond: '◇',
                triangle: '△'
            }
        };
        
        this.outputDir = 'assets/generated-images';
        this.ensureOutputDirectory();
    }

    async ensureOutputDirectory() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            console.warn('Could not create output directory:', error.message);
        }
    }

    // === GLYPH CARD GENERATION ===
    
    async generateGlyphCard(glyphData) {
        const { width, height } = this.imageConfig.sizes.glyphCard;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = this.createSacredGradient(ctx, width, height, glyphData.harmony);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Sacred border
        this.drawSacredBorder(ctx, width, height, glyphData.harmony);
        
        // Glyph symbol/sigil
        this.drawGlyphSigil(ctx, glyphData, width * 0.5, height * 0.2);
        
        // Glyph name
        this.drawText(ctx, glyphData.name, width * 0.5, height * 0.4, {
            font: `${this.imageConfig.fonts.sizes.title}px ${this.imageConfig.fonts.primary}`,
            color: this.imageConfig.colors.depth,
            align: 'center',
            weight: 'bold'
        });
        
        // Core question (wrapped)
        this.drawWrappedText(ctx, `"${glyphData.quadrants.why.coreQuestion}"`, 
            width * 0.1, height * 0.5, width * 0.8, {
            font: `${this.imageConfig.fonts.sizes.body}px ${this.imageConfig.fonts.primary}`,
            color: this.imageConfig.colors.wisdom,
            align: 'center',
            style: 'italic'
        });
        
        // Harmony badge
        this.drawHarmonyBadge(ctx, glyphData.harmony, width * 0.5, height * 0.8);
        
        // Sacred watermark
        this.drawWatermark(ctx, width, height);
        
        return canvas;
    }

    async generateAllGlyphCards() {
        console.log('🎨 Generating sacred glyph cards...\n');
        
        try {
            // Load glyph data
            const glyphsData = await this.loadGlyphsData();
            let generated = 0;
            
            for (const [glyphId, glyphData] of Object.entries(glyphsData)) {
                if (glyphData.type === 'applied_harmony') {
                    const canvas = await this.generateGlyphCard(glyphData);
                    const filename = `glyph-card-${glyphId.toLowerCase().replace('ω', 'omega')}.png`;
                    const filepath = path.join(this.outputDir, filename);
                    
                    const buffer = canvas.toBuffer('image/png');
                    await fs.writeFile(filepath, buffer);
                    
                    console.log(`✅ Generated ${filename}`);
                    generated++;
                }
            }
            
            console.log(`\n🎉 Generated ${generated} glyph cards!`);
            
        } catch (error) {
            console.error('❌ Error generating glyph cards:', error);
        }
    }

    // === HARMONY BADGES ===
    
    async generateHarmonyBadge(harmony) {
        const { width, height } = this.imageConfig.sizes.harmonyBadge;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background
        const color = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        ctx.fillStyle = color;
        ctx.roundRect(0, 0, width, height, 20);
        ctx.fill();
        
        // Text
        this.drawText(ctx, harmony, width * 0.5, height * 0.5, {
            font: `${this.imageConfig.fonts.sizes.caption}px ${this.imageConfig.fonts.secondary}`,
            color: 'white',
            align: 'center',
            weight: 'bold'
        });
        
        return canvas;
    }

    async generateAllHarmonyBadges() {
        console.log('🏷️  Generating harmony badges...\n');
        
        const harmonies = Object.keys(this.imageConfig.colors).filter(key => 
            !['sacred', 'wisdom', 'love', 'light', 'depth', 'gradients'].includes(key)
        );
        
        for (const harmony of harmonies) {
            const canvas = await this.generateHarmonyBadge(harmony);
            const filename = `harmony-badge-${harmony}.png`;
            const filepath = path.join(this.outputDir, filename);
            
            const buffer = canvas.toBuffer('image/png');
            await fs.writeFile(filepath, buffer);
            
            console.log(`✅ Generated ${filename}`);
        }
        
        console.log(`\n🎉 Generated ${harmonies.length} harmony badges!`);
    }

    // === PRACTICE ICONS ===
    
    async generatePracticeIcon(practiceType, harmony = 'sacred') {
        const { width, height } = this.imageConfig.sizes.practiceIcon;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background circle
        const color = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.5, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Practice symbol
        const symbol = this.getPracticeSymbol(practiceType);
        this.drawText(ctx, symbol, width * 0.5, height * 0.5, {
            font: `${width * 0.4}px ${this.imageConfig.fonts.secondary}`,
            color: 'white',
            align: 'center'
        });
        
        return canvas;
    }

    getPracticeSymbol(practiceType) {
        const symbols = {
            breathing: this.imageConfig.symbols.wave,
            meditation: this.imageConfig.symbols.circle,
            listening: this.imageConfig.symbols.heart,
            expression: this.imageConfig.symbols.diamond,
            choice: this.imageConfig.symbols.triangle,
            boundary: this.imageConfig.symbols.star,
            repair: this.imageConfig.symbols.infinity
        };
        
        return symbols[practiceType] || this.imageConfig.symbols.dot;
    }

    // === SOCIAL SHARE IMAGES ===
    
    async generateSocialShareImage(title, subtitle = '', harmony = 'sacred') {
        const { width, height } = this.imageConfig.sizes.socialShare;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = this.createSacredGradient(ctx, width, height, harmony, 'horizontal');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Overlay pattern
        this.drawSacredPattern(ctx, width, height, 0.05);
        
        // Sacred logo/symbol
        this.drawText(ctx, this.imageConfig.symbols.infinity, width * 0.1, height * 0.2, {
            font: `${height * 0.15}px ${this.imageConfig.fonts.secondary}`,
            color: 'rgba(255, 255, 255, 0.8)',
            align: 'left'
        });
        
        // Title
        this.drawWrappedText(ctx, title, width * 0.1, height * 0.4, width * 0.8, {
            font: `${height * 0.08}px ${this.imageConfig.fonts.primary}`,
            color: 'white',
            align: 'left',
            weight: 'bold',
            lineHeight: 1.2
        });
        
        // Subtitle
        if (subtitle) {
            this.drawWrappedText(ctx, subtitle, width * 0.1, height * 0.65, width * 0.8, {
                font: `${height * 0.05}px ${this.imageConfig.fonts.secondary}`,
                color: 'rgba(255, 255, 255, 0.9)',
                align: 'left',
                lineHeight: 1.3
            });
        }
        
        // Branding
        this.drawText(ctx, 'Applied Harmonies', width * 0.9, height * 0.9, {
            font: `${height * 0.04}px ${this.imageConfig.fonts.secondary}`,
            color: 'rgba(255, 255, 255, 0.7)',
            align: 'right'
        });
        
        return canvas;
    }

    // === DRAWING UTILITIES ===
    
    createSacredGradient(ctx, width, height, harmony = 'sacred', direction = 'vertical') {
        const colors = this.imageConfig.colors.gradients[harmony] || 
                      this.imageConfig.colors.gradients.sacred;
        
        let gradient;
        if (direction === 'horizontal') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
        } else {
            gradient = ctx.createLinearGradient(0, 0, 0, height);
        }
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        return gradient;
    }

    drawSacredBorder(ctx, width, height, harmony = 'sacred') {
        const color = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.roundRect(5, 5, width - 10, height - 10, 15);
        ctx.stroke();
        
        // Corner decorations
        const cornerSize = 15;
        ctx.fillStyle = color;
        
        // Top left
        ctx.fillRect(10, 10, cornerSize, 3);
        ctx.fillRect(10, 10, 3, cornerSize);
        
        // Top right
        ctx.fillRect(width - 25, 10, cornerSize, 3);
        ctx.fillRect(width - 13, 10, 3, cornerSize);
        
        // Bottom left
        ctx.fillRect(10, height - 13, cornerSize, 3);
        ctx.fillRect(10, height - 25, 3, cornerSize);
        
        // Bottom right
        ctx.fillRect(width - 25, height - 13, cornerSize, 3);
        ctx.fillRect(width - 13, height - 25, 3, cornerSize);
    }

    drawGlyphSigil(ctx, glyphData, x, y) {
        // Create a simple but elegant sigil based on glyph properties
        const harmony = glyphData.harmony;
        const glyphNumber = glyphData.id.replace('Ω', '');
        
        // Base circle
        const radius = 30;
        ctx.strokeStyle = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner symbol based on harmony
        ctx.fillStyle = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        this.drawText(ctx, this.getHarmonySymbol(harmony), x, y, {
            font: `${radius}px ${this.imageConfig.fonts.secondary}`,
            color: this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred,
            align: 'center'
        });
        
        // Glyph number
        this.drawText(ctx, glyphNumber, x, y + radius + 20, {
            font: `${this.imageConfig.fonts.sizes.caption}px ${this.imageConfig.fonts.secondary}`,
            color: this.imageConfig.colors.wisdom,
            align: 'center',
            weight: 'bold'
        });
    }

    getHarmonySymbol(harmony) {
        const symbols = {
            transparency: this.imageConfig.symbols.diamond,
            coherence: this.imageConfig.symbols.circle,
            resonance: this.imageConfig.symbols.wave,
            agency: this.imageConfig.symbols.triangle,
            vitality: this.imageConfig.symbols.star,
            mutuality: this.imageConfig.symbols.heart,
            novelty: this.imageConfig.symbols.infinity
        };
        
        return symbols[harmony] || this.imageConfig.symbols.dot;
    }

    drawHarmonyBadge(ctx, harmony, x, y) {
        const badgeWidth = 80;
        const badgeHeight = 25;
        const color = this.imageConfig.colors[harmony] || this.imageConfig.colors.sacred;
        
        // Background
        ctx.fillStyle = color;
        ctx.roundRect(x - badgeWidth/2, y - badgeHeight/2, badgeWidth, badgeHeight, 12);
        ctx.fill();
        
        // Text
        this.drawText(ctx, harmony, x, y, {
            font: `${this.imageConfig.fonts.sizes.caption}px ${this.imageConfig.fonts.secondary}`,
            color: 'white',
            align: 'center',
            weight: 'bold'
        });
    }

    drawSacredPattern(ctx, width, height, opacity = 0.1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        
        // Geometric pattern
        const spacing = 50;
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    drawWatermark(ctx, width, height) {
        this.drawText(ctx, 'Applied Harmonies', width - 10, height - 10, {
            font: `${this.imageConfig.fonts.sizes.caption}px ${this.imageConfig.fonts.secondary}`,
            color: 'rgba(0, 0, 0, 0.3)',
            align: 'right'
        });
    }

    drawText(ctx, text, x, y, options = {}) {
        const {
            font = `${this.imageConfig.fonts.sizes.body}px ${this.imageConfig.fonts.primary}`,
            color = this.imageConfig.colors.depth,
            align = 'center',
            weight = 'normal',
            style = 'normal'
        } = options;
        
        ctx.save();
        ctx.font = `${style} ${weight} ${font}`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    drawWrappedText(ctx, text, x, y, maxWidth, options = {}) {
        const {
            font = `${this.imageConfig.fonts.sizes.body}px ${this.imageConfig.fonts.primary}`,
            color = this.imageConfig.colors.depth,
            align = 'left',
            lineHeight = 1.4
        } = options;
        
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        const fontSize = parseInt(font.match(/\d+/)[0]);
        const actualLineHeight = fontSize * lineHeight;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * actualLineHeight));
        });
        
        ctx.restore();
    }

    // === DATA LOADING ===
    
    async loadGlyphsData() {
        try {
            // Try to load from true integration glyphs first
            const trueIntegrationPath = 'unified-field/true-integration-foundational-glyphs.js';
            if (await this.fileExists(trueIntegrationPath)) {
                const module = require(`../${trueIntegrationPath}`);
                const instance = new module.default();
                return instance.glyphs;
            }
            
            // Fallback to regular foundational glyphs
            const foundationalPath = 'unified-field/foundational-glyphs.js';
            if (await this.fileExists(foundationalPath)) {
                const module = require(`../${foundationalPath}`);
                const instance = new module.default();
                return instance.glyphs;
            }
            
            throw new Error('Could not load glyph data');
            
        } catch (error) {
            console.error('Error loading glyph data:', error);
            return this.getMockGlyphData();
        }
    }

    getMockGlyphData() {
        // Mock data for testing
        return {
            "Ω45": {
                id: "Ω45",
                name: "First Presence",
                harmony: "transparency",
                type: "applied_harmony",
                quadrants: {
                    why: {
                        coreQuestion: "Can I meet this moment without needing it to be different?"
                    }
                }
            }
        };
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    // === BATCH GENERATION ===
    
    async generateAllImages() {
        console.log('🎨 Starting Sacred Image Generation...\n');
        
        await this.generateAllGlyphCards();
        await this.generateAllHarmonyBadges();
        
        // Generate some practice icons
        const practiceTypes = ['breathing', 'meditation', 'listening', 'expression', 'choice', 'boundary', 'repair'];
        console.log('\n🔮 Generating practice icons...\n');
        
        for (const practiceType of practiceTypes) {
            const canvas = await this.generatePracticeIcon(practiceType);
            const filename = `practice-icon-${practiceType}.png`;
            const filepath = path.join(this.outputDir, filename);
            
            const buffer = canvas.toBuffer('image/png');
            await fs.writeFile(filepath, buffer);
            
            console.log(`✅ Generated ${filename}`);
        }
        
        // Generate social share image
        console.log('\n📱 Generating social share image...\n');
        const socialCanvas = await this.generateSocialShareImage(
            'Applied Harmonies',
            'Practical tools for conscious relationship'
        );
        const socialFilepath = path.join(this.outputDir, 'social-share-applied-harmonies.png');
        const socialBuffer = socialCanvas.toBuffer('image/png');
        await fs.writeFile(socialFilepath, socialBuffer);
        console.log('✅ Generated social-share-applied-harmonies.png');
        
        console.log('\n🎉 Sacred image generation complete!');
        console.log(`📁 All images saved to: ${this.outputDir}`);
    }

    // === VERIFICATION ===
    
    async verifyGeneratedImages() {
        console.log('🔍 Verifying generated images...\n');
        
        try {
            const files = await fs.readdir(this.outputDir);
            const imageFiles = files.filter(file => file.endsWith('.png'));
            
            console.log(`Found ${imageFiles.length} generated images:`);
            
            for (const file of imageFiles) {
                const filepath = path.join(this.outputDir, file);
                const stats = await fs.stat(filepath);
                
                console.log(`✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
            }
            
            console.log('\n✨ All images verified successfully!');
            return true;
            
        } catch (error) {
            console.error('❌ Error verifying images:', error);
            return false;
        }
    }
}

// Extend canvas prototype for rounded rectangles
if (typeof require !== 'undefined') {
    try {
        require('canvas');
        const { CanvasRenderingContext2D } = require('canvas');
        
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            this.beginPath();
            this.moveTo(x + radius, y);
            this.lineTo(x + width - radius, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.lineTo(x + width, y + height - radius);
            this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.lineTo(x + radius, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.lineTo(x, y + radius);
            this.quadraticCurveTo(x, y, x + radius, y);
            this.closePath();
        };
    } catch (error) {
        console.warn('Canvas module not available - image generation will be limited');
    }
}

// CLI Interface
if (require.main === module) {
    const generator = new SacredImageGenerator();
    const command = process.argv[2];
    
    switch (command) {
        case 'all':
            generator.generateAllImages();
            break;
            
        case 'glyph-cards':
            generator.generateAllGlyphCards();
            break;
            
        case 'badges':
            generator.generateAllHarmonyBadges();
            break;
            
        case 'verify':
            generator.verifyGeneratedImages();
            break;
            
        default:
            console.log(`
Sacred Image Generator

Usage:
  node sacred-image-generator.js all         # Generate all images
  node sacred-image-generator.js glyph-cards # Generate glyph cards only
  node sacred-image-generator.js badges      # Generate harmony badges only
  node sacred-image-generator.js verify      # Verify generated images

Creating visual beauty that serves consciousness. ✨
            `);
    }
}

module.exports = SacredImageGenerator;