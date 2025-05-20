#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Bill Splitter App Deployment Helper =====${NC}"

# Check for required utilities
echo -e "${YELLOW}Checking for required tools...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git and try again.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install Node.js and npm, then try again.${NC}"
    exit 1
fi

if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo -e "${RED}pip/pip3 is not installed. Please install Python and pip, then try again.${NC}"
    exit 1
fi

echo -e "${GREEN}All required tools are available!${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd frontend || { echo -e "${RED}Frontend directory not found!${NC}"; exit 1; }
npm install || { echo -e "${RED}Failed to install npm dependencies!${NC}"; exit 1; }
npm run build || { echo -e "${RED}Failed to build frontend!${NC}"; exit 1; }
cd ..
echo -e "${GREEN}Frontend build completed successfully!${NC}"
echo ""

# Create initial commit if not already done
echo -e "${YELLOW}Setting up git repository...${NC}"
git add .
git status

echo -e "${GREEN}Your project is now ready for deployment!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create a GitHub repository"
echo "2. Link your repository using: git remote add origin YOUR_GITHUB_REPO_URL"
echo "3. Commit your changes: git commit -m \"Initial commit\""
echo "4. Push to GitHub: git push -u origin main"
echo "5. Deploy using Render.com, Netlify, or your preferred hosting platform"
echo ""
echo -e "${YELLOW}Deployment options:${NC}"
echo "- Render.com: Sign up and use the render.yaml to deploy both frontend and backend"
echo "- Netlify/Vercel: Connect to your GitHub repo and use netlify.toml config"
echo ""
echo -e "${GREEN}Happy deploying!${NC}"
