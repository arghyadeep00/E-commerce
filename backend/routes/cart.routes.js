import {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
  deleteClear
} from '../controllers/cart.controller.js';

import express from "express";
const router = express.Router();

router.get('/', getCarts);
router.post('/', createCart);
router.patch('/cart/:id', updateCart);
router.delete('/cart/:id', deleteCart);
router.delete('/clear', deleteClear);

export default router;
