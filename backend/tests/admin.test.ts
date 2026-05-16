import request from "supertest"
import app from "../app"

describe("Admin Protection", () => {

    it("should block category creation without token", async () => {

        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "Test Category"
            })

        expect(response.status).toBe(401)
    })

})