#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Heroku Deployment Troubleshooter ===${NC}"

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

# List available apps
echo -e "${YELLOW}Available Heroku apps:${NC}"
heroku apps

# Get app name
read -p "Enter your Heroku app name: " APP_NAME

# Check if app exists
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
    echo -e "${RED}App '$APP_NAME' not found${NC}"
    exit 1
fi

# Show app info
echo -e "${YELLOW}App information:${NC}"
heroku apps:info --app $APP_NAME

# Check for buildpack issues
echo -e "${YELLOW}Checking buildpacks:${NC}"
heroku buildpacks --app $APP_NAME
echo ""

# Show environment variables
echo -e "${YELLOW}Environment variables:${NC}"
heroku config --app $APP_NAME
echo ""

# Check for Python version
echo -e "${YELLOW}Checking for runtime.txt:${NC}"
if [ -f "runtime.txt" ]; then
    echo -e "${GREEN}Found runtime.txt:${NC}"
    cat runtime.txt
    echo ""
else
    echo -e "${RED}runtime.txt not found. This specifies the Python version.${NC}"
    echo -e "${RED}Create it with: echo \"python-3.10.12\" > runtime.txt${NC}"
    echo ""
fi

# Check for Procfile
echo -e "${YELLOW}Checking for Procfile:${NC}"
if [ -f "Procfile" ]; then
    echo -e "${GREEN}Found Procfile:${NC}"
    cat Procfile
    echo ""
else
    echo -e "${RED}Procfile not found. This tells Heroku how to run your app.${NC}"
    echo -e "${RED}Create it with: echo \"web: gunicorn wsgi:app\" > Procfile${NC}"
    echo ""
fi

# Check for requirements.txt
echo -e "${YELLOW}Checking for requirements.txt:${NC}"
if [ -f "requirements.txt" ]; then
    echo -e "${GREEN}Found requirements.txt${NC}"
else
    echo -e "${RED}requirements.txt not found. Heroku needs this to install dependencies.${NC}"
    echo ""
fi

# View recent logs
echo -e "${YELLOW}Recent application logs:${NC}"
heroku logs --tail --app $APP_NAME

# Offer to restart the app
read -p "Would you like to restart the app? (y/n): " RESTART
if [[ $RESTART == "y" ]]; then
    echo -e "${YELLOW}Restarting app...${NC}"
    heroku restart --app $APP_NAME
    echo -e "${GREEN}App restarted. Check logs for updates:${NC}"
    sleep 2
    heroku logs --tail --app $APP_NAME
fi
