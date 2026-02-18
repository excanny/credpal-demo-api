import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db";

import { createUsersTable } from "./models/user.model";
import { createDealsTable } from "./models/deal.model";
import { createProductsTable } from "./models/product.model";

import authRoutes from "./routes/auth.routes";
import dealRoutes from "./routes/deal.routes";
import productRoutes from "./routes/product.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/products", productRoutes);

// Start server
const start = async () => {
  try {
    await connectDB();

    // Create tables
    await createUsersTable();
    await createDealsTable();
    await createProductsTable();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();
