const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');

async function createRefreshToken(userId, deviceId) {
  const id = uuidv4();
  const token = uuidv4();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.query(
    `INSERT INTO refresh_tokens
     (id, user_id, token, device_id, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, userId, token, deviceId, expiresAt.toISOString()]
  );

  return { id, token, userId, deviceId, expiresAt };
}

async function revokeRefreshTokenById(tokenId) {
  const result = await db.query(
    `DELETE FROM refresh_tokens WHERE id = $1`,
    [tokenId]
  );

  return result.rowCount > 0;
}

async function findRefreshToken(token) {
  const result = await db.query(
    `SELECT * FROM refresh_tokens WHERE token = $1`,
    [token]
  );

  return result.rows[0] || null;
}

async function verifyRefreshToken(token) {
  const record = await findRefreshToken(token);

  if (!record) return null;

  const now = new Date();
  const expiresAt = new Date(record.expires_at);

  if (expiresAt < now) {
    // expired, delete it
    await revokeRefreshTokenById(record.id); // FIXED (was record.user_id)
    return null;
  }

  return record;
}

module.exports = {
  createRefreshToken,
  revokeRefreshTokenById,
  findRefreshToken,
  verifyRefreshToken,
};