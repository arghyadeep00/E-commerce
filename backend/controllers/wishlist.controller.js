import asyncHandler from '../middleware/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';

export const getWishlists = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  if (wishlist) {
    res.status(200).json(wishlist.products);
  } else {
    res.status(200).json([]);
  }
});

export const createWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  } else {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  }
  
  await wishlist.populate('products');
  res.status(201).json(wishlist.products);
});

export const deleteWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();
    await wishlist.populate('products');
    res.status(200).json(wishlist.products);
  } else {
    res.status(404);
    throw new Error('Wishlist not found');
  }
});
