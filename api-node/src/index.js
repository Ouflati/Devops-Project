require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
// Middleware global
app.use(express.json());

// Routes auth
app.use('/auth', require('./routes/auth'));

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Lancer le serveur
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Auth API is running on port ${PORT}`));
}

module.exports = app;