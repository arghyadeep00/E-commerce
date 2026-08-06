import asyncHandler from "../middleware/asyncHandler.js";
import Review from "../models/Review.js";
export const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const response = await Review.find({ product: productId }).populate(
    "user",
    "name avatar",
  );
  res.status(200).json(response);
});

export const createReview = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateReview = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const deleteReview = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});
