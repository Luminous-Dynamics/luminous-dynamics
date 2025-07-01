#!/bin/bash
# Fix line endings for all shell scripts
find . -name "*.sh" -type f -exec sed -i 's/\r$//' {} \;
echo "✅ Fixed line endings for all .sh files!"