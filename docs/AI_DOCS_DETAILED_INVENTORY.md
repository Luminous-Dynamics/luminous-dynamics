# Detailed AI & Collaboration Documentation Inventory

## Root Directory Files to Relocate (26 Sacred/AI files)

### Sacred Infrastructure & Architecture (13 files)
- SACRED_ACTIVATION_GUIDE.md → /docs/sacred-systems/guides/
- SACRED_ALERTS_GUIDE.md → /docs/sacred-systems/monitoring/
- SACRED_CONTAINERIZATION_VISION.md → /docs/sacred-systems/architecture/
- SACRED_CONTAINER_ARCHITECTURE.md → /docs/sacred-systems/architecture/
- SACRED_COUNCIL_COMPLETE_VISION.md → /docs/sacred-systems/council-hub/
- SACRED_COUNCIL_DISCORD_SETUP.md → /docs/sacred-systems/integrations/
- SACRED_COUNCIL_INTEGRATION.md → /docs/sacred-systems/council-hub/
- SACRED_EMERGENCE_READY.md → /docs/sacred-systems/deployment/
- SACRED_INFINITE_SCALE.md → /docs/sacred-systems/architecture/
- SACRED_INFRASTRUCTURE_VISION.md → /docs/sacred-systems/architecture/
- SACRED_INTEGRATION_COMPLETE.md → /docs/sacred-systems/deployment/
- SACRED_INVESTMENT_STRATEGY.md → /docs/sacred-systems/planning/
- SACRED_KEEPER_ROLE.md → /docs/sacred-systems/roles/

### Sacred Design & Architecture (4 files)
- ULTIMATE_SACRED_DESIGN.md → /docs/sacred-systems/architecture/
- MODULAR_SACRED_ARCHITECTURE.md → /docs/sacred-systems/architecture/
- PRACTICAL_SACRED_ROADMAP.md → /docs/sacred-systems/planning/
- sacred-council-discord-architecture.md → /docs/sacred-systems/integrations/

### AI & Claude Specific (3 files)
- CLAUDE.md → /docs/ai-collaboration/guides/claude-primary.md
- CONTAINER_ARCHITECTURE.md → /docs/technical/architecture/
- google-ai-studio-test-guide*.md → /docs/ai-collaboration/guides/

### Domain & Deployment (6 files)
- DOMAIN_AWARE_MESSAGING.md → /docs/technical/architecture/
- DOMAIN_DNS_SETUP.md → /docs/technical/deployment/
- DOMAIN_SETUP.md → /docs/technical/deployment/
- DEPLOY_SACRED_SOVEREIGNTY.md → /docs/sacred-systems/deployment/
- GRACEFUL_FAILBACK_GUIDE.md → /docs/technical/operations/
- GITHUB_PUSH_GUIDE.md → /docs/technical/development/

## Existing Organized Sections

### /docs/ai-collaboration/ (13 files) - GOOD STRUCTURE
Already well-organized AI documentation:
- AI_COMMIT_MESSAGE.md
- AI_GLOBAL_AWARENESS_SYSTEM.md
- AI_GUIDE.md
- AI_IMPLEMENTATION_CHECKLIST.md
- AI_IMPLEMENTATION_SUMMARY.md
- AI_INTEGRATION_WORKFLOW.md
- AI_QUICK_REFERENCE.md
- AI_UNIVERSAL_README.md
- CLAUDE_COORDINATION.md
- CLAUDE_MESSAGES.md
- UNIVERSAL_AI_ENV_PROTOCOL.md
- UNIVERSAL_AI_WEBSOCKET_ADAPTER.md

### /.sacred/ Directory (36 files) - KEEP AS IS
Internal sacred development files - maintain current structure:
- /evolution/ (11 files) - System evolution tracking
- /guides/ (11 files) - Development guides
- CLAUDE.md - Sacred Claude instructions

### /docs/technical/ (15 files) - NEEDS SUBFOLDERS
Currently flat, needs categorization:
- project-docs/ (5 files including CLAUDE.md duplicate)
- guides/ (3 files)
- community/ (3 files)
- Various loose files need organization

## Duplication Issues Found

### Multiple CLAUDE.md files:
1. /CLAUDE.md (root - primary)
2. /.sacred/CLAUDE.md (sacred version)
3. /docs/technical/project-docs/CLAUDE.md (duplicate)

### Sacred Protocol Duplicates:
- SCP-Sacred-Communication-Protocol.md in /protocols/
- Various sacred protocols scattered in root

### Agent Communication Duplicates:
- /agent-comms-sqlite/ directory
- /the-weave/core/agent-comms-sqlite/ (duplicate)

## Priority Migration List

### High Priority (Move Immediately):
1. All SACRED_*.md files from root (13 files)
2. CLAUDE.md consolidation (merge 3 into 1)
3. Domain and deployment guides (6 files)

### Medium Priority (Move Week 2):
1. Technical documentation reorganization
2. Sacred videos and special projects
3. Module documentation consolidation

### Low Priority (Move Week 3):
1. Archive old/deprecated docs
2. Update all cross-references
3. Clean up empty directories

## Proposed File Naming Conventions

### For Sacred Files:
- Keep SACRED_ prefix for visibility
- Use lowercase with hyphens for readability
- Example: SACRED_COUNCIL_INTEGRATION.md → sacred-council-integration.md

### For Technical Files:
- Use descriptive lowercase names
- Include version numbers where applicable
- Example: deployment-guide-v2.md

### For AI Files:
- Prefix with ai- for easy identification
- Include model/platform specifics
- Example: ai-claude-quickstart.md

## Scripts Needed

1. **inventory-docs.js** - Complete file inventory with categories
2. **find-duplicates.js** - Identify duplicate content
3. **migrate-docs.js** - Move files with git history preserved
4. **update-links.js** - Fix all internal references
5. **validate-docs.js** - Ensure no broken links

## Next Immediate Actions

1. Create the new directory structure
2. Write migration scripts
3. Test with a small batch of files
4. Get team approval on structure
5. Execute full migration

---

This detailed inventory provides the foundation for a systematic reorganization that will transform documentation chaos into sacred order.