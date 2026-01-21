const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { pool } = require('../db');   
=======
const { pool } = require('../db');// On importe la connexion DB
>>>>>>> af56eb2f93f769c4c3f635ec49998057a85e116f

// 1. LISTER LES TÂCHES (GET)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status.toUpperCase());
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CRÉER UNE TÂCHE (POST)
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, due_date, assigned_to } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date, assigned_to, status) 
       VALUES ($1, $2, $3, $4, $5, 'TODO') RETURNING *`,
      [title, description, priority || 'MEDIUM', due_date, assigned_to]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CHANGER LE STATUT / DRAG & DROP (PATCH)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 
    
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Tâche introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. SUPPRIMER UNE TÂCHE (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;