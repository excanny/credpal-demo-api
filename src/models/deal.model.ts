import pool from "../config/db";

export interface Deal {
  id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export const createDealsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id UUID PRIMARY KEY,
      title       TEXT,
      content     TEXT,
      user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    )
  `);
};