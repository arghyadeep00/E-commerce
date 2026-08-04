import {
  createIntentPayment,
  verifyPayment,
  webhookPayment
} from '../controllers/payment.controller.js';

import express from 'express';
const router = express.Router();

router.post('/create-intent', createIntentPayment);
router.post('/verify', verifyPayment);
router.post('/webhook', webhookPayment);


export default router;