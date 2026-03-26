// routes/drawRoutes.js — Monthly draw routes
const express = require('express');
const router = express.Router();
const { runDraw, getDrawResults, getMyResults } = require('../controllers/drawController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/role');

router.post('/run', protect, requireAdmin, runDraw);          // Admin only
router.get('/results', protect, requireAdmin, getDrawResults); // Admin only
router.get('/myresults', protect, getMyResults);              // Any logged-in user

module.exports = router;
