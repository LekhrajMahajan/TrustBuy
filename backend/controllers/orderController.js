const Order = require('../models/orderModel');

const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, paymentResult, isPaid } = req.body;

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
  res.status(201).json(createdOrder);
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