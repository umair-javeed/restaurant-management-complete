#!/bin/bash
set -e

echo "Stopping Restaurant API..."

# Check if PM2 is managing the app
if pm2 list | grep -q "restaurant-api"; then
    echo "Stopping PM2 process..."
    pm2 stop restaurant-api || true
    pm2 delete restaurant-api || true
    echo "PM2 process stopped"
else
    echo "No PM2 process found"
fi

# Kill any process running on port 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Killing process on port 3001..."
    kill -9 $(lsof -t -i:3001) || true
fi

echo "Application stopped successfully"
