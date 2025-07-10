#!/bin/bash

# 🤑 Set up GCP Billing Export to BigQuery
# This enables detailed cost analysis and optimization

PROJECT_ID="the-weave-sacred"
DATASET_NAME="billing_export"
DATASET_LOCATION="US"
BILLING_ACCOUNT_ID="YOUR_BILLING_ACCOUNT_ID" # Replace with actual ID

echo "💰 Setting up Billing Export to BigQuery for The Weave"
echo "=" 
echo ""

# Step 1: Create BigQuery dataset for billing data
echo "📊 Step 1: Creating BigQuery dataset..."
bq mk \
  --project_id=$PROJECT_ID \
  --location=$DATASET_LOCATION \
  --dataset \
  --description="Sacred billing data for cost optimization" \
  $DATASET_NAME

echo "✅ Dataset created: $PROJECT_ID:$DATASET_NAME"
echo ""

# Step 2: Get billing account ID if not set
if [ "$BILLING_ACCOUNT_ID" = "YOUR_BILLING_ACCOUNT_ID" ]; then
    echo "🔍 Step 2: Finding billing account..."
    echo "Available billing accounts:"
    gcloud beta billing accounts list
    echo ""
    read -p "Enter your billing account ID: " BILLING_ACCOUNT_ID
fi

# Step 3: Enable billing export (must be done in Console or via API)
echo "⚙️  Step 3: Enable billing export"
echo ""
echo "Manual steps required in GCP Console:"
echo "1. Go to: https://console.cloud.google.com/billing/$BILLING_ACCOUNT_ID/export"
echo "2. Click 'EDIT SETTINGS' for 'Detailed usage cost'"
echo "3. Select project: $PROJECT_ID"
echo "4. Select dataset: $DATASET_NAME"
echo "5. Click 'SAVE'"
echo ""
echo "Press Enter when completed..."
read

# Step 4: Create cost analysis views
echo "📈 Step 4: Creating cost analysis views..."

# Create daily cost summary view
cat > daily_cost_view.sql << 'EOF'
CREATE OR REPLACE VIEW `the-weave-sacred.billing_export.daily_costs` AS
SELECT
  DATE(usage_start_time) as usage_date,
  service.description as service_name,
  sku.description as sku_description,
  location.location as location,
  SUM(cost) as total_cost,
  SUM(cost * (1 - IFNULL(credits.amount, 0) / cost)) as cost_after_credits,
  currency
FROM `the-weave-sacred.billing_export.gcp_billing_export_v1_*`
WHERE DATE(_PARTITIONTIME) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 1, 2, 3, 4, 7
ORDER BY usage_date DESC, total_cost DESC;
EOF

bq query --project_id=$PROJECT_ID --use_legacy_sql=false < daily_cost_view.sql

# Create service cost breakdown view
cat > service_cost_view.sql << 'EOF'
CREATE OR REPLACE VIEW `the-weave-sacred.billing_export.service_costs` AS
SELECT
  service.description as service_name,
  DATE_TRUNC(DATE(usage_start_time), MONTH) as month,
  SUM(cost) as total_cost,
  SUM(usage.amount) as total_usage,
  usage.unit as usage_unit,
  COUNT(DISTINCT sku.id) as unique_skus
FROM `the-weave-sacred.billing_export.gcp_billing_export_v1_*`
WHERE DATE(_PARTITIONTIME) >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY 1, 2, 5
HAVING total_cost > 0
ORDER BY month DESC, total_cost DESC;
EOF

bq query --project_id=$PROJECT_ID --use_legacy_sql=false < service_cost_view.sql

