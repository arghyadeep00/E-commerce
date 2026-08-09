import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  createSubAdmin,
  getAdminMe,
} from "../controllers/adminAuth.controller.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/create", adminProtect, createSubAdmin);
router.get("/me", adminProtect, getAdminMe);

export default router;
