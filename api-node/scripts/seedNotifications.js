const { openDb } = require('../src/db');

async function seed() {
  const db = await openDb();
  try {
    console.log('Seeding notifications...');

    // find an existing user (use first) or create a dev user
    let user = await db.get(`SELECT id, email FROM users ORDER BY id LIMIT 1`);
    if (!user) {
      const bcrypt = require('bcrypt');
      const username = 'devtest';
      const email = 'devtest@example.com';
      const password = 'devtest';
      const hash = await bcrypt.hash(password, 10);
      const result = await db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hash]);
      const idRow = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
      user = idRow;
      console.log('Created test user with id', user.id);
    } else {
      console.log('Using existing user id', user.id);
    }

    const samples = [
      { user_id: user.id, type: 'message', message: 'Welcome! This is your first notification.', is_read: 0 },
      { user_id: user.id, type: 'task', message: 'Your task "Update docs" was completed.', is_read: 1 },
      { user_id: user.id, type: 'comment', message: 'Someone commented: "Looks great!"', is_read: 0 },
    ];

    for (const s of samples) {
      await db.run(
        `INSERT INTO notifications (user_id, type, message, is_read) VALUES (?, ?, ?, ?)`,
        [s.user_id, s.type, s.message, s.is_read]
      );
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
