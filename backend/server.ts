import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from "./src/routes/authRoutes"
import { errorHandler } from "./src/middleware/errorHandling";
import type { Request, Response } from "express";
import productRoutes from "./src/routes/productRoutes"
import cartRoutes from './src/routes/cartRoutes'
import orderRoutes from "./src/routes/orderRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "B2C Store API is running" });
});

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});