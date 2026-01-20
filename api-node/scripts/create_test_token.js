const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { openDb } = require('../src/db');
const { generateToken } = require('../src/utils/jwt');
const { hashPassword } = require('../src/utils/password');

async function createTestToken() {
    const db = await openDb();
    const email = 'test@example.com';
    const password = 'password123';
    const username = 'testuser';

    try {
        let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            console.log('Creating test user...');
            const hashedPassword = await hashPassword(password);
            const result = await db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            user = { id: result.lastID };
        } else {
            console.log('Test user already exists.');
        }

        const token = generateToken(user.id);
        console.log('TOKEN_START');
        console.log(token);
        console.log('TOKEN_END');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await db.close();
    }
}

createTestToken();
