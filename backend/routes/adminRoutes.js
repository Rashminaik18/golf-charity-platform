// routes/adminRoutes.js — All admin management routes
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserScores,
  updateUserScore,
  updateUserSubscription,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/role');

// Apply protect + requireAdmin to ALL routes in this file
router.use(protect, requireAdmin);

router.get('/users', getAllUsers);                             // All users list
router.get('/users/:id/scores', getUserScores);               // Scores for a user
router.put('/scores/:id', updateUserScore);                   // Edit any score
router.put('/users/:id/subscription', updateUserSubscription); // Toggle subscription

module.exports = router;
