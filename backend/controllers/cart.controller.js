import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

export const getCarts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json(user.cart);
});

export const createCart = asyncHandler(async (req, res) => {
  const { productId, variantId, color, storage, ram, quantity = 1 } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const existingItemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId && item.variantId === variantId
  );

  if (existingItemIndex >= 0) {
    user.cart[existingItemIndex].quantity += quantity;
  } else {
    user.cart.push({ product: productId, variantId, color, storage, ram, quantity });
  }

  await user.save();
  await user.populate('cart.product');

  res.status(200).json(user.cart);
});

export const updateCart = asyncHandler(async (req, res) => {
  const { id: cartItemId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const existingItemIndex = user.cart.findIndex(
    (item) => item._id.toString() === cartItemId
  );

  if (existingItemIndex >= 0) {
    user.cart[existingItemIndex].quantity = quantity;
    await user.save();
    await user.populate('cart.product');
    res.status(200).json(user.cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

export const deleteCart = asyncHandler(async (req, res) => {
  const { id: cartItemId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);
  await user.save();
  await user.populate('cart.product');

  res.status(200).json(user.cart);
});

export const deleteClear = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.cart = [];
  await user.save();

  res.status(200).json(user.cart);
});
