#!/bin/bash
# Merge all component repos into the monorepo while preserving history

set -e

echo "🌟 Beginning Luminous Dynamics Monorepo Merge..."
echo "This will merge all component repositories while preserving their full history."
echo

# Array of repos to merge: "repo-name:branch:target-path"
REPOS=(
  "sacred-core:main:01-resonant-coherence/core/sacred-core"
  "the-weave:main:01-resonant-coherence/core/the-weave"
  "codex-of-relational-harmonics:main:03-integral-wisdom/core/codex"
  "luminous-os:main:07-evolutionary-progression/core/luminous-os"
  "sacred-infrastructure:main:08-infrastructure/systems/sacred-infrastructure"
  "luminous-dynamics-website:main:08-infrastructure/interfaces/luminous-dynamics-website"
  "relational-harmonics-website:main:08-infrastructure/interfaces/relational-harmonics-website"
)

# Process each repo
for repo_info in "${REPOS[@]}"; do
  IFS=':' read -r repo_name branch target_path <<< "$repo_info"
  
  echo "🔀 Merging $repo_name..."
  echo "   Source: https://github.com/Luminous-Dynamics/$repo_name.git"
  echo "   Target: $target_path/"
  
  # Add remote
  git remote add "$repo_name" "https://github.com/Luminous-Dynamics/$repo_name.git" 2>/dev/null || true
  
  # Fetch the repository
  echo "   Fetching repository..."
  git fetch "$repo_name" --no-tags
  
  # Merge with subtree strategy
  echo "   Merging with history preservation..."
  git merge -s ours --no-commit --allow-unrelated-histories "$repo_name/$branch"
  git read-tree --prefix="$target_path/" -u "$repo_name/$branch"
  
  # Commit the merge
  git commit -m "🔀 Merge $repo_name into unified monorepo

Preserving full history from $repo_name repository.
Original location: https://github.com/Luminous-Dynamics/$repo_name
Target location: $target_path/

Part of the Seven Harmonies unification."
  
  # Remove the remote
  git remote remove "$repo_name"
  
  echo "✅ $repo_name merged successfully!"
  echo
done

# Handle special case - .github repo
echo "🔀 Merging .github configuration repo..."
git remote add github-config "https://github.com/Luminous-Dynamics/.github.git" 2>/dev/null || true
git fetch github-config --no-tags
git merge -s ours --no-commit --allow-unrelated-histories "github-config/main"
git read-tree --prefix=".github-org/" -u "github-config/main"
git commit -m "🔀 Merge .github configuration into monorepo

Preserving organization-wide GitHub configuration.
Placed in .github-org/ to avoid conflicts with repo-specific .github/"
git remote remove github-config

echo "✨ All repositories merged successfully!"
echo
echo "📊 Summary:"
echo "- 8 repositories merged"
echo "- Full history preserved"
echo "- Seven Harmonies structure maintained"
echo
echo "🎯 Next steps:"
echo "1. Push the unified monorepo: git push origin main"
echo "2. Archive the individual repositories on GitHub"
echo "3. Update all documentation and links"