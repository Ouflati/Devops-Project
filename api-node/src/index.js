const express = require('express');
// 1. Import de la configuration DB
const { pool, createTables } = require('./db'); 
// 2. Import des routes de Mohamed
const taskRoutes = require('./routes/tasks'); 

const app = express();
app.use(express.json());

// Création automatique des tables au démarrage
createTables();

// Route de santé (pour vérifier que le serveur tourne)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 3. Activation des routes Tâches
// Toutes les requêtes vers /api/tasks iront dans le fichier de Mohamed
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;