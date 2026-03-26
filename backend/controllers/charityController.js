// controllers/charityController.js — Manage charities (public list, admin CRUD)
const Charity = require('../models/Charity');

// ─── @route  GET /api/charities ───────────────────────────────────────────────
// ─── @access Public
const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find().sort({ name: 1 });
     console.log("CHARITIES FROM DB:", charities);
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  POST /api/charities ──────────────────────────────────────────────
// ─── @access Admin only
const addCharity = async (req, res) => {
  const { name, description, imageUrl } = req.body;
  try {
    const charity = await Charity.create({ name, description, imageUrl });
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  PUT /api/charities/:id ──────────────────────────────────────────
// ─── @access Admin only
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── @route  DELETE /api/charities/:id ───────────────────────────────────────
// ─── @access Admin only
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json({ message: 'Charity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCharities, addCharity, updateCharity, deleteCharity };
