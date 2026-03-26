const User = require('../models/User');

const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = { listUsers };
