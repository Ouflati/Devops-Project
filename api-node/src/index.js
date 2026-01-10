const { getDateTime } = require('./db');

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

// setup the logger
app.use(morgan('tiny'));

// Root endpoint – shows current time from SQLite // added for version 2 
app.get('/', async (req, res) => {
  try {
    const dateTime = await getDateTime(); // → { now: "2025-08-09 14:23:12" }
    res.json({
      ...dateTime,
      api: 'node',
      message: 'Node.js + SQLite ',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database unreachable' });
  }
});
app.get('/ping', async (_, res) => {
  res.send('pong');
});

// Remplacez l'ancienne version par celle-ci
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.debug('HTTP server closed');
  });
});
