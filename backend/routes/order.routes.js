import {
  getOrders,
  getOrderById,
  getTrack,
  createOrder,
  updateOrder,
  deleteOrder,
  updateCancel
} from '../controllers/order.controller.js';

import { protect } from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getOrders);
router.route('/:id').get(protect, getOrderById).patch(protect, updateOrder).delete(protect, deleteOrder);
router.get('/track/:orderNumber', getTrack);
router.patch('/cancel/:id', protect, updateCancel); 


export default router;