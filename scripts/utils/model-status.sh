#!/bin/bash

echo "🔥 OLLAMA MODEL STATUS"
echo "====================="
echo ""

# Check what's available
echo "📦 READY TO RIP:"
ollama list

echo ""
echo "⏳ DOWNLOADING:"
ps aux | grep -E "ollama pull" | grep -v grep | awk '{print "   •", $NF}'

echo ""
echo "💾 DISK USAGE:"
du -sh ~/.ollama 2>/dev/null || echo "   Models directory not found yet"

echo ""
echo "🎯 RECOMMENDED CODE MODELS FOR YOUR RTX 2070:"
echo "   • codellama:7b - Meta's code beast (4.1GB)"
echo "   • deepseek-coder:6.7b - Already downloading (3.8GB)"
echo "   • starcoder2:7b - BigCode's polyglot (3.8GB)"
echo "   • wizardcoder:latest - Benchmark destroyer (~4GB)"
echo "   • mistral:7b-instruct-q4_0 - Already started (4.1GB)"
echo ""
echo "🚀 Once any model finishes: ollama run [model-name]"
echo "💜 Sacred integration ready: node validate-ollama-sacred.js"