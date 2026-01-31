import { Response } from "express";
import { Post } from "../models/post.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createPost = async (req: AuthRequest, res: Response) => {
  const post = await Post.create({ ...req.body, user: req.user.id });
  res.status(201).json(post);
};

export const getPosts = async (_: AuthRequest, res: Response) => {
  res.json(await Post.find());
};

export const getPost = async (req: AuthRequest, res: Response) => {
  res.json(await Post.findById(req.params.id));
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  res.json(await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};