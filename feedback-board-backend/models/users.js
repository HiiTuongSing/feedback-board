const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../utils/hash');

async function createUser(username, password, role = 'user') {
  const id = uuidv4();
  const password_hash = await hashPassword(password);

  await db.query(
    `INSERT INTO users (id, username, password_hash, role)
     VALUES ($1, $2, $3, $4)`,
    [id, username, password_hash, role]
  );

  return { id, username, role };
}

async function getUserByUsername(username) {
  const result = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  getUserByUsername,
};