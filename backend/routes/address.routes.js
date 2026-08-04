import {
  getAddresss,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  updateDefault
} from '../controllers/address.controller.js';

import express from 'express';
const router = express.Router();


router.get('/', getAddresss);
router.post('/', createAddress);
router.get('/:id', getAddressById);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/default/:id', updateDefault);

export default router;