import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeTestDB = async () => {
    try {
        const sqlPath = path.resolve(__dirname, '../test_moviedb.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await pool.query(sql);
        return true;
    } catch (err) {
        console.error('Error initializing the database', err);
        throw err;
    }
}

const addTestUser = async (user) => {
  try {
    const userUuid = user.user_uuid ?? uuidv4();
    const hashedPassword = await hash(user.password, 10);
    await pool.query(
      'INSERT INTO users (user_uuid, username, email, hashed_password) VALUES ($1, $2, $3, $4)',
      [userUuid, user.username, user.email, hashedPassword]
    );
    return { ...user, user_uuid: userUuid };
  } catch (err) {
    console.error('Error adding the test user', err);
    throw err;
  }
};

const getToken = (userOrEmail) => {
  const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email;
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY not set in environment');
  }
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY);
};

export { initializeTestDB, addTestUser, getToken };