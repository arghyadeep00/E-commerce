import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSearch,
  getFilter,
  getFeatured,
  getNewArrivals,
  getBestSellers,
  getFlashSale,
  getRelated,
  getCategory,
  getBrand,
} from "../controllers/product.controller.js";

import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductById);

router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// product search and filter

router.get("/search", getSearch);
router.get("/filter", getFilter);
router.get("/featured", getFeatured);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);
router.get("/flash-sale", getFlashSale);
router.get("/related/:id", getRelated);
router.get("/category/:slug", getCategory);
router.get("/brand/:slug", getBrand);

export default router;
