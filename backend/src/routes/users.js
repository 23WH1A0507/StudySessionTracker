const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { listUsers } = require('../controllers/userController');

const router = express.Router();

// Only admins may list users
router.use(authenticate);
router.get('/', authorizeRoles('admin'), listUsers);

module.exports = router;
