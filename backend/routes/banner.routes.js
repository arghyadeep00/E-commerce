import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/banner.controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getBanners);
router.post('/', createBanner);
router.patch('/:id', updateBanner);
router.delete('/:id', deleteBanner);



export default router;