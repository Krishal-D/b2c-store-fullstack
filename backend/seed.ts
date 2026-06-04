import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { pool } from "./src/config/db"

dotenv.config()

const categories = [
    "Electronics",
    "Apparel",
    "Home",
    "Wellness",
    "Accessories"
]

const products = [
    {
        name: "Wireless Noise-Canceling Headphones",
        description:
            "Premium over-ear headphones with adaptive noise cancellation, 30-hour battery life, and immersive sound for music, calls, and travel.",
        price: 249.99,
        image_url:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 48,
        category: "Electronics"
    },
    {
        name: "4K Ultra HD Smart TV",
        description:
            "55-inch smart television with Dolby Vision HDR, built-in voice assistant, and instant access to streaming apps.",
        price: 599.99,
        image_url:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 22,
        category: "Electronics"
    },
    {
        name: "Smart Fitness Tracker",
        description:
            "Lightweight fitness tracker with heart rate, sleep monitoring, GPS, and workout coaching on a sleek AMOLED display.",
        price: 129.99,
        image_url:
            "https://images.unsplash.com/photo-1519741491520-1a9ab2a54b55?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 84,
        category: "Wellness"
    },
    {
        name: "Classic Leather Jacket",
        description:
            "Timeless faux leather jacket with a comfortable fit, durable stitching, and a soft interior lining for everyday style.",
        price: 179.99,
        image_url:
            "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 36,
        category: "Apparel"
    },
    {
        name: "Performance Running Shoes",
        description:
            "Responsive running shoes engineered for speed, cushioning, and breathable support on the road or treadmill.",
        price: 119.99,
        image_url:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 64,
        category: "Apparel"
    },
    {
        name: "Organic Cotton Crewneck Hoodie",
        description:
            "Soft organic cotton hoodie with a relaxed fit, kangaroo pocket, and durable ribbed cuffs for everyday comfort.",
        price: 59.99,
        image_url:
            "https://images.unsplash.com/photo-1520975914502-6703d4e7f8c5?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 76,
        category: "Apparel"
    },
    {
        name: "Ceramic Pour-Over Coffee Maker",
        description:
            "Elegant ceramic coffee maker with reusable filter and precise pour-over design for rich, full-flavored coffee at home.",
        price: 69.99,
        image_url:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 28,
        category: "Home"
    },
    {
        name: "Adjustable Desk Lamp",
        description:
            "LED desk lamp with adjustable brightness, color temperature settings, and a flexible arm for workspace lighting.",
        price: 39.99,
        image_url:
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 52,
        category: "Home"
    },
    {
        name: "Eco-Friendly Yoga Mat",
        description:
            "Non-slip yoga mat made from sustainable materials, with extra cushioning for stability and comfort during workouts.",
        price: 49.99,
        image_url:
            "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 92,
        category: "Wellness"
    },
    {
        name: "Premium Blender",
        description:
            "High-performance blender with multiple speeds, durable glass jar, and powerful motor for smoothies, soups, and sauces.",
        price: 139.99,
        image_url:
            "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 19,
        category: "Home"
    },
    {
        name: "Everyday Sunglasses",
        description:
            "Classic UV-protective sunglasses with lightweight frames and polarized lenses for clear vision in bright conditions.",
        price: 29.99,
        image_url:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 110,
        category: "Accessories"
    },
    {
        name: "Travel Backpack",
        description:
            "Durable travel backpack with multiple compartments, water-resistant fabric, and ergonomic shoulder straps.",
        price: 89.99,
        image_url:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        stock_quantity: 44,
        category: "Accessories"
    }
]

const adminUser = {
    name: "Demo Admin",
    email: "admin@cartly.com",
    password: "Admin123!"
}

async function runSeed() {
    try {
        console.log("Seeding products and admin user...")

        await pool.query(`TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE`)

        const categoryIds = new Map<string, number>()

        for (const category of categories) {
            const result = await pool.query(
                `INSERT INTO categories (name) VALUES ($1) RETURNING id`,
                [category]
            )
            categoryIds.set(category, result.rows[0].id)
        }

        for (const product of products) {
            await pool.query(
                `INSERT INTO products (name, description, price, image_url, stock_quantity, category_id)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    product.name,
                    product.description,
                    product.price,
                    product.image_url,
                    product.stock_quantity,
                    categoryIds.get(product.category) ?? null
                ]
            )
        }

        const hashedPassword = await bcrypt.hash(adminUser.password, 10)
        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, 'admin')
             ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password, role = 'admin'`,
            [adminUser.name, adminUser.email, hashedPassword]
        )

        console.log("Seeding complete.")
        console.log(`Admin credentials: ${adminUser.email} / ${adminUser.password}`)
    } catch (error) {
        console.error("Seed failed:", error)
    } finally {
        await pool.end()
    }
}

runSeed()
