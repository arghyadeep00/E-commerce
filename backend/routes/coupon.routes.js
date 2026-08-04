import {
  getCoupons,
  createCoupon,
  applyCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js';

import express from "express";
const router = express.Router();

router.get('/', getCoupons);
router.post('/', createCoupon);
router.post('/apply', applyCoupon);
router.patch('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
