const express = require('express');
const { login, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  try {
    const result = fn(req, res, next);
    if (result && typeof result.catch === 'function') {
      result.catch(next);
    }
  } catch (err) {
    next(err);
  }
};

// Public login endpoint
router.post('/login', asyncHandler(login));

// Public register endpoint  
router.post('/register', asyncHandler(register));

// Retrieve the currently authenticated user
router.get('/me', authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

module.exports = router;
