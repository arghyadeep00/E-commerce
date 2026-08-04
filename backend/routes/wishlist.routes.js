import {
  getWishlists,
  createWishlist,
  deleteWishlist
} from '../controllers/wishlist.controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getWishlists);
router.post('/', createWishlist);
router.delete('/:productId', deleteWishlist);


export default router;