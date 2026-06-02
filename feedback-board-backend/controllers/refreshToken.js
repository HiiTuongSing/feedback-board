const {
  createRefreshToken,
  revokeRefreshTokenById,
  findRefreshToken,
} = require('../models/refreshToken');

const { createAccessToken } = require('../utils/jwt');

exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const stored = await findRefreshToken(token);

    if (!stored) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const now = new Date();
    const expiresAt = new Date(stored.expires_at);

    if (expiresAt < now) {
      await revokeRefreshTokenById(stored.id);
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    // IMPORTANT: you need a user lookup here
    const user = { id: stored.user_id, role: 'user' }; 
    // (better: query users table if role matters)

    await revokeRefreshTokenById(stored.id);

    const accessToken = createAccessToken({
      id: user.id,
      role: user.role,
    });

    const newRefreshToken = await createRefreshToken(
      user.id,
      stored.device_id
    );

    res.cookie('refreshToken', newRefreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};