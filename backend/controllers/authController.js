const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Buyer or Seller)
// @route   POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password, role, address, city, pincode, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role, address, city, pincode, phone });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sellerStats: user.sellerStats,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Google OAuth login / register (using access_token flow)
// @route   POST /api/users/auth/google
const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: 'Google access token is required' });
    }

    // Verify access token and get user info from Google
    const { data: googleUser } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { sub: googleId, email, name, picture } = googleUser;

    if (!email) {
      return res.status(400).json({ message: 'Could not retrieve email from Google account' });
    }

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link googleId if user previously registered via email
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user (no password for Google users)
      user = await User.create({ name, email, googleId, role: 'user' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sellerStats: user.sellerStats,
      picture: picture || '',
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error.response?.data || error.message);
    res.status(401).json({ message: 'Google authentication failed. Token may be invalid or expired.' });
  }
};

module.exports = { registerUser, authUser, googleAuth };