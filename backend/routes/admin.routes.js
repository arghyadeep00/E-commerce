import {
  getUsers,
  getOrders,
  getProducts,
  getCategories,
  getBrands,
  getReviews,
  getDashboard
} from '../controllers/admin.controller.js';

import express from "express";
const router = express.Router();

router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/products', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/reviews', getReviews);
router.get('/dashboard', getDashboard);

export default router;
