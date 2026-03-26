const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getSessions,
  createSession,
  updateSession,
  deleteSession
} = require('../controllers/sessionController');

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

// All session routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(getSessions));
router.post('/', asyncHandler(createSession));
router.put('/:id', asyncHandler(updateSession));
router.delete('/:id', asyncHandler(deleteSession));

module.exports = router;
