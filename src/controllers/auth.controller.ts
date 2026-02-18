import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import pool from "../config/db";
import { AuthRequest } from "../dtos/AuthRequest";
import uuid from "uuid";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;

    if (!first_name) {
      return res.status(400).json({
        status: "error",
        message: "First name is required",
        data: null,
      });
    }

    if (!last_name) {
      return res.status(400).json({
        status: "error",
        message: "Last name is required",
        data: null,
      });
    }

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email address",
        data: null,
      });
    }

    if (!phone_number) {
      return res.status(400).json({
        status: "error",
        message: "Phone number is required",
        data: null,
      });
    }

    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid phone number",
        data: null,
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
        data: null,
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters",
        data: null,
      });
    }

    const { rows: existingEmail } = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Email already in use",
        data: null,
      });
    }

    const { rows: existingPhone } = await pool.query(
      `SELECT id FROM users WHERE phone_number = $1`,
      [phone_number]
    );
    if (existingPhone.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Phone number already in use",
        data: null,
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query<User>(
      `INSERT INTO users (id,first_name, last_name, email, phone_number, password, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, first_name, last_name, email, phone_number, created_at, updated_at`,
      [uuid.v4(), first_name, last_name, email, phone_number, hashed]
    );

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
        data: null,
      });
    }

     if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
        data: null,
      });
    }

    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
        data: null,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
        data: null,
      });
    }

    const { rows } = await pool.query<User>(
      `SELECT id, first_name, last_name, email, phone_number, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile retrieved successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};
