import {
  getPublics,
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getBanners,
  getBrands
} from '../controllers/public.controller.js';

import express from "express";
const router = express.Router();

router.get('/', getPublics);
router.get('/categories', getCategories);
router.get('/featured-products', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/banners', getBanners);
router.get('/brands', getBrands);

export default router;
