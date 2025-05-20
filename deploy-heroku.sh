#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Heroku Deployment Helper ===${NC}"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}Heroku CLI not found. Please install it:${NC}"
    echo "curl https://cli-assets.heroku.com/install.sh | sh"
    exit 1
fi

# Check if logged in to Heroku
heroku_status=$(heroku auth:whoami 2>&1)
if [[ $heroku_status == *"not logged in"* ]]; then
    echo -e "${RED}Not logged in to Heroku. Please run:${NC}"
    echo "heroku login"
    exit 1
else
    echo -e "${GREEN}Logged in to Heroku as:${NC} $heroku_status"
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${RED}Git repository not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit for Heroku deployment"
fi

# Create Heroku app if it doesn't exist
APP_NAME="bill-splitter-app"
heroku_apps=$(heroku apps)
if [[ $heroku_apps != *"$APP_NAME"* ]]; then
    echo -e "${YELLOW}Creating Heroku app: $APP_NAME${NC}"
    heroku create $APP_NAME
else
    echo -e "${GREEN}Using existing Heroku app: $APP_NAME${NC}"
fi

# Set buildpack explicitly
echo -e "${YELLOW}Setting Python buildpack${NC}"
heroku buildpacks:clear --app $APP_NAME
heroku buildpacks:set heroku/python --app $APP_NAME

# Set environment variables
echo -e "${YELLOW}Setting environment variables${NC}"
heroku config:set FLASK_ENV=production --app $APP_NAME
heroku config:set FRONTEND_URL=https://your-frontend-url.netlify.app --app $APP_NAME

# Deploy to Heroku
echo -e "${YELLOW}Pushing to Heroku${NC}"
git push heroku main

# Open the app in browser
echo -e "${GREEN}Deployment complete! Opening app...${NC}"
heroku open --app $APP_NAME

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}Backend deployed to: https://$APP_NAME.herokuapp.com${NC}"
echo -e "${YELLOW}Remember to update your frontend API_URL to point to this backend URL${NC}"
echo -e "${GREEN}=============================================${NC}"
