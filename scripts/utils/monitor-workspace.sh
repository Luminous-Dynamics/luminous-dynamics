#!/bin/bash
# Monitor Google Workspace integration health

echo "📊 Google Workspace Monitoring Dashboard"
echo "======================================"

# Check service health
node -e "
import workspace from './google-workspace-production.mjs';

async function monitor() {
  await workspace.initialize();
  const health = await workspace.healthCheck();
  console.log('Health Status:', JSON.stringify(health, null, 2));
  
  // Check recent logs
  console.log('\nRecent Errors:');
  // tail -10 logs/.workspace/error.log
}

monitor().catch(console.error);
"

# Display metrics
echo -e "\n📈 Usage Metrics:"
if [ -f "logs/.workspace/combined.log" ]; then
    echo "API Calls Today: $(grep -c "INFO" logs/.workspace/combined.log)"
    echo "Errors Today: $(grep -c "ERROR" logs/.workspace/combined.log)"
fi
