// controllers/authController.js — Signup, Login, Get/Update profile
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ─── Helper: generate JWT token ───────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── @route  POST /api/auth/signup ───────────────────────────────────────────
// ─── @access Public
const signup = async (req, res) => {
  const { name, email, password, selectedCharity, contributionPercentage, subscriptionType } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate contribution percentage
    if (contributionPercentage && contributionPercentage < 10) {
      return res.status(400).json({ message: 'Contribution percentage must be at least 10%' });
    }

    // Calculate renewal date based on plan
    const renewalDate =
      subscriptionType === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create user (password will be hashed by pre-save hook in model)
    const user = await User.create({
      name,
      email,
      password,
      selectedCharity: selectedCharity || undefined,
      contributionPercentage: contributionPercentage || 10,
      subscription: {
        type: subscriptionType || 'monthly',
        status: 'active',
        renewalDate,
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        selectedCharity: user.selectedCharity,
        contributionPercentage: user.contributionPercentage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
// ─── @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user and populate selected charity
    const user = await User.findOne({ email }).populate('selectedCharity', 'name description imageUrl');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        selectedCharity: user.selectedCharity,
        contributionPercentage: user.contributionPercentage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// ─── @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('selectedCharity', 'name description imageUrl')
      .select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  PUT /api/auth/me/charity ────────────────────────────────────────
// ─── @access Private — user updates their chosen charity
const updateCharity = async (req, res) => {
  const { selectedCharity, contributionPercentage } = req.body;

  try {
    if (contributionPercentage && contributionPercentage < 10) {
      return res.status(400).json({ message: 'Contribution must be at least 10%' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { selectedCharity, contributionPercentage },
      { new: true }
    ).populate('selectedCharity', 'name description imageUrl').select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, getMe, updateCharity };
