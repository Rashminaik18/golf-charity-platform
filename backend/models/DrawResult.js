// models/DrawResult.js — Monthly draw results stored in database
const mongoose = require('mongoose');

const drawResultSchema = new mongoose.Schema(
  {
    drawDate: {
      type: Date,
      default: Date.now,
    },
    // The 5 randomly generated draw numbers (1–45)
    numbers: [{ type: Number }],
    // Users whose scores matched 3, 4, or 5 numbers
    winners: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: String,
        matchCount: Number,        // How many scores matched (3, 4, or 5)
        matchedNumbers: [Number],  // Which numbers matched
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DrawResult', drawResultSchema);
