const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');
const { getUserProfile, updateUserProfile } = require('../controllers/userController'); // ✅ Import
const { protect } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/', registerUser);
router.post('/login', authUser);

// ✅ Profile Routes (Protected)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;


