# Cartly – B2C E-Commerce Platform

## Live Demo

**Frontend:**
https://cartly-b2c.vercel.app/

**Backend API:**
https://cartly-backend.onrender.com


---
## Documentation

- Project Documentation: README.md
- API Documentation: API_DOCUMENTATION.md

---

# Overview

Cartly is a full-stack B2C e-commerce platform that enables customers to browse products, manage shopping carts, place orders, and complete payments through a simulated checkout process.

The platform also provides an administrator interface for managing products and monitoring customer orders.

The application was developed using React, TypeScript, Express.js, PostgreSQL, and JWT-based authentication following a modern client-server architecture.

---

# Features

## Customer Features

* User registration
* User login
* JWT authentication with refresh tokens
* Browse products
* Search products by name
* Filter products by category
* View product details
* Add products to cart
* Update cart quantities
* Remove products from cart
* Simulated payment checkout
* View order history
* View order details
* Manage profile information
* Secure logout

## Administrator Features

* Secure administrator login
* Administrator dashboard
* Create products
* Edit products
* Delete products
* View all customer orders
* Monitor order statuses

---

# Technology Stack

## Frontend

* React
* TypeScript
* React Router
* Axios
* Tailwind CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication
* bcrypt

## Database

* PostgreSQL
* Neon PostgreSQL Cloud Database

## Testing

* Jest
* Supertest
* Playwright

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

# System Architecture

```text
React Frontend
       │
       ▼
Express REST API
       │
       ▼
PostgreSQL Database
```

---

# Project Structure

```text
b2c-store-fullstack
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   └── types
│   │
│   └── tests
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── migrations
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── types
│   │
│   ├── tests
│   ├── migrate.ts
│   └── seed.ts
│
└── README.md
```

---

# Authentication

The application uses JWT-based authentication with refresh token support.

## Security Features

* Access token authentication
* Refresh token rotation
* HTTP-only cookies
* Protected routes
* Role-based authorization
* Password hashing using bcrypt

---

# Database Schema

## Main Tables

* Users
* Categories
* Products
* Cart Items
* Orders
* Order Items
* Reviews

## Relationships

* One user can create multiple orders
* One order can contain multiple order items
* One category can contain multiple products
* One product can receive multiple reviews

---

# API Endpoints

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| POST   | `/api/auth/logout`   |
| POST   | `/api/auth/refresh`  |

## Products

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/products`     |
| GET    | `/api/products/:id` |
| POST   | `/api/products`     |
| PUT    | `/api/products/:id` |
| DELETE | `/api/products/:id` |

## Cart

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/api/cart`     |
| POST   | `/api/cart`     |
| PUT    | `/api/cart/:id` |
| DELETE | `/api/cart/:id` |

## Orders

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/orders/checkout`  |
| GET    | `/api/orders`           |
| GET    | `/api/orders/:id/items` |
| GET    | `/api/orders/admin/all` |

## Categories

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/api/categories` |
| POST   | `/api/categories` |

## Payments

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/payments/process` |

---

# Environment Variables

## Backend (.env)

Create a `.env` file inside the backend folder:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Frontend (.env)

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Local Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Krishal-D/b2c-store-fullstack.git
cd b2c-store-fullstack
```

---

## 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npx ts-node migrate.ts
```

Seed initial data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Running Tests

## Backend Tests

```bash
cd backend
npm test
```

## End-to-End Tests

```bash
cd frontend
npm run test:e2e
```

## Test Coverage

The application includes automated tests covering:

* User authentication
* Product browsing
* Product management
* Cart operations
* Checkout process
* Order management
* Profile management
* Administrator workflows

---

# Deployment Instructions

## Database Deployment (Neon)

1. Create a Neon PostgreSQL database.
2. Copy the connection string.
3. Configure the connection string as `DATABASE_URL`.

---

## Backend Deployment (Render)

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set the Root Directory to:

```text
backend
```

Build Command:

```bash
npm install --include=dev && npm run build
```

Start Command:

```bash
npm start
```

Configure the following environment variables:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Database Initialization

After configuring the production database, run:

```bash
npx ts-node migrate.ts
npm run seed
```

This creates the database schema and administrator account.

---

## Frontend Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to:

```text
frontend
```

Configure:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

Deploy the application.

---

# Default Administrator Account

```text
Email: admin@cartly.com
Password: Admin123!
```

The administrator account is automatically created by the seed script.

---


# Future Improvements

* Product sorting functionality
* Category management interface
* Email notifications
* Real payment gateway integration
* Analytics dashboard
* Dark mode support

---

# Author

**Krishal Dhungana**

Bachelor of Information and Communication Technology

Major Project – Full Stack Development
