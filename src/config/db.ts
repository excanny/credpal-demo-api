import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Or use individual fields:
  // host: process.env.DB_HOST || "localhost",
  // port: Number(process.env.DB_PORT) || 5432,
  // database: process.env.DB_NAME,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
};

export default pool;