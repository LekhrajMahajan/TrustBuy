const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Get Analytics Data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeSellers = await User.countDocuments({ role: 'seller' });
    
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const avgTrustScore = 85; // Mock data for now

    res.json({ totalRevenue, totalOrders, activeSellers, avgTrustScore });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get All Sellers
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    
    const formattedSellers = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      rating: 4.5,
      trustScore: seller.sellerStats?.trustScore || 80,
      deliveryRate: '95%',
      status: 'Active'
    }));

    res.json(formattedSellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Ensure these are exported
module.exports = { getAnalytics, getSellers };