// models/Charity.js — Charities that users can choose to support
const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charity name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    // Optional URL to charity logo or image
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Charity', charitySchema);
