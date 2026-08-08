import express from "express";
import {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
  deleteClear
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCarts);
router.post('/', protect, createCart);
router.delete('/clear', protect, deleteClear);
router.patch('/:id', protect, updateCart);
router.delete('/:id', protect, deleteCart);

export default router;
