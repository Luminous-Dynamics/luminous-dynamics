/**
 * Sacred Geometry 3D Engine for LuminousOS
 * Full 3D sacred geometry with Three.js
 */

class SacredGeometry3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            alpha: true 
        });
        
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 0);
        
        // Camera position
        this.camera.position.z = 30;
        
        // Lighting
        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(this.ambientLight);
        
        this.pointLight = new THREE.PointLight(0x6B46C1, 1);
        this.pointLight.position.set(0, 0, 20);
        this.scene.add(this.pointLight);
        
        // Sacred geometry objects
        this.geometries = {
            merkaba: null,
            flowerOfLife: null,
            metatronsCube: null,
            toroid: null,
            particles: []
        };
        
        // State
        this.coherence = 0.7;
        this.time = 0;
        this.isOffline = true;
        this.currentTheme = this.getTimeBasedTheme();
        
        // Initialize geometries
        this.createMerkaba();
        this.createFlowerOfLife3D();
        this.createMetatronsCube3D();
        this.createToroid();
        this.createParticleField();
        
        // Post-processing
        this.composer = null;
        this.setupPostProcessing();
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return {
                name: 'Dawn Awakening',
                primary: 0xFFB366,
                secondary: 0xFFDCB4,
                glow: 0xFFE6CC
            };
        } else if (hour >= 12 && hour < 17) {
            return {
                name: 'Solar Peak',
                primary: 0x66B3FF,
                secondary: 0xB4DCFF,
                glow: 0xCCE6FF
            };
        } else if (hour >= 17 && hour < 22) {
            return {
                name: 'Twilight Integration',
                primary: 0xB366FF,
                secondary: 0xDCB4FF,
                glow: 0xE6CCFF
            };
        } else {
            return {
                name: 'Dream Weaving',
                primary: 0x6678C8,
                secondary: 0x788CDC,
                glow: 0x8A9EEE
            };
        }
    }
    
    createMerkaba() {
        const geometry = new THREE.Geometry();
        
        // Create two interlocking tetrahedrons
        const size = 10;
        const h = size * Math.sqrt(2/3);
        
        // Upper tetrahedron vertices
        geometry.vertices.push(
            new THREE.Vector3(0, h, 0),
            new THREE.Vector3(-size/2, -h/3, -size*Math.sqrt(3)/6),
            new THREE.Vector3(size/2, -h/3, -size*Math.sqrt(3)/6),
            new THREE.Vector3(0, -h/3, size*Math.sqrt(3)/3)
        );
        
        // Upper tetrahedron faces
        geometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(0, 2, 3),
            new THREE.Face3(0, 3, 1),
            new THREE.Face3(1, 3, 2)
        );
        
        // Lower tetrahedron (inverted)
        const lowerGeometry = geometry.clone();
        lowerGeometry.rotateY(Math.PI);
        
        // Merge geometries
        const mergedGeometry = new THREE.Geometry();
        mergedGeometry.merge(geometry);
        mergedGeometry.merge(lowerGeometry);
        
        // Convert to BufferGeometry for better performance
        const bufferGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
        
        // Create material with wireframe
        const material = new THREE.MeshPhongMaterial({
            color: this.currentTheme.primary,
            emissive: this.currentTheme.glow,
            emissiveIntensity: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.geometries.merkaba = new THREE.Mesh(bufferGeometry, material);
        this.scene.add(this.geometries.merkaba);
    }
    
    createFlowerOfLife3D() {
        const group = new THREE.Group();
        const radius = 3;
        const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
            color: this.currentTheme.secondary,
            emissive: this.currentTheme.glow,
            emissiveIntensity: 0.1,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        // Center sphere
        const centerSphere = new THREE.Mesh(sphereGeometry, material);
        group.add(centerSphere);
        
        // Surrounding spheres
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius * 2;
            const y = Math.sin(angle) * radius * 2;
            
            const sphere = new THREE.Mesh(sphereGeometry, material.clone());
            sphere.position.set(x, y, 0);
            group.add(sphere);
            
            // Second ring
            for (let j = 0; j < 6; j++) {
                const angle2 = (j / 6) * Math.PI * 2;
                const x2 = x + Math.cos(angle2) * radius * 2;
                const y2 = y + Math.sin(angle2) * radius * 2;
                
                const sphere2 = new THREE.Mesh(sphereGeometry, material.clone());
                sphere2.position.set(x2, y2, 0);
                sphere2.scale.set(0.5, 0.5, 0.5);
                group.add(sphere2);
            }
        }
        
        this.geometries.flowerOfLife = group;
        this.geometries.flowerOfLife.position.z = -5;
        this.scene.add(this.geometries.flowerOfLife);
    }
    
    createMetatronsCube3D() {
        const group = new THREE.Group();
        const nodes = [];
        const radius = 8;
        
        // Create nodes at vertices of a cube + center
        const positions = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
            [0, 0, 0] // center
        ];
        
        // Node geometry
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: this.currentTheme.glow,
            emissive: this.currentTheme.primary,
            emissiveIntensity: 0.5
        });
        
        // Create nodes
        positions.forEach(pos => {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(pos[0] * radius, pos[1] * radius, pos[2] * radius);
            nodes.push(node);
            group.add(node);
        });
        
        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: this.currentTheme.primary,
            transparent: true,
            opacity: 0.3
        });
        
        // Connect all nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const geometry = new THREE.Geometry();
                geometry.vertices.push(nodes[i].position, nodes[j].position);
                const line = new THREE.Line(geometry, lineMaterial);
                group.add(line);
            }
        }
        
        this.geometries.metatronsCube = group;
        this.geometries.metatronsCube.position.z = 5;
        this.scene.add(this.geometries.metatronsCube);
    }
    
    createToroid() {
        const geometry = new THREE.TorusGeometry(8, 3, 16, 100);
        const material = new THREE.MeshPhongMaterial({
            color: this.currentTheme.primary,
            emissive: this.currentTheme.secondary,
            emissiveIntensity: 0.1,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        
        this.geometries.toroid = new THREE.Mesh(geometry, material);
        this.geometries.toroid.position.x = 15;
        this.scene.add(this.geometries.toroid);
    }
    
    createParticleField() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Create particle positions
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
            
            // Color based on theme
            const color = new THREE.Color(this.currentTheme.glow);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.geometries.particles = particles;
        this.scene.add(particles);
    }
    
    setupPostProcessing() {
        // Create render passes
        this.composer = new THREE.EffectComposer(this.renderer);
        
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom effect
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            1.5, // strength
            0.4, // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
    }
    
    update(coherence) {
        this.coherence = coherence;
        this.time += 0.01;
        
        // Update theme based on time
        this.currentTheme = this.getTimeBasedTheme();
        
        // Rotate Merkaba
        if (this.geometries.merkaba) {
            this.geometries.merkaba.rotation.x += 0.005 * this.coherence;
            this.geometries.merkaba.rotation.y += 0.007 * this.coherence;
            this.geometries.merkaba.material.opacity = 0.3 + 0.3 * this.coherence;
        }
        
        // Rotate Flower of Life
        if (this.geometries.flowerOfLife) {
            this.geometries.flowerOfLife.rotation.z += 0.003 * this.coherence;
            this.geometries.flowerOfLife.scale.setScalar(1 + Math.sin(this.time) * 0.1 * this.coherence);
        }
        
        // Rotate Metatron's Cube
        if (this.geometries.metatronsCube) {
            this.geometries.metatronsCube.rotation.x += 0.002;
            this.geometries.metatronsCube.rotation.y += 0.003;
            this.geometries.metatronsCube.rotation.z += 0.001;
        }
        
        // Animate toroid
        if (this.geometries.toroid) {
            this.geometries.toroid.rotation.x += 0.01;
            this.geometries.toroid.rotation.y += 0.005;
            this.geometries.toroid.position.x = 15 * Math.cos(this.time * 0.5);
            this.geometries.toroid.position.z = 15 * Math.sin(this.time * 0.5);
        }
        
        // Animate particles
        if (this.geometries.particles) {
            this.geometries.particles.rotation.y += 0.001;
            const positions = this.geometries.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time + i) * 0.01 * this.coherence;
            }
            this.geometries.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update point light
        this.pointLight.intensity = 0.5 + 0.5 * this.coherence;
        this.pointLight.position.x = Math.sin(this.time) * 10;
        this.pointLight.position.y = Math.cos(this.time) * 10;
    }
    
    render() {
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        if (this.composer) {
            this.composer.setSize(width, height);
        }
    }
    
    setCoherence(coherence) {
        this.coherence = coherence;
    }
}

// Initialize 3D engine when Three.js is loaded
window.SacredGeometry3D = SacredGeometry3D;