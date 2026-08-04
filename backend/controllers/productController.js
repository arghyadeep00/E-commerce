import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, description, image, countInStock } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image,
      countInStock,
      user: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { getProducts, createProduct };
