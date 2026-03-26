const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { connectDB } = require('./utils/Connect');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('StudySessionTracker API'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Server error:',  err.message || err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
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
