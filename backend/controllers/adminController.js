const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { Parser } = require('json2csv');

// @desc    Get Analytics Data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeSellers = await User.countDocuments({ role: 'seller', 'sellerStats.status': 'active' });
    const totalUsers = await User.countDocuments({ role: 'user' }); // Exclude sellers if role is separate

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Sales Data for Charts (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await Order.find({
      isPaid: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Group by Date for Chart
    const salesData = {};
    recentOrders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      salesData[date] = (salesData[date] || 0) + order.totalPrice;
    });

    const chartData = Object.keys(salesData).map(date => ({
      date,
      sales: salesData[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top Selling Products
    const products = await Product.find({}).sort({ sales: -1 }).limit(5);
    const topProducts = products.map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: p.sales * p.currentPrice
    }));

    res.json({
      totalUsers,
      totalOrders,
      activeSellers,
      totalRevenue,
      chartData,
      topProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get All Sellers
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellers = async (req, res) => {
  try {
    // Exclude seed/demo accounts from example.com
    const SEED_EMAILS = ['admin@example.com', 'seller@example.com', 'buyer@example.com'];

    const sellers = await User.find({
      email: { $nin: SEED_EMAILS },
      $or: [
        { role: 'seller' },
        { 'sellerStats.businessName': { $ne: '' } }
      ]
    }).select('-password');

    const formattedSellers = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      rating: seller.sellerStats?.rating || 0,
      trustScore: seller.sellerStats?.trustScore || 50,
      status: seller.sellerStats?.status || 'pending',
      businessName: seller.sellerStats?.businessName || '',
      gstin: seller.sellerStats?.gstin || '',
      joinedAt: seller.createdAt
    }));

    res.json(formattedSellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export Sellers to CSV
// @route   GET /api/admin/export-sellers
// @access  Private/Admin
const exportSellersCSV = async (req, res) => {
  try {
    const SEED_EMAILS = ['admin@example.com', 'seller@example.com', 'buyer@example.com'];
    const sellers = await User.find({
      email: { $nin: SEED_EMAILS },
      $or: [{ role: 'seller' }, { 'sellerStats.businessName': { $ne: '' } }]
    }).select('-password').sort({ createdAt: -1 });

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found' });
    }

    const fields = [
      { label: 'Seller ID', value: '_id' },
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Business Name', value: 'sellerStats.businessName' },
      { label: 'GSTIN', value: 'sellerStats.gstin' },
      { label: 'Status', value: 'sellerStats.status' },
      { label: 'Trust Score', value: 'sellerStats.trustScore' },
      { label: 'Rating', value: 'sellerStats.rating' },
      { label: 'Pickup Address', value: 'sellerStats.pickupAddress' },
      { label: 'Joined Date', value: 'createdAt' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(sellers);

    res.header('Content-Type', 'text/csv');
    res.attachment('sellers_report.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Seller CSV Export Error:', error);
    res.status(500).json({ message: 'Server Error during CSV Export' });
  }
};

// @desc    Suspend Seller
// @route   PUT /api/admin/seller/:id/suspend
// @access  Private/Admin
const suspendSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.sellerStats.status = 'suspended';
    await seller.save();
    res.json({ message: 'Seller suspended', status: 'suspended' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify Seller
// @route   PUT /api/admin/seller/:id/verify
// @access  Private/Admin
const verifySeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.sellerStats.status = 'active';
    seller.sellerStats.trustScore = 80;
    seller.role = 'seller'; // Promote to seller role
    await seller.save();
    res.json({ message: 'Seller verified', status: 'active' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve Product
// @route   PUT /api/admin/product/:id/approve
// @access  Private/Admin
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isApproved = true;
    await product.save();
    res.json({ message: 'Product approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get All Products for Admin
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('user', 'name email sellerStats');

    // Calculate totals for response if needed, or map per product
    const formattedProducts = products.map(product => {
      // Logic for demand
      let demand = 'low';
      if (product.views > 50 || product.sales > 5) demand = 'medium';
      if (product.views > 200 || product.sales > 20) demand = 'high';

      // Ensure stats exist
      const sellerName = product.user ? product.user.name : 'Unknown';
      const sellerStats = product.user?.sellerStats || {};

      return {
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        basePrice: product.basePrice,
        currentPrice: product.currentPrice,
        stock: product.stock,
        sales: product.sales,
        views: product.views,
        isApproved: product.isApproved,
        seller: {
          name: sellerName,
          id: product.user?._id,
          trustScore: sellerStats.trustScore || 50
        },
        demand
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// @desc    Get All Users with buy/sell history (for Admin UI)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
  try {
    const SEED_EMAILS = ['admin@example.com', 'seller@example.com', 'buyer@example.com'];
    const users = await User.find({ email: { $nin: SEED_EMAILS } }).select('-password').sort({ createdAt: -1 });

    // Fetch all orders once
    const allOrders = await Order.find({}).populate('orderItems.product', 'name currentPrice user');

    const usersWithHistory = users.map(user => {
      const userId = user._id.toString();

      // Products this user BOUGHT (as buyer)
      const buyOrders = allOrders.filter(o => o.user?.toString() === userId);
      const purchased = buyOrders.flatMap(o =>
        o.orderItems.map(item => ({
          productName: item.name,
          qty: item.qty,
          price: item.price,
          total: item.qty * item.price,
          orderId: o._id,
          paidAt: o.paidAt
        }))
      );

      // Products this user SOLD (as seller - products they listed that appear in orders)
      const soldItems = allOrders.flatMap(o =>
        o.orderItems
          .filter(item => item.product && item.product.user?.toString() === userId)
          .map(item => ({
            productName: item.name,
            qty: item.qty,
            price: item.price,
            total: item.qty * item.price,
            orderId: o._id,
            paidAt: o.paidAt
          }))
      );

      return {
        ...user.toObject(),
        purchased,
        sold: soldItems,
        totalSpent: purchased.reduce((sum, p) => sum + p.total, 0),
        totalEarned: soldItems.reduce((sum, s) => sum + s.total, 0)
      };
    });

    res.json(usersWithHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Export Users to CSV
// @route   GET /api/admin/export-users
// @access  Private/Admin
const exportUsersCSV = async (req, res) => {
  try {
    console.log("Admin requesting CSV Export...");
    const SEED_EMAILS = ['admin@example.com', 'seller@example.com', 'buyer@example.com'];
    const users = await User.find({ email: { $nin: SEED_EMAILS } }).select('-password').sort({ createdAt: -1 });
    console.log(`Found ${users.length} users for export.`);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Expanded fields for full details
    const fields = [
      { label: 'User ID', value: '_id' },
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Role', value: 'role' },
      { label: 'Phone', value: 'phone' },
      { label: 'Address', value: 'address' },
      { label: 'City', value: 'city' },
      { label: 'Pincode', value: 'pincode' },
      { label: 'Joined Date', value: 'createdAt' },
      { label: 'Seller Status', value: 'sellerStats.status' },
      { label: 'Business Name', value: 'sellerStats.businessName' },
      { label: 'GSTIN', value: 'sellerStats.gstin' }
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(users);

    console.log("CSV generated successfully, sending response...");

    res.header('Content-Type', 'text/csv');
    res.attachment('users_full_details.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: 'Server Error during CSV Export' });
  }
};

module.exports = {
  getAnalytics,
  getSellers,
  suspendSeller,
  verifySeller,
  approveProduct,
  getAdminProducts,
  exportUsersCSV,
  exportSellersCSV,
  getAdminUsers
};