import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('products.product', 'name images');
  res.status(200).json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email').populate('products.product', 'name images price');
  
  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const getTrack = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      orderNumber: 'ORD-' + Date.now() + Math.floor(Math.random() * 1000),
      products: orderItems.map((item) => ({
        product: item.productId,
        variant: item.variantId || undefined,
        quantity: item.qty,
        price: item.price,
      })),
      shippingAddress: shippingAddress._id || shippingAddress,
      paymentMethod,
      subtotal: itemsPrice,
      tax: taxPrice,
      shippingCharge: shippingPrice,
      total: totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

export const updateOrder = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const updateCancel = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

