import {
  getProduct,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';

import express from 'express';
const router = express.Router();    

router.get('/product/:productId', getProduct);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);



export default router;