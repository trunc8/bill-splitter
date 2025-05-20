#!/bin/bash

# This script runs before the Netlify build process
# It will install dependencies and prepare the environment

# Log the Node and npm versions
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies with specific flags
echo "Installing dependencies..."
npm ci --legacy-peer-deps

# Create an .npmrc file
echo "Creating .npmrc..."
echo "legacy-peer-deps=true" > .npmrc

# Success message
echo "Build preparation completed successfully!"
