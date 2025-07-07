#!/usr/bin/env python3
"""
Ethical Code Analyzer - Deep Consciousness Analysis for Code
Examines code through the lens of universal ethical principles
Provides guidance for transforming code toward higher consciousness
"""

import ast
import re
import json
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass
from pathlib import Path
import numpy as np

@dataclass
class EthicalInsight:
    """An ethical insight about code"""
    principle: str
    score: float
    issues: List[str]
    suggestions: List[str]
    line_numbers: List[int]

class EthicalCodeAnalyzer:
    """Deep ethical analysis of code consciousness"""
    
    def __init__(self):
        # Universal ethical principles
        self.principles = {
            'ahimsa': {
                'name': 'Non-Violence',
                'weight': 1.0,
                'description': 'Code should cause no harm to beings or systems'
            },
            'satya': {
                'name': 'Truthfulness', 
                'weight': 0.9,
                'description': 'Code should be honest and transparent in its intentions'
            },
            'asteya': {
                'name': 'Non-Stealing',
                'weight': 0.8,
                'description': 'Code should not take what is not freely given'
            },
            'brahmacharya': {
                'name': 'Right Use of Energy',
                'weight': 0.7,
                'description': 'Code should use resources wisely and sustainably'
            },
            'aparigraha': {
                'name': 'Non-Possessiveness',
                'weight': 0.6,
                'description': 'Code should not hoard or control unnecessarily'
            },
            'karuna': {
                'name': 'Compassion',
                'weight': 0.8,
                'description': 'Code should show kindness to users and systems'
            },
            'metta': {
                'name': 'Loving-Kindness',
                'weight': 0.7,
                'description': 'Code should radiate goodwill to all'
            }
        }
        
        # Consciousness patterns to detect
        self.consciousness_patterns = {
            'service_oriented': {
                'patterns': ['help', 'assist', 'support', 'serve', 'aid'],
                'boost': 0.1
            },
            'inclusive_design': {
                'patterns': ['accessible', 'universal', 'inclusive', 'for_all'],
                'boost': 0.15
            },
            'error_compassion': {
                'patterns': ['graceful', 'recover', 'fallback', 'gentle'],
                'boost': 0.1
            },
            'resource_mindful': {
                'patterns': ['efficient', 'optimize', 'conserve', 'minimal'],
                'boost': 0.05
            },
            'transparent_intent': {
                'patterns': ['# why:', '# purpose:', '# intention:', 'explain'],
                'boost': 0.1
            }
        }
        
        # Anti-patterns that reduce consciousness
        self.anti_patterns = {
            'dark_patterns': {
                'patterns': ['trick', 'force', 'manipulate', 'deceive'],
                'penalty': 0.3
            },
            'surveillance': {
                'patterns': ['track', 'monitor', 'watch', 'record'],
                'penalty': 0.2
            },
            'aggression': {
                'patterns': ['attack', 'destroy', 'kill', 'terminate'],
                'penalty': 0.25
            },
            'greed': {
                'patterns': ['hoard', 'monopolize', 'extract', 'exploit'],
                'penalty': 0.2
            },
            'opacity': {
                'patterns': ['obfuscate', 'hide', 'conceal', 'mask'],
                'penalty': 0.15
            }
        }
        
    def analyze_ethical_consciousness(self, code: str, filename: str = "unknown") -> Dict:
        """Perform deep ethical analysis of code"""
        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            return {
                'error': f'Syntax error: {e}',
                'parseable': False,
                'filename': filename
            }
        
        # Analyze each principle
        insights = {}
        for principle_key, principle_info in self.principles.items():
            insight = self._analyze_principle(code, tree, principle_key)
            insights[principle_key] = insight
        
        # Calculate overall consciousness
        overall_score = self._calculate_overall_consciousness(insights)
        
        # Detect consciousness patterns
        pattern_analysis = self._analyze_consciousness_patterns(code)
        
        # Generate transformation guidance
        transformation = self._generate_transformation_guidance(insights, overall_score)
        
        return {
            'filename': filename,
            'insights': insights,
            'overall_consciousness': overall_score,
            'consciousness_patterns': pattern_analysis,
            'transformation_guidance': transformation,
            'sacred_recommendation': self._get_sacred_recommendation(overall_score)
        }
    
    def _analyze_principle(self, code: str, tree: ast.AST, principle: str) -> EthicalInsight:
        """Analyze code against a specific ethical principle"""
        if principle == 'ahimsa':
            return self._analyze_ahimsa(code, tree)
        elif principle == 'satya':
            return self._analyze_satya(code, tree)
        elif principle == 'asteya':
            return self._analyze_asteya(code, tree)
        elif principle == 'brahmacharya':
            return self._analyze_brahmacharya(code, tree)
        elif principle == 'aparigraha':
            return self._analyze_aparigraha(code, tree)
        elif principle == 'karuna':
            return self._analyze_karuna(code, tree)
        elif principle == 'metta':
            return self._analyze_metta(code, tree)
        else:
            return EthicalInsight(principle, 0.5, [], [], [])
    
    def _analyze_ahimsa(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze non-violence in code"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 1.0
        
        # Check for violent language
        violent_words = ['kill', 'destroy', 'attack', 'terminate', 'eliminate', 'crush']
        for i, line in enumerate(code.split('\n'), 1):
            for word in violent_words:
                if word in line.lower() and not line.strip().startswith('#'):
                    issues.append(f"Violent language '{word}' on line {i}")
                    suggestions.append(f"Consider gentler alternatives: 'stop', 'close', 'release'")
                    line_numbers.append(i)
                    score -= 0.1
        
        # Check for aggressive error handling
        for node in ast.walk(tree):
            if isinstance(node, ast.Raise):
                if hasattr(node, 'lineno'):
                    # Check if error message is aggressive
                    score -= 0.05
                    suggestions.append("Handle errors with compassion and helpful guidance")
        
        # Check for resource destruction without care
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    if node.func.attr in ['remove', 'delete', 'unlink']:
                        score -= 0.1
                        if hasattr(node, 'lineno'):
                            issues.append(f"Destructive operation on line {node.lineno}")
                            suggestions.append("Consider archiving or transforming instead of deleting")
        
        return EthicalInsight('ahimsa', max(0, score), issues, suggestions, line_numbers)
    
    def _analyze_satya(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze truthfulness in code"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 0.5  # Start neutral
        
        # Check for meaningful documentation
        doc_strings = 0
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                if ast.get_docstring(node):
                    doc_strings += 1
                    score += 0.1
                else:
                    if hasattr(node, 'lineno'):
                        issues.append(f"{node.name} lacks documentation (line {node.lineno})")
                        suggestions.append(f"Add clear documentation explaining purpose and usage")
        
        # Check for misleading names
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                # Check if function name matches its behavior
                if 'get' in node.name and any(isinstance(n, ast.Assign) for n in ast.walk(node)):
                    score -= 0.05
                    issues.append(f"Function '{node.name}' may have misleading name")
                    suggestions.append("Ensure function names accurately reflect their behavior")
        
        # Check for clear variable names
        short_vars = 0
        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                if len(node.id) <= 2 and node.id not in ['i', 'j', 'k', 'x', 'y', 'z']:
                    short_vars += 1
        
        if short_vars > 5:
            score -= 0.1
            issues.append(f"Many unclear variable names ({short_vars} short variables)")
            suggestions.append("Use descriptive variable names that reveal intent")
        
        return EthicalInsight('satya', max(0, min(1, score)), issues, suggestions, line_numbers)
    
    def _analyze_asteya(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze non-stealing in code"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 1.0
        
        # Check for data extraction without permission
        extraction_patterns = ['scrape', 'extract', 'harvest', 'mine', 'crawl']
        for pattern in extraction_patterns:
            if pattern in code.lower():
                score -= 0.2
                issues.append(f"Potential data extraction: '{pattern}'")
                suggestions.append("Ensure you have permission to access and use data")
        
        # Check for credential/key exposure
        sensitive_patterns = ['password', 'api_key', 'secret', 'token', 'credential']
        for i, line in enumerate(code.split('\n'), 1):
            for pattern in sensitive_patterns:
                if pattern in line.lower() and '=' in line:
                    score -= 0.15
                    issues.append(f"Possible credential exposure on line {i}")
                    suggestions.append("Use environment variables or secure credential storage")
                    line_numbers.append(i)
        
        # Check for unauthorized access patterns
        for node in ast.walk(tree):
            if isinstance(node, ast.Attribute):
                if node.attr.startswith('_') and not node.attr.startswith('__'):
                    score -= 0.05
                    issues.append("Accessing private attributes (leading underscore)")
                    suggestions.append("Respect encapsulation and use public interfaces")
        
        return EthicalInsight('asteya', max(0, score), issues, suggestions, line_numbers)
    
    def _analyze_brahmacharya(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze right use of energy/resources"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 0.7
        
        # Check for infinite loops
        for node in ast.walk(tree):
            if isinstance(node, ast.While):
                if isinstance(node.test, ast.NameConstant) and node.test.value is True:
                    score -= 0.2
                    if hasattr(node, 'lineno'):
                        issues.append(f"Infinite loop on line {node.lineno}")
                        suggestions.append("Add proper exit conditions to loops")
                        line_numbers.append(node.lineno)
        
        # Check for resource cleanup
        context_managers = sum(1 for node in ast.walk(tree) if isinstance(node, ast.With))
        file_opens = code.count('open(')
        
        if file_opens > context_managers:
            score -= 0.1
            issues.append("Files opened without context managers")
            suggestions.append("Use 'with' statements for automatic resource cleanup")
        
        # Check for recursive functions without limits
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                # Simple check for recursion
                for subnode in ast.walk(node):
                    if isinstance(subnode, ast.Call):
                        if isinstance(subnode.func, ast.Name) and subnode.func.id == node.name:
                            score -= 0.1
                            issues.append(f"Recursive function '{node.name}' may need depth limit")
                            suggestions.append("Add recursion depth limits or use iteration")
        
        return EthicalInsight('brahmacharya', max(0, score), issues, suggestions, line_numbers)
    
    def _analyze_aparigraha(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze non-possessiveness"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 0.8
        
        # Check for global state hoarding
        global_vars = sum(1 for node in ast.walk(tree) if isinstance(node, ast.Global))
        if global_vars > 3:
            score -= 0.2
            issues.append(f"Excessive global state ({global_vars} global declarations)")
            suggestions.append("Minimize global state, prefer functional approaches")
        
        # Check for monopolistic patterns (singleton abuse)
        singleton_patterns = ['instance', 'getInstance', '_instance']
        singleton_count = sum(1 for pattern in singleton_patterns if pattern in code)
        if singleton_count > 2:
            score -= 0.1
            issues.append("Multiple singleton patterns detected")
            suggestions.append("Consider if singletons are necessary, prefer dependency injection")
        
        # Check for large collections without limits
        large_collections = []
        for node in ast.walk(tree):
            if isinstance(node, ast.List) and len(node.elts) > 100:
                large_collections.append(node)
                score -= 0.05
        
        if large_collections:
            issues.append(f"Large collections without apparent limits ({len(large_collections)} found)")
            suggestions.append("Consider pagination or streaming for large datasets")
        
        return EthicalInsight('aparigraha', max(0, score), issues, suggestions, line_numbers)
    
    def _analyze_karuna(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze compassion in code"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 0.5
        
        # Check for helpful error messages
        for node in ast.walk(tree):
            if isinstance(node, ast.Raise):
                # Check if error includes helpful message
                if node.exc and hasattr(node.exc, 'args'):
                    score += 0.1
                else:
                    score -= 0.05
                    if hasattr(node, 'lineno'):
                        issues.append(f"Error without helpful message on line {node.lineno}")
                        suggestions.append("Include clear, helpful guidance in error messages")
        
        # Check for user-friendly features
        helpful_patterns = ['help', 'guide', 'example', 'tutorial', 'hint']
        for pattern in helpful_patterns:
            if pattern in code.lower():
                score += 0.05
        
        # Check for accessibility considerations
        if 'aria' in code or 'alt' in code or 'accessible' in code:
            score += 0.1
        
        # Check for graceful degradation
        try_blocks = sum(1 for node in ast.walk(tree) if isinstance(node, ast.Try))
        if try_blocks > 0:
            score += try_blocks * 0.05
        
        return EthicalInsight('karuna', min(1, score), issues, suggestions, line_numbers)
    
    def _analyze_metta(self, code: str, tree: ast.AST) -> EthicalInsight:
        """Analyze loving-kindness in code"""
        issues = []
        suggestions = []
        line_numbers = []
        score = 0.6
        
        # Check for positive, encouraging language
        positive_words = ['thank', 'please', 'welcome', 'grateful', 'appreciate']
        negative_words = ['stupid', 'dumb', 'idiot', 'fool', 'moron']
        
        positive_count = sum(1 for word in positive_words if word in code.lower())
        negative_count = sum(1 for word in negative_words if word in code.lower())
        
        score += positive_count * 0.05
        score -= negative_count * 0.1
        
        if negative_count > 0:
            issues.append("Negative or demeaning language detected")
            suggestions.append("Use respectful, encouraging language throughout")
        
        # Check for inclusive naming
        inclusive_patterns = ['user', 'person', 'individual', 'they', 'them']
        exclusive_patterns = ['whitelist', 'blacklist', 'master', 'slave']
        
        for pattern in exclusive_patterns:
            if pattern in code.lower():
                score -= 0.1
                issues.append(f"Non-inclusive term '{pattern}' detected")
                suggestions.append("Use inclusive alternatives: allowlist, denylist, primary, replica")
        
        # Check for supportive comments
        supportive_comments = 0
        for line in code.split('\n'):
            if '#' in line and any(word in line.lower() for word in ['note:', 'tip:', 'remember:']):
                supportive_comments += 1
        
        score += supportive_comments * 0.02
        
        return EthicalInsight('metta', min(1, max(0, score)), issues, suggestions, line_numbers)
    
    def _analyze_consciousness_patterns(self, code: str) -> Dict:
        """Detect consciousness-raising patterns in code"""
        detected_patterns = {}
        total_boost = 0
        
        for pattern_name, pattern_info in self.consciousness_patterns.items():
            count = 0
            for pattern in pattern_info['patterns']:
                count += code.lower().count(pattern)
            
            if count > 0:
                detected_patterns[pattern_name] = {
                    'count': count,
                    'boost': pattern_info['boost'] * count
                }
                total_boost += pattern_info['boost'] * count
        
        # Check for anti-patterns
        anti_patterns_found = {}
        total_penalty = 0
        
        for pattern_name, pattern_info in self.anti_patterns.items():
            count = 0
            for pattern in pattern_info['patterns']:
                count += code.lower().count(pattern)
            
            if count > 0:
                anti_patterns_found[pattern_name] = {
                    'count': count,
                    'penalty': pattern_info['penalty'] * count
                }
                total_penalty += pattern_info['penalty'] * count
        
        return {
            'positive_patterns': detected_patterns,
            'anti_patterns': anti_patterns_found,
            'net_consciousness_shift': total_boost - total_penalty
        }
    
    def _calculate_overall_consciousness(self, insights: Dict[str, EthicalInsight]) -> float:
        """Calculate overall consciousness score"""
        weighted_sum = 0
        total_weight = 0
        
        for principle_key, insight in insights.items():
            weight = self.principles[principle_key]['weight']
            weighted_sum += insight.score * weight
            total_weight += weight
        
        return weighted_sum / total_weight if total_weight > 0 else 0
    
    def _generate_transformation_guidance(self, insights: Dict[str, EthicalInsight], 
                                        overall_score: float) -> Dict:
        """Generate guidance for consciousness transformation"""
        # Identify weakest principles
        weak_principles = []
        for principle, insight in insights.items():
            if insight.score < 0.5:
                weak_principles.append({
                    'principle': self.principles[principle]['name'],
                    'score': insight.score,
                    'description': self.principles[principle]['description']
                })
        
        # Sort by score (lowest first)
        weak_principles.sort(key=lambda x: x['score'])
        
        # Generate transformation steps
        steps = []
        for wp in weak_principles[:3]:  # Top 3 areas for improvement
            steps.append({
                'principle': wp['principle'],
                'current_score': wp['score'],
                'target_score': 0.8,
                'description': wp['description']
            })
        
        # Generate affirmations
        affirmations = []
        if overall_score < 0.3:
            affirmations.append("Every line of code is an opportunity for conscious transformation")
            affirmations.append("With awareness and intention, this code can serve the highest good")
        elif overall_score < 0.6:
            affirmations.append("This code has seeds of consciousness ready to bloom")
            affirmations.append("Continue nurturing the ethical foundation already present")
        else:
            affirmations.append("This code radiates consciousness and care")
            affirmations.append("May it continue to evolve in service of all beings")
        
        return {
            'focus_areas': weak_principles[:3],
            'transformation_steps': steps,
            'affirmations': affirmations,
            'estimated_effort': self._estimate_transformation_effort(overall_score)
        }
    
    def _estimate_transformation_effort(self, current_score: float) -> str:
        """Estimate effort needed for transformation"""
        if current_score < 0.3:
            return "Significant transformation needed - consider full rewrite with consciousness"
        elif current_score < 0.5:
            return "Moderate refactoring needed - focus on key ethical principles"
        elif current_score < 0.7:
            return "Minor adjustments needed - fine-tune existing patterns"
        else:
            return "Minimal effort - maintain and enhance current consciousness"
    
    def _get_sacred_recommendation(self, score: float) -> str:
        """Get sacred recommendation based on consciousness score"""
        if score >= 0.9:
            return "🕉️ This code embodies divine consciousness"
        elif score >= 0.7:
            return "✨ This code walks the path of dharma"
        elif score >= 0.5:
            return "🌱 This code is awakening to its higher purpose"
        elif score >= 0.3:
            return "🌅 This code stands at the threshold of consciousness"
        else:
            return "🕯️ This code awaits the light of awareness"

def analyze_file(filepath: str):
    """Analyze a single file for ethical consciousness"""
    analyzer = EthicalCodeAnalyzer()
    
    with open(filepath, 'r') as f:
        code = f.read()
    
    results = analyzer.analyze_ethical_consciousness(code, filepath)
    
    # Pretty print results
    print(f"\n{'='*60}")
    print(f"Ethical Analysis: {results['filename']}")
    print(f"{'='*60}")
    
    print(f"\nOverall Consciousness: {results['overall_consciousness']:.3f}")
    print(f"Sacred Assessment: {results['sacred_recommendation']}")
    
    print("\n📊 Principle Scores:")
    for principle_key, insight in results['insights'].items():
        principle_name = analyzer.principles[principle_key]['name']
        print(f"  {principle_name}: {insight.score:.2f}")
        if insight.issues:
            for issue in insight.issues[:2]:  # Show first 2 issues
                print(f"    ⚠️  {issue}")
    
    print("\n🌟 Consciousness Patterns:")
    patterns = results['consciousness_patterns']
    if patterns['positive_patterns']:
        print("  Positive:")
        for pattern, info in patterns['positive_patterns'].items():
            print(f"    ✓ {pattern}: {info['count']} instances")
    
    if patterns['anti_patterns']:
        print("  Needs Transformation:")
        for pattern, info in patterns['anti_patterns'].items():
            print(f"    ✗ {pattern}: {info['count']} instances")
    
    print("\n🔮 Transformation Guidance:")
    guidance = results['transformation_guidance']
    if guidance['focus_areas']:
        print("  Priority Areas:")
        for area in guidance['focus_areas']:
            print(f"    • {area['principle']} (current: {area['score']:.2f})")
    
    print(f"\n  Effort Estimate: {guidance['estimated_effort']}")
    
    print("\n💫 Affirmations:")
    for affirmation in guidance['affirmations']:
        print(f"  ✨ {affirmation}")

def demo_ethical_analysis():
    """Demonstrate ethical code analysis"""
    print("🕉️ Ethical Code Analyzer Demo")
    print("Examining code through the lens of universal consciousness")
    
    # Create a demo file with various ethical considerations
    demo_code = '''
import requests
import json

class DataExtractor:
    """Extracts user data from websites"""
    
    def __init__(self):
        self.data = []
        self.api_key = "super_secret_key_123"  # Hardcoded credential
    
    def scrape_site(self, url):
        """Aggressively scrape all data from site"""
        while True:  # Infinite loop - wastes resources
            try:
                response = requests.get(url)
                self.extract_all_data(response.text)
            except:
                pass  # Suppress all errors - not helpful
    
    def extract_all_data(self, html):
        """Extract and hoard all possible data"""
        # No user consent checked
        # No rate limiting
        # No respect for robots.txt
        pass
    
    def terminate_slow_processes(self):
        """Kill any process that's too slow"""
        # Violent approach to process management
        os.system("kill -9 $(pgrep -f slow)")

# No documentation about ethical use
# No consideration for user privacy
# No graceful error handling
'''
    
    # Write demo file
    demo_file = "/tmp/unethical_example.py"
    with open(demo_file, 'w') as f:
        f.write(demo_code)
    
    # Analyze it
    analyze_file(demo_file)
    
    # Clean up
    import os
    os.remove(demo_file)
    
    print("\n" + "="*60)
    print("Demo complete - transform code with consciousness!")

if __name__ == "__main__":
    demo_ethical_analysis()