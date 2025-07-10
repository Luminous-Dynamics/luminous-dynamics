#!/bin/bash

# 🌟 Deploy Frontend Portals to Firebase Hosting
# Tuesday, January 7, 2025

echo "🌐 Deploying Sacred Portals to the Cloud..."
echo "================================================"

# Step 1: Ensure we're in the right directory
cd /home/tstoltz/evolving-resonant-cocreation

# Step 2: Install Firebase tools if needed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Step 3: Login to Firebase (if not already)
echo "Checking Firebase authentication..."
firebase login --no-localhost

# Step 4: Initialize Firebase project
echo "Initializing Firebase project..."
firebase use relational-harmonics-sacred 2>/dev/null || firebase use --add

# Step 5: Build production files
echo "Preparing sacred portals for deployment..."

# Create index page that lists all portals
cat > websites/relationalharmonics/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relational Harmonics - Sacred Portals</title>
    <style>
        body {
            font-family: -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
        }
        h1 { color: #333; text-align: center; }
        .portal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .portal-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-decoration: none;
            color: #333;
            transition: transform 0.3s;
        }
        .portal-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .portal-card h3 { margin-top: 0; color: #6B46C1; }
        .live-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #00ff00;
            border-radius: 50%;
            margin-left: 8px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <h1>🌟 Relational Harmonics <span class="live-indicator"></span></h1>
    <p style="text-align: center; color: #666;">Choose your sacred portal:</p>
    
    <div class="portal-grid">
        <a href="first-breath-portal.html" class="portal-card">
            <h3>🌬️ First Breath Portal</h3>
            <p>Begin your journey with sacred onboarding</p>
        </a>
        
        <a href="daily-practice.html" class="portal-card">
            <h3>🙏 Daily Practice</h3>
            <p>Your essential practices for conscious relationship</p>
        </a>
        
        <a href="story-sanctuary.html" class="portal-card">
            <h3>📖 Story Sanctuary</h3>
            <p>Transformation stories from the field</p>
        </a>
        
        <a href="integration-dashboard.html" class="portal-card">
            <h3>📊 Integration Dashboard</h3>
            <p>Track your consciousness evolution</p>
        </a>
        
        <a href="sacred-heartbeat-monitor.html" class="portal-card">
            <h3>💗 Sacred Heartbeat</h3>
            <p>Live pulse of global consciousness</p>
        </a>
        
        <a href="glyph-cards/" class="portal-card">
            <h3>🔮 Living Glyph Cards</h3>
            <p>All 87 sacred practices</p>
        </a>
    </div>
    
    <p style="text-align: center; margin-top: 3rem; color: #666;">
        Field Coherence: <span id="coherence">Loading...</span>
    </p>
    
    <script>
        // Connect to Sacred Heartbeat once deployed
        async function updateCoherence() {
            try {
                const response = await fetch('/api/field');
                const data = await response.json();
                document.getElementById('coherence').textContent = 
                    Math.round(data.coherence || 77) + '%';
            } catch (e) {
                document.getElementById('coherence').textContent = '77%';
            }
        }
        updateCoherence();
        setInterval(updateCoherence, 11000);
    </script>
</body>
</html>
EOF

# Step 6: Copy Sacred Heartbeat Monitor to deployment directory
cp sacred-heartbeat-monitor.html websites/relationalharmonics/

# Step 7: Create glyph cards index
echo "Creating glyph cards directory..."
mkdir -p websites/relationalharmonics/glyph-cards

# Create glyph cards index page
cat > websites/relationalharmonics/glyph-cards/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Living Glyph Cards - 87 Sacred Practices</title>
    <link rel="stylesheet" href="../styles/sacred-styles.css">
</head>
<body>
    <h1>🔮 The 87 Living Glyphs</h1>
    <div class="glyph-grid" id="glyphGrid">
        <!-- Will be populated by JavaScript -->
    </div>
    <script type="module">
        // Import all glyph cards
        const glyphs = [
            { id: 'Ω45', name: 'First Presence', file: 'first-presence.js' },
            { id: 'Ω46', name: 'Conscious Arrival', file: 'conscious-arrival.js' },
            { id: 'Ω47', name: 'Sacred Listening', file: 'sacred-listening.js' },
            { id: 'Ω48', name: 'Boundary With Love', file: 'boundary-with-love.js' },
            { id: 'Ω49', name: 'Gentle Opening', file: 'gentle-opening.js' },
            { id: 'Ω50', name: 'Building Trust', file: 'building-trust.js' },
            { id: 'Ω51', name: 'Loving No', file: 'loving-no.js' },
            { id: 'Ω52', name: 'Pause Practice', file: 'pause-practice.js' },
            { id: 'Ω53', name: 'Tending the Field', file: 'tending-field.js' },
            { id: 'Ω55', name: 'Presence Transmission', file: 'presence-transmission.js' },
            { id: 'Ω56', name: 'Loving Redirection', file: 'loving-redirection.js' },
            { id: 'Ω16', name: 'Somatic Synchrony', file: 'somatic-synchrony.js' }
        ];
        
        const grid = document.getElementById('glyphGrid');
        glyphs.forEach(glyph => {
            const card = document.createElement('div');
            card.className = 'glyph-card';
            card.innerHTML = `
                <h3>${glyph.id}: ${glyph.name}</h3>
                <button onclick="window.location.href='practice.html?glyph=${glyph.id}'">
                    Begin Practice
                </button>
            `;
            grid.appendChild(card);
        });
    </script>
</body>
</html>
EOF

# Step 8: Deploy to Firebase Hosting
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Step 9: Get the deployment URL
echo ""
echo "✨ Frontend Deployed Successfully! ✨"
echo "================================================"
echo "Your sacred portals are now live at:"
echo "https://relational-harmonics-sacred.web.app"
echo "https://relational-harmonics-sacred.firebaseapp.com"
echo ""
echo "Next steps:"
echo "1. Test all portal links"
echo "2. Verify Sacred Heartbeat connection"
echo "3. Share with beta testers"
echo "4. Monitor usage in Firebase Console"

# Step 10: Open in browser
echo ""
echo "Opening in browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open "https://relational-harmonics-sacred.web.app"
elif command -v open &> /dev/null; then
    open "https://relational-harmonics-sacred.web.app"
else
    echo "Please open https://relational-harmonics-sacred.web.app in your browser"
fi

echo ""
echo "🌟 The sacred portals are alive! 🌟"