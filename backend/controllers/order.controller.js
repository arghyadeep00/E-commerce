import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';

export const getOrders = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
});

export const getOrderById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Not implemented yet" });
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

