# Restaurant Management System - Deployment Guide

Complete guide for deploying the Restaurant Management System on AWS using CodeDeploy.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- Node.js 18+ installed locally
- Git installed
- SSH access to EC2 instances

### AWS IAM Permissions Required
- EC2 (launch instances, manage security groups)
- DynamoDB (create tables, read/write)
- S3 (create buckets, upload objects)
- CodeDeploy (create applications, deployments)
- IAM (create roles, attach policies)

---

## AWS Setup

### Step 1: Create DynamoDB Tables

```bash
cd infrastructure
chmod +x create-dynamodb-tables.sh
./create-dynamodb-tables.sh
```

This creates three tables:
- `RestaurantMenu` - Stores menu items
- `RestaurantOrders` - Stores customer orders
- `RestaurantReservations` - Stores table reservations

### Step 2: Launch EC2 Instance

1. Go to AWS EC2 Console
2. Launch new instance:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance Type**: t2.micro (free tier) or larger
   - **Key Pair**: Create or select existing
   - **Network Settings**:
     - Create new security group
     - Allow SSH (port 22) from your IP
     - Allow Custom TCP (port 3001) from anywhere
     - Allow HTTP (port 80) from anywhere (if using frontend on same instance)

3. **IAM Role** (IMPORTANT):
   - Create new role with these policies:
     - `AmazonDynamoDBFullAccess`
     - `AmazonS3ReadOnlyAccess`
     - Attach this role to your EC2 instance

4. **Add Tags**:
   - Key: `Name`
   - Value: `RestaurantAPI`
   
   ⚠️ This tag is crucial for CodeDeploy to find your instance!

5. Launch the instance

### Step 3: Setup EC2 Instance

SSH into your instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

Run the setup script:

```bash
# Copy the setup script to your instance
scp -i your-key.pem infrastructure/setup-ec2.sh ubuntu@your-ec2-public-ip:~

# SSH into instance and run setup
ssh -i your-key.pem ubuntu@your-ec2-public-ip
chmod +x setup-ec2.sh
./setup-ec2.sh
```

### Step 4: Configure Environment Variables

Create `.env` file on EC2 instance:

```bash
sudo nano /home/ec2-user/restaurant-api/.env
```

Add your configuration:

```env
PORT=3001
NODE_ENV=production
AWS_REGION=us-east-1
MENU_TABLE_NAME=RestaurantMenu
ORDERS_TABLE_NAME=RestaurantOrders
RESERVATIONS_TABLE_NAME=RestaurantReservations
FRONTEND_URL=http://your-frontend-domain.com
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`)

---

## Backend Deployment

### Step 1: Setup CodeDeploy

On your local machine:

```bash
cd infrastructure
chmod +x setup-codedeploy.sh
./setup-codedeploy.sh
```

Follow the prompts. This creates:
- S3 bucket for deployments
- CodeDeploy application
- Deployment group
- Service role

### Step 2: Deploy Backend

```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Create deployment package
2. Upload to S3
3. Trigger CodeDeploy deployment
4. Monitor deployment status

### Step 3: Verify Deployment

Test the API:

```bash
curl http://your-ec2-public-ip:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T...",
  "service": "Restaurant API"
}
```

---

## Frontend Deployment

### Option 1: Deploy on Amplify (Recommended)

1. Push frontend code to GitHub

2. Go to AWS Amplify Console

3. Connect repository:
   - Select GitHub
   - Choose your repository
   - Select `frontend` folder as build path

4. Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://your-ec2-public-ip:3001`

6. Deploy!

### Option 2: Deploy on Same EC2 (with Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Build frontend
cd frontend
npm install
npm run build

# Copy build to web directory
sudo cp -r .next /var/www/restaurant-frontend
sudo cp -r public /var/www/restaurant-frontend

# Configure Nginx
sudo nano /etc/nginx/sites-available/restaurant
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

Enable site and restart:

```bash
sudo ln -s /etc/nginx/sites-available/restaurant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start Next.js with PM2
pm2 start npm --name "restaurant-frontend" -- start
pm2 save
```

### Option 3: Deploy on Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: `http://your-ec2-public-ip:3001`

---

## Post-Deployment

### Add Sample Menu Data

You can add menu items via API or admin dashboard:

```bash
curl -X POST http://your-ec2-public-ip:3001/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato sauce and mozzarella",
    "price": 12.99,
    "category": "Pizza",
    "available": true
  }'
```

### Setup PM2 Startup

On EC2 instance:

```bash
pm2 startup
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v18.18.0/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

### Enable HTTPS (Optional but Recommended)

Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Monitoring

### View Application Logs

```bash
# Backend logs
pm2 logs restaurant-api

# All PM2 processes
pm2 list

# System logs
sudo journalctl -u codedeploy-agent -f
```

### CloudWatch Setup (Optional)

Install CloudWatch agent on EC2 for better monitoring:

```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

---

## Troubleshooting

### Common Issues

**Issue: CodeDeploy deployment fails**
- Check CodeDeploy Agent: `sudo service codedeploy-agent status`
- Check IAM role is attached to EC2 instance
- Verify EC2 instance has correct tag: `Name=RestaurantAPI`
- Check deployment logs: `/var/log/aws/codedeploy-agent/`

**Issue: API returns 500 errors**
- Check PM2 logs: `pm2 logs restaurant-api`
- Verify `.env` file exists and has correct values
- Check DynamoDB table names match
- Verify IAM role has DynamoDB permissions

**Issue: Frontend can't connect to API**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify EC2 security group allows port 3001
- Check API health endpoint: `curl http://ec2-ip:3001/health`
- Check CORS settings in backend `.env`

**Issue: "npm: command not found" during deployment**
- Check NVM path in `application_start.sh`
- Verify Node.js is installed: `node --version`
- Update NVM path if needed

### Useful Commands

```bash
# Restart API
pm2 restart restaurant-api

# View real-time logs
pm2 logs restaurant-api --lines 100

# Check disk space
df -h

# Check memory usage
free -m

# Check running processes
pm2 list

# Stop and remove app
pm2 stop restaurant-api
pm2 delete restaurant-api

# Restart CodeDeploy agent
sudo service codedeploy-agent restart
```

---

## Updating the Application

### Update Backend Code

1. Make your changes locally
2. Test locally: `npm run dev`
3. Deploy:

```bash
cd backend
./deploy.sh
```

CodeDeploy will automatically:
- Stop the current version
- Deploy new code
- Install dependencies
- Start the application
- Validate health

### Update Frontend Code

**For Amplify:** Push to GitHub - automatic deployment

**For Vercel:** 
```bash
vercel --prod
```

**For EC2 with Nginx:**
```bash
cd frontend
npm run build
pm2 restart restaurant-frontend
```

---

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use IAM roles** instead of access keys on EC2
3. **Enable HTTPS** with Let's Encrypt
4. **Restrict security groups** to necessary ports only
5. **Keep software updated**: `sudo apt update && sudo apt upgrade`
6. **Use strong passwords** for any admin features
7. **Enable CloudWatch logging** for production
8. **Backup DynamoDB** regularly (enable point-in-time recovery)

---

## Next Steps

- Set up CloudWatch alerts for API errors
- Implement rate limiting on API
- Add authentication for admin endpoints
- Setup automated backups
- Configure auto-scaling if needed
- Add monitoring dashboard

---

## Support

For issues or questions:
- Check AWS documentation: https://docs.aws.amazon.com
- Review application logs
- Check GitHub issues (if applicable)

**Happy Deploying! 🚀**
