import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { category, brand, minPrice, maxPrice, sort } = req.query;

  let query = {};

  if (category && category !== 'All') query.category = category;
  if (brand && brand !== 'All') query.brand = brand;
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortQuery = {};
  if (sort === "price_asc") sortQuery.price = 1;
  else if (sort === "price_desc") sortQuery.price = -1;
  else if (sort === "rating") sortQuery.rating = -1;
  else sortQuery.createdAt = -1; 

  const products = await Product.find(query)
    .populate("category brand")
    .sort(sortQuery);

  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});
export const getProductBySlug = asyncHandler(async (req, res) => {
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
    returnDocument: "after",
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
  const products = await Product.find({ isFeatured: true })
    .populate("category brand")
    .limit(8);
  res.status(200).json(products);
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true })
    .populate("category brand")
    .limit(8);
  res.status(200).json(products);
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true })
    .populate("category brand")
    .limit(8);
  res.status(200).json(products);
});

export const getFlashSale = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getRelated = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const products = await Product.find({ category: category._id })
    .populate("category brand")
    .sort({ createdAt: -1 });

  res.status(200).json({
    category,
    products,
  });
});

export const getBrand = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate("user", "name avatar");
  return res.status(200).json(reviews);
});
