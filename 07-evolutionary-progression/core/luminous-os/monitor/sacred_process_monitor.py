#!/usr/bin/env python3
"""
Sacred Process Monitor - A mindful approach to system monitoring
Provides real wellness metrics for digital health
"""

import psutil
import time
import json
import argparse
from datetime import datetime, timedelta
from collections import defaultdict, deque
import os
import signal
import sys

class SacredProcessMonitor:
    """Monitor system processes with focus on digital wellness"""
    
    def __init__(self, history_minutes=5):
        self.history_minutes = history_minutes
        self.process_history = defaultdict(lambda: deque(maxlen=60 * history_minutes))
        self.context_switches = deque(maxlen=100)
        self.last_active_window = None
        self.focus_sessions = []
        self.current_focus_start = None
        self.interruption_count = 0
        self.last_check = time.time()
        
        # Wellness thresholds
        self.HEALTHY_CPU_PERCENT = 50
        self.HEALTHY_MEMORY_PERCENT = 70
        self.MIN_FOCUS_DURATION = 300  # 5 minutes
        self.CONTEXT_SWITCH_THRESHOLD = 10  # per minute
        
    def get_process_metrics(self):
        """Get detailed metrics for all processes"""
        processes = []
        total_cpu = 0
        total_memory = 0
        
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 
                                       'create_time', 'num_threads', 'status']):
            try:
                info = proc.info
                cpu = info['cpu_percent']
                memory = info['memory_percent']
                
                # Track history
                self.process_history[info['pid']].append({
                    'timestamp': time.time(),
                    'cpu': cpu,
                    'memory': memory
                })
                
                # Calculate process lifetime
                lifetime = time.time() - info['create_time']
                
                # Determine process category
                category = self._categorize_process(info['name'])
                
                # Calculate focus impact
                focus_impact = self._calculate_focus_impact(info['name'], cpu)
                
                processes.append({
                    'pid': info['pid'],
                    'name': info['name'],
                    'cpu_percent': cpu,
                    'memory_percent': memory,
                    'lifetime_hours': lifetime / 3600,
                    'category': category,
                    'focus_impact': focus_impact,
                    'threads': info['num_threads'],
                    'status': info['status']
                })
                
                total_cpu += cpu
                total_memory += memory
                
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
                
        return {
            'processes': sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:20],
            'total_cpu': total_cpu,
            'total_memory': total_memory,
            'process_count': len(processes)
        }
    
    def _categorize_process(self, name):
        """Categorize process by actual function"""
        name_lower = name.lower()
        
        # Productivity tools
        if any(tool in name_lower for tool in ['code', 'vim', 'emacs', 'idea', 'sublime']):
            return 'development'
        elif any(tool in name_lower for tool in ['slack', 'teams', 'zoom', 'discord']):
            return 'communication'
        elif any(tool in name_lower for tool in ['chrome', 'firefox', 'safari', 'edge']):
            return 'browser'
        elif any(tool in name_lower for tool in ['spotify', 'vlc', 'mpv']):
            return 'media'
        elif any(tool in name_lower for tool in ['docker', 'kubectl', 'terraform']):
            return 'infrastructure'
        elif name_lower.startswith(('kernel', 'systemd', 'init')):
            return 'system'
        else:
            return 'other'
    
    def _calculate_focus_impact(self, process_name, cpu_percent):
        """Calculate how much a process impacts focus"""
        # High CPU processes in background can be distracting
        if cpu_percent > 50:
            return 'high'
        elif cpu_percent > 20:
            return 'medium'
        else:
            return 'low'
    
    def calculate_wellness_metrics(self):
        """Calculate real wellness metrics for digital health"""
        metrics = {}
        
        # 1. System Load Health
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        
        metrics['system_health'] = {
            'cpu_health': max(0, 100 - cpu_percent),  # Lower is healthier
            'memory_health': max(0, 100 - memory.percent),
            'overall': (max(0, 100 - cpu_percent) + max(0, 100 - memory.percent)) / 2
        }
        
        # 2. Focus Metrics
        current_time = time.time()
        time_since_last = current_time - self.last_check
        
        # Detect context switches (simplified - in real app would track window focus)
        recent_switches = len([s for s in self.context_switches 
                              if current_time - s < 60])
        
        metrics['focus_health'] = {
            'context_switches_per_minute': recent_switches,
            'focus_score': max(0, 100 - (recent_switches * 10)),  # Fewer switches = better
            'current_session_minutes': (current_time - self.current_focus_start) / 60 
                                     if self.current_focus_start else 0
        }
        
        # 3. Process Diversity (avoid mono-tasking)
        process_categories = defaultdict(int)
        for proc in psutil.process_iter(['name']):
            try:
                category = self._categorize_process(proc.info['name'])
                process_categories[category] += 1
            except:
                continue
                
        metrics['diversity_health'] = {
            'category_count': len(process_categories),
            'diversity_score': min(100, len(process_categories) * 20),  # More diversity = better
            'dominant_category': max(process_categories.items(), key=lambda x: x[1])[0] 
                               if process_categories else 'none'
        }
        
        # 4. Resource Balance
        top_consumers = []
        for proc in psutil.process_iter(['name', 'cpu_percent', 'memory_percent']):
            try:
                if proc.info['cpu_percent'] > 10:
                    top_consumers.append(proc.info)
            except:
                continue
                
        metrics['resource_balance'] = {
            'heavy_processes': len(top_consumers),
            'balance_score': max(0, 100 - (len(top_consumers) * 20)),
            'top_consumer': top_consumers[0]['name'] if top_consumers else 'none'
        }
        
        # 5. Digital Wellness Score (0-100)
        wellness_score = (
            metrics['system_health']['overall'] * 0.25 +
            metrics['focus_health']['focus_score'] * 0.35 +
            metrics['diversity_health']['diversity_score'] * 0.20 +
            metrics['resource_balance']['balance_score'] * 0.20
        )
        
        metrics['wellness_score'] = round(wellness_score, 1)
        metrics['wellness_level'] = self._get_wellness_level(wellness_score)
        metrics['recommendations'] = self._get_recommendations(metrics)
        
        self.last_check = current_time
        return metrics
    
    def _get_wellness_level(self, score):
        """Convert score to wellness level"""
        if score >= 80:
            return 'excellent'
        elif score >= 60:
            return 'good'
        elif score >= 40:
            return 'fair'
        else:
            return 'needs attention'
    
    def _get_recommendations(self, metrics):
        """Provide actionable recommendations"""
        recommendations = []
        
        if metrics['system_health']['cpu_health'] < 50:
            recommendations.append("High CPU usage detected. Consider closing unused applications.")
            
        if metrics['focus_health']['context_switches_per_minute'] > 10:
            recommendations.append("Frequent context switching. Try focusing on one task at a time.")
            
        if metrics['diversity_health']['diversity_score'] < 40:
            recommendations.append("Limited process diversity. Consider taking a break or switching activities.")
            
        if metrics['resource_balance']['heavy_processes'] > 3:
            recommendations.append("Multiple resource-heavy processes. Check for runaway processes.")
            
        if not recommendations:
            recommendations.append("System wellness is good! Keep up the mindful computing.")
            
        return recommendations
    
    def display_metrics(self, show_processes=True):
        """Display metrics in a beautiful format"""
        # Clear screen
        os.system('clear' if os.name == 'posix' else 'cls')
        
        # Get metrics
        wellness = self.calculate_wellness_metrics()
        process_data = self.get_process_metrics() if show_processes else None
        
        # Header
        print("=" * 80)
        print(" " * 20 + "✨ Sacred Process Monitor ✨")
        print(" " * 15 + f"Digital Wellness Score: {wellness['wellness_score']}% "
              f"({wellness['wellness_level'].upper()})")
        print("=" * 80)
        
        # System Health
        print("\n📊 System Health:")
        print(f"  CPU Health:    {self._health_bar(wellness['system_health']['cpu_health'])}")
        print(f"  Memory Health: {self._health_bar(wellness['system_health']['memory_health'])}")
        
        # Focus Health  
        print("\n🎯 Focus Health:")
        print(f"  Focus Score: {self._health_bar(wellness['focus_health']['focus_score'])}")
        print(f"  Context Switches: {wellness['focus_health']['context_switches_per_minute']}/min")
        print(f"  Current Session: {wellness['focus_health']['current_session_minutes']:.1f} minutes")
        
        # Process Diversity
        print("\n🌈 Process Diversity:")
        print(f"  Diversity Score: {self._health_bar(wellness['diversity_health']['diversity_score'])}")
        print(f"  Active Categories: {wellness['diversity_health']['category_count']}")
        print(f"  Dominant: {wellness['diversity_health']['dominant_category']}")
        
        # Recommendations
        print("\n💡 Recommendations:")
        for rec in wellness['recommendations']:
            print(f"  • {rec}")
        
        # Top Processes
        if show_processes and process_data:
            print("\n🔄 Top Processes:")
            print(f"{'Process':<30} {'Category':<15} {'CPU%':<8} {'Memory%':<10} {'Focus Impact'}")
            print("-" * 80)
            for proc in process_data['processes'][:10]:
                print(f"{proc['name'][:29]:<30} {proc['category']:<15} "
                      f"{proc['cpu_percent']:<8.1f} {proc['memory_percent']:<10.1f} "
                      f"{proc['focus_impact']}")
        
        print("\n" + "=" * 80)
        print("Press Ctrl+C to exit | Updates every 5 seconds")
    
    def _health_bar(self, percentage):
        """Create visual health bar"""
        filled = int(percentage / 5)
        bar = "█" * filled + "░" * (20 - filled)
        color = "\033[92m" if percentage >= 70 else "\033[93m" if percentage >= 40 else "\033[91m"
        return f"{color}{bar}\033[0m {percentage:.0f}%"
    
    def run(self, interval=5):
        """Run the monitor continuously"""
        def signal_handler(sig, frame):
            print("\n\n🙏 Thank you for mindful monitoring. Namaste! 🙏\n")
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        
        while True:
            self.display_metrics()
            time.sleep(interval)
    
    def export_metrics(self, filename):
        """Export metrics to JSON"""
        metrics = {
            'timestamp': datetime.now().isoformat(),
            'wellness': self.calculate_wellness_metrics(),
            'processes': self.get_process_metrics()
        }
        
        with open(filename, 'w') as f:
            json.dump(metrics, f, indent=2)
        
        return filename


def main():
    parser = argparse.ArgumentParser(description='Sacred Process Monitor - Mindful System Monitoring')
    parser.add_argument('--interval', type=int, default=5, help='Update interval in seconds')
    parser.add_argument('--export', type=str, help='Export metrics to JSON file')
    parser.add_argument('--no-processes', action='store_true', help='Hide process list')
    
    args = parser.parse_args()
    
    monitor = SacredProcessMonitor()
    
    if args.export:
        filename = monitor.export_metrics(args.export)
        print(f"Metrics exported to {filename}")
    else:
        monitor.run(interval=args.interval)


if __name__ == "__main__":
    main()