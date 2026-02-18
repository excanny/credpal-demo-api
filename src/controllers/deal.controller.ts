import { Response } from "express";
import { Deal } from "../models/deal.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import pool from "../config/db";

export const createDeal = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const { rows } = await pool.query<Deal>(
    `INSERT INTO deals (title, content, user_id, updated_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [title, content, req.user.id]
  );
  res.status(201).json(rows[0]);
};

export const getDeals = async (_: AuthRequest, res: Response) => {
  const { rows } = await pool.query<Deal>(`SELECT * FROM deals`);
  res.json(rows);
};

export const getDeal = async (req: AuthRequest, res: Response) => {
  const { rows } = await pool.query<Deal>(
    `SELECT * FROM deals WHERE id = $1`,
    [req.params.id]
  );
  res.json(rows[0] ?? null);
};

export const updateDeal = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const { rows } = await pool.query<Deal>(
    `UPDATE deals
     SET title = $1, content = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [title, content, req.params.id]
  );
  res.json(rows[0] ?? null);
};

export const deleteDeal = async (req: AuthRequest, res: Response) => {
  await pool.query(`DELETE FROM deals WHERE id = $1`, [req.params.id]);
  res.json({ message: "Deleted" });
};