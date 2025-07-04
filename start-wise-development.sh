#!/bin/bash
# 🧠 Start Wise Development Environment
# Local discovery + Cloud validation

echo "🧠 Wise Development Environment Starter"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check for Node.js
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
    else
        echo -e "${YELLOW}⚠ Node.js not found${NC}"
    fi
    
    # Check for gcloud
    if command -v gcloud &> /dev/null; then
        echo -e "${GREEN}✓ Google Cloud SDK${NC}"
    else
        echo -e "${YELLOW}⚠ Google Cloud SDK not found${NC}"
    fi
    
    # Check for git
    if command -v git &> /dev/null; then
        echo -e "${GREEN}✓ Git $(git --version | cut -d' ' -f3)${NC}"
    else
        echo -e "${YELLOW}⚠ Git not found${NC}"
    fi
    
    # Check WSL
    if grep -qi microsoft /proc/version; then
        echo -e "${GREEN}✓ Running in WSL${NC}"
    else
        echo -e "${BLUE}ℹ Not in WSL (still works!)${NC}"
    fi
    
    echo ""
}

# Function to setup local discovery environment
setup_local_discovery() {
    echo "🔬 Setting up Local Discovery Lab..."
    
    # Create directory structure
    mkdir -p experiments/{active,completed,learnings}
    mkdir -p cloud-ready
    mkdir -p .sacred/wisdom
    
    # Create experiment tracker
    cat > experiments/experiment-tracker.js << 'EOF'
// 🧪 Experiment Tracker
class ExperimentTracker {
  constructor() {
    this.experiments = new Map();
    this.startTime = Date.now();
  }
  
  start(name, hypothesis) {
    this.experiments.set(name, {
      name,
      hypothesis,
      startTime: Date.now(),
      discoveries: [],
      cloudReady: false
    });
    console.log(`🧪 Starting experiment: ${name}`);
  }
  
  discover(name, insight) {
    const exp = this.experiments.get(name);
    if (exp) {
      exp.discoveries.push({
        insight,
        timestamp: Date.now()
      });
      console.log(`💡 Discovery: ${insight}`);
    }
  }
  
  complete(name, conclusion) {
    const exp = this.experiments.get(name);
    if (exp) {
      exp.conclusion = conclusion;
      exp.endTime = Date.now();
      exp.duration = exp.endTime - exp.startTime;
      
      // Save to learnings
      const fs = require('fs');
      const filename = `./learnings/${name}-${Date.now()}.json`;
      fs.writeFileSync(filename, JSON.stringify(exp, null, 2));
      
      console.log(`✅ Experiment complete: ${name}`);
      console.log(`📝 Saved to: ${filename}`);
    }
  }
}

module.exports = ExperimentTracker;
EOF
    
    echo -e "${GREEN}✓ Local discovery environment ready${NC}"
}

# Function to setup cloud dev environment
setup_cloud_dev() {
    echo ""
    echo "☁️  Setting up Cloud Dev Environment..."
    
    # Create cloud dev config
    cat > cloud-dev-config.js << 'EOF'
// ☁️ Cloud Development Configuration
const config = {
  development: {
    projectId: 'mycelix-network',
    region: 'us-central1',
    costLimit: 10, // $10/day max
    autoScale: false,
    minInstances: 0,
    maxInstances: 2
  },
  
  staging: {
    projectId: 'mycelix-network',
    region: 'us-central1',
    costLimit: 30, // $30/day max
    autoScale: true,
    minInstances: 1,
    maxInstances: 5
  },
  
  // Deployment helper
  async deployExperiment(name, env = 'development') {
    const settings = this[env];
    console.log(`🚀 Deploying ${name} to ${env}...`);
    
    // Add cost protection
    const deployment = {
      name: `exp-${name}-${Date.now()}`,
      ...settings,
      labels: {
        environment: env,
        experiment: name,
        'cost-limit': settings.costLimit
      }
    };
    
    return deployment;
  }
};

module.exports = config;
EOF
    
    echo -e "${GREEN}✓ Cloud dev configuration created${NC}"
}

