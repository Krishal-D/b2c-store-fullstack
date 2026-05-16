import request from "supertest"
import app from "../app"
import { pool } from "../src/config/db"

describe("B2C Business Logic", () => {
    const userEmail = `user${Date.now()}@test.com`
    const adminEmail = `admin${Date.now()}@test.com`

    let userToken = ""
    let adminToken = ""
    let productId = 0

    beforeAll(async () => {
        await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: userEmail,
            password: "password123"
        })

        await request(app).post("/api/auth/register").send({
            name: "Admin User",
            email: adminEmail,
            password: "password123"
        })

        await pool.query(
            `UPDATE users SET role = 'admin' WHERE email = $1`,
            [adminEmail]
        )

        const userLogin = await request(app).post("/api/auth/login").send({
            email: userEmail,
            password: "password123"
        })

        const adminLogin = await request(app).post("/api/auth/login").send({
            email: adminEmail,
            password: "password123"
        })

        userToken = userLogin.body.token
        adminToken = adminLogin.body.token
    })

    afterAll(async () => {
        await pool.end()
    })

    it("should fail registration with duplicate email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Duplicate User",
                email: userEmail,
                password: "password123"
            })

        expect(response.status).toBe(409)
    })

    it("should allow admin to create a product", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Test Product",
                description: "Product for testing",
                price: 100,
                stock_quantity: 5,
                category_id: null
            })

        expect(response.status).toBe(201)
        expect(response.body.product.name).toBe("Test Product")

        productId = response.body.product.id
    })

    it("should block non-admin from creating a product", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                name: "Blocked Product",
                description: "Should fail",
                price: 50,
                stock_quantity: 2,
                category_id: null
            })

        expect(response.status).toBe(403)
    })

    it("should merge cart quantity when same product is added twice", async () => {
        await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: productId,
                quantity: 2
            })

        await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: productId,
                quantity: 3
            })

        const cart = await request(app)
            .get("/api/cart")
            .set("Authorization", `Bearer ${userToken}`)

        expect(cart.status).toBe(200)
        expect(cart.body.cartItems.length).toBe(1)
        expect(cart.body.cartItems[0].quantity).toBe(5)
    })

    it("should checkout and reduce stock", async () => {
        const checkout = await request(app)
            .post("/api/orders/checkout")
            .set("Authorization", `Bearer ${userToken}`)

        expect(checkout.status).toBe(201)
        expect(Number(checkout.body.order.total_amount)).toBe(500)

        const product = await request(app)
            .get(`/api/products/${productId}`)

        expect(product.status).toBe(200)
        expect(product.body.product.stock_quantity).toBe(0)
    })

    it("should fail checkout when cart is empty", async () => {
        const response = await request(app)
            .post("/api/orders/checkout")
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Cart is empty")
    })

    it("should fail checkout when product is out of stock", async () => {
        const product = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Low Stock Product",
                description: "Only one item available",
                price: 10,
                stock_quantity: 1,
                category_id: null
            })

        const lowStockProductId = product.body.product.id

        await request(app)
            .post("/api/cart")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                product_id: lowStockProductId,
                quantity: 2
            })

        const response = await request(app)
            .post("/api/orders/checkout")
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toContain("Not enough stock")
    })
})