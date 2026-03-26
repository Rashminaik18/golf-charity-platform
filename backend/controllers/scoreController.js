// controllers/scoreController.js — CRUD for golf scores (max 5 per user)
const Score = require('../models/Score');

// ─── @route  GET /api/scores ──────────────────────────────────────────────────
// ─── @access Private — get logged-in user's scores (newest first)
const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  POST /api/scores ─────────────────────────────────────────────────
// ─── @access Private — add a score, enforce max 5 (remove oldest if needed)
const addScore = async (req, res) => {
  const { value, date } = req.body;

  try {
    // Fetch existing scores sorted oldest first
    const existingScores = await Score.find({ userId: req.user._id }).sort({ date: 1 });

    // If user already has 5 scores, remove the oldest one
    if (existingScores.length >= 5) {
      await Score.findByIdAndDelete(existingScores[0]._id);
    }

    // Create the new score
    const score = await Score.create({
      userId: req.user._id,
      value,
      date,
    });

    res.status(201).json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  PUT /api/scores/:id ─────────────────────────────────────────────
// ─── @access Private — update an existing score
const updateScore = async (req, res) => {
  const { value, date } = req.body;

  try {
    // Only update if the score belongs to the logged-in user
    const score = await Score.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { value, date },
      { new: true, runValidators: true }
    );

    if (!score) {
      return res.status(404).json({ message: 'Score not found or not authorized' });
    }

    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  DELETE /api/scores/:id ──────────────────────────────────────────
// ─── @access Private — delete a score
const deleteScore = async (req, res) => {
  try {
    const score = await Score.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!score) {
      return res.status(404).json({ message: 'Score not found or not authorized' });
    }

    res.json({ message: 'Score removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getScores, addScore, updateScore, deleteScore };
