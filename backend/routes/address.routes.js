import {
  getAddresss,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  updateDefault,
} from "../controllers/address.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.route("/").get(protect, getAddresss).post(protect, createAddress);
router
  .route("/:id")
  .get(protect, getAddressById)
  .patch(protect, updateAddress)
  .delete(protect, deleteAddress);
router.route("/default/:id").patch(protect, updateDefault);

export default router;
