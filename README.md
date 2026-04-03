# Zorvyn Finance Backend

Node.js + Express 5 + MongoDB API for finance records, dashboards, and visualizations.

## Quick Start

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values
4. `npm run dev`

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finance_manager
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
DEBUG_AUTH=false
```

## Seed Data

```
SEED_DATABASE=true npm run seed
```

Seeding is blocked in production.

## API Overview

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/records`
- `POST /api/v1/records` (admin)
- `GET /api/v1/records/:id`
- `PATCH /api/v1/records/:id` (admin)
- `DELETE /api/v1/records/:id` (admin)
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/recent`
- `GET /api/v1/dashboard/category-stats`
- `GET /api/v1/dashboard/trends` (analyst/admin)
- `GET /api/v1/visualizations/monthly`
- `GET /api/v1/visualizations/categories`
- `GET /api/v1/visualizations/trends`
- `GET /api/v1/visualizations/stacked`
- `GET /api/v1/visualizations/top-expenses`
- `GET /api/v1/visualizations/cashflow`
- `GET /api/v1/visualizations/compare`
- `GET /api/v1/users` (admin)
- `PATCH /api/v1/users/status/:id` (admin)
- `PATCH /api/v1/users/:id` (admin)

## Security Notes

- Request data is sanitized to block NoSQL operator injection.
- Passwords are hashed with bcrypt.
- JWT auth protects all sensitive routes.

2. README.md (MUST HAVE)
   Create this file in root:

markdown

# Finance Backend API

## Features

- User authentication with JWT
- Role-based access (Viewer/Analyst/Admin)
- Financial records CRUD with filters
- Dashboard analytics (summary, categories, trends)
- 7 visualization endpoints (bar, pie, line, stacked, top expenses, cashflow, comparison)
- Custom date ranges, pagination, search
- MongoDB persistence

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd finance-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI
# Add your MONGODB_URI and JWT_SECRET

# Seed database
export SEED_DATABASE=true
npm run seed

# Start server
npm run dev
Test Credentials (After Seeding)
Role	Email	Password
Admin	admin@finance.com	admin123
Analyst	analyst@finance.com	analyst123
Viewer	viewer@finance.com	viewer123
API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/v1/auth/signup	Register (gets viewer role)
POST	/api/v1/auth/login	Login, returns JWT
GET	/api/v1/auth/me	Get current user
Records
Method	Endpoint	Description	Access
GET	/api/v1/records	List records (with filters)	Authenticated
POST	/api/v1/records	Create record	Admin only
GET	/api/v1/records/:id	Get single record	Authenticated
PATCH	/api/v1/records/:id	Update record	Admin only
DELETE	/api/v1/records/:id	Delete record	Admin only
Query Parameters for GET /records:

?type=income|expense

?category=Food

?search=keyword

?fromDate=2026-01-01&toDate=2026-12-31

?page=1&limit=50

Dashboard
Method	Endpoint	Description
GET	/api/v1/dashboard/summary	Income/expense/balance
GET	/api/v1/dashboard/category-stats	Totals per category
GET	/api/v1/dashboard/recent	Last 10 transactions
GET	/api/v1/dashboard/trends	Monthly trends (analyst+)
Visualizations (All require auth)
Method	Endpoint	Description
GET	/api/v1/visualizations/monthly	Bar chart - monthly comparison
GET	/api/v1/visualizations/categories	Pie chart - category breakdown
GET	/api/v1/visualizations/trends	Line chart - trends with projection
GET	/api/v1/visualizations/stacked	Stacked bar - income vs expense
GET	/api/v1/visualizations/top-expenses	Horizontal bar - top spending
GET	/api/v1/visualizations/cashflow	Area chart - cumulative balance
GET	/api/v1/visualizations/compare	MoM/YoY comparison
Users (Admin Only)
Method	Endpoint	Description
GET	/api/v1/users	List all users
PATCH	/api/v1/users/:id	Update user role/details
PATCH	/api/v1/users/status/:id	Activate/deactivate
Role Permissions
Action	Viewer	Analyst	Admin
View own records	✅	✅	✅
View all records	❌	❌	✅
Create/update/delete records	❌	❌	✅
Dashboard summary	✅	✅	✅
Monthly trends	❌	✅	✅
All visualizations	✅	✅	✅
Manage users	❌	❌	✅
Environment Variables
Variable	Required	Default	Description
NODE_ENV	No	development	development/production
PORT	No	5000	Server port
MONGODB_URI	Yes	-	MongoDB connection string
JWT_SECRET	Yes	-	Secret for JWT signing
JWT_EXPIRES_IN	No	7d	Token expiration
SEED_DATABASE	No	false	Set to true to seed database
Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose

Authentication: JWT

Security: bcryptjs, helmet, cors, hpp

Validation: Express validator
```
