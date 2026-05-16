import request from "supertest"
import app from "../app"

describe("Protected Routes", () => {
    it("should block cart access without token", async () => {
        const response = await request(app).get("/api/cart")

        expect(response.status).toBe(401)
    })
})