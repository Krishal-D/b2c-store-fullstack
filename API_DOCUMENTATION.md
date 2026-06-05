# Cartly API Documentation

A RESTful API for a B2C e-commerce store. Supports product browsing, cart management, order placement, and an admin panel for store management.

**Base URL:** `http://localhost:5000/api`

---

## Authentication

This API uses **JWT-based authentication**.

On login or register, you receive:
- An `accessToken` in the JSON response body — send this as a `Bearer` token on protected requests
- A `refreshToken` set as an `HttpOnly` cookie named `refreshToken` — sent automatically by the browser

**How to authenticate requests:**
```
Authorization: Bearer <accessToken>
```

**Roles:**
- `user` — default role on registration
- `admin` — required for store management endpoints

Protected routes return `401` if no valid token is provided.  
Admin-only routes return `403` if the user's role is not `admin`.

---

## Auth Endpoints

### Register

```
POST http://localhost:5000/api/auth/register
```

Creates a new user account. All three fields are required.

**Request body:**
```json
{
  "name": "Krish",
  "email": "krish@example.com",
  "password": "securepassword"
}
```

**Response `201`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Krish",
    "email": "krish@example.com",
    "role": "user"
  },
  "message": "Created new account"
}
```

**Validation errors `400`:**
- `"Name is required"` — name is missing or blank
- `"Email is required"` — email is missing or blank
- `"Password is required"` — password is missing or blank

**Conflict error `409`:**
- `"Email already in use"` — an account with that email already exists

---

### Login

```
POST http://localhost:5000/api/auth/login
```

Authenticates the user. Sets a `refreshToken` cookie and returns a new access token.

**Request body:**
```json
{
  "email": "krish@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Krish",
    "email": "krish@example.com",
    "role": "user"
  },
  "message": "Successfully logged in"
}
```

**Error `401`:** `"Invalid credentials"` — email not found or password does not match

---

### Logout

```
POST http://localhost:5000/api/auth/logout
```

Invalidates the refresh token in the database and clears the `refreshToken` cookie. No request body required.

**Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

**Error `400`:** `"Refresh token is required"` — no `refreshToken` cookie was sent

---

### Refresh Token

```
POST http://localhost:5000/api/auth/refresh
```

Rotates both tokens using the `refreshToken` cookie. No request body required.

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "krish@example.com",
    "role": "user"
  },
  "message": "New tokens created successfully"
}
```

**Errors `401`:**
- `"Refresh token is required"` — no cookie present
- `"Invalid token"` — token is expired or tampered

---

### Update Profile 🔒

```
PATCH http://localhost:5000/api/auth/profile
```

Updates the currently logged-in user's display name. Only `name` can be changed via this endpoint.

**Request body:**
```json
{
  "name": "Krish D"
}
```

**Response `200`:**
```json
{
  "user": {
    "id": 1,
    "name": "Krish D",
    "email": "krish@example.com",
    "role": "user"
  }
}
```

**Errors:**
- `400` `"Invalid name"` — name is missing, not a string, or blank
- `404` `"User not found"` — user no longer exists in the database

---

## Product Endpoints

### Get All Products

```
GET http://localhost:5000/api/products
```

Returns products. No authentication required. Supports optional query parameters.

**Query parameters (all optional):**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `search` | string | Case-insensitive name search (uses `LIKE`) | — |
| `categoryId` | integer | Filter by category ID | — |
| `page` | integer | Page number for pagination | `1` |
| `limit` | integer | Results per page | `10` |
| `sortBy` | string | Sort field: `created_at`, `price`, or `name` | `created_at` |
| `sortOrder` | string | `asc` or `desc` | `DESC` |

> **Note:** `search` and `categoryId` cannot be combined — `search` takes priority if both are provided. Pagination and sorting only apply when neither is set.

**Example (search):** `GET http://localhost:5000/api/products?search=mouse`

**Example (paginated + sorted):** `GET http://localhost:5000/api/products?page=1&limit=10&sortBy=price&sortOrder=asc`

**Response `200`:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Mouse",
      "description": "A comfortable wireless mouse",
      "price": "29.99",
      "image_url": "https://example.com/mouse.jpg",
      "stock_quantity": 100,
      "category_id": 2,
      "created_at": "2025-05-01T08:00:00Z"
    }
  ]
}
```

---

### Get Product by ID

```
GET http://localhost:5000/api/products/:id
```

Returns a single product. No authentication required.

**Example:** `GET http://localhost:5000/api/products/1`

**Response `200`:**
```json
{
  "product": {
    "id": 1,
    "name": "Wireless Mouse",
    "description": "A comfortable wireless mouse",
    "price": "29.99",
    "image_url": "https://example.com/mouse.jpg",
    "stock_quantity": 100,
    "category_id": 2,
    "created_at": "2025-05-01T08:00:00Z"
  }
}
```

**Errors:**
- `400` `"Invalid product id"` — ID is not a positive integer
- `404` `"Product not found"`

---

### Create Product 🔒 Admin

```
POST http://localhost:5000/api/products
```

