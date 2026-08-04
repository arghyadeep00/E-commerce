import {
  registerAuth,
  loginAuth,
  logoutAuth,
  forgotPasswordAuth,
  resetPasswordAuth,
  refreshTokenAuth,
  verifyEmailAuth,
  getMe,
  updateChangePassword
} from '../controllers/auth.controller.js';

import express from 'express';
import { registerUser, authUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAuth);
router.post('/login', loginAuth);
router.post('/logout', logoutAuth);
router.post('/forgot-password', forgotPasswordAuth);
router.post('/reset-password', resetPasswordAuth);
router.post('/refresh-token', refreshTokenAuth);
router.post('/verify-email', verifyEmailAuth);

router.get('/me', getMe);
router.patch('/change-password', updateChangePassword);

export default router;
