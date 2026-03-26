// models/Score.js — Individual golf score entries linked to a user
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    // Which user this score belongs to
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Score value must be between 1 and 45 (for lottery matching)
    value: {
      type: Number,
      required: [true, 'Score value is required'],
      min: [1, 'Score must be at least 1'],
      max: [45, 'Score cannot exceed 45'],
    },
    // Date the score was recorded
    date: {
      type: Date,
      required: [true, 'Score date is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);
