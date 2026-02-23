const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getSellers,
    suspendSeller,
    verifySeller,
    approveProduct,
    getAdminProducts,
    exportUsersCSV,
    exportSellersCSV,
    getAdminUsers
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getAnalytics);
router.get('/sellers', protect, admin, getSellers);
router.put('/seller/:id/suspend', protect, admin, suspendSeller);
router.put('/seller/:id/verify', protect, admin, verifySeller);
router.put('/product/:id/approve', protect, admin, approveProduct);
router.get('/products', protect, admin, getAdminProducts);
router.get('/users', protect, admin, getAdminUsers);
router.get('/export-users', protect, admin, exportUsersCSV);
router.get('/export-sellers', protect, admin, exportSellersCSV);

module.exports = router;