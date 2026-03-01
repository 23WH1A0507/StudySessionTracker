const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { connectDB } = require('./utils/Connect');

const User = require('./models/User');
const StudySession = require('./models/Session');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('StudySessionTracker API'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await StudySession.find({}).populate('userId', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/sessions', async (req, res) => {
  try {
    const session = new StudySession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

  const graceful = async () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);
};

if (require.main === module) start().catch(err => { console.error('Failed to start server', err); process.exit(1); });

module.exports = app;
