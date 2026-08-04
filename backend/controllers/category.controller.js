import asyncHandler from '../middleware/asyncHandler.js';

import Category from '../models/Category.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const createCategory = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateCategory = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

