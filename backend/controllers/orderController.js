const Order = require('../models/orderModel');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, paymentResult, isPaid } = req.body;

    console.log("Creating Order - User:", req.user ? req.user._id : "No User");
    console.log("Order Data:", { orderItems, totalPrice, paymentMethod });

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated in controller' });
      return;
    }

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      paymentResult,
      totalPrice,
      isPaid: isPaid ?? false,
      paidAt: isPaid ? Date.now() : null,
    });

    const createdOrder = await order.save();
    console.log("Order Created:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error in addOrderItems:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = { addOrderItems, getMyOrders, getOrderById };