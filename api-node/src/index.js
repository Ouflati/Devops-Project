const express = require('express');
const path = require('path'); // 🆕 IMPORTANT : Nécessaire pour les chemins de fichiers
const { pool, createTables } = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

// 🆕 LIGNE MAGIQUE : C'est elle qui affiche ton fichier index.html
app.use(express.static(path.join(__dirname, 'public')));

// Création des tables
createTables();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;