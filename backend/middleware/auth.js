// middleware/auth.js — Verify JWT token and attach user to request
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect middleware
 * Checks for a valid Bearer token in the Authorization header.
 * If valid, attaches the user object to req.user and calls next().
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists with Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
