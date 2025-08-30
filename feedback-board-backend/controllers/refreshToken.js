const db = require('../db/index')
const { createRefreshToken, revokeRefreshTokenById, verifyRefreshToken } = require('../models/refreshToken')
const { createAccessToken } = require('../utils/jwt')

exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken
    if (!token) return res.status(401).json({ error: 'No refresh token provided' })

    const stored = await verifyRefreshToken(token)
    if (!stored) return res.status(403).json({ error: 'Invalid or expired refresh token' })
    
    await revokeRefreshTokenById(token)

    const accessToken = createAccessToken({ id: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id, deviceId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None', //change to Strict in production if on same site
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}
