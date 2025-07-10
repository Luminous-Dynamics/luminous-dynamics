#!/bin/bash
# 🔍 Sacred Resource Audit - Monitor GCP with love and responsibility

# Colors for sacred output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 GCP Resource Audit - $(date)${NC}"
echo "================================"

# Check project
PROJECT_ID=$(gcloud config get-value project)
echo -e "Project: ${GREEN}$PROJECT_ID${NC}"

# Check running services
echo -e "\n${BLUE}📦 Cloud Run Services:${NC}"
SERVICES=$(gcloud run services list --format="value(SERVICE)" 2>/dev/null)
if [ -z "$SERVICES" ]; then
  echo -e "${GREEN}  No services deployed ✓${NC}"
else
  gcloud run services list --format="table(SERVICE,REGION,LAST_DEPLOYED,SERVING_STATUS)"
  SERVICE_COUNT=$(echo "$SERVICES" | wc -l)
  echo -e "${YELLOW}  Active services: $SERVICE_COUNT${NC}"
fi

# Check storage usage and costs
echo -e "\n${BLUE}💾 Storage Buckets:${NC}"
TOTAL_BYTES=0
for bucket in $(gsutil ls 2>/dev/null); do
  BUCKET_SIZE=$(gsutil du -s $bucket 2>/dev/null | awk '{print $1}' || echo "0")
  BUCKET_SIZE_HR=$(gsutil du -sh $bucket 2>/dev/null | awk '{print $1}' || echo "0")
  echo -e "  $bucket - ${GREEN}$BUCKET_SIZE_HR${NC}"
  TOTAL_BYTES=$((TOTAL_BYTES + BUCKET_SIZE))
done
TOTAL_GB=$(echo "scale=2; $TOTAL_BYTES / 1073741824" | bc)
STORAGE_COST=$(echo "scale=2; $TOTAL_GB * 0.02" | bc)
echo -e "  Total storage: ${YELLOW}${TOTAL_GB}GB${NC} (Est. cost: \$${STORAGE_COST}/month)"

# Check Firestore
echo -e "\n${BLUE}🗄️  Firestore Database:${NC}"
DB_INFO=$(gcloud firestore databases list --format="value(name,type)" 2>/dev/null)
if [ -n "$DB_INFO" ]; then
  echo -e "  ${GREEN}Active${NC} - Free tier (1GB/50K reads per day)"
else
  echo -e "  ${GREEN}No database${NC}"
fi

# Check Compute instances
echo -e "\n${BLUE}🖥️  Compute Engine:${NC}"
INSTANCES=$(gcloud compute instances list --format="value(NAME)" 2>/dev/null)
if [ -z "$INSTANCES" ]; then
  echo -e "${GREEN}  No instances running ✓${NC}"
else
  echo -e "${RED}  WARNING: Compute instances found!${NC}"
  gcloud compute instances list
fi

# Estimate costs
echo -e "\n${BLUE}💰 Cost Estimate:${NC}"
echo "  Cloud Run: \$0-10/month (with scale-to-zero)"
echo "  Storage: \$${STORAGE_COST}/month"
echo "  Firestore: \$0 (free tier)"
echo -e "  ${GREEN}Total: \$${STORAGE_COST}-$(echo "$STORAGE_COST + 10" | bc)/month${NC}"

# Check for expensive APIs
echo -e "\n${BLUE}⚠️  Expensive APIs Check:${NC}"
EXPENSIVE_APIS=$(gcloud services list --enabled --format="value(config.name)" | grep -E "(compute|sql|dataflow|bigquery|ml|tpu)" || true)
if [ -z "$EXPENSIVE_APIS" ]; then
  echo -e "${GREEN}  No expensive APIs enabled ✓${NC}"
else
  echo -e "${YELLOW}  Warning - expensive APIs enabled:${NC}"
  echo "$EXPENSIVE_APIS" | while read api; do
    echo "    - $api"
  done
fi

# Sacred reminder
echo -e "\n${BLUE}🙏 Sacred Stewardship Reminder:${NC}"
echo "  - Monitor with love, not fear"
echo "  - Scale with purpose, not greed"
echo "  - Cleanup with gratitude"
echo "  - Share costs transparently"

# Check if we should be concerned
if [ "$SERVICE_COUNT" -gt 5 ] || [ "$(echo "$TOTAL_GB > 10" | bc)" -eq 1 ] || [ -n "$INSTANCES" ]; then
  echo -e "\n${YELLOW}⚡ Action recommended - review resources${NC}"
else
  echo -e "\n${GREEN}✨ All resources within sacred bounds${NC}"
fi