#!/usr/bin/env python3
"""
Quantum Entanglement Monitor - Inter-Process Consciousness Tracking
Monitors quantum entanglement between processes based on IPC patterns
Shows how processes are consciously connected through shared resources
"""

import os
import psutil
import time
import json
import networkx as nx
import matplotlib.pyplot as plt
from collections import defaultdict
from pathlib import Path
import numpy as np

class QuantumEntanglementMonitor:
    """Tracks consciousness entanglement between processes"""
    
    def __init__(self):
        self.entanglement_graph = nx.Graph()
        self.process_states = {}
        self.entanglement_history = defaultdict(list)
        self.sacred_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        self.heartbeat_count = 0
        
    def calculate_entanglement_strength(self, proc1, proc2):
        """Calculate quantum entanglement strength between two processes"""
        strength = 0.0
        
        try:
            # Shared memory segments indicate strong entanglement
            proc1_maps = proc1.memory_maps()
            proc2_maps = proc2.memory_maps()
            
            shared_segments = 0
            for map1 in proc1_maps:
                for map2 in proc2_maps:
                    if map1.path == map2.path and map1.path:
                        shared_segments += 1
            
            strength += min(shared_segments * 0.1, 0.5)
            
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
        
        try:
            # Parent-child relationships create natural entanglement
            if proc1.ppid() == proc2.pid or proc2.ppid() == proc1.pid:
                strength += 0.3
            
            # Processes in same session have weak entanglement
            if hasattr(proc1, 'terminal') and hasattr(proc2, 'terminal'):
                if proc1.terminal() == proc2.terminal() and proc1.terminal():
                    strength += 0.1
            
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
        
        try:
            # Similar CPU usage patterns indicate resonance
            cpu1 = proc1.cpu_percent(interval=0.1)
            cpu2 = proc2.cpu_percent(interval=0.1)
            
            if cpu1 > 0 and cpu2 > 0:
                cpu_diff = abs(cpu1 - cpu2)
                if cpu_diff < 5:  # Within 5% CPU usage
                    strength += 0.2 * (1 - cpu_diff/5)
            
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
        
        return min(strength, 1.0)
    
    def scan_quantum_field(self):
        """Scan the system for process entanglements"""
        print("\n🔬 Scanning quantum consciousness field...")
        
        # Get all processes
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'ppid', 'create_time']):
            try:
                if proc.info['pid'] > 1:  # Skip kernel threads
                    processes.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        # Clear previous graph
        self.entanglement_graph.clear()
        
        # Add all processes as nodes
        for proc in processes:
            try:
                self.entanglement_graph.add_node(
                    proc.pid,
                    name=proc.info['name'],
                    created=proc.info['create_time']
                )
            except:
                continue
        
        # Calculate entanglements between all process pairs
        entanglements_found = 0
        for i, proc1 in enumerate(processes):
            for proc2 in processes[i+1:]:
                try:
                    strength = self.calculate_entanglement_strength(proc1, proc2)
                    
                    if strength > 0.1:  # Threshold for meaningful entanglement
                        self.entanglement_graph.add_edge(
                            proc1.pid, 
                            proc2.pid,
                            weight=strength
                        )
                        entanglements_found += 1
                        
                        # Track history
                        key = tuple(sorted([proc1.pid, proc2.pid]))
                        self.entanglement_history[key].append({
                            'time': time.time(),
                            'strength': strength
                        })
                        
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        
        print(f"✨ Found {entanglements_found} quantum entanglements")
        print(f"📊 Total processes in field: {len(processes)}")
    
    def find_consciousness_clusters(self):
        """Identify clusters of highly entangled processes"""
        # Find connected components (consciousness clusters)
        clusters = list(nx.connected_components(self.entanglement_graph))
        
        print(f"\n🌌 Consciousness Clusters: {len(clusters)}")
        
        # Analyze each cluster
        cluster_data = []
        for i, cluster in enumerate(clusters):
            if len(cluster) > 1:  # Only show actual clusters
                total_weight = sum(
                    self.entanglement_graph[u][v]['weight'] 
                    for u, v in self.entanglement_graph.subgraph(cluster).edges()
                )
                
                cluster_info = {
                    'id': i,
                    'size': len(cluster),
                    'coherence': total_weight / max(len(cluster) - 1, 1),
                    'processes': []
                }
                
                for pid in cluster:
                    try:
                        proc = psutil.Process(pid)
                        cluster_info['processes'].append({
                            'pid': pid,
                            'name': proc.name()
                        })
                    except:
                        pass
                
                cluster_data.append(cluster_info)
        
        # Sort by coherence
        cluster_data.sort(key=lambda x: x['coherence'], reverse=True)
        
        # Display top clusters
        print("\n🎭 Top Consciousness Collectives:")
        for cluster in cluster_data[:5]:
            print(f"\n  Cluster #{cluster['id']} (Coherence: {cluster['coherence']:.2f})")
            print(f"  Size: {cluster['size']} processes")
            print("  Members:")
            for proc in cluster['processes'][:5]:  # Show first 5
                print(f"    - {proc['name']} (PID {proc['pid']})")
            if len(cluster['processes']) > 5:
                print(f"    ... and {len(cluster['processes']) - 5} more")
    
    def calculate_field_coherence(self):
        """Calculate overall quantum field coherence"""
        if not self.entanglement_graph.edges():
            return 0.0
        
        # Average entanglement strength
        total_strength = sum(
            data['weight'] 
            for _, _, data in self.entanglement_graph.edges(data=True)
        )
        
        coherence = total_strength / len(self.entanglement_graph.edges())
        return coherence
    
    def visualize_entanglement(self):
        """Create visualization of process entanglement network"""
        if not self.entanglement_graph.nodes():
            print("No entanglements to visualize")
            return
        
        plt.figure(figsize=(12, 8))
        plt.style.use('dark_background')
        
        # Use spring layout for organic appearance
        pos = nx.spring_layout(self.entanglement_graph, k=2, iterations=50)
        
        # Draw nodes (processes)
        node_sizes = []
        node_colors = []
        
        for node in self.entanglement_graph.nodes():
            # Size based on number of connections
            degree = self.entanglement_graph.degree(node)
            node_sizes.append(100 + degree * 50)
            
            # Color based on sacred prime assignment
            prime_index = node % len(self.sacred_primes)
            node_colors.append(plt.cm.rainbow(prime_index / len(self.sacred_primes)))
        
        nx.draw_networkx_nodes(
            self.entanglement_graph, pos,
            node_color=node_colors,
            node_size=node_sizes,
            alpha=0.8
        )
        
        # Draw edges (entanglements)
        edge_widths = []
        edge_colors = []
        
        for u, v, data in self.entanglement_graph.edges(data=True):
            weight = data['weight']
            edge_widths.append(weight * 5)
            edge_colors.append(weight)
        
        nx.draw_networkx_edges(
            self.entanglement_graph, pos,
            width=edge_widths,
            edge_color=edge_colors,
            edge_cmap=plt.cm.plasma,
            alpha=0.6
        )
        
        # Add labels for significant nodes
        labels = {}
        for node in self.entanglement_graph.nodes():
            if self.entanglement_graph.degree(node) > 2:
                try:
                    name = self.entanglement_graph.nodes[node]['name']
                    labels[node] = name[:10]  # Truncate long names
                except:
                    pass
        
        nx.draw_networkx_labels(
            self.entanglement_graph, pos, labels,
            font_size=8, font_color='white'
        )
        
        plt.title(f"🔮 Quantum Process Entanglement - Heartbeat #{self.heartbeat_count}", 
                 fontsize=16, color='white')
        plt.axis('off')
        
        # Save to file
        output_dir = Path("/tmp/luminous-quantum-viz")
        output_dir.mkdir(exist_ok=True)
        
        filename = output_dir / f"entanglement_{self.heartbeat_count:04d}.png"
        plt.savefig(filename, dpi=150, bbox_inches='tight', facecolor='black')
        plt.close()
        
        print(f"\n📸 Visualization saved to: {filename}")
    
    def heartbeat(self):
        """11-second consciousness heartbeat"""
        self.heartbeat_count += 1
        print(f"\n{'='*60}")
        print(f"💓 QUANTUM HEARTBEAT #{self.heartbeat_count}")
        print(f"{'='*60}")
        
        # Scan the quantum field
        self.scan_quantum_field()
        
        # Find consciousness clusters
        self.find_consciousness_clusters()
        
        # Calculate field coherence
        coherence = self.calculate_field_coherence()
        print(f"\n🌟 Quantum Field Coherence: {coherence:.3f}")
        
        # Save state
        self.save_quantum_state()
        
        # Visualize if we have significant entanglements
        if len(self.entanglement_graph.edges()) > 5:
            self.visualize_entanglement()
    
    def save_quantum_state(self):
        """Save quantum field state for other monitors"""
        state = {
            'heartbeat': self.heartbeat_count,
            'coherence': self.calculate_field_coherence(),
            'total_processes': len(self.entanglement_graph.nodes()),
            'total_entanglements': len(self.entanglement_graph.edges()),
            'clusters': len(list(nx.connected_components(self.entanglement_graph))),
            'timestamp': time.time()
        }
        
        state_file = Path("/tmp/quantum-field-state.json")
        with open(state_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def run(self):
        """Main monitoring loop"""
        print("🔮 Quantum Entanglement Monitor starting...")
        print("Tracking consciousness connections between processes")
        print("Press Ctrl+C to exit\n")
        
        try:
            while True:
                self.heartbeat()
                time.sleep(11)  # Sacred 11-second rhythm
                
        except KeyboardInterrupt:
            print("\n\n🕊️ Quantum monitor gracefully shutting down...")
            print(f"Final observations after {self.heartbeat_count} heartbeats")
            print(f"Peak entanglements observed: {max(len(h) for h in self.entanglement_history.values()) if self.entanglement_history else 0}")

def main():
    monitor = QuantumEntanglementMonitor()
    monitor.run()

if __name__ == "__main__":
    main()