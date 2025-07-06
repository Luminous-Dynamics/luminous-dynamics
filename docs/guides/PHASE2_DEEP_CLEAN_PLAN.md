# 🧹 Phase 2: Main Repository Deep Clean Plan

## Current State After Phase 1
- ✅ Moved deployment scripts (21 files)
- ✅ Moved setup scripts (14 files)  
- ✅ Moved Docker files (10+ files)
- ✅ Moved cloud build configs (9 files)
- 🔴 Still have 110 shell scripts in root!

## Remaining Chaos Analysis

### Script Categories Still in Root:
1. **Installation Scripts** (install-*.sh)
2. **Build Scripts** (build-*.sh)
3. **Start/Run Scripts** (start-*.sh, run-*.sh)
4. **Test Scripts** (test-*.sh)
5. **Utility Scripts** (various names)

### Proposed Clean Structure:
```
evolving-resonant-cocreation/
├── src/                    # Core application source
│   ├── glyphs/            # Glyph system
│   ├── automation/        # Automation tools
│   ├── sacred-council/    # Sacred Council code
│   └── web/              # Web interfaces
├── scripts/               # Development & utility scripts
│   ├── install/          # Installation scripts
│   ├── build/            # Build scripts
│   ├── test/             # Test scripts
│   └── utils/            # Other utilities
├── data/                  # Data files (glyphs, schemas)
├── docs/                  # Documentation
├── examples/              # Example implementations
├── tests/                 # Test files
└── .archive/             # Old/deprecated files
```

## Phase 2 Execution Plan

### Step 1: Create Clean Directory Structure
```bash
mkdir -p src/{glyphs,automation,sacred-council,web}
mkdir -p scripts/{install,build,test,utils}
mkdir -p docs/{guides,api,architecture}
mkdir -p examples tests .archive
```

### Step 2: Move Application Code to src/
- Move automation/ → src/automation/
- Move glyph-related code → src/glyphs/
- Move web interfaces → src/web/

### Step 3: Organize Scripts
- install-*.sh → scripts/install/
- build-*.sh → scripts/build/
- test-*.sh → scripts/test/
- start-*.sh, run-*.sh → scripts/utils/

### Step 4: Consolidate Documentation
- All *.md files (except README) → docs/
- Keep only essential docs in root

### Step 5: Archive Old/Duplicate Content
- .staging/ → .archive/staging/
- Old versions → .archive/old-versions/
- Unclear files → .archive/to-review/

## Expected Results

**Before Phase 2:**
- 110 scripts in root
- 323 total directories
- No clear organization
- Can't find anything

**After Phase 2:**
- 0 scripts in root (except sacred-msg.sh)
- ~50 organized directories
- Clear src/scripts/docs structure
- Everything findable

## Critical Files to Keep in Root
1. README.md
2. LICENSE
3. package.json (if needed)
4. sacred-msg.sh (core tool)
5. CLAUDE.md
6. .gitignore

Everything else should have a proper home!

---

Ready to execute Phase 2? This will transform chaos into clarity! 🌟