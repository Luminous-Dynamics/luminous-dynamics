#!/usr/bin/env bash
echo "🧪 Testing LuminousOS compilation..."

# Test 1: Minimal compilation
echo -e "\n1️⃣ Testing minimal compilation..."
if cargo check --lib --manifest-path Cargo-minimal.toml 2>&1; then
    echo "✅ Minimal compilation successful!"
else
    echo "❌ Minimal compilation failed"
fi

# Test 2: Full compilation
echo -e "\n2️⃣ Testing full compilation..."
if cargo check --lib 2>&1; then
    echo "✅ Full compilation successful!"
else
    echo "❌ Full compilation failed"
    echo "Try: cargo check --lib --no-default-features"
fi

# Test 3: Documentation generation
echo -e "\n3️⃣ Testing documentation generation..."
if cargo doc --lib --no-deps 2>&1; then
    echo "✅ Documentation generation successful!"
else
    echo "❌ Documentation generation failed"
fi
