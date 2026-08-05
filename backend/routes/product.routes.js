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
  getReview,
} from "../controllers/product.controller.js";

import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", protect, authorize("admin"), createProduct);
router.patch("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

// product search and filter

router.get("/search", getSearch);
router.get("/filter", getFilter);
router.get("/featured", getFeatured);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);
router.get("/flash-sale", getFlashSale);
router.get("/review/:productId", getReview);
router.get("/related/:id", getRelated);
router.get("/category/:slug", getCategory);
router.get("/brand/:slug", getBrand);

router.get("/:slug", getProductById);

export default router;
