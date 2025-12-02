#!/bin/bash

# EC2 Instance Setup Script
# Run this script on your EC2 instance to prepare it for Restaurant API deployment

set -e

echo "========================================="
echo "EC2 Instance Setup for Restaurant API"
echo "========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y
echo "✓ System updated"
echo ""

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y curl wget git build-essential ruby-full
echo "✓ Required packages installed"
echo ""

# Install Node.js using NVM
echo "📦 Installing Node.js..."
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    nvm alias default 18
    echo "✓ Node.js installed"
else
    echo "✓ Node.js already installed"
fi
echo ""

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2
pm2 startup
echo "✓ PM2 installed"
echo ""

# Install CodeDeploy Agent
echo "📦 Installing AWS CodeDeploy Agent..."
cd /home/ubuntu
if [ ! -f "./install" ]; then
    wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
    chmod +x ./install
    sudo ./install auto
fi

sudo service codedeploy-agent start
sudo service codedeploy-agent status
echo "✓ CodeDeploy Agent installed and running"
echo ""

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /home/ec2-user/restaurant-api
sudo chown -R ubuntu:ubuntu /home/ec2-user
echo "✓ Application directory created"
echo ""

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable
echo "✓ Firewall configured"
echo ""

echo "========================================="
echo "✅ EC2 Instance Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Configure your .env file in /home/ec2-user/restaurant-api/"
echo "2. Deploy your application using CodeDeploy"
echo ""
echo "Useful commands:"
echo "  - Check CodeDeploy Agent: sudo service codedeploy-agent status"
echo "  - View PM2 logs: pm2 logs restaurant-api"
echo "  - Restart app: pm2 restart restaurant-api"
echo ""
