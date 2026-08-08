import {
  getWishlists,
  createWishlist,
  deleteWishlist
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', protect, getWishlists);
router.post('/', protect, createWishlist);
router.delete('/:productId', protect, deleteWishlist);

export default router;