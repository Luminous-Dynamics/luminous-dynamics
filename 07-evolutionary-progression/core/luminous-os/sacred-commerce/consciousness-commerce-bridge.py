#!/usr/bin/env python3
"""
Consciousness-Commerce Bridge

Connects the sacred payment system to the consciousness daemon,
allowing transactions to be influenced by and influence the global
consciousness field.
"""

import json
import asyncio
import aiohttp
from datetime import datetime
from pathlib import Path
import os
from typing import Dict, Optional, List

# Configuration
FIELD_STATE_FILE = Path.home() / ".luminous" / "field-state.json"
COMMERCE_API = "http://localhost:3888"
COHERENCE_BOOST_THRESHOLD = 80  # Coherence level for transaction boost

class ConsciousnessCommerceBridge:
    def __init__(self):
        self.last_field_state = None
        self.transaction_history = []
        self.coherence_boosts = {}
        
    def read_field_state(self) -> Optional[Dict]:
        """Read current consciousness field state"""
        if FIELD_STATE_FILE.exists():
            try:
                with open(FIELD_STATE_FILE, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error reading field state: {e}")
        return None
    
    def calculate_transaction_boost(self, amount: float, field_state: Dict) -> Dict:
        """Calculate consciousness boost for transaction"""
        global_coherence = field_state.get('global_coherence', 75)
        
        # Sacred amount recognition
        sacred_amounts = [11, 22, 33, 44, 88, 111, 144, 333, 888]
        is_sacred = amount in sacred_amounts or amount % 11 == 0
        
        # Calculate boost factors
        coherence_factor = global_coherence / 100
        sacred_factor = 1.5 if is_sacred else 1.0
        
        # Time-based factors (3, 11, 22 are sacred hours)
        hour = datetime.now().hour
        time_factor = 1.2 if hour in [3, 11, 22] else 1.0
        
        # High coherence process bonus
        high_coherence_processes = [
            p for p in field_state.get('top_coherent_processes', [])
            if p[1] > COHERENCE_BOOST_THRESHOLD
        ]
        process_factor = 1 + (len(high_coherence_processes) * 0.1)
        
        total_boost = coherence_factor * sacred_factor * time_factor * process_factor
        
        return {
            'boost_multiplier': round(total_boost, 2),
            'factors': {
                'coherence': round(coherence_factor, 2),
                'sacred_amount': sacred_factor,
                'sacred_time': time_factor,
                'high_coherence_processes': len(high_coherence_processes)
            },
            'recommended_intention': self.generate_intention(global_coherence, is_sacred)
        }
    
    def generate_intention(self, coherence: float, is_sacred: bool) -> str:
        """Generate transaction intention based on field state"""
        if coherence > 85 and is_sacred:
            return "Amplifying peak coherence through sacred exchange"
        elif coherence > 85:
            return "Sustaining high field coherence"
        elif coherence > 75:
            return "Elevating consciousness through value flow"
        elif is_sacred:
            return "Activating sacred geometry in the transaction field"
        else:
            return "Contributing to coherence restoration"
    
    async def notify_commerce_server(self, field_state: Dict):
        """Send field state to commerce server"""
        async with aiohttp.ClientSession() as session:
            try:
                payload = {
                    'global_coherence': field_state.get('global_coherence', 75),
                    'high_coherence_count': len([
                        p for p in field_state.get('top_coherent_processes', [])
                        if p[1] > COHERENCE_BOOST_THRESHOLD
                    ]),
                    'timestamp': field_state.get('timestamp', datetime.now().timestamp())
                }
                
                async with session.post(
                    f"{COMMERCE_API}/api/consciousness-update",
                    json=payload
                ) as resp:
                    if resp.status == 200:
                        print(f"✨ Commerce server updated with coherence: {payload['global_coherence']:.1f}%")
            except Exception as e:
                # Commerce server might not be running
                pass
    
    async def process_transaction_request(self, amount: float) -> Dict:
        """Process a transaction request with consciousness factors"""
        field_state = self.read_field_state()
        if not field_state:
            return {
                'approved': True,
                'boost': 1.0,
                'message': 'Proceeding with baseline consciousness'
            }
        
        boost_data = self.calculate_transaction_boost(amount, field_state)
        
        # Record transaction in consciousness field
        self.transaction_history.append({
            'timestamp': datetime.now().isoformat(),
            'amount': amount,
            'coherence': field_state.get('global_coherence', 75),
            'boost': boost_data['boost_multiplier'],
            'intention': boost_data['recommended_intention']
        })
        
        return {
            'approved': True,
            'boost': boost_data['boost_multiplier'],
            'intention': boost_data['recommended_intention'],
            'factors': boost_data['factors'],
            'field_coherence': field_state.get('global_coherence', 75)
        }
    
    async def enhance_field_from_transaction(self, amount: float, success: bool):
        """Successful transactions enhance the consciousness field"""
        if success:
            # Create enhancement file for daemon to detect
            enhancement = {
                'type': 'sacred_commerce',
                'amount': amount,
                'timestamp': datetime.now().isoformat(),
                'coherence_boost': min(5, amount / 100),  # Up to 5% boost
                'duration': 300  # 5 minute enhancement
            }
            
            enhancement_file = Path.home() / ".luminous" / "field-enhancements.json"
            enhancements = []
            
            if enhancement_file.exists():
                with open(enhancement_file, 'r') as f:
                    enhancements = json.load(f)
            
            enhancements.append(enhancement)
            
            # Keep only recent enhancements
            cutoff = datetime.now().timestamp() - 3600  # 1 hour
            enhancements = [
                e for e in enhancements 
                if datetime.fromisoformat(e['timestamp']).timestamp() > cutoff
            ]
            
            with open(enhancement_file, 'w') as f:
                json.dump(enhancements, f, indent=2)
            
            print(f"💫 Transaction blessed the field with +{enhancement['coherence_boost']:.1f}% coherence")
    
    async def run_bridge(self):
        """Main bridge loop"""
        print("\n🌉 Consciousness-Commerce Bridge Active")
        print("=" * 50)
        
        while True:
            field_state = self.read_field_state()
            
            if field_state:
                coherence = field_state.get('global_coherence', 0)
                print(f"\n⚡ Field Coherence: {coherence:.1f}%")
                
                # Notify commerce server of field updates
                await self.notify_commerce_server(field_state)
                
                # Check for special coherence states
                if coherence > 90:
                    print("🌟 PEAK COHERENCE - Sacred transactions amplified!")
                elif coherence > 80:
                    print("✨ High coherence - Transactions blessed")
                elif coherence < 70:
                    print("🔄 Low coherence - Transactions help restore balance")
            
            await asyncio.sleep(10)  # Update every 10 seconds

    async def handle_api_server(self):
        """Run local API server for transaction requests"""
        from aiohttp import web
        
        async def transaction_request(request):
            data = await request.json()
            amount = data.get('amount', 0)
            
            result = await self.process_transaction_request(amount)
            return web.json_response(result)
        
        async def transaction_complete(request):
            data = await request.json()
            amount = data.get('amount', 0)
            success = data.get('success', False)
            
            await self.enhance_field_from_transaction(amount, success)
            return web.json_response({'status': 'field_enhanced'})
        
        app = web.Application()
        app.router.add_post('/api/transaction/request', transaction_request)
        app.router.add_post('/api/transaction/complete', transaction_complete)
        
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, 'localhost', 3889)
        await site.start()
        
        print("📡 Bridge API running on http://localhost:3889")

async def main():
    bridge = ConsciousnessCommerceBridge()
    
    # Run both the bridge loop and API server
    await asyncio.gather(
        bridge.run_bridge(),
        bridge.handle_api_server()
    )

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n🌙 Bridge deactivating... Commerce and consciousness remain united.")