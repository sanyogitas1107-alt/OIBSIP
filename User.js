const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, // For email verification
  
  // --- NEW FIELDS FOR FORGOT PASSWORD ---
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);