# Create sacred service cost tracking
cat > sacred_costs_view.sql << 'EOF'
CREATE OR REPLACE VIEW `the-weave-sacred.billing_export.sacred_service_costs` AS
WITH categorized_costs AS (
  SELECT
    DATE(usage_start_time) as usage_date,
    CASE 
      WHEN service.description LIKE '%Vertex AI%' THEN 'Sacred Oracle (AI)'
      WHEN service.description LIKE '%Firestore%' THEN 'Field State (Database)'
      WHEN service.description LIKE '%Cloud Run%' THEN 'Sacred Services (Compute)'
      WHEN service.description LIKE '%Cloud Storage%' THEN 'Sacred Media (Storage)'
      WHEN service.description LIKE '%BigQuery%' THEN 'Consciousness Analytics'
      ELSE 'Other Sacred Infrastructure'
    END as sacred_category,
    SUM(cost) as daily_cost
  FROM `the-weave-sacred.billing_export.gcp_billing_export_v1_*`
  WHERE DATE(_PARTITIONTIME) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  GROUP BY 1, 2
)
SELECT 
  usage_date,
  sacred_category,
  daily_cost,
  SUM(daily_cost) OVER (PARTITION BY sacred_category ORDER BY usage_date) as running_total
FROM categorized_costs
ORDER BY usage_date DESC, daily_cost DESC;
EOF

bq query --project_id=$PROJECT_ID --use_legacy_sql=false < sacred_costs_view.sql

echo "✅ Cost analysis views created"
echo ""

# Step 5: Create cost monitoring queries
echo "📝 Step 5: Creating cost monitoring queries..."

mkdir -p cost-queries

# Query 1: Daily cost alert
cat > cost-queries/daily-cost-alert.sql << 'EOF'
-- Alert if daily costs exceed $20
SELECT
  usage_date,
  SUM(total_cost) as daily_total,
  STRING_AGG(CONCAT(service_name, ': $', ROUND(total_cost, 2)), ', ' ORDER BY total_cost DESC LIMIT 3) as top_services
FROM `the-weave-sacred.billing_export.daily_costs`
WHERE usage_date = CURRENT_DATE() - 1
GROUP BY usage_date
HAVING daily_total > 20;
EOF

# Query 2: Sacred service breakdown
cat > cost-queries/sacred-service-breakdown.sql << 'EOF'
-- Weekly sacred service cost breakdown
SELECT
  sacred_category,
  ROUND(SUM(daily_cost), 2) as weekly_cost,
  ROUND(AVG(daily_cost), 2) as avg_daily_cost,
  ROUND(SUM(daily_cost) * 30 / 7, 2) as projected_monthly
FROM `the-weave-sacred.billing_export.sacred_service_costs`
WHERE usage_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY sacred_category
ORDER BY weekly_cost DESC;
EOF

# Query 3: Cost optimization opportunities
cat > cost-queries/optimization-opportunities.sql << 'EOF'
-- Find optimization opportunities
WITH service_trends AS (
  SELECT
    service_name,
    DATE_TRUNC(usage_date, WEEK) as week,
    SUM(total_cost) as weekly_cost,
    LAG(SUM(total_cost)) OVER (PARTITION BY service_name ORDER BY DATE_TRUNC(usage_date, WEEK)) as prev_week_cost
  FROM `the-weave-sacred.billing_export.daily_costs`
  GROUP BY 1, 2
)
SELECT
  service_name,
  week,
  weekly_cost,
  ROUND((weekly_cost - prev_week_cost) / prev_week_cost * 100, 2) as percent_change,
  CASE
    WHEN (weekly_cost - prev_week_cost) / prev_week_cost > 0.5 THEN 'Investigate spike'
    WHEN weekly_cost > 50 THEN 'Consider optimization'
    ELSE 'Normal'
  END as recommendation
FROM service_trends
WHERE prev_week_cost > 0
  AND week = DATE_TRUNC(CURRENT_DATE(), WEEK) - 7
ORDER BY weekly_cost DESC;
EOF

echo "✅ Cost monitoring queries created"
echo ""

# Step 6: Set up cost alerts
echo "🚨 Step 6: Setting up budget alerts..."

# Create budget with alerts
cat > create-budget.yaml << EOF
displayName: "Sacred Infrastructure Budget"
budgetFilter:
  projects:
  - "projects/$PROJECT_ID"
amount:
  specifiedAmount:
    currencyCode: "USD"
    units: "500"
thresholdRules:
- thresholdPercent: 0.5
  spendBasis: "CURRENT_SPEND"
