import { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/product.model";

// CREATE a product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_title,
      category,
      brand,
      model,
      color,
      condition,
      description,
      price,
      negotiable,
      screen_size,
      merchant_id,
      product_image_url,
    } = req.body;

    const result = await pool.query<Product>(
      `
      INSERT INTO products (
        product_title, category, brand, model, color, condition,
        description, price, negotiable, screen_size, merchant_id, product_image_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
      `,
      [
        product_title,
        category,
        brand || null,
        model || null,
        color || null,
        condition,
        description || null,
        price,
        negotiable ?? false,
        screen_size || null,
        merchant_id || null,
        product_image_url,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET all products with optional filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, merchant_id } = req.query;

    let query = "SELECT * FROM products";
    const values: any[] = [];

    const conditions: string[] = [];
    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    if (merchant_id) {
      values.push(merchant_id);
      conditions.push(`merchant_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query<Product>(query, values);
    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query<Product>(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      product_title,
      category,
      brand,
      model,
      color,
      condition,
      description,
      price,
      negotiable,
      screen_size,
      merchant_id,
      product_image_url,
    } = req.body;

    const result = await pool.query<Product>(
      `
      UPDATE products
      SET
        product_title = $1,
        category = $2,
        brand = $3,
        model = $4,
        color = $5,
        condition = $6,
        description = $7,
        price = $8,
        negotiable = $9,
        screen_size = $10,
        merchant_id = $11,
        product_image_url = $12
      WHERE id = $13
      RETURNING *
      `,
      [
        product_title,
        category,
        brand || null,
        model || null,
        color || null,
        condition,
        description || null,
        price,
        negotiable ?? false,
        screen_size || null,
        merchant_id || null,
        product_image_url,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query<Product>(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
