import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPost, getPosts, getPost, updatePost, deletePost } from "../controllers/post.controller";

const router = Router();
router.use(authMiddleware);

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;