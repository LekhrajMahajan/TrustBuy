const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;
  // console.log("Middleware: Checking Auth"); // Uncomment if needed

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // console.log("Token received:", token); 

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Token decoded:", decoded);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error("Middleware Error: User not found for ID:", decoded.id);
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      next();
    } catch (error) {
      console.error("Middleware Error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
    }
  } else {
    console.error("Middleware Error: No token in header", req.headers.authorization);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// UPDATE: Allow ANY logged-in user to be a seller
const seller = (req, res, next) => {
  // Check if user exists and has 'active' seller status
  if (req.user && req.user.sellerStats?.status === 'active') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized. Seller approval required.' });
  }
};

// Check if user is Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, seller, admin };