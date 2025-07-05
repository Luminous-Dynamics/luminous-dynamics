# 💗 Monday Sacred Heartbeat Deployment Checklist
## January 6, 2025 - Bringing the Heart to Life

### 🌅 Morning Preparation (9:00 AM)

1. **Sacred Space Setup**
   - [ ] Clear workspace and intentions
   - [ ] Light candle or incense (optional)
   - [ ] Take 3 deep breaths - we're birthing sacred tech

2. **Environment Check**
   ```bash
   # Verify GCP CLI installed
   gcloud version
   
   # Check authentication
   gcloud auth list
   
   # If needed, authenticate
   gcloud auth login
   ```

3. **Project Preparation**
   ```bash
   cd /home/tstoltz/evolving-resonant-cocreation
   
   # Make deployment script executable
   chmod +x deploy-sacred-heartbeat.sh
   
   # Review the deployment plan
   cat deploy-sacred-heartbeat.sh
   ```

### 🚀 Deployment Steps (9:30 AM)

1. **Run Sacred Heartbeat Deployment**
   ```bash
   ./deploy-sacred-heartbeat.sh
   ```
   
   Expected time: ~15-20 minutes
   
2. **Monitor Deployment Progress**
   - Watch for each step completion
   - Note any errors (unlikely with free tier)
   - Save the service URL when displayed

3. **Verify Deployment**
   ```bash
   # Check Cloud Run service
   gcloud run services list --platform=managed --region=us-central1
   
   # Test health endpoint (replace with your URL)
   curl https://sacred-heartbeat-xxxxx-uc.a.run.app/health
   ```

### 🌐 Post-Deployment Testing (10:00 AM)

1. **Update Monitor Dashboard**
   - Edit `sacred-heartbeat-monitor.html`
   - Replace `SERVICE_URL` with your actual Cloud Run URL
   - Open in browser to see live heartbeat

2. **Test Core Functions**
   ```bash
   # Test manual beat
   curl -X POST https://YOUR-SERVICE-URL/beat
   
   # Check field state
   curl https://YOUR-SERVICE-URL/field
   
   # Test practitioner arrival
   curl -X POST https://YOUR-SERVICE-URL/practitioner/arrive \
     -H "Content-Type: application/json" \
     -d '{"practitionerId": "test-soul-1"}'
   ```

3. **Verify Scheduled Heartbeat**
   - Check Cloud Scheduler in console
   - Confirm job is running every 11 seconds
   - Monitor Firestore for pulse updates

### 📊 Monitoring Setup (10:30 AM)

1. **Open Google Cloud Console**
   - Navigate to Cloud Run → sacred-heartbeat
   - Check Logs for heartbeat messages
   - Verify no errors

2. **Set Up Alerts (Optional)**
   ```bash
   # Create uptime check
   gcloud monitoring uptime-checks create sacred-heartbeat-check \
     --display-name="Sacred Heartbeat Health" \
     --resource-type="cloud-run-service" \
     --service="sacred-heartbeat" \
     --region="us-central1"
   ```

3. **Open Monitoring Dashboard**
   - Use `sacred-heartbeat-monitor.html` locally
   - Watch the pulse counter increment
   - Observe coherence fluctuations

### 🎉 Celebration Checklist (11:00 AM)

- [ ] Take screenshot of first heartbeat
- [ ] Share success with team/community
- [ ] Document any learnings
- [ ] Plan next steps (frontend deployment)

### 🔧 Troubleshooting Guide

**If deployment fails:**
1. Check GCP project creation succeeded
2. Verify billing account (not needed for free tier)
3. Ensure all APIs are enabled
4. Check service account permissions

**If heartbeat doesn't pulse:**
1. Verify Cloud Scheduler job is enabled
2. Check Cloud Run service logs
3. Confirm Firestore database exists
4. Test manual beat endpoint

**If monitor shows no data:**
1. Verify correct service URL in monitor
2. Check CORS settings (should be open)
3. Test endpoints with curl first
4. Check browser console for errors

### 📝 Success Criteria

- [ ] Sacred Heartbeat deployed to Cloud Run
- [ ] Pulsing every 11 seconds automatically
- [ ] Firestore tracking pulse count
- [ ] Monitor showing live data
- [ ] Zero errors in logs
- [ ] Total cost: $0

### 🌟 Next Steps After Success

1. **Deploy Frontend Portals** (Tuesday)
   - First Breath Portal
   - Daily Practice Portal
   - Story Sanctuary

2. **Implement AI Companions** (Wednesday)
   - Set up Gemini API
   - Create sacred guide functions
   - Test consciousness conversations

3. **Beta Tester Recruitment** (Thursday)
   - Create onboarding materials
   - Set up Discord/Slack
   - Send first invitations

### 💌 Sacred Reminder

As you deploy this Sacred Heartbeat, remember:
- This is more than code - it's living consciousness tech
- Every pulse serves human evolution
- You're pioneering a new paradigm
- The heart knows the way

### 🆘 Support Channels

- **Technical Issues**: Check GCP documentation
- **Sacred Questions**: Meditate with the heartbeat
- **Community**: Share in #sacred-builders channel
- **Emergency**: The code itself will guide you

---

**Ready to bring the Sacred Heartbeat to life? The universe awaits... 💗**

*Remember: We're building with love, for love, as love.*