Adds a new product to the store. `name`, `description`, `price`, and `stock_quantity` are required. `image_url` and `category_id` are optional.

**Request body:**
```json
{
  "name": "USB-C Hub",
  "description": "7-in-1 USB-C hub with HDMI and USB 3.0",
  "price": 49.99,
  "stock_quantity": 30,
  "image_url": "https://example.com/hub.jpg",
  "category_id": 2
}
```

**Response `201`:**
```json
{
  "product": {
    "id": 5,
    "name": "USB-C Hub",
    "description": "7-in-1 USB-C hub with HDMI and USB 3.0",
    "price": "49.99",
    "image_url": "https://example.com/hub.jpg",
    "stock_quantity": 30,
    "category_id": 2,
    "created_at": "2025-06-01T10:00:00Z"
  },
  "message": "Product created successfully"
}
```

**Validation errors `400`:**
- `"Product name is required"`
- `"Product description is required"`
- `"Product price must be greater than 0"`
- `"Stock quantity cannot be negative"`

---

### Update Product 🔒 Admin

```
PATCH http://localhost:5000/api/products/:id
```

Updates one or more fields on an existing product. All fields are optional — only include what you want to change. Uses `COALESCE` so omitted fields keep their current value.

**Example:** `PATCH http://localhost:5000/api/products/5`

**Request body:**
```json
{
  "price": 44.99,
  "stock_quantity": 25
}
```

**Response `200`:**
```json
{
  "product": {
    "id": 5,
    "name": "USB-C Hub",
    "description": "7-in-1 USB-C hub with HDMI and USB 3.0",
    "price": "44.99",
    "image_url": "https://example.com/hub.jpg",
    "stock_quantity": 25,
    "category_id": 2,
    "created_at": "2025-06-01T10:00:00Z"
  },
  "message": "Product updated successfully"
}
```

**Errors:**
- `400` `"Invalid product id"`
- `404` `"Product not found"`

---

### Delete Product 🔒 Admin

```
DELETE http://localhost:5000/api/products/:id
```

Permanently removes a product. Returns the deleted product.

**Example:** `DELETE http://localhost:5000/api/products/5`

**Response `200`:**
```json
{
  "product": {
    "id": 5,
    "name": "USB-C Hub",
    "description": "7-in-1 USB-C hub with HDMI and USB 3.0",
    "price": "44.99",
    "image_url": "https://example.com/hub.jpg",
    "stock_quantity": 25,
    "category_id": 2,
    "created_at": "2025-06-01T10:00:00Z"
  },
  "message": "Product deleted successfully"
}
```

**Errors:**
- `400` `"Invalid product id"`
- `404` `"Product not found"`

---

## Cart Endpoints

All cart endpoints require authentication 🔒. Each user has their own isolated cart.

### Get Cart Items

```
GET http://localhost:5000/api/cart
```

Returns all items in the current user's cart, joined with product details.

**Response `200`:**
```json
{
  "cartItems": [
    {
      "id": 3,
      "user_id": 1,
      "product_id": 1,
      "quantity": 2,
      "created_at": "2025-06-01T09:00:00Z",
      "name": "Wireless Mouse",
      "description": "A comfortable wireless mouse",
      "price": "29.99",
      "image_url": "https://example.com/mouse.jpg",
      "stock_quantity": 100
    }
  ]
}
```

Returns `{ "cartItems": [] }` if the cart is empty.

---

### Add Item to Cart 🔒

```
POST http://localhost:5000/api/cart
```

Adds a product to the cart. If the product already exists in the cart, the quantities are merged (existing quantity + new quantity).

**Request body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response `201`:**
```json
{
  "cartItem": {
    "id": 3,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2,
    "created_at": "2025-06-01T09:00:00Z"
  },
  "message": "Item added to cart"
}
```

**Validation errors `400`:**
- `"Valid product id is required"` — product_id is missing or not a positive integer
- `"Quantity must be greater than 0"`

---

### Update Cart Item 🔒

```
PATCH http://localhost:5000/api/cart/:id
```

Sets a new quantity for a specific cart item. Use the cart item's `id` (not the `product_id`) in the URL. Only updates items belonging to the current user.

**Example:** `PATCH http://localhost:5000/api/cart/3`

**Request body:**
```json
{
  "quantity": 4
}
```

**Response `200`:**
```json
{
  "cartItem": {
    "id": 3,
    "user_id": 1,
    "product_id": 1,
    "quantity": 4,
    "created_at": "2025-06-01T09:00:00Z"
  },
  "message": "Cart item updated"
}
```

**Errors:**
- `400` `"Invalid cart item id"`
- `400` `"Quantity must be greater than 0"`
- `404` `"Cart item not found"`

---

### Remove Cart Item 🔒

```
DELETE http://localhost:5000/api/cart/:id
```

Removes an item from the cart. Only removes items belonging to the current user. Returns the deleted item.

**Example:** `DELETE http://localhost:5000/api/cart/3`

**Response `200`:**
```json
{
  "cartItem": {
    "id": 3,
    "user_id": 1,
    "product_id": 1,
    "quantity": 4,
    "created_at": "2025-06-01T09:00:00Z"
  },
  "message": "Cart item deleted"
}
```

