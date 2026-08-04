import asyncHandler from '../middleware/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateRead = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateReadAll = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});
