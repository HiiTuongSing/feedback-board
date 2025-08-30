const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwt');
const { refreshAccessToken } = require('../controllers/refreshToken')
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser
} = require('../controllers/users');

router.get('/user', getUser)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);

module.exports = router;
