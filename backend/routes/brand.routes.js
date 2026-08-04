import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brand.controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getBrands);
router.get('/:slug', getBrandById);

router.post('/', createBrand);
router.patch('/:id', updateBrand);
router.delete('/:id', deleteBrand);


export default router;