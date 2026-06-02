const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // const authHeader = req.cookies.accessToken;
  // const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
  const token = req.cookies.accessToken;

  if (!token) {
    return res.sendStatus(401).json({token}); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden (invalid or expired token)

    req.user = user; // attach decoded payload to request
    console.log('Authentication success!')
    next();
  });
}

module.exports = authenticateToken;