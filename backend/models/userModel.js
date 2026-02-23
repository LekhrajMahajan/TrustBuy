const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    default: 'user',
    required: true
  },

  // Profile Fields (Optional)
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  // birthDate as Date so Mongoose can cast strings like "2000-01-01"
  birthDate: { type: Date },
  phone: { type: String, default: '' },

  sellerStats: {
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    trustScore: { type: Number, default: 50 },
    status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' }, // Seller Status
    businessName: { type: String, default: '' },
    gstin: { type: String, default: '' },
    pickupAddress: { type: String, default: '' }
  }
}, {
  timestamps: true // This ensures created/updated times are saved
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;