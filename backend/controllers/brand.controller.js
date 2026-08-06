import asyncHandler from '../middleware/asyncHandler.js';
import Brand from "../models/Brand.js"

export const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find({});
  return res.status(200).json(response);
  res.status(200).json({ message: "Not implemented yet" });
});

export const getBrandById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const createBrand = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateBrand = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

