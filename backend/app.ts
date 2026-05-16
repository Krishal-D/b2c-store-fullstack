import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import authRoutes from "./src/routes/authRoutes";
import productRoutes from "./src/routes/productRoutes";
import cartRoutes from "./src/routes/cartRoutes";
import orderRoutes from "./src/routes/orderRoutes";
import categoryRoutes from "./src/routes/categoryRoutes";
import { errorHandler } from "./src/middleware/errorHandling";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "B2C Store API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

export default app;