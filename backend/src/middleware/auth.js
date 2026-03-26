const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }

    const payload = jwt.verify(token, secret);

    // Attach user info to request for later middleware/controllers
    req.user = {
      id: payload.userId,
      role: payload.role,
      email: payload.email,
      name: payload.name
    };

    // Optionally refresh from DB if needed
    if (!req.user.role || !req.user.id) {
      const user = await User.findById(payload.userId).select('role email name');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    }

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorizeRoles };