import {
  createIntentPayment,
  verifyPayment,
  webhookPayment
} from '../controllers/payment.controller.js';

import { protect } from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();

router.post('/create-intent', protect, createIntentPayment);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhookPayment);


export default router;