import {
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';

import express from "express";
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/profile', getProfile);

router.patch('/profile', updateProfile);

router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
