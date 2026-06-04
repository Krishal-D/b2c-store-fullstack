# Cartly – B2C E-Commerce Platform

## Overview

Cartly is a full-stack B2C e-commerce platform that allows customers to browse products, manage a shopping cart, place orders, and complete payments through a simulated checkout process. The platform also includes an administrative interface for managing products and monitoring customer orders.

The application was developed using React, TypeScript, Express.js, PostgreSQL, and JWT-based authentication.

---

## Features

### Customer Features

* User registration and login
* JWT authentication with refresh tokens
* Browse products
* Search products
* Filter products by category
* View product details
* Add products to cart
* Update cart quantities
* Remove products from cart
* Checkout and payment simulation
* View order history
* View order details
* Manage profile information

### Administrator Features

* Secure administrator login
* Dashboard overview
* Create products
* Edit products
* Delete products
* View all customer orders

---

## Technology Stack

### Frontend

* React
* TypeScript
* React Router
* Axios
* Tailwind CSS
* React Hot Toast

### Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication
* bcrypt

### Database

* PostgreSQL
* Neon PostgreSQL

### Testing

* Jest
* Supertest
* Playwright

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

## System Architecture

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

## Authentication

The application uses JWT-based authentication with refresh token support.

### Security Features

* Access Token authentication
* Refresh Token rotation
* HTTP-only cookies
* Protected routes
* Role-based authorization
* Password hashing using bcrypt

---

## Database Schema

### Main Tables

* Users
* Categories
* Products
* Cart Items
* Orders
* Order Items
* Reviews

### Relationships

* One user can create multiple orders
* One order can contain multiple order items
* One category can contain multiple products
* One product can receive multiple reviews

---

## API Endpoints

### Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| POST   | `/api/auth/logout`   |
| POST   | `/api/auth/refresh`  |

### Products

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/products`     |
| GET    | `/api/products/:id` |
| POST   | `/api/products`     |
| PUT    | `/api/products/:id` |
| DELETE | `/api/products/:id` |

### Cart

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/api/cart`     |
| POST   | `/api/cart`     |
| PUT    | `/api/cart/:id` |
| DELETE | `/api/cart/:id` |

### Orders

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/orders/checkout`  |
| GET    | `/api/orders`           |
| GET    | `/api/orders/:id/items` |
| GET    | `/api/orders/admin/all` |

### Categories

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/api/categories` |
| POST   | `/api/categories` |

### Payments

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/payments/process` |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Krishal-D/b2c-store-fullstack.git
cd b2c-store-fullstack
```

### Backend Setup

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### End-to-End Tests

```bash
cd frontend
npm run test:e2e
```

### Test Coverage

* User authentication
* Product browsing
* Product management
* Cart operations
* Checkout process
* Order history
* Profile management
* Administrator workflows

---

## Deployment

### Production Environment

| Service  | Platform |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Render   |
| Database | Neon     |

---


## Future Improvements

* Category management interface
* Product sorting functionality
* Product image uploads
* Email notifications
* Real payment gateway integration
* Advanced analytics dashboard
* Dark mode support

---

## Author

**Krishal Dhungana**

Bachelor of Information and Communication Technology

Major Project – Full Stack Development
