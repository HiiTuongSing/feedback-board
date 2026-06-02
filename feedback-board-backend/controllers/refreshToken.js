const {
  createRefreshToken,
  revokeRefreshTokenById,
  findRefreshToken,
} = require('../models/refreshToken');

const { createAccessToken } = require('../utils/jwt');

exports.refreshAccessToken = async (req, res) => {
  try {
    console.log("🔄 REFRESH HIT");
    console.log("COOKIE:", req.cookies.refreshToken);

    const token = req.cookies.refreshToken;

    if (!token) {
      console.log("❌ NO REFRESH TOKEN RECEIVED");
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const stored = await findRefreshToken(token);

    console.log("DB RESULT:", stored);

    if (!stored) {
      console.log("❌ REFRESH TOKEN NOT FOUND IN DB");
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const now = new Date();
    const expiresAt = new Date(stored.expires_at);

    console.log("EXPIRES AT:", stored.expires_at);

    if (expiresAt < now) {
      console.log("❌ REFRESH TOKEN EXPIRED");

      await revokeRefreshTokenById(stored.id);

      return res.status(403).json({ error: 'Refresh token expired' });
    }

    // Fetch user (replace with real DB lookup if needed)
    const user = {
      id: stored.user_id,
      role: 'user',
    };

    // ===============================
    // 1. CREATE NEW TOKENS FIRST
    // ===============================
    const accessToken = createAccessToken({
      id: user.id,
      role: user.role,
    });

    const newRefreshToken = await createRefreshToken(
      user.id,
      stored.device_id
    );

    console.log("✅ NEW TOKENS GENERATED");

    // ===============================
    // 2. SET COOKIES
    // ===============================

    res.cookie('refreshToken', newRefreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // ===============================
    // 3. REVOKE OLD TOKEN LAST
    // ===============================
    await revokeRefreshTokenById(stored.id);

    return res.status(200).json({
      message: "Token refreshed successfully"
    });

  } catch (err) {
    console.error("🔥 REFRESH ERROR:", err);
    return res.status(500).json({ error: 'Server error' });
  }
};