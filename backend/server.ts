import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./src/config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "B2C Store API is running" });
});


app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now,
        });
    } catch (error) {
        res.status(500).json({
            message: "Database connection failed",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});