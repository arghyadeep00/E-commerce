import asyncHandler from '../middleware/asyncHandler.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createIntentPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round(order.total * 100),
    currency: "INR",
    receipt: order._id.toString(),
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(200).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

import Product from '../models/Product.js';

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    const order = await Order.findById(orderId);
    if (order) {
      if (order.paymentStatus !== 'completed') {
        order.paymentStatus = 'completed';
        await order.save();

        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            product.sold += item.quantity;

            if (item.variant && product.variants && product.variants.length > 0) {
              const variant = product.variants.find(
                (v) => v._id.toString() === item.variant.toString()
              );
              if (variant) {
                variant.stock = Math.max(0, variant.stock - item.quantity);
              }
            }
            await product.save();
          }
        }
      }
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } else {
    res.status(400);
    throw new Error("Invalid signature");
  }
});

export const webhookPayment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Webhook received" });
});
