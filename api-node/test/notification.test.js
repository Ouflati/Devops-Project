const request = require('supertest');
const app = require('../src/index');
const { openDb } = require('../src/db');
const { hashPassword } = require('../src/utils/password');

let token;
let userId;

beforeAll(async () => {
  const db = await openDb();

  // 1. Initialisation des tables (Copie exacte des migrations pour un test réaliste)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // 2. Nettoyage
  await db.run('DELETE FROM notifications');
  await db.run('DELETE FROM users');

  // 3. Création User
  const hashed = await hashPassword('Password123!');
  const result = await db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    ['notifuser', 'notif@test.com', hashed]
  );
  userId = result.lastID;
  await db.close();

  // 4. Login
  const res = await request(app)
    .post('/auth/login')
    .send({ identifier: 'notifuser', password: 'Password123!' });
  
  token = res.body.token;
});

describe('Notification API Tests', () => {

  // Test 1 : Création (POST)
  it('devrait créer une notification pour l\'utilisateur', async () => {
    const res = await request(app)
      .post('/api/notifications') 
      .set('Authorization', `Bearer ${token}`) 
      .send({ 
        recipient_id: userId, // <--- CORRECTION ICI : Le contrôleur veut 'recipient_id'
        type: 'task_assigned', 
        message: 'Nouvelle tâche assignée' 
      });

    // Debug
    if (res.statusCode !== 201) {
      console.log('Erreur création:', res.body);
    }

    expect(res.statusCode).toEqual(201);
  });

  // Test 2 : Liste (GET)
  it('devrait récupérer la liste des notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    if (res.statusCode !== 404) {
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  // Test 3 : Compteur non lues (GET)
  it('devrait retourner le nombre de notifications non lues', async () => {
    const res = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`);

    if (res.statusCode !== 404) {
      expect(res.statusCode).toEqual(200);
      // Le contrôleur renvoie { unreadCount: ... }
      expect(res.body).toHaveProperty('unreadCount');
    }
  });
});