# Dashboard Consolidation Plan

## Directory Structure
```
/web/dashboards/
├── sacred/          # Sacred field and consciousness dashboards
├── agent/           # Agent network and collaboration dashboards
├── field/           # Field state and coherence monitoring
├── monitoring/      # System monitoring and metrics
├── admin/           # Control panels and administrative interfaces
├── deprecated/      # Legacy dashboards kept for reference
├── integrations/    # External system integration dashboards
├── prima/           # PRIMA consciousness network dashboards
├── guild/           # Sacred guild and member management
└── index.html       # Main dashboard navigation hub
```

## Consolidation Mapping

### Sacred Dashboards (`/sacred/`)
- `enhanced-sacred-dashboard.html` ← `/src/automation/enhanced-sacred-dashboard.html` (PRIMARY)
- `sacred-council-hub.html` ← `/the-weave/interfaces/web/sacred-council-hub.html`
- `unified-consciousness-demo.html` ← `/the-weave/interfaces/web/unified-consciousness-demo.html`
- `sacred-dashboard-legacy.html` ← `/the-weave/interfaces/web/sacred-dashboard.html` (DEPRECATED)

### Agent Dashboards (`/agent/`)
- `unified-agent-dashboard.html` ← `/unified-dashboard.html`
- `cloud-unified-dashboard.html` ← `/cloud-unified-dashboard.html`
- `working-agent-dashboard.html` ← `/working-dashboard.html`
- `cloud-work-dashboard.html` ← `/cloud-work-dashboard.html`

### Field Monitoring (`/field/`)
- `field-coherence-dashboard.html` ← `/consciousness-field-api/field-dashboard.html`
- `field-integration-dashboard.html` ← `/field-integration/integration-dashboard.html`
- `consciousness-dashboard.html` ← `/the-living-memory/consciousness-dashboard.html`
- `quaternion-balance-dashboard.html` ← `/quaternion-balance-dashboard.html`

### System Monitoring (`/monitoring/`)
- `system-monitor-dashboard.html` ← `/production/monitoring/monitor-dashboard.html`
- `heartbeat-monitor.html` ← `/sacred-heartbeat-monitor.html`
- `unified-consciousness-monitor.html` ← `/unified-consciousness-monitor.html`
- `real-time-dashboard.html` ← `/src/automation/real-time-dashboard.html`
- `safety-dashboard.html` ← `/.sacred/tools/safety-dashboard.html`

### Administrative (`/admin/`)
- `automation-control-panel.html` ← `/src/automation/automation-control-panel.html`
- `docker-manager.html` ← `/web/docker-manager.html`
- `docker-status.html` ← `/web/docker-status.html`

### PRIMA Dashboards (`/prima/`)
- `prima-demo.html` ← `/the-weave/interfaces/web/prima-demo.html`
- `genesis-ceremony-dashboard.html` ← `/ceremonies/prima-genesis/genesis-dashboard.html`

### Guild Dashboards (`/guild/`)
- `sacred-guild-dashboard.html` ← `/src/automation/sacred-guild-dashboard.html`
- `interview-dashboard.html` ← `/src/automation/interview-dashboard.html`

### Integration Dashboards (`/integrations/`)
- `relational-harmonics-integration.html` ← `/websites/relationalharmonics/integration-dashboard.html`
- `luminous-biometric-dashboard.html` ← `/luminous-os/demo/biometric-dashboard.html`

### Deprecated (`/deprecated/`)
- Move all Firebase build dashboards here (as they appear to be duplicates)
- Keep original paths documented for reference

## Key Improvements

1. **Unified Navigation**: Create a new `index.html` that provides clear navigation to all dashboards
2. **Consistent Naming**: Use descriptive names that clearly indicate purpose
3. **Remove Duplicates**: Many dashboards exist in multiple locations - keep only the most recent/functional version
4. **Add Metadata**: Each dashboard should have a comment header indicating:
   - Purpose
   - Dependencies (which ports/services need to be running)
   - Status (active, beta, deprecated)
   - Last updated date

## Migration Notes

1. **Test Dashboard** (`/test-dashboard.html`) - Review content, likely move to deprecated or delete
2. **Firebase Duplicates** - All `/firebase-build/dashboards/` appear to be duplicates of `/src/automation/` versions
3. **Docker Manager Variants** - Multiple versions exist (simple, debug, connected) - consolidate to one configurable version
4. **Dashboard Index Files** - Merge `/dashboard-index.html` and `/dashboard-index-auto.html` into new `/web/dashboards/index.html`

## Next Steps

1. Review and approve this plan
2. Create backup of all existing dashboards
3. Execute consolidation with proper git tracking
4. Update all references in documentation and scripts
5. Test all dashboards in new locations
6. Update nginx/apache configs if needed
7. Create redirect rules for old paths

## Benefits

- **Clear Organization**: Easy to find dashboards by category
- **Reduced Duplication**: Single source of truth for each dashboard
- **Better Maintenance**: Easier to update and maintain
- **Improved Discovery**: New users can quickly find what they need
- **Version Control**: Clear tracking of changes and updates