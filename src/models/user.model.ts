import pool from "../config/db";

export interface User {
  id: string; 
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}


export const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      first_name TEXT,
      last_name  TEXT,
      email      TEXT UNIQUE NOT NULL,
      phone_number  TEXT UNIQUE NOT NULL,
      password   TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};