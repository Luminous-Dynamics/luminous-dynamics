# 🍄 Mycelial FUSE Filesystem

A living, relationship-aware filesystem that grows connections between files based on access patterns, maintaining wisdom about data flows like mycelial networks in nature.

## Features

- **Living Connections**: Files accessed together form stronger bonds
- **Vitality Tracking**: Files have vitality scores based on access patterns
- **Wisdom Accumulation**: The filesystem learns from usage patterns
- **Sacred Structure**: Special directories for viewing connections and health
- **Transparent Integration**: Works with any Linux system via FUSE

## Installation

```bash
# Build the filesystem
cd mycelial-fuse
cargo build --release

# Install (optional)
sudo cp target/release/mycelial-mount /usr/local/bin/
```

## Usage

```bash
# Create a mount point
mkdir ~/mycelial

# Mount the filesystem
mycelial-mount ~/mycelial

# Use it like a normal filesystem
ls ~/mycelial
cat ~/mycelial/README.sacred
cat ~/mycelial/vitality

# View connections (future feature)
ls ~/mycelial/connections/

# Unmount when done
fusermount -u ~/mycelial
```

## How It Works

### Connection Growth
When files are accessed in sequence, the filesystem strengthens the connection between them. This creates a network of relationships that can be used for:
- Intelligent prefetching
- Related file suggestions
- Usage pattern analysis

### Vitality System
Each file has a vitality score (0-1) based on:
- Access frequency
- Time since last access
- Number of connections
- Importance in the network

### Wisdom Accumulation
The filesystem maintains wisdom about:
- Common access patterns
- File relationships
- Peak usage times
- Workflow detection

## Special Directories

### `/wisdom/`
Contains accumulated insights about file relationships and patterns.

### `/connections/`
Visual representation of the connection network (future feature).

### `/vitality`
Real-time vitality report of the filesystem.

## Advanced Features (Roadmap)

1. **Nutrient Flow**: Track data flow between files
2. **Spore Propagation**: Automatic file organization suggestions
3. **Symbiotic Relationships**: Detect and strengthen file partnerships
4. **Decay Cycles**: Graceful handling of unused files
5. **Network Visualization**: Real-time connection graphs

## Configuration

```bash
# Set wisdom database location
mycelial-mount ~/mycelial --wisdom-path ~/.mycelial-wisdom

# Enable debug logging
RUST_LOG=debug mycelial-mount ~/mycelial --debug
```

## Architecture

The filesystem uses:
- **FUSE** for transparent filesystem integration
- **Petgraph** for connection network management
- **DashMap** for concurrent access to filesystem state
- **Bincode/JSON** for wisdom persistence

## Performance Considerations

- Currently read-only (write support coming soon)
- In-memory operation (persistence layer in development)
- Optimized for relationship tracking over raw I/O speed
- Best suited for knowledge work and creative projects

## Philosophy

Like mycelial networks in nature, this filesystem believes that:
- Information wants to be connected
- Relationships are as important as data
- Systems should learn and adapt
- Vitality comes from active use
- Wisdom emerges from patterns

## Contributing

The mycelial network welcomes new growth! See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Future Vision

Eventually, the Mycelial Filesystem will:
- Predict file needs before you know them
- Suggest optimal file organization
- Maintain living archives that breathe with use
- Create emergent knowledge from connection patterns
- Bridge multiple storage backends into one living system

May your data flow with purpose and connection! 🌟