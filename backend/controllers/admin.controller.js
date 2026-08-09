import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
  
  // Combine users and admins for the admin panel table, or serve them separately
  res.status(200).json({ users, admins });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
  res.status(200).json(orders);
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('category', 'name')
    .populate('brand', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(products);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.status(200).json(categories);
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ createdAt: -1 });
  res.status(200).json(brands);
});

export const getReviews = asyncHandler(async (req, res) => {
  // We can fetch products with reviews if needed, or query Review model directly
  res.status(200).json({ message: "Reviews endpoint" });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalOrders = await Order.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  
  // Calculate total revenue
  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  // Recent orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
    recentOrders
  });
});
