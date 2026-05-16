import request from "supertest"
import app from "../app"

describe("Auth API", () => {

    it("should return 200 for home route", async () => {
        const response = await request(app).get("/")

        expect(response.status).toBe(200)
    })

})