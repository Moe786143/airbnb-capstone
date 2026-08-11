const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Sign a JWT for a given user id.
 * The payload deliberately carries only the id — everything else is looked
 * up fresh from the database on each request so a stale token can never
 * carry stale privileges.
 *
 * @param {string} id - the user's MongoDB _id
 * @returns {string} a signed JWT
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * POST /api/users/register
 * Public. Creates a new user account and returns a JWT so the client is
 * logged in immediately after signing up.
 *
 * Body: { username, password, role? }
 * Responses: 201 created | 400 validation error | 409 username taken | 500
 */
const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // --- Input validation ------------------------------------------------
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Both username and password are required' });
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res
        .status(400)
        .json({ message: 'username and password must be strings' });
    }
    if (username.trim().length < 3) {
      return res
        .status(400)
        .json({ message: 'Username must be at least 3 characters long' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }
    if (role && !['user', 'host'].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either 'user' or 'host'" });
    }

    // Reject duplicates up front so the client gets a clear 409 rather than
    // a raw Mongo duplicate-key error.
    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ message: 'That username is already taken' });
    }

    // The pre-save hook on the model hashes the password.
    const user = await User.create({
      username: username.trim(),
      password,
      role: role || 'user',
    });

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Mongoose validation errors are the client's fault, not the server's.
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: 'Server error while registering user', error: error.message });
  }
};

/**
 * POST /api/users/login
 * Public. Verifies credentials and returns a JWT.
 *
 * Body: { username, password }
 * Responses: 200 ok | 400 missing fields | 401 bad credentials | 500
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // --- Input validation ------------------------------------------------
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Both username and password are required' });
    }

    // `password` is `select: false` on the schema, so ask for it explicitly.
    const user = await User.findOne({ username: username.trim() }).select(
      '+password'
    );

    // Same message for "no such user" and "wrong password" so the endpoint
    // cannot be used to enumerate valid usernames.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error while logging in', error: error.message });
  }
};

/**
 * GET /api/users/me
 * Protected. Returns the profile of the currently authenticated user —
 * useful for restoring session state on a page refresh.
 *
 * Responses: 200 ok | 401 not authenticated | 500
 */
const getCurrentUser = async (req, res) => {
  try {
    // `protect` already loaded and validated the user document.
    return res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error while fetching profile', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };
