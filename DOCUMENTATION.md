# 💰 FINANCE DASHBOARD BACKEND API

## Complete Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Live Deployment](#live-deployment)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Features](#features)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Postman Setup](#postman-setup)
9. [Database Schema](#database-schema)
10. [API Endpoints](#api-endpoints)
11. [Authentication & Authorization](#authentication--authorization)
12. [Error Handling](#error-handling)
13. [Testing](#testing)
14. [Project Structure](#project-structure)
15. [Submission Checklist](#submission-checklist)

---

## 🎯 Project Overview

### **Objective**

Build a robust backend API for a finance dashboard system that enables users to track income/expenses, generate analytics, and visualize financial data with role-based access control.

This backend project enables small to medium businesses to track income/expenses, generate financial analytics, visualize data through charts, and enforce role-based access control across multiple team members (Admin, Analyst, Viewer).

### usiness Use Cases

- Small businesses: for tracking income and expenses
- Teams: for team members needing role-based financial data access
- Managers: for viewing analytics and trends (Analyst role)
- indivisual user: can create and manage their personal data (Admin role)
- Employees: for viewing only their own transactions (Viewer role)

### **Key Capabilities**

| Capability                                 | Status |
| ------------------------------------------ | ------ |
| User authentication with JWT               | ✅     |
| Role-based access (Admin/Analyst/Viewer)   | ✅     |
| Complete financial record CRUD operations  | ✅     |
| Advanced filtering, search, and pagination | ✅     |
| Dashboard analytics and summaries          | ✅     |
| 7+ visualization endpoints for charts      | ✅     |
| Comprehensive error handling               | ✅     |

---

## 🌐 Live Deployment

### **Deployed API URL**

```
https://zorvyn-backend-assessment-u56z.onrender.com
```

### **Base URL for API Calls**

```
https://zorvyn-backend-assessment-u56z.onrender.com/api/v1
```

### **⚠️ Important Note for Deployed Version**

> **Render Free Tier Warning:** The deployed API is on Render's free tier. If inactive for 15+ minutes, it will "sleep." The first request after sleep may take **30-50 seconds** to respond. Subsequent requests will be normal speed.

### **Health Check Endpoints**

| Environment             | Health Check URL                                                    |
| ----------------------- | ------------------------------------------------------------------- |
| **Production (Render)** | `https://zorvyn-backend-assessment-u56z.onrender.com/health`        |
| **Production (Render)** | `https://zorvyn-backend-assessment-u56z.onrender.com/api/v1/health` |
| **Local**               | `http://localhost:5000/health`                                      |

---

## 🏗️ System Architecture

### high Level Backend Architecture

![alt text](image-1.png)

### Backend API Work Flow Architecture

## ![alt text](image.png)

## 🛠️ Technology Stack

| Category             | Technology | Version | Purpose                       |
| -------------------- | ---------- | ------- | ----------------------------- |
| **Runtime**          | Node.js    | 18.x    | JavaScript runtime            |
| **Framework**        | Express.js | 5.x     | Web framework                 |
| **Database**         | MongoDB    | 6.x     | NoSQL database                |
| **ODM**              | Mongoose   | 7.x     | Object data modeling          |
| **Authentication**   | JWT        | 9.x     | Token-based auth              |
| **Password Hashing** | bcryptjs   | 2.x     | Secure password storage       |
| **Security**         | helmet     | 7.x     | HTTP headers security         |
| **Security**         | cors       | 2.x     | Cross-origin resource sharing |
| **Security**         | hpp        | 0.2.x   | HTTP parameter pollution      |
| **Validation**       | validator  | 13.x    | Email/input validation        |
| **Logging**          | morgan     | 1.x     | HTTP request logging          |

---

## ✨ Features

### **Core Features (100% Complete)**

| #   | Feature           | Status | Description                             |
| --- | ----------------- | ------ | --------------------------------------- |
| 1   | User Registration | ✅     | Signup with auto-assigned VIEWER role   |
| 2   | User Login        | ✅     | JWT token-based authentication          |
| 3   | Role-Based Access | ✅     | Admin, Analyst, Viewer roles            |
| 4   | Create Records    | ✅     | Add income/expense transactions (Admin) |
| 5   | Read Records      | ✅     | View with filters, search, pagination   |
| 6   | Update Records    | ✅     | Modify existing transactions (Admin)    |
| 7   | Delete Records    | ✅     | Remove transactions (Admin)             |
| 8   | User Management   | ✅     | Admin can manage all users              |
| 9   | Dashboard Summary | ✅     | Total income, expense, balance          |
| 10  | Category Stats    | ✅     | Spending/earning by category            |
| 11  | Recent Activity   | ✅     | Last 10 transactions                    |
| 12  | Monthly Trends    | ✅     | Income/expense trends (Analyst+)        |

### **Advanced Features (Bonus)**

| #   | Feature           | Status | Description                         |
| --- | ----------------- | ------ | ----------------------------------- |
| 13  | Pagination        | ✅     | Page-based record listing           |
| 14  | Search            | ✅     | Case-insensitive description search |
| 15  | Date Range Filter | ✅     | Filter by custom date ranges        |
| 16  | Category Filter   | ✅     | Filter by transaction category      |
| 17  | Type Filter       | ✅     | Filter by income/expense            |
| 18  | User Deactivation | ✅     | Admin can activate/deactivate users |

### **Visualization APIs (7 Endpoints)**

| #   | Endpoint        | Chart Type     | Features                                |
| --- | --------------- | -------------- | --------------------------------------- |
| 19  | `/monthly`      | Bar Chart      | Monthly comparison, custom periods      |
| 20  | `/categories`   | Pie Chart      | Category breakdown, both income/expense |
| 21  | `/trends`       | Line Chart     | Trends with projection, comparison      |
| 22  | `/stacked`      | Stacked Bar    | Income vs expense by category           |
| 23  | `/top-expenses` | Horizontal Bar | Top spending categories                 |
| 24  | `/cashflow`     | Area Chart     | Cumulative balance over time            |
| 25  | `/compare`      | Comparison     | MoM/YoY comparison dashboard            |

---

## 🔧 Installation & Setup

### **Prerequisites**

```bash
Node.js 18+
MongoDB Atlas account (or local MongoDB)
npm or yarn package manager
```

### **Step 1: Clone Repository**

```bash
git clone https://github.com/JAIKUMAR07/Zorvyn-Backend-Assessment.git
cd backend
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Environment Setup**

```bash
cp .env.example .env
```

**Edit `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (use local or Atlas)
MONGODB_URI=mongodb://localhost:27017/finance_manager
# OR use Atlas: mongodb+srv://username:password@cluster.mongodb.net/finance_db

# JWT Authentication
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=90d

# Optional
DEBUG_AUTH=false
```

### **Step 4: Seed Database**

```bash
npm run seed
```

**Expected Output:**

```
✅ Connected to MongoDB
🗑️ Cleared 0 users
🗑️ Cleared 0 records
✅ Created 5 users
✅ Created XXX records for admin@finance.com (admin)
...
🎉 DATABASE SEEDED SUCCESSFULLY!

🔐 TEST CREDENTIALS:
| Role     | Email                    | Password   |
| Admin    | admin@finance.com        | admin123   |
| Analyst  | analyst@finance.com      | analyst123 |
| Viewer   | viewer@finance.com       | viewer123 |
```

### **Step 5: Start Server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### **Step 6: Verify Installation**

```bash
# Local verification
curl http://localhost:5000/health

# Deployed verification
curl https://zorvyn-backend-assessment-u56z.onrender.com/health
```

**Expected Response:**

```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2026-04-03T10:00:00.000Z"
}
```

---

## 🔐 Environment Variables

| Variable         | Required | Default     | Description                |
| ---------------- | -------- | ----------- | -------------------------- |
| `PORT`           | No       | 5000        | Server port                |
| `NODE_ENV`       | No       | development | Environment mode           |
| `MONGODB_URI`    | **Yes**  | -           | MongoDB connection string  |
| `JWT_SECRET`     | **Yes**  | -           | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | No       | 90d         | Token expiration time      |
| `DEBUG_AUTH`     | No       | false       | Enable auth debugging      |

---

## 📮 Postman Setup

### **Important: Environment Configuration**

You have **TWO** Postman files in the repository:

| File                   | Purpose                          |
| ---------------------- | -------------------------------- |
| `api_collections.json` | All API endpoints (54+ requests) |
| `api_env.json`         | Environment variables template   |

### **Step 1: Import Collection**

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `api_collections.json`
4. Click **Import**

### **Step 2: Import Environment**

1. Click **Import** → **Upload Files**
2. Select `api_env.json`
3. Click **Import**

### **Step 3: Configure Environment Variables**

The `api_env.json` contains:

```json
{
  "base_url": "http://localhost:5000",
  "auth_token": "",
  "record_id": "",
  "user_id": ""
}
```

**⚠️ IMPORTANT: Change `base_url` based on your testing environment:**

| Testing Environment      | Set `base_url` to                                     |
| ------------------------ | ----------------------------------------------------- |
| **Local Testing**        | `http://localhost:5000`                               |
| **Deployed API Testing** | `https://zorvyn-backend-assessment-u56z.onrender.com` |

### **Step 4: Select Environment**

1. Click the environment dropdown in top-right corner
2. Select **"Finance Backend API Environment"**
3. Verify `base_url` is set correctly

### **Step 5: Auto Token Management**

The collection has **auto-save scripts** that will:

- ✅ Automatically save JWT token after login
- ✅ Automatically save `record_id` after creating a record
- ✅ Automatically save `user_id` after fetching users

### **Step 6: Test the Setup**

Run in this order:

1. **Login - Admin** (token auto-saved)
2. **Create Record** (record_id auto-saved)
3. **Get All Users** (user_id auto-saved)
4. Test any other endpoint

---

## 📊 Database Schema

### **Users Collection**

```javascript
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, hashed, min 8 chars)",
  "role": "String (enum: viewer, analyst, admin, default: viewer)",
  "active": "Boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **Records Collection**

```javascript
{
  "_id": "ObjectId",
  "amount": "Number (required, >0)",
  "type": "String (required, enum: income, expense)",
  "category": "String (required)",
  "description": "String (optional)",
  "date": "Date (default: now)",
  "user": "ObjectId (ref: User, required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🌐 API Endpoints

### **Base URL**

```
# Local Development
http://localhost:5000/api/v1

# Production (Render)
https://zorvyn-backend-assessment-u56z.onrender.com/api/v1
```

### **Authentication Headers**

```
Authorization: Bearer <your-jwt-token>
```

---

### **1. Authentication Routes** (`/auth`)

| Method | Endpoint  | Description                     | Access        |
| ------ | --------- | ------------------------------- | ------------- |
| POST   | `/signup` | Register new user (role=viewer) | Public        |
| POST   | `/login`  | Login with email/password       | Public        |
| GET    | `/me`     | Get current user profile        | Authenticated |

**Example: Login Request (Local)**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'
```

**Example: Login Request (Deployed)**

```bash
curl -X POST https://zorvyn-backend-assessment-u56z.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'
```

**Example: Login Response**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@finance.com",
      "role": "admin",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

---

### **2. Record Routes** (`/records`)

| Method | Endpoint | Description                    | Access        |
| ------ | -------- | ------------------------------ | ------------- |
| GET    | `/`      | Get all records (with filters) | Authenticated |
| POST   | `/`      | Create new record              | Admin only    |
| GET    | `/:id`   | Get single record              | Authenticated |
| PATCH  | `/:id`   | Update record                  | Admin only    |
| DELETE | `/:id`   | Delete record                  | Admin only    |

**Query Parameters for GET `/records`**

| Parameter  | Type   | Example      | Description              |
| ---------- | ------ | ------------ | ------------------------ |
| `type`     | string | `income`     | Filter by type           |
| `category` | string | `Food`       | Filter by category       |
| `search`   | string | `salary`     | Search in description    |
| `fromDate` | date   | `2026-01-01` | Start date               |
| `toDate`   | date   | `2026-12-31` | End date                 |
| `page`     | number | `1`          | Page number              |
| `limit`    | number | `50`         | Items per page (max 200) |

**Example: Filtered Request**

```
GET /api/v1/records?type=expense&category=Food&fromDate=2026-01-01&toDate=2026-12-31&page=1&limit=20
```

---

### **3. Dashboard Routes** (`/dashboard`)

| Method | Endpoint          | Description                   | Access         |
| ------ | ----------------- | ----------------------------- | -------------- |
| GET    | `/summary`        | Income/expense/balance totals | Authenticated  |
| GET    | `/category-stats` | Totals per category           | Authenticated  |
| GET    | `/recent`         | Last 10 transactions          | Authenticated  |
| GET    | `/trends`         | Monthly income/expense trends | Analyst, Admin |

**Example: Summary Response**

```json
{
  "status": "success",
  "data": {
    "income": 325000,
    "expense": 198000,
    "balance": 127000
  }
}
```

---

### **4. Visualization Routes** (`/visualizations`)

| Method | Endpoint        | Chart Type     | Description                       |
| ------ | --------------- | -------------- | --------------------------------- |
| GET    | `/monthly`      | Bar Chart      | Monthly income/expense comparison |
| GET    | `/categories`   | Pie Chart      | Category breakdown                |
| GET    | `/trends`       | Line Chart     | Trends over time                  |
| GET    | `/stacked`      | Stacked Bar    | Income vs expense by category     |
| GET    | `/top-expenses` | Horizontal Bar | Highest spending categories       |
| GET    | `/cashflow`     | Area Chart     | Cumulative balance over time      |
| GET    | `/compare`      | Comparison     | MoM/YoY comparison                |

**Example: Monthly Comparison (Local)**

```bash
curl -X GET "http://localhost:5000/api/v1/visualizations/monthly?period=thisYear" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Example: Monthly Comparison (Deployed)**

```bash
curl -X GET "https://zorvyn-backend-assessment-u56z.onrender.com/api/v1/visualizations/monthly?period=thisYear" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### **5. User Management Routes** (`/users`) - Admin Only

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/`           | Get all users            |
| PATCH  | `/:id`        | Update user role/details |
| PATCH  | `/status/:id` | Activate/deactivate user |

---

## 🔒 Authentication & Authorization

### **Role-Based Access Control (RBAC)**

| Action                 | Viewer | Analyst | Admin |
| ---------------------- | ------ | ------- | ----- |
| View own records       | ✅     | ✅      | ✅    |
| View all records       | ❌     | ❌      | ✅    |
| Create records         | ❌     | ❌      | ✅    |
| Update records         | ❌     | ❌      | ✅    |
| Delete records         | ❌     | ❌      | ✅    |
| View dashboard summary | ✅     | ✅      | ✅    |
| View category stats    | ✅     | ✅      | ✅    |
| View recent activity   | ✅     | ✅      | ✅    |
| View monthly trends    | ❌     | ✅      | ✅    |
| Manage users           | ❌     | ❌      | ✅    |

### **Test Credentials (After Seeding)**

| Role        | Email               | Password    |
| ----------- | ------------------- | ----------- |
| **Admin**   | admin@finance.com   | admin123    |
| **Analyst** | analyst@finance.com | analyst123  |
| **Viewer**  | viewer@finance.com  | viewer123   |
| **Viewer**  | sarah@example.com   | password123 |
| **Analyst** | michael@example.com | password123 |

---

## ⚠️ Error Handling

### **HTTP Status Codes**

| Status | Meaning      | Example                  |
| ------ | ------------ | ------------------------ |
| 200    | Success      | Request completed        |
| 201    | Created      | Resource created         |
| 204    | No Content   | Delete successful        |
| 400    | Bad Request  | Invalid input            |
| 401    | Unauthorized | Missing/invalid token    |
| 403    | Forbidden    | Insufficient permissions |
| 404    | Not Found    | Resource doesn't exist   |
| 500    | Server Error | Internal error           |

### **Error Response Format**

```json
{
  "status": "fail",
  "message": "Specific error description"
}
```

---

## 🧪 Testing Guide

### **Option 1: Test Deployed API (Easiest)**

```
Base URL: https://zorvyn-backend-assessment-u56z.onrender.com/api/v1

⚠️ First request may take 30-50 seconds (Render free tier cold start)
```

### **Option 2: Test Locally (Recommended)**

```
Base URL: http://localhost:5000/api/v1

1. Clone repository
2. npm install
3. npm run seed
4. npm run dev
5. Import Postman collection
6. Set base_url = http://localhost:5000
7. Start testing
```

### **Quick Test Commands**

```bash
# Health Check
curl https://zorvyn-backend-assessment-u56z.onrender.com/health

# Login
curl -X POST https://zorvyn-backend-assessment-u56z.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"admin123"}'

# Get Dashboard Summary (use token from login response)
curl -X GET https://zorvyn-backend-assessment-u56z.onrender.com/api/v1/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
finance-backend/
│
├── scripts/
│   └── seed.js                 # Database seeding script
│
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── dashboardController.js
│   │   ├── recordController.js # CRUD operations
│   │   ├── userController.js
│   │   └── visualizationController.js # Chart endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── errorMiddleware.js
│   │   └── sanitizeMiddleware.js
│   │
│   ├── models/
│   │   ├── Record.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── recordRoutes.js
│   │   ├── userRoutes.js
│   │   └── visualizationRoutes.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   ├── escapeRegExp.js
│   │   └── filterObject.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── api_collections.json        # Postman collection
├── api_env.json                # Postman environment
├── package.json
├── README.md
└── server.js
```

---

## 🎯 Conclusion

This Finance Backend API provides a **complete, production-ready solution** with:

- ✅ **Local Development** - Run on `http://localhost:5000`
- ✅ **Deployed API** - Available at `https://zorvyn-backend-assessment-u56z.onrender.com`
- ✅ **Postman Ready** - Import `api_collections.json` and `api_env.json`
- ✅ **Auto Token Management** - No manual token copying needed
- ✅ **7+ Visualization Endpoints** - Chart-ready data
- ✅ **Complete Documentation** - Everything you need

---

## 📞 Quick Reference

| Item                        | Value                                                      |
| --------------------------- | ---------------------------------------------------------- |
| **GitHub Repository**       | https://github.com/JAIKUMAR07/Zorvyn-Backend-Assessment    |
| **Deployed API**            | https://zorvyn-backend-assessment-u56z.onrender.com        |
| **API Base URL (Local)**    | http://localhost:5000/api/v1                               |
| **API Base URL (Deployed)** | https://zorvyn-backend-assessment-u56z.onrender.com/api/v1 |
| **Health Check**            | `{base_url}/health`                                        |
| **Postman Collection**      | `api_collections.json`                                     |
| **Postman Environment**     | `api_env.json`                                             |

---

**Last Updated:** April 2026  
**Status:** ✅ Production Ready

---
