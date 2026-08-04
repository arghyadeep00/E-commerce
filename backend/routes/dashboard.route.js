import {
  getStats,
  getSales,
  getRevenue,
  getOrders,
  getUsers,
  getProducts
} from '../controllers/dashboard.controller.js';

import express from 'express';
const router = express.Router();


router.get('/stats', getStats);
router.get('/sales', getSales);
router.get('/revenue', getRevenue);
router.get('/orders', getOrders);
router.get('/users', getUsers);
router.get('/products', getProducts);


export default router;
