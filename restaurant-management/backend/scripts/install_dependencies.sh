#!/bin/bash
set -e

echo "Installing dependencies..."
cd /home/ec2-user/restaurant-api

# Install production dependencies
npm install --production

echo "Dependencies installed successfully"
