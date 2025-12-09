#!/bin/bash
set -e

echo "Installing dependencies..."

# Load NVM to make npm available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Change to application directory
cd /home/ec2-user/restaurant-api

# Verify npm is available
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install production dependencies
npm install --production

echo "Dependencies installed successfully"