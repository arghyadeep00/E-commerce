import {
  imageUpload,
  multipleUpload,
  deleteUpload,
} from "../controllers/upload.controller.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

import express from "express";
const router = express.Router();

router.post("/image", upload.single("image"), imageUpload);
router.post("/multiple", upload.array("images", 5), multipleUpload);
router.delete("/:filename", deleteUpload);

export default router;
