import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import User from "../models/User.js";

export const getProducts = asyncHandler(async (req, res) => {
  
  const products = await Product.find({}).populate("category brand");
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category brand reviews.user",
  );
  if (!product) {
    res.status(404);  
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  // Assuming frontend passes all required fields like customId, slug, etc.
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product deleted successfully" });
});

export const getSearch = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getFilter = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).populate('category brand').limit(8);
  res.status(200).json(products);
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).populate('category brand').limit(8);
  res.status(200).json(products);
});

export const getFlashSale = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getRelated = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getCategory = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getBrand = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});
