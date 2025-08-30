const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_Secret || 'supersecretkey';

function createAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { createAccessToken, verifyAccessToken };