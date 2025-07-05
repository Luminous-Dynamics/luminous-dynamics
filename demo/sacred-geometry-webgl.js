/**
 * Sacred Geometry WebGL Engine for LuminousOS
 * 
 * Features:
 * - Merkaba spinning in center
 * - Torus field flowing with breath
 * - Platonic solids emerging from coherence
 * - Real-time shader effects
 * - Particle systems in 3D
 * - Fractal geometry generation
 */

class SacredGeometryWebGL {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.programs = {};
        this.geometries = {};
        this.uniforms = {};
        this.textures = {};
        this.frameCount = 0;
        this.coherenceLevel = 0.7;
        this.breathPhase = 0;
        this.time = 0;
        this.fieldMomentum = 0.5;
        this.participants = [];
        this.selectedGlyph = null;
        this.glyphPositions = [];
        this.emergenceLevel = 0;
        
        // Sacred constants from Rust version
        this.PHI = 1.618033988749895;
        this.TAU = Math.PI * 2;
        this.SCHUMANN_FREQ = 7.83;
        
        this.init();
    }
    
    init() {
        // Initialize WebGL context
        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            premultipliedAlpha: false,
            antialias: true
        });
        
        if (!this.gl) {
            console.error('WebGL2 not supported, falling back to Canvas 2D');
            return false;
        }
        
        const gl = this.gl;
        
        // Set up WebGL state
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        
        // Create shader programs
        this.createShaderPrograms();
        
        // Create geometries
        this.createGeometries();
        
        // Set up camera and projection
        this.setupCamera();
        
        // Start render loop
        this.render();
        
        return true;
    }
    
    glyphRingVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        in vec2 aTexCoord;
        in float aGlyphIndex;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform float uTime;
        uniform float uSelectedGlyph;
        uniform float uCoherence;
        
        out vec2 vTexCoord;
        out float vGlyphIndex;
        out float vSelected;
        out float vPulse;
        
        const float TAU = 6.283185307;
        const float PHI = 1.618033988;
        
        void main() {
            // Arrange 87 glyphs in sacred ring
            float angle = (aGlyphIndex / 87.0) * TAU;
            float radius = 3.0 + sin(uTime * 0.5 + aGlyphIndex * 0.1) * 0.1 * uCoherence;
            
            // Sacred spiral arrangement
            float spiralFactor = aGlyphIndex * 0.02;
            radius += spiralFactor;
            
            vec3 pos = vec3(
                cos(angle) * radius,
                sin(angle) * radius,
                sin(uTime + aGlyphIndex * PHI) * 0.2 * uCoherence
            );
            
            // Pulse selected glyph
            vSelected = (abs(aGlyphIndex - uSelectedGlyph) < 0.5) ? 1.0 : 0.0;
            vPulse = 1.0 + vSelected * sin(uTime * 3.0) * 0.2;
            
            pos *= vPulse;
            
            vTexCoord = aTexCoord;
            vGlyphIndex = aGlyphIndex;
            
            gl_Position = uProjection * uView * vec4(pos, 1.0);
        }`;
    }
    
    glyphRingFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec2 vTexCoord;
        in float vGlyphIndex;
        in float vSelected;
        in float vPulse;
        
        uniform float uTime;
        uniform float uCoherence;
        uniform sampler2D uGlyphTexture;
        
        out vec4 fragColor;
        
        vec3 getGlyphColor(float index) {
            // Color based on glyph category
            if (index < 45.0) { // Foundational
                return vec3(0.3, 0.6, 0.9);
            } else if (index < 56.0) { // Applied Harmonies
                return vec3(0.9, 0.7, 0.3);
            } else if (index < 65.0) { // Threshold
                return vec3(0.7, 0.3, 0.9);
            } else { // Meta
                return vec3(0.3, 0.9, 0.6);
            }
        }
        
        void main() {
            vec3 glyphColor = getGlyphColor(vGlyphIndex);
            
            // Sacred glow
            float dist = length(vTexCoord - 0.5);
            float glow = exp(-dist * 3.0) * uCoherence;
            
            // Selection highlight
            glyphColor += vec3(vSelected * 0.5);
            
            // Coherence shimmer
            float shimmer = sin(uTime * 2.0 + vGlyphIndex * 0.5) * 0.1 + 0.9;
            glyphColor *= shimmer;
            
            fragColor = vec4(glyphColor, (1.0 - dist) * 0.8 + glow);
        }`;
    }
    
    coherenceFieldVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform float uTime;
        
        out vec3 vPosition;
        
        void main() {
            vPosition = aPosition;
            gl_Position = uProjection * uView * vec4(aPosition, 1.0);
        }`;
    }
    
    coherenceFieldFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 vPosition;
        
        uniform float uTime;
        uniform float uCoherence;
        uniform vec3 uParticipants[13]; // Max 13 participants
        uniform int uParticipantCount;
        
        out vec4 fragColor;
        
        const float SCHUMANN = 7.83;
        
        float wave(vec3 pos, vec3 source, float freq) {
            float dist = distance(pos, source);
            return sin(dist * freq - uTime * SCHUMANN) / (1.0 + dist);
        }
        
        void main() {
            vec3 fieldColor = vec3(0.0);
            float totalWave = 0.0;
            
            // Calculate interference pattern from all participants
            for (int i = 0; i < uParticipantCount; i++) {
                vec3 participant = uParticipants[i];
                float participantWave = wave(vPosition, participant, SCHUMANN);
                totalWave += participantWave;
                
                // Color based on wave phase
                vec3 waveColor = vec3(
                    0.5 + participantWave * 0.5,
                    0.3 + participantWave * 0.3,
                    0.8 + participantWave * 0.2
                );
                fieldColor += waveColor / float(uParticipantCount);
            }
            
            // Emergence sparkles at high coherence
            if (uCoherence > 0.9) {
                float sparkle = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
                if (sparkle > 0.98) {
                    fieldColor += vec3(1.0, 0.9, 0.8) * (uCoherence - 0.9) * 10.0;
                }
            }
            
            // Sacred boundary glow
            float edgeDist = length(vPosition.xy);
            float boundary = smoothstep(4.0, 5.0, edgeDist) * smoothstep(6.0, 5.0, edgeDist);
            fieldColor += vec3(0.2, 0.3, 0.5) * boundary;
            
            fragColor = vec4(fieldColor, 0.3 + abs(totalWave) * 0.4 * uCoherence);
        }`;
    }
    
    createShaderPrograms() {
        // Merkaba shader program
        this.programs.merkaba = this.createProgram(
            this.merkabaVertexShader(),
            this.merkabaFragmentShader()
        );
        
        // Torus field shader program
        this.programs.torus = this.createProgram(
            this.torusVertexShader(),
            this.torusFragmentShader()
        );
        
        // Platonic solids shader program
        this.programs.platonic = this.createProgram(
            this.platonicVertexShader(),
            this.platonicFragmentShader()
        );
        
        // Particle system shader
        this.programs.particles = this.createProgram(
            this.particleVertexShader(),
            this.particleFragmentShader()
        );
        
        // Sacred geometry patterns shader
        this.programs.patterns = this.createProgram(
            this.patternVertexShader(),
            this.patternFragmentShader()
        );
        
        // Glyph ring shader (ported from Rust)
        this.programs.glyphRing = this.createProgram(
            this.glyphRingVertexShader(),
            this.glyphRingFragmentShader()
        );
        
        // Coherence field shader (ported from Rust)
        this.programs.coherenceField = this.createProgram(
            this.coherenceFieldVertexShader(),
            this.coherenceFieldFragmentShader()
        );
    }
    
    merkabaVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        in vec3 aNormal;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform mat4 uModel;
        uniform float uTime;
        uniform float uCoherence;
        
        out vec3 vNormal;
        out vec3 vPosition;
        out float vGlow;
        
        void main() {
            // Apply coherence-based scaling
            vec3 pos = aPosition * (0.8 + uCoherence * 0.4);
            
            // Rotate based on time
            float angle = uTime * 0.5;
            mat3 rotation = mat3(
                cos(angle), 0.0, sin(angle),
                0.0, 1.0, 0.0,
                -sin(angle), 0.0, cos(angle)
            );
            
            pos = rotation * pos;
            
            // Apply matrices
            vec4 worldPos = uModel * vec4(pos, 1.0);
            vPosition = worldPos.xyz;
            vNormal = mat3(uModel) * rotation * aNormal;
            
            // Calculate glow based on coherence
            vGlow = uCoherence;
            
            gl_Position = uProjection * uView * worldPos;
        }`;
    }
    
    merkabaFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 vNormal;
        in vec3 vPosition;
        in float vGlow;
        
        uniform vec3 uLightDirection;
        uniform float uTime;
        uniform float uCoherence;
        
        out vec4 fragColor;
        
        void main() {
            // Base color - purple to pink gradient
            vec3 color1 = vec3(0.42, 0.27, 0.76); // #6B46C1
            vec3 color2 = vec3(0.93, 0.27, 0.60); // #EC4899
            
            // Mix colors based on position
            vec3 baseColor = mix(color1, color2, (vPosition.y + 1.0) * 0.5);
            
            // Calculate lighting
            vec3 normal = normalize(vNormal);
            float diffuse = max(dot(normal, uLightDirection), 0.0);
            
            // Add rim lighting effect
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(dot(viewDir, normal), 0.0);
            rim = pow(rim, 2.0) * vGlow;
            
            // Combine lighting
            vec3 finalColor = baseColor * (0.3 + diffuse * 0.7) + vec3(rim) * 0.5;
            
            // Add coherence-based pulsing
            float pulse = sin(uTime * 3.0) * 0.1 + 1.0;
            finalColor *= pulse * vGlow;
            
            // Alpha based on coherence
            float alpha = 0.6 + vGlow * 0.4;
            
            fragColor = vec4(finalColor, alpha);
        }`;
    }
    
    torusVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec2 aUV;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform float uTime;
        uniform float uBreathPhase;
        uniform float uCoherence;
        
        out vec3 vPosition;
        out vec2 vUV;
        out float vFlow;
        
        vec3 torusPoint(float u, float v, float R, float r) {
            float x = (R + r * cos(v)) * cos(u);
            float y = r * sin(v);
            float z = (R + r * cos(v)) * sin(u);
            return vec3(x, y, z);
        }
        
        void main() {
            vUV = aUV;
            
            // Torus parameters
            float R = 2.0 + uBreathPhase * 0.5; // Major radius
            float r = 0.8 + uCoherence * 0.3;   // Minor radius
            
            // UV to torus mapping
            float u = aUV.x * 6.28318530718;
            float v = aUV.y * 6.28318530718;
            
            // Add flow distortion
            float flowOffset = uTime * 0.5;
            u += sin(v + flowOffset) * 0.2 * uCoherence;
            
            // Calculate position
            vPosition = torusPoint(u, v, R, r);
            
            // Flow intensity for fragment shader
            vFlow = sin(u + flowOffset) * 0.5 + 0.5;
            
            // Apply view and projection
            gl_Position = uProjection * uView * vec4(vPosition, 1.0);
        }`;
    }
    
    torusFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 vPosition;
        in vec2 vUV;
        in float vFlow;
        
        uniform float uTime;
        uniform float uCoherence;
        uniform vec3 uFieldColor;
        
        out vec4 fragColor;
        
        void main() {
            // Energy flow visualization
            vec3 flowColor = mix(
                vec3(0.2, 0.1, 0.5),  // Deep purple
                vec3(0.9, 0.3, 0.7),  // Bright pink
                vFlow
            );
            
            // Add pulsing bands
            float bands = sin(vUV.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
            flowColor += vec3(bands * 0.2) * uCoherence;
            
            // Transparency based on flow and coherence
            float alpha = (0.2 + vFlow * 0.3) * uCoherence;
            
            fragColor = vec4(flowColor, alpha);
        }`;
    }
    
    platonicVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        in vec3 aNormal;
        in float aPhase;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform mat4 uModel;
        uniform float uTime;
        uniform float uCoherence;
        uniform float uEmergence;
        
        out vec3 vNormal;
        out vec3 vPosition;
        out float vEmergence;
        
        void main() {
            // Scale based on emergence and coherence
            float scale = uEmergence * (0.5 + uCoherence * 0.5);
            vec3 pos = aPosition * scale;
            
            // Individual rotation based on phase
            float angle = uTime * (0.3 + aPhase * 0.2);
            mat3 rotation = mat3(
                cos(angle), sin(angle), 0.0,
                -sin(angle), cos(angle), 0.0,
                0.0, 0.0, 1.0
            );
            
            // Orbit around center
            float orbitRadius = 3.0 + sin(uTime * 0.5 + aPhase * 6.28) * 0.5;
            float orbitAngle = uTime * 0.2 + aPhase * 6.28;
            vec3 offset = vec3(
                cos(orbitAngle) * orbitRadius,
                sin(aPhase * 6.28 + uTime) * 0.5,
                sin(orbitAngle) * orbitRadius
            );
            
            pos = rotation * pos + offset;
            
            // Apply transformation
            vec4 worldPos = uModel * vec4(pos, 1.0);
            vPosition = worldPos.xyz;
            vNormal = mat3(uModel) * rotation * aNormal;
            vEmergence = uEmergence;
            
            gl_Position = uProjection * uView * worldPos;
        }`;
    }
    
    platonicFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 vNormal;
        in vec3 vPosition;
        in float vEmergence;
        
        uniform vec3 uLightDirection;
        uniform float uTime;
        uniform float uCoherence;
        
        out vec4 fragColor;
        
        void main() {
            // Sacred color palette
            vec3 colors[5];
            colors[0] = vec3(0.42, 0.27, 0.76); // Purple
            colors[1] = vec3(0.93, 0.27, 0.60); // Pink
            colors[2] = vec3(0.06, 0.73, 0.51); // Teal
            colors[3] = vec3(0.96, 0.82, 0.25); // Gold
            colors[4] = vec3(0.53, 0.81, 0.92); // Sky blue
            
            // Select color based on position
            int colorIndex = int(mod(abs(vPosition.x + vPosition.y + vPosition.z), 5.0));
            vec3 baseColor = colors[colorIndex];
            
            // Calculate lighting
            vec3 normal = normalize(vNormal);
            float diffuse = max(dot(normal, uLightDirection), 0.0);
            
            // Holographic effect
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
            
            // Combine effects
            vec3 finalColor = baseColor * (0.3 + diffuse * 0.7);
            finalColor += fresnel * vec3(0.5, 0.3, 0.8) * uCoherence;
            
            // Emergence fade
            float alpha = vEmergence * (0.6 + uCoherence * 0.4);
            
            fragColor = vec4(finalColor, alpha);
        }`;
    }
    
    particleVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        in vec3 aVelocity;
        in float aLife;
        in float aSize;
        
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform float uTime;
        uniform float uCoherence;
        uniform vec3 uAttractor;
        
        out float vLife;
        out float vSize;
        
        void main() {
            // Update position based on velocity and attractors
            vec3 toAttractor = uAttractor - aPosition;
            float distance = length(toAttractor);
            vec3 attraction = normalize(toAttractor) * (uCoherence / (distance + 1.0));
            
            vec3 pos = aPosition + aVelocity * 0.05 + attraction * 0.1;
            
            // Size based on life and coherence
            vSize = aSize * aLife * (0.5 + uCoherence * 0.5);
            vLife = aLife;
            
            // Billboard the particle
            vec4 viewPos = uView * vec4(pos, 1.0);
            gl_Position = uProjection * viewPos;
            gl_PointSize = vSize * 100.0 / -viewPos.z;
        }`;
    }
    
    particleFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in float vLife;
        in float vSize;
        
        uniform float uTime;
        uniform float uCoherence;
        
        out vec4 fragColor;
        
        void main() {
            // Distance from center of point
            vec2 uv = gl_PointCoord - vec2(0.5);
            float dist = length(uv);
            
            // Soft particle edge
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vLife;
            
            // Color based on life and coherence
            vec3 color = mix(
                vec3(0.5, 0.2, 0.8),  // Purple
                vec3(1.0, 0.6, 0.9),  // Light pink
                vLife * uCoherence
            );
            
            // Add glow
            color += vec3(0.5) * (1.0 - dist) * uCoherence;
            
            fragColor = vec4(color, alpha * 0.6);
        }`;
    }
    
    patternVertexShader() {
        return `#version 300 es
        precision highp float;
        
        in vec2 aPosition;
        
        out vec2 vUV;
        
        void main() {
            vUV = aPosition * 0.5 + 0.5;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }`;
    }
    
    patternFragmentShader() {
        return `#version 300 es
        precision highp float;
        
        in vec2 vUV;
        
        uniform float uTime;
        uniform float uCoherence;
        uniform vec2 uResolution;
        
        out vec4 fragColor;
        
        // Flower of Life pattern
        float flowerOfLife(vec2 p, float scale) {
            p *= scale;
            vec2 id = floor(p);
            p = fract(p) - 0.5;
            
            float d = 1e10;
            for (int y = -1; y <= 1; y++) {
                for (int x = -1; x <= 1; x++) {
                    vec2 offset = vec2(x, y);
                    float dist = length(p - offset * 0.5);
                    d = min(d, abs(dist - 0.3));
                }
            }
            
            return smoothstep(0.02, 0.01, d);
        }
        
        // Sri Yantra triangles
        float sriYantra(vec2 p, float time) {
            float scale = 3.0;
            p *= scale;
            
            // Rotate
            float angle = time * 0.1;
            p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
            
            // Create triangular patterns
            float d = 1e10;
            for (int i = 0; i < 9; i++) {
                float a = float(i) * 0.698;
                vec2 dir = vec2(cos(a), sin(a));
                float dist = abs(dot(p, dir));
                d = min(d, dist);
            }
            
            return smoothstep(0.02, 0.01, d);
        }
        
        void main() {
            vec2 uv = vUV;
            vec2 p = (uv - 0.5) * 2.0;
            p.x *= uResolution.x / uResolution.y;
            
            // Layer 1: Flower of Life
            float flower = flowerOfLife(p, 8.0 + sin(uTime * 0.2) * 2.0);
            
            // Layer 2: Sri Yantra
            float yantra = sriYantra(p, uTime);
            
            // Combine patterns
            float pattern = max(flower, yantra);
            
            // Color based on pattern and coherence
            vec3 color = mix(
                vec3(0.1, 0.05, 0.2),   // Deep purple
                vec3(0.6, 0.3, 0.8),    // Bright purple
                pattern * uCoherence
            );
            
            // Add subtle animation
            color += vec3(sin(uTime + uv.x * 10.0), 
                         cos(uTime + uv.y * 10.0), 
                         sin(uTime * 0.7)) * 0.05 * uCoherence;
            
            fragColor = vec4(color, pattern * 0.3 * uCoherence);
        }`;
    }
    
    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        // Create vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
            return null;
        }
        
        // Create fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
            return null;
        }
        
        // Create program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return null;
        }
        
        // Store attribute and uniform locations
        const attributes = {};
        const uniforms = {};
        
        // Get all attributes
        const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttributes; i++) {
            const info = gl.getActiveAttrib(program, i);
            attributes[info.name] = gl.getAttribLocation(program, info.name);
        }
        
        // Get all uniforms
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const info = gl.getActiveUniform(program, i);
            uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }
        
        return { program, attributes, uniforms };
    }
    
    createGeometries() {
        // Create Merkaba (star tetrahedron)
        this.geometries.merkaba = this.createMerkaba();
        
        // Create torus mesh
        this.geometries.torus = this.createTorus(32, 16);
        
        // Create platonic solids
        this.geometries.tetrahedron = this.createTetrahedron();
        this.geometries.cube = this.createCube();
        this.geometries.octahedron = this.createOctahedron();
        this.geometries.dodecahedron = this.createDodecahedron();
        this.geometries.icosahedron = this.createIcosahedron();
        
        // Create particle system
        this.geometries.particles = this.createParticleSystem(1000);
        
        // Create fullscreen quad for patterns
        this.geometries.quad = this.createQuad();
        
        // Create glyph ring geometry (87 glyphs)
        this.geometries.glyphRing = this.createGlyphRing();
        
        // Create coherence field plane
        this.geometries.coherenceField = this.createFieldPlane();
    }
    
    createMerkaba() {
        const gl = this.gl;
        
        // Merkaba vertices (two intersecting tetrahedra)
        const s = 1.5;
        const vertices = new Float32Array([
            // Upper tetrahedron
            0, s, 0,
            -s, -s/2, s,
            s, -s/2, s,
            0, -s/2, -s,
            
            // Lower tetrahedron
            0, -s, 0,
            -s, s/2, -s,
            s, s/2, -s,
            0, s/2, s
        ]);
        
        const indices = new Uint16Array([
            // Upper tetrahedron
            0, 1, 2,
            0, 2, 3,
            0, 3, 1,
            1, 3, 2,
            
            // Lower tetrahedron
            4, 6, 5,
            4, 7, 6,
            4, 5, 7,
            5, 6, 7
        ]);
        
        // Calculate normals
        const normals = this.calculateNormals(vertices, indices);
        
        // Create buffers
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const nbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        
        return {
            vertexBuffer: vbo,
            normalBuffer: nbo,
            indexBuffer: ibo,
            indexCount: indices.length
        };
    }
    
    createTorus(segments, rings) {
        const gl = this.gl;
        
        const vertices = [];
        const uvs = [];
        const indices = [];
        
        for (let i = 0; i <= rings; i++) {
            const v = i / rings;
            
            for (let j = 0; j <= segments; j++) {
                const u = j / segments;
                
                uvs.push(u, v);
            }
        }
        
        // Generate indices
        for (let i = 0; i < rings; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = a + segments + 1;
                
                indices.push(a, a + 1, b);
                indices.push(b, a + 1, b + 1);
            }
        }
        
        // Create buffers
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        return {
            uvBuffer,
            indexBuffer,
            indexCount: indices.length
        };
    }
    
    createParticleSystem(count) {
        const gl = this.gl;
        
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const lifes = new Float32Array(count);
        const sizes = new Float32Array(count);
        
        // Initialize particles
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Random position in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = Math.random() * 5 + 2;
            
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            
            // Random velocity
            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            
            // Random life and size
            lifes[i] = Math.random();
            sizes[i] = Math.random() * 20 + 10;
        }
        
        // Create buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
        
        const velocityBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.STATIC_DRAW);
        
        const lifeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, lifes, gl.DYNAMIC_DRAW);
        
        const sizeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
        
        return {
            positionBuffer,
            velocityBuffer,
            lifeBuffer,
            sizeBuffer,
            positions,
            velocities,
            lifes,
            sizes,
            count
        };
    }
    
    createQuad() {
        const gl = this.gl;
        
        const vertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1
        ]);
        
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        return { buffer, count: 4 };
    }
    
    createGlyphRing() {
        const gl = this.gl;
        const glyphCount = 87;
        const verticesPerGlyph = 6; // Two triangles for a quad
        
        const vertices = [];
        const texCoords = [];
        const glyphIndices = [];
        
        // Create a quad for each glyph
        for (let i = 0; i < glyphCount; i++) {
            const size = 0.3;
            
            // Quad vertices (will be positioned in shader)
            vertices.push(
                -size, -size, 0,
                size, -size, 0,
                -size, size, 0,
                -size, size, 0,
                size, -size, 0,
                size, size, 0
            );
            
            // Texture coordinates
            texCoords.push(
                0, 1,
                1, 1,
                0, 0,
                0, 0,
                1, 1,
                1, 0
            );
            
            // Glyph index for each vertex
            for (let j = 0; j < verticesPerGlyph; j++) {
                glyphIndices.push(i);
            }
        }
        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        
        const glyphIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, glyphIndexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glyphIndices), gl.STATIC_DRAW);
        
        return {
            vertexBuffer,
            texCoordBuffer,
            glyphIndexBuffer,
            count: glyphCount * verticesPerGlyph
        };
    }
    
    createFieldPlane() {
        const gl = this.gl;
        const resolution = 50;
        const size = 10;
        
        const vertices = [];
        const indices = [];
        
        // Create grid of vertices
        for (let y = 0; y <= resolution; y++) {
            for (let x = 0; x <= resolution; x++) {
                const xPos = (x / resolution - 0.5) * size;
                const yPos = (y / resolution - 0.5) * size;
                vertices.push(xPos, yPos, 0);
            }
        }
        
        // Create indices for triangles
        for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
                const topLeft = y * (resolution + 1) + x;
                const topRight = topLeft + 1;
                const bottomLeft = topLeft + resolution + 1;
                const bottomRight = bottomLeft + 1;
                
                indices.push(
                    topLeft, bottomLeft, topRight,
                    topRight, bottomLeft, bottomRight
                );
            }
        }
        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        return {
            vertexBuffer,
            indexBuffer,
            indexCount: indices.length
        };
    }
    
    // Helper methods for creating platonic solids
    createTetrahedron() {
        const vertices = new Float32Array([
            1, 1, 1,
            -1, -1, 1,
            -1, 1, -1,
            1, -1, -1
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
            0, 3, 1,
            1, 3, 2
        ]);
        
        return this.createIndexedGeometry(vertices, indices);
    }
    
    createCube() {
        const vertices = new Float32Array([
            -1, -1, -1,  1, -1, -1,  1, 1, -1,  -1, 1, -1,
            -1, -1, 1,   1, -1, 1,   1, 1, 1,   -1, 1, 1
        ]);
        
        const indices = new Uint16Array([
            0,1,2, 0,2,3, 4,5,6, 4,6,7,
            0,4,7, 0,7,3, 1,5,6, 1,6,2,
            0,1,5, 0,5,4, 3,2,6, 3,6,7
        ]);
        
        return this.createIndexedGeometry(vertices, indices);
    }
    
    createOctahedron() {
        const vertices = new Float32Array([
            1, 0, 0,  -1, 0, 0,
            0, 1, 0,  0, -1, 0,
            0, 0, 1,  0, 0, -1
        ]);
        
        const indices = new Uint16Array([
            0,2,4, 0,4,3, 0,3,5, 0,5,2,
            1,2,5, 1,5,3, 1,3,4, 1,4,2
        ]);
        
        return this.createIndexedGeometry(vertices, indices);
    }
    
    createDodecahedron() {
        // Simplified dodecahedron
        const phi = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        
        // Generate vertices
        for (let i of [-1, 1]) {
            for (let j of [-1, 1]) {
                for (let k of [-1, 1]) {
                    vertices.push(i, j, k);
                }
                vertices.push(0, i/phi, j*phi);
                vertices.push(i/phi, j*phi, 0);
                vertices.push(i*phi, 0, j/phi);
            }
        }
        
        // Simplified indices (not exact dodecahedron)
        const indices = [];
        for (let i = 0; i < vertices.length / 3; i++) {
            for (let j = i + 1; j < vertices.length / 3; j++) {
                const dist = Math.sqrt(
                    Math.pow(vertices[i*3] - vertices[j*3], 2) +
                    Math.pow(vertices[i*3+1] - vertices[j*3+1], 2) +
                    Math.pow(vertices[i*3+2] - vertices[j*3+2], 2)
                );
                if (dist < 2.2 && dist > 1.8) {
                    indices.push(i, j, (i + j) % (vertices.length / 3));
                }
            }
        }
        
        return this.createIndexedGeometry(
            new Float32Array(vertices),
            new Uint16Array(indices.slice(0, 60))
        );
    }
    
    createIcosahedron() {
        const t = (1 + Math.sqrt(5)) / 2;
        const vertices = new Float32Array([
            -1, t, 0,   1, t, 0,   -1, -t, 0,   1, -t, 0,
            0, -1, t,   0, 1, t,    0, -1, -t,   0, 1, -t,
            t, 0, -1,   t, 0, 1,   -t, 0, -1,   -t, 0, 1
        ]);
        
        const indices = new Uint16Array([
            0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
            1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
            3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
            4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1
        ]);
        
        return this.createIndexedGeometry(vertices, indices);
    }
    
    createIndexedGeometry(vertices, indices) {
        const gl = this.gl;
        
        const normals = this.calculateNormals(vertices, indices);
        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        
        return {
            vertexBuffer,
            normalBuffer,
            indexBuffer,
            indexCount: indices.length
        };
    }
    
    calculateNormals(vertices, indices) {
        const normals = new Float32Array(vertices.length);
        
        // Calculate face normals and accumulate
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i] * 3;
            const i1 = indices[i + 1] * 3;
            const i2 = indices[i + 2] * 3;
            
            const v0 = [vertices[i0], vertices[i0 + 1], vertices[i0 + 2]];
            const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
            
            const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
            
            const normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            ];
            
            // Add to vertex normals
            for (let j = 0; j < 3; j++) {
                normals[i0 + j] += normal[j];
                normals[i1 + j] += normal[j];
                normals[i2 + j] += normal[j];
            }
        }
        
        // Normalize
        for (let i = 0; i < normals.length; i += 3) {
            const len = Math.sqrt(normals[i]**2 + normals[i+1]**2 + normals[i+2]**2);
            if (len > 0) {
                normals[i] /= len;
                normals[i + 1] /= len;
                normals[i + 2] /= len;
            }
        }
        
        return normals;
    }
    
    setupCamera() {
        // Projection matrix
        const aspect = this.canvas.width / this.canvas.height;
        this.uniforms.projection = this.perspectiveMatrix(45, aspect, 0.1, 100);
        
        // View matrix
        this.uniforms.view = this.lookAtMatrix(
            [0, 0, 10],  // eye
            [0, 0, 0],   // center
            [0, 1, 0]    // up
        );
        
        // Model matrix
        this.uniforms.model = this.identityMatrix();
        
        // Light direction
        this.uniforms.lightDirection = [0.5, 0.7, 0.2];
    }
    
    render() {
        const gl = this.gl;
        
        // Clear
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Update time
        this.time = performance.now() / 1000;
        
        // Update breath phase (4 seconds in, 6 seconds out)
        const breathCycle = 10000;
        const breathTime = Date.now() % breathCycle;
        const phase = breathTime / breathCycle;
        if (phase < 0.4) {
            this.breathPhase = phase / 0.4;
        } else {
            this.breathPhase = 1 - (phase - 0.4) / 0.6;
        }
        
        // Render layers in order
        this.renderPatterns();      // Background sacred patterns
        this.renderCoherenceField(); // Coherence field visualization
        this.renderTorus();         // Torus field
        this.renderPlatonics();     // Platonic solids
        this.renderMerkaba();       // Central Merkaba
        this.renderGlyphRing();     // 87 sacred glyphs
        this.renderParticles();     // Particle system
        
        // Continue render loop
        this.frameCount++;
        requestAnimationFrame(() => this.render());
    }
    
    renderMerkaba() {
        const gl = this.gl;
        const program = this.programs.merkaba;
        
        if (!program) return;
        
        gl.useProgram(program.program);
        
        // Set uniforms
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        gl.uniformMatrix4fv(program.uniforms.uModel, false, this.uniforms.model);
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform3fv(program.uniforms.uLightDirection, this.uniforms.lightDirection);
        
        // Bind geometry
        const geom = this.geometries.merkaba;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.vertexBuffer);
        gl.enableVertexAttribArray(program.attributes.aPosition);
        gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.normalBuffer);
        gl.enableVertexAttribArray(program.attributes.aNormal);
        gl.vertexAttribPointer(program.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.indexBuffer);
        
        // Draw
        gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0);
        
        // Cleanup
        gl.disableVertexAttribArray(program.attributes.aPosition);
        gl.disableVertexAttribArray(program.attributes.aNormal);
    }
    
    renderTorus() {
        const gl = this.gl;
        const program = this.programs.torus;
        
        if (!program) return;
        
        gl.useProgram(program.program);
        
        // Set uniforms
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uBreathPhase, this.breathPhase);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform3f(program.uniforms.uFieldColor, 0.5, 0.3, 0.8);
        
        // Bind geometry
        const geom = this.geometries.torus;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.uvBuffer);
        gl.enableVertexAttribArray(program.attributes.aUV);
        gl.vertexAttribPointer(program.attributes.aUV, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.indexBuffer);
        
        // Draw
        gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0);
        
        // Cleanup
        gl.disableVertexAttribArray(program.attributes.aUV);
    }
    
    renderPlatonics() {
        const gl = this.gl;
        const program = this.programs.platonic;
        
        if (!program) return;
        
        gl.useProgram(program.program);
        
        // Set common uniforms
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        gl.uniformMatrix4fv(program.uniforms.uModel, false, this.uniforms.model);
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform3fv(program.uniforms.uLightDirection, this.uniforms.lightDirection);
        
        // Render each platonic solid with different emergence values
        const platonics = [
            { geom: this.geometries.tetrahedron, emergence: 0.9, phase: 0 },
            { geom: this.geometries.cube, emergence: 0.8, phase: 0.2 },
            { geom: this.geometries.octahedron, emergence: 0.85, phase: 0.4 },
            { geom: this.geometries.dodecahedron, emergence: 0.7, phase: 0.6 },
            { geom: this.geometries.icosahedron, emergence: 0.75, phase: 0.8 }
        ];
        
        platonics.forEach(({ geom, emergence, phase }) => {
            // Only render if coherence is high enough
            if (this.coherenceLevel < 0.5 + phase * 0.3) return;
            
            gl.uniform1f(program.uniforms.uEmergence, emergence * this.coherenceLevel);
            
            // Set phase as vertex attribute (simplified - using uniform instead)
            gl.vertexAttrib1f(program.attributes.aPhase, phase);
            
            // Bind geometry
            gl.bindBuffer(gl.ARRAY_BUFFER, geom.vertexBuffer);
            gl.enableVertexAttribArray(program.attributes.aPosition);
            gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, geom.normalBuffer);
            gl.enableVertexAttribArray(program.attributes.aNormal);
            gl.vertexAttribPointer(program.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.indexBuffer);
            
            // Draw
            gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0);
        });
        
        // Cleanup
        gl.disableVertexAttribArray(program.attributes.aPosition);
        gl.disableVertexAttribArray(program.attributes.aNormal);
    }
    
    renderParticles() {
        const gl = this.gl;
        const program = this.programs.particles;
        
        if (!program) return;
        
        gl.useProgram(program.program);
        
        // Enable point sprites
        gl.enable(gl.VERTEX_PROGRAM_POINT_SIZE);
        
        // Set uniforms
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform3f(program.uniforms.uAttractor, 0, 0, 0);
        
        // Update particle data
        const particles = this.geometries.particles;
        this.updateParticles(particles);
        
        // Bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, particles.positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles.positions);
        gl.enableVertexAttribArray(program.attributes.aPosition);
        gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, particles.velocityBuffer);
        gl.enableVertexAttribArray(program.attributes.aVelocity);
        gl.vertexAttribPointer(program.attributes.aVelocity, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, particles.lifeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles.lifes);
        gl.enableVertexAttribArray(program.attributes.aLife);
        gl.vertexAttribPointer(program.attributes.aLife, 1, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, particles.sizeBuffer);
        gl.enableVertexAttribArray(program.attributes.aSize);
        gl.vertexAttribPointer(program.attributes.aSize, 1, gl.FLOAT, false, 0, 0);
        
        // Draw
        gl.drawArrays(gl.POINTS, 0, particles.count);
        
        // Cleanup
        gl.disable(gl.VERTEX_PROGRAM_POINT_SIZE);
        gl.disableVertexAttribArray(program.attributes.aPosition);
        gl.disableVertexAttribArray(program.attributes.aVelocity);
        gl.disableVertexAttribArray(program.attributes.aLife);
        gl.disableVertexAttribArray(program.attributes.aSize);
    }
    
    renderPatterns() {
        const gl = this.gl;
        const program = this.programs.patterns;
        
        if (!program) return;
        
        gl.useProgram(program.program);
        
        // Set uniforms
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform2f(program.uniforms.uResolution, this.canvas.width, this.canvas.height);
        
        // Bind geometry
        const geom = this.geometries.quad;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.buffer);
        gl.enableVertexAttribArray(program.attributes.aPosition);
        gl.vertexAttribPointer(program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
        
        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, geom.count);
        
        // Cleanup
        gl.disableVertexAttribArray(program.attributes.aPosition);
    }
    
    updateParticles(particles) {
        // Update particle positions and life
        for (let i = 0; i < particles.count; i++) {
            const i3 = i * 3;
            
            // Update position
            particles.positions[i3] += particles.velocities[i3];
            particles.positions[i3 + 1] += particles.velocities[i3 + 1];
            particles.positions[i3 + 2] += particles.velocities[i3 + 2];
            
            // Attract to center with coherence
            const dist = Math.sqrt(
                particles.positions[i3]**2 + 
                particles.positions[i3+1]**2 + 
                particles.positions[i3+2]**2
            );
            
            if (dist > 0.1) {
                const force = this.coherenceLevel * 0.01 / dist;
                particles.positions[i3] -= particles.positions[i3] * force;
                particles.positions[i3+1] -= particles.positions[i3+1] * force;
                particles.positions[i3+2] -= particles.positions[i3+2] * force;
            }
            
            // Update life
            particles.lifes[i] -= 0.005;
            
            // Respawn dead particles
            if (particles.lifes[i] <= 0) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = Math.random() * 5 + 2;
                
                particles.positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                particles.positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                particles.positions[i3 + 2] = r * Math.cos(phi);
                
                particles.lifes[i] = 1;
            }
        }
    }
    
    // Matrix helpers
    perspectiveMatrix(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov * Math.PI / 360);
        const nf = 1 / (near - far);
        
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);
    }
    
    lookAtMatrix(eye, center, up) {
        const zAxis = this.normalize([
            eye[0] - center[0],
            eye[1] - center[1],
            eye[2] - center[2]
        ]);
        const xAxis = this.normalize(this.cross(up, zAxis));
        const yAxis = this.cross(zAxis, xAxis);
        
        return new Float32Array([
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            eye[0], eye[1], eye[2], 1
        ]);
    }
    
    identityMatrix() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    
    normalize(v) {
        const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
        return len > 0 ? [v[0]/len, v[1]/len, v[2]/len] : [0, 0, 0];
    }
    
    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }
    
    renderCoherenceField() {
        const gl = this.gl;
        const program = this.programs.coherenceField;
        
        if (!program || !program.program) return;
        
        gl.useProgram(program.program);
        const geom = this.geometries.coherenceField;
        
        // Set uniforms
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        
        // Set participant positions
        const participantPositions = [];
        for (let i = 0; i < this.participants.length && i < 13; i++) {
            const angle = i * Math.PI * 2 / this.participants.length;
            participantPositions.push(
                Math.cos(angle) * 3,
                Math.sin(angle) * 3,
                0
            );
        }
        gl.uniform3fv(program.uniforms.uParticipants, new Float32Array(participantPositions));
        gl.uniform1i(program.uniforms.uParticipantCount, this.participants.length);
        
        // Bind geometry
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.vertexBuffer);
        gl.enableVertexAttribArray(program.attributes.aPosition);
        gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.indexBuffer);
        
        // Enable additive blending for field effects
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.disableVertexAttribArray(program.attributes.aPosition);
    }
    
    renderGlyphRing() {
        const gl = this.gl;
        const program = this.programs.glyphRing;
        
        if (!program || !program.program) return;
        
        gl.useProgram(program.program);
        const geom = this.geometries.glyphRing;
        
        // Set uniforms
        gl.uniform1f(program.uniforms.uTime, this.time);
        gl.uniform1f(program.uniforms.uCoherence, this.coherenceLevel);
        gl.uniform1f(program.uniforms.uSelectedGlyph, this.selectedGlyph || -1);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, this.uniforms.projection);
        gl.uniformMatrix4fv(program.uniforms.uView, false, this.uniforms.view);
        
        // Bind vertex positions
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.vertexBuffer);
        gl.enableVertexAttribArray(program.attributes.aPosition);
        gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
        
        // Bind texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.texCoordBuffer);
        gl.enableVertexAttribArray(program.attributes.aTexCoord);
        gl.vertexAttribPointer(program.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);
        
        // Bind glyph indices
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.glyphIndexBuffer);
        gl.enableVertexAttribArray(program.attributes.aGlyphIndex);
        gl.vertexAttribPointer(program.attributes.aGlyphIndex, 1, gl.FLOAT, false, 0, 0);
        
        // Draw all glyphs
        gl.drawArrays(gl.TRIANGLES, 0, geom.count);
        
        // Cleanup
        gl.disableVertexAttribArray(program.attributes.aPosition);
        gl.disableVertexAttribArray(program.attributes.aTexCoord);
        gl.disableVertexAttribArray(program.attributes.aGlyphIndex);
    }
    
    // Public methods
    setCoherence(level) {
        this.coherenceLevel = Math.max(0, Math.min(1, level));
    }
    
    addParticipant(id, coherence = 0.7, frequency = 7.83) {
        if (this.participants.length >= 13) {
            console.warn('Maximum 13 participants reached (sacred geometry limit)');
            return false;
        }
        
        const angle = this.participants.length * this.TAU / 13;
        this.participants.push({
            id,
            coherence,
            frequency,
            phase: angle,
            color: [
                0.5 + Math.cos(angle) * 0.5,
                0.5 + Math.sin(angle) * 0.5,
                0.8
            ]
        });
        
        // Update emergence level
        if (this.coherenceLevel > 0.9 && this.participants.length > 3) {
            this.emergenceLevel = (this.coherenceLevel - 0.9) * 10.0;
        }
        
        return true;
    }
    
    removeParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        
        // Update emergence level
        if (this.participants.length <= 3) {
            this.emergenceLevel *= 0.95; // Decay
        }
    }
    
    updateParticipant(id, updates) {
        const participant = this.participants.find(p => p.id === id);
        if (participant) {
            Object.assign(participant, updates);
        }
    }
    
    selectGlyph(index) {
        if (index >= 0 && index < 87) {
            this.selectedGlyph = index;
            console.log(`Selected glyph ${index}: ${this.getGlyphName(index)}`);
        }
    }
    
    getGlyphName(index) {
        if (index < 45) return `Foundational Ω${index}`;
        else if (index < 56) return `Applied Harmony Ω${index}`;
        else if (index < 65) return `Threshold Glyph ${index - 55}`;
        else return `Meta-Glyph ∑${index - 64}`;
    }
    
    updateFieldState(coherence, participants = []) {
        this.coherenceLevel = coherence;
        this.participants = participants;
        
        // Update emergence based on coherence and participant count
        if (coherence > 0.9 && participants.length > 3) {
            this.emergenceLevel = (coherence - 0.9) * 10.0;
        } else {
            this.emergenceLevel *= 0.95; // Decay
        }
    }
    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        
        // Update projection matrix
        const aspect = width / height;
        this.uniforms.projection = this.perspectiveMatrix(45, aspect, 0.1, 100);
    }
}

// Export for use in main demo
window.SacredGeometryWebGL = SacredGeometryWebGL;