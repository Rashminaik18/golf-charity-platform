// controllers/adminController.js — Admin user management and score oversight
const User = require('../models/User');
const Score = require('../models/Score');

// ─── @route  GET /api/admin/users ────────────────────────────────────────────
// ─── @access Admin only — list all regular users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .populate('selectedCharity', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  GET /api/admin/users/:id/scores ─────────────────────────────────
// ─── @access Admin only — view a specific user's scores
const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.id }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  PUT /api/admin/scores/:id ───────────────────────────────────────
// ─── @access Admin only — edit any user's score
const updateUserScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  PUT /api/admin/users/:id/subscription ───────────────────────────
// ─── @access Admin only — activate or deactivate a user's subscription
const updateUserSubscription = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 'subscription.status': req.body.status },
      { new: true }
    )
      .populate('selectedCharity', 'name')
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUserScores, updateUserScore, updateUserSubscription };
