// routes/authRoutes.js — Authentication routes
const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateCharity } = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/signup', signup);                      // Public
router.post('/login', login);                        // Public
router.get('/me', protect, getMe);                   // Private
router.put('/me/charity', protect, updateCharity);   // Private

module.exports = router;
