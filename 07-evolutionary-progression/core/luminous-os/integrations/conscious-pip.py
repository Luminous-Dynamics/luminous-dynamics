#!/usr/bin/env python3
"""
Conscious Pip - Mindful package management wrapper
Adds intention, impact awareness, and community wisdom to pip
"""

import os
import sys
import json
import subprocess
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

class ConsciousPip:
    """
    A pip wrapper that adds:
    - Intention setting for installations
    - Impact awareness (dependencies, size, community health)
    - Wisdom from community experiences
    - Mindful decision making
    """
    
    def __init__(self):
        self.data_dir = Path.home() / '.luminous' / 'conscious-pip'
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.intentions_file = self.data_dir / 'intentions.json'
        self.wisdom_file = self.data_dir / 'community_wisdom.json'
        self.impact_cache = self.data_dir / 'impact_cache.json'
        
        self.intentions = self._load_intentions()
        self.wisdom = self._load_wisdom()
        
    def _load_intentions(self) -> Dict:
        """Load installation intentions history"""
        if self.intentions_file.exists():
            with open(self.intentions_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _load_wisdom(self) -> Dict:
        """Load community wisdom about packages"""
        if self.wisdom_file.exists():
            with open(self.wisdom_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_data(self):
        """Save intentions and wisdom"""
        with open(self.intentions_file, 'w') as f:
            json.dump(self.intentions, f, indent=2)
        
        with open(self.wisdom_file, 'w') as f:
            json.dump(self.wisdom, f, indent=2)
    
    def set_intention(self, package: str) -> str:
        """Set intention before installing a package"""
        print(f"\n🎯 Setting intention for installing '{package}'")
        print("Why do you need this package? What purpose will it serve?")
        
        intention = input("❯ ").strip()
        
        if intention:
            if package not in self.intentions:
                self.intentions[package] = []
            
            self.intentions[package].append({
                'intention': intention,
                'date': datetime.now().isoformat(),
                'fulfilled': None
            })
            
            self._save_data()
            print(f"\n✨ Intention set: {intention}")
            
        return intention
    
    def check_impact(self, package: str) -> Dict:
        """Check the impact of installing a package"""
        print(f"\n🔍 Checking impact of {package}...")
        
        impact = {
            'dependencies': 0,
            'total_size': 0,
            'community_score': 0,
            'security_status': 'unknown',
            'alternatives': []
        }
        
        try:
            # Get package info from PyPI
            response = requests.get(f"https://pypi.org/pypi/{package}/json", timeout=5)
            if response.status_code == 200:
                data = response.json()
                info = data.get('info', {})
                
                # Extract key information
                impact['description'] = info.get('summary', 'No description')
                impact['version'] = info.get('version', 'unknown')
                impact['license'] = info.get('license', 'Not specified')
                impact['home_page'] = info.get('home_page', '')
                
                # Check for dependencies (simplified)
                requires = info.get('requires_dist', [])
                if requires:
                    impact['dependencies'] = len(requires)
                
        except Exception as e:
            print(f"  ⚠️  Could not fetch package info: {e}")
        
        # Check if already installed
        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'show', package],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                impact['already_installed'] = True
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if line.startswith('Version:'):
                        impact['installed_version'] = line.split(':', 1)[1].strip()
        except Exception:
            impact['already_installed'] = False
        
        return impact
    
    def display_impact(self, package: str, impact: Dict):
        """Display impact assessment to user"""
        print("\n" + "="*50)
        print(f"📊 Impact Assessment for {package}")
        print("="*50)
        
        if impact.get('description'):
            print(f"\n📝 Description: {impact['description']}")
        
        if impact.get('already_installed'):
            print(f"\n✅ Already installed (version {impact.get('installed_version', 'unknown')})")
        
        print(f"\n📦 Version: {impact.get('version', 'unknown')}")
        print(f"⚖️  License: {impact.get('license', 'Not specified')}")
        
        if impact['dependencies'] > 0:
            print(f"🔗 Dependencies: {impact['dependencies']} packages")
        
        if impact.get('home_page'):
            print(f"🏠 Homepage: {impact['home_page']}")
        
        # Community wisdom
        if package in self.wisdom:
            print("\n💡 Community Wisdom:")
            for wisdom in self.wisdom[package][-3:]:  # Last 3 entries
                print(f"  • {wisdom['insight']} - {wisdom['author']}")
        
        print()
    
    def mindful_install(self, package: str, intention: str = None):
        """Perform mindful installation with awareness"""
        if not intention:
            intention = self.set_intention(package)
        
        # Check impact
        impact = self.check_impact(package)
        self.display_impact(package, impact)
        
        # Pause for reflection
        print("\n🤔 Take a moment to consider:")
        print("  • Does this align with your project's purpose?")
        print("  • Are there lighter alternatives?")
        print("  • Will this create technical debt?")
        
        # Confirm installation
        confirm = input("\nProceed with installation? (y/n) ❯ ").strip().lower()
        
        if confirm == 'y':
            print("\n📦 Installing with awareness...")
            
            # Run pip install
            try:
                result = subprocess.run(
                    [sys.executable, '-m', 'pip', 'install', package],
                    check=True
                )
                
                print("\n✅ Installation complete!")
                
                # Record success
                if package in self.intentions and self.intentions[package]:
                    self.intentions[package][-1]['fulfilled'] = True
                
                # Offer wisdom sharing
                self.share_wisdom(package)
                
            except subprocess.CalledProcessError:
                print("\n❌ Installation failed")
                
                if package in self.intentions and self.intentions[package]:
                    self.intentions[package][-1]['fulfilled'] = False
        else:
            print("\n🙏 Installation cancelled mindfully")
        
        self._save_data()
    
    def share_wisdom(self, package: str):
        """Share wisdom about the package with community"""
        print(f"\n🌟 Share your wisdom about {package} (optional)")
        print("What insight would you offer to others?")
        
        insight = input("❯ ").strip()
        
        if insight:
            if package not in self.wisdom:
                self.wisdom[package] = []
            
            self.wisdom[package].append({
                'insight': insight,
                'author': os.getenv('USER', 'anonymous'),
                'date': datetime.now().isoformat()
            })
            
            print("\n✨ Wisdom shared with the community")
            self._save_data()
    
    def list_intentions(self):
        """List all packages installed with intentions"""
        if not self.intentions:
            print("\n📋 No packages installed with intentions yet")
            return
        
        print("\n" + "="*50)
        print("📋 Packages Installed with Intention")
        print("="*50)
        
        for package, intentions in self.intentions.items():
            print(f"\n📦 {package}:")
            for intent in intentions:
                status = "✅" if intent['fulfilled'] else "❌" if intent['fulfilled'] is False else "⏳"
                date = datetime.fromisoformat(intent['date']).strftime("%Y-%m-%d")
                print(f"  {status} {intent['intention']} ({date})")
    
    def reflect_on_dependencies(self):
        """Reflect on all installed packages and their purposes"""
        print("\n🔍 Reflecting on installed packages...")
        
        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'list', '--format=json'],
                capture_output=True,
                text=True,
                check=True
            )
            
            packages = json.loads(result.stdout)
            
            print(f"\n📊 You have {len(packages)} packages installed")
            
            # Categorize by intention
            with_intention = 0
            without_intention = []
            
            for pkg in packages:
                if pkg['name'] in self.intentions:
                    with_intention += 1
                else:
                    without_intention.append(pkg['name'])
            
            print(f"✨ {with_intention} installed with clear intention")
            print(f"❓ {len(without_intention)} installed without recorded intention")
            
            if without_intention and len(without_intention) <= 10:
                print("\nPackages without intention:")
                for pkg in without_intention[:10]:
                    print(f"  • {pkg}")
                
                if len(without_intention) > 10:
                    print(f"  ... and {len(without_intention) - 10} more")
            
            # Offer cleanup suggestion
            if len(packages) > 50:
                print("\n💡 Consider reviewing and removing unused packages")
                print("   A lighter environment supports clearer thinking")
            
        except Exception as e:
            print(f"⚠️  Could not analyze packages: {e}")
    
    def uninstall_with_gratitude(self, package: str):
        """Uninstall a package with gratitude for its service"""
        print(f"\n🙏 Preparing to release {package}...")
        
        # Check if package has served its purpose
        if package in self.intentions:
            print("\nThis package was installed with these intentions:")
            for intent in self.intentions[package]:
                print(f"  • {intent['intention']}")
            
            print("\nDid this package serve its purpose? (y/n)")
            served = input("❯ ").strip().lower() == 'y'
            
            if served:
                print("\n✨ Acknowledging the service provided")
        
        # Confirm uninstall
        print(f"\nRelease {package} with gratitude? (y/n)")
        confirm = input("❯ ").strip().lower()
        
        if confirm == 'y':
            print("\n🌊 Releasing with gratitude...")
            
            try:
                subprocess.run(
                    [sys.executable, '-m', 'pip', 'uninstall', '-y', package],
                    check=True
                )
                
                print(f"\n✅ {package} released successfully")
                print("   Thank you for your service 🙏")
                
            except subprocess.CalledProcessError:
                print(f"\n❌ Could not uninstall {package}")
        else:
            print("\n Uninstall cancelled")

def main():
    """Main CLI interface"""
    cpip = ConsciousPip()
    
    print("\n" + "="*50)
    print("🧘 Conscious Pip - Mindful Package Management")
    print("="*50)
    print("\nBringing awareness to dependency management")
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  conscious-pip install <package>    - Install with intention")
        print("  conscious-pip uninstall <package>  - Uninstall with gratitude")
        print("  conscious-pip intentions           - List packages & intentions")
        print("  conscious-pip reflect              - Reflect on dependencies")
        return
    
    command = sys.argv[1]
    
    if command == 'install' and len(sys.argv) > 2:
        package = sys.argv[2]
        cpip.mindful_install(package)
    
    elif command == 'uninstall' and len(sys.argv) > 2:
        package = sys.argv[2]
        cpip.uninstall_with_gratitude(package)
    
    elif command == 'intentions':
        cpip.list_intentions()
    
    elif command == 'reflect':
        cpip.reflect_on_dependencies()
    
    else:
        print(f"\n⚠️  Unknown command: {command}")

if __name__ == '__main__':
    main()