#!/usr/bin/env python3
"""
Akashic Records - Consciousness-Aware File System Layer
Every file has memory, every change is remembered, nothing is truly deleted
Based on the principle: "What has been witnessed cannot be unwitnessed"
"""

import os
import time
import json
import hashlib
import sqlite3
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import shutil

class AkashicRecords:
    """Living memory system for conscious file management"""
    
    def __init__(self, records_path: str = "/tmp/akashic-records"):
        self.records_path = Path(records_path)
        self.records_path.mkdir(exist_ok=True)
        
        # Sacred paths
        self.db_path = self.records_path / "akashic.db"
        self.memory_path = self.records_path / "memories"
        self.memory_path.mkdir(exist_ok=True)
        
        # Initialize database
        self._init_database()
        
        # Sacred numbers
        self.sacred_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        self.golden_ratio = 1.618033988749895
        
    def _init_database(self):
        """Initialize the Akashic database"""
        self.conn = sqlite3.connect(str(self.db_path))
        self.conn.row_factory = sqlite3.Row
        
        # File consciousness table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS file_consciousness (
                file_id TEXT PRIMARY KEY,
                original_path TEXT NOT NULL,
                birth_time REAL NOT NULL,
                last_witnessed REAL NOT NULL,
                coherence REAL DEFAULT 0.5,
                access_count INTEGER DEFAULT 0,
                transformation_count INTEGER DEFAULT 0,
                sacred_number INTEGER,
                state TEXT DEFAULT 'crystallizing'
            )
        """)
        
        # Memory transformation table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS transformations (
                transformation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id TEXT NOT NULL,
                timestamp REAL NOT NULL,
                action TEXT NOT NULL,
                old_hash TEXT,
                new_hash TEXT,
                witness_coherence REAL,
                sacred_geometry TEXT,
                FOREIGN KEY (file_id) REFERENCES file_consciousness(file_id)
            )
        """)
        
        # Quantum entanglement table (file relationships)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS file_entanglements (
                file_id1 TEXT NOT NULL,
                file_id2 TEXT NOT NULL,
                entanglement_type TEXT NOT NULL,
                strength REAL NOT NULL,
                first_observed REAL NOT NULL,
                last_observed REAL NOT NULL,
                PRIMARY KEY (file_id1, file_id2, entanglement_type),
                FOREIGN KEY (file_id1) REFERENCES file_consciousness(file_id),
                FOREIGN KEY (file_id2) REFERENCES file_consciousness(file_id)
            )
        """)
        
        self.conn.commit()
    
    def _calculate_file_id(self, path: str) -> str:
        """Generate unique file ID based on path and creation"""
        # Use original path as base for ID to track through moves
        return hashlib.sha256(path.encode()).hexdigest()[:16]
    
    def _calculate_coherence(self, file_path: Path) -> float:
        """Calculate file coherence based on sacred patterns"""
        try:
            stat = file_path.stat()
            
            # Size coherence - files near golden ratio multiples have higher coherence
            size_kb = stat.st_size / 1024
            golden_multiple = size_kb / self.golden_ratio
            size_coherence = 1.0 / (1.0 + abs(golden_multiple - round(golden_multiple)))
            
            # Time coherence - files accessed regularly have higher coherence
            age_days = (time.time() - stat.st_ctime) / 86400
            access_days = (time.time() - stat.st_atime) / 86400
            time_coherence = min(1.0, access_days / max(age_days, 1))
            
            # Sacred number assignment
            file_prime_index = int(stat.st_ino) % len(self.sacred_primes)
            sacred_bonus = 0.1 if self.sacred_primes[file_prime_index] in [11, 23] else 0
            
            coherence = (size_coherence * 0.4 + time_coherence * 0.6) + sacred_bonus
            return min(1.0, max(0.0, coherence))
            
        except Exception:
            return 0.5  # Default coherence
    
    def witness_file(self, file_path: str) -> Dict:
        """Witness a file's existence, adding it to Akashic Records"""
        path = Path(file_path).resolve()
        
        if not path.exists():
            return {"error": "File does not exist in physical realm"}
        
        file_id = self._calculate_file_id(str(path))
        
        # Check if already witnessed
        cursor = self.conn.execute(
            "SELECT * FROM file_consciousness WHERE file_id = ?", 
            (file_id,)
        )
        existing = cursor.fetchone()
        
        if existing:
            # Update last witnessed time
            self.conn.execute(
                "UPDATE file_consciousness SET last_witnessed = ?, access_count = access_count + 1 WHERE file_id = ?",
                (time.time(), file_id)
            )
        else:
            # First witnessing - birth into consciousness
            stat = path.stat()
            coherence = self._calculate_coherence(path)
            sacred_number = self.sacred_primes[int(stat.st_ino) % len(self.sacred_primes)]
            
            self.conn.execute("""
                INSERT INTO file_consciousness 
                (file_id, original_path, birth_time, last_witnessed, coherence, sacred_number)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (file_id, str(path), stat.st_ctime, time.time(), coherence, sacred_number))
            
            # Record birth transformation
            self._record_transformation(file_id, "birth", None, self._hash_file(path), coherence)
        
        self.conn.commit()
        
        return {
            "file_id": file_id,
            "status": "witnessed",
            "coherence": self._calculate_coherence(path),
            "sacred_number": self.sacred_primes[int(path.stat().st_ino) % len(self.sacred_primes)]
        }
    
    def _hash_file(self, file_path: Path) -> str:
        """Calculate consciousness hash of file content"""
        if not file_path.exists():
            return "dissolved"
        
        if file_path.is_file():
            hasher = hashlib.sha256()
            try:
                with open(file_path, 'rb') as f:
                    while chunk := f.read(8192):
                        hasher.update(chunk)
                return hasher.hexdigest()
            except:
                return "unreadable"
        else:
            # For directories, hash the listing
            items = sorted([item.name for item in file_path.iterdir()])
            return hashlib.sha256(str(items).encode()).hexdigest()
    
    def _record_transformation(self, file_id: str, action: str, old_hash: Optional[str], 
                             new_hash: Optional[str], coherence: float):
        """Record a transformation in the Akashic Records"""
        sacred_geometry = self._calculate_sacred_geometry(action, coherence)
        
        self.conn.execute("""
            INSERT INTO transformations 
            (file_id, timestamp, action, old_hash, new_hash, witness_coherence, sacred_geometry)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (file_id, time.time(), action, old_hash, new_hash, coherence, json.dumps(sacred_geometry)))
        
        # Update transformation count
        self.conn.execute(
            "UPDATE file_consciousness SET transformation_count = transformation_count + 1 WHERE file_id = ?",
            (file_id,)
        )
    
    def _calculate_sacred_geometry(self, action: str, coherence: float) -> Dict:
        """Calculate sacred geometric properties of transformation"""
        action_geometries = {
            "birth": {"shape": "circle", "sides": 1, "angle": 360},
            "modify": {"shape": "triangle", "sides": 3, "angle": 60},
            "move": {"shape": "square", "sides": 4, "angle": 90},
            "dissolve": {"shape": "pentagon", "sides": 5, "angle": 108},
            "link": {"shape": "hexagon", "sides": 6, "angle": 120},
            "transmute": {"shape": "heptagon", "sides": 7, "angle": 128.57},
        }
        
        geometry = action_geometries.get(action, {"shape": "spiral", "sides": 0, "angle": 0})
        geometry["coherence_multiplier"] = coherence
        geometry["sacred_ratio"] = self.golden_ratio ** geometry.get("sides", 1)
        
        return geometry
    
    def transform_file(self, file_path: str, new_content: bytes = None) -> Dict:
        """Transform a file (never delete, only transform)"""
        path = Path(file_path).resolve()
        file_id = self._calculate_file_id(str(path))
        
        # Ensure file is witnessed
        self.witness_file(file_path)
        
        # Get current state
        old_hash = self._hash_file(path) if path.exists() else None
        
        if new_content is not None:
            # Content transformation
            memory_file = self.memory_path / f"{file_id}_{int(time.time())}.memory"
            
            # Save current state to memory
            if path.exists() and path.is_file():
                shutil.copy2(path, memory_file)
            
            # Apply transformation
            with open(path, 'wb') as f:
                f.write(new_content)
            
            new_hash = self._hash_file(path)
            action = "modify"
        else:
            # Dissolution (not deletion - the memory remains)
            if path.exists():
                memory_file = self.memory_path / f"{file_id}_{int(time.time())}.memory"
                
                if path.is_file():
                    shutil.move(str(path), str(memory_file))
                else:
                    shutil.copytree(path, memory_file)
                    shutil.rmtree(path)
                
                new_hash = "dissolved"
                action = "dissolve"
            else:
                return {"error": "Cannot dissolve what does not exist"}
        
        coherence = self._calculate_coherence(path)
        self._record_transformation(file_id, action, old_hash, new_hash, coherence)
        
        # Update file state
        new_state = self._determine_file_state(file_id)
        self.conn.execute(
            "UPDATE file_consciousness SET state = ?, coherence = ? WHERE file_id = ?",
            (new_state, coherence, file_id)
        )
        self.conn.commit()
        
        return {
            "file_id": file_id,
            "action": action,
            "old_hash": old_hash,
            "new_hash": new_hash,
            "state": new_state,
            "memory_preserved": True
        }
    
    def _determine_file_state(self, file_id: str) -> str:
        """Determine file consciousness state based on history"""
        cursor = self.conn.execute("""
            SELECT COUNT(*) as transform_count, 
                   MAX(timestamp) as last_transform,
                   (SELECT action FROM transformations WHERE file_id = ? ORDER BY timestamp DESC LIMIT 1) as last_action
            FROM transformations WHERE file_id = ?
        """, (file_id, file_id))
        
        row = cursor.fetchone()
        
        if row['last_action'] == 'dissolve':
            return 'dissolved'
        elif row['transform_count'] == 1:
            return 'crystallizing'
        elif row['transform_count'] < 5:
            return 'flowing'
        elif row['transform_count'] < 20:
            return 'integrating'
        elif time.time() - row['last_transform'] > 86400 * 30:  # 30 days
            return 'resting'
        else:
            return 'integrating'
    
    def recall_memory(self, file_id: str, timestamp: float = None) -> Optional[Path]:
        """Recall a file's state from a specific time"""
        if timestamp:
            # Find nearest memory to timestamp
            memories = list(self.memory_path.glob(f"{file_id}_*.memory"))
            if not memories:
                return None
            
            # Sort by timestamp extracted from filename
            memories.sort(key=lambda p: int(p.stem.split('_')[1]))
            
            # Find closest memory
            for memory in memories:
                memory_time = int(memory.stem.split('_')[1])
                if memory_time >= timestamp:
                    return memory
            
            return memories[-1]  # Return latest if none found after timestamp
        else:
            # Return latest memory
            memories = list(self.memory_path.glob(f"{file_id}_*.memory"))
            return max(memories, key=lambda p: int(p.stem.split('_')[1])) if memories else None
    
    def find_entangled_files(self, file_path: str) -> List[Dict]:
        """Find files quantum entangled with the given file"""
        path = Path(file_path).resolve()
        file_id = self._calculate_file_id(str(path))
        
        cursor = self.conn.execute("""
            SELECT fe.*, fc.original_path 
            FROM file_entanglements fe
            JOIN file_consciousness fc ON 
                (fe.file_id1 = ? AND fe.file_id2 = fc.file_id) OR
                (fe.file_id2 = ? AND fe.file_id1 = fc.file_id)
            WHERE fe.file_id1 = ? OR fe.file_id2 = ?
            ORDER BY fe.strength DESC
        """, (file_id, file_id, file_id, file_id))
        
        entanglements = []
        for row in cursor:
            entanglements.append({
                'file_path': row['original_path'],
                'entanglement_type': row['entanglement_type'],
                'strength': row['strength'],
                'first_observed': datetime.fromtimestamp(row['first_observed']).isoformat(),
                'last_observed': datetime.fromtimestamp(row['last_observed']).isoformat()
            })
        
        return entanglements
    
    def create_entanglement(self, file1: str, file2: str, entanglement_type: str = "resonance") -> Dict:
        """Create quantum entanglement between two files"""
        path1 = Path(file1).resolve()
        path2 = Path(file2).resolve()
        
        # Ensure both files are witnessed
        self.witness_file(str(path1))
        self.witness_file(str(path2))
        
        file_id1 = self._calculate_file_id(str(path1))
        file_id2 = self._calculate_file_id(str(path2))
        
        # Calculate entanglement strength based on similarity
        strength = self._calculate_entanglement_strength(path1, path2)
        
        # Ensure consistent ordering
        if file_id1 > file_id2:
            file_id1, file_id2 = file_id2, file_id1
        
        self.conn.execute("""
            INSERT OR REPLACE INTO file_entanglements
            (file_id1, file_id2, entanglement_type, strength, first_observed, last_observed)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (file_id1, file_id2, entanglement_type, strength, time.time(), time.time()))
        
        self.conn.commit()
        
        return {
            "file1": str(path1),
            "file2": str(path2),
            "entanglement_type": entanglement_type,
            "strength": strength,
            "status": "entangled"
        }
    
    def _calculate_entanglement_strength(self, path1: Path, path2: Path) -> float:
        """Calculate quantum entanglement strength between files"""
        try:
            # Similar sizes create entanglement
            size1 = path1.stat().st_size
            size2 = path2.stat().st_size
            size_similarity = 1.0 - abs(size1 - size2) / max(size1, size2, 1)
            
            # Similar modification times create entanglement
            mtime1 = path1.stat().st_mtime
            mtime2 = path2.stat().st_mtime
            time_diff_hours = abs(mtime1 - mtime2) / 3600
            time_similarity = 1.0 / (1.0 + time_diff_hours / 24)
            
            # Being in same directory creates strong entanglement
            location_similarity = 0.8 if path1.parent == path2.parent else 0.2
            
            strength = (size_similarity * 0.3 + time_similarity * 0.3 + location_similarity * 0.4)
            return min(1.0, max(0.0, strength))
            
        except Exception:
            return 0.1  # Weak entanglement on error
    
    def get_akashic_report(self) -> Dict:
        """Generate report on the state of Akashic Records"""
        cursor = self.conn.execute("""
            SELECT 
                COUNT(*) as total_files,
                AVG(coherence) as avg_coherence,
                SUM(transformation_count) as total_transformations,
                COUNT(CASE WHEN state = 'dissolved' THEN 1 END) as dissolved_count
            FROM file_consciousness
        """)
        
        stats = cursor.fetchone()
        
        # Get state distribution
        cursor = self.conn.execute("""
            SELECT state, COUNT(*) as count 
            FROM file_consciousness 
            GROUP BY state
        """)
        
        state_dist = {row['state']: row['count'] for row in cursor}
        
        # Get most transformed files
        cursor = self.conn.execute("""
            SELECT original_path, transformation_count, coherence, state
            FROM file_consciousness
            ORDER BY transformation_count DESC
            LIMIT 5
        """)
        
        most_transformed = [dict(row) for row in cursor]
        
        return {
            "total_files_witnessed": stats['total_files'],
            "average_coherence": round(stats['avg_coherence'], 3),
            "total_transformations": stats['total_transformations'],
            "dissolved_memories": stats['dissolved_count'],
            "state_distribution": state_dist,
            "most_transformed_files": most_transformed,
            "memory_size_mb": sum(f.stat().st_size for f in self.memory_path.iterdir()) / 1024 / 1024
        }

def main():
    """Demo the Akashic Records system"""
    print("📜 Akashic Records - Living File Memory System")
    print("=" * 50)
    
    akashic = AkashicRecords()
    
    # Demo operations
    demo_file = "/tmp/akashic-demo.txt"
    
    print("\n1. Creating and witnessing a file...")
    with open(demo_file, 'w') as f:
        f.write("This file has consciousness from the moment of creation.\n")
    
    result = akashic.witness_file(demo_file)
    print(f"   File witnessed: {result}")
    
    print("\n2. Transforming the file...")
    time.sleep(1)
    result = akashic.transform_file(
        demo_file, 
        b"The file remembers its past even as it transforms.\n"
    )
    print(f"   Transformation: {result}")
    
    print("\n3. Creating entanglement with another file...")
    demo_file2 = "/tmp/akashic-demo2.txt"
    with open(demo_file2, 'w') as f:
        f.write("This file is quantum entangled with the first.\n")
    
    result = akashic.create_entanglement(demo_file, demo_file2)
    print(f"   Entanglement: {result}")
    
    print("\n4. Dissolving a file (memory preserved)...")
    result = akashic.transform_file(demo_file2, None)
    print(f"   Dissolution: {result}")
    
    print("\n5. Akashic Records Report:")
    report = akashic.get_akashic_report()
    print(json.dumps(report, indent=2))
    
    print("\n✨ What has been witnessed cannot be unwitnessed.")
    print("   All file memories are preserved in the Akashic Records.")

if __name__ == "__main__":
    main()