import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 */
router.post("/", createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products (optional query: category, merchant_id)
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 */
router.get("/:id", getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 */
router.put("/:id", updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 */
router.delete("/:id", deleteProduct);

export default router;
