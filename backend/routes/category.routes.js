import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

import express from 'express';
const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryById);

router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);


export default router;