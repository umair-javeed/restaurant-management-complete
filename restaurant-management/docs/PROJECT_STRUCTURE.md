# Restaurant Management System - Project Structure

Complete overview of the project structure and file organization.

```
restaurant-management/
│
├── README.md                    # Main project documentation
├── .gitignore                   # Root gitignore
│
├── backend/                     # Express.js API Server
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Backend specific gitignore
│   ├── appspec.yml             # AWS CodeDeploy configuration
│   ├── deploy.sh               # Deployment script
│   │
│   ├── src/                    # Source code
│   │   ├── server.js           # Main Express server
│   │   │
│   │   ├── config/             # Configuration files
│   │   │   └── dynamodb.js     # DynamoDB client setup
│   │   │
│   │   ├── controllers/        # Route controllers
│   │   │   ├── menuController.js
│   │   │   ├── orderController.js
│   │   │   └── reservationController.js
│   │   │
│   │   └── routes/             # API routes
│   │       ├── menuRoutes.js
│   │       ├── orderRoutes.js
│   │       └── reservationRoutes.js
│   │
│   └── scripts/                # Deployment scripts
│       ├── install_dependencies.sh
│       ├── application_stop.sh
│       ├── application_start.sh
│       └── validate_service.sh
│
├── frontend/                    # Next.js Application
│   ├── package.json            # Frontend dependencies
│   ├── .env.local.example      # Frontend environment template
│   ├── .gitignore              # Frontend specific gitignore
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   │
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout with navigation
│   │   ├── page.js             # Home page
│   │   ├── globals.css         # Global styles
│   │   │
│   │   ├── menu/               # Menu page
│   │   │   └── page.js         # Browse menu & cart
│   │   │
│   │   ├── orders/             # Orders page
│   │   │   └── page.js         # Track orders
│   │   │
│   │   ├── reservations/       # Reservations page
│   │   │   └── page.js         # Make reservations
│   │   │
│   │   └── admin/              # Admin dashboard
│   │       └── page.js         # Admin overview
│   │
│   ├── components/             # Reusable components
│   │   └── (add your components here)
│   │
│   └── lib/                    # Utility functions
│       └── api.js              # API client functions
│
├── infrastructure/             # AWS Setup Scripts
│   ├── create-dynamodb-tables.sh   # Create DynamoDB tables
│   ├── setup-ec2.sh                # Setup EC2 instance
│   ├── setup-codedeploy.sh         # Setup CodeDeploy
│   └── test-api.sh                 # API testing script
│
└── docs/                       # Documentation
    ├── DEPLOYMENT.md           # Complete deployment guide
    └── QUICK_START.md          # Quick start guide

```

## Key Files Explained

### Backend

**src/server.js**
- Main Express application
- Middleware configuration
- Route mounting
- Error handling

**src/config/dynamodb.js**
- DynamoDB client initialization
- Helper functions for database operations
- AWS SDK configuration

**src/controllers/**
- Business logic for each resource
- CRUD operations
- Data validation
- Error handling

**src/routes/**
- Route definitions
- HTTP method mapping
- Endpoint organization

**scripts/**
- CodeDeploy lifecycle hooks
- Application startup/shutdown
- Dependency installation
- Health validation

**appspec.yml**
- CodeDeploy deployment configuration
- File mappings
- Lifecycle hook definitions
- Permissions

**deploy.sh**
- Automated deployment script
- Creates deployment package
- Uploads to S3
- Triggers CodeDeploy

### Frontend

**app/layout.js**
- Root layout component
- Navigation bar
- Global providers
- Font configuration

**app/page.js**
- Home page
- Hero section
- Feature cards
- Call-to-actions

**app/menu/page.js**
- Menu display
- Category filtering
- Shopping cart
- Add to cart functionality

**app/orders/page.js**
- Order tracking
- Customer search
- Order status display
- Order history

**app/reservations/page.js**
- Reservation form
- Date/time selection
- Guest count
- Special requests

**app/admin/page.js**
- Admin dashboard
- Statistics overview
- Quick actions
- Management links

**lib/api.js**
- API client setup
- HTTP request functions
- Endpoint organization
- Error handling

### Infrastructure

**create-dynamodb-tables.sh**
- Creates all DynamoDB tables
- Sets billing mode
- Adds tags
- Waits for table activation

**setup-ec2.sh**
- Installs Node.js (via NVM)
- Installs PM2
- Installs CodeDeploy Agent
- Configures firewall
- Creates application directory

**setup-codedeploy.sh**
- Creates S3 bucket
- Creates CodeDeploy application
- Creates deployment group
- Sets up IAM roles

**test-api.sh**
- Tests all API endpoints
- Verifies health check
- Tests CRUD operations
- Provides test results

### Documentation

**DEPLOYMENT.md**
- Complete deployment guide
- Step-by-step instructions
- AWS configuration
- Troubleshooting

**QUICK_START.md**
- 30-minute quick start
- Essential steps only
- Fast track deployment
- Common commands

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific item
- `GET /api/menu/category/:category` - Get by category
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/customer/:phone` - Get customer orders
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get specific reservation
- `GET /api/reservations/customer/:phone` - Get customer reservations
- `PATCH /api/reservations/:id/status` - Update reservation status
- `DELETE /api/reservations/:id` - Delete reservation

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: AWS DynamoDB
- **Process Manager**: PM2
- **Deployment**: AWS CodeDeploy

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Infrastructure
- **Cloud**: AWS (EC2, DynamoDB, S3, CodeDeploy)
- **CI/CD**: CodeDeploy
- **Scripts**: Bash

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=production
AWS_REGION=us-east-1
MENU_TABLE_NAME=RestaurantMenu
ORDERS_TABLE_NAME=RestaurantOrders
RESERVATIONS_TABLE_NAME=RestaurantReservations
FRONTEND_URL=http://your-frontend-url
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://your-api-url:3001
```

## Deployment Flow

1. **Setup AWS Resources**
   - DynamoDB tables
   - EC2 instance with IAM role
   - S3 bucket for deployments
   - CodeDeploy application

2. **Configure EC2**
   - Install Node.js, PM2, CodeDeploy Agent
   - Create application directory
   - Setup environment variables

3. **Deploy Backend**
   - Create deployment package
   - Upload to S3
   - Trigger CodeDeploy
   - Monitor deployment

4. **Deploy Frontend**
   - Choose platform (Amplify/Vercel/EC2)
   - Set environment variables
   - Deploy application

## Development Workflow

1. **Local Development**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Testing**
   ```bash
   # Test API
   ./infrastructure/test-api.sh http://localhost:3001
   ```

3. **Deployment**
   ```bash
   # Deploy backend
   cd backend && ./deploy.sh
   ```

## Next Steps

- Add authentication (Cognito/Auth0)
- Implement payment processing (Stripe)
- Add email notifications (SES)
- Setup monitoring (CloudWatch)
- Add admin CRUD interfaces
- Implement real-time updates (WebSockets)
- Add image uploads (S3)
- Setup CI/CD pipeline (GitHub Actions)

---

For detailed setup instructions, see:
- `/docs/DEPLOYMENT.md` - Complete deployment guide
- `/docs/QUICK_START.md` - Quick start guide
- `/README.md` - Project overview
