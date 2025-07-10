#!/bin/bash

# ◉ ◉ LuminousOS GitHub Release Creation Script
# Creates a new GitHub release using gh CLI

set -e

VERSION="v0.1.0"
RELEASE_TITLE="🌟 LuminousOS v0.1.0 - First Light"
RELEASE_NOTES_FILE="release-notes/v0.1.0.md"
PRERELEASE=true

echo "◉ ◉ Creating LuminousOS GitHub Release $VERSION"
echo "==========================================="

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it: https://cli.github.com/"
    echo ""
    echo "For Ubuntu/Debian:"
    echo "  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "  echo 'deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main' | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "  sudo apt update && sudo apt install gh"
    exit 1
fi

# Check if we're authenticated
if ! gh auth status >/dev/null 2>&1; then
    echo "❌ Not authenticated with GitHub"
    echo "Please run: gh auth login"
    exit 1
fi

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Check if release notes exist
if [ ! -f "$RELEASE_NOTES_FILE" ]; then
    echo "❌ Release notes not found at $RELEASE_NOTES_FILE"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes."
    echo "Please commit or stash them before creating a release."
    echo ""
    git status --short
    exit 1
fi

# Create git tag if it doesn't exist
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    echo "✓ Tag $VERSION already exists"
else
    echo "Creating tag $VERSION..."
    git tag -a "$VERSION" -m "$RELEASE_TITLE"
    echo "✓ Tag created"
fi

# Push tag to origin
echo "Pushing tag to origin..."
git push origin "$VERSION" || {
    echo "❌ Failed to push tag. Please check your permissions."
    exit 1
}
echo "✓ Tag pushed"

# Create the release
echo ""
echo "Creating GitHub release..."
if [ "$PRERELEASE" = true ]; then
    gh release create "$VERSION" \
        --title "$RELEASE_TITLE" \
        --notes-file "$RELEASE_NOTES_FILE" \
        --prerelease \
        --verify-tag
else
    gh release create "$VERSION" \
        --title "$RELEASE_TITLE" \
        --notes-file "$RELEASE_NOTES_FILE" \
        --verify-tag
fi

echo ""
echo "✨ Release $VERSION created successfully!"
echo ""
echo "Next steps:"
echo "1. Visit: https://github.com/Luminous-Dynamics/luminous-os/releases"
echo "2. Share in Discord: 'First Light is here! Sacred Process Monitor v0.1.0 released!'"
echo "3. Create the GitHub issues for community contribution"
echo "4. Post launch announcement on HN/Reddit"
echo ""
echo "◉ ◉ First light shines!"