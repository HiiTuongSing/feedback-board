const db = require('../db/index')
const { v4: uuidv4 } = require('uuid')

async function createRefreshToken(userId, deviceId) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    db.run(
      `INSERT INTO refresh_tokens (id, user_id, token, device_id, expires_at) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, token, deviceId, expiresAt.toISOString()],
      function (err) {
        if (err) reject(err);
        else resolve({ id, token, userId, deviceId, expiresAt });
      }
    );
  });
}

async function revokeRefreshTokenById(tokenId) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM refresh_tokens WHERE id = ?`;
    db.run(query, [tokenId], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0); // true if a row was deleted
    });
  });
}

async function findRefreshToken(token) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM refresh_tokens WHERE token = ?`,
      [token],
      (err, row) => {
        if (err) return reject(err)
        resolve(row || null)
      }
    )
  })
}

async function verifyRefreshToken(token) {
  const record = await findRefreshToken(token)
  if (!record) return null

  const now = new Date()
  const expiresAt = new Date(record.expires_at)

  if (expiresAt < now) {
    // expired, delete it
    await revokeRefreshTokens(record.user_id, record.device_id)
    return null
  }

  return record
}

module.exports = { createRefreshToken, revokeRefreshTokenById, findRefreshToken, verifyRefreshToken };
