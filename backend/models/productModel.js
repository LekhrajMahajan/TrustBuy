const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },

  // PRICING LOGIC
  basePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },

  stock: { type: Number, required: true, default: 0 },
  sales: { type: Number, required: true, default: 0 }, // NEW: Tracks Sales for Trend
  views: { type: Number, default: 0 },

  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  isApproved: { type: Boolean, default: false, required: true } // Admin Check
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);