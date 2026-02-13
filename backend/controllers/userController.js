const User = require('../models/userModel');

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
      birthDate: user.birthDate,
      phone: user.phone,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update User Profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Update extra fields
      user.address = req.body.address || user.address;
      user.city = req.body.city || user.city;
      user.pincode = req.body.pincode || user.pincode;

      // ✅ Fix: Handle empty date string safely
      if (req.body.birthDate !== undefined) {
        user.birthDate = req.body.birthDate === '' ? null : req.body.birthDate;
      }

      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
        birthDate: updatedUser.birthDate, // Date object
        phone: updatedUser.phone,
        // token: generateToken(updatedUser._id), 
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };