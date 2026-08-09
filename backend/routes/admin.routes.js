import {
  getUsers,
  getOrders,
  getProducts,
  getCategories,
  getBrands,
  getReviews,
  getDashboard
} from '../controllers/admin.controller.js';
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

import express from "express";
import { adminProtect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/users', adminProtect, getUsers);
router.get('/orders', adminProtect, getOrders);
router.get('/products', adminProtect, getProducts);
router.post('/products', adminProtect, createProduct);
router.patch('/products/:id', adminProtect, updateProduct);
router.delete('/products/:id', adminProtect, deleteProduct);
router.get('/categories', adminProtect, getCategories);
router.get('/brands', adminProtect, getBrands);
router.get('/reviews', adminProtect, getReviews);
router.get('/dashboard', adminProtect, getDashboard);

export default router;
