# 🌟 MiniMax Sacred Video Generation

## Quick Start

### 1. Get MiniMax API Key
Visit: https://www.minimax.io/platform/document/video_generation?key=66d1439376e52fcee2853049

### 2. Set Environment Variable
```bash
export MINIMAX_API_KEY="your_api_key_here"
```

### 3. Generate Videos

#### Single Star
```bash
# Generate videos for First Presence (*1)
node minimax-video-generator.js "*1"

# Generate videos for Sacred Listening (*3)
node minimax-video-generator.js "*3"
```

#### All Eleven Stars
```bash
# Generate complete constellation
MINIMAX_API_KEY=your_key ./generate-all-stars.sh
```

## 📋 The Eleven Applied Harmonies

### Foundation Stars (*1-*4)
- **●** *1: First Presence - Arriving fully in the moment
- **◐** *2: Conscious Arrival - Intentional presence 
- **◑** *3: Sacred Listening - Deep receptive attention
- **◒** *4: Boundary With Love - Clear loving limits

### Daily Practice Stars (*5-*8)
- **◓** *5: Gentle Opening - Creating safe invitation
- **◔** *6: Building Trust - Establishing safety
- **◕** *7: Loving No - Sacred boundary setting
- **◖** *8: Pause Practice - Space between moments

### Mastery Stars (*9-*11)
- **◗** *9: Tending the Field - Sustaining connection
- **◘** *10: Presence Transmission - Conscious influence
- **◙** *11: Loving Redirection - Transforming patterns

## 🎬 Video Specifications

Each star generates 3 videos (one per prompt):
- **Resolution**: 1280x720 HD
- **Duration**: 6 seconds
- **Style**: Cinematic, ethereal
- **Format**: MP4

Total: 33 sacred practice videos (11 stars × 3 prompts)

## 📁 Output Structure
```
sacred-videos/
├── generated/
│   ├── *1-0-[timestamp].mp4
│   ├── *1-1-[timestamp].mp4
│   ├── *1-2-[timestamp].mp4
│   └── ... (all 33 videos)
└── logs/
    ├── generation-*1.log
    └── ... (generation logs)
```

## 🌀 Sacred Visual Language

Our videos follow the Visual Language Codex:
- Golden hour lighting
- Natural elements (water, earth, light)
- Slow, contemplative pacing
- No text or artificial elements
- Each shot as meditation

## 🔧 Troubleshooting

### API Key Issues
```bash
# Check if key is set
echo $MINIMAX_API_KEY

# Set permanently (add to ~/.bashrc)
echo 'export MINIMAX_API_KEY="your_key"' >> ~/.bashrc
source ~/.bashrc
```

### Rate Limiting
The scripts include 5-second delays between API calls to prevent rate limiting.

### Missing Dependencies
```bash
# Install axios if needed
npm install axios
```

## 🌟 Next Steps

Once videos are generated:
1. Review in `generated/` folder
2. Select best takes for each star
3. Upload to sacred video platform
4. Integrate with Applied Harmonies Dojo
5. Create playlist for practitioners

---

*"Each video is a direct transmission of the practice energy - a visual meditation that embodies the sacred pattern."*