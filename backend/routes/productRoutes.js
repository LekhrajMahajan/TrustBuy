const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  createProductReview,
  deleteProduct,
  updateProduct
} = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware'); // ✅ Import Auth Middleware

// Public Routes
router.route('/').get(getProducts);

// ✅ Private Seller Routes
// ध्यान दें: 'myproducts' वाला route '/:id' से ऊपर होना चाहिए
router.route('/myproducts').get(protect, seller, getMyProducts);
router.route('/').post(protect, seller, createProduct);

// ID Route (Always keep at bottom to avoid conflict)
router.route('/:id')
  .get(getProductById)
  .delete(protect, seller, deleteProduct)
  .put(protect, seller, updateProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;