const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');
const { getUserProfile, updateUserProfile, registerSeller } = require('../controllers/userController'); // Import
const { protect } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/', registerUser);
router.post('/login', authUser);

// Profile Routes (Protected)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Seller Registration Route
router.put('/seller/register', protect, registerSeller);

module.exports = router;


