// routes/scoreRoutes.js — All score routes are protected (require login)
const express = require('express');
const router = express.Router();
const { getScores, addScore, updateScore, deleteScore } = require('../controllers/scoreController');
const protect = require('../middleware/auth');

router.use(protect); // All routes below require a valid JWT

router.get('/', getScores);         // Get logged-in user's scores
router.post('/', addScore);         // Add a score (auto-caps at 5)
router.put('/:id', updateScore);    // Edit a score
router.delete('/:id', deleteScore); // Delete a score

module.exports = router;