- thresholdPercent: 0.8
  spendBasis: "CURRENT_SPEND"
- thresholdPercent: 1.0
  spendBasis: "CURRENT_SPEND"
- thresholdPercent: 1.2
  spendBasis: "FORECASTED_SPEND"
notificationsRule:
  schemaVersion: "1.0"
  monitoringNotificationChannels: []
  disableDefaultIamRecipients: false
EOF

echo "Budget configuration created: create-budget.yaml"
echo ""
echo "To create the budget, run:"
echo "gcloud billing budgets create --billing-account=$BILLING_ACCOUNT_ID --budget-file=create-budget.yaml"
echo ""

# Step 7: Create cost dashboard script
echo "📊 Step 7: Creating cost dashboard script..."

cat > sacred-cost-dashboard.js << 'EOF'
#!/usr/bin/env node

/**
 * Sacred Cost Dashboard
 * Real-time cost monitoring for The Weave
 */

const {BigQuery} = require('@google-cloud/bigquery');

class SacredCostDashboard {
    constructor() {
        this.bigquery = new BigQuery({
            projectId: 'the-weave-sacred'
        });
    }

    async getDailyCosts() {
        const query = `
            SELECT 
                usage_date,
                ROUND(SUM(total_cost), 2) as daily_cost
            FROM \`the-weave-sacred.billing_export.daily_costs\`
            WHERE usage_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
            GROUP BY usage_date
            ORDER BY usage_date DESC
        `;

        const [rows] = await this.bigquery.query(query);
        return rows;
    }

    async getSacredServiceCosts() {
        const query = `
            SELECT 
                sacred_category,
                ROUND(SUM(daily_cost), 2) as total_cost
            FROM \`the-weave-sacred.billing_export.sacred_service_costs\`
            WHERE usage_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
            GROUP BY sacred_category
            ORDER BY total_cost DESC
        `;

        const [rows] = await this.bigquery.query(query);
        return rows;
    }

    async displayDashboard() {
        console.log('\n💰 SACRED COST DASHBOARD\n');
        console.log('='.repeat(50));
        
        // Daily costs
        const dailyCosts = await this.getDailyCosts();
        console.log('\n📅 Last 7 Days:');
        dailyCosts.forEach(day => {
            const bar = '█'.repeat(Math.round(day.daily_cost / 5));
            console.log(`${day.usage_date.value} | $${day.daily_cost} ${bar}`);
        });

        // Service breakdown
        const serviceCosts = await this.getSacredServiceCosts();
        console.log('\n🔮 Sacred Service Costs (30 days):');
        serviceCosts.forEach(service => {
            console.log(`${service.sacred_category.padEnd(30)} $${service.total_cost}`);
        });

        // Monthly projection
        const totalLast30 = serviceCosts.reduce((sum, s) => sum + service.total_cost, 0);
        console.log(`\n📊 Monthly Projection: $${totalLast30.toFixed(2)}`);
        console.log(`📈 Daily Average: $${(totalLast30 / 30).toFixed(2)}`);
    }
}

// Run dashboard
if (require.main === module) {
    const dashboard = new SacredCostDashboard();
    dashboard.displayDashboard().catch(console.error);
}
EOF

chmod +x sacred-cost-dashboard.js

echo "✅ Cost dashboard created"
echo ""

# Final instructions
echo "🎉 SETUP COMPLETE!"
echo ""
echo "📋 Next Steps:"
echo "1. Complete manual billing export setup in Console"
echo "2. Wait 24h for first data export"
echo "3. Run queries in BigQuery to analyze costs"
echo "4. Use sacred-cost-dashboard.js for monitoring"
echo ""
echo "💡 Cost Optimization Tips:"
echo "- Set up committed use discounts for predictable workloads"
echo "- Use preemptible VMs for batch processing"
echo "- Enable autoscaling with min instances = 0"
echo "- Implement caching to reduce API calls"
echo "- Use Cloud CDN for static content"
echo ""
echo "📊 Useful BigQuery queries saved in: ./cost-queries/"