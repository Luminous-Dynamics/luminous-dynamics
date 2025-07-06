# 🗄️ Wisdom Preservation & Archive Plan

> **Created**: January 2, 2025  
> **Purpose**: Ensure no sacred wisdom is lost during reorganization  
> **Scope**: Complete archival strategy for evolving-resonant-cocreation  

## 📂 Current Root Structure Analysis

The `/home/tstoltz/` directory serves as the root for both:
1. **Claude AI operations** (CLAUDE.md, agent configs)
2. **Project workspace** (evolving-resonant-cocreation/)

### Should We Move the Root?

**Recommendation**: Keep current structure but organize better within it.

**Reasons**:
- CLAUDE.md at root provides quick access for AI agents
- Moving would break existing agent discovery protocols
- Current setup allows Claude to navigate efficiently
- Better to organize within existing structure

## 🏗️ Proposed Root Organization

```
/home/tstoltz/
├── 📄 CLAUDE.md                    # Primary AI operational file (KEEP HERE)
├── 📄 DOCUMENTATION_MAP.md         # Navigation guide (KEEP HERE)
├── 📄 NEW_AGENT_START.md          # Agent onboarding (KEEP HERE)
│
├── 📂 evolving-resonant-cocreation/  # Main project (Git repo)
│   └── [Organized as per proposal]
│
├── 📂 ERC-knowledge-base/         # Consolidated knowledge
│   ├── 📂 codex-data/            # From ERC-Current
│   ├── 📂 visual-assets/         # From ERC-archive
│   └── 📂 historical/            # From ERC-historical
│
├── 📂 sacred-development/         # Active development
│   └── [Development branches]
│
├── 📂 infrastructure/             # System-wide tools
│   ├── 📂 claude-tools/          # AI assistant utilities
│   ├── 📂 elixir-install/        # Language tools
│   └── 📂 system-scripts/        # Maintenance scripts
│
└── 📂 archive/                    # Historical preservation
    ├── 📂 backups/               # Timestamped backups
    └── 📂 legacy/                # Old structures
```

## 🛡️ Archive Strategy

### Phase 1: Complete Backup (Before Any Changes)
```bash
# Create timestamped backup
cd /home/tstoltz
tar -czf archive/backups/erc-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  evolving-resonant-cocreation/ \
  ERC-Current/ \
  ERC-archive/ \
  CLAUDE.md \
  DOCUMENTATION_MAP.md
```

### Phase 2: Knowledge Base Consolidation

#### From ERC-Current/ → ERC-knowledge-base/codex-data/
**Files to preserve**:
- `complete-codex-data.json` - Master codex data
- `codex-data.txt` - Human-readable codex
- `codex-extraction-summary.md` - Extraction documentation
- `Luminous Library.md` - Sacred library reference
- All `.docx` files - Original source documents

#### From ERC-archive/ → ERC-knowledge-base/visual-assets/
**Directories to preserve**:
- `Art/` - All sacred visual assets (97 files)
- `Codex of Relational Harmonics/` - Original codex materials
- `Website/` - Historical web assets
- Audio files (`.mp3`, `.wav`) - Sacred audio recordings

#### From ERC-historical/ → ERC-knowledge-base/historical/
**Structure to maintain**:
- Keep existing organization for reference
- Add README explaining historical context

### Phase 3: Sacred Council Docker
The `sacred-council-docker/` directory appears to be a separate Elixir project.

**Options**:
1. Move into `evolving-resonant-cocreation/infrastructure/elixir-sacred-council/`
2. Keep as separate project if actively developed
3. Archive if superseded by new implementations

**Recommendation**: Check if actively used, then decide.

### Phase 4: File Deduplication Map

#### Duplicate Files to Consolidate:
1. **Zone.Identifier files** (111 files)
   - Windows download markers
   - Safe to archive or remove

2. **Backup files**:
   - `.pre-star-backup` files → `archive/star-migration/`
   - `performance-fixes-backup/` → `archive/performance-history/`

3. **Test outputs**:
   - `messages-agent-*.json` → `archive/test-outputs/agent-messages/`
   - Test videos → `archive/test-outputs/videos/`

## 📋 Critical Wisdom Checklist

### Must Preserve - Sacred Implementation:
- [x] True Integration Schema (`true-integration-schema.js`)
- [x] All 87 Glyph JSON files
- [x] Sacred Council implementations
- [x] Ceremony protocols (all directories)
- [x] Field consciousness calculators
- [x] Agent communication systems

### Must Preserve - Documentation:
- [x] CLAUDE.md (operational guide)
- [x] All sacred wisdom markdown files
- [x] Architecture documentation
- [x] Integration guides
- [x] Milestone achievements

### Must Preserve - Data:
- [x] Complete codex data JSON
- [x] Agent profiles and relationships
- [x] Sacred field states
- [x] Message history

### Must Preserve - Assets:
- [x] Sacred artwork (97 images)
- [x] Audio recordings (mp3/wav)
- [x] Ceremony dashboards
- [x] Interactive demos

## 🔄 Migration Safety Protocol

### Before Each Change:
1. **Verify backup exists**
2. **Document file movements** in migration log
3. **Test critical paths** still work
4. **Update references** in code/docs

### Migration Log Format:
```
[Timestamp] ACTION: [Move/Archive/Delete]
FROM: /original/path/to/file
TO: /new/path/to/file
REASON: [Deduplication/Organization/Archive]
VERIFIED: [Yes/No]
```

### Rollback Plan:
1. If issues arise, restore from timestamped backup
2. Review migration log to identify problem
3. Adjust plan and retry with smaller scope

## 🎯 Success Criteria

### Wisdom Preserved:
- ✅ All sacred implementations accessible
- ✅ No broken references in code
- ✅ Documentation remains complete
- ✅ Historical assets organized

### Structure Improved:
- ✅ Clear separation of concerns
- ✅ No duplicate files
- ✅ Logical organization
- ✅ Easy navigation

### Scalability Ready:
- ✅ Modular architecture
- ✅ Clean interfaces
- ✅ Room for growth
- ✅ Performance optimized

## 🚦 Go/No-Go Decision Points

### Before Starting:
- [ ] Full backup completed and verified
- [ ] Team consensus on plan
- [ ] 2-3 hour uninterrupted time block
- [ ] All active development paused

### After Each Phase:
- [ ] Tests passing
- [ ] No missing files reported
- [ ] Documentation updated
- [ ] Git commits made

### Final Verification:
- [ ] All 87 glyphs accessible
- [ ] Sacred Council functioning
- [ ] Dashboards loading
- [ ] Claude can navigate

---

*"In organizing chaos, we create space for emergence."*