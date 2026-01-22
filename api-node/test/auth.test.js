const request = require('supertest');
const app = require('../src/index');
const { openDb } = require('../src/db');
const { hashPassword } = require('../src/utils/password');

const setupTestDB = require('./setupTestDB');

let db;

beforeAll(async () => {
  db = await setupTestDB();
});

let token;

// Avant tous les tests : créer un utilisateur test
beforeAll(async () => {
  const db = await openDb();
  await db.run('DELETE FROM users'); // nettoyer la table
  const hashed = await hashPassword('Password1');
  await db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    ['testuser', 'test@test.com', hashed]
  );
  await db.close();
});

// Tests register
describe('POST /auth/register', () => {
  it('devrait créer un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'newuser', email: 'new@test.com', password: 'Password1' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Compte créé avec succès');
  });

  it('devrait refuser un email déjà existant', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'newuser2', email: 'test@test.com', password: 'Password1' });

    expect(res.statusCode).toEqual(409);
  });
});

// Tests login
describe('POST /auth/login', () => {
  it('devrait connecter l’utilisateur et renvoyer un token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'testuser', password: 'Password1' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('devrait refuser un mot de passe incorrect', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ identifier: 'testuser', password: 'WrongPass' });

    expect(res.statusCode).toEqual(401);
  });
});

// Tests /auth/me
describe('GET /auth/me', () => {
  it('devrait retourner les infos de l’utilisateur', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('testuser');
  });

  it('devrait refuser sans token', async () => {
    const res = await request(app)
      .get('/auth/me');

    expect(res.statusCode).toEqual(401);
  });
});

// Tests change-password
describe('PUT /auth/change-password', () => {
  it('devrait changer le mot de passe', async () => {
    const res = await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'Password1', newPassword: 'NewPass123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Mot de passe changé avec succès');
  });

  it('devrait refuser si ancien mot de passe incorrect', async () => {
    const res = await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'WrongPass', newPassword: 'NewPass123' });

    expect(res.statusCode).toEqual(401);
  });
});

// Tests verify-token
describe('POST /auth/verify-token', () => {
  it('devrait vérifier un token valide', async () => {
    const res = await request(app)
      .post('/auth/verify-token')
      .send({ token });

    expect(res.statusCode).toEqual(200);
    expect(res.body.valid).toBe(true);
  });

  it('devrait refuser un token invalide', async () => {
    const res = await request(app)
      .post('/auth/verify-token')
      .send({ token: 'fake.token' });

    expect(res.statusCode).toEqual(401);
  });
});
