# B2C Store Backend

## Overview

This project is the backend implementation of a full-stack Business-to-Consumer (B2C) ecommerce application. The backend provides RESTful APIs for authentication, product management, shopping cart functionality, order processing, category filtering, and administrative operations.

The application is built using Express.js, TypeScript, PostgreSQL, and JWT authentication.

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL

## Authentication

* JWT Access Tokens
* JWT Refresh Tokens
* HttpOnly Cookies
* bcrypt password hashing

## Testing

* Jest
* Supertest

## CI/CD

* GitHub Actions

---

# Features

## Authentication

* User registration
* User login/logout
* JWT authentication
* Refresh token rotation
* Role-based authorization
* Admin-protected routes

## Products

* Create products
* Update products
* Delete products
* View all products
* Product pagination
* Product sorting
* Product search
* Category filtering
* Stock management

## Categories

* Create categories
* Retrieve categories
* Category-based filtering

## Shopping Cart

* Add products to cart
* Update cart quantity
* Remove cart items
* Duplicate item quantity merging
* Secure cart ownership validation

## Orders

* Checkout system
* Order creation
* Order item records
* Purchase history
* Admin order viewing
* Stock validation during checkout
* Secure order ownership validation

---

# Project Structure

```txt
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── tests/
│
├── app.ts
├── server.ts
├── migrate.ts
├── package.json
└── tsconfig.json
```

---

# Database Schema

## Users

Stores authentication and user role information.

| Column        | Type               |
| ------------- | ------------------ |
| id            | SERIAL PRIMARY KEY |
| name          | VARCHAR(100)       |
| email         | TEXT UNIQUE        |
| password      | VARCHAR(100)       |
| refresh_token | TEXT               |
| role          | VARCHAR(20)        |
| created_at    | TIMESTAMP          |

## Products

Stores product details.

| Column         | Type               |
| -------------- | ------------------ |
| id             | SERIAL PRIMARY KEY |
| name           | VARCHAR(100)       |
| description    | TEXT               |
| price          | NUMERIC            |
| image_url      | TEXT               |
| stock_quantity | INTEGER            |
| category_id    | INTEGER            |
| created_at     | TIMESTAMP          |

## Categories

Stores product categories.

| Column     | Type               |
| ---------- | ------------------ |
| id         | SERIAL PRIMARY KEY |
| name       | VARCHAR(100)       |
| created_at | TIMESTAMP          |

## Cart Items

Stores user cart information.

| Column     | Type               |
| ---------- | ------------------ |
| id         | SERIAL PRIMARY KEY |
| user_id    | INTEGER            |
| product_id | INTEGER            |
| quantity   | INTEGER            |
| created_at | TIMESTAMP          |

## Orders

Stores completed purchase records.

| Column       | Type               |
| ------------ | ------------------ |
| id           | SERIAL PRIMARY KEY |
| user_id      | INTEGER            |
| total_amount | NUMERIC            |
| status       | VARCHAR(50)        |
| created_at   | TIMESTAMP          |

## Order Items

Stores purchased products for each order.

| Column     | Type               |
| ---------- | ------------------ |
| id         | SERIAL PRIMARY KEY |
| order_id   | INTEGER            |
| product_id | INTEGER            |
| quantity   | INTEGER            |
| price      | NUMERIC            |
| created_at | TIMESTAMP          |

---

# Authentication Flow

## Registration

1. User submits registration form.
2. Password is hashed using bcrypt.
3. User record is stored in PostgreSQL.
4. Access token and refresh token are generated.
5. Refresh token is stored in database and cookie.

## Login

1. User submits email and password.
2. Password is verified using bcrypt.
3. Access token and refresh token are generated.
4. Refresh token cookie is returned.

## Protected Routes

Protected routes require:

```txt
Authorization: Bearer <token>
```

Admin-only routes additionally require:

```txt
role = admin
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | /api/auth/register | Register new user         |
| POST   | /api/auth/login    | Login user                |
| POST   | /api/auth/logout   | Logout user               |
| POST   | /api/auth/refresh  | Generate new access token |

## Products

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | /api/products               | Get all products       |
| GET    | /api/products?search=iphone | Search products        |
| GET    | /api/products?categoryId=1  | Filter by category     |
| POST   | /api/products               | Create product (Admin) |
| PATCH  | /api/products/:id           | Update product (Admin) |
| DELETE | /api/products/:id           | Delete product (Admin) |

## Categories

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| GET    | /api/categories | Get categories          |
| POST   | /api/categories | Create category (Admin) |

## Cart

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | /api/cart     | Get cart items       |
| POST   | /api/cart     | Add item to cart     |
| PATCH  | /api/cart/:id | Update cart quantity |
| DELETE | /api/cart/:id | Delete cart item     |

## Orders

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /api/orders/checkout  | Checkout cart          |
| GET    | /api/orders           | Get user orders        |
| GET    | /api/orders/:id/items | Get order items        |
| GET    | /api/orders/admin/all | Get all orders (Admin) |

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/b2c_store
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

---

# Running the Backend

## Development Mode

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Start Production Server

```bash
npm run start
```

---

# Database Migration

Run migrations using:

```bash
npx ts-node migrate.ts
```

---

# Testing

## Run Tests

```bash
npm test
```

## Current Test Coverage

* Authentication flow tests
* Protected route tests
* Product API tests
* Integration tests using Supertest

---

# CI Pipeline

GitHub Actions is configured to:

* Install dependencies
* Build the TypeScript backend
* Run tests automatically

Workflow file:

```txt
.github/workflows/backend-ci.yml
```

---

# Security Features

* Password hashing using bcrypt
* JWT authentication
* Refresh token rotation
* HttpOnly secure cookies
* Role-based authorization
* Cart ownership validation
* Order ownership validation
* Stock validation during checkout

---

# Future Improvements

* Stripe payment integration
* Image upload support
* Transaction-safe checkout
* Product reviews and ratings
* Wishlist functionality
* Email notifications
* Advanced analytics dashboard
* Redis caching
* Docker deployment

---

# Author

Krishal Dhungana

Western Sydney University
