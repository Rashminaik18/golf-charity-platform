// routes/charityRoutes.js — Public list; Admin add/edit/delete
const express = require('express');
const router = express.Router();
const { getCharities, addCharity, updateCharity, deleteCharity } = require('../controllers/charityController');
const protect = require('../middleware/auth');
const requireAdmin = require('../middleware/role');

router.get('/', getCharities);                               // Public
router.post('/', protect, requireAdmin, addCharity);         // Admin only
router.put('/:id', protect, requireAdmin, updateCharity);    // Admin only
router.delete('/:id', protect, requireAdmin, deleteCharity); // Admin only

module.exports = router;
