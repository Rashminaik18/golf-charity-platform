// controllers/drawController.js — Run the monthly draw and fetch results
const DrawResult = require('../models/DrawResult');
const Score = require('../models/Score');
const User = require('../models/User');

// ─── @route  POST /api/draw/run ───────────────────────────────────────────────
// ─── @access Admin only
const runDraw = async (req, res) => {
  try {
    // Generate 5 unique random numbers between 1 and 45
    const drawnNumbers = [];
    while (drawnNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!drawnNumbers.includes(num)) drawnNumbers.push(num);
    }

    // Find all active regular users
    const users = await User.find({ 'subscription.status': 'active', role: 'user' });

    const winners = [];

    // Compare each user's scores against drawn numbers
    for (const user of users) {
      const scores = await Score.find({ userId: user._id });
      const scoreValues = scores.map((s) => s.value);

      // Find which drawn numbers match any of the user's scores
      const matched = drawnNumbers.filter((n) => scoreValues.includes(n));

      // Only count as winner if 3 or more numbers match
      if (matched.length >= 3) {
        winners.push({
          userId: user._id,
          userName: user.name,
          matchCount: matched.length,
          matchedNumbers: matched,
        });
      }
    }

    // Save the draw result to the database
    const drawResult = await DrawResult.create({
      drawDate: new Date(),
      numbers: drawnNumbers,
      winners,
    });

    res.status(201).json(drawResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  GET /api/draw/results ───────────────────────────────────────────
// ─── @access Admin only — view all draw results
const getDrawResults = async (req, res) => {
  try {
    const results = await DrawResult.find().sort({ drawDate: -1 }).limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  GET /api/draw/myresults ─────────────────────────────────────────
// ─── @access Private — user sees their own draw participation
const getMyResults = async (req, res) => {
  try {
    const results = await DrawResult.find().sort({ drawDate: -1 }).limit(10);

    // Filter each draw to show only this user's result
    const myResults = results.map((r) => {
      const myWin = r.winners.find(
        (w) => w.userId.toString() === req.user._id.toString()
      );
      return {
        drawDate: r.drawDate,
        numbers: r.numbers,
        myResult: myWin || null,
      };
    });

    res.json(myResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { runDraw, getDrawResults, getMyResults };
