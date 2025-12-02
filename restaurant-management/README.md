# Restaurant Management System

A complete restaurant management platform with online ordering, reservations, and admin dashboard. Built with Next.js, Express, and AWS services.

## 🚀 Features

- **Customer Features**
  - Browse menu with categories
  - Add items to cart
  - Place orders (delivery/pickup)
  - Make table reservations
  - Order tracking

- **Admin Features**
  - Manage menu items
  - View and update orders
  - Manage reservations
  - Real-time order notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: AWS DynamoDB
- **Deployment**: AWS CodeDeploy, EC2
- **Process Manager**: PM2

## 📁 Project Structure

```
restaurant-management/
├── backend/              # Express API server
├── frontend/             # Next.js application
├── infrastructure/       # AWS setup scripts
└── docs/                 # Additional documentation
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- AWS Account
- AWS CLI configured
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your AWS credentials and configurations
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

Visit `http://localhost:3000` for frontend and `http://localhost:3001` for API.

## ☁️ AWS Deployment

### 1. Setup DynamoDB Tables

```bash
cd infrastructure
chmod +x create-dynamodb-tables.sh
./create-dynamodb-tables.sh
```

### 2. Setup EC2 Instance

```bash
chmod +x setup-ec2.sh
# Run this script on your EC2 instance after SSH
./setup-ec2.sh
```

### 3. Configure CodeDeploy

```bash
chmod +x setup-codedeploy.sh
./setup-codedeploy.sh
```

### 4. Deploy Application

```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

## 📚 API Documentation

### Menu Endpoints

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Reservation Endpoints

- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations
- `PATCH /api/reservations/:id/status` - Update reservation status

## 🔐 Environment Variables

### Backend (.env)

```
PORT=3001
AWS_REGION=us-east-1
MENU_TABLE_NAME=RestaurantMenu
ORDERS_TABLE_NAME=RestaurantOrders
RESERVATIONS_TABLE_NAME=RestaurantReservations
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Deployment Guide

Detailed deployment instructions available in `/docs/DEPLOYMENT.md`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Umair - Restaurant Management System

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- Next.js team for the amazing framework
- Express.js for backend simplicity