# Function to create wisdom bridge
create_wisdom_bridge() {
    echo ""
    echo "🌉 Creating Wisdom Bridge..."
    
    cat > wisdom-bridge.js << 'EOF'
// 🌉 Wisdom Bridge - Connect Local Discoveries to Cloud Validation
const fs = require('fs');
const path = require('path');

class WisdomBridge {
  constructor() {
    this.wisdomPath = '.sacred/wisdom';
    this.learnings = new Map();
  }
  
  // Gather local discoveries
  async gatherLocalWisdom() {
    const learningsDir = './experiments/learnings';
    const files = fs.readdirSync(learningsDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = JSON.parse(
          fs.readFileSync(path.join(learningsDir, file), 'utf8')
        );
        this.learnings.set(data.name, data);
      }
    }
    
    return this.learnings;
  }
  
  // Promote to cloud when ready
  async promoteToCloud(experimentName) {
    const learning = this.learnings.get(experimentName);
    if (!learning) {
      console.log('❌ Experiment not found');
      return;
    }
    
    if (learning.discoveries.length < 3) {
      console.log('⚠️  Need more discoveries before cloud promotion');
      return;
    }
    
    // Prepare for cloud
    const cloudReady = {
      ...learning,
      cloudPromotedAt: Date.now(),
      localTestsPassed: true,
      estimatedCloudCost: this.estimateCost(learning)
    };
    
    // Save to cloud-ready directory
    const filename = `./cloud-ready/${experimentName}.json`;
    fs.writeFileSync(filename, JSON.stringify(cloudReady, null, 2));
    
    console.log(`✅ Promoted to cloud: ${filename}`);
    console.log(`💰 Estimated cost: $${cloudReady.estimatedCloudCost}/day`);
  }
  
  estimateCost(learning) {
    // Simple cost estimation
    const complexity = learning.discoveries.length;
    const baseConstant = 0.5;
    return (complexity * baseConstant).toFixed(2);
  }
  
  // Synthesize wisdom from all sources
  async synthesizeWisdom() {
    const wisdom = {
      totalExperiments: this.learnings.size,
      successfulPromotions: 0,
      keyInsights: [],
      timestamp: new Date().toISOString()
    };
    
    // Analyze patterns
    this.learnings.forEach(learning => {
      if (learning.cloudReady) {
        wisdom.successfulPromotions++;
      }
      wisdom.keyInsights.push(...learning.discoveries.map(d => d.insight));
    });
    
    // Save wisdom
    const wisdomFile = path.join(this.wisdomPath, `wisdom-${Date.now()}.json`);
    fs.mkdirSync(this.wisdomPath, { recursive: true });
    fs.writeFileSync(wisdomFile, JSON.stringify(wisdom, null, 2));
    
    console.log('🧠 Wisdom synthesized and saved');
    return wisdom;
  }
}

module.exports = WisdomBridge;
EOF
    
    echo -e "${GREEN}✓ Wisdom bridge created${NC}"
}

# Function to create quick commands
create_quick_commands() {
    echo ""
    echo "⚡ Creating quick commands..."
    
    # Local experiment starter
    cat > start-experiment.js << 'EOF'
#!/usr/bin/env node
// 🧪 Quick Experiment Starter

const ExperimentTracker = require('./experiments/experiment-tracker');
const tracker = new ExperimentTracker();

const name = process.argv[2];
const hypothesis = process.argv.slice(3).join(' ');

if (!name) {
  console.log('Usage: node start-experiment.js <name> <hypothesis>');
  process.exit(1);
}

tracker.start(name, hypothesis || 'Exploring new possibilities');
console.log('');
console.log('📝 Next steps:');
console.log(`  1. Code your experiment`);
console.log(`  2. Track discoveries: tracker.discover("${name}", "insight")`);
console.log(`  3. Complete: tracker.complete("${name}", "conclusion")`);
console.log('');
console.log('Happy discovering! 🚀');
EOF
    
    chmod +x start-experiment.js
    
    # Cloud promotion helper
    cat > promote-to-cloud.js << 'EOF'
#!/usr/bin/env node
// ☁️ Promote Experiment to Cloud

const WisdomBridge = require('./wisdom-bridge');
const bridge = new WisdomBridge();

const experimentName = process.argv[2];

if (!experimentName) {
  console.log('Usage: node promote-to-cloud.js <experiment-name>');
  process.exit(1);
}

async function promote() {
  await bridge.gatherLocalWisdom();
  await bridge.promoteToCloud(experimentName);
}

promote().catch(console.error);
EOF
    
    chmod +x promote-to-cloud.js
    
    echo -e "${GREEN}✓ Quick commands created${NC}"
}

# Main execution
echo -e "${BLUE}Setting up your Wise Development Environment...${NC}"
echo ""

check_prerequisites
setup_local_discovery
setup_cloud_dev
create_wisdom_bridge
create_quick_commands

echo ""
echo "✨ Wise Development Environment Ready!"
echo "====================================="
echo ""
echo "🔬 Local Discovery Commands:"
echo "  Start experiment:  node start-experiment.js <name> <hypothesis>"
echo "  Track discovery:   In your code, use tracker.discover(name, insight)"
echo "  View experiments:  ls experiments/learnings/"
echo ""
echo "☁️  Cloud Development Commands:"
echo "  Promote to cloud:  node promote-to-cloud.js <experiment-name>"
echo "  Deploy to dev:     gcloud run deploy --tag=experiment"
echo "  Check costs:       gcloud billing projects describe"
echo ""
echo "🌉 Wisdom Commands:"
echo "  Gather wisdom:     node -e \"new (require('./wisdom-bridge')).synthesizeWisdom()\""
echo "  View wisdom:       cat .sacred/wisdom/wisdom-*.json"
echo ""
echo "📚 Next Steps:"
echo "  1. Start an experiment with Claude Code"
echo "  2. Track your discoveries"
echo "  3. Promote promising ones to cloud"
echo "  4. Share wisdom with the team"
echo ""
echo "🧘‍♂️ May your code be wise and your costs be low!"