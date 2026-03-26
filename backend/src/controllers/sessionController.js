const StudySession = require('../models/Session');

const getSessions = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.userId = req.user.id;
    }

    const sessions = await StudySession.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

const createSession = async (req, res) => {
  try {
    const { subject, duration, date, userId: requestedUserId } = req.body;

    if (!subject || !duration || !date) {
      return res.status(400).json({ message: 'subject, duration, and date are required' });
    }

    const session = new StudySession({
      subject,
      duration,
      date,
      userId: req.user.role === 'admin' && requestedUserId ? requestedUserId : req.user.id
    });

    await session.save();

    const populated = await session.populate('userId', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(400).json({ message: err.message });
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = await StudySession.findById(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (req.user.role === 'student' && session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(session, updates);
    await session.save();

    const populated = await session.populate('userId', 'name email');
    res.json(populated);
  } catch (err) {
    console.error('Error updating session:', err);
    res.status(400).json({ message: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findById(id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (req.user.role === 'student' && session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await StudySession.deleteOne({ _id: id });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ message: 'Failed to delete session' });
  }
};


module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession
};
