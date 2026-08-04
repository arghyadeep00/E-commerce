import {
  getNotifications,
  updateReadAll,
  deleteNotification,
  updateRead,
} from "../controllers/notification.controller.js";

import express from "express";
const router = express.Router();

router.get("/", getNotifications);
router.patch("/read/:id", updateRead);
router.patch("/read-all", updateReadAll);
router.delete("/:id", deleteNotification);

export default router;
