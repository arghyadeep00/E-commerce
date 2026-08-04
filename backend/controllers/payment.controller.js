import asyncHandler from '../middleware/asyncHandler.js';

export const createIntentPayment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const webhookPayment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});
