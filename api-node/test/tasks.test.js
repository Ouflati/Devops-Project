// api-node/test/tasks.test.js
const request = require('supertest');
const app = require('../src/index'); 
const { pool } = require('../src/db');

describe('API Tasks', () => {
  
  afterAll(async () => {
    await pool.end(); 
  });

  it('GET /api/tasks - Doit retourner une liste (même vide)', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /api/tasks - Doit refuser une tâche sans titre', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'Pas de titre ici' });
    
    expect(res.statusCode).not.toEqual(201);
  });
});