const { createUser, getUserByUsername } = require('../models/users')
const { verifyPassword } = require('../utils/hash')
const { createAccessToken } = require('../utils/jwt')
const { createRefreshToken, revokeRefreshTokenById } = require('../models/refreshToken')

exports.registerUser = async(req, res) => {
  const { username, password, role } = req.body;
  if( !username || !password || !role ){
    return res.status(400).json({ error: 'Username, password & role are required!' })
  }

  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Role selected does not exist!' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=])[A-Za-z0-9!@#$%^&*()_\-+=]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.' 
    });
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists!' });
  }

  try{
    const registered = await createUser(username, password, role);
    res.status(201).json(registered);
  }catch(err){
    res.status(500).json({ error: 'Failed to register user.' });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { username, password, deviceId } = req.body;
    if (!username || !password || !deviceId){
      return res.status(400).json({ error: 'Username, password and device id are required!'})
    }

    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'Username not found!' });

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password!' });

    const accessToken = createAccessToken({ id: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id, deviceId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', //change to Strict in production if on same site
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', //change to Strict in production if on same site
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: 'Login successful', user: { id: user.id, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed.' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken
    if (!token) return res.status(401).json({ error: 'No refresh token provided' })

    const revokedCount = await revokeRefreshTokenById(token);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    return res.status(200).json({
      message: 'Logged out successfully.',
      revoked: revokedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Logout failed.' });
  }
};

exports.getUser = async(req, res) => {
  try{
    console.log(req.cookies);         // all cookies
    console.log(req.cookies.refreshToken); // specific
    const token = req.cookies.accessToken
    if (!token) {
      return res.status(401).json({ loggedIn: false })
    }
    res.json({ loggedIn: true })
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Fetch user failed.' });
  }
}
