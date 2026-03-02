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

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to cancel this order');
      }

      if (order.isDelivered) {
        res.status(400);
        throw new Error('Cannot cancel a delivered order');
      }

      order.isCancelled = true;
      order.cancelledAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrderById, cancelOrder };