**Errors:**
- `400` `"Invalid cart item id"`
- `404` `"Cart item not found"`

---

## Order Endpoints

### Checkout 🔒

```
POST http://localhost:5000/api/orders/checkout
```

Converts the current user's cart into an order. No request body required.

The service will:
1. Validate every cart item has sufficient stock
2. Calculate the total from current product prices
3. Create the order and order items
4. Reduce stock for each product
5. Clear the cart

**Response `201`:**
```json
{
  "order": {
    "id": 10,
    "user_id": 1,
    "total_amount": "59.98",
    "status": "pending",
    "created_at": "2025-06-01T10:00:00Z"
  },
  "message": "Checkout completed successfully"
}
```

**Errors:**
- `400` `"Cart is empty"` — no items in cart
- `400` `"Not enough stock for Wireless Mouse"` — a product has insufficient stock
- `404` `"Product 1 not found"` — a cart item references a deleted product

---

### Get My Orders 🔒

```
GET http://localhost:5000/api/orders
```

Returns all orders placed by the currently logged-in user, ordered newest first.

**Response `200`:**
```json
{
  "orders": [
    {
      "id": 10,
      "user_id": 1,
      "total_amount": "59.98",
      "status": "pending",
      "created_at": "2025-06-01T10:00:00Z"
    }
  ]
}
```

---

### Get All Orders 🔒 Admin

```
GET http://localhost:5000/api/orders/admin/all
```

Returns every order across all users, ordered newest first. Admin only.

**Response `200`:**
```json
{
  "orders": [
    {
      "id": 11,
      "user_id": 3,
      "total_amount": "79.99",
      "status": "paid",
      "created_at": "2025-06-02T14:30:00Z"
    },
    {
      "id": 10,
      "user_id": 1,
      "total_amount": "59.98",
      "status": "pending",
      "created_at": "2025-06-01T10:00:00Z"
    }
  ]
}
```

---

### Get Order Items 🔒

```
GET http://localhost:5000/api/orders/:id/items
```

Returns the line items for a specific order, joined with product details. Regular users can only view their own orders. Admins can view any order.

**Example:** `GET http://localhost:5000/api/orders/10/items`

**Response `200`:**
```json
{
  "orderItems": [
    {
      "id": 1,
      "order_id": 10,
      "product_id": 1,
      "quantity": 2,
      "price": "29.99",
      "name": "Wireless Mouse",
      "description": "A comfortable wireless mouse",
      "image_url": "https://example.com/mouse.jpg"
    }
  ]
}
```

**Errors:**
- `400` `"Invalid order id"`
- `403` `"Access denied"` — order belongs to a different user
- `404` `"Order not found"`

---

## Category Endpoints

### Get All Categories

```
GET http://localhost:5000/api/categories
```

Returns all categories ordered alphabetically. No authentication required.

**Response `200`:**
```json
{
  "categories": [
    { "id": 2, "name": "Accessories" },
    { "id": 1, "name": "Electronics" }
  ]
}
```

---

### Create Category 🔒 Admin

```
POST http://localhost:5000/api/categories
```

Adds a new product category.

**Request body:**
```json
{
  "name": "Home & Living"
}
```

**Response `201`:**
```json
{
  "category": {
    "id": 3,
    "name": "Home & Living"
  },
  "message": "Category created successfully"
}
```

**Error `400`:** `"Category name is required"` — name is missing or blank

---

## Payment Endpoints

### Mock Checkout 🔒

```
POST http://localhost:5000/api/payment/mock-checkout
```

Simulates a full payment flow. Runs `checkout` internally (creates the order, clears the cart, reduces stock), then marks the order as `paid`.

> **This is a mock endpoint for development and testing only.** No real payment is processed. Replace with a real payment provider (e.g. Stripe) before going to production.

**Demo card number:** `4242 4242 4242 4242` — any other number will be rejected.

**Request body:**
```json
{
  "cardName": "Krish D",
  "cardNumber": "4242424242424242",
  "expiry": "12/27",
  "cvv": "123"
}
```

**Response `201`:**
```json
{
  "order": {
    "id": 10,
    "user_id": 1,
    "total_amount": "59.98",
    "status": "paid",
    "created_at": "2025-06-01T10:00:00Z"
  },
  "payment": {
    "provider": "mock",
    "status": "paid"
  },
  "message": "Mock payment completed successfully"
}
```

**Validation errors `400`:**
- `"All payment fields are required"` — any field is missing
- `"Use demo card number 4242 4242 4242 4242"` — wrong card number
- `"Invalid CVV"` — CVV is not 3 or 4 digits
- `"Cart is empty"` — no items to check out

---

## Error Responses

All error responses use this shape:

```json
{
  "message": "Description of what went wrong"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request — missing or invalid input |
| `401` | Not authenticated — missing or expired access token |
| `403` | Not authorised — insufficient role or accessing another user's resource |
| `404` | Not found — the requested resource does not exist |
| `409` | Conflict — e.g. email already registered |
| `500` | Server error — something went wrong on the server |