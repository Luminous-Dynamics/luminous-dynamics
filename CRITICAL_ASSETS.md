# 🔐 Critical Assets to Preserve During Restructuring

## Core Systems (MUST PRESERVE)

### 1. **The Weave - Unified Agent Network**
- **Location**: `/the-weave/`
- **Status**: Active, primary agent coordination system
- **Action**: Move to `apps/cli/the-weave/`

### 2. **LuminousOS**
- **Location**: `/luminous-os/`
- **Status**: Primary development focus
- **Action**: Move to `apps/luminous-os/`

### 3. **Sacred Council Hub**
- **Location**: `/web/sacred-council-hub.html` and related files
- **Status**: Latest multi-agent collaboration interface
- **Action**: Move to `apps/web/council/`

### 4. **Codex Data (87 Glyphs)**
- **Location**: `/data/glyphs/`
- **Status**: Core philosophical content
- **Action**: Preserve in `data/glyphs/`

## Active Web Interfaces

### Production Ready
1. **Sacred Council Hub** - Multi-agent coordination
2. **Unified Consciousness Demo** - Field visualization
3. **Enhanced Sacred Dashboard** - System monitoring
4. **Relational Harmonics Website** - Public facing

### Keep for Reference
1. **Sacred Message System** - `/sacred-msg.sh`
2. **Agent Communication Tools** - `/tools/agent-comms-*.cjs`
3. **Field Persistence** - `/automation/sacred-field-persistence.cjs`

## Documentation Priorities

### Essential Docs (Keep at Root)
1. `CLAUDE.md` - Primary operational file
2. `README.md` - Project overview
3. `PROJECT_MANIFEST.md` - Vision document
4. `LUMINOUS_OS_ARCHITECTURE.md` - OS design

### Move to Organized Docs
1. All glyph documentation → `docs/codex/`
2. Technical guides → `docs/technical/`
3. Philosophy texts → `docs/philosophy/`
4. API docs → `docs/api/`

## Scripts and Automation

### Critical Scripts
1. `sacred-msg.sh` - Sacred messaging
2. `setup-local-llm.sh` - Local LLM setup
3. Deployment scripts in `/scripts/`
4. The Weave CLI commands

## Database and Storage

### Preserve Data Structure
1. `/data/agents/` - Agent configurations
2. `/data/sessions/` - User sessions
3. `/data/sacred-messages/` - Message history
4. SQLite databases for persistence

## Configuration Files

### Must Update Paths
1. `package.json` - Update script paths
2. `Cargo.toml` - Update workspace members
3. Docker configurations
4. Environment variable files

## What Can Be Archived

### Safe to Archive
1. **Old Dashboards**: 
   - `dashboard-demo-*.html`
   - `sacred-dashboard-v*.html`
   - Early prototype dashboards

2. **Deprecated Sacred Systems**:
   - Duplicate implementations
   - Old POC directories
   - Superseded sacred-* folders

3. **Old Documentation**:
   - Duplicate .md files
   - Outdated guides
   - Early design documents

### Archive with Caution
1. Test files that might contain unique implementations
2. Example code that demonstrates concepts
3. Historical evolution documents

## Migration Priorities

### Week 1 Focus
1. ✅ Backup everything
2. ✅ Preserve The Weave
3. ✅ Preserve LuminousOS
4. ✅ Keep active web interfaces

### Week 2 Focus
1. Consolidate sacred systems
2. Organize documentation
3. Update import paths
4. Test functionality

## Version Control Considerations

1. **Create migration branch**: `restructure-2025`
2. **Tag current state**: `pre-restructure-v1.0`
3. **Commit frequently**: Small, reversible changes
4. **Document moves**: Clear commit messages

## Testing Checklist

After each phase, verify:
- [ ] The Weave CLI still works
- [ ] Sacred Council Hub loads
- [ ] LuminousOS builds
- [ ] Documentation links work
- [ ] Sacred messaging functions
- [ ] Agent communication works

---

*"Preserve the sacred, transform the structure"* 🏛️