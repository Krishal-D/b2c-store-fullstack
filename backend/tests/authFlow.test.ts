import request from "supertest"
import app from "../app"

describe("Auth Flow", () => {
    const testEmail = `test${Date.now()}@example.com`

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: testEmail,
                password: "password123"
            })

        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBe(testEmail)
    })

    it("should login existing user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: "password123"
            })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })
})