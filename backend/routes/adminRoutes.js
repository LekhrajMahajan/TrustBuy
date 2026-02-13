const express = require('express');
const router = express.Router();
// ✅ Import functions properly
const { getAnalytics, getSellers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getAnalytics);
router.get('/sellers', protect, admin, getSellers);

module.exports = router;