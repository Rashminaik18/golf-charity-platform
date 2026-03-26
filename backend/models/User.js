// models/User.js — User schema with roles, subscription, and charity reference
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    // Role: 'user' (default) or 'admin'
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Simulated subscription — no real payment
    subscription: {
      type: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
      },
      // Renewal date: 30 days for monthly, 365 for yearly
      renewalDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    // Reference to chosen charity
    selectedCharity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
    },
    // Minimum 10% of subscription goes to chosen charity
    contributionPercentage: {
      type: Number,
      default: 10,
      min: [10, 'Contribution must be at least 10%'],
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare entered password with hashed ───────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
