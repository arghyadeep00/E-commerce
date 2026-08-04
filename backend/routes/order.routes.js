import {
  getOrders,
  getOrderById,
  getTrack,
  createOrder,
  updateOrder,
  deleteOrder,
  updateCancel
} from '../controllers/order.controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/track/:orderNumber', getTrack);
router.post('/', createOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.patch('/cancel/:id', updateCancel); 


export default router;