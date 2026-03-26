// middleware/role.js — Role-based access control middleware

/**
 * requireAdmin middleware
 * Must be used AFTER the protect middleware.
 * Allows access only if the authenticated user has the 'admin' role.
 */
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = requireAdmin;
