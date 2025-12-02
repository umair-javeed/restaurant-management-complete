#!/bin/bash
set -e

echo "Starting Restaurant API..."

cd /home/ec2-user/restaurant-api

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set environment variables
export NODE_ENV=production
export PORT=3001

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the application with PM2
pm2 start src/server.js --name restaurant-api --time

# Save PM2 process list
pm2 save

echo "Restaurant API started successfully"
echo "Application running on port ${PORT}"
