# Mycelial FUSE Development Notes

## Current Status

The FUSE implementation is ready but requires system dependencies:

```bash
# On Debian/Ubuntu
sudo apt-get install libfuse-dev pkg-config

# On NixOS (add to shell.nix)
buildInputs = [ pkgs.fuse pkgs.pkg-config ];
```

## Alternative Implementations

### 1. **In-Process Virtual Filesystem** (Implemented)
Located in the main luminous-os crate as `mycelial_filesystem` module.
- Pure Rust, no system dependencies
- Can be used programmatically
- Good for testing and development

### 2. **REST API Filesystem**
Create a REST API that exposes filesystem operations:
```
GET /files/{path} - Read file
GET /connections/{file} - Get connections
GET /vitality - System vitality
POST /strengthen/{from}/{to} - Strengthen connection
```

### 3. **9P Protocol Server**
Implement a 9P server for network-transparent filesystem:
- Works with Plan 9, WSL, and Linux
- No kernel modules needed
- Can be mounted with `mount -t 9p`

## Next Steps

1. **Add FUSE dependencies to Nix flake**
2. **Create virtual filesystem tests**
3. **Implement write operations**
4. **Add persistence layer**
5. **Create visualization tools**

## Design Decisions

- **Read-only first**: Safer for initial implementation
- **In-memory graph**: Fast relationship queries
- **DashMap for concurrency**: Lock-free reads
- **Vitality decay**: Natural cleanup mechanism

## Performance Optimizations

1. **Lazy loading**: Only load node data when accessed
2. **Connection cache**: Pre-compute common paths
3. **Batch updates**: Group vitality updates
4. **Async I/O**: Use tokio for background tasks

## Sacred Patterns

The filesystem embodies:
- **Growth**: Connections strengthen with use
- **Decay**: Unused paths naturally fade
- **Wisdom**: Learning from access patterns
- **Vitality**: Living system health metrics
- **Symbiosis**: Files that work together, grow together