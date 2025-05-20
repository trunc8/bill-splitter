#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Netlify Build Troubleshooter ===${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${RED}node_modules directory not found. Running npm install...${NC}"
  npm install
else
  echo -e "${GREEN}✓ node_modules directory exists${NC}"
fi

# Check if package-lock.json exists
if [ ! -f "package-lock.json" ]; then
  echo -e "${RED}package-lock.json not found. This can cause issues. Generating...${NC}"
  npm install --package-lock-only
else
  echo -e "${GREEN}✓ package-lock.json exists${NC}"
fi

# Check for Node.js version
NODE_VERSION=$(node -v)
echo -e "${YELLOW}Node.js version:${NC} $NODE_VERSION"
if [[ "$NODE_VERSION" < "v14" ]]; then
  echo -e "${RED}Warning: Node.js version may be too low for some dependencies${NC}"
  echo -e "${YELLOW}Recommended:${NC} Use Node.js v14.17.0 or higher"
fi

# Check for npm version
NPM_VERSION=$(npm -v)
echo -e "${YELLOW}npm version:${NC} $NPM_VERSION"

# Test the build
echo -e "${YELLOW}Testing build process...${NC}"
CI=true npm run build

# Check build status
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful!${NC}"
  echo -e "${YELLOW}Generated files in the build directory:${NC}"
  ls -la build
else
  echo -e "${RED}Build failed. Please check the errors above.${NC}"
fi

echo -e "${YELLOW}=== Troubleshooting Complete ===${NC}"
