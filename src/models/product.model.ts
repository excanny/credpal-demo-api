import pool from "../config/db";

export interface Product {
  id: string;
  product_title: string;
  category: string;
  brand: string | null;
  model: string | null;
  color: string | null;
  condition: string;
  description: string | null;
  price: number;
  negotiable: boolean;
  screen_size: string | null;
  merchant_id: string | null;
  product_image_url: string;
  created_at: Date;
  updated_at: Date;
}

export const createProductsTable = async () => {
  // Enable UUID generation
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  // Create table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      product_title     TEXT NOT NULL,
      category          TEXT NOT NULL,
      brand             TEXT,
      model             TEXT,
      color             TEXT,
      condition         TEXT NOT NULL,

      description       TEXT,
      price             NUMERIC(12,2) NOT NULL CHECK (price >= 0),
      negotiable        BOOLEAN DEFAULT FALSE,

      screen_size       TEXT,

      merchant_id       UUID REFERENCES users(id) ON DELETE SET NULL,

      product_image_url TEXT NOT NULL,

      created_at        TIMESTAMP DEFAULT NOW(),
      updated_at        TIMESTAMP DEFAULT NOW()
    );
  `);

  // Indexes for performance
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id);
  `);

  // Trigger function to auto-update updated_at
  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS set_updated_at ON products;

    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
};
