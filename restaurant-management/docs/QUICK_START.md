# Quick Start Guide

Get your Restaurant Management System up and running in 30 minutes!

## ⚡ Fast Track Setup

### Prerequisites
```bash
# Check you have these installed
node --version  # Should be 18+
aws --version   # AWS CLI
git --version
```

### 1. Clone and Setup (2 minutes)

```bash
git clone <your-repo-url> restaurant-management
cd restaurant-management

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env if needed for local development

# Frontend setup
cd ../frontend
npm install
cp .env.local.example .env.local
```

### 2. Local Development (5 minutes)

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# API running on http://localhost:3001
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

Visit: http://localhost:3000

### 3. AWS Deployment (20 minutes)

#### A. Create DynamoDB Tables
```bash
cd infrastructure
chmod +x *.sh
./create-dynamodb-tables.sh
```

#### B. Launch & Setup EC2
1. Launch Ubuntu 22.04 t2.micro instance
2. Add tag: `Name=RestaurantAPI`
3. Attach IAM role with DynamoDB + S3 access
4. Allow ports: 22, 3001, 80 in security group

```bash
# Copy setup script to EC2
scp -i your-key.pem infrastructure/setup-ec2.sh ubuntu@ec2-ip:~

# SSH and run setup
ssh -i your-key.pem ubuntu@ec2-ip
chmod +x setup-ec2.sh
./setup-ec2.sh
```

#### C. Setup CodeDeploy
```bash
# On local machine
cd infrastructure
./setup-codedeploy.sh
```

#### D. Deploy!
```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

### 4. Test Your API

```bash
curl http://your-ec2-ip:3001/health
```

Should return:
```json
{"status":"healthy","timestamp":"...","service":"Restaurant API"}
```

### 5. Deploy Frontend

**Option A - Amplify (Easiest):**
1. Push to GitHub
2. Connect to AWS Amplify
3. Set env: `NEXT_PUBLIC_API_URL=http://ec2-ip:3001`
4. Deploy!

**Option B - Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
```
Set env variable in Vercel dashboard.

## 🎉 You're Live!

Your restaurant management system is now running!

### Add Sample Data

```bash
curl -X POST http://ec2-ip:3001/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Burger",
    "description": "Delicious beef burger",
    "price": 9.99,
    "category": "Main Course",
    "available": true
  }'
```

### Next Steps

- ✅ Add more menu items via API or build admin UI
- ✅ Test order placement
- ✅ Test reservations
- ✅ Setup HTTPS with Certbot
- ✅ Add monitoring

## 🆘 Quick Fixes

**API not starting?**
```bash
ssh -i key.pem ubuntu@ec2-ip
pm2 logs restaurant-api
```

**Can't reach API?**
- Check security group has port 3001 open
- Check EC2 public IP is correct
- Verify API is running: `pm2 list`

**Frontend can't reach API?**
- Check `.env.local` has correct API URL
- Rebuild frontend after changing env: `npm run build`

## 📚 Full Documentation

See `/docs/DEPLOYMENT.md` for complete deployment guide.

---

**Happy Coding! 🚀**
