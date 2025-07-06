#\!/bin/bash
echo "🔥 Pulling the best code-specialist LLMs for sacred work"
echo ""

# Code Llama - Meta's beast
echo "📦 Code Llama 7B (fits your RTX 2070)"
ollama pull codellama:7b &

# DeepSeek already started earlier - excellent choice

# StarCoder2 
echo "📦 StarCoder2 7B (BigCode's multilingual monster)"
ollama pull starcoder2:7b &

# WizardCoder - the benchmark destroyer
echo "📦 WizardCoder (Evol-Instruct enhanced)"
ollama pull wizardcoder:latest &

echo ""
echo "🚀 Code specialist models downloading..."
echo "These are THE models for serious code work."
echo ""
echo "Your RTX 2070 sweet spot: 7B models with 4-bit quant"
