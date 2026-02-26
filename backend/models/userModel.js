const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Optional for Google-authenticated users
  password: { type: String },
  // Google OAuth
  googleId: { type: String, sparse: true },

  role: {
    type: String,
    default: 'user',
    required: true
  },

  // Profile Fields (Optional)
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  birthDate: { type: Date },
  phone: { type: String, default: '' },

  sellerStats: {
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    trustScore: { type: Number, default: 50 },
    status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' },
    businessName: { type: String, default: '' },
    gstin: { type: String, default: '' },
    pickupAddress: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Verify password (only for non-Google users)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving (only when password exists and is modified)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;