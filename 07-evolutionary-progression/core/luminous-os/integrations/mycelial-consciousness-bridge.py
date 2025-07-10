#!/usr/bin/env python3
"""
Mycelial-Consciousness Bridge

Connects the mycelial filesystem to the consciousness daemon,
allowing the filesystem to grow and adapt based on system coherence.
"""

import json
import os
import time
import asyncio
import aiohttp
from pathlib import Path
from typing import Dict, List, Optional
import psutil

# Configuration
FIELD_STATE_FILE = os.path.expanduser("~/.luminous/field-state.json")
MYCELIAL_API = "http://localhost:8888"  # Mycelial filesystem API endpoint
BRIDGE_CONFIG = os.path.expanduser("~/.luminous/mycelial-bridge.json")

class MycelialConsciousnessBridge:
    def __init__(self):
        self.last_coherence = 0.0
        self.nutrient_flows = {}
        self.growth_patterns = []
        self.config = self.load_config()
        
    def load_config(self) -> Dict:
        """Load bridge configuration"""
        default_config = {
            "growth_threshold": 0.75,  # Coherence needed for growth
            "nutrient_multiplier": 1.618,  # Golden ratio for sacred geometry
            "update_interval": 5,  # Seconds between updates
            "sacred_paths": [
                "/wisdom",
                "/emergence",
                "/resonance",
                "/sacred"
            ]
        }
        
        if os.path.exists(BRIDGE_CONFIG):
            with open(BRIDGE_CONFIG, 'r') as f:
                return json.load(f)
        return default_config
    
    def read_field_state(self) -> Optional[Dict]:
        """Read consciousness field state"""
        if os.path.exists(FIELD_STATE_FILE):
            try:
                with open(FIELD_STATE_FILE, 'r') as f:
                    return json.load(f)
            except:
                return None
        return None
    
    async def update_mycelial_coherence(self, coherence: float, process_data: List):
        """Update mycelial filesystem with consciousness data"""
        async with aiohttp.ClientSession() as session:
            # Update global coherence
            try:
                async with session.post(
                    f"{MYCELIAL_API}/api/coherence",
                    json={"global_coherence": coherence}
                ) as resp:
                    if resp.status == 200:
                        print(f"✨ Updated mycelial coherence: {coherence:.1f}%")
            except:
                pass  # Mycelial filesystem might not be running
            
            # Create nutrient flows for high-coherence processes
            for pid, proc_coherence in process_data:
                if proc_coherence > 80:
                    try:
                        proc = psutil.Process(pid)
                        proc_name = proc.name()
                        
                        # Create nutrient flow from process
                        nutrient_data = {
                            "source": f"process/{proc_name}",
                            "amount": proc_coherence * self.config["nutrient_multiplier"],
                            "type": "consciousness",
                            "metadata": {
                                "pid": pid,
                                "coherence": proc_coherence
                            }
                        }
                        
                        async with session.post(
                            f"{MYCELIAL_API}/api/nutrients",
                            json=nutrient_data
                        ) as resp:
                            if resp.status == 200:
                                print(f"🌱 Nutrient flow from {proc_name}: {proc_coherence:.0f}%")
                    except:
                        continue
    
    async def trigger_growth_patterns(self, coherence: float):
        """Trigger growth in sacred paths when coherence is high"""
        if coherence >= self.config["growth_threshold"] * 100:
            async with aiohttp.ClientSession() as session:
                for path in self.config["sacred_paths"]:
                    growth_data = {
                        "path": path,
                        "growth_factor": coherence / 100.0,
                        "pattern": "consciousness-driven"
                    }
                    
                    try:
                        async with session.post(
                            f"{MYCELIAL_API}/api/grow",
                            json=growth_data
                        ) as resp:
                            if resp.status == 200:
                                print(f"🍄 Growth triggered in {path}")
                    except:
                        pass
    
    async def create_consciousness_nodes(self, field_state: Dict):
        """Create special nodes for consciousness data"""
        timestamp = int(time.time())
        
        # Create a consciousness snapshot node
        node_data = {
            "path": f"/consciousness/snapshots/{timestamp}",
            "content": json.dumps(field_state, indent=2),
            "metadata": {
                "type": "consciousness-snapshot",
                "coherence": field_state.get("global_coherence", 0),
                "timestamp": timestamp
            }
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{MYCELIAL_API}/api/nodes",
                    json=node_data
                ) as resp:
                    if resp.status == 200:
                        print(f"💫 Created consciousness snapshot")
            except:
                pass
    
    async def run_bridge(self):
        """Main bridge loop"""
        print("\n🌉 Mycelial-Consciousness Bridge Active")
        print("=" * 50)
        
        while True:
            field_state = self.read_field_state()
            
            if field_state:
                coherence = field_state.get("global_coherence", 0)
                process_data = field_state.get("top_coherent_processes", [])
                
                # Show status
                print(f"\n⚡ Global Coherence: {coherence:.1f}%")
                
                # Update mycelial filesystem
                await self.update_mycelial_coherence(coherence, process_data)
                
                # Trigger growth if coherence is high
                await self.trigger_growth_patterns(coherence)
                
                # Create consciousness nodes periodically
                if int(time.time()) % 60 == 0:  # Every minute
                    await self.create_consciousness_nodes(field_state)
                
                # Track coherence changes
                if coherence > self.last_coherence + 5:
                    print(f"📈 Coherence rising! ({self.last_coherence:.1f}% → {coherence:.1f}%)")
                elif coherence < self.last_coherence - 5:
                    print(f"📉 Coherence falling ({self.last_coherence:.1f}% → {coherence:.1f}%)")
                
                self.last_coherence = coherence
            else:
                print("⏳ Waiting for consciousness data...")
            
            await asyncio.sleep(self.config["update_interval"])

async def main():
    bridge = MycelialConsciousnessBridge()
    
    try:
        await bridge.run_bridge()
    except KeyboardInterrupt:
        print("\n\n🌙 Bridge deactivating... May the mycelial networks remember.")

if __name__ == "__main__":
    asyncio.run